# Settings Menu

**Category**: Web Frontend Development

**Level:** Mid

**Tag:** v0.0.1 

## Description

In the Rock, Paper, Scissors Apocalypse client the main menu currently displays two menu options (single and multi player) as well as two settings buttons. These buttons enable and disable music and sound effects in the game.

This setup is not ideal as we will likely want to add additional settings in the future and this will create a cluttered UI. For example we may want to add settings that skip cut scenes or increase/decrease game speed in single player mode. With the current UI this would result in a total of 4 settings buttons on the main menu, the function of which would be difficult to communicate to the player.

What we want to do instead is have a single 'settings' button on the main menu. When the user clicks it a pop up window is displayed (this type of window is often called a 'Model'). That settings window should display the various game settings - currently limited to enable/disable music & sound effects.

## Deliverable

Update the Rock, Paper, Scissors Apocalypse game client so that:

1. There is a settings menu button on the main menu
2. Clicking the settings menu button open a modal popup with options to enable/disable music and sound effects
3. Setting selections are persisted locally in the users browser

## Acceptance Criteria

* The main menu scene has a single settings button
* Clicking the settings button opens a modal window in game and displays buttons for enabling disabling music and sound effects
* If a player refreshes the page, or closes and reopens the browser their setting selections should be preserved

***

## Task Tips!

* There is already a generic settings icon in `game_rps/client/src/assets/packed_textures/global.png` that can be used
* There is already logic for persisting data, see `game_rps/client/src/game_data/save_data.js
* You can design the modal settings window yourself - using icons or not.
