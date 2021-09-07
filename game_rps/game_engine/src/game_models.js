const { RPSRoundEvent } = require('./game_events')
const { getStrategy } = require('./strategy')

class RPSRoundResult {
  /**
   *  A thing wrapper class for storing a reference to the RPSPlayer
   *  object of the winner and loser of a round.
  **/
  constructor (winner, loser) {
    this.winner = winner // RPS Player
    this.loser = loser // RPS Player
  }
}

class RPSPlayer {
  /**
   *  Represents a player in the game, whether human
   *  or AI controlled.
  **/
  constructor (id) {
    this.id = id
    this.fighter = null // RPSFighter
  }

  selectFighter (fighter) {
    this.fighter = fighter
  }

  ready () {
    return this.fighter != null
  }

  reset () {
    this.fighter = null
  }
}

class RPSOnlinePlayer extends RPSPlayer {
  /**
   *  Represents the players in a multi-player game
   *  the main difference here is the need to store
   *  the players usernames
  **/
  constructor (id, name) {
    super(id)
    this.name = name
  }
}

class RPSStrategyBot extends RPSPlayer {
  /**
   *  Represents an AI player (single player mode)
   *  that uses some basic strategy, as defined in
   *  strategy.js
  **/
  constructor (id, difficulty) {
    super(id)
    this.strategy = getStrategy(difficulty)
  }

  eventListener (event) {
    if (event instanceof RPSRoundEvent) {
      if (event.type === RPSRoundEvent.WEAPON_COUNTDOWN && event.data.value === 2) {
        this.fighter.equipWeapon(this.strategy.getNextSelection(this.fighter.getCurrentHealthPct()))
      }
      if (event.type === RPSRoundEvent.ROUND_FINISHED) {
        this.strategy.reset()
      }
    }
  }
}

class RPSRandomBot extends RPSPlayer {
  /**
   *  Represents an AI player (single player mode)
   *  that simply makes random selection -
   *  !Note! This is one of the most difficult to play against
  **/
  eventListener (event) {
    if (event instanceof RPSRoundEvent) {
      if (event.type === RPSRoundEvent.WEAPON_COUNTDOWN) {
        // this.fighter.equipWeapon(Math.floor(Math.random() * 3))
        this.fighter.equipWeapon(2)
      }
    }
  }
}

class RPSFighter {
  /**
   *  Represents the player's character selection.
  **/
  constructor (spec) {
    this.id = spec.id
    this.spec = spec
    // Amount of damage this fighter has taken in the current round
    this.damage = 0

    this.weapons = [
      new Rock(this.spec.stats.rock.baseDamage, {
        damageModifier: this.spec.stats.rock.damageModifier,
        damageMitigation: this.spec.stats.rock.damageMitigation
      }),
      new Paper(this.spec.stats.paper.baseDamage, {
        damageModifier: this.spec.stats.paper.damageModifier,
        damageMitigation: this.spec.stats.paper.damageMitigation
      }),
      new Scissors(this.spec.stats.scissors.baseDamage, {
        damageModifier: this.spec.stats.scissors.damageModifier,
        damageMitigation: this.spec.stats.scissors.damageMitigation
      })
    ]

    this.currentSelectedWeaponIndex = null
    // True if the current round is accepting weapon selection from players
    this.weaponSelectAvailable = false
  }

  equipWeapon (weaponIndex) {
    if (this.weaponSelectAvailable) {
      this.currentSelectedWeaponIndex = weaponIndex
    }
  }

  getSelectedWeapon () {
    if (this.currentSelectedWeaponIndex == null) {
      return null
    }
    return this.weapons[this.currentSelectedWeaponIndex]
  }

  applyDamage (damage) {
    this.damage += damage
  }

  getCurrentHealth () {
    return Math.max(0, this.spec.stats.health - this.damage)
  }

  getCurrentHealthPct () {
    return this.getCurrentHealth() / this.spec.stats.health
  }

  isDefeated () {
    return this.damage >= this.spec.stats.health
  }

  reset () {
    this.damage = 0
    this.currentSelectedWeaponIndex = null
  }
}

class RPSWeaponSelections {
  /**
   *  A utility object that can take two weapon selections
   *  and produce a summary of the damage dealt and weapons
   *  used by each player
  **/

  constructor (p1Weapon, p2Weapon) {
    this.p1Weapon = p1Weapon || new Botch() // In case of no selection
    this.p2Weapon = p2Weapon || new Botch()

    this.p1DamageDealt = this.p1Weapon.calculateDamageDealt(this.p2Weapon)
    this.p2DamageDealt = this.p2Weapon.calculateDamageDealt(this.p1Weapon)
  }

  getSelectionSummary () {
    return {
      p1Selection: {
        weaponId: this.p1Weapon.id,
        damageDealt: this.p1DamageDealt
      },
      p2Selection: {
        weaponId: this.p2Weapon.id,
        damageDealt: this.p2DamageDealt
      }
    }
  }
}

class Weapon {
  /**
   *  Represents weapon in the game, in this case
   *  Rock, Paper, Scissors
  **/
  static get WIN () { return 0 }
  static get LOSE () { return 1 }
  static get DRAW () { return 2 }

  constructor (baseDamage, weaponStats) {
    this.baseDamage = baseDamage
    this.weaponStats = weaponStats
  }

  calculateDamageDealt (vs) {
    if (this.getAttackResult(vs) === Weapon.WIN) {
      return this.baseDamage * (1 + this.weaponStats.damageModifier - vs.weaponStats.damageMitigation)
    }
    return 0
  }

  getAttackResult (vs) {
    if (vs instanceof Botch) {
      return Weapon.WIN
    }
    return Weapon.DRAW
  }
}

class Rock extends Weapon {
  get id () {
    return 'rock'
  }

  getAttackResult (vs) {
    if (vs instanceof Paper) {
      return Weapon.LOSE
    }
    if (vs instanceof Scissors) {
      return Weapon.WIN
    }
    return super.getAttackResult(vs)
  }
}

class Paper extends Weapon {
  get id () {
    return 'paper'
  }

  getAttackResult (vs) {
    if (vs instanceof Scissors) {
      return Weapon.LOSE
    }
    if (vs instanceof Rock) {
      return Weapon.WIN
    }
    return super.getAttackResult(vs)
  }
}

class Scissors extends Weapon {
  get id () {
    return 'scissors'
  }

  getAttackResult (vs) {
    if (vs instanceof Rock) {
      return Weapon.LOSE
    }
    if (vs instanceof Paper) {
      return Weapon.WIN
    }
    return super.getAttackResult(vs)
  }
}

class Botch extends Weapon {
  /**
   *  This is a special weapon that is used when a player doesn't make
   *  a selection. It always loses unless the opponent also throws a
   *  botch. In that case, both win - so damage is applied to both
  **/
  constructor () {
    // TODO: Don't hardcode Botch base damage
    super(
      18 + Math.floor((Math.random() * 5) + 1), // Offset damage to try avoid double KOs and exploits
      { damageModifier: 0, damageMitigation: 0 })
  }

  get id () {
    return 'botch'
  }

  getAttackResult (vs) {
    if (vs instanceof Botch) {
      return Weapon.WIN
    }
    return Weapon.LOSE
  }
}

exports.RPSPlayer = RPSPlayer
exports.RPSOnlinePlayer = RPSOnlinePlayer
exports.RPSRandomBot = RPSRandomBot
exports.RPSStrategyBot = RPSStrategyBot
exports.RPSFighter = RPSFighter
exports.RPSRoundResult = RPSRoundResult
exports.RPSWeaponSelections = RPSWeaponSelections
