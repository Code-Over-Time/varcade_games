import { TextButton } from './text_button'

export class CharacterInfoBox {
  constructor (scene, layoutData, characterSelectionCallback) {
    this.scene = scene
    this.layoutData = layoutData
    this.addToScene()
    this.onCharacterSelected = characterSelectionCallback
  }

  addToScene () {
    const bioGameObjects = []
    const characterInfoLayout = this.layoutData.ui.characterInfo

    const graphics = this.scene.add.graphics()
    graphics.fillStyle(characterInfoLayout.color, characterInfoLayout.alpha)
    graphics.lineStyle(1, 0xff0000, 1)
    graphics.strokeRoundedRect(
      characterInfoLayout.x,
      characterInfoLayout.y,
      characterInfoLayout.width,
      characterInfoLayout.height,
      characterInfoLayout.cornerRadius
    )
    bioGameObjects.push(this.scene.bioRectangle = graphics.fillRoundedRect(
      characterInfoLayout.x,
      characterInfoLayout.y,
      characterInfoLayout.width,
      characterInfoLayout.height,
      characterInfoLayout.cornerRadius
    ))

    this.bioName = this.scene.add.bitmapText(
      characterInfoLayout.header.x,
      characterInfoLayout.header.y,
      characterInfoLayout.header.bitmapFontId,
      '',
      characterInfoLayout.header.fontSize
    ).setOrigin(
      characterInfoLayout.header.originX,
      characterInfoLayout.header.originY
    )
    bioGameObjects.push(this.bioName)

    this.characterFlag = this.scene.add.sprite(
      characterInfoLayout.header.x,
      characterInfoLayout.header.flag.y,
      'global_texture'
    ).setOrigin(
      characterInfoLayout.header.flag.originX,
      characterInfoLayout.header.flag.originY
    ).setVisible(
      false
    )
    bioGameObjects.push(this.characterFlag)

    this.atkStatSection = this.addStatsSection('Attack', characterInfoLayout.atkStats)
    this.defStatSection = this.addStatsSection('Defense', characterInfoLayout.defStats)

    bioGameObjects.push(...this.atkStatSection.gameObjects)
    bioGameObjects.push(...this.defStatSection.gameObjects)

    // Fight Button
    this.fightButtonBg = this.scene.add.graphics()
    this.fightButtonBg.fillStyle(0x000000)
    this.fightButtonBg.lineStyle(3, 0xff0000, 1)
    this.fightButtonBg.strokeRect(
      490,
      572,
      460,
      55
    )
    this.fightButtonBg.fillRect(
      490,
      572,
      460,
      55
    ).setAlpha(
      0.75
    )

    const fightButtonLayout = this.layoutData.ui.fightButton
    this.fightButton = new TextButton(
      this.scene,
      fightButtonLayout.x,
      fightButtonLayout.y,
      'FIGHT!',
      fightButtonLayout.bitmapFontId,
      fightButtonLayout.fontSize,
      fightButtonLayout.color,
      () => {
        this.onCharacterSelected()
      }
    ).setOrigin(
      fightButtonLayout.originX,
      fightButtonLayout.originY
    )
    this.scene.add.existing(this.fightButton)

    bioGameObjects.push(this.fightButtonBg)
    bioGameObjects.push(this.fightButton)

    // Help us with tweening later
    bioGameObjects.forEach((element, index) => {
      element.x = element.x + characterInfoLayout.xTranslationDistance
      element.setData('originalX', element.x)
      element.setData('originalY', element.y)
    })

    this.bioGroup = this.scene.add.group(bioGameObjects)
  }

  tweenIn (character, isLocked) {
    if (isLocked) {
      this.bioName.setText('?????')
      this.fightButton.enabled = false
      this.fightButton.setText('Locked')
    } else {
      this.bioName.setText(character.displayName)
      this.fightButton.enabled = true
      this.fightButton.setText('FIGHT!')
    }
    this.characterFlag.setFrame(character.id + '_flag')
    this.characterFlag.setX(
      this.characterFlag.x +
      this.bioName.getTextBounds().local.width +
      this.layoutData.ui.characterInfo.header.flag.sidePadding
    )
    this.characterFlag.setVisible(!isLocked)

    this.atkStatSection.labels.rock.setText(this.formatStat(
      '+', character.stats.rock.damageModifier, isLocked
    ))
    this.atkStatSection.labels.paper.setText(this.formatStat(
      '+', character.stats.paper.damageModifier, isLocked
    ))
    this.atkStatSection.labels.scissors.setText(this.formatStat(
      '+', character.stats.scissors.damageModifier, isLocked
    ))

    this.defStatSection.labels.rock.setText(this.formatStat(
      '-', character.stats.rock.damageMitigation, isLocked
    ))
    this.defStatSection.labels.paper.setText(this.formatStat(
      '-', character.stats.paper.damageMitigation, isLocked
    ))
    this.defStatSection.labels.scissors.setText(this.formatStat(
      '-', character.stats.scissors.damageMitigation, isLocked
    ))

    this.scene.tweens.add({
      targets: this.bioGroup.getChildren(),
      x: '-=' + this.layoutData.ui.characterInfo.xTranslationDistance,
      duration: 500,
      ease: 'Expo.easeOut'
    })
  }

  tweenOut (character, isLocked) {
    const characterInfoLayout = this.layoutData.ui.characterInfo

    this.scene.tweens.add({
      targets: this.bioGroup.getChildren(),
      y: '+=' + characterInfoLayout.yTranslationDistance,
      duration: 200,
      repeat: 0,
      onComplete: () => {
        this.bioGroup.getChildren().forEach((element, index) => {
          element.setPosition(
            element.getData('originalX'),
            element.getData('originalY')
          )
        })
        this.tweenIn(character, isLocked)
      }
    })
  }

  formatStat (sign, value, isLocked) {
    if (isLocked) {
      return '?'
    }

    if (value === 0) {
      sign = ''
    }
    return sign + (value * 100) + '%'
  }

  addStatsSection (title, layoutData) {
    const statsGameObjects = []
    const statsLabels = {}
    statsGameObjects.push(this.scene.add.bitmapText(
      layoutData.x,
      layoutData.y,
      layoutData.bitmapFontId,
      title,
      layoutData.fontSize
    ).setOrigin(
      0,
      0
    ))

    const statIcons = ['rock', 'paper', 'scissors']
    statIcons.forEach((element, index) => {
      statsGameObjects.push(this.scene.add.sprite(
        layoutData.statList.x,
        layoutData.statList.y + (layoutData.statList.padding * index),
        'global_texture',
        element + '_ico'
      ).setOrigin(
        layoutData.statList.originX,
        layoutData.statList.originY
      ).setScale(
        layoutData.statList.iconScale
      ).setRotation(
        1.5
      ))

      const txtStat = this.scene.add.bitmapText(
        layoutData.statList.x + layoutData.statList.sidePadding,
        layoutData.statList.y + layoutData.statList.textOffset + (layoutData.statList.padding * index),
        layoutData.bitmapFontId,
        '+/- %',
        layoutData.fontSize
      ).setOrigin(
        layoutData.statList.originX,
        layoutData.statList.originY
      )
      statsLabels[element] = txtStat
      statsGameObjects.push(txtStat)
    })
    return {
      labels: statsLabels,
      gameObjects: statsGameObjects
    }
  }
}
