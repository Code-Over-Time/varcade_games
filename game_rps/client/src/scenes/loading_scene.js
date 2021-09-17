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

    // See assets/asset_list.json for the structure of this data
    for (const [key, sceneEntry] of Object.entries(assetList.sceneAssets)) {
      console.log(`Loading assets for Scene:'${key}'...`)

      this.loadPackedTextures(sceneEntry.packedTextures)
      this.loadSpritesheets(sceneEntry.spritesheets)
      this.loadImages(sceneEntry.images)
      this.loadAudio(sceneEntry.audio)

      console.log('Finished loading assets.')
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

  loadPackedTextures: function (assetData) {
    if (assetData) {
      for (const [key, value] of Object.entries(assetData)) {
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
  },

  loadSpritesheets: function (assetData) {
    if (assetData) {
      for (const [key, value] of Object.entries(assetData)) {
        console.log(`Loading ${key}: ${Object.values(value)}`)
        this.load.spritesheet(
          key,
          require(`../assets/${value.path}`),
          { frameWidth: value.frameWidth, frameHeight: value.frameHeight }
        )
      }
    }
  },

  loadImages: function (assetData) {
    if (assetData) {
      for (const [key, value] of Object.entries(assetData)) {
        console.log(`Loading ${key}: ${value}`)
        this.load.image(key, require(`../assets/${value}`))
      }
    }
  },

  loadAudio: function (assetData) {
    if (assetData) {
      for (const [key, value] of Object.entries(assetData)) {
        console.log(`Loading ${key}: ${value}`)
        this.load.audio(key, require(`../assets/${value}`))
      }
    }
  },

  createProgressbar: function (x, y) {
    const width = 400
    const height = 20
    const xStart = x - width / 2
    const yStart = y - height / 2

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
