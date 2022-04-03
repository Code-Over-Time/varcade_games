# Running The Project

First things first, we need to get our hands on the code.

***

## SSH Keys

We will create some SSH keys so that we can pull code securely from Github.

From the home directory of your Ubuntu terminal (you can get there by typing `cd ~/` in the Ubuntu terminal and hitting return), run the following command to create some SSH keys (replacing the email address here with your own):

```
ssh-keygen -t ed25519 -C john.doe@foo.com
```

You will then be prompted to to select a directory and a passphrase. You can just hit `return` twice to accept the defaults. 

The output from this process should look something like this:

```
 ✘ kev  ~  ssh-keygen -t ed25519 -C john.doe@foo.com
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/kev/.ssh/id_ed25519):
Created directory '/home/kev/.ssh'.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/kev/.ssh/id_ed25519
Your public key has been saved in /home/kev/.ssh/id_ed25519.pub
The key fingerprint is: <REDACTED> john.doe@foo.com

The key's randomart image is:
+--[ED25519 256]--+
|          o.o+O@#|
<<    snipped    >>
|                 |
+----[SHA256]-----+

```

Next we need to attach the pubic SSH key that we just generated to our Github account. Run the following command in your Ubuntu terminal:

```
cat ~/.ssh/id_ed25519.pub
```

The output of the command will look something like:

```
ssh-ed25519 AAAAC3NzaC1lZLI1TTE5AAAAIK0wmN/Cr3JXqmLW7u+g9pTh+wyqDHpSQEISczXkBx9q john.doe@foo.com
```

Copy that line, we will use it in the next step.

Open your github account and go to Your Profile (Icon at the top right of the screen) > Settings > SSH and GPG keys.

Click the `New SSH Key` button. Give your SSH key a name that helps you understand what machine this key belongs to and then paste in the output from the previous command (your ssh key output).

## Downloading the code

Now we can get the code. Head back over to your Ubuntu terminal and create a new directory for your code:

```
cd ~/
mkdir code
cd code
```

The clone all of the required repos using the following commands:

```
git clone git@github.com:theblacknight/build_tools.git
git clone git@github.com:theblacknight/website.git
git clone git@github.com:theblacknight/matchmaker.git
git clone git@github.com:theblacknight/stats_tracker.git
git clone git@github.com:theblacknight/game_rps.git
```

If you entered a passphrase for your SSH key you will need to enter it now. The output will look something like this:

```
 kev  ~/code  git clone git@github.com:theblacknight/build_tools.git
Cloning into 'build_tools'...
The authenticity of host 'github.com (140.82.121.4)' can't be established.
RSA key fingerprint is SHA256:nThbg6kXUpJWGl7E1IGOCspRomTxdCARLviKw6E5SY8.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added 'github.com,140.82.121.4' (RSA) to the list of known hosts.
Enter passphrase for key '/home/kev/.ssh/id_ed25519':
remote: Enumerating objects: 356, done.
remote: Counting objects: 100% (356/356), done.
remote: Compressing objects: 100% (178/178), done.
remote: Total 356 (delta 247), reused 268 (delta 161), pack-reused 0
Receiving objects: 100% (356/356), 62.04 KiB | 577.00 KiB/s, done.
Resolving deltas: 100% (247/247), done.
```

## Working with the code

#### !! Windows Specific

Once all of the projects are cloned you can do something pretty cool. Run the following command:

```
code .
```

This is a special program in the Windows Ubuntu distro that will open up VSCode on your local machine, but connect it to the Ubuntu instance so that you can modify the code that we just cloned directly from Windows!

Feel free to explore the code for a while before proceeding. There are detailed README files in each project folder and in all first level sub-folders that should help you understand what each of the different pieces is doing. 