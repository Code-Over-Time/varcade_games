const characters = [
  {
    id: 'aru',
    displayName: 'Aruka',
    country: 'Brazil',
    stats: {
      health: 100,
      style: 'paper',
      rock: {
        baseDamage: 25,
        damageModifier: 0,
        damageMitigation: 0.2
      },
      paper: {
        baseDamage: 25,
        damageModifier: 0.30,
        damageMitigation: 0
      },
      scissors: {
        baseDamage: 25,
        damageModifier: 0,
        damageMitigation: 0
      }
    },
    singlePlayerSequence: [
      'man', 'rad', 'hog'
    ],
    locked: false,
    isBoss: false,
    singlePlayerUnlock: 'hog',
    storyline: [
      'As humanity stood face to face with the darkest evil it had ever encountered, the indigenous warriors of the Amazon dutifully stood in its path.\n',
      'Aruka, the last warrior of his tribe, was selected to represent the people of the rain forest.\n',
      'Many believe that the spirit of mother nature flows through Aruka and guides him against the forces of darkness.\n',
      'His intuition of all things natural, be they creative or destructive forces, makes Aruka a natural Rock Paper Scissors contender.\n',
      'During battle he enters a trance-like state, through which his focus and composure is unwavering.'
    ],
    trashTalk: {
      win: ['The forest will always prevail...'],
      lose: ['There is no good that lasts forever nor evil that never ends.']
    }
  },
  {
    id: 'man',
    displayName: 'Manbo',
    country: 'Togo',
    stats: {
      health: 100,
      style: 'scissors',
      rock: {
        baseDamage: 25,
        damageModifier: 0,
        damageMitigation: 0
      },
      paper: {
        baseDamage: 25,
        damageModifier: 0,
        damageMitigation: 0.1
      },
      scissors: {
        baseDamage: 25,
        damageModifier: 0.4,
        damageMitigation: 0
      }
    },
    singlePlayerSequence: [
      'aru', 'hog', 'rad'
    ],
    locked: false,
    isBoss: false,
    singlePlayerUnlock: 'rad',
    storyline: [
      `Manbo is no stranger to dark and powerful spirits.\n`,
      `As a practitioner of West African Vudon and Queen Mother to her clan she is believed to maintain unearthly connections with her people's ancestors.\n`,
      `Manbo carries many talismen, or Fetishes as they are known to her, each of which is said to contain spirits that guide her hand during the game.\n`,
      `Some have claimed she uses the dark arts to manipulate her opponents decisions, others say her sixth sense also exposes the intentions of her opponents.\n`,
      `Out of all of the contenders, none carry with them the threatening mystique that Manbo does.\n`
    ],
    trashTalk: {
      win: ['Your strings were easily pulled...'],
      lose: ['We`ll meet again, in the next world. Don`t be late...']
    }
  },
  {
    id: 'hog',
    displayName: 'Hogo Sha',
    country: 'Japan',
    stats: {
      health: 100,
      style: 'paper',
      rock: {
        baseDamage: 25,
        damageModifier: 0.1,
        damageMitigation: 0
      },
      paper: {
        baseDamage: 25,
        damageModifier: 0.1,
        damageMitigation: 0.1
      },
      scissors: {
        baseDamage: 25,
        damageModifier: 0,
        damageMitigation: 0.2
      }
    },
    singlePlayerSequence: [
      'man', 'aru', 'rad'
    ],
    locked: true,
    isBoss: false,
    singlePlayerUnlock: null,
    storyline: [
      'In the aftermath of what became known as `The First Wave`, a group of scientists in Japan proposed that no human mind could resist the evil influences of a demon, let alone remain composed enough to defeat it in a battle for humanity.\n',
      'Their proposal was to present to the demon a being with an incorruptible mind.\n',
      'A mind of pure logic.\n',
      'A digital mind.\n',
      'Hoga-Sha is the world\'s most compact and mobile supercomputer, repurposed entirely for competing in Rock Paper Scissors.\n',
      'It houses the most random pseudorandom number generator ever created, along with advanced machine learning algorithms that analyze its opponents moves, making it a formidable and unpredictable opponent.\n'
    ],
    trashTalk: {
      win: ['Calculation complete.', 'echo `success` > results.txt'],
      lose: ['Unable to compute', 'echo `failure` > results.txt']
    }
  },
  {
    id: 'rad',
    displayName: 'Raden',
    country: 'Indonesia',
    stats: {
      health: 120,
      style: 'paper',
      rock: {
        baseDamage: 20,
        damageModifier: 0.1,
        damageMitigation: 0
      },
      paper: {
        baseDamage: 20,
        damageModifier: 0,
        damageMitigation: 0
      },
      scissors: {
        baseDamage: 20,
        damageModifier: 0,
        damageMitigation: 0.4
      }
    },
    locked: true,
    isBoss: false,
    singlePlayerSequence: [
      'man', 'hog', 'aru'
    ],
    singlePlayerUnlock: null,
    storyline: [
      'Born on the island of Java, Raden belongs to an unnamed and ancient Indonesian sect.\n',
      'Established during the formation of the Medang Empire, this secret order seeks out young girls that display strong empathic abilities to join their ranks.\n',
      'These girls spend a lifetime submerged in grueling training regimes designed to push their physical and mental strength to their limits. Once their training is complete they go out into the world, acting as beacons of hope in times of despair\n',
      'This combination of unwavering composure and empathy also results in a near unmatched ability to play Rock Paper Scissors. Raden stands strong in the face of unwavering evil and existential pressure, long after all other have crumbled.\n',
      'Some have claimed that the secret sect that Raden belongs to and `The Keepers of the Game` are one and the same, though these claims are unsubstantiated.\n'
    ],
    trashTalk: {
      win: ['Civilize The Mind, But Make Savage The Body.'],
      lose: ['Have confidence in my destiny. Do not weep.']
    }
  },
  {
    id: 'mai',
    displayName: 'Mainyu',
    country: 'Duzakh',
    stats: {
      health: 120,
      style: 'rock',
      rock: {
        baseDamage: 20,
        damageModifier: 0,
        damageMitigation: 0.1
      },
      paper: {
        baseDamage: 20,
        damageModifier: 0,
        damageMitigation: 0.2
      },
      scissors: {
        baseDamage: 20,
        damageModifier: 0,
        damageMitigation: 0.2
      }
    },
    locked: true,
    isBoss: true,
    singlePlayerSequence: [
      'man', 'aru', 'hog'
    ],
    singlePlayerUnlock: null,
    storyline: [
      'Mainyu is the spirit of a pure evil that exists only to corrupt, consume and destroy.\n',
      'Its one weakness can be found in its willingness to gamble with it`s victims so that it can foster hope within living souls so that it can crush that hope and bath in the broken remains of the human spirit it has crushed.\n',
      'The Keepers of the Game refer to Mainyu as the darkness that haunts all humans.\n',
      'It is corruption.\n',
      'It is subjugation. \n',
      'It is envy.\n',
      'It is rage.\n',
      'It is wrath.\n',
      'It is consumption.\n',
      'It is eternal...\n'
    ],
    trashTalk: {
      win: ['Your soul will the last I devour and it will be sweet.'],
      lose: ['This is not the end - you cannot destroy that which is eternal']
    }
  }
]

const gameLore = [
  'May 16th, 2022.\n',
  'As a blood stained moon darkened the night sky, so too did a shadow darken the fate of all humanity.\n',
  'The shadow was that of a demon.\n',
  'A demon that wrought pestilence and suffering to all life on earth.\n',
  'Until a heretofore unknown secret society called `The Keepers of the Game` emerged from the chaos.\n',
  'Through an unnamed ritual The Keepers forced the shadow demon to take physical form, before challenging it to a game.\n',
  'A contest of their choosing that would decide the fate of humanity.\n',
  'The demon agreed and departed the mortal realm to return on November 8th, 2022.\n',
  'The next blood moon.\n',
  'The Keepers of the Game decried that the chosen contest was to be Rock, Paper, Scissors.\n',
  'The only game that a demon, superior in every conceivable way to the humans it would face, could lose at.\n',
  'And so it began.\n',
  'The hunt for the champion that would stand between humanity and oblivion...\n'
]

const basicVictoryLore = [
  'You have successfully defeated the best that the world of Rock, Paper, Scissors has to offer...\n',
  'But you are not yet ready to take the fate of humanity in your hands...'
]

const fullVictoryLore = [
  'The fate of all humanity was placed in your hands, and you have protected it.\n',
  'Future generations now have a chance.\n',
  'Though Mainyu can never be fully destroyed...'
]

const credits = [
  'CREDITS\n\n',
  'GAMEPLAY PROGRAMMING\n',
  'Kev Bergin\n',
  'NETWORK PROGRAMMING\n',
  'Kev Bergin\n',
  'GAME DESIGN\n',
  'Kev Bergin\n',
  'CHARACTER ART\n',
  'ehioe\n',
  'BACKGROUND ART\n',
  'Sofia Waltz\n',
  'MUSIC\n',
  'Landon Walter\n',
  '\n\nThank you for playing!\n\n'
]

const getCharacterById = function (characterId) {
  for (let i = 0; i < characters.length; i++) {
    if (characters[i].id === characterId) {
      return characters[i]
    }
  }
  return null
}

const getBossCharacterId = function () {
  for (let i = 0; i < characters.length; i++) {
    if (characters[i].isBoss) {
      return characters[i].id
    }
  }
  return null
}

const lore = {
  singlePlayerIntro: gameLore,
  basicVictoryLore: basicVictoryLore,
  fullVictoryLore: fullVictoryLore
}

exports.getCharacterById = getCharacterById
exports.characters = characters
exports.credits = credits
exports.lore = lore
exports.getBossCharacterId = getBossCharacterId
