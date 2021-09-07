class AudioManager {
  constructor () {
    this.musicEnabled = false
    this.effectsEnabled = false
    this.game = null
    this.activeMusic = null
  }

  initialize (game) {
    this.game = game
  }

  playMusic (key, force = false) {
    if (force) {
      this.stopMusic()
    }

    if (this.activeMusic) {
      console.error(`Cannot player music with key ${key}. There is already music active.`)
      return
    }

    this.activeMusic = this.game.sound.add(key, {
      volume: 0.2,
      loop: true
    })

    this.playOrStopMusic()
  }

  stopMusic () {
    if (!this.activeMusic) {
      return
    }
    this.game.sound.remove(this.activeMusic)
    this.activeMusic.stop()
    this.activeMusic = null
  }

  pauseMusic () {
    if (!this.activeMusic) {
      this.activeMusic.pause()
    }
  }

  resumeMusic () {
    if (!this.activeMusic) {
      this.activeMusic.resume()
    }
  }

  playEffect (key, config) {
    if (this.effectsEnabled) {
      this.game.sound.play(key, Object.assign({ volume: 0.2 }, config))
    }
  }

  playOrStopMusic () {
    if (this.musicEnabled && this.activeMusic != null) {
      this.activeMusic.play()
    } else if (!this.musicEnabled && this.activeMusic != null) {
      this.activeMusic.stop()
    }
  }

  toggleMusicEnabled () {
    this.musicEnabled = !this.musicEnabled
    this.playOrStopMusic()
  }

  toggleEffectsEnabled () {
    this.effectsEnabled = !this.effectsEnabled
  }
}

const am = new AudioManager()
exports.audioManager = am
