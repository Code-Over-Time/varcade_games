# What language should I learn?

>What programming language should I learn first?

This is possibly the most common question I see from beginners.

I also see that question's cousin quite a bit:

>What is the best programming language for beginners.

And like most questions, the right but unsatisfying answer is `it depends`.

## What does it depend on?

It depends on a lot of things.

On you.

On your goals and interests.

On your knowledge of and experience with computers.

Maybe you're passionate about the Web and want to spend the rest of your life building web sites that users love using.

Or maybe you want to be a game developer, so you plan to create stunningly realistic 3D graphics simulations.

Perhaps AI and Machine Learning tickle your fancy.

Depending on your interests, like in the above example, I might recommend a completely different path, which is why `what programming language should I learn first` is a difficult question to answer.

Regardless of all of that, however, there are some pieces of advice that I'd give to anyone, regardless of their goals and interests.

## Fundamentals

>Focus on the fundamentals.

People say this all the time - and it seems to me to be decent advice in all things. After all, if you can't do the fundamentals well, what hope have you got doing more complex things?

But this statement does beg the question: "What are the fundamentals?" And depending on who you ask you might get a different answer.

This is partly because we tend to think of programming, computer science, software engineering, web development etc... as all kind of being the same thing, when really they are different.

So lets start with some definitions:

* **Computer Science** \- The study of computation and computer technology, hardware, and software.
* **Programming** \- The process of designing, writing, testing, debugging, and maintaining the source code of computer programs.
* **Software Engineering** \- The application of a systematic, disciplined, quantifiable approach to the development, operation, and maintenance of software, and the study of these approaches. That is the application of engineering to software.
* **Web Development** \- Building, creating, and maintaining websites. It includes aspects such as web design , web publishing , web programming, and database management.

So as you can see there are some differences. Some are subtle, like the difference between programming and software engineering. Programming is definitely a part of software engineering, it's how we create software in the first place. But software engineering is more than just programming.

Computer science is very much concerned with the hardware and low level details of how a computer works, but web development is more focused on what a web browser can do, rather than what the computer can do.

Web development could be considered a specialization of software engineering and also requires programming.

The waters here appear pretty muddy, but these distinctions are important as they will impact where you focus your energy.

Let's get back to the fundamentals. I think it's worth defining some fundamentals for each, but it's important to note that different people may have different opinions on this, and what follows is just my opinion.

### Computer Science

These are all low level topics and I think most programmers should endeavor to get at least a basic understanding of most of them.

If you want to work on low level software like operating systems, databases, embedded systems or game engines you will need a good understanding of all of these.

* Hardware design - how CPUs, RAM, graphics cards etc... actually work, the electronics
* Logic & Binary arithmetic - understanding binary and logic, and how both relate to design computer hardware and software
* **Data structures & Algorithms -** efficiently operating on data, vital for computer performance (in fact alot of the progress around making computers faster comes from the creation of more efficient algorithms)
* **Computational complexity -** how to we quantify how efficient and algorithm is
* Compiler design - writing code to generate code that machines understand

I have highlighted `Data Structures and Algorithms` and `Computational Complexity` here, as I think these are the most important topics for generalists to have a good understanding of.

### Programming

When it comes to programming, actually creating a piece of functionality within a piece of software, this is my list of important fundamentals.

This list is geared much more towards concepts that help create clean code that is maintainable and extensible.

* Logic & Control flow - controlling how, when and how many times various parts of your code are actually executed (think if statements and loops)
* Standard library usage - most programming languages come with a set of libraries that do common things (like working with dates and time). Use and learn the std lib for your chosen language, they will have thought more about these things and done it better than you would
* Memory management - yes, even in memory managed languages
* Data modelling - how do you structure data in a way that it is efficient to create, store and manipulate it
* **Abstraction -** more on this below
* **Modularity -** more on this below
* Testing - writing code to test your code, you should start doing this on day one
* **Refactoring -** more on this below
* Profiling / performance analysis - understanding how efficient your code is and what you can do to get rid of bottlenecks

I've highlighted the three topics that I think are some of the more important but often less discussed topics when it comes to programming.

**Abstraction** is about taking complexity and representing it in a way that is easier to work with. Functions and classes are where you usually see complexity abstracted away. For example, creating an algorithm that rotates objects in 3D space can be complex, but calling a function called `rotate()` isn't complex at all. When you write code you want to do so in a way that you abstract the complexity away as much as possible. It will still be in there - but it shouldn't be constantly in your face.

**Modularity** can be defined as `Designed with standardized units or dimensions, as for easy assembly and repair or flexible arrangement and use`. I like this definition. Code should be written in a way that you can take it apart, rearrange it and isolate pieces for functionality for testing. Again this can be achieved by good use of functions, classes, structs and creation of libraries.

**Refactoring** is one of the more important topics in programming that I don't think gets anywhere near enough time and attention, especially with beginners. When you write a piece of code you will probably not get it 'right' the first time. It will likely be more verbose than it needs to be, not quite as performant, readable or extensible as it should be either. Writing a piece of code can be thought of as a discovery process. Once you have something working you have discovered how to do it - the next step is to refine it. Refactoring is that refinement and is something you should be doing constantly. A codebase evolves and changes over time - the code you wrote yesterday, last week or last year is not immune to that change, and you should make time for it.

### Software Engineering

Here we venture much more into the business side of things. How do we actually deliver, operate and maintain software.

I've heard software engineering be defined as 'programming integrated over time'. Meaning that programming is one thing, working on code that needs to last for years, that other programmers, users and businesses depend on is another.

* System analysis - looking at a problem or real world system and understanding the various modes of operation, constraints and challenges so that you can effectively design software to solve that problem or represent that real world system
* System design - beyond software, this is about designing systems of various pieces of software that all have to work together effectively
* **Continuous integration** - more on this below
* Code management - how do you store and build your code? How do you ensure there is consistency of style across your codebase? How do you keep it clean?
* Deployment / release management - How do you release new versions of software, ideally with minimal disruption to your users?
* Version management - how do you track changes to your software and communicate those changes to the people who care, and in some cases are deeply financially invested in your software?
* Load testing - for systems that have the potential to be utilised by tens of thousands of users, you need to be able to test and verify that it won't fall over under load. It's important to understand that everything changes when a system is under stress. A car traveling at 100mph handles a lot differently than a car travelling at 10.

The one standout topic here for me is continuous integration. A book was released not too long ago called 'Accelerate; The Science of Lean Software and DevOps: Building and Scaling High Performing Technology Organizations'.

It's a pretty heavy read, full of data gathered by analyzing both high and low performing software teams. The bottom line is this: the more frequently you are building and releasing code to your users, the more stable and higher quality your software will be.

It's also vital to remember that we rarely create software for the sake of creating it - we create it for the people that will be using it. The user is everything, don't forget that.

### Web Development

When it comes to web development I think it's easier to define a list of fundamentals, because without understanding the things on this list you simply won't be effective and I think there's little room for argument here.

* HTTP - how browsers communicate with server to get the data they need to display and run your site
* HTML - how your content is structured
* CSS - how your content is styled
* Dom structure - Document Object Model, how do you interact with and manipulate your HTML pages to create a dynamic web experience
* Javascript - adding behaviour to your websites
* SQL - How do you store and access the data used to drive your website
* Web security - you really should think about keeping your users and their data safe from online predators

Not much else to say on this - if you want to be a web developer, get good at all of these things.

***

That's it for the fundamentals. If there is any word up there that you don't understand, I suggest going and researching it - there are plenty of resources online to learn all of these things.

## Don't be an X developer

I don't like the idea of being a 'Python developer' or a 'C++ developer'.

People do this with frameworks too. "I'm a React developer" or "I'm an IOS developer".

I think you should avoid pigeonholing yourself like this.

Become a developer, or a software engineer, a programmer, whatever you want to call it, but don't tie yourself to a technology that may or may not exist in ten years.

Over your career you will be exposed to many new technologies and you will have to learn and adapt constantly.

Focus on concepts and ideas instead of specific technologies. Find patterns and commonalities in what you are doing. Think critically about the technologies you are using.

This will allow you to pick up the right tool for the job when you need it.

None of this means you can't become an expert in one thing. I'd just avoid limiting yourself to that one thing.

There is a saying you sometimes hear that goes like this:

>A jack of all trades is a master of none.

This makes it seem as if knowing a little about a lot of things is bad. However, the full original saying actually goes like this:

>A jack of all trades is a master of none, but oftentimes better than a master of one.

In other words - generalists are often more useful than specialists.

## Pick something and finish it

You will likely need to do some sort of course to learn to program. Whether this is an online course, a bootcamp or a college degree I think you should commit to it and finish it.

It will be hard. It will be uncomfortable. There will be times you feel like an idiot (you're not). But there will be moments of extreme satisfaction as things finally **click** for you.

Like most things in life, what will get out what you put in. If you put in the time, effort and focus you will get there - you just need to commit and stick to it. Trust the process and the results will take care of themselves.

To make the process a little easier I think it helps to have a goal. Something you want to do with your growing skillset. Maybe you want to build a game or create a social media site that doesn't destroy society. Maybe you want to create educational software to help children with autism learn more effectively or use software to empower people struggling through poverty or war.

Whatever it is - having a thing you want to build makes learning the **how** to do it much easier.

In other words, it helps to have a **why**. And for what it's worth, I reckon having 'to make lots of money' as your why is far less motivating than you might think.

## Just tell me what language to learn

This is something I definitely don't want to be prescriptive about, but here are some thoughts on what language might be right for you...

If you're into computers, hardware, operating systems etc... it would probably be a good idea to start with C. It gets you close to the hardware and is very powerful. After that you can move in to the more complex world of C++.

Are you interested primarily in web development and less interested in everything going on behind the browser? I'd probably go for Javascript.

Are you itching to just build software? Then I think Python is a great choice. It was specifically designed to read like a natural language (ie. English) so it is quite approachable, and you can build desktop apps, simple games, server applications, system automation, machine learning etc... using it. It's my favourite language because it is so quick to prototype with and it's standard library is the best I've used. But don't be fooled - writing Python is different to writing **good** Python, and there is still complexity there when writing real world software.

Do you want to build games but don't want to worry about the complexities of building a game engine? C# is a good choice as it is the language of choice for the popular engine Unity3D.

Want to build games from the ground up? C++ is probably a good choice.

***

That's more or less all I have to say on this topic and I hope it was helpful. I know this question isn't going anywhere and my thoughts on how to answer it may evolve over time, but I think the important point to remember is that there isn't really a 'right' answer, regardless of the answer I give.