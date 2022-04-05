Inputs and Outputs
==================

My First Job
------------

When I was a teenager, I worked at a local petrol station ('gas station' for any Americans that might be reading this). I started on the forecourts at the illegal age of 15, pumping petrol, washing cars and generally keeping things clean and tidy.

One day, as I arrived for my afternoon shift, I noticed a couple of people grouped around a black Honda Civic. The group's attention was directed down towards the ground. One of the other guys I worked with was with them. From time to time, someone would lift their head, say something, and get a bit of a chuckle from the group. A little bit of banter would follow, but it would be brief, and attention would return to the ground.

As I got closer, it became clear what was going on.

There was a man laying on his side, by the back right wheel, below the fuel pipe. In his right hand was a rubber tube, the other end of which was in the fuel pipe. The other arm was propping him up a little. His cheeks were pink.

He had mistakenly pumped diesel into his petrol engine'd car. And now he was sat there on the ground, desperately sucking on a hose pipe trying to siphon the fuel back out.

The goal was to suck on the hose pipe hard enough to create a flow of diesel. Once flowing, it would continue to flow until the tank was emptied (amazingly, scientists have not yet figured out exactly how this [siphon](https://en.wikipedia.org/wiki/Siphon) effect actually works!).

The unfortunate car owner did, however, realize his mistake before trying to start the engine, which could have seriously damaged it, resulting in an expensive repair bill.

The Car as a System
-------------------

If we stand back and look at a car, it appears to be a pretty simple system.

You put petrol in. The engine does something. The car can then move and will spit some exhaust out the back.

	Petrol in.
	
	Movement and exhaust out.

Conversely:

	No petrol in.

	No movement, no exhaust out.

So, when we think about our car (in these grossly oversimplified terms), what we have is a thing that requires some input, performs some action, and produces some output.

	Input: Petrol
	
	Action: Running engine
	
	Output: Movement and exhaust

We've also seen that a bad input to our car results in that bad output:

	Input: Diesel
	
	Action: Engine stalls
	
	Output: No movement, damaged engine

What we've got here is an 'Open System':

>An open system is a system that has external interactions. Such interactions can take the form of information, energy, or material transfers into or out of the system boundary, depending on the discipline which defines the concept.

Systems in General
------------------

If we stick with this fairly general view of things, it's easy to see that we can apply our thinking about the car to a whole range of different things.

Why don't you have a think about some of the following examples and what would happen if you gave them bad inputs:

* **The human body**: Food goes in, metabolic things happen, energy and waste come out.

* **Light bulbs**: Electricity in, filament is heated, light and heat come out.

* **Plants**: Sunlight and carbon dioxide in, photosynthesis happens, energy and oxygen out.

* **Paper shredder**: Paper goes in, shredding happens, shredded paper comes out.

* **The water cycle**: Water evaporates from lakes, oceans etc..., condensation happens, clouds and rain out.

You might be thinking that all of the above is overly simplistic. And you'd be right. So what happens when you start to dig in a little bit.

After all, we know there is a bit more to a car than 'Petrol go in, car go vrooom'.

Going Deeper
------------

If we look closer at a car what we will see is that it is actually made up of many smaller systems, all interconnected, exchanging inputs and outputs.

We can look at an engine as a holistic system or we can think about the various individual components. There's the cylinder and piston, the combustion chamber, exhaust values etc...

Each smaller system will have its own inputs, some action to perform, and some outputs. Those outputs may then be fed into another system.

Our bodies are the same. Air enters your respiratory system as you breath. Some filtering and various other things happen to that air before the output, oxygen, is absorbed directly into your circulatory system. From there, it is pumped around the rest of your body by your heart. Many more systems are waiting - the brain, the liver, muscles etc...

How about a vending machine? You input a coin and select your drink (that selection is an input too). The output is the snack of your choosing.

In between the inputs and outputs of this system, there is likely a system for checking the money that was inserted. Another system for displaying how much you still have to pay. On more modern machines, there will be a system for handling contactless payments with your phone. That payment system will then tell another system, let's call it the 'item getter' system, that the payment is complete. The 'item getter' system will then actually get the item. This might involve twirling a small coil until a chocolate bar drops, or moving a robotic arm up and over to your drink selection, before picking it up and dropping it at some outlet.

What's even more interesting about the vending machine with the contactless payment system is just how complex it gets when you really start digging. That system needs to connect to the bank somehow. To do this, it will use the internet. The internet itself is another system. It's composed of millions of connected computers, each of which can be divided into smaller systems.

That quick tap of your card triggers an event that will likely propagate through thousands of specialized computers, over public and private networks, until it arrives at the banks' computer system.

The complexity of it all is staggering - BUT it's manageable if you break it all into small chunks. Small systems. Inputs and outputs.

One final thing on the vending machine. Its input is variable. Unlike the car's fuel tank, which expects only one type of fuel, the vending machine has an array of different items to choose from.

You could use the machine ten times with ten different, equally valid inputs. And as you might imagine, the more available inputs there are, the more complicated things get.

With a single acceptable input, you only need to check one thing. With multiple valid inputs, you need to check that the input is contained within the set of valid inputs.

And what if our vending machine was really fancy and could make any food you wanted? You just need to enter all of the ingredients in their correct amounts. The room for error starts to grow. What if you get an input wrong? It's getting easier and easier to make mistakes as we scale this up.

Now think about what would happen if you had millions of different inputs, all with millions of valid input values?

Well, in that case, you'd have a computer...

That's part of why computers can feel so daunting and complicated - BUT, once again, it's manageable if you break it all into small chunks. Small systems. Inputs and outputs.

What about Computers
--------------------

When it comes to computers, you will often hear people talking about IO.

IO or I/O simply refers to 'Input Output'.

When you look at your computer, what are the inputs and outputs?

With your mouse, you can input clicks. With your keyboard, you can input characters and numbers. The screen is an input too, if it's a touch screen.

These are all things that allow you to provide some input to your computer. So naturally, they are often called 'input devices'.

What about outputs and output devices?

Your monitor or screen seems like the obvious one. This is where the computer shows you webpages or games. The output of the computer is whatever is displayed on the screen. So technically, the output is just light, various different colors of light. It's also worth thinking about the fact that your screen can act as both an input and an output device. Your phone is the perfect example of this.

A printer is also an output device. As are your speakers.

Within the computer, all of the most important components - the CPU, RAM, graphics card, sound card - all act as both input and output devices.

Each one is its own system, and each one receives inputs from and sends outputs to the others.

We won't get into the low level details of this just yet - what's important here is establishing a way of thinking. Of looking at small discrete systems and their inputs/outputs. Once you get used to thinking about things in this way, computers and software engineering become a lot more approachable.

Homework
--------

Over the next week, take a deeper look at your surroundings, wherever you are. Think about the various systems at play. Their inputs and outputs. Their internals and their inputs and outputs.

We're training your brain to think systematically. To break things down into logical, discrete chunks before piecing them back together to reveal the holistic whole.


