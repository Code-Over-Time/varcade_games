# The Admin Panel

In order to follow along with this section you'll need to have the project up and running - so if you haven't done that, you should get it all setup before continuing.

The admin panel is a part of the `Website` project.

In you browser, navigate to `localhost:8000/admin/`. If you're not already logged in here you will be greeted with a login screen.

Log in with the credentials you provided when initially setting up the project and you should be greeted with something like this:

[![Screenshot of admin panel](img/admin_panel_home.png)](img/admin_panel_home.png)

You get this out of the box with Django, and it's one of the reasons I decided to go with Django for the server side of Varcade Games.  

## Django Admin

Some of these menu options are there by default, such as `ACCOUNTS` and `SITES`, but two of them are specific to Varcade Games.

### Games

This section is where we add games, as you should have done already while setting up the project.

### Profiles

In this section we can view user profiles, which are automatically created whenever a new account is created - more on this later.

Basically as admin of the website you can view and manipulate player accounts as needed - and since the internet is what it is, it will be needed.

## The Code

Let's have a look at the code behind all of this, because we've already used the admin panel enough to more or less know what it's about.

### Games

If you open up `website/server/game_portal/games/admin.py` you should see the following code:

```python
from django.contrib import admin
from .models import Game

admin.site.register(Game)
```

And that's it. That's more or less all we need to do in order to add a custom section to the Django admin panel.

But before you do that you need to create the `model` that you want to represent in the first place.

All you can see from the imports above, this `Game` model is in the `models.py` file.

The Game model is a database model that describes a single game in Varcade Games and it looks like this:

```python
class Game(models.Model):
    class GameTypes(models.TextChoices):
        SINGLE_PLAYER_ONLY = "SPO", "SinglePlayerOnly"
        MULTI_PLAYER_ONLY = "MPO", "MultiPlayerOnly"
        MULTI_AND_SINGLE_PLAYER = "MSP", "MultiAndSinglePlayer"

    class GameState(models.TextChoices):
        ACTIVE = "ACT", "Active"
        INACTIVE = "INA", "Inactive"
        COMING_SOON = "CMS", "ComingSoon"

    game_id: models.CharField = models.CharField(max_length=10)
    name: models.CharField = models.CharField(max_length=40)
    desc: models.CharField = models.CharField(max_length=180)
    client_url: models.CharField = models.CharField(max_length=160)
    cover_art: models.ImageField = models.ImageField(upload_to="images", null=True)
    banner_art: models.ImageField = models.ImageField(upload_to="images", null=True)
    stats_config: models.FileField = models.FileField(
        upload_to="stats_config", null=True
    )
    game_type: models.CharField = models.CharField(
        max_length=3, choices=GameTypes.choices, default=GameTypes.SINGLE_PLAYER_ONLY
    )
    game_state: models.CharField = models.CharField(
        max_length=3, choices=GameState.choices, default=GameState.INACTIVE
    )

    def __str__(self) -> str:
        return self.name
```

Have a look at all of those instance variables in the `Game` class:

```
game_id
name
desc
client_url
...
```

Are they familiar? They should be - take another look at the admin panel.

Django automatically maps the fields of our database model to the admin panel, provided we have registered it - which we did in our `admin.py` file.

For all of this to work our model needs to extend `models.Model`:

```python
class Game(models.Model):
```

This tells Django that our Game object will be a database model. 

Each of the instance variables is a Django specific type that Django knows how to handle. The type of the model's fields also dictates how they are rendered in the admin panel.

The `models.ImageField` is rendered as an upload field in UI. The `models.Charfield` that have `choices` associated with them are rendered as dropdowns etc...

Most of these fields are pretty straight forward. CharFields are just strings that Django can store in a database table. But the same is not true for the ImageField or the FileField.

We need to store these files somewhere. Django will only store the path of that file in the database.

To understands how this works we need to have a look at the settings file.

### The Setting File

The `settings.py` is the core of our Django project.

Remember back to the intro for this section, where I shared the following snippet from the Django homepage:

>Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. Built by experienced developers, it takes care of much of the hassle of web development, so you can focus on writing your app...

It is through the `setting.py` that we will harness the power of Django. It's the interface through which we configure Django so that it can do the heavy lifting.

Go ahead and open up `website/server/game_portal/game_portal/setting.py`.

The section we're interested in right now is:

```python
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
    STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
    MEDIA_ROOT = os.path.join(BASE_DIR, "media/")
else:
    CORS_ALLOWED_ORIGINS = ["https://varcade-games.com"]
    STATIC_ROOT = "/var/lib/game_portal/data/staticfiles"
    MEDIA_ROOT = "/var/lib/game_portal/data/media/"
    MEDIA_URL = "https://api.varcade-games.com/media/"
```

More specifically we are interested in the `MEDIA_ROOT` and `MEDIA_URL`.

The `MEDIA_ROOT` setting tells Django *where* it can store files locally. So any files we upload via the admin webpanel will go here.

The `MEDIA_URL` setting tells Django where to request these files from.

So why do we have this `DEBUG` condition and two different values for these settings?

As the name implies, one is our debug config - which is active whenever we're running on our local dev server. 

However, when the website is deployed to a live server we need to tweak things a bit - but don't worry about this for now, we'll get to that later.

For now - files will be saved to your `game-portal` container in the `BASE_DIR` - which correspond to `website/server/game_portal` directory. 

In fact - have a look in your file explorer right now. If you are running Varcade Games at the moment and have your local file system mounted on to the running Varcade Games container then you should see that `media` directory - and it should contain the files you uploaded when configuring `Rock Paper Scissors Apocalypse`.

## Summary

So that's how we configure and store games.

We create a class that is an `instance of` the Django model. 

We register that class with the Django admin system.

We tell Django where we want static files to go (uploaded images etc...).

Once all of that is done we can view our class in the admin panel and create/delete/modify data models as needed via that interface.

Now that we have a game defined - how does it actually end up embedded in Varcade Games?

That's what we will explore next.