import Phaser from 'phaser'

export class TextButton extends Phaser.GameObjects.BitmapText {
  constructor (scene, x, y, text, font, fontSize, tint, callback, onHoverCallback) {
    super(scene, x, y, font, text, fontSize)

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.enterButtonHoverState())
      .on('pointerout', () => this.enterButtonRestState())
      .on('pointerdown', () => this.enterButtonActiveState())
      .on('pointerup', () => {
        if (this.enabled) {
          this.enterButtonHoverState()
          callback()
        }
      })
    this.initialTint = tint
    this.setTint(this.initialTint)
    this.onHoverCallback = onHoverCallback
    this.enabled = true
  }

  enterButtonHoverState () {
    if (this.enabled) {
      this.setTint(0xFFFFFF)
      if (this.onHoverCallback != null) {
        this.onHoverCallback()
      }
    }
  }

  enterButtonRestState () {
    if (this.enabled) {
      this.setTint(this.initialTint)
    }
  }

  enterButtonActiveState () {
    if (this.enabled) {
      this.setTint(0x000000, 0xFF0000, 0X000000, 0xFF0000)
    }
  }
}
