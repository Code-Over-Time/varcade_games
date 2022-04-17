# Error Handling 2

**Category**: Frontend Development

**Level:** Junior

**Tag:** v0.0.1 

## Description

When a player creates a new multi-player game of Rock, Paper, Scissors Apocalypse, the game will first send a request to the matchmaker, asking it to create a game.

The matchmaker will create a game and store it in its database (Redis). It does this in order to keep track of what games are available for players to join.

It must also send a request to the actual game server, telling it to create the **actual** game. This request happens in `matchmaker/matchmaker/core/game_server_api.py`.

If the request to the game server fails for some unknown reason (if the game server has crashed, for example) the lobby api code will catch the exception and return a 500 error.

The Varcade Games client, however, does not handle this error very well. Currently it will just log an error message to the console (developer tools console), but the user will get no explanation of what happened.

### Steps to reproduce
You can reproduce this issues as follows:

1. Run your local Varcade Games stack
2. Stop the game server using the following commands (assuming you are currently in the project root directory):

```
cd build_tools
make stop a=game-rps
```

3. Open Varcade Games in your browser and launch Rock, Paper, Scissors Apocalypse
4. Try to create a new multi-player game
5. Note that nothing happens when you click the 'create game' button

## Deliverable

Updated website client code that: 

* Better handles cases where an error occurs creating a new multi-player game
* The matchmaker UI should display an error message stating that a new game could not be created and that the user should try again later
	* This error message should appear in the matchmaker UI below the buttons and the text should be red to indicate an error
* The error message that is returned from the server is what should be displayed to the user
* If the user clicks the create game button again the error message should disappear while the new request is made, but be displayed again if the error occurs again

## Acceptance Criteria

* If game creation fails an error message is displayed to the user

***

## Task Tips!

* Handling errors on the client side can be annoying and tedious - but remember the user. Poor handling of errors is a sure fire way to encourage them to stop using your software
* Error handling code can often cause problems as it is easy and tempting to skip testing. As engineers we spend so much time just getting our program to **work** that when we test, we test the 'happy path'. This means we test how the system behaves when everything is working. We often avoid testing what happens when things start to break!
* Critical system failures quite often happen in error handling code, because we fail to test it properly
* The matchmaker UI can be found in `website/client/src/components/wp-matchmaker.vue`