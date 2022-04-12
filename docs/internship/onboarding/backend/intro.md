Now we're entering the depths of the server side.

It's dark and full of terrors and our only guiding light is the logging and metrics we have in place.

We're back in `Python` land and it's time to have a look at the Matchmaker and the Stats Tracker.

These services are pure backend, meaning there have no visual interface at all. No client to speak of. Changes to this code aren't always immediately visible in our product.  

So when we're working with our backend services we need to be sure we have good logging in place as well as metrics to help us understand exactly what is going on.

We won't dive too deep into these services just yet as this is an onboarding course and the goal is to get a high level view of everything. But we will look at key sections and concerns, such as transactional data management for our matchmaker and Redis streams for passing data around between our services.

But first, a quick overview of both of our backend services.

## Matchmaker

The Matchmaker is a service that allows players to connect with each other and player games over the internet.

Our implementation of a Matchmaker is very basic, it simply manages a central store of games that players have created.

When a player creates a game the matchmaker will make it public so that other players can see and join it.

Once all players have joined a game the matchmaker will remove it from public view as no new players can join.

Our matchmaker is also responsible for handling error scenarios. For example, what happens if a player creates a game but never joins it? Or what happens if two players try to join the same game at the same time but there is only one slot available? Or worse still, what happens if multiple players join a game, start playing, but then one of them leaves?

These are the sorts of things we need to be thinking about when it comes to matchmaking.

## Stats Tracker

The stats tracker is a very simply service. All it does is listen out for game events and then record some of them.

It supports leaderboard tracking and player stat tracking. This means that any game hosted on Varcade Games can hook into the service and have its own leaderboard and player stats.

In our case we track interesting stats like 'how many times does a player select Rock'.

## Redis Streams

Both of these services are built on top of an in-memory database system called Redis. More specifically, we're using [Redis Streams](https://redis.io/topics/streams-intro){:target="_blank"}.

It's worth having a look at the Redis docs and getting a sense of what it is before continuing with this section as both of our backend services rely heavily on Redis.