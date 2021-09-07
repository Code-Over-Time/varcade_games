# Build Tools

The `Build Tools` project contains everything you need to run and manage the various services that combine to create `Varcade Games`.

## Core Technologies Used

* [Docker Compose](https://docs.docker.com/compose/)
* [Kubernetes](https://kubernetes.io/)
* [K6](https://k6.io/)

## Project Setup

### Clone the repo

First clone the repo for the Build Tools.

```
git clone https://github.com/theblacknight/build_tools.git  
```

### Clone the service repos

Next you will need to clone the repos for the various different services managed by `Build Tools`:

* [Varcade Games](https://github.com/theblacknight/website)
* [Matchmaker](https://github.com/theblacknight/matchmaker)
* [Stats Tracker](https://github.com/theblacknight/stats_tracker)
* [RPS Apocalypse](https://github.com/theblacknight/game_rps)

```
git clone https://github.com/theblacknight/website
git clone https://github.com/theblacknight/matchmaker
git clone https://github.com/theblacknight/stats_tracker
git clone https://github.com/theblacknight/game_rps
```

### Run the project

Before running the project you need to tell `build_tools` where everything is.

The build tools will look in `/code` by default, but you can override this by setting an environment variable, `ENV_CODE_OVER_TIME_ROOT`, to the path of your code directory.

To do this, create a new file in the `build_tools` project called `.env.local` and add the following line:

```
ENV_CODE_OVER_TIME_ROOT=/your/project/directory
```

Once that's done you can run the entire project by using the following commands:

```
make build
make start
```

Next you need to add the following line to your hosts file (`/etc/hosts`):

```
127.0.0.1   varcade.local api.varcade.local games.varcade.local matchmaker.varcade.local rps.varcade.local
```

You can use this command:

```
sudo -- sh -c 'echo "127.0.0.1    varcade.local api.varcade.local games.varcade.local matchmaker.varcade.local rps.varcade.local" >> /etc/hosts'
```

You can check the status of the applications at any time by running:

```
make ps
```

You can view the log output for all services at any time by running `make logs` from within the build tools directory.

Or individually by running:

```
make logs a=<service name>
```

*Note: You can get the service name from the output of `make ps`.