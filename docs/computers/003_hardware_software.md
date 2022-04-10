# Hardware VS. Software

## Hardware

Now that we are more familiar with the anatomy of our robot and how to program it we should stop to look at some more common computer terms that are useful to know and various different types of software. 

In the last section we talked about our CPU, RAM and harddrive. These components are known as hardware. The word ‘hardware’ is used to describe all physical components of a computer, including our mouse, keyboard, monitor and graphics/sound cards. 

When it comes to hardware, people will generally be most interested in the CPU, RAM and graphics card. Knowing the specifications of these pieces of hardware is enough to tell us how fast we can expect the computer to run as well as how many programs it can handle running simultaneously before it starts to slow down and become unresponsive. 

### CPU
   
We briefly mentioned CPU performance earlier and used the word ‘gigahertz’. This word is actually composed to two words, the second being the most interesting: hertz. This is a word commonly used in physics and engineering and simply means ‘cycles per second’ or ‘frequency’. 

If you look at an ordinary clock, the seconds hand ticks once every second, so it could be said that it is running at 1 hertz. If you have any experience with music theory you will be familiar with the measure of beats per minute, which is a similar concept. If you use public transport and your bus comes once every hour, you could call that the frequency of your bus - or buses per hour. 

In fact we can invent a new unit of measurement right now: ‘Burtz’, which means buses per hour. The bus that I take every day runs at a frequency of 3 burtz, meaning three of them come within the space of an hour. I would have to wait around less if that frequency was increased. If the buses ran at 12 burtz it would mean there would be one every five minutes, which would be great! 

Back to our CPU and its ‘cycles per second’. For simplicity sake, lets think of a cycle as being the execution of a single instruction. So earlier on when we said our CPU transferred our sandwich program from the hard drive to RAM, this would have been millions of operations. Which means that it’s a good thing that the first part of the word ‘gigahertz’ means ‘billions’. 

So then we say our CPU is running at ‘2 gigahertz’ it means that it can perform a whopping 2 billion operations every second! Remember this the next time you get angry at your computer. That poor little processor is working incredibly hard trying to keep up with the demands of modern software. Each program running on your computer is like an angry customer in a packed restaurant shouting at a single waiter who is struggling to keep up with their orders.

### Bits and Bytes

When it comes to memory and storage we used a different word: ‘gigabytes’, or ‘gigs of RAM’. The ‘giga’ in this word means the same thing but the ‘bytes’ is very different. You may have guessed that ‘gigabytes’ means ‘billions of bytes’, and if so then you guessed correctly. 

But what is a byte? 

Answering that question requires that we look at something called a ‘bit’ first. A ‘bit’ in computing is the smallest unit of information that a computer can work with. 

When thinking about human language, the smallest unit of information would be a letter. Words are made of letters, sentences of words, paragraphs of sentences, chapters of paragraphs and books of chapters. Letters aren’t composed of anything else like sentences, paragraphs and chapters are. We can’t break down a letter any further. 

A bit is to a computer what a single letter is to natural language. On it’s own a letter cannot do much, but once we start creating sequences of letters we end up with books that contain huge amounts of information. In computing we do the same with bits. 

In the English alphabet there are 26 letters, but for a computer’s alphabet there are only two bits: 1 and 0. A byte is just a sequence of eight of these bits. 

So one gigabyte is one billion bytes, which is actually eight billion bits. Don't worry about why we chose 8 bits for now, just know that it's a good number of computers.

So how does a computer that stores a bunch of bits manage to display text and images to us? Well that is actually pretty simple. 

We use certain sequences of bits to represent things. A computer may represent the letter ‘A’ using this sequence of bits: ‘01000001’. So in our RAM if we want to store the letter ‘A’ we will use that sequence, which uses up 8 bits of the billions of bits available to us. 

To illustrate this point let’s imagine we are back in school. You are sitting in a particularly boring class and want to pass a note to your friend. You have been caught doing this before so you and your friend set up a code where you use bits to represent letters, this way your teacher won’t know what you are saying if you get caught again:

<table cellspacing="3" >
    <tr>
        <td>A</td>
        <td>01000001</td>
        <td>N</td>
        <td>01001110</td>
    </tr>
    <tr>
        <td>B</td>
        <td>01000010</td>
        <td>O</td>
        <td>01001111</td>
    </tr>
    <tr>
        <td>C</td>
        <td>01000011</td>
        <td>P</td>
        <td>01010000</td>
    </tr>
    <tr>
        <td>D</td>
        <td>01000100</td>
        <td>Q</td>
        <td>01010001</td>
    </tr>
    <tr>
        <td>E</td>
        <td>01000101</td>
        <td>R</td>
        <td>01010010</td>
    </tr>
    <tr>
        <td>F</td>
        <td>01000110</td>
        <td>S</td>
        <td>01010011</td>
    </tr>
    <tr>
        <td>G</td>
        <td>01000111</td>
        <td>T</td>
        <td>01010100</td>
    </tr>
    <tr>
        <td>H</td>
        <td>01001000</td>
        <td>U</td>
        <td>01010101</td>
    </tr>
    <tr>
        <td>I</td>
        <td>01001001</td>
        <td>V</td>
        <td>01010110</td>
    </tr>
    <tr>
        <td>J</td>
        <td>01001010</td>
        <td>W</td>
        <td>01010111</td>
    </tr>
    <tr>
        <td>K</td>
        <td>01001011</td>
        <td>X</td>
        <td>01011000</td>
    </tr>
    <tr>
        <td>L</td>
        <td>01001100</td>
        <td>Y</td>
        <td>01011001</td>
    </tr>
    <tr>
        <td>M</td>
        <td>01001101</td>
        <td>Z</td>
        <td>01011010</td>
    </tr>

</table>

As we can see, each letter of the alphabet is represented by a unique sequence of bits. 

To test your system you start by writing the most basic message you can think of: “Hello”. Substituting each letter in the word hello for the bits in the above table we get this:

01001000 01000101 01001100 01001100 01001111

It’s perfect! No one will be able to read our message unless they know that you have to take a sequence of eight bits and convert it to a letter before you move on to the next eight bits. 

Your friend knows that each group of eight bits represents a letter so they simply need to take each ‘byte’ and look it up in the table above. 

This sequence of bits is exactly how a computer would store that word in its memory. And while this is very time consuming for humans to read and work with, the same is not true for a computer. In fact, using modern RAM, a computer can transfer up to 20 billion of these bytes to and from RAM every second! 

A computer will store your images, music, videos and text files in the same way. The programs you use every day know how to read that information and display it on your monitor in a way that you understand, just like our friend was able to take our message and use the table of letters to figure out exactly what it said. 

You may now be thinking that the programs that allow us to watch videos and look at pictures must be insanely complex! Well the answer is yes and in fact it is probably even more complex than you think, so let’s take a closer look at the world of software.

## Software

Earlier on we created a sandwich making program for our robot. This is software. It is not a physical thing that we can touch like our hardware. 

Even though we only wrote one program for our robot, this does not mean that it only has one program to run. Our robot already knew how to walk so it must have had a program for that. It was also able to enter training mode when we told it to, so training mode must be another program. 

We also learned that in order to run our program it had to transfer that program from its harddrive to its RAM, so it needed a program to do that too. 

The software that manages all of these basic but crucial functions of our robot is known as the operating system, or OS.

You will most likely be familiar with at least one operating system. If you use a computer it is likely running either Windows (on a PC) or OSX (on a Mac). There are many more operating systems (you may have heard of Linux), but Windows and OSX are by far the most common in consumer computing. 

At the time of writing this, if you have a smartphone chances are it is either an iPhone or an Android phone. IOS is the operating system that runs on an iPhone and Android is an operating system that many different companies use on their smartphones (Samsung, LG, Motorola, HTC etc…).

When you turn on your computer or phone or tablet you are starting the OS. This is a very complex piece of software that manages all of the information stored on your harddrive, how it is transferred to and from RAM and how all of this information is displayed on your screen. It is not one single program but a collection of programs that work together to allow you to use your computer. 

When you create your own program, like our sandwich making one, you are working within the bounds of the OS. This means you may be limited in what you can actually do based on the OS. If you write a program for an iPhone, for example, the OS will not let your program access other programs. If it did I could easily write an app that looks at all of your private emails and message. 

The OS will keep the apps isolated from each other for security reasons. 

Most operating systems will also come with some utility programs installed, such as a web browser for accessing the internet, a calculator, a video player and a music player. These are often created by the same company that built the OS, but aren’t a core component of the OS itself. 

On top of that you have what would be known as ‘third party software’. This is software that is created by people or companies that are independent of the OS manufacturer. If you play games on your computer or phone they were most likely made by a third party and had to be built specifically to run on the device you are playing it on. 

This sort of software needs to be installed on your computer. Installation is simply the act of copying the software from some external location to your hard drive. Traditionally this was done using things like CDs, DVDs or floppy disks (some readers may not be old enough to remember floppy disks, but they did not hold very much information and you often needed several of them to install a single program). 

More recently the trend has moved towards downloading and installing programs from the internet. If you have ever installed an app from your phone then you have done this. 

In order for software to exist we need hardware and hardware without software is all but useless. It is a symbiotic relationship where both components depend entirely on eachother. 

As the software we build gets more and more complex this relationship is put under more and more strain as we push the hardware to its limits. Computer games are the perfect example of this. Games have gone from simple 2D boxes and basic sounds to photorealistic 3D worlds with amazing sound effects in a remarkably short period of time. Graphics programmers have been pushing the limits of hardware for decades. 

We have also made computers far more accessible than they ever were before. Most people today wouldn’t even know how to begin interacting with a computer from the 1980s, so it is very clear that we have come a long long way. Just look at smartphones. They are computers, but the barrier to entry is a lot lower. Children and adults alike can pick one up and intuitively understand how to use it.

## Final Thoughts

I hope that this has helped you to understand what is going on inside that magic little box that lets you go online and watch videos, or chat with friends while buying new clothes and accessories. 

You will hopefully have also learned why working with computers can be very challenging and that software engineers have a tough job to do. I am also hoping that the next time you are faced with a frustrating situation you will be better prepared to actually do something about it. If your computer is running slow it is likely doing too much. If something is not working as expected you may have found a bug. 

Next we should look a little more closely at what happens when we connect computers together. You likely use the internet on a near daily basis, so that is what we will talk about next.