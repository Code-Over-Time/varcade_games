# Skip Cutscenes

**Category**: Web Frontend Development

**Level:** Junior

**Tag:** v0.0.1 

## Description

Every time a player selects `Single Player` mode in Rock Paper Scissors Apocalypse the 'lore' scene is loaded, which shows the back story.

After reading this once players don't need to see it again, so once they skip it once (by hitting the fast forward button) we don't need to show it again.

## Deliverable

Update the RPS game client so that it progresses directly from the VS scene to the single player character select scene after the intro lore has been skipped once already.

## Acceptance Criteria

* The player goes directly to the character select after selecting single player, if they've manually skipped the lore scene once before
* This behavior must persist across multiple play sessions - once the scene is skipped it is never seen again (unless the user clears their browser data). Note: The behavior does not need to persist across different browsers
* Update client README to include information about this behavior

***

## Task Tips!

* You will need to look at this line: `this.scene.start('StoryIntroScene', { gameInterface: gameInterface })` in `game_rps/client/src/scenes/main_menu.js `
* You can use [localstorage](https://javascript.info/localstorage) to store whether or not the lore scene should be skipped 
* You can work with the game client and server directly without having to run through the actual Varcade Games website!
* Once you have the project running, simply point your browser at `localhost:8090` to access the dev game client.
* Any changes you make to the client code will cause this dev client to reload automatically - so you can develop in real time!