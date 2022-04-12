# Error Handling

**Category**: Python Backend Development

**Level:** Junior

**Tag:** v0.0.1 

## Description

When a player loads a game in Varcade Games, the web server (`website/server`) will send a couple of requests to the stats server (`stats_tracker/`) to fetch the leaderboard and player stats for that game.

If you open up `website/server/game_portal/game_portal/games/services.py` you will find the code that sends these requests.

The problem with this code is that it does not handle error scenarios. If the request fails for any reason and an exception is thrown it will not be handled gracefully and the server will return an uninformative 500 error.

Both the `get_leaderboard` and the `get_player_stats_for_game` functions need to be updated to handle error cases.

If an error occurs it should be captured, and a helpful error message should be logged.

Also, an error in either of these requests should not cause the whole request to fail. Instead the API should be updated so that it returns an `empty` response for the leaderboard or player stats (or both - depending on what failed). The API should however indicate that an error occurred so that the client can display an error if it wants.

## Deliverable

Updated website server code that: 

* Better handles cases where an error occurs when sending a request to the stats service.
* API returns empty result for either leaderboard or player stats (or both) if there is a request errors
* API is updated to include a flag that notifies the client that an error occurred
* Unit / integration tests are updated to verify the changes

## Acceptance Criteria

* The stats service can go offline without affecting the Varcade Games website
* The Varcade Games client is notified when leaderboard/player stat data is not returned

***

## Task Tips!

* When working on a task like this it is always worth reproducing the issue first. You should try and force the error scenario so you understand exactly what is happening currently, before making any changes.
* You can stop the stats server manually using the make commands in build tools - this will cause both requests to error, but you will still need to figure out a way to test what happens when one request errors out but the other doesn't