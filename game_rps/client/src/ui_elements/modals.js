import Phaser from 'phaser'

import { getModalLayoutData } from '../game_data/layout.js'

import { TextButton } from './text_button'

function showErrorModal (scene, title, messageText, buttonText) {
  const modalLayoutData = getModalLayoutData('Error').window
  const errorWindow = scene.add.zone(
    modalLayoutData.x,
    modalLayoutData.y,
    modalLayoutData.w,
    modalLayoutData.h
  )

  const errorModal = new ErrorModal(errorWindow, title, messageText, buttonText)

  if (scene.scene.get('Error')) {
    console.log('[MODAL] !! Not adding a modal as there is one already active.')
    return
  }
  scene.scene.add('Error', errorModal, true)
}

class ErrorModal extends Phaser.Scene {
  constructor (parent, title, messageText, buttonText, onClose) {
    super('Error')
    this.parent = parent
    this.layoutData = getModalLayoutData('Error')
    this.title = title
    this.messageText = messageText
    this.buttonText = buttonText
  }

  create () {
    const headerLayout = this.layoutData.ui.header

    this.add.bitmapText(
      headerLayout.x,
      headerLayout.y,
      headerLayout.bitmapFontId,
      this.title,
      headerLayout.fontSize
    ).setOrigin(
      headerLayout.originX,
      headerLayout.originY
    ).setDepth(
      200
    ).setTint(
      headerLayout.color
    )

    const messageLayout = this.layoutData.ui.message

    this.add.bitmapText(
      messageLayout.x,
      messageLayout.y,
      messageLayout.bitmapFontId,
      this.messageText,
      messageLayout.fontSize
    ).setOrigin(
      messageLayout.originX,
      messageLayout.originY
    ).setDepth(
      200
    ).setTint(
      messageLayout.color
    ).setMaxWidth(
      messageLayout.maxWidth
    )

    const closeButtonLayout = this.layoutData.ui.closeButton
    this.fightButton = new TextButton(
      this,
      closeButtonLayout.x,
      closeButtonLayout.y,
      this.buttonText,
      closeButtonLayout.bitmapFontId,
      closeButtonLayout.fontSize,
      closeButtonLayout.color,
      () => {
        this.parent.destroy()
        this.scene.remove()
      }
    ).setOrigin(
      closeButtonLayout.originX,
      closeButtonLayout.originY
    )
    this.add.existing(this.fightButton)

    this.cameras.main.setBackgroundColor(0x000000)
    this.cameras.main.setViewport(this.parent.x, this.parent.y, 480, 320)
  }
}

export { showErrorModal }
