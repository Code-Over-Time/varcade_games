# De-duplication

**Category**: Backend Development

**Level:** Senior

**Tag:** v0.0.1 

## Description
The Matchmaker and Stats Tracker projects are quite similar in how they operate. Both are web servers that use Flask. Both store data in Redis. And both also have a background process that runs independently of the web server, processing data in the background. 

Currently both projects actually use the exact same code to run their background processes - however is code is duplicated across both projects, which is a problem.

If we want to change this code we have to do it in two places, which results in additional development overhead and can lead to inconsistencies (imagine if you make a change in one place but forget to update the other, resulting in different behaviour from what you thought was the same code!).

We need to extract this code out of both the matchmaker and stat tracker projects, create a library from it and then use that library in both projects.

This way if we need to make changes to this code we only need to do it once, and then run that code in both projects.

The code in question exists in:

* `matchmaker/matchmaker/workers/worker_manager.py`
* `stats_tracker/stats_tracker/workers/worker_manager.py`

If you open both those files you should find them to be exactly the same.


## Deliverable
1. A new Python library that contains the `worker_manager` code that is currently duplicated in both the matchmaker and stats_tracker projects. This library should also include tests (there are existing tests for the worker manager).

2. Updated matchmaker project that:

	* Has a dependency on your new library

3. Updated stats_tracker project that:

	* Has a dependency on your new library

4. Updated build scripts to ensure the new library is loaded correctly as a dependency when building new docker images.

## Acceptance Criteria
* Varcade Games must work exactly the same as it did before, end to end - but using a shared library for the worker process, not code duplicated in two places. 

***

## Task Tips!
* You will sometimes find code duplication like this in real world projects. Sometimes it's done in an attempt to save some time, but in the long run it will almost always end up costing far more time in maintenance overhead
* You will need to create a Python library to solve this problem - you will be able to find plenty of resources online that explain exactly how to do this. The first step will be taking this duplicate file and putting it in a new folder at the root of the project (ie. in the varcade_games folder). You can name this folder whatever you want, but it should be somewhat descriptive of the functionality of the code.
* There are a number of ways you can handle including your new library in the matchmaker / stats tracker projects. You could create an 'artifact' that lives in Github that is downloaded and installed like the rest of your Python dependencies. You could also just update the local build scripts to include the dependency from the local file system.
* There is actually an example of sharing code like this already in Varcade Games. The game engine for Rock, Paper, Scissors Apocalypse is shared between both the client and the server. See `game_rps/game_engine` and how it is integrated in both the client and server projects.
