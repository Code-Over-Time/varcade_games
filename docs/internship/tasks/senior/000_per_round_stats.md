# Per Round Stats

**Category**: Fullstack Development

**Level:** Senior

**Tag:** v0.0.1 

## Description

When you load a game in the Varcade Games web client it will display a leaderboard and some multi-player stats for the currently logged in player.

Currently the multiplayer stats sections displays the following stats:

* Games played
* Games won
* Games lost
* Number of times the player selected Rock
* Number of times the player selected Paper
* Number of times the player selected Scissors
* Number of times the player selected nothing

We would like to add some additional stats here. Specifically we would like to track the number of rounds won/lost.

Each individual game of Rock Paper Scissors can have a max of 5 rounds (if each player wins 2 rounds and then one player wins the final round to take the match).

## Deliverable

1. Update the Rock Paper Scissors game server so that:

	* It emits an event every time a player wins or loses a round

2. Update the Stats Tracker so that:

	* This new stat is tracked and stored
	* The new stats are returned from the stats API

3. Update the Varcade Games web client so that:

	* This new stat is displayed in the UI

## Acceptance Criteria

* Two new stats are visible in the Varcade Games UI
* These new 'rounds won' and 'rounds lost' stats update after a multi-player game has been played
* Unit tests and integration tests updated on the stats tracker, rps game server and Varcade Games web server

***

## Task Tips!

* This is a full feature that touches three distinct sections of the project - you will want to test each of the changes independently and all together as a single feature. This can be one of the more challenging parts of working on a distributed system. 
