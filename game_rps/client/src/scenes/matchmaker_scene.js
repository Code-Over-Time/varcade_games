import Phaser from 'phaser'

import { MultiPlayerGame } from '../game_engine_interface.js'
import { getSceneLayoutData } from '../game_data/layout.js'

const MatchmakerScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize: function () {
    Phaser.Scene.call(this, { key: 'MatchmakerScene' })
  },

  create: function () {
    this.layoutData = getSceneLayoutData('MatchmakerScene')

    const headerLayout = this.layoutData.ui.header

    this.add.bitmapText(
      headerLayout.x,
      headerLayout.y,
      headerLayout.bitmapFontId,
      'Waiting for Matchmaker...',
      headerLayout.fontSize
    ).setOrigin(
      headerLayout.originX,
      headerLayout.originY
    ).setTint(
      headerLayout.color
    )

    window.getMatchmaker().showMatchmaker((gameServerUrl, userId, token) => {
      console.log('Multi-player game selected, launching game...')
      const gameInterface = new MultiPlayerGame(gameServerUrl, token, userId)
      gameInterface.connectToGameServer(
        () => { // On Success
          this.scene.start('CharacterSelectScene', { gameInterface: gameInterface })
        },
        () => { // On Error
          this.scene.start('MainMenuScene', {
            error: {
              title: 'Connection Error',
              message: 'Something went wrong while trying to connect to your game. Please try again.'
            }
          })
        }
      )
    },
    () => { // Window was closed without joining a game
      this.scene.start('MainMenuScene')
    })
  }

})

export { MatchmakerScene }
