# Mouse and Keyboard

I'm going to go ahead and assume you know what a mouse and keyboard are and what they do. So you might be wondering why I'd bother writing a whole post about them.

Well, what I actually want to do is get you excited about your keyboard... and learn to despise your mouse. Maybe despise is too strong a word... mice are great and absolutely have a place. But if you're going to be spending a lot of time with your computer, it's worth really getting to know your keyboard.

But why? You might ask.

Let's think about it for a second. 

When you are sitting at your computer and writing some code or typing up a document, you will have both of your hands on the keyboard. 

If you then want to use your mouse to do something, like change to a different window or select a menu option, you need to lift your hand off the keyboard and move it over to the mouse. Then you need to move that mouse so that your pointer moves to the desired location. Finally, you can click the thing.

This is slow. More often than not you can avoid that hand relocation entirely using keyboard shortcuts. More on that below.

But that's not the only reason it is slow. 

When using a keyboard you can use all ten of your fingers together to produce a serious amount of inputs to your computer. The average mouse has two buttons and a scroll wheel. That's three inputs. So you are wasting two whole fingers!

On your key board you can learn to use all of your fingers in a sort of ten finger ballet. The amount of information you can send to your computer through your keyboard vastly outweighs the information you can send via a mouse.

You just need to learn how to unlock the power of the keyboard.


## Touch Typing

First of all - touch typing. The ability to type without looking at the keyboard.

This is an invaluable skill and worth spending some time on. I won't lie, it can be painful, but there are plenty of tools online to help you improve your typing. My personal favourite is a version of the arcade shooter 'House of the Dead' called 'The Typing of the Dead', where you type words to fend off an incoming horde of zombies.

![Screenshot from The Typing of the Dead](img/typing_of_the_dead.jpg)

## Navigating Text

Since writing code is essentially manipulating a bunch of text files it is worth spending some time learning how to efficiently navigate a text file using just your keyboard.

### Shifting

The shift key on your keyboard is interesting. Most of the time people use it purely for the purpose of capitalizing a letter. You hold shift, type a letter and on the screen you will see the capital version of that letter.

But that is just one example of what shift can do. 

More generally speaking, what the shift key actually does is 'invert' the functionality of the operation you are performing.

Open up a text editor a type out a sentence, any sentence. Now use your arrow keys to move the caret (the little vertical bar that tells you where your text will be entered) around. Now try moving the caret around with the arrow keys, but this time hold down shift as you do it.

What happened?

Instead of just repositioning the caret, your computer will now highlight any letters in its path. If you press the up arrow, all of the text between where the caret started and ended up will be selected.

This is incredibly useful, especially when writing code. Later on we will couple this functionality with some shortcuts to unleash some real power!

### Controlling

Another important key on your keyboard is `control` or `ctrl`. If you're using a Mac you will want to use the `Command` key for the most part. Though in some cases you will want to use the `option` key. I switch between a Mac and my Linux PC a lot - and it really messes me up because I have to rethink how I use the keyboard.

Anyway, using control you can really increase the speed with which you can move around in your text editor.

For example, in Windows/Linux if you hold control while using the forward / back arrow keys, the caret will jump around one word at the time. Combine that with the shift key and you will select each word as you jump over it.

!!! info
	On Mac you will need to use `option` to get this same behavior.

### Home and End

A couple of keys on the keyboard that don't get used often are the 'home' and 'end' keys.

Pressing `home` will move the caret to the start of the current line. Pressing `end` will move to the end. Pressing shift while using either of these keys will, you've guessed it, highlight the whole line from the point where the caret started to either the start or end, depending on which key you hit.

!!! info
	On Mac you don't need home and end, `cmd + <arrow>` will do the same thing.

### Manipulation

Now let's put the above to good use and actually manipulate some text.

The most commonly text manipulation shortcuts on a keyboard are probably:

* `ctrl + c` - copy the highlighted text
* `ctrl + x` - cut the highlighted text (like copy, but removes the text)
* `ctrl + v` - paste whatever you last copied or cut
* `ctrl + z` - undo the last change you made
* `ctrl + a` - select all text in your editor

So - now we can combine everything we've learned so far and enable some lightening fast text manipulation.

Let's say you have a few paragraphs of text, with your caret at the beginning.

If you want to delete the first line (on Windows) you can simply issue the following commands on your keyboard:

`shift + end` then `backspace`.

If you want to take the first line and move it to the very bottom of the text you simply do the following:

* `shift + end` to select the first line
* `ctrl + x` to cut the text out
* `ctrl + end` to jump to the end of the text
* `ctrl + v` to paste the text at the end

To really optimize this you don't even need to take your finger off the `ctrl` key once you've first pressed it.

Something **really** important to note here is that just reading about these sorts of shortcuts and text manipulation tools really won't do you any good. You need to practice this. You need to force yourself to use these shortcuts - resist the urge to use your mouse. Even if you forget a shortcut, stop what you are doing it, go search the internet to figure it out and then do it.

After a while it will become second nature. While writing this post I used all of the above tricks to move bits of text around, select chunks to text to delete and much more.

## Shortcuts

We've already touched on a bunch of shortcuts, and they are exactly what the name suggests. Quick ways to achieve a desired result. 

It's important to note that most applications you use will use what has become a fairly standard set of shortcuts. So `ctrl + z`, for example will usually mean `undo`, no matter what application you are using. In a text editor it will remove the last word or letter you typed. In an image editor, like photoshop, `ctrl + z` will undo whatever the last change you made to the image was.  


## System Level


### Application Level


### Working with Text


## Vim






Open up a folder on your computer, any folder - as long as it has multiple files.

Now click on one of those files. You can now, once again, use your arrow keys to get around. Select the right key to select the file to the right, the down key to move down etc... But what if you hold shift while doing it?

Try it out for yourself.

What you get is essentially the keyboard version of clicking and dragging to select multiple files.

Now open up your browser. I'm going to assume you're using a modern browser that support tabs. If you press `ctrl + t` it should open up a new tab. If you're using a Mac this will be `cmd + t`.

Navigate to some website, it doesn't matter what site, any will do.

Now close the tab. 

Now. Remember how `ctrl + t` opened a new tab? Try `ctrl + shift + t`.

What happens now is your browser re-opens the last tab you closed! So the behavior is similar but different. 

This is what shift does - it modifies the behavior of the keys and shortcuts you're using thing you are doing. 