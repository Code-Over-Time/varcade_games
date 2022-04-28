# Listing Images

**Category**: Developer / Build Tools

**Level:** Junior

**Tag:** v0.0.1 

## Description

There are a few `Make` commands that you have already used and will be using all the time:

* make ps
* make ls
* make build
* make start
* make restart
* make logs

This covers a lot of what we need to do when working on Varcade Games, but there's another command that would be useful.

Sometimes you need to access a running docker image using your command line interface. In fact, you've done this already as part of the development environment setup, when you had to initialize the game database. The command you ran looked like this:

```bash
docker exec -it game-portal bash
```

What this command does is connect to a virtual machine that is running inside Docker. In this case it connected to the game portal - which is the server that runs the main Varcade Games website.

This is a bit of a tedious command to have to write every time you want to connect to one of your Docker images. It would be great if we had a convenient make command to do this, just like we have convenient commands to build, start and run our services. Something like this:

```bash
make shell a=game-portal
```


## Deliverable

Add a new makefile command that connects to a Docker image shell.

This make command will mostly consist of the command listed above: `docker exec -it game-portal bash` - however we don't just want the 'game-portal'. We might want to connect to the `matchmaker` image for example, or `game-rps`. 

The format should be similar to existing commands. For example to view logs for a service the command is: 

```bash
make logs a=game-portal
```

So to view images for a server the command should be:

```bash
make shell a=game-portal
```

You should be able to copy and existing command and make the necessary change to get the above results.

## Acceptance Criteria

* You must be able to connect to a running docker container using the command `make shell a=<container name>`

***

## Task Tips!

* The Makefile is in the `build_tools` directory
* You can just copy and modify one of the existing commands (check out the 'snapshot_game_portal_db' as an example. It just runs a command, like what we need to do here)