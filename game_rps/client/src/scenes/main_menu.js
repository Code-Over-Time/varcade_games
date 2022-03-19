import Phaser from 'phaser'

import { audioManager } from '../audio_manager.js'

// UI Widgets
import { TextButton } from '../ui_elements/text_button'
import { IconButton } from '../ui_elements/icon_button'
import { showErrorModal } from '../ui_elements/modals'

// Gameplay
import { SinglePlayerGame } from '../game_engine_interface.js'

import { getSceneLayoutData } from '../game_data/layout.js'

class MainMenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MainMenuScene' })
    this.menuHighlightIconIndex = 0
  }

  init (data) {
    this.error = data.error // This will be filled if returning from an error in another scene
  }

  create () {
    this.layoutData = getSceneLayoutData('MainMenuScene')

    audioManager.initialize(this.game)
    audioManager.playMusic('bgMusic', true)
    const bgLayout = this.layoutData.ui.background
    this.add.image(
      bgLayout.x, bgLayout.y, 'mainMenuBg'
    ).setOrigin(
      bgLayout.originX, bgLayout.originY
    )

    /**
      SINGLE PLAYER SELECT
    **/

    const menuButtonLayout = this.layoutData.ui.menu
    this.fistIndicator = this.add.sprite(
      menuButtonLayout.fistIndicatorX,
      menuButtonLayout.y + menuButtonLayout.fistIndicatorYOffset,
      'global_texture',
      'rock_ico'
    ).setRotation(
      1.5
    ).setTint(
      0xFF0000
    )

    const singlePlayerButton = new TextButton(
      this,
      menuButtonLayout.x,
      menuButtonLayout.y,
      'Single Player',
      menuButtonLayout.bitmapFontId,
      menuButtonLayout.fontSize,
      menuButtonLayout.color,
      () => { // On click
        console.log('Starting new single player game...')
        const gameInterface = new SinglePlayerGame({
          vsScreenDelay: 500
        },
        {
          sequence: 0,
          isBossFight: false,
          undefeated: true
        }
        )
        audioManager.playEffect('impact', {
          seek: 1
        })
        this.scene.start('StoryIntroScene', { gameInterface: gameInterface })
      },
      () => { // On hover
        this.fistIndicator.setY(menuButtonLayout.y + menuButtonLayout.fistIndicatorYOffset)
        this.fistIndicator.setFrame(['rock_ico', 'paper_ico', 'scissors_ico'][++this.menuHighlightIconIndex % 3])
      }
    )
    singlePlayerButton.setOrigin(
      menuButtonLayout.originX,
      menuButtonLayout.originY
    )
    this.add.existing(singlePlayerButton)

    /**
      Multi Player Select
    **/
    if (window.getMatchmaker) { // only provide a multiplayer option is a Matchmaker is available
      const multiPlayerButtonYPos = menuButtonLayout.y + menuButtonLayout.padding + menuButtonLayout.fontSize
      const multiPlayerButton = new TextButton(this,
        menuButtonLayout.x,
        multiPlayerButtonYPos,
        'Multi Player',
        menuButtonLayout.bitmapFontId,
        menuButtonLayout.fontSize,
        menuButtonLayout.color,
        () => { // On click
          this.scene.start('MatchmakerScene')
        },
        () => { // On hover
          this.fistIndicator.setY(multiPlayerButtonYPos + menuButtonLayout.fistIndicatorYOffset)
          this.fistIndicator.setFrame(['rock_ico', 'paper_ico', 'scissors_ico'][++this.menuHighlightIconIndex % 3])
        }
      )
      multiPlayerButton.setOrigin(
        menuButtonLayout.originX,
        menuButtonLayout.originY
      )
      this.add.existing(multiPlayerButton)
    } else {
      console.log('No Matchmaker found - disabling multi player option.')
    }

    this.addMenuOptions()

    if (this.error) {
      showErrorModal(
        this,
        this.error.title,
        this.error.message,
        'Close'
      )
    }
  }

  addMenuOptions () {
    const settingsLayout = this.layoutData.ui.settingsList

    const activeMusicIcon = audioManager.musicEnabled
      ? settingsLayout.icons.soundOnIcon
      : settingsLayout.icons.soundOffIcon
    const inactiveMusicIcon = audioManager.musicEnabled
      ? settingsLayout.icons.soundOffIcon
      : settingsLayout.icons.soundOnIcon

    const activeEffectsIcon = audioManager.effectsEnabled
      ? settingsLayout.icons.effectsOnIcon
      : settingsLayout.icons.effectsOffIcon
    const inactiveEffectsIcon = audioManager.effectsEnabled
      ? settingsLayout.icons.effectsOffIcon
      : settingsLayout.icons.effectsOnIcon

    this.add.existing(new IconButton(this,
      settingsLayout.x, settingsLayout.y, 'global_texture',
      activeMusicIcon, inactiveMusicIcon, 0xFFFFFF, () => {
        audioManager.toggleMusicEnabled()
      }).setOrigin(settingsLayout.originX, settingsLayout.originY))

    this.add.existing(new IconButton(this,
      settingsLayout.x, settingsLayout.y + settingsLayout.padding, 'global_texture',
      activeEffectsIcon, inactiveEffectsIcon, 0xFFFFFF, () => {
        audioManager.toggleEffectsEnabled()
      }).setOrigin(settingsLayout.originX, settingsLayout.originY))

    // Experimental fullscreen stuff
    // this.add.existing(new IconButton(this,
    //   settingsLayout.x, settingsLayout.y - settingsLayout.padding, 'global_texture',
    //   activeEffectsIcon, inactiveEffectsIcon, 0xFFFFFF, () => {

    //     if (this.scale.isFullscreen) {
    //       this.scale.stopFullscreen();
    //     }
    //     else {
    //       this.scale.startFullscreen();
    //     }
    //   }).setOrigin(settingsLayout.originX, settingsLayout.originY))
  }
}

export { MainMenuScene }
