# Making Changes

Ok, finally it's time to actually get our hands dirty and change some code.

To start we're going to work on the `website` project, also know as the `Game Portal`.

## Prerequisites

The following must be true before continuing here:

* Your local Varcade games dev server is up and running
* You can access the web portal through `http://localhost:8002`
* You can create and account and log in to your local dev server

## Changing the client

The first thing we will do is get a view of our logs so that we can see what happens when we make some changes.

In your terminal, navigate to the `build_tools` project and run the following command:

```bash
make logs a=game-portal-client
```

This should result in your terminal filling up with a bunch of information that should look something like:

```bash
game-portal-client      | <s> [webpack.Progress] 95% emitting
game-portal-client      | <s> [webpack.Progress] 95% emitting HtmlWebpackPlugin
game-portal-client      | <s> [webpack.Progress] 95% emitting CopyPlugin
game-portal-client      | <s> [webpack.Progress] 98% after emitting
game-portal-client      | <s> [webpack.Progress] 98% after emitting CopyPlugin
game-portal-client      |  DONE  Compiled successfully in 213ms7:42:57 AM
game-portal-client      | <s> [webpack.Progress] 100% 
game-portal-client      |   App running at:
game-portal-client      |   - Local:   http://localhost:8002/ 
game-portal-client      |   - Network: http://varcade.local/
```

Don't worry if yours doesn't look identical - the output here will depend on a number of factors.

Next hit `enter` a few times in that same terminal window. This will add a few blank lines to the bottom of the output, which creates a sort of separator between the latest log output and future log output. This is a useful trick for when you want to view a chunk of logs starting at a point in time.

*Note*: This little trick doesn't actually change the logs or anything, just adds some blank lines to your terminal. If you run the log command again in another window the blank lines will not be there.

### Removing the header

The first change we're going to make is to remove the header from the login/registration page.

We have a lovely big picture on that page and we'd like to see what it looks like without a chunk at the top being blocked by the header.

In your browser open up `http://localhost:8002`. If you are already logged in, click the logout button at the top right corner of the screen.

Next, open up the code in what ever editor/IDE you are using and open the following file:

```
website/client/src/views/Index.vue
```

This is the file that contains our core Vue components that allow users to register and log in.

At the top of the file you will see the following:

```html
<template>
    <div class="index-screen-image">
        <wp-top-bar v-bind:display-logout-option="false"/>
        <div class="login-box-container">
            <wp-login-register/>
        </div>
    </div>
</template>
```

Modify `line 3` so that it looks like this:

```html
<!--<wp-top-bar v-bind:display-logout-option="false"/>-->
```

What this does is 'comment out' that line of HTML. It means that the browser will ignore this line - which in turn will stop our header from being rendered.

Once you've made this change, save the file and then head back over to your browser.

The change should be immediately apparent - you don't even need to refresh the page!

What sorcery is this? How is that even possible?

This sorcery is called 'hot reloading' (see [official docs](https://vue-loader.vuejs.org/guide/hot-reload.html#state-preservation-rules)) and to see it in action let's head back over to our terminal!

In the terminal window you should see something like this:

```bash
game-portal-client      | <s> [webpack.Progress] 94% after asset optimization
game-portal-client      | <s> [webpack.Progress] 94% after seal
game-portal-client      | <s> [webpack.Progress] 95% emitting
game-portal-client      | <s> [webpack.Progress] 95% emitting HtmlWebpackPlugin
game-portal-client      | <s> [webpack.Progress] 95% emitting CopyPlugin
game-portal-client      | <s> [webpack.Progress] 98% after emitting
game-portal-client      | <s> [webpack.Progress] 98% after emitting CopyPlugin
game-portal-client      |  DONE  Compiled successfully in 168ms7:44:20 AM
game-portal-client      | <s> [webpack.Progress] 100% 
game-portal-client      |   App running at:
game-portal-client      |   - Local:   http://localhost:8002/ 
game-portal-client      |   - Network: http://varcade.local/
```

Your output should look exactly the same as mine.

If you scroll up you will notice that what you're looking at here is essentially a progress bar.

Scroll enough and you will reach the point where we added our blank lines, and you should see the following:

```bash
game-portal-client      |  WAIT  Compiling...7:44:19 AM
game-portal-client      | <s> [webpack.Progress] 0% compiling
game-portal-client      | <s> [webpack.Progress] 10% building 0/0 modules 0 active 
```

So what actually happened here?

When we run our Vue.js app in development mode it watches all of the files in the project to see if any of them change.

As soon as one changes, Vue will rebuild itself and update any active pages in place!

That's exactly what we just did - and the logs show Vue.js reacting to the change we made, by recompiling the project.

Pretty cool right? This allows us to make changes to our web application and immediately see the change.

### When things go wrong

The above example show what happens when we successfully make a change... but what happens when we break something (and we will... we'll break loads of things!)?

Well, let's find out.

Head back over to your editor and remove the `-->` at the end of the file we modified so that it looks like this:

```html
<!--<wp-top-bar v-bind:display-logout-option="false"/>
```

Then hit save and head back over to your browser.

Bit of a different story right? 

You should still be able to see the Varcade Games homepage, *but* there is an error message displayed over it:

```javascript
Failed to compile.

./src/views/Index.vue
Module Error (from ./node_modules/eslint-loader/index.js):

/game_portal_client/src/views/Index.vue
  54:1  error  Parsing error: eof-in-comment  vue/no-parsing-error

✖ 1 problem (1 error, 0 warnings)
```

Whenever you break the game portal client you will see an error like this. If you take a log at your logs you will also see this same error.

This is important because we sometimes get a more descriptive error in our logs, like we do in this case:

```bash
game-portal-client      | (Emitted value instead of an instance of Error) 
game-portal-client      |   Errors compiling template:
game-portal-client      |   tag <div> has no matching end tag.
game-portal-client      |   1  |  
game-portal-client      |   2  |  
game-portal-client      |      |   
game-portal-client      | <s> [webpack.Progress] 100% 
game-portal-client      |   3  |  <div class="index-screen-image">
game-portal-client      |      |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
game-portal-client      |   4  |      
game-portal-client      |  @ ./src/views/Index.vue?vue&type=template&id=23543608& 1:0-410 1:0-410

```

This message tells us that `<div class="index-screen-image">` has no matching end tag, which makes sense because on that line after that line in our template we opened a comment but never closed it:

```html
<template>

    <div class="index-screen-image">
        <!--<wp-top-bar v-bind:display-logout-option="false"/>
        <div class="login-box-container">
            <wp-login-register/>
        </div>
    </div>
</template>

```

Remove the `<!--` from the start of line 4 and save the file. This will leave our page back in it's original state.

## What's next

You are now equipped to start working on the `Varcade Games` game portal client.

Take some time to look around the various files in the project. Make some changes, see what happens. The `client/src/components` directory is especially important as this is where the various components that make up the website live.

Next we will look at what to do *after* we make changes to the code. 