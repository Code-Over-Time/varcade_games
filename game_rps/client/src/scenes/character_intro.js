import Phaser from 'phaser'

import { audioManager } from '../audio_manager.js'

import { IconButton } from '../ui_elements/icon_button'

import { getSceneLayoutData } from '../game_data/layout.js'

class CharacterIntroScene extends Phaser.Scene {
  constructor () {
    super({ key: 'CharacterIntroScene' })
  }

  init (data) {
    this.gameInterface = data.gameInterface
    this.viewData = this.gameInterface.getGameViewData()

    this.clickCount = 0
  }

  create () {
    this.layoutData = getSceneLayoutData('CharacterIntroScene')

    const charNameLayout = this.layoutData.ui.characterName
    this.txtCharacterName = this.add.bitmapText(
      charNameLayout.x,
      charNameLayout.y,
      charNameLayout.bitmapFontId,
      this.viewData.p1Spec.displayName,
      charNameLayout.fontSize
    ).setOrigin(
      charNameLayout.originX, charNameLayout.originY
    ).setAlpha(0)

    const scrollingTextLayout = this.layoutData.ui.storyText
    this.txtStoryline = this.add.bitmapText(
      scrollingTextLayout.x,
      scrollingTextLayout.y,
      scrollingTextLayout.bitmapFontId,
      this.viewData.p1Spec.storyline,
      scrollingTextLayout.fontSize
    ).setOrigin(
      scrollingTextLayout.originX,
      scrollingTextLayout.originY
    ).setMaxWidth(
      scrollingTextLayout.maxWidth
    )

    this.twnName = this.tweens.add({
      targets: [this.txtCharacterName],
      alpha: 1,
      duration: 2300,
      yoyo: true,
      hold: 1000,
      onComplete: () => {
        this.twnStoryline = this.tweens.add({
          targets: [this.txtStoryline],
          y: -this.txtStoryline.getTextBounds().local.height,
          duration: scrollingTextLayout.scrollDuration,
          onComplete: () => {
            audioManager.stopMusic()
            this.scene.start('VSScene', { gameInterface: this.gameInterface })
          }
        })
      }
    })
    this.addSkipButton()

    // Courtesy to players - clicking three times will skip the lore
    this.input.on('pointerup', () => {
      this.clickCount++
      if (this.clickCount >= 3) {
        this.completeAllTweens()
      }
    })
  }

  addSkipButton () {
    const skipButtonLayout = this.layoutData.ui.skipButton

    this.add.existing(new IconButton(this,
      skipButtonLayout.x,
      skipButtonLayout.y,
      'global_texture',
      skipButtonLayout.icons.fastForwardIcon,
      null,
      0xFFFFFF,
      () => {
        this.completeAllTweens()
      }).setOrigin(
      skipButtonLayout.originX, skipButtonLayout.originY
    ).setScale(
      skipButtonLayout.scale
    )).setRotation(
      1.5
    )
  }

  completeAllTweens () {
    this.twnName.complete()
    this.twnStoryline.complete()
  }
}

export { CharacterIntroScene }
