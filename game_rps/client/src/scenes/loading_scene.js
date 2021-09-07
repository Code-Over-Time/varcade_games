import Phaser from 'phaser'

import { gameConfig } from '../game_data/config.js'
import { characters } from 'rps-game-engine'

import { getSceneLayoutData } from '../game_data/layout.js'

const LoadingScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize: function () {
    Phaser.Scene.call(this, { key: 'LoadingScene' })
  },

  preload: function () {
    console.log('Loading assets...')
    this.load.setBaseURL(gameConfig.baseURL)

    const assetList = this.cache.json.get('assetList')

    for (const [key, sceneEntry] of Object.entries(assetList.sceneAssets)) {
      console.log(`Loading '${key}' assets...`)

      if (sceneEntry.packed_textures) {
        for (const [key, value] of Object.entries(sceneEntry.packed_textures)) {
          console.log(`Loading packed texture sheet ${key}: ${value}`)

          if (key.indexOf('{characterId}') !== -1) {
            for (let i = 0; i < characters.length; i++) {
              const character = characters[i]
              const jsonData = require(
                `../assets/packed_textures/${value.replace('{characterId}', character.id)}.json`
              )
              jsonData.textures[0].image = require(
                `../assets/packed_textures/${value.replace('{characterId}', character.id)}.png`
              )
              this.load.multiatlas(
                key.replace('{characterId}', character.id), jsonData
              )
            }
          } else {
            const jsonData = require(`../assets/packed_textures/${value}.json`)
            jsonData.textures[0].image = require(`../assets/packed_textures/${value}.png`)
            this.load.multiatlas(key, jsonData)
          }
        }
      }

      if (sceneEntry.spritesheets) {
        for (const [key, value] of Object.entries(sceneEntry.spritesheets)) {
          console.log(`Loading ${key}: ${Object.values(value)}`)
          this.load.spritesheet(
            key,
            require(`../assets/${value.path}`),
            { frameWidth: value.frameWidth, frameHeight: value.frameHeight }
          )
        }
      }

      if (sceneEntry.images) {
        for (const [key, value] of Object.entries(sceneEntry.images)) {
          console.log(`Loading ${key}: ${value}`)
          this.load.image(key, require(`../assets/${value}`))
        }
      }

      if (sceneEntry.characterVariants) {
        for (const [key, value] of Object.entries(sceneEntry.characterVariants)) {
          console.log(`Loading ${key}: ${value} for each character`)
          for (let i = 0; i < characters.length; i++) {
            const character = characters[i]
            this.load.image(
              key.replace('{characterId}', character.id),
              require(`../assets/${value.replace('{characterId}', character.id)}`)
            )
          }
        }
      }

      if (sceneEntry.audio) {
        for (const [key, value] of Object.entries(sceneEntry.audio)) {
          console.log(`Loading ${key}: ${value}`)
          this.load.audio(key, require(`../assets/${value}`))
        }
      }

      console.log('Done.')
    }

    const loadingTextLayout = getSceneLayoutData('LoadingScene').ui.text
    this.add.bitmapText(
      loadingTextLayout.x,
      loadingTextLayout.y,
      loadingTextLayout.bitmapFontId,
      'Loading Game...',
      loadingTextLayout.fontSize
    ).setOrigin(
      loadingTextLayout.originX,
      loadingTextLayout.originY
    ).setTint(
      loadingTextLayout.color
    )

    this.createProgressbar(this.centerX(), this.centerY() + 200)
  },

  createProgressbar: function (x, y) {
    // size & position
    const width = 400
    const height = 20
    const xStart = x - width / 2
    const yStart = y - height / 2

    // border size
    const borderOffset = 2

    const borderRect = new Phaser.Geom.Rectangle(
      xStart - borderOffset,
      yStart - borderOffset,
      width + borderOffset * 2,
      height + borderOffset * 2)

    const border = this.add.graphics({
      lineStyle: {
        width: 5,
        color: 0xaaaaaa
      }
    })
    border.strokeRectShape(borderRect)

    const progressbar = this.add.graphics()

    /**
         * Updates the progress bar.
         *
         * @param {number} percentage
         */
    const updateProgressbar = function (percentage) {
      progressbar.clear()
      progressbar.fillStyle(0xff0000, 1)
      progressbar.fillRect(xStart, yStart, percentage * width, height)
    }

    this.load.on('progress', updateProgressbar)

    this.load.once('complete', function () {
      console.log('Asset loading complete - starting game')
      this.load.off('progress', updateProgressbar)
      this.scene.start('MainMenuScene')
    }, this)
  },

  centerX () {
    return this.sys.game.config.width / 2
  },

  centerY () {
    return this.sys.game.config.height / 2
  }
})

export { LoadingScene }
