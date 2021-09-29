import Phaser from 'phaser'

import { audioManager } from '../audio_manager.js'

import { IconButton } from '../ui_elements/icon_button'

import { RPSRoundStates, RPSRoundEvent, RPSGameEvent } from 'rps-game-engine'
import { HealthBar } from '../ui_elements/health_bar'
import { getSceneLayoutData } from '../game_data/layout.js'

class BattleScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BattleScene' })
  }

  init (data) {
    this.gameInterface = data.gameInterface
    this.viewData = this.gameInterface.getGameViewData()
  }

  create () {
    this.layoutData = getSceneLayoutData('BattleScene')

    this.background = this.add.sprite(
      this.layoutData.ui.background.x,
      this.layoutData.ui.background.y,
      this.viewData.p2Spec.id + '_battle', // Always fight in opponents location
      this.viewData.p2Spec.id + '_bg'
    ).setOrigin(
      this.layoutData.ui.background.originX,
      this.layoutData.ui.background.originY
    )

    const p1Graphics = this.layoutData.graphics.p1
    this.p1Char = this.add.sprite(
      p1Graphics.x - p1Graphics.xTranslationDistance,
      p1Graphics.y,
      this.viewData.p1Spec.id + '_battle',
      this.viewData.p1Spec.id + '_side'
    ).setOrigin(
      p1Graphics.originX,
      p1Graphics.originY
    ).setScale(
      p1Graphics.scale
    )

    this.tweens.add({
      targets: [this.p1Char],
      x: '+=' + p1Graphics.xTranslationDistance,
      duration: p1Graphics.xTranslationDuration,
      ease: p1Graphics.xTranslationEase
    })

    const p2Graphics = this.layoutData.graphics.p2
    this.p2Char = this.add.sprite(
      p2Graphics.x + p2Graphics.xTranslationDistance,
      p2Graphics.y,
      this.viewData.p2Spec.id + '_battle',
      this.viewData.p2Spec.id + '_side'
    ).setOrigin(
      p2Graphics.originX,
      p2Graphics.originY
    ).setScale(
      p2Graphics.scale
    )
    this.tweens.add({
      targets: [this.p2Char],
      x: '-=' + p2Graphics.xTranslationDistance,
      duration: p2Graphics.xTranslationDuration,
      ease: p2Graphics.xTranslationEase
    })
    this.p2Char.flipX = true

    const p1Layout = this.layoutData.ui.p1
    const p2Layout = this.layoutData.ui.p2

    // NAMES
    this.add.bitmapText(
      p1Layout.name.x,
      p1Layout.name.y,
      p1Layout.name.bitmapFontId,
      this.viewData.p1DisplayName,
      p1Layout.name.fontSize
    ).setOrigin(
      p1Layout.name.originX,
      p1Layout.name.originY
    )

    this.add.bitmapText(
      p2Layout.name.x,
      p2Layout.name.y,
      p2Layout.name.bitmapFontId,
      this.viewData.p2DisplayName,
      p2Layout.name.fontSize
    ).setOrigin(
      p2Layout.name.originX,
      p2Layout.name.originY
    )

    // HEALTH BARS
    this.p1HealthBar = new HealthBar(
      this,
      p1Layout.healthbar.x,
      p1Layout.healthbar.y,
      p1Layout.healthbar.w,
      p1Layout.healthbar.h,
      p1Layout.healthbar.padding,
      this.viewData.p1Spec.stats.health,
      p1Layout.healthbar.direction
    )

    this.p2HealthBar = new HealthBar(
      this,
      p2Layout.healthbar.x,
      p2Layout.healthbar.y,
      p2Layout.healthbar.w,
      p2Layout.healthbar.h,
      p2Layout.healthbar.padding,
      this.viewData.p2Spec.stats.health,
      p2Layout.healthbar.direction
    )

    // Round win indicators
    this.p1WinIndicators = this.addWinIndicators(p1Layout.winIndicators, this.viewData.p1Spec)
    this.p2WinIndicators = this.addWinIndicators(p2Layout.winIndicators, this.viewData.p2Spec)

    // Round countdown UI
    this.roundCountdownGroup = this.addRoundLifecycleUI()

    // Weapon select UI
    this.weaponCountdownGroup = this.addWeaponSelectLifecycleUI()

    // Pre-add the weapon selections, can update textures later

    // Note: x values are offset slightly due to visual artifact that appears when set to 0
    // (You can see a part of the green box that shows when a texture is missing in the corners)
    this.imgP1WeaponChoice = this.add.sprite(
      -2, 640, this.viewData.p1Spec.id + '_battle', ''
    ).setOrigin(
      0,
      1.0
    ).setRotation(
      -1.5
    ).setDepth(
      200
    )
    this.imgP2WeaponChoice = this.add.sprite(
      962, 640, this.viewData.p2Spec.id + '_battle', ''
    ).setOrigin(
      1.0,
      1.0
    ).setRotation(
      1.5
    ).setDepth(
      200
    )
    this.imgP2WeaponChoice.flipX = true

    // A transparent mask for when large weapons are displayed, helps the art 'pop'
    this.weaponDisplayOverlay = this.add.graphics()
    this.weaponDisplayOverlay.fillStyle(0x000000)
    this.weaponDisplayOverlay.fillRect(
      0,
      0,
      960,
      640
    ).setDepth(
      100
    ).setAlpha(
      0
    )

    // Prepare handlers for different game states
    this.initStateHandlers()

    // Start game engine

    this.gameInterface.addEventListener((event) => this.gameEventListener(event))

    // Server will start and tick the game engine in a multi-player game
    this.gameInterface.startGame()

    // Pause button
    this.add.existing(new IconButton(
      this,
      900,
      590,
      'global_texture',
      'pause',
      'pause',
      0xFFFFFF, () => {
        this.gameInterface.togglePause()
      }
    ).setOrigin(
      0,
      0
    ))
  }

  update (time, delta) {
    this.p1HealthBar.updateHealth(this.viewData.p1CurrentHealth)
    this.p2HealthBar.updateHealth(this.viewData.p2CurrentHealth)

    // Multi-player lost connection handling
    // If P1 drops we reset back to main menu, if P2 drops
    // we send P1 back to the character select screen to wait
    // for a new opponent
    if (this.viewData.interfaceErrors.length > 0) {
      const error = this.viewData.interfaceErrors.pop()
      if (error.action === 'reset-hard') {
        console.log(error.message)
        this.leaveScene('MainMenuScene', null)
      } else if (error.action === 'reset-soft') {
        console.log(error.message)
        this.gameInterface.softResetGameState()
        this.leaveScene('VSScene', { gameInterface: this.gameInterface })
      }
    }
  }

  selectWeapon (selectedImage, index) {
    if (this.currentlySelectedImage != null) {
      this.currentlySelectedImage.setScale(1, 1)
    }
    this.currentlySelectedImage = selectedImage
    selectedImage.setScale(1.5, 1.5)
    this.gameInterface.selectWeapon(index)
  }

  /*
        EVENT HANDLING
  */

  gameEventListener (event) {
    if (event instanceof RPSRoundEvent) {
      switch (event.type) {
        case RPSRoundEvent.ROUND_COUNTDOWN:
          this.handleRoundCountdownEvent(event)
          break
        case RPSRoundEvent.WEAPON_COUNTDOWN:
          this.handleWeaponCountdownEvent(event)
          break
        case RPSRoundEvent.STATE_CHANGE:
          this.handleStateChangeEvent(event)
          break
        case RPSRoundEvent.WEAPONS_SELECTED:
          this.handleBattleEvent(event)
          break
        case RPSRoundEvent.ROUND_FINISHED:
          this.handleRoundEnd(event)
          break
        case RPSRoundEvent.ROUND_STARTED:
          break
        default:
          console.log('Got unknown round event type: ' + event.type)
          break
      }
    } else if (event instanceof RPSGameEvent) {
      switch (event.type) {
        case RPSGameEvent.GAME_COMPLETE:
          this.leaveScene('PostFightScene', { gameInterface: this.gameInterface })
          break
        default:
          console.log('Got unknown game event type: ' + event.type)
          break
      }
    }
  }

  leaveScene (targetScene, data) {
    // Need to unload these textures because the next
    // time we enter this scene we will likely have
    // new characters, and Phaser keeps already loaded
    // textures in its cache
    console.log('Cleaning up fight scene...')
    this.textures.removeKey('arenaBg')
    console.log('Fight scene cleaned up.')
    this.scene.start(targetScene, data)
    // this.scene.remove()
  }

  handleRoundCountdownEvent (event) {
    if (event.data.value === 2) {
      this.txtRoundCountdown.setScale(0, 0)
      this.txtRoundCountdown.setText('Get Ready!')

      this.tweens.add({
        targets: this.txtRoundCountdown,
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 500,
        ease: 'Expo.easeOut'
      })

      this.p1HealthBar.addToScene()
      this.p2HealthBar.addToScene()

      // Trigger zoom in of the battle scene

      const graphicsLayout = this.layoutData.graphics
      this.tweens.add({
        targets: [this.p1Char, this.p2Char],
        scale: graphicsLayout.characterZoomScale,
        duration: graphicsLayout.zoomDuration,
        ease: 'Expo.easeOut'
      })

      this.tweens.add({
        targets: this.background,
        scale: graphicsLayout.bgZoomScale,
        alpha: graphicsLayout.bgZoomAlpha,
        duration: graphicsLayout.zoomDuration,
        ease: 'Expo.easeOut'
      })

      this.tweens.add({
        targets: this.p1Char,
        x: graphicsLayout.p1.zoom.x - graphicsLayout.characterSpecificOffsets[this.viewData.p1Spec.id].xZoomed,
        y: graphicsLayout.p1.zoom.y + graphicsLayout.characterSpecificOffsets[this.viewData.p1Spec.id].yZoomed,
        duration: graphicsLayout.zoomDuration,
        ease: 'Expo.easeOut'
      })

      this.tweens.add({
        targets: this.p2Char,
        x: graphicsLayout.p2.zoom.x + graphicsLayout.characterSpecificOffsets[this.viewData.p2Spec.id].xZoomed,
        y: graphicsLayout.p2.zoom.y + graphicsLayout.characterSpecificOffsets[this.viewData.p2Spec.id].yZoomed,
        duration: graphicsLayout.zoomDuration,
        ease: 'Expo.easeOut'
      })
    }
  }

  handleWeaponCountdownEvent (event) {
    this.txtWeaponCountdown.setScale(0, 0)
    this.txtWeaponCountdown.setText(event.data.value)

    // TODO: Configure this based on countdown step duration
    // (ie. should be shorter duration than the total time between events)
    this.tweens.add({
      targets: this.txtWeaponCountdown,
      scaleX: 1.0,
      scaleY: 1.0,
      duration: 450,
      ease: 'Expo.easeOut'
    })
    audioManager.playEffect('beep')
  }

  handleBattleEvent (event) {
    const attackSummary = event.data.attackSummary

    // If format of texture is <char_id>_r, <char_id>_p etc...
    // Weapon ID is rock, paper etc... - so just take first
    // letter to construct texture id
    const p1Selection = this.viewData.p1Spec.id + '_' + attackSummary.p1Selection.weaponId[0]
    const p2Selection = this.viewData.p2Spec.id + '_' + attackSummary.p2Selection.weaponId[0]

    this.imgP1WeaponChoice.setFrame(p1Selection)
    this.tweens.add({
      targets: this.imgP1WeaponChoice,
      rotation: 0,
      duration: 100,
      ease: 'Expo.easeOut'
    })

    this.imgP2WeaponChoice.setFrame(p2Selection)
    this.tweens.add({
      targets: this.imgP2WeaponChoice,
      rotation: 0,
      duration: 100,
      ease: 'Expo.easeOut'
    })

    this.tweens.add({
      targets: this.weaponDisplayOverlay,
      alpha: 0.5,
      duration: 100,
      ease: 'Expo.easeOut'
    })

    audioManager.playEffect('punch')
  }

  handleRoundEnd (event) {
    const roundWinnerName = event.data.roundWinnerId === this.viewData.p1Id
      ? this.viewData.p1DisplayName
      : this.viewData.p2DisplayName

    this.txtRoundWinnerName.setText(roundWinnerName)
    this.txtRoundWinnerName.setVisible(true)
    this.txtRoundWinText.setVisible(true)

    let children = null
    if (event.data.roundWinnerId === this.viewData.p1Id) {
      children = this.p1WinIndicators.getChildren()
    } else if (event.data.roundWinnerId === this.viewData.p2Id) {
      children = this.p2WinIndicators.getChildren()
    }
    children.every((child) => {
      if (!child.visible) {
        child.setVisible(true)
        return false
      }
      return true
    })
  }

  /*
        STATE MANAGEMENT
  */
  handleStateChangeEvent (event) {
    this.stateHandlerMap[event.data.oldState].onExit()
    this.stateHandlerMap[event.data.newState].onEnter()
  }

  initStateHandlers () {
    this.stateHandlerMap = {}

    this.stateHandlerMap[RPSRoundStates.NEW_ROUND] = {
      onEnter: () => {
      },
      onExit: () => {
      }
    }

    this.stateHandlerMap[RPSRoundStates.COUNTDOWN] = {
      onEnter: () => {
        this.setRoundCountdownGroupVisible(true)
        this.txtRoundCountdownHeader.setText('Round ' + this.viewData.currentRound)
        this.txtRoundCountdownHeader.setScale(0, 0)
        this.tweens.add({
          targets: this.txtRoundCountdownHeader,
          scaleX: 1.0,
          scaleY: 1.0,
          duration: 450,
          ease: 'Expo.easeOut'
        })

        this.txtRoundCountdown.setText('')
        this.txtRoundWinnerName.setVisible(false)
        this.txtRoundWinText.setVisible(false)
      },
      onExit: () => {
        this.setRoundCountdownGroupVisible(false)
      }
    }

    this.stateHandlerMap[RPSRoundStates.WAITING_FOR_WEAPON_SELECTION] = {
      onEnter: () => {
        if (this.currentlySelectedImage != null) {
          this.currentlySelectedImage.setScale(1, 1)
        }
        this.txtWeaponCountdown.setText('')
        this.setWeaponCountdownGroupVisible(true)
      },
      onExit: () => {
        this.setWeaponCountdownGroupVisible(false)
      }
    }

    this.stateHandlerMap[RPSRoundStates.PROCESSING_RESULT] = {
      onEnter: () => {
      },
      onExit: () => {
        this.tweens.add({
          targets: this.imgP1WeaponChoice,
          rotation: -1.5,
          duration: 1000,
          ease: 'Expo.easeOut'
        })
        this.tweens.add({
          targets: this.imgP2WeaponChoice,
          rotation: 1.5,
          duration: 1000,
          ease: 'Expo.easeOut'
        })
        this.tweens.add({
          targets: this.weaponDisplayOverlay,
          alpha: 0,
          duration: 100,
          ease: 'Expo.easeOut'
        })
      }
    }

    this.stateHandlerMap[RPSRoundStates.FINISHED] = {
      onEnter: () => {
        this.txtRoundWinnerName.setVisible(true)
        this.txtRoundWinText.setVisible(true)
      },
      onExit: () => {

      }
    }
  }

  /*
        UTILITIES
  */
  setRoundCountdownGroupVisible (visible) {
    const children = this.roundCountdownGroup.getChildren()
    children.forEach((child) => {
      child.setVisible(visible)
    })
  }

  setWeaponCountdownGroupVisible (visible) {
    const children = this.weaponCountdownGroup.getChildren()
    children.forEach((child) => {
      child.setVisible(visible)
    })
  }

  addWinIndicators (layoutData, characterData) {
    const winIndicators = []

    // First Win
    winIndicators.push(this.add.sprite(
      layoutData.x,
      layoutData.y,
      'global_texture',
      characterData.stats.style + '_ico'
    ).setVisible(
      false
    ).setOrigin(
      layoutData.originX,
      layoutData.originY
    ).setScale(
      layoutData.scale
    ).setRotation(
      layoutData.rotation
    ).setTint(
      layoutData.tint
    ))

    // Second Win
    winIndicators.push(this.add.sprite(
      layoutData.x - layoutData.paddingLeft + layoutData.paddingRight,
      layoutData.y,
      'global_texture',
      characterData.stats.style + '_ico'
    ).setVisible(
      false
    ).setOrigin(
      layoutData.originX,
      layoutData.originY
    ).setScale(
      layoutData.scale
    ).setRotation(
      layoutData.rotation
    ).setTint(
      layoutData.tint
    ))

    return this.add.group(winIndicators)
  }

  addRoundLifecycleUI () {
    const roundLayout = this.layoutData.ui.roundLifecycle
    // Start of round
    this.txtRoundCountdownHeader = this.add.bitmapText(
      roundLayout.header.x,
      roundLayout.header.y,
      roundLayout.header.bitmapFontId,
      '',
      roundLayout.header.fontSize
    ).setOrigin(
      roundLayout.header.originX,
      roundLayout.header.originY
    ).setVisible(
      false
    ).setTint(
      roundLayout.header.color
    )

    this.txtRoundCountdown = this.add.bitmapText(
      roundLayout.count.x,
      roundLayout.count.y,
      roundLayout.count.bitmapFontId,
      '',
      roundLayout.count.fontSize
    ).setOrigin(
      roundLayout.count.originX,
      roundLayout.count.originY
    ).setVisible(
      false
    ).setTint(
      roundLayout.count.color
    )

    // End of round
    this.txtRoundWinnerName = this.add.bitmapText(
      roundLayout.roundEndMessage.header.x,
      roundLayout.roundEndMessage.header.y,
      roundLayout.roundEndMessage.header.bitmapFontId,
      '',
      roundLayout.roundEndMessage.header.fontSize
    ).setOrigin(
      roundLayout.roundEndMessage.header.originX,
      roundLayout.roundEndMessage.header.originY
    ).setVisible(
      false
    )

    this.txtRoundWinText = this.add.bitmapText(
      roundLayout.roundEndMessage.body.x,
      roundLayout.roundEndMessage.body.y,
      roundLayout.roundEndMessage.body.bitmapFontId,
      'WINS!',
      roundLayout.roundEndMessage.body.fontSize
    ).setOrigin(
      roundLayout.roundEndMessage.body.originX,
      roundLayout.roundEndMessage.body.originY
    ).setVisible(
      false
    )

    return this.add.group([
      this.txtRoundCountdownHeader,
      this.txtRoundCountdown
    ])
  }

  addWeaponSelectLifecycleUI () {
    const weaponLayout = this.layoutData.ui.weaponSelectLifecycle
    // Weapon countdown UI
    this.txtWeaponCountdownHeader = this.add.bitmapText(
      weaponLayout.header.x,
      weaponLayout.header.y,
      weaponLayout.header.bitmapFontId,
      'Choose Your Weapon!',
      weaponLayout.header.fontSize
    ).setOrigin(
      weaponLayout.header.originX,
      weaponLayout.header.originY
    ).setVisible(
      false
    ).setTint(
      weaponLayout.header.color
    )

    this.txtWeaponCountdown = this.add.bitmapText(
      weaponLayout.count.x,
      weaponLayout.count.y,
      weaponLayout.count.bitmapFontId,
      '3',
      weaponLayout.count.fontSize
    ).setOrigin(
      weaponLayout.count.originX,
      weaponLayout.count.originY
    ).setVisible(
      false
    ).setTint(
      weaponLayout.count.color
    )

    const imgRockSelect = this.add.image(
      weaponLayout.rockSelect.x,
      weaponLayout.rockSelect.y,
      'global_texture',
      this.viewData.p1Spec.id + '_r'
    ).setOrigin(
      weaponLayout.rockSelect.originX,
      weaponLayout.rockSelect.originY
    ).setVisible(
      false
    ).setInteractive(
      { useHandCursor: true }
    ).on(
      'pointerdown', () => this.selectWeapon(imgRockSelect, 0)
    )

    const imgPaperSelect = this.add.image(
      weaponLayout.paperSelect.x,
      weaponLayout.paperSelect.y,
      'global_texture',
      this.viewData.p1Spec.id + '_p'
    ).setOrigin(
      weaponLayout.paperSelect.originX,
      weaponLayout.paperSelect.originY
    ).setVisible(
      false
    ).setInteractive(
      { useHandCursor: true }
    ).on(
      'pointerdown', () => this.selectWeapon(imgPaperSelect, 1)
    )

    const imgScissorsSelect = this.add.image(
      weaponLayout.scissorsSelect.x,
      weaponLayout.scissorsSelect.y,
      'global_texture',
      this.viewData.p1Spec.id + '_s'
    ).setOrigin(
      weaponLayout.scissorsSelect.originX,
      weaponLayout.scissorsSelect.originY
    ).setVisible(
      false
    ).setInteractive(
      { useHandCursor: true }
    ).on(
      'pointerdown', () => this.selectWeapon(imgScissorsSelect, 2)
    )

    return this.add.group([
      this.txtWeaponCountdownHeader,
      this.txtWeaponCountdown,
      imgRockSelect,
      imgPaperSelect,
      imgScissorsSelect
    ])
  }
}

export { BattleScene }
