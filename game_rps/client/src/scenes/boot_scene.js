import Phaser from 'phaser'

import { gameConfig } from '../game_data/config.js'

import assetList from '../assets/asset_list.json'

import Verdana64 from '../assets/fonts/Verdana64.png'
import Verdana64Info from '../assets/fonts/Verdana64.xml'

import MedievalSharp64 from '../assets/fonts/MedievalSharp64.png'
import MedievalSharp64Info from '../assets/fonts/MedievalSharp64.xml'

class BootScene extends Phaser.Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.setBaseURL(gameConfig.baseURL)
    this.load.json('assetList', assetList)
    this.load.bitmapFont('verdana64', Verdana64, Verdana64Info)
    this.load.bitmapFont('MedievalSharp64', MedievalSharp64, MedievalSharp64Info)
  }

  create () {
    console.log('Boot complete - loading assets')
    this.scene.start('LoadingScene')
  }
}

export { BootScene }
