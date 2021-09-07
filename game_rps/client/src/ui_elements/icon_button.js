import Phaser from 'phaser'

export class IconButton extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, texture, frame, toggleFrame, tint, callback, onHoverCallback) {
    super(scene, x, y, texture)
    this.baseFrame = frame
    this.toggleFrame = toggleFrame
    this.initialTint = tint
    this.setFrame(this.baseFrame)
    this.setTintFill(this.initialTint)

    this.onHoverCallback = onHoverCallback

    this.setInteractive({ useHandCursor: true })
      .on('pointerover', () => this.enterButtonHoverState())
      .on('pointerout', () => this.enterButtonRestState())
      .on('pointerdown', () => this.enterButtonActiveState())
      .on('pointerup', () => {
        this.enterButtonHoverState()
        if (this.toggleFrame) {
          if (this.frame.name === this.baseFrame) {
            this.setFrame(this.toggleFrame)
          } else {
            this.setFrame(this.baseFrame)
          }
        }
        callback()
      })
  }

  enterButtonHoverState () {
    this.setTintFill(0xFFFFFF)
    if (this.onHoverCallback != null) {
      this.onHoverCallback()
    }
  }

  enterButtonRestState () {
    this.setTintFill(this.initialTint)
  }

  enterButtonActiveState () {
    this.setTintFill(0x000000, 0xFF0000, 0X000000, 0xFF0000)
  }
}
