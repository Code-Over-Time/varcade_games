### Adding a game to Varcade Games

Navigate your browser to `localhost:8000/admin`.

You should be greeted by a login page. Use the credentials that you provided in the early step where you ran `./manage.py createsuperuser`.

Once logged in you should see a menu that looks like this:

![Varcade Games Admin panel](/img/admin_panel.png)

Click the `add` link under the `GAMES` category. 

Fill in all of the fields with dummy data, for example:

* Game id: test_game
* Name: My Game
* Desc: A great game that you should play!
* Client url: empty
* Cover art: See below
* Game type: SinglePlayerOnly
* Game State: Coming Soon

#### Adding Cover Art

There is some sample cover art in the `rps_game` project. In VSCode you will find this file in `game_rps/client/assets/exrps_cover.jpg`.

##### On Windows

This might be a bit confusing on Windows. 

The file we want to upload to our browser lives on our Ubuntu instance, so how do we actually access it from Windows?

In VSCode you can right click the image and select `reveal in file explorer`. This will open up a window showing the folder that contains the file.

At the top of the window is a path to the file:

![Screenshot of the Varcade Games admin interface](/img/access_exrps_cover_from_ubuntu_unhighlighted.png)

Once you click the path it will turn into a text field that you can copy and paste:

![Screenshot of the Varcade Games admin interface](/img/access_exrps_cover_from_ubuntu_highlighted.png)

Copy that path and then select the `browse` button in the admin interface. You can now paste the image page in the upload window that pops up:

![Screenshot of the Varcade Games admin interface](/img/upload_exrps_cover_art.png)

Hit the save button and you're done.

All that's left is to head back over to `localhost:8002` and play the game.
