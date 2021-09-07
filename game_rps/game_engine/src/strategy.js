const difficultyToSelectionSize = [3, 4, 5, 6]
const difficultyToStrategyChangeThreshold = [0.9, 0.2, 0.30, 0.45]

class RPSStrategy {
  static get BABY () { return 0 }
  static get EASY () { return 1 }
  static get MEDIUM () { return 2 }
  static get HARD () { return 3 }

  constructor (difficulty) {
    this.difficulty = difficulty
    this.currentSelection = 0
    this.maxChoiceRegens = 1
    this.choiceRegenCount = 0
    this.changeStrategyThreshold = this.getStrategyChangeThreshold(this.difficulty)
    this.generateChoices()
  }

  reset () {
    this.currentSelection = 0
    this.choiceRegenCount = 0
    this.generateChoices()
  }

  generateChoices () {
    const choiceArraySize = this.getArraySelectionSizeForDifficulty(this.difficulty)
    const baseChoiceArray = [0, 1, 2]
    const additionalChoiceCount = Math.max(0, choiceArraySize - baseChoiceArray.length)
    const additionalChoices = Array.from(Array(additionalChoiceCount)).map(
      x => Math.trunc(Math.random() * 10 % additionalChoiceCount)
    )
    this.choices = baseChoiceArray.concat(additionalChoices)
    this.shuffleArray(this.choices)
    console.log(`Generated new choice array: ${this.choices}`)
  }

  getNextSelection (fighterHealthPct) {
    if (this.changeStrategyThreshold &&
        fighterHealthPct < this.changeStrategyThreshold &&
        this.choiceRegenCount < this.maxChoiceRegens
    ) {
      this.shuffleArray(this.choices)
      console.log(`Shuffled choice array: ${this.choices}`)
      this.choiceRegenCount++
      this.currentSelection = 0
    }
    const selection = this.choices[this.currentSelection]
    this.currentSelection = (this.currentSelection + 1) % this.choices.length
    return selection
  }

  getArraySelectionSizeForDifficulty (difficulty) {
    return difficultyToSelectionSize[difficulty]
  }

  getStrategyChangeThreshold (difficulty) {
    return difficultyToStrategyChangeThreshold[difficulty]
  }

  shuffleArray (array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  }
}

function getStrategy (difficulty) {
  return new RPSStrategy(Math.max(0, Math.min(difficulty, 3)))
}

exports.getStrategy = getStrategy
