# Tests & Linters

## Linter

Now that we're making changes to our code we need to make sure that our changes are conforming to our code standards.

A linter is a tool that can flag programming mistakes, bugs and code style violations.

The Varcade Games client has a linter set up that will check any changes we make and in some cases even fix code style violations for us, if they are trivial enough.

From your terminal, navigate to the website project client directory.

For example, if your code is located in `~/code/varcade_games` then you'd run:

```bash
cd ~/code/varcade_games/website/client
```

Next we need to install some additional dependencies. Specifically `npm`, which is the [Node Package Manager](https://www.npmjs.com/). This is a tool that allows you to install libraries that you can use to build your own applications (for example, Vue.js). For installation instructions check out [their official docs](https://docs.npmjs.com/cli/).

After the installation complete you can run the following command to actually install all of the project dependencies:

```bash
npm install
```

Once that is done you can run:

```bash
npm run lint
```

This will run a program that checks all of our client javascript code to make sure it conforms to our standards.

It should print an output like this:

```bash
> web_portal_client@0.1.0 lint website/client
> eslint ./src
```

There's basically no output. 

As you can see it all looks good. But it won't always be like this, so let's break something so we can experience what that looks like.

In your editor/IDE open up `website/client/src/main.js`.

On the very first line that has code on it, add a semi-colon(;) to the end, like this:

```javascript
import Vue from 'vue';
```

Now go back to your terminal and run 

```bash
npm run lint
```

This time you should see a nasty looking error:

```bash
website/client/src/main.js
  7:22  error  Extra semicolon  semi

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.

npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! web_portal_client@0.1.0 lint: `eslint ./src`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the web_portal_client@0.1.0 lint script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /tmp/.npm/_logs/2021-08-17T19_14_49_722Z-debug.log

```

The important part is at the top:

```
website/client/src/main.js
  7:22  error  Extra semicolon  semi
```

It's telling us that there is an `Extra semicolon` in the file `website/client/src/main.js` on line 7, column 22.

And indeed, if you count the rows and columns in your editor you will find your ';' at line: 7, col :22.

There are many things that will trigger the linter to fail. What we're trying to do is make sure all of the code has a consistent style, which will make it easier to work with - especially is a lot of people are working on the same codebase.

Thankfully when the linter picks up trivial things like this it can fix them itself.

If you run:

```bash
npm run lint-fix
```

You will notice we're back to no output:

```bash

> web_portal_client@0.1.0 lint-fix website/client
> eslint ./src --fix

```

The linter has removed the semicolon for us, but it cannot do more complex operations. For example, if you add the following code block to the top of `main.js`:

```javascript
if (true) {}
```

And run the linter with the fix option enabled you will get the following:

```bash
> web_portal_client@0.1.0 lint-fix website/client
> eslint ./src --fix


website/client/src/main.js
  34:5   error  Unexpected constant condition  no-constant-condition
  34:11  error  Empty block statement          no-empty

✖ 2 problems (2 errors, 0 warnings)

npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! web_portal_client@0.1.0 lint-fix: `eslint ./src --fix`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the web_portal_client@0.1.0 lint-fix script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /tmp/.npm/_logs/2021-08-17T19_27_20_052Z-debug.log

```

So the linter has actually made some changes. If you open `main.js` you will find that the invalid code block we added has been moved down 30 lines or so.

This is because our linter doesn't want code before the imports in a file.

However, the two remaining lint errors above cannot be fixed automatically - because it would modify logic, and we don't want a linter messing around with logic.

In this case it's warning us that `if(true)` is a constant condition and pointless. It also doesn't allow empty code block like `{}`.

It's important to note that this code will not break the application. It's just not very good code - and the linter can pick up on code that smells a bit bad.

The more help we have keeping our codebase clean from bad smelling code, the better.

Remove the invalid code block and run the linter again to get everything back to normal.

As you work on Varcade Games you will meet a lot of different types of linter - or `static analysis tools`.

## Tests

Whenever you write code you should probably write some automated tests. 

In our case, we don't have any client side tests at the moment, but we do have server side tests. 

So let's run them!

In your terminal navigate over to the server directory for the website.

For example, if your code is located in `~/code/varcade_games` then you'd run:

```bash
cd ~/code/varcade_games/website/server
```

For our server tests we actually use a docker image, just like for running the actual services.

We build an image with all of the code and tests, then we run the container and run the tests.

This gives us a consistent environment to run our tests in - everyone running these tests will be running with the same dependencies and configurations. 

If we just ran the tests on our dev machine we could get different results due to different configuration.

I've abstracted away most of the complexity of running the tests so all you need to do is run:

```bash
make build_test_image
```

This may take a while... 

Next we run the image as follows:

```bash
make run_test_image_mounted
```

Once it's done you can run the following make commands to run the actual tests:

```bash
make run_tests
```

You should see a whole lot of output after running that command, and it hopefully ends with something like the following:

```bash
======== 10 passed, 0 warnings in 1.67s ========
```

(Ok there might be a few warnings... but the tests should pass!)

These tests test the functionality of the game portal - they tell us if something functional broke.

So let's break something...

Open up `website/server/tests/game_portal/games/test_accounts.py`.

Find the test called `test_create_user_with_short_password`.

This test case verifies that the server returns an error status if a user submits a password that is too short. 

In this case we expect and error to occur, so we have this assertion:

```python
assert response.status_code == status.HTTP_400_BAD_REQUEST
```

This ensures that the server response is a `400` (bad request) if a user submits a password as basic as `foo`.

Change this line to the following:

```python
assert response.status_code == 200
```

This would mean the request to the server was a success, which is the `wrong` behavior.

Now run the tests again with `make run_tests`.

The out put should have changed:

```bash
#<snip>

tests/game_portal/accounts/test_accounts.py::TestAccounts::test_create_user_with_short_password FAILED                  [ 20%]

#<snip>
______________________________________ TestAccounts.test_create_user_with_short_password ______________________________________

self = <test_accounts.TestAccounts object at 0x7f5b357df3d0>
api_client = <rest_framework.test.APIClient object at 0x7f5b35cc7950>

    def test_create_user_with_short_password(self, api_client):
        """
        Ensure user is not created for password lengths less than 8.
        """
        data = {
            "username": "foobar",
            "email": "foobarbaz@example.com",
            "password": "foo",
        }
    
        response = api_client.post(self.create_url, data, format="json")
>       assert response.status_code == 200
E       assert 400 == 200
E         +400
E         -200

tests/game_portal/accounts/test_accounts.py:51: AssertionError

#<snip>

=================================================== short test summary info ===================================================
FAILED tests/game_portal/accounts/test_accounts.py::TestAccounts::test_create_user_with_short_password - assert 400 == 200
========================================== 1 failed, 9 passed, 30 warnings in 1.77s ===========================================

```

In this output we can see that we now have a failing test. It is failing for the exact reason we made it fail:

```bash
>       assert response.status_code == 200
E       assert 400 == 200
E         +400
E         -200
```

We change our test to expect a 200, but the server is still returning a 400 - because the request is invalid.

Go ahead and change the code back to get the tests running again.

It's also worth noting that even though the tests are running in a container - our changes to the code were applied automatically.

On the server part of the game portal there are some more checks we can do too.

### Coverage

Now try running:

```bash
make run_coverage
```

This tells us how much of our code is covered by tests:

```bash
<snip>
game_portal/game_portal/test_settings.py                                     4      0   100%
game_portal/game_portal/urls.py                                             22      0   100%
tests/conftest.py                                                           11      1    91%   12
tests/game_portal/accounts/test_accounts.py                                 33      0   100%
tests/game_portal/games/test_games.py                                       40      0   100%
tests/game_portal/profiles/test_profiles.py                                 33      0   100%
------------------------------------------------------------------------------------------------------
TOTAL                                                                      489     24    95%

```

Code coverage is a useful indicator about how much test coverage you have *but* it's important to understand that 100% coverage doesn't mean you have bug free or high quality code.

Don't use coverage as a target, use it as a guide.

### Type Checking

For our Python projects we also have some type checking.

Python is a dynamically typed language, meaning we have no compiler to tell us about errors and we often have to wait until we are running the code to know whether it even runs.

Enter Mypy.

Mypy is a static type checker that will analyze our code and tell us if there is any in there that might be problematic.

You can run the type checker against the game portal by running:

```bash
make run_type_checking
```

Which should result in some output like:

```bash
docker exec -it $(docker ps -aqf "name=gameportal_tests") bash -c '\
    echo "Running Mypy against web app" && \
    mypy game_portal'
Running Mypy against web app
Success: no issues found in 41 source files
```

And that's it for the server side. 

When working on any project that is expect to live for longer than a couple of months it's important to understand what tools are at your disposal to help ensure you are creating maintainable and extendable code.

***

Now that you can make changes and run tests, let's take a closer at the server side code.

It's time to Django.