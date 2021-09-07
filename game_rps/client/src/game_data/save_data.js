/**
 *  Utility functions for reading and writing save game data.
 *  Save game data is stored as a JSON object in local storage.
**/
let saveData

function getSaveGameData () {
  if (saveData) {
    return saveData
  }
  return loadSaveGameData()
}

function writeSaveGameData () {
  if (saveData) {
    localStorage.setItem('_rps_save_data', JSON.stringify(saveData))
  }
}

function loadSaveGameData () {
  if (saveData) {
    return saveData
  }

  console.log('Checking local storage for save data...')
  const localRawSaveData = localStorage.getItem('_rps_save_data')

  if (localRawSaveData) {
    saveData = JSON.parse(localRawSaveData)
    return saveData
  }

  console.log('No save data found, initializing...')
  saveData = getDefaultSaveGameData()
  localStorage.setItem('_rps_save_data', JSON.stringify(saveData))
  return saveData
}

function getDefaultSaveGameData () {
  const saveData = {
    characterUnlocks: []
  }

  return saveData
}

function migrateSaveGameData () {
  /**
    This function will take the current stored save game data
    and add any keys that are present in the default save data
    but missing in the current save data.
  **/
  if (saveData) {
    const defaultSaveGame = getDefaultSaveGameData()
    const defaultSaveGameKeys = Object.keys(defaultSaveGame)
    for (let i = 0; i < defaultSaveGameKeys.length; i++) {
      const defaultKey = defaultSaveGameKeys[i]
      if (!saveData[defaultKey]) {
        saveData[defaultKey] = defaultSaveGame[defaultKey]
      }
    }

    return true
  }
  return false
}

export { getSaveGameData, writeSaveGameData, migrateSaveGameData }
