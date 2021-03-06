# Build Tools

The `Build Tools` project contains everything you need to run and manage the various services that combine to create `Varcade Games`.

## Core Technologies Used

* [Docker Compose](https://docs.docker.com/compose/)
* [Kubernetes](https://kubernetes.io/)
* [K6](https://k6.io/)

### Setup

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

You can use this command (on Linux and MacOS):

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