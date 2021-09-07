import Phaser from 'phaser'

import { audioManager } from '../audio_manager.js'

import { getSceneLayoutData } from '../game_data/layout.js'

import { RPSGameMode } from 'rps-game-engine'

const VSScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize: function () {
    Phaser.Scene.call(this, { key: 'VSScene' })
  },

  init: function (data) {
    this.gameInterface = data.gameInterface
    this.viewData = this.gameInterface.getGameViewData()
    this.p1Ready = false
    this.p2Ready = false
    this.unknownOpponent = null
    this.battleSceneStarted = false
  },

  create: function () {
    if (this.viewData.gameMode === RPSGameMode.SINGLE && this.gameInterface.gameSettings.bossFight) {
      audioManager.playMusic('bossMusic', true)
    } else {
      audioManager.playMusic('gameplayMusic')
    }
    this.layoutData = getSceneLayoutData('VSScene')

    this.add.image(
      this.layoutData.ui.background.x,
      this.layoutData.ui.background.y,
      'charSelectionBg'
    ).setOrigin(
      this.layoutData.ui.background.originX,
      this.layoutData.ui.background.originY
    ).setAlpha(
      0.3
    )

    const p1Layout = this.layoutData.graphics.p1
    this.p1CharacterImage = this.add.sprite(
      p1Layout.x - p1Layout.xTranslationDistance,
      p1Layout.y,
      'global_texture',
      ''
    ).setOrigin(
      p1Layout.originX,
      p1Layout.originY
    )

    const p1MaskShape = this.make.graphics()
    p1MaskShape.fillStyle(0xffffff)
    p1MaskShape.beginPath()
    p1MaskShape.fillPoints(p1Layout.mask, true, true)
    const p1Mask = p1MaskShape.createGeometryMask()
    this.p1CharacterImage.setMask(p1Mask)

    const p2Layout = this.layoutData.graphics.p2
    this.p2CharacterImage = this.add.sprite(
      p2Layout.x + p2Layout.xTranslationDistance,
      p2Layout.y,
      'global_texture',
      ''
    ).setOrigin(
      p2Layout.originX,
      p2Layout.originY
    )
    this.p2CharacterImage.flipX = true

    const p2MaskShape = this.make.graphics()
    p2MaskShape.fillStyle(0xffffff)
    p2MaskShape.beginPath()
    p2MaskShape.fillPoints(p2Layout.mask, true, true)
    const p2Mask = p2MaskShape.createGeometryMask()
    this.p2CharacterImage.setMask(p2Mask)

    this.add.image(
      this.layoutData.ui.background.x,
      this.layoutData.ui.background.y,
      'vsScreenTear'
    ).setOrigin(
      this.layoutData.ui.background.originX,
      this.layoutData.ui.background.originY
    )

    this.add.sprite(
      this.layoutData.ui.vsIcon.x,
      this.layoutData.ui.vsIcon.y,
      'global_texture',
      'vs'
    ).setOrigin(
      this.layoutData.ui.vsIcon.originX,
      this.layoutData.ui.vsIcon.originY
    )
  },

  update: function (time, delta) {
    // Handle case where a game is timed out while the host is waiting for an opponent
    if (this.viewData.interfaceErrors.length > 0) {
      const error = this.viewData.interfaceErrors.pop()
      if (error.action === 'reset-hard') {
        console.log(error.message)
        this.scene.start('MainMenuScene', {
          error: {
            title: 'Network Error',
            message: 'Unable to connect to Rock Paper Scissors Apocalypse game server. Please check your internet connection and try again.'
          }
        })
      }
    }

    if (!this.p1Ready && this.viewData.p1Spec != null) {
      this.p1CharacterImage.setFrame(this.viewData.p1Spec.id + '_upperbody')

      const p1Layout = this.layoutData.graphics.p1

      const txtP1Name = this.add.bitmapText(
        p1Layout.name.x - p1Layout.name.xTranslationDistance,
        p1Layout.name.y,
        p1Layout.name.bitmapFontId,
        this.viewData.p1Spec.displayName,
        p1Layout.name.fontSize
      ).setOrigin(
        p1Layout.name.originX,
        p1Layout.name.originY
      ).setTint(
        p1Layout.name.color
      ).setDropShadow(
        1, 1, 0x000000, 0.7
      )

      this.tweens.add({
        targets: this.p1CharacterImage,
        x: '+=' + p1Layout.xTranslationDistance,
        duration: p1Layout.xTranslationDuration,
        ease: 'Expo.easeOut'
      })

      this.tweens.add({
        targets: txtP1Name,
        x: '+=' + p1Layout.name.xTranslationDistance,
        duration: p1Layout.name.xTranslationDuration,
        ease: 'Expo.easeOut'
      })

      this.p1Ready = true
    }

    if (!this.p2Ready && this.viewData.p2Spec != null) {
      if (this.unknownOpponent) {
        // Opponent joined multi-player game, need to animate this out
        this.tweens.add({
          targets: this.unknownOpponent,
          x: '+=' + this.layoutData.graphics.unknownOpponent.xTranslationDistance,
          duration: this.layoutData.graphics.unknownOpponent.xTranslationDuration,
          ease: 'Expo.easeOut'
        })
      }

      const p2Layout = this.layoutData.graphics.p2
      this.p2CharacterImage.setFrame(this.viewData.p2Spec.id + '_upperbody')

      const txtP2Name = this.add.bitmapText(
        p2Layout.name.x + p2Layout.name.xTranslationDistance,
        p2Layout.name.y,
        p2Layout.name.bitmapFontId,
        this.viewData.p2Spec.displayName,
        p2Layout.name.fontSize
      ).setOrigin(
        p2Layout.name.originX,
        p2Layout.name.originY
      ).setTint(
        p2Layout.name.color
      ).setDropShadow(
        3, 3, 0x000000, 0.7
      )

      this.tweens.add({
        targets: this.p2CharacterImage,
        x: '-=' + p2Layout.xTranslationDistance,
        duration: p2Layout.xTranslationDuration,
        ease: 'Expo.easeOut'
      })

      this.tweens.add({
        targets: txtP2Name,
        x: '-=' + p2Layout.name.xTranslationDistance,
        duration: p2Layout.name.xTranslationDuration,
        ease: 'Expo.easeOut'
      })

      this.p2Ready = true
    } else if (!this.p2Ready && !this.unknownOpponent && this.viewData.gameMode === RPSGameMode.MULTI) {
      // Waiting for opponent in multiplayer game
      const unknownOpponentLayout = this.layoutData.graphics.unknownOpponent
      this.unknownOpponent = this.add.bitmapText(
        unknownOpponentLayout.x,
        unknownOpponentLayout.y,
        unknownOpponentLayout.bitmapFontId,
        'Waiting for an opponent...',
        unknownOpponentLayout.fontSize
      ).setOrigin(
        unknownOpponentLayout.originX,
        unknownOpponentLayout.originY
      ).setMaxWidth(
        unknownOpponentLayout.maxWidth
      ).setTint(
        unknownOpponentLayout.color
      )
      this.tweens.add({
        targets: this.unknownOpponent,
        alpha: 0.4,
        duration: 2500,
        repeat: -1,
        repeatDelay: 1000,
        yoyo: true
      })
    }

    if (this.p1Ready && this.p2Ready && !this.battleSceneStarted) {
      this.time.delayedCall(2500, this.startBattleScene, [], this)
      this.battleSceneStarted = true
    }

    // If our viewData has an active error state we may want to reset
    // right back to the main menu. This can happen when the P1 in a multi-player
    // game leaves abruptly - the P2 must go back to main menu
    if (this.viewData.errorState) {
      if (this.viewData.errorState.action === 'reset-hard') {
        console.log(this.errorState.message)
        this.scene.start('MainMenuScene')
      }
    }
  },

  startBattleScene: function () {
    console.log('Opening battle scene...')
    this.scene.start('BattleScene', { gameInterface: this.gameInterface })
  }

})

export { VSScene }
