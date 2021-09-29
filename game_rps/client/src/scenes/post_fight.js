import Phaser from 'phaser'

import { TextButton } from '../ui_elements/text_button'
import { getSceneLayoutData } from '../game_data/layout.js'

import { SinglePlayerGame } from '../game_engine_interface.js'
import { RPSGameMode, getBossCharacterId } from 'rps-game-engine'

import { getSaveGameData, writeSaveGameData } from '../game_data/save_data.js'

class PostFightScene extends Phaser.Scene {
  constructor () {
    super({ key: 'PostFightScene' })
    this.sceneChangeDelay = 5000
  }

  init (data) {
    this.gameInterface = data.gameInterface
    this.viewData = this.gameInterface.getGameViewData()
    this.saveGameData = getSaveGameData()
  }

  create () {
    this.layoutData = getSceneLayoutData('PostFightScene')

    this.add.image(
      this.layoutData.ui.background.x,
      this.layoutData.ui.background.y,
      'charSelectionBg'
    ).setOrigin(
      this.layoutData.ui.background.originX,
      this.layoutData.ui.background.originY
    ).setAlpha(
      0.5
    )

    this.p1Wins = (
      this.viewData.winnerId === this.viewData.activePlayerId &&
      this.viewData.activePlayerId === this.viewData.p1Id
    )
    const containerLayout = this.layoutData.ui.containers

    // P1
    const p1TextureId = this.p1Wins
      ? `${this.viewData.p1Spec.id}_win`
      : `${this.viewData.p1Spec.id}_defeat`
    const p1Layout = this.layoutData.ui.p1

    const graphics = this.add.graphics()
    graphics.fillStyle(
      this.p1Wins ? containerLayout.winTint : containerLayout.loseTint,
      this.p1Wins ? containerLayout.winAlpha : containerLayout.loseAlpha
    )
    graphics.fillRoundedRect(
      p1Layout.container.x,
      p1Layout.container.y,
      p1Layout.container.width,
      p1Layout.container.height,
      p1Layout.container.cornerRadius
    )

    this.add.sprite(
      p1Layout.x,
      p1Layout.y,
      'global_texture',
      p1TextureId
    ).setOrigin(
      p1Layout.originX,
      p1Layout.originY
    )

    this.txtP1TrashTalk = this.add.bitmapText(
      p1Layout.trashTalk.x,
      p1Layout.trashTalk.y,
      p1Layout.trashTalk.bitmapFontId,
      '',
      p1Layout.trashTalk.fontSize
    ).setOrigin(
      p1Layout.trashTalk.originX,
      p1Layout.trashTalk.originY
    ).setMaxWidth(
      p1Layout.trashTalk.maxWidth
    )

    // P2
    const p2TextureId = !this.p1Wins
      ? `${this.viewData.p2Spec.id}_win`
      : `${this.viewData.p2Spec.id}_defeat`
    const p2Layout = this.layoutData.ui.p2

    const p2Container = this.add.graphics()
    p2Container.fillStyle(
      !this.p1Wins ? containerLayout.winTint : containerLayout.loseTint,
      !this.p1Wins ? containerLayout.winAlpha : containerLayout.loseAlpha
    )
    p2Container.fillRoundedRect(
      p2Layout.container.x,
      p2Layout.container.y,
      p2Layout.container.width,
      p2Layout.container.height,
      p2Layout.container.cornerRadius
    )

    const p2Char = this.add.sprite(
      p2Layout.x,
      p2Layout.y,
      'global_texture',
      p2TextureId
    ).setOrigin(
      p2Layout.originX,
      p2Layout.originY
    )
    p2Char.flipX = true

    this.txtP2TrashTalk = this.add.bitmapText(
      p2Layout.trashTalk.x,
      p2Layout.trashTalk.y,
      p2Layout.trashTalk.bitmapFontId,
      '',
      p2Layout.trashTalk.fontSize
    ).setOrigin(
      p2Layout.trashTalk.originX,
      p2Layout.trashTalk.originY
    ).setMaxWidth(
      p2Layout.trashTalk.maxWidth
    )

    const winnerName = this.p1Wins ? this.viewData.p1Spec.displayName : this.viewData.p2Spec.displayName
    const winnerText = `${winnerName} Wins!`
    this.txtHeader = this.add.bitmapText(
      this.layoutData.ui.header.x,
      this.layoutData.ui.header.y,
      this.layoutData.ui.header.bitmapFontId,
      winnerText,
      this.layoutData.ui.header.fontSize
    ).setOrigin(
      this.layoutData.ui.header.originX,
      this.layoutData.ui.header.originY
    ).setTint(
      this.layoutData.ui.header.color
    )

    if (this.viewData.gameMode === RPSGameMode.SINGLE) {
      this.handleSinglePlayer()
    } else {
      this.handleMultiPlayer()
    }
  }

  handleMultiPlayer () {
    if (this.p1Wins) {
      this.showP1Victory()
    } else {
      this.showP2Victory()
    }
    this.showMainMenuButton()
  }

  handleSinglePlayer () {
    if (this.p1Wins) {
      this.showP1Victory()
      // Check if we have reached the end of the list of opponents for this fighter
      if (this.gameInterface.gameState.sequence + 1 >= this.viewData.p1Spec.singlePlayerSequence.length) {
        // We might have a character unlock to process
        let characterToUnlock = this.viewData.p1Spec.singlePlayerUnlock

        if (this.gameInterface.gameState.isBossFight) {
          characterToUnlock = getBossCharacterId()
        }

        if (characterToUnlock && this.saveGameData.characterUnlocks.indexOf(characterToUnlock) === -1) {
          this.showCharacterUnlockNotification()
          console.log('Unlocking new character! ' + characterToUnlock)
          this.saveGameData.characterUnlocks.push(characterToUnlock)
          writeSaveGameData()
        }

        // Only trigger the boss fight if the player did not lose a single round through all opponents
        if (!this.gameInterface.gameState.isBossFight && this.gameInterface.gameState.undefeated) {
          this.timerEvent = this.scheduleNextBattle(true)
        } else {
          this.scheduleGameOverScene(true)
        }
      } else {
        this.timerEvent = this.scheduleNextBattle(false)
      }
    } else {
      this.showP2Victory()
      this.scheduleGameOverScene(false)
    }
  }

  scheduleNextBattle (isBossFight) {
    return this.time.delayedCall(this.sceneChangeDelay, () => {
      const newGameState = Object.assign({}, this.gameInterface.gameState)
      newGameState.sequence++
      newGameState.isBossFight = !!isBossFight

      const nextGame = new SinglePlayerGame(this.gameInterface.gameSettings, newGameState)
      nextGame.selectFighter(this.viewData.p1Spec, () => {
        this.scene.start('VSScene', { gameInterface: nextGame })
      })
    })
  }

  showP2Victory () {
    this.txtP1TrashTalk.setText(this.viewData.p1Spec.trashTalk.lose[0])
    this.txtP2TrashTalk.setText(this.viewData.p2Spec.trashTalk.win[0])
  }

  showP1Victory () {
    this.txtP1TrashTalk.setText(this.viewData.p1Spec.trashTalk.win[0])
    this.txtP2TrashTalk.setText(this.viewData.p2Spec.trashTalk.lose[0])
  }

  showMainMenuButton () {
    const menuBtnLayout = this.layoutData.ui.mainMenu
    const mainMenuButton = new TextButton(
      this,
      menuBtnLayout.x,
      menuBtnLayout.y,
      'Return to Main Menu',
      menuBtnLayout.bitmapFontId,
      menuBtnLayout.fontSize,
      menuBtnLayout.color,
      () => {
        this.scene.start('MainMenuScene')
      }
    ).setOrigin(
      menuBtnLayout.originX,
      menuBtnLayout.originY
    )
    this.add.existing(mainMenuButton)
  }

  scheduleGameOverScene (isWinner) {
    this.timerEvent = this.time.delayedCall(this.sceneChangeDelay, () => {
      this.scene.start('GameOverScene', {
        isWinner: isWinner,
        bossFight: this.gameInterface.gameSettings.isBossFight
      })
    })
  }

  showCharacterUnlockNotification () {
    const charUnlockLayout = this.layoutData.ui.characterUnlock
    this.add.bitmapText(
      charUnlockLayout.x,
      charUnlockLayout.y,
      charUnlockLayout.bitmapFontId,
      '** NEW CHARACTER UNLOCKED **',
      charUnlockLayout.fontSize
    ).setOrigin(
      charUnlockLayout.originX,
      charUnlockLayout.originY
    ).setTint(
      charUnlockLayout.color
    )
  }
}

export { PostFightScene }
