# Robot Anatomy

Everyone computer has a few core components, most of which you will no doubt have heard of:

* CPU
* Memory (or RAM)
* Hard drive
* Motherboard

And most will have other components that you will definitely have heard of:

* Keyboard/Mouse
* Monitor
* Speakers

So how do these familiar words apply to our robot? Let’s start with the fact that we told our robot what to do by speaking to it. We issued commands one after another and our robot executed them. This means the robot must have ears right? The technical term for ‘Robot Ears’ is one we are all familiar with - a microphone. A mouse, keyboard or the touch screen on your phone will work the same way, except we do not use our voice, we interact through touch. These are all known as input devices. 

You may have seen the letters I and O used like this: I/O. You may have also guessed that the I stands for ‘Input’. The ‘O’ stands for ‘Output’. 

In the case of our Robot, the Output is the robot’s actions. So when we told it to open the fridge, the command ‘Open the fridge’ is an input, and the output is the robot opening the fridge. 

When it comes to computers, the output devices we are most familiar with are our monitor, or screen, and our speakers.

Have you ever looked at a picture on a computer? Chances are you did so by using your mouse to double click on a file, or clicked on a friend’s Facebook post. This is your input; you are telling the computer you want to see the picture by clicking on it. The computer will then display that image on your screen; that is the output. We are implicitly familiar with the concept of inputs and outputs in our everyday lives. Have you ever bought a bottle of water from a vending machine? You input a coin and the vending machine outputs your water. Most of our daily actions consist of input and outputs, or actions and reactions - computers are no different.

This gets this a little more complicated if we consider something like the humble text message. When you type a text message on your phone the input is your finger touching the onscreen keyboard (if you are using a touch screen), the output is a letter displayed on your screen. By tapping on the keyboard you are issuing a command - add this letter to my message. The command is received by the phone and it will obediently add the selected letter to your message. 

If you tap the send button you have issued a different command, one that causes the phone to send your message. The output in this case is a message sent from your phone. Interestingly, your output, the message, will become the input on the recipient's phone. Your phone, and your mobile network, have issued a command to their phone - saying ‘notify this person that they have a message’. That person can then tap the open button on their screen, which is a new input, and the phone will display that message, which is the final output.

Let's worry about the complexity of sending messages between devices later, for now let's go back to our Robot.

we know that if we tell it to do something it will do that thing, but how does it turn that command, the input, into the action of doing it, or the output. It needs some sort of transformation to happen in the middle. This is where it is easier just to think of it as magic but of course it isn’t. Essentially it is a combination of two things: 

* CPU (Central Processing Unit)
* Memory 

## Robot Brain

The CPU is one part of the Robot’s brain. It is the thing that takes the input and performs the necessary actions to provide the expected output. 

Remember earlier on when we talked about the robot asking questions about its environment? Is there cheese in the fridge, is it spoiled etc... It is the CPU that is manages this this. It can be used to compare things and take certain actions depending on the state of those things. 

When we create a computer program we are actually creating a plan for the CPU to follow. Let's not worry about **exactly** how the CPU executes our plan right now, just know that it is the CPU that is processing the commands we submit to our robot.

The other half of our robot's brain is its memory. 

In order to function effectively, a CPU needs memory. Our Robot remembers words like ‘Open’ and ‘Fridge’. It also remembers that ‘Open’ is an action and that ‘Fridge’ is a thing. So how is it all connected? 

Firstly the Robot’s ears are connected to the CPU and when the ears detect sound that information is sent to the CPU. The CPU is also connected to the robot’s memory. Once it gets the command from the ears it will send that information to memory. 

To understand why it does this imagine if I asked you add ten different numbers together and then listed the numbers off really quickly. You would probably want to write them down. Once they are written down it is easier for you to add them together. This is the same principle as the relationship between the CPU and Memory. The CPU can store information in memory so that it can work with it later.

If we were to represent this as a conversation between the various components we might end up with something like this:

    Ears: Hey, CPU! You’ve gotta hear this!
    CPU: Ok ears, I’ve got a second to listen to you.
    Ears: Our master said “Open the fridge”.
    CPU: Ok, thanks - hey Memory, I need you to remember this: “Open the fridge.”
    Memory: “Open the fridge”? Got it.
    CPU: Thanks, now I can look at this command properly and figure out what to do

So our command has now been added to memory - but it is not the only thing that is in memory. A robot’s memory represents its understanding of the world in which it lives and how to interact with that world. If we tell it to go somewhere it will walk there because that action (ie. how to walk) is stored in it’s memory.

Once our command is in memory the CPU can look at it one word at a time. 

The first word is ‘Open’, so it will search its stored actions for that action. When it finds the action in memory it will also find out what it means. In this case it will let the Robot know that it will need to use its arms. It also knows that one of the next words in the command should be a thing that can be opened. In our case it is the fridge, which is fine because a fridge can be opened, but if we had said ‘Open the cat’ the Robot wouldn’t know what to do (or it would do something horrible). 

Once it knows we are talking about the fridge it will need to find the fridge, scanning the kitchen for something that looks like a fridge. So it will also need to have a visual description of a fridge in memory so that it knows one when it sees it.

If this is confusing, don’t worry, it’s a complex subject. I don’t expect to turn you into a computer scientist just by reading this little analogy, the idea is simply to understand the role of these components in a computer. I think it would be helpful to stop and think about the implications of what we have learned so far. 

If the robot stores everything it knows in memory, you can safely assume we need a lot of memory. And if the CPU is coordinating inputs and outputs, interacting with multiple components then it had better be fast. 

Have you ever heard someone boast that their computer has “16 gigs of RAM"? This is the amount of memory their computer has, and it is quite a lot by current standards. It means their computer can store a lot of information and actions. 

How about “The all new iPhone has a 2 gigahertz processor”? This is referring to the speed of its CPU - and just like our robot, the faster the better, because your phone is doing a lot of stuff.

Let’s get back to our robot. Once the CPU has found the information it needs in memory it sends it to the arms. This is not unlike how our own brains work. If I told you to open the fridge you will hear my words and your brain will need to think about it for a fraction of a second before it then sends the message, in the form of electrical signals, to your arms. 

This all happens subconsciously of course, but your brain needs to access your memory to see what a fridge is and what opening one involves. These are things you have learned over time, both the language used to describe the everyday items that surround you and what those items look like. A computer needs to be told what these things are, just like you did.

A computer’s memory is also like human memory in the sense that it has short term and long term memory. The short term memory is our RAM (Random Access Memory) and the long term memory is our hard drive. 

A good way to think about this is from the point of view of an actor. Lets imagine an actor has lots of scripts to learn. Sitting on their table is a stack of them. If our actor memorized each and every script then they would be able to recite lines really quickly. On the other hand, if they had not memorized each script they would have to find the script in the pile on the table, open it up and find a passage in order to recite the lines - which of course takes a lot longer. 

The problem that an actor has is that they cannot remember all of those scripts at once. So what do they do? They will likely memorize the script that they know they will be using next and leave the rest of them sitting idly on the table, meaning they can quickly and easily recite lines from the script that they need right now. 

The table is like a hard drive, we can put a lot of scripts there for later use. The scripts are the information that we are storing. In the case of a computer this would be music files, videos, photos or documents. Our actor’s brain represents our RAM. It is limited in storage so it can only hold one script at a time, but it is much faster to work with.

So what does this mean for our robot? Our sandwich making program would be stored on the hard drive because there is no need for it to be taking up the limited space in our RAM. When we tell the robot to run the program the CPU will then transfer it to short term memory so that it knows how to make the sandwich. 

Reading the instructions from short term memory is much faster than reading from the hard drive, so rather than reading and following each instruction one at a time from hard drive, we transfer the whole lot to short term memory and then follow each instruction.

We’re now ready to see the complete picture of what is happening when we tell our robot to make our sandwich:

1. We issue the command: “Run ham and cheese sandwich making program”
2. The command is picked up by the robots microphone ears
3. The command is passed to the CPU and written down in short term memory
4. The CPU reads the command one word at a time
5. The words ‘run’ and ‘program’ tell us to search the hard drive, or long term memory, for a program by the name ‘ham and cheese sandwich’
6. The program is located and transferred from the hard drive to short term memory
7. The robot reads and performs each instruction in the program from short term memory
8. When the robot is finished making the sandwich the program is removed from short term memory
9. The robot awaits the next command

If we hadn’t copied the program into our short term memory it would have taken thousands of times longer to actually read and follow each instruction. This short term memory is, however, much more expensive, which is why there is generally a lot less of it. 

More importantly than that, if we were to switch off our robot everything in short term memory will disappear. This is because it is ‘transient’ storage, meaning we lose all of the information in short term memory if the robot loses power. This could happen because we turn it off, or it’s battery dies or it turns itself off for some reason. Our hard drive, or long term memory, does not work like this, it will remember everything even after losing power. 

I think it’s about time to leave the robot to one side and talk about how all of this actually applies in the real world. How about we watch a video on our computer. In order to do this we will need two things:

* A video file (this could be a movie downloaded from the internet)
* A program that can player videos (usually already available on most computers)

The video file will be represented as an icon on our computer screen. It will have a name and mostly likely a small image to go alongside it, we just need to open it and watch. 

To do this you will need to click with your mouse or touchpad (if on a laptop). That click is the input that tells the computer what to do. Whatever the CPU was doing at the time was interrupted by your request to open the video. It begins the process of loading the program into your short term memory, just like our sandwich maker program. 

You may have already guessed that the video file is also stored on our hard drive, so the next thing our CPU does is start the video player program, which then loads the video into short term memory so it can be played. 

The output of all this? You will see the video play on your monitor. Our video player program will use the CPU in order to process the information in the video file and send it to the monitor.

There is of course a lot more going on behind the scenes but this is the basic principle of all programs. They are stored on the hard drive, loaded into memory and then often work with other information that is also stored on the hard drive. 

Have you ever had a computer that takes a long time to start up? You turn it on and have to wait forever before you can actually use it? This is because the computer is moving a lot of different programs into memory, getting ready for you to use it. Over time our computer seems to get slower and slower but this is more likely caused by more information being transferred between long and short term memory. You may install a new program that runs as soon as your computer starts (like anti-virus software). Now every time your computer starts it will need to move this program to short term memory, meaning it is that much slower at actually starting up.

Now that we have seen how these important components all interact with each other it is worth throwing out a few honorable mentions. You may have heard of a ‘motherboard’. I have spoken a lot about the CPU transferring information between long and short term memory as well as coordinating inputs and outputs. 

It is the motherboard that facilitates all of these communications. Each component is connected to the motherboard in such a way that electrical signals can be sent between them. 

We also have components that are specifically designed to work with speakers and monitors. They handle playing music as displaying fancy 3D game graphics. They are called sound cards and graphics cards. The is also a PSU, or power supply unit, which is responsible for ensuring that all of these components have enough power (electrical power that is) to function properly. 

## Final Thoughts

Now that we have been through all of these core components we can think about answering the question we posed earlier on. Can our robot paint a beautiful picture or write a poem? The answer to that question is technically yes. 

However it would be a hugely complex program to write. Think about how careful we had to be when instructing our robot to make a simple sandwich. Also take into account that we only created a very basic version of that program. Now imagine what it would take to teach it to paint. First off we would teach it the mechanics of painting, ie. using a brush, dipping it in paint and rubbing it on the canvas etc… Everything beyond that will be an immense undertaking. I will let you go down that rabbit hole on your own if you wish; have a think about how you would command the robot to paint a picture or write a poem. The more simple version would be for the robot to simply copy existing images (ie. paint a picture of a person or a landscape that they are currently looking at.
   
It is important to understand that there are things that computers are great at and other things that they are currently pretty bad at. Processing data and storing information is where they excel. 

A computer that can run a series of maths equations much faster and more accurately than a human can. If there is a well defined set of rules, or parameters, to operate within then a computer will likely do the job well (to learn this for yourself just try beating a super computer at chess!). 

Humans on the other hand are far better at things like designing solutions to problems (designing software for example, both technically and visually). We are also better at processing the space around us, whether that means cleaning our house or building a new one - we are incredibly efficient when it comes to navigating the world. We are also much better at just being human, sadness and laughter, joy and heartbreak are all uniquely human attributes that computers today cannot effectively simulate.

There is a test named ‘The Turing Test’ (named after Alan Turing, a hugely important figure in the development of computer science) in which human participants are sat down at several different computers and must chat to one another. They are all in separate rooms while chatting. The trick is that one of the participants is actually a computer program. 

The challenge is to fool the human into thinking they are talking to another human when in fact they are talking to a computer. At the time of writing this there is a website you can go to in order to try this out for yourself: www.cleverbot.com. The website is a simple chat application where you can converse with a ‘chatbot’. A chat bot is an artificially intelligent computer program that will respond to the things you say. You can have full blown conversations with this bot, however it is pretty obvious that you are not talking to a human.