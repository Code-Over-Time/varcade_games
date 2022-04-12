### Building the applications  

From your terminal, open the `build_tools` directory:

```
cd ~/code/build_tools
```

We'll use `Vim` to create a settings file for our local environment.

If you haven't used Vim before, this may be a strange experience.

First type `vim .env.local` in your terminal and hit `return`. This will result in a blank screen.

Next press `i` to enter insert mode and then type the following line:

```
ENV_CODE_OVER_TIME_ROOT=/home/<your user name here>/code
```

Then press the `esc` key and type `:wq` and hit `return`

If you did everything exactly as I've written above, there should now be a new file in the `build_tools` directory called `.env.local`. This file tells the build scripts where the code is, so it's pretty important.

You should now be able to open this file in VSCode. If you have any issues with Vim you can create the file via VSCode - but it's good to start wrapping your head around Vim now, as it will be useful in the future.

Next we need to install a couple tools for building and running the project:

```bash
sudo apt install make
sudo apt install docker-compose
```

### Building Varcade Games

#### Windows Only

Make sure docker is running (in Windows). Open Docker and open the setting screen to:

`Docker > Settings > Resources > WSL Integration > Enable integration with additional distros` 

Make sure that `Ubuntu-20.04` is checked in the `Enable integration with additional distros` section:

![Docker for Windows settings](/img/docker_for_win_enable_ubuntu.png)

***
 
Back in your terminal, run: 

```bash
make build
```

This will kick off a build of the various different applications. This will take a few minutes as all of the dependencies will need to download.

Nearly there!

***

### Running the applications

All we need to do now is run `make start` from the Ubuntu terminal.

That will start up all of the applications and you can check their state by running `make ps`.

If any of the services fail to start, run `make start` again. 

Before we can actually interact with Varcade Games we need to initialize the database.

Run the following command to connect to the `game-portal` application:

```bash
docker exec -it game-portal bash
```

Next run:

```bash
./manage.py migrate
```

You will see some output like this:

![Database migration output](/img/game_portal_migrate_output.png)

Next run:

```bash
./manage.py createsuperuser
```

You will need to follow a few steps to create your admin user account for managing Varcade Games.

We have one final thing to do - that is set up our local networking environment.

Open `notepad` as administrator.

The select `File > Open` and navigate to `C:\Windows\System32\drivers\etc\` and open the file called `hosts`. The directory may appear empty, so be sure to select `all files` from the drop down at the bottom right that says `text files`. 

Add the following line to the bottom of the file:

```bash
127.0.0.1   varcade.local api.varcade.local games.varcade.local matchmaker.varcade.local rps.varcade.local
```

Save and close notepad.

Now, if you point your browser at `localhost:8002` you should arrive at the landing page for `Varcade Games`.

You can log in with the username and password you entered in the previous step when you ran `./manage.py createsuperuser`.

Unfortunately there won't be much to see. We need to add game.