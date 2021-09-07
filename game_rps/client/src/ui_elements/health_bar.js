export class HealthBar {
  constructor (scene, x, y, w, h, padding, maxHealth, direction) {
    this.scene = scene
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.padding = padding
    this.maxHealth = maxHealth
    this.currentValue = maxHealth
    this.direction = direction
    this.borderRect = null
    this.healthRect = null
  }

  addToScene () {
    if (this.healthRect) { // Already added to the scene
      return false
    }

    this.borderRect = this.scene.add.rectangle(
      this.x,
      this.y,
      this.w,
      this.h,
      0x000000
    ).setOrigin(
      0,
      0
    )

    const healthBarHeight = this.h - (this.padding * 2)
    let healthBarWidth = this.w - this.padding * 2
    let xPos = this.x + this.padding
    const yPos = this.y + this.padding
    if (this.direction === 'ltr') {
      xPos = this.x + this.w - this.padding
      healthBarWidth = healthBarWidth * -1
    }

    this.healthRect = this.scene.add.rectangle(
      xPos, yPos, healthBarWidth, healthBarHeight, 0xff0000 // Start health bar width at 0 so we can animate in
    ).setOrigin(
      0, 0
    ).setScale(
      0.0,
      1.0
    )

    this.tweenHealth()
    return true
  }

  updateHealth (latestValue) {
    // Check it has been added to the scene and don't add a tween unless something
    // actually changed - this is called on the update loop
    if (this.healthRect && latestValue !== this.currentValue) {
      this.currentValue = Math.max(0, latestValue)
      this.tweenHealth()
    }
  }

  reset () {
    this.currentValue = this.maxHealth
    this.tweenHealth()
  }

  tweenHealth () {
    this.scene.tweens.add({
      targets: this.healthRect,
      scaleX: this.currentValue / this.maxHealth,
      ease: 'Expo.easeOut',
      duration: 500
    })
  }
}
