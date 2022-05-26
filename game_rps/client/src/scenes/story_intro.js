import Phaser from 'phaser'

import { IconButton } from '../ui_elements/icon_button'

import { lore } from 'rps-game-engine'

import { getSceneLayoutData } from '../game_data/layout.js'

class StoryIntroScene extends Phaser.Scene {
  constructor () {
    super({ key: 'StoryIntroScene' })
  }

  init (data) {
    this.gameInterface = data.gameInterface
    this.clickCount = 0
  }

  create () {
    this.layoutData = getSceneLayoutData('StoryIntroScene')
    const scrollingTextLayout = this.layoutData.ui.storyText

    this.txtLore = this.add.bitmapText(
      scrollingTextLayout.x,
      scrollingTextLayout.y,
      scrollingTextLayout.bitmapFontId,
      lore.singlePlayerIntro,
      scrollingTextLayout.fontSize
    ).setOrigin(
      scrollingTextLayout.originX,
      scrollingTextLayout.originY
    ).setMaxWidth(
      scrollingTextLayout.maxWidth
    )

    this.loreTween = this.tweens.add({
      targets: [this.txtLore],
      y: -this.txtLore.getTextBounds().local.height,
      duration: scrollingTextLayout.scrollDuration,
      onComplete: () => {
        this.scene.start('CharacterSelectScene', { gameInterface: this.gameInterface })
      }
    })

    this.addSkipButton()

    // Courtesy to players - clicking three times will skip the lore
    this.input.on('pointerup', () => {
      this.clickCount++
      if (this.clickCount >= 3) {
        localStorage.setItem("skipLore", JSON.stringify({
            ...JSON.parse(localStorage.getItem("skipLore")), 
            rps: true
        }))
        this.loreTween.complete()
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
        localStorage.setItem("skipLore", JSON.stringify({
            ...JSON.parse(localStorage.getItem("skipLore")), 
            rps: true
        }))
        this.loreTween.complete()
      }).setOrigin(
      skipButtonLayout.originX, skipButtonLayout.originY
    ).setScale(
      skipButtonLayout.scale
    ).setRotation(
      1.5
    ))
  }
}

export { StoryIntroScene }
