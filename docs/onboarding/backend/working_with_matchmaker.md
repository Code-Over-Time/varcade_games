In this section we'll take a high level tour of the Matchmaker could, pointing out key some key areas and concepts.

## Prerequisites

At this point you should have your full Varcade Games stack up and running, but before proceeding let's double check.

From your `build_tools` directory run:

```bash
make ps
```

You should see something like:

```bash
        Name                      Command                State                         Ports                     
-----------------------------------------------------------------------------------------------------------------                                              
game-portal            /bin/sh -c gunicorn game_p ...   Up         0.0.0.0:8000->8000/tcp                        
game-portal-client     docker-entrypoint.sh npm r ...   Up         0.0.0.0:8002->8002/tcp                        
game-rps               docker-entrypoint.sh /bin/ ...   Up         0.0.0.0:8080->8080/tcp, 0.0.0.0:8085->8085/tcp
game-rps-client        docker-entrypoint.sh /bin/ ...   Up         0.0.0.0:8090->8090/tcp                        
gameportaldb           docker-entrypoint.sh mysqld      Up         0.0.0.0:3306->3306/tcp, 33060/tcp             
grafana                /run.sh                          Up         0.0.0.0:3001->3000/tcp                        
matchmaker             /bin/sh -c gunicorn --relo ...   Up         0.0.0.0:5050->5050/tcp                        
matchmaker-worker      /bin/sh -c python game_wor ...   Up         0.0.0.0:5051->5051/tcp                        
prometheus             /bin/prometheus --config.f ...   Up         0.0.0.0:9090->9090/tcp                        
redis-db               docker-entrypoint.sh redis ...   Up         0.0.0.0:6379->6379/tcp                        
stats-tracker          /bin/sh -c gunicorn --relo ...   Up         0.0.0.0:5000->5000/tcp                        
stats-tracker-worker   /bin/sh -c python stats_wo ...   Up         0.0.0.0:5002->5002/tcp 
```

The line you're interested in is:

```bash
matchmaker             /bin/sh -c gunicorn --relo ...   Up         0.0.0.0:5050->5050/tcp 
```

This is our dev build of the game client. Notice at the end of the line:

```bash
0.0.0.0:5050
```

This is telling us that the container is listening on port 5050... so let's try it. In your browser enter 'localhost:5050' in the URL bar and hit enter.

If your setup is working you should see an error. But why would you see an error if the setup is working? The error should look like this:

```
Not Found

The requested URL was not found on the server. If you entered the URL manually please check your spelling and try again.
```

This is because when using the Matchmaker you need to interact with it using specific URLs that we have defined in our Application Programming Interface (API). 

More on this below!

## Entry point

The Matchmaker code is located in  `varcade_games/matchmaker/matchmaker`.

The actual entry point to the code is in `app.py`.

This is the code we run to start the server. It creates and initializes a '[Flask](https://flask.palletsprojects.com/en/2.0.x/) app. It is a 'micro framework' that allows us to run a lightweight HTTP server.

We will use it to create the endpoints that the Matchmaker UI will send create/join game requests to. This is the `Matchmaker API`.

## API

The definition of the Matchmaker API can be found in `matchmaker/lobby/api.py`.

There you will find functions with signatures like this:

```python
@game_lobby.route("/<product_id>/create_game", methods=["POST"])
def create_new_game(product_id):
    ...
```

This is how we register an endpoint with Flask and it is using the concepts of '[Blueprints](https://exploreflask.com/en/latest/blueprints.html)' in Flask.

The blueprint for our lobby is defined earlier in the `api.py` file:

```python
game_lobby = Blueprint("game_lobby", __name__)
```

Here we simple create a blueprint called 'game_lobby'. Back in `app.py` you can see where this blueprint gets registered with Flask:

```python
app.register_blueprint(game_lobby, url_prefix="/game_lobby")
```

This is basically our way to telling Flask "I have a bunch of endpoints I'd like you know know about, they're group conceptually into something I'm calling a lobby".

Once you run the serve you can access your endpoint by visiting the URL of you server and giving the path for your blueprint.

So in the above example we register our blueprint with a `url_prefix`. This means that when ever we access our lobby we will have to use a path like this:

```
http://localhost/game_lobby
```

Now lets jump back to the endpoint mentioned earlier:

```python
@game_lobby.route("/<product_id>/create_game", methods=["POST"])
def create_new_game(product_id):
    ...
```

Here we use a `decorator` to add a route to our blueprint. We also give a path for this endpoint. Let's deconstruct this decorator:

```python
@game_lobby.route("/<product_id>/create_game", methods=["POST"])
```

Basically we are adding a 'route' or and endpoint to our game_lobby blueprint. We are giving that endpoint a path `/<product_id>/create_game`. 

The bit inside the `<angled brackets>` is important here. This endpoint is about creating a game, but what game? Our Matchmaker is generic so we could be trying to create a multi-player game for any game that is registered with the game portal. We've only registered one game so far, Rock Paper Scissors, and we gave it the ID 'exrps'.

So if we want to create a game our endpoint now looks like this:

```
http://localhost/game_lobby/exrps/create_game
```

So a request to this URL will connect to the local server, hit the `game_lobby` blueprint and then get mapped to the `<product_id>/create_game` route.

Once Flask has matched a URL to a route it will extract that product ID and give it as an argument to the function the route is attached to:

```python
@game_lobby.route("/<product_id>/create_game", methods=["POST"])
def create_new_game(product_id):
    ...
```

So our `create_new_game` function is passed the 'product_id' that gets extracted from the URL, which is enough information for it to go ahead and create a game.

### Lobby Endpoints

We've defined three endpoints in our Matchmaker API:

```python
# Create a new multi-player game
@game_lobby.route("/<product_id>/create_game", methods=["POST"])

# Join and existing multi-player game
@game_lobby.route("/<product_id>/join_game/<game_id>", methods=["POST"])

# Fetch all games that are currently open to join
@game_lobby.route("/<product_id>/open_games", methods=["GET"])
```

These endpoints provide the functionality we discussed in the previous section.

All of them require that we specify a product ID so that Matchmaker knows what game it is working with.  

The create and join are the more interesting endpoints because, as mentioned in the last section, they need to talk to the game server.

***

## Game Server API

In `matchmaker/core/game_server_api.py` you will find the the code that allows the Matchmaker to send requests to the game servers.

In order for a game to use this Matchmaker for managing games and player connections to those games it must provide a set of endpoints that conform to what is defined here.

For example, the first function in this file:

```python
def send_create_game_request(user_id, user_name, game_id, game_server):
    """Sends a 'create game' request to the remote game server.

    :param str user_id:                             The ID of the user creating the game
    :param str user_name:                           The username of the user creating the game
    :param str game_id:                             UID of the new game being created
    :param matchmaker.core.GameServer game_server:  the target game server

    :returns:   A dict containing the 'token' for the game that was created
    :rtype:     dict

    :raises GameServerNetworkError: If the response from the remote game server is not a 200
    """
    request_data = {"gameId": game_id, "userId": user_id, "username": user_name}
    return _send_request(game_server, "create_game", request_data)
```

This function with send a 'create_game' request to a game server, just like we saw in the diagrams in the previous section.

The Matchmaker expects that any game server that has been registered with it has some endpoint:

`<game_server_url>/create_game`

The endpoint should also take a `gameId`, `userId` and `username` as input data.

If the game server does not have this endpoint then the Matchmaker will not be able to interact with it.

The game server API has four endpoints that are expected to be implemented by game servers:

```
create_game     - Create a new game on the remote game server
join_game       - Join an existing game on the remote server
remove_game     - Remove a game from the remote server
remove_player   - Remove a player from a remote game on a remote server
```

If you open up `game_rps/server/game_server/app.js` you will find all of these endpoints are defined there:

```js
app.post('/create_game', function (req, res) {
  ...
})

app.post('/join_game', function (req, res) {
  ...
})

app.post('/remove_game', function (req, res) {
  ...
})

app.post('/remove_player', function (req, res) {
  ...
})
```

This is why our Matchmaker is able to create games on the Rock Paper Scissors Apocalypse server.

But our Matchmaker doesn't just send requests to game servers in order to organize games, it needs to keep its own records of the games it have created and it needs to curate those records.

Time to take a look at the data layer.

***

## DAO

A DAO or `Data Access Object` gives us an abstracted interface to manage Matchmaker game data.

It is one of the more complex parts of the code and also the most important.

With the matchmaker we have to account for a lot data consistency challenges, like what happens if two players try to join the same game at the exact same time?

The DAO aims to account for that while also providing a relatively straight forward interface to us in the Matchmaker API.

The DAO code is in `matchmaker/game_data/dao.py`, but before we dig in there let's take a look at it in action. Here is the the code that creates a game using the DAO in our Matchmaker API:

```python
new_game = Game(
        uuid.uuid4().hex,
        product_id,
        game_server.game_server_url,
        user_profile.user_id,
        user_profile.username,
        **game_server.settings,
    )

<snip>

get_game_dao().create_game(new_game)
```

All we need to do is create a `Game` object with the required attributes and then called `get_game_dao()` to get a reference to our DAO and then call the `create_game()` function on it.

This DAO function will take care of adding our game data to our database as well as adding it to the pending set. In fact anyone using the DAO doesn't need to know anything about pending, active or lobby sets. As the user of the DAO you are just creating, joining and fetching lists of games. You don't need to know anything about how that data is managed behind the scenes.

I'm not going to say much more about the DAO - there will be a dedicated course for that. 

For now you can explore yourself and see if you can figure out what is going on.

***

## Making Changes

Making changes to our backend services is a bit different since it doesn't have some UI you can test directly. In order to test to Matchmaker you need the whole Varcade Games stack running so you can verify that it is talking to game server correctly, listening out for events correctly and that its API is working as expected.

A robust set of tests is essential for any server side application, and our Matchmaker is not exception.

### Running the Tests

In your terminal navigate over to the server directory for the website.

For example, if your code is located in `~/code/varcade_games` then you'd run:

```bash
cd ~/code/varcade_games/matchmaker
```

Just like the Game Portal tests we ran earlier, our tests use a docker image.

We build an image with all of the code and tests, then we run the container and run the tests.

This gives us a consistent environment to run our tests in - us and everyone else running these tests will be running with the same dependencies and configurations. 

If we just ran the tests on our dev machine we could get different results due to different configuration.

I've abstracted away most of the complexity of running the tests so all you need to do is run:

```bash
make build_test_image
```

This may take a while... 

Next we run the image as follows:

```bash
make run_test_image_mounted
```

Once it's done you can run the following make commands to run the actual tests:

```bash
make run_tests
```

You should see a whole lot of output after running that command, and it hopefully ends with something like the following:

```bash
======== 97 passed, 44 warnings in 2.55s ========
```

(There are a few warnings... but the tests pass!)

These tests test the functionality of the matchmaker - they tell us if something functional broke.

So let's break something...

Open up `matchmaker/lobby/api.py`.

Find the function called `get_open_games`.

This is the API endpoint that returns the list of open games that players can join.

Change the following line:

```python
available_games = get_game_dao().get_available_games(
        product_id,
        page_index,
        min(entry_count, current_app.config["LOBBY_MAX_PAGE_SIZE"]),
    )
```

to 

```python
available_games = get_game_dao().get_available_games(
        'test,
        page_index,
        min(entry_count, current_app.config["LOBBY_MAX_PAGE_SIZE"]),
    )
```

All we're doing here is making it so the endpoint ignores the product ID given to it and simply inserts 'test'. 

We should expect this to break some stuff since we need a valid product ID in order to fetch any open games for that product. 

Run the tests again with `make run_tests`.

The out put should have changed:

```bash
#<snip>

self = <test_api.TestFindGameAPI object at 0x7f4ae7c64f90>, test_client = <FlaskClient <Flask 'app'>>

    def test_view_available_games_success(self, test_client):
        response = test_client.get(
            f"game_lobby/{self.test_game.product_id}/open_games",
            headers=[("Content-Type", "application/json")],
        )
        # No games create yet
        assert len(json.loads(response.data)) == 0
    
        self.dao.create_game(self.test_game)
        self.dao.publish_game(self.test_game)
    
        response = test_client.get(
            f"game_lobby/{self.test_game.product_id}/open_games",
            headers=[("Content-Type", "application/json")],
        )
    
        game_list = json.loads(response.data)
>       assert len(game_list) == 1
E       assert 0 == 1
E         +0
E         -1

tests/lobby/test_api.py:446: AssertionError


#<snip>

========== 2 failed, 95 passed, 42 warnings in 2.63s ===================

```

In this output we can see that we now have a failing test. It is failing for the exact reason we made it fail. We have a test that tries to fetch a list of open games for a specific game:

```python
    def test_view_available_games_success(self, test_client):
        # Send a request to the 'open_games' endpoint
        response = test_client.get(
            f"game_lobby/{self.test_game.product_id}/open_games",
            headers=[("Content-Type", "application/json")],
        )
        # No games create yet
        assert len(json.loads(response.data)) == 0

        # Manually create a game
        self.dao.create_game(self.test_game)
        self.dao.publish_game(self.test_game)

        # Fetch list of available games
        response = test_client.get(
            f"game_lobby/{self.test_game.product_id}/open_games",
            headers=[("Content-Type", "application/json")],
        )

        game_list = json.loads(response.data)

        # Our test fails here
        assert len(game_list) == 1
        assert game_list[0]["game_id"] == self.test_game.game_id
```

The reason our test is now failing is because it creates a game with a product ID of 'test_game.product_id', BUT our change just overwrites the actual product ID with 'test'. This results in our endpoint returning an empty list since 'test' is not a valid game and therefore can't have any open games.

Revert the change and run the tests again to see them passing once again.

### Coverage

Now try running:

```bash
make run_coverage
```

This tells us how much of our code is covered by tests:

```bash
----------- coverage: platform linux, python 3.7.8-final-0 -----------
Name                                            Stmts   Miss  Cover   Missing
-----------------------------------------------------------------------------
matchmaker/__init__.py                              0      0   100%
matchmaker/app.py                                  28      2    93%   25, 49
matchmaker/config.py                               34      4    88%   53, 56-58
matchmaker/core/__init__.py                         0      0   100%
matchmaker/core/game_server_api.py                 30      0   100%
matchmaker/core/game_servers.py                    29      0   100%
matchmaker/game_data/__init__.py                    0      0   100%
matchmaker/game_data/dao.py                       110      0   100%
matchmaker/game_data/models.py                    122      2    98%   69, 168
matchmaker/game_worker.py                          40     40     0%   1-67
matchmaker/lobby/__init__.py                        0      0   100%
matchmaker/lobby/api.py                            94      0   100%
matchmaker/workers/__init__.py                      0      0   100%
matchmaker/workers/event_stream_workers.py         79      4    95%   89-93, 103-107
matchmaker/workers/game_management_workers.py      60      1    98%   115
matchmaker/workers/worker_manager.py               33      2    94%   61-62
-----------------------------------------------------------------------------
TOTAL                                             659     55    92%


```

AS I mentioned before, code coverage is a useful indicator about how much test coverage you have *but* it's important to understand that 100% coverage doesn't mean you have bug free or high quality code.

Don't use coverage it as a target, use it as a guide.

### Type Checking

For our Python projects we also have some type checking.

Python is a dynamically typed language, meaning we have no compiler to tell us about errors and we often have to wait until we are running the code to know whether it even runs.

Enter Mypy.

Mypy is a static type checker that will analyze our code and tell us if there is any in there that might be problematic.

You can run the type checker against the game portal by running:

```bash
make run_type_checking
```

Which should result in some output like:

```bash
    echo "Running Mypy against web app" && \
    mypy --ignore-missing-imports app.py && \
    echo "Running Mypy against game worker" && \
    mypy --ignore-missing-imports game_worker.py'
Running Mypy against web app
Success: no issues found in 1 source file
Running Mypy against game worker
Success: no issues found in 1 source file
```

You should run your tests and type checking before you commit any changes to the repository.

***

That's it for the Matchmaker for now. The Matchmaker server at least - you may have noticed that I have yet to mention anything about the event stream events we looked at in the last section.

We need to talk about workers...