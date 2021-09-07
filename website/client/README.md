# Varcade Games Client

The `client` project is a Vue.js client for interacting with the REST API of the Varcade Games server.

The project includes a docker file for hosting the client so it can be served to the browser.

## Working with the Varcade Games Client

### main.js

`main.js` is where all of the application setup happens. This includes:

* Custom Vue components
* Routing
* State management ([Vuex](https://vuex.vuejs.org/))
* Loading user data from local storage

### views

The `views` directory contains the core elements of the Varcade Games client. More specifically, it houses the `GamePortal` vue - where players browse games, and the `GamePlay` vue - where players actually play games.

These Vues are very lightweight as all of the heavy lifting is done in our custom Vue `components`.

### components

The `components` directory houses all of our custom Vue components.

These components are responsible for displaying:

* Lists of available and coming soon games
* Embedded games
* Leaderboards
* Multi-player player stats
* Matchmaker UI
* Login / registration
* And more bits and pieces....

### Utility Files

The client project also has several utility files that handle:

* `auth.js` for authentication and token management
* `config.js` for managing dev / production configurations
* `matchmaker.js` for Matchmaker integration
