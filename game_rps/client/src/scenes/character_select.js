import Phaser from 'phaser'

import { RPSGameMode, characters } from 'rps-game-engine'

import { audioManager } from '../audio_manager.js'

import { getSceneLayoutData } from '../game_data/layout.js'

import { getSaveGameData } from '../game_data/save_data.js'
import { CharacterInfoBox } from '../ui_elements/character_info_box.js'

const CharacterSelectScene = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize: function () {
    Phaser.Scene.call(this, { key: 'CharacterSelectScene' })
    this.characterSelectEnabled = true
    this.saveGameData = getSaveGameData()
  },

  init: function (data) {
    this.gameInterface = data.gameInterface
    this.viewData = this.gameInterface.getGameViewData()
  },

  create: function () {
    this.layoutData = getSceneLayoutData('CharacterSelectScene')

    this.add.image(
      this.layoutData.ui.background.x,
      this.layoutData.ui.background.y,
      'charSelectionBg'
    ).setOrigin(
      this.layoutData.ui.background.originX,
      this.layoutData.ui.background.originY
    ).setAlpha(
      0.3
    )

    this.characterInfoBox = new CharacterInfoBox(this, this.layoutData, () => {
      if (this.selectedCharacter != null) {
        console.log('Character Selected...')
        this.gameInterface.selectFighter(this.selectedCharacter, () => {
          if (this.gameInterface.getGameViewData().gameMode === RPSGameMode.SINGLE) {
            this.scene.start('CharacterIntroScene', { gameInterface: this.gameInterface })
          } else {
            this.scene.start('VSScene', { gameInterface: this.gameInterface })
          }
        })
      }
    })

    // Graphics / effects
    this.selectionBorder = this.add.sprite(
      0, 0, 'global_texture', 'character_select_border'
    ).setVisible(
      false
    ).setOrigin(
      0,
      0
    )

    // Screen Header
    const headerLayout = this.layoutData.ui.header
    this.add.bitmapText(
      headerLayout.x,
      headerLayout.y,
      headerLayout.bitmapFontId,
      'CHOOSE YOUR CHAMPION',
      headerLayout.fontSize
    ).setOrigin(
      headerLayout.originX,
      headerLayout.originY
    ).setDepth(
      200
    ).setTint(
      headerLayout.color
    )

    // Headshot layout
    const characterLayout = this.layoutData.ui.character
    const headshotLayout = this.layoutData.ui.headshots
    let y = headshotLayout.y
    let x = headshotLayout.x
    const headshots = []
    for (let i = 0; i < characters.length; i++) {
      const character = characters[i]
      if (i !== 0 && i % headshotLayout.maxPerRow === 0) {
        y += headshotLayout.height + headshotLayout.padding
        x = headshotLayout.x
      }

      const fullbody = this.add.sprite(
        characterLayout.x - characterLayout.width, // Start off screen
        characterLayout.y,
        'global_texture',
        character.id + '_upperbody'
      ).setVisible(
        false
      ).setOrigin(
        characterLayout.originX,
        characterLayout.originY
      )

      let headshot

      if (character.locked && !this.characterUnlocked(character.id)) {
        headshot = this.add.sprite(
          x, y, 'global_texture', 'locked'
        ).setOrigin(
          headshotLayout.originX,
          headshotLayout.originy
        )
      } else {
        headshot = this.add.sprite(
          x, y, 'global_texture', character.id + '_headshot'
        ).setOrigin(
          headshotLayout.originX,
          headshotLayout.originY
        )
      }

      headshot.setData('character', character) // Store some data on the headshot for
      headshot.setData('full_body_image', fullbody) // ease of access during click handling
      headshot.setInteractive({ useHandCursor: true })
      headshot.on('pointerdown', () => {
        this.handleCharacterSelection(headshot)
      })
      headshots.push(headshot)
      x += headshotLayout.width + headshotLayout.padding
    }

    this.characterInfoBox.addToScene()

    this.handleCharacterSelection(headshots[0])
  },

  update: function (time, delta) {
    // Handle case where a game is timed out while the host is waiting for an opponent
    if (this.viewData.interfaceErrors.length > 0) {
      const error = this.viewData.interfaceErrors.pop()
      if (error.action === 'reset-hard') {
        console.log(error.message)
        this.scene.start('MainMenuScene', {
          error: {
            title: 'Network Error',
            message: 'Unable to connect to Rock Paper Scissors Apocalypse game server. Please check your internet connection and try again.'
          }
        })
      }
    }
  },

  /**
    Character selection and animation
  **/

  handleCharacterSelection: function (selectedHeadshot) {
    if (this.characterSelectEnabled) {
      audioManager.playEffect('charSelectEffect')
      this.characterSelectEnabled = false
      this.selectionBorder.setPosition(selectedHeadshot.x - 15, selectedHeadshot.y - 15)
      this.selectionBorder.setVisible(true)

      const newCharacterSelection = selectedHeadshot.getData('full_body_image')
      const characterData = selectedHeadshot.getData('character')
      const isLocked = characterData.locked && !this.characterUnlocked(characterData.id)
      if (this.currentDisplayCharacter != null) {
        this.tweenCharacterOut(this.currentDisplayCharacter, newCharacterSelection)
        this.characterInfoBox.tweenOut(characterData, isLocked)
      } else {
        this.tweenCharacterIn(newCharacterSelection)
        this.characterInfoBox.tweenIn(characterData, isLocked)
      }
      if (isLocked) {
        newCharacterSelection.setTint(1, 1, 1)
      }
      this.currentDisplayCharacter = newCharacterSelection
      this.selectedCharacter = characterData
    }
  },

  characterUnlocked: function (characterId) {
    return this.saveGameData.characterUnlocks.indexOf(characterId) !== -1
  },

  tweenCharacterIn: function (character) {
    character.setVisible(true)
    const tweenConfig = {
      targets: [character],
      x: this.layoutData.ui.character.x,
      duration: 500,
      ease: 'Expo.easeOut',
      repeat: 0,
      onComplete: () => {
        this.characterSelectEnabled = true
      }
    }
    this.tweens.add(tweenConfig)
  },

  tweenCharacterOut: function (character, replacementCharacter) {
    this.tweens.add({
      targets: [character],
      x: -this.layoutData.ui.character.width,
      duration: 200,
      repeat: 0,
      onComplete: (tween, targets) => {
        character.setVisible(false)
        this.tweenCharacterIn(replacementCharacter)
      }
    })
  },

  getText: function (key) {
    return {
      char_name: '',
      char_country: 'Country: ',
      char_stats_rock: 'Rock: ',
      char_stats_paper: 'Paper: ',
      char_stats_scissors: 'Scissors: ',
      char_stats_health: 'Health: '
    }[key]
  }

})

export { CharacterSelectScene }
