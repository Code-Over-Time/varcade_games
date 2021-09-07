# Game Data

## Data Models

The matchmaker uses the game_data.models.Game class for tracking multiplayer games.

Players are not directly allowed to access the game server create/join/delete game APIs (for security reasons) so the matchmaker stores it's own internal representation of the games that it creates on the game servers.

The matchmaker will then update it's view of the game based on events coming from the standard game server event stream.

### Game State

The 'Game' data model has a state attribute that is updated via events coming directly from the Game Server for that game via redis streams.

The state is used to manage the lifecycle of the game itself and will transition through the following states (in order):

* Created
* Creator joined - Before anyone else joins the game, the player that created it must join first
* All players joined - All of the players required to start the game have joined
* In progress - The game has started
* Ended - The game is finished and can be removed from the DB

## Game Management

Games are managed using three sorted sets:

* Pending
* Lobby
* Active

These sorted sets are all sorted by timestamp so that we can easily prioritise cleaning up any old games that are no longer active but for some reason or another failed to send a 'game ended' message to the matchmaker.

## Pending

All newly created games get added to the pending set. 

They remain in the pending state until the matchmaker has received a 'creater joined' event from the game server.

This allows us to create a game and ensure that the player was successful able to make a socket connection before making that game available to other players.

## Lobby

Once the creator of a game has joined the game we can move it from the 'pending' set to the 'lobby' set.

Once in the lobby set the game will be served up to anyone that all the 'get_open_games' API endpoint.


## Active

A game is active becomes active when it is at capacity / started. 

This transition does not happen until the game server receives a 'game started' event from the game server.

