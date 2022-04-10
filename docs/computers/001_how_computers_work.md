# How computers work

## The not-so-bright Robot

Whenever I encounter someone getting frustrated with a computer I always try to explain that a computer can only do what you tell it to do. That’s it, nothing more. You provide instructions by pushing keys on your keyboard, clicking your mouse or touching a screen and the computer does its best to execute them. They are obedient, but they are obedient to a fault. They will follow your instructions even if the outcome is bad. 

Let’s look at a simple example. Imagine someone gave you a robot for your birthday. This is a really cool present but the robot is not very smart. It will do whatever it is told but it cannot think for itself. It also has an understanding of the basic objects you find around your house, like furniture, food, pets etc, but it doesn’t know how to interact with them, so you are going to have to teach it. 

Unboxing the robot has left you tired and hungry so you decide to teach it to make you some food. You say: ‘Robot, make me a ham and cheese sandwich.’ Nothing. It simply stands and stares back at you with its emotionless eyes. 

The robot knows what a sandwich is, it also knows what bread, ham and cheese are, but it hasn’t yet learned how to combine them into a sandwich. It looks like you’re going to stay hungry for a while, but teach the robot how to do it once and you will be sorted for ham and cheese sandwiches for life. So you roll up your sleeves and lead your soon-to-be personal chef to the kitchen.

## Programming Your Robot

Having skimmed the robots manual you have enough knowledge to bluff your way through some training, so you begin:

    “Robot - enter training mode,” you say.
    “Ready for training,” responds the robot.
    “Ok, take two slices of bread and lay them on the counter.”

Nothing. 

The robots artificial eyebrows are now in the raised position, indicating that it doesn’t understand the instructions. ‘Ah,’ you think to yourself ‘it doesn’t know where the bread is!’

    “Take the bread from the bread bin”

Still nothing. The robot knows what a bread bin is, but does not yet know how to interact with it.

    “Take the lid off the bread bin.”
    “Affirmative.”

Success! Your robot has mastered step one of making your sandwich. 

    “Take the bread out of the bread bin.”
    “Affirmative.”

You’re getting the hang of this now, time to try the earlier command again..

    “Take two slices of bread and lay them on the counter.”
    “Affirmative.”

    “Go to fridge.”
    “Affirmative.”

    “Open fridge door.”
    “Affirmative.”

    “Take butter, ham and cheese out of the fridge.”
    “Affirmative.”

    “Go to bread.”
    “Affirmative.”

    “Take the lid off the butter”
    “Affirmative.”

Everything seems to be going well, the robot understood all of your commands, or at least it appears that way. That last command, however, has a problem. The robot needs two hands to open the butter so it promptly drops your ham and cheese on the floor and takes the lid off the butter. 

This is a valuable lesson - the robot will do what it is told regardless of the consequences and in this case the consequences are ham and cheese on your floor. You clean up the mess and with angry determination you return to training your robot:

    “Go to drawer.”

The robots eyebrows have raised again. Your kitchen has several drawers and it has no idea which one you want it to go to. At this point you also realize that you never told the robot to put the butter and its lid down, so you issue those commands and try to send it to the cutlery drawer again.

    “Go to the top drawer, beside the sink.”
    “Affirmative.”

    “Open drawer.”
    “Affirmative.”

    “Take butter knife.”
    “Affirmative.”

    “Go to bread.”
    “Affirmative.”

The robot now has everything it needs to make the sandwich. In the process of getting everything it left the fridge and the cutlery drawer open but the sandwich is the goal here, we can deal with the open fridge and drawer later (we will come back to this as it is important, but we are getting really hungry now, so back to the robot).

    “Swipe the knife across the butter.”
    “Affirmative.”

    “Now rub the butter on the slices of bread.”
    “Affirmative.”

The butter distribution on the bread isn’t quite up to your standards, but not bad for a first try.

    “Take one slice of cheese from the packet of cheese.”
    “Affirmative.”

    “Place it on the slice of bread on the left.”
    “Affirmative.”

Getting cocky now you decide to start combining instructions.

    “Take one slice of ham from the packet of ham and place it on the cheese already on the bread.”
    “Affirmative.”

    “Place the slice of bread on the right hand side on top of the ham.”
    “Affirmative.”

The robot obeys here, but you have made another mistake. It didn’t flip the second slice of bread so now the butter is facing up.

    “Flip the top slice of bread.”
    “Affirmative.”

And we’re done! 

You’ve probably never worked so hard for a sandwich in your life, but you have gained a personal sandwich maker. 

For the sake of brevity I have actually left out a lot of possible steps, such as telling the robot that it should steady the tub of butter with one hand before swiping the knife across it. I would imagine that it would probably just knock the tub off the counter if it followed the above steps precisely. There plenty more room for error in the above sequence, can you think of some more examples?

Now that our robot has finished making our sandwich you can tell it to save that sequence of instructions for use in the future. We call this a ‘program’. You have programmed your robot and saved that program for use later on. 

In the future when you want a ham and cheese sandwich you simply need to tell the robot to run that program. The problem with this is that our program was pretty sloppy. Remember how our robot left the fridge and drawer open? Every time you run the program it will do the same again. It will also put the second slice of bread on top of the ham upside down and then flip it every time - not very efficient. 

Luckily we can go back to our program and change some of the instructions or add new ones. This is very important because over time our programs will get larger and more complex, so the more time we invest up front into making sure our robot does things in an efficient, but also neat and tidy, way the better. 

Our program was pretty simple, but that is because we made **a lot** of assumptions about the current state of our kitchen. But what if there is no cheese in the fridge?  Should we make sure the bread is not stale? We definitely want to make sure that the ham hasn’t gone bad before putting it in the sandwich. 

These are all things that we humans have learned to do instinctively over time or through experiences (like food poisoning), so when telling our robot what to do it is easy to overlook them. 

What we need to do with our robot is control the flow of instructions based on the current state of our kitchen and the items that we are interacting with. It’s not particularly hard to do but it is easy to miss things. In order for our robot to do this we can issue commands like this:

    “Open the fridge.”
    “Affirmative.”

    “If there is no cheese then close the fridge and end the program.”
    “Affirmative.”

    “Take the cheese from the fridge.”
    “Affirmative.”

Now we have told our robot that if there is no cheese it should just close the fridge and stop the sandwich making program. The next instruction will only ever be reached if we have cheese because we would have just ended the program otherwise. But what if we want to continue making the sandwich without cheese? Then our instructions would have to look more like this:

    “Open the fridge.”
    “Affirmative.”
    
    “If there is cheese and it is not spoiled then pick it up.”
    “Affirmative.”
    
    “If there is ham and it is not spoiled then pick it up.”
    “Affirmative.”
    
    “Close the fridge.”
    “Affirmative.”

But now we need to take the fact that there might not be cheese or ham later in the program into account. When adding the cheese and ham to the bread we will have to say:

    “If there is cheese then put it on top of the slice of bread.”
    “Affirmative.”

And

    “If there is ham put it on top of the cheese otherwise put it on top of the slice of bread.”
    “Affirmative.”


**This is how our robot makes decisions.**

It can question its environment. Is there cheese? Is there butter? Is the bread stale? Based on the answers to those questions it can make a decision. This gives the illusion that the robot is thinking, but it’s not. It’s more like evaluating. 

At this point it should be pretty clear why computer programming can be so complicated, the more variables there are, ie. the different states that our various items can be in, the more we need to do this sort of questioning.

Inevitably we will miss some state or some combination of states (what if there is no cheese and ham is spoiled, for example) and that is what we call a bug. Most people will have heard of computer bugs; this is how they are created. 

The next time you come across a bug, some situation where you computer is not running as expected, spare a thought for the developers who had to consider thousands of possible combinations of information when creating the software that you are using.

## A Note About Performance

Another thing worth thinking about is what would happen if you started throwing a lot of different commands at the robot? 

    “Take lid off bread bin.”
    “Affirmat…”
    “Go to fridge.”
    “Affirm…”
    “Go to top drawer beside the sink.”
    “Affi…”
    “Take butter from the fridge.”

Our poor robot is frazzled. It can only effectively do one thing at a time and as you keep yelling commands without giving it the appropriate time to respond, it gets less and less responsive. 

Does this sound familiar? Have you ever sat at your computer clicking lots of different things and wondering why nothing is happening? Maybe you hear the fan on your machine starting up or the screen goes funny. This is the same principle - the computer is trying to do too much and the more you try to get it to do, the worse it gets.

## Final Thought

So what was the point of all this? Well first of all, you have just learned a new way of thinking, of breaking down a task into a set of discrete steps and issuing them as commands one at a time in order to teach a machine how to behave. 

**This is computer programming in a nutshell and is something all programmers must learn to do.** 

As a computer user you generally don’t need to think about this because programmers will have done the thinking for you. Just like you don’t need to think much about your car’s engine if you drive a car, you pay engineers to design it and a mechanic to look after it for you.

At some point in the future you may upgrade your robot and that upgrade may come with a sandwich making program. Now you just need to tell your robot to make a sandwich and it will start the sandwich making program that it was given by someone else. You are still using the robot, but you don’t need to worry about teaching it things anymore - other people have done it for you! And since it is their full time job they can make fancier programs. 

They would create a general sandwich making program where you could specify any filling and the robot would try to make it. Maybe they would even connect your robot to the internet so it could find different recipes for sandwiches online and then make them for you. What about scheduling a sandwich? Telling your robot to make you one at some point in the future. Maybe it would check that you have all of the ingredients and create a shopping list for you if you need anything. Think about what that program would look like. It would have thousands of instruction and take a lot of effort to test for bugs. This is why large complicated programs are usually created by teams of people with many different skill sets. Sometimes there will be hundreds of programmers working on different areas of a single program.

We will come back to programming and software engineering (and the subtle differences between the two), but first we need to look at the anatomy of our robot. It will be much easier for you to set your robot up to do cool and interesting things if you understand a bit more about it. We already know that it can handle making a sandwich, but can it create a beautiful poem or paint a masterpiece?