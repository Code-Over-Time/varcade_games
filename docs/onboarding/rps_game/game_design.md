I want to talk briefly about some of the game design decisions behind Rock Paper Scissors Apocalypse.

It's a very simple take on Rock Paper Scissors so it shouldn't need that much explanation.

## Gameplay

For this game I wanted to capture the feeling of playing an old arcade style fighting game.

There's a single player mode where you face a gauntlet of AI opponents and a multi player mode where you face other humans.

The flow of the single player mode is fairly standard:

    Character select -> VS Screen -> Fight Screen -> Next opponent or Game Over

These fighting games often have a thin story line explaining why its diverse array of characters decided to get together and fight. 

Rock Paper Scissors is so ridiculously simple that I wanted to put a really over the top story behind it, hence the 'Apocalypse' part of the game. The characters are trying to save the world by playing this game.

When you select single player mode you are greeted by this storyline, after which you get to select the character you want to save humanity with.

## Player Stats

Once you're at the character select screen you have a decision to make - what character do you want to play as?

I wanted to add a element to strategy and tactics to the game, so each character has some strengths and weaknesses.

[![Screenshot of character stats UI from the game](img/character_info_box.png)](img/character_info_box.png)

The way this works is as follows:

* All characters have the same health, in battle the player that loses all of their health loses the current round of the battle
* There is a base level of damage that all players do
* If a player's weapon selection defeats their opponent, then their `attack bonus` for that weapon is added to the damage done
* If a player's weapon selection loses to their opponent then their `defense bonus` reduces the damage received

So, for example, in the screen shot above our character has +40% to their scissors damage.

With a base damage of 20, their scissor damage becomes 28. 

This character also has -10% against paper. This means that when they select rock and their opponent selects paper they will mitigate some of the damage. That 20 base damage done by the opponent becomes 18.

So in terms of strategy, if you are facing this character you want to be careful when selecting paper - because their scissors will do a lot of damage to you.

The way I tried to balance this was to give every character a value of 50% to use on their attack and defense stats. The character above put most of that value into scissors so that they have one devastating attack. Other characters spread the 50% out more evenly so that they are generally stronger (eg. +10% to scissors and paper attack, -10% defense against everything).

The equation for calculating damage looks like this:

```
baseDamage * (1 + attack - enemy defense)
```

All of this data is available in the `game_data.js` file of the game engine. The calculation itself appears in the `game_models.js` file in the `Weapon` class.  

### Botch

If a player makes no selection then the 'botch' hand is automatically selected. This selection does no damage and loses against all weapons.

If both players fail to make a selection (can happen in multi player) then both will receive damage when 'botch' is used. This is so that the game will end by attrition rather than continue forever.

## Difficulty Progression

Once a character is selected in single player mode, the player will face a series of battles with the other characters in the roster.

As the player progresses their opponent will get more and more difficult. Here's how it works.

AI opponents will simply select a pattern of weapon selections. So the AI will have a predefined set of choices that it will make.

For example, the easiest character will take a list of selections:

    [rock, paper, scissors]

And then shuffle that list, which might end up looking like this:

    [paper, scissors, rock]

That AI opponent will then simply select paper, then scissors, then rock over and over again.

The player simply needs to figure out the pattern and they will easily defeat their opponent.

To make this more difficult we simply add selections to the list. So the second AI character the player faces will start will a list:

    [rock, paper, scissors]

Then a random weapon and add it to the list, eg:

    [rock, paper, scissors, paper]

Then is will shuffle that list:

    [paper, scissors, rock, paper]

And that's it. Now the player has a longer pattern that is more difficult to figure out and remember.

At this point, however, we also introduce some more variance. The AI opponents will change up their pattern once they've received enough damage.

So, for example, an AI opponent may have the following list:

     [paper, paper, scissors, rock]

BUT when their health drops below 30% they reshuffle the list to try and throw the player off, so the pattern changes to:

     [paper, scissors, paper, rock]

Following this format we can add new opponents and simply extend their pattern by one each time and adjust the point at which they reshuffle in response to damage received.

## Character Unlocks

At the time of writing the game has four main characters. Two and unlocked and two are locked.

In single player mode you unlock the additional characters by beating all of the standard characters in single player with the two default characters.

For example, Aruka faces off against the following characters in single player:

* Manbo     (unlocked) 
* Raden     (locked)
* Hogo Sha  (locked)

Aruka's final character is Hogo Sha, and if he wins he will unlock Hogo. Similary Manbo, who starts unlocked, will unlock Raden once she defeats here.

This leaves one final character that is locked - the boss.

## Beating the game

The final bit of game design worth talking about is the final boss.

Players don't get to face the final boss just by defeating all of their opponents... I wanted to make the game a little more difficult than that.

They need to beat all of their opponents **without losing a single round**. 

If they lose a round they will get a game over screen and a character unlock message. If they win every round they play - then they get to face Mainyu... the final boss.

Mainyu doesn't use a strategy like the other characters. It's selections are completely random, which makes it really difficult to play against (random selections are the most difficult in Rock Paper Scissors. Humans think they can be random, but often fall into patterns - so it is possible to be good or bad and this game, which most put down to chance).

Once Mainyu is defeated, it will be unlocked.

Good luck!

***

That's about it for game design for now.

Hopefully this has highlighted just how complex even a seemingly trivial game like Rock Paper Scissors can be.

Some of the strategy games I've worked on in the past have had tens of thousands of rows in spreadsheets filled with data about character stats, economy management, buffs etc... 

If you plan on making a game my recommendation would be to pick a simple but solid (and fun!) core gameplay mechanic and focus on getting it right. Keep it simple, then when it works add complexity around it. 

Complexity is easy to add - fun isn't. Focus on the fun.

Speaking of fun, what's more fun than playing with and against other people? Let's move on to the game server.