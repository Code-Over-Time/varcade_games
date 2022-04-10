# Connecting Computers

In the first chapter we discussed the various components that make up a computer. We also learned that you need to be very specific when telling it what to do, as there may be unintended consequences. However, we only went as far as discussing a single computer. These days, more often than not, computers are connected to each other through the internet. 

People make video calls and send emails, photos and videos to each other. We comment on news articles and even sway elections through social media. This area of computing is know as ‘networking’, and our society is relying on it more with each passing day. 

Working with one computer is complicated enough and things don’t get any easier when you connect two of them together. 

In this section we will focus on the most common relationship that exists between two computers: the client and the server. For this we will leave our robot behind and head out for dinner - I know I certainly can’t stand the thought of another ham and cheese sandwich.

## Eating Out

We decide to go for Italian, because there is generally something for everyone at an Italian restaurant. When we arrive we are seated at a nice table in a quiet section of the building and start to think about how a restaurant works.

We take a lot of everyday things for granted, so what if we break it down and think a bit deeper about exactly what happens when we go out for food. 

At our table is a menu, this was brought to us by our waiter. Now the waiter didn’t create the menu and doesn’t prepare the food that is presented on it, but he brings it to us so that we know what is available from the kitchen. 

From our table we can’t actually see the kitchen and can’t tell where it is, but that doesn’t matter because the waiter knows where it is, how to get there and how to get back to our table. He has shown us what is on offer from the kitchen by bringing us the menu, now it is up to us to decide what we want. 

Once we know what we want, we tell the waiter and he will scurry off to let the kitchen know. 

We decide to share a pizza, so we ask the waiter ‘one large margherita pizza please.’

In the kitchen is a chef. The chef knows as little about us as we do about her. It isn’t of any real concern to her where our table is or even who is sitting at it. She knows that she can prepare the food and trust the waiter to get it to us. She will remain there waiting on orders to come from the waiter and once she has them she can begin her work. 

This work takes time of course, as she will need to prepare all of the ingredients and organize them into a dish that we can eat. She is taking our request for a margherita pizza and turning it into an actual pizza.

In the meantime we have no idea what is going on in the kitchen. We assume that the chef has received our order and that they are working diligently to prepare our food. 

We know that sometimes it can take a while, but we quietly hope that our pizza will arrive quickly. 

Unless explicitly stated by the menu we don’t know what type of ingredients are being used. Organic flour and locally grown tomatoes? Or something straight out of a can? Most of the time it doesn’t really matter to us, there is a degree of trust there that we are being served quality. 

The kitchen could also be dirty, we generally never know. Nevertheless we sit and wait patiently and sure enough our food comes within fifteen minutes. 

Thankfully it is exactly what we wanted - a beautiful fresh pizza with golden mozzarella and a crust that is perfectly crisp. 

As we devour our pizza we think about what just happened. The kitchen presented us with options, we made a choice and got what we wanted some time later. 

We did all of this without actually knowing where the kitchen is or how it works by simply talking to the waiter. We note the fact that this is largely a one-way operation. The kitchen has asked nothing of us, simply delivered what we want. Sure we sent our order out, but it was from a predefined list, it was a selection. 

Finally we pay and tip the waiter and then go on our way. Altogether it was an entirely uneventful evening out, and there wasn’t a ham and cheese sandwich in sight (though admittedly a cheese pizza isn’t exactly a million miles away).

Now it’s time for the fun part - what the hell did the little story above have to do with modern software development? Well believe it or not it was my attempt at explaining how the internet works. 

## Clients and Servers

Earlier on I mentioned a type of relationship between two computers: the client-server relationship. You may be able to guess where I am going with this… in our story we were the client and the kitchen was the server. 

We are both computers, but one is requesting stuff (the menu, the food) and the other is serving stuff (the food, the bill). 

The hardworking waiter in this analogy is the internet. 

He is how information and data is exchanged between the client and server. He is a medium for us to communicate through, much like the air through which the sound travels when we speak. 

The internet itself is what is known as a network and it spans the entire globe, allowing people in the US to communicate with people in Australia instantaneously. Networks also exist on a smaller scale, like in an office for example - where every computer can share information, but only in that office. Your home may also have its own network. If you have wifi set up you have small network that is connected to the internet, allowing every phone/laptop/PC to communicate with each other and out over the internet. 

The word network isn’t exclusive to computers. You may heard people refer to a road network, which is simply the system of interconnected roads that we drive on every day. How about a social network? This is a group of connected people, often communication through some shared medium (like Facebook or Twitter). How about networking at a conference or event, where you try to expand your professional circle and build a group of mutually beneficial relationships with other people in your particular industry. 

The key to all these different uses of the word is that it is all about connectivity. 

## The World Wide Web

In order to try and understand what is going on when we ‘surf’ the internet let’s go back to our restaurant. 

To breakdown the interactions we had with the restaurant a little further let’s start with how we got there. Imagine that the reason we chose this restaurant in the first place is because it was recommended to us by a friend. He told us that there is a restaurant called Mario’s that does amazing food. That’s all the information we had when we decided to go there but it wasn’t enough information to actually get us there. 

We need an address. 

To get the address we went to Google maps and searched for Mario’s, which promptly showed us it’s location and even gave us directions to get there. This is not unlike what happens when we visit a website. If you want to visit a website you need to know its web address, which is usually in the form of ‘www.thewebsitename.com’. 

This web address is actually not enough information for our computer, just like the name of the restaurant was not enough information for us. The computer will need to look for a way to get to this website, so it finds what is called an IP address for the website, just like we looked up the address for Marios. 

This address takes the form of something like this ‘192.168.1.1’ ( would you like to know what the IP address of your computer is? Simply search google with the following ‘what is my ip’). Once it has this address the computer can actually begin the process of getting the website that we are looking for. 

Every computer that is connected to the internet must have an IP address (which stands for ‘Internet Protocol address’ and is not really important for us). If it didn’t we wouldn’t know how to communicate with it. Just like if our restaurant didn’t have an address we wouldn’t be able to find it. Knowing the address of the restaurant basically allows us to communicate with its kitchen, though we still need the waiter in order to do so. 

As soon as we arrive at the restaurant we are given a table and a menu. Having a table basically means that we have established a connection with the kitchen. 

We are now in a position to communicate with the kitchen. Getting our menu is just like viewing the homepage of a website. 

We are presented with a webpage that is showing us what is on offer from that website. If you go to your local news website, for example, you will likely see a list of recent news stories. A page full of headlines, and maybe an image per story, basically enough information to grab your attention. 

You can select any one of those news stories and you will then be given the whole article. 

By selecting from that list of news articles you were making a request. Just like we requested a pizza from the waiter in the restaurant, we are requesting a full news article from the news server. 

The news server will need to find the article you are looking for and send it back to you, not unlike how our Italian chef had to assemble our pizza. 

This will take some time, as you are no doubt probably aware. Some websites can take a frustratingly long time to display the content we want. There are several possible reasons for this that we will get into later, but for now we just need to be aware that there is some work happening on the other end and work always takes time.
