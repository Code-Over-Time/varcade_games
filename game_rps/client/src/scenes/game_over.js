import Phaser from 'phaser'

import { audioManager } from '../audio_manager.js'

import { getSceneLayoutData } from '../game_data/layout.js'

import { getSaveGameData } from '../game_data/save_data.js'

import { TextButton } from '../ui_elements/text_button'

import { lore, credits } from 'rps-game-engine'

class GameOverScene extends Phaser.Scene {
  constructor () {
    super({ key: 'GameOverScene' })
  }

  init (data) {
    this.isWinner = data.isWinner
    this.bossFight = data.bossFight
    this.saveGameData = getSaveGameData()
  }

  create () {
    this.layoutData = getSceneLayoutData('GameOverScene')
    if (this.bossFight) {
      this.finalBossSequence()
    } else {
      this.gameOverSequence()
    }
  }

  gameOverSequence () {
    if (this.isWinner) {
      this.showVictory()
      audioManager.playMusic('gameplayMusic', true)
    } else {
      this.showDefeat()
      audioManager.stopMusic()
    }
  }

  finalBossSequence () {
    if (this.isWinner) {
      this.showCreditSequence('SAVIOUR!', lore.fullVictoryLore)
      audioManager.playMusic('gameplayMusic', true)
    } else {
      this.showDefeat()
    }
  }

  showVictory () {
    this.showCreditSequence('VICTORY', lore.basicVictoryLore)
  }

  showDefeat () {
    let headerText = 'GAME OVER'
    let bodyText = [
      'You have been defeated.\n',
      'The fate of humanity remains uncertain still...'
    ]

    if (this.isBossFight) {
      headerText = 'DEFEAT!'
      bodyText = [
        'You have literally single handedly',
        'ensured the torture, suffering, pain',
        'and eventual destruction of all humankind...'
      ]
    }

    const txtGameOver = this.add.bitmapText(
      this.layoutData.ui.header.x,
      this.layoutData.ui.header.y,
      this.layoutData.ui.header.bitmapFontId,
      headerText,
      this.layoutData.ui.header.fontSize
    ).setOrigin(
      this.layoutData.ui.header.originX,
      this.layoutData.ui.header.originY
    ).setMaxWidth(
      this.layoutData.ui.header.maxWidth
    )

    const txtDefeatMsg = this.add.bitmapText(
      this.layoutData.ui.body.x,
      this.layoutData.ui.body.y,
      this.layoutData.ui.body.bitmapFontId,
      bodyText,
      this.layoutData.ui.body.fontSize
    ).setOrigin(
      this.layoutData.ui.body.originX,
      this.layoutData.ui.body.originY
    ).setMaxWidth(
      this.layoutData.ui.body.maxWidth
    ).setAlpha(
      0
    )

    this.twnName = this.tweens.add({
      targets: [txtDefeatMsg],
      alpha: 1,
      duration: 5000
    })

    this.tweenTextColorRed(txtGameOver, () => this.showMainMenuButton())
  }

  showCreditSequence (header, lore) {
    const txtVictory = this.add.bitmapText(
      this.layoutData.ui.header.x,
      this.layoutData.ui.header.y,
      this.layoutData.ui.header.bitmapFontId,
      header,
      this.layoutData.ui.header.fontSize
    ).setOrigin(
      this.layoutData.ui.header.originX,
      this.layoutData.ui.header.originY
    ).setMaxWidth(
      this.layoutData.ui.header.maxWidth
    )

    const txtVictoryLore = this.add.bitmapText(
      this.layoutData.ui.body.x,
      this.layoutData.ui.body.y,
      this.layoutData.ui.body.bitmapFontId,
      lore,
      this.layoutData.ui.body.fontSize
    ).setOrigin(
      this.layoutData.ui.body.originX,
      this.layoutData.ui.body.originY
    ).setMaxWidth(
      this.layoutData.ui.body.maxWidth
    ).setAlpha(
      0
    )

    const txtCredits = this.add.bitmapText(
      this.layoutData.ui.credits.x,
      this.layoutData.ui.credits.y,
      this.layoutData.ui.credits.bitmapFontId,
      credits,
      this.layoutData.ui.credits.fontSize,
      22
    ).setOrigin(
      this.layoutData.ui.credits.originX,
      this.layoutData.ui.credits.originY
    ).setMaxWidth(
      this.layoutData.ui.credits.maxWidth
    ).setCenterAlign()

    this.twnName = this.tweens.add({
      targets: [txtVictoryLore],
      alpha: 1,
      duration: 3000,
      yoyo: true,
      hold: 3000,
      onComplete: () => {
        this.twnName = this.tweens.add({
          targets: [txtCredits, txtVictory],
          y: -txtCredits.getTextBounds().local.height,
          duration: 20000,
          onComplete: () => {
            this.showMainMenuButton()
          }
        })
      }
    })

    this.tweenTextColorRed(txtVictory)
  }

  showMainMenuButton () {
    const mainMenuButton = new TextButton(
      this,
      this.layoutData.ui.menuButton.x,
      this.layoutData.ui.menuButton.y,
      'Return to Main Menu',
      this.layoutData.ui.menuButton.bitmapFontId,
      this.layoutData.ui.menuButton.fontSize,
      this.layoutData.ui.menuButton.color,
      () => {
        this.scene.start('MainMenuScene')
      }
    ).setOrigin(
      this.layoutData.ui.menuButton.originX,
      this.layoutData.ui.menuButton.originY
    )
    this.add.existing(mainMenuButton)
  }

  tweenTextColorRed (txtEntity, onCompleteCallback) {
    this.tweens.addCounter({
      from: 255,
      to: 0,
      duration: 5000,
      onUpdate: function (tween) {
        const value = Math.floor(tween.getValue())
        txtEntity.setTint(Phaser.Display.Color.GetColor(255, value, value))
      },
      onComplete: onCompleteCallback
    })
  }
}

export { GameOverScene }
