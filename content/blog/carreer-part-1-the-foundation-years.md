+++
title = "Part 1: How breaking computers taught me to build them."
description = "My 12-year journey in software: how breaking computers taught me to build them."
tags = [
    "beginnings",
    "learning",
    "curiosity",
    "exploration"
]
date = "2025-03-31"
categories = [
    "career",
    "foundations"
]
series = ["My career so far"]
+++

You know when you are on a hike, and there is a point where you are exactly midway through it? There is always a reflection moment in there, where some thinking happens. Sometimes you look back and realize: it's been a long journey so far, hasn't it?  

I recently turned 30, which, like all numbers that arbitrarily end with a zero, is a special time for reflection. For funsies and to reflect, I wrote what I've been up to the last 12 years and how I got to where I am. This is part one of a multi-part series exploring my journey into software engineering.

## Clicking Everything: How Curiosity Built My Foundation

The first time I broke my computer, **I wasn't upset. I was thrilled**. Breaking things taught me how they worked, and that black terminal screen wasn't just a mystery; it was **an invitation**.

It's a little bit unclear when exactly I got into software engineer, but I have some ideas of what started my curiosity in computers. The first and most important thing, is that my mom got us a computer in the house and my grandpa would give me his next-generation laptops that he stopped using. 

Having a machine for yourself in the late 90's meant that you get to learn how to install/remove stuff and to play games. And playing games in that era required a lot more work than it is today.

![Windows 95 install screen.](/images/blog/career/win95.png)
_What do you install? Typical? Custom? Compact? How do you even choose?_


```
1. Insert installation disc
2. Run setup.exe
3. Enter product key
4. Install appropriate drivers
5. Configure display settings
6. Run game with disc inserted
```

With the troubleshooting you had to **do normal stuff,** you learnt a lot about computers this way. I used to spend a lot of time clicking everything in the start menu, one by one, and trying to understand what it did.

![My briefcase](/images/blog/career/briefcase.png)
_Yes, this included making briefcases_

When clicking all the things, I stumbled upon CMD.exe; the little white and black terminal that was always a puzzle to me.  *What do you do little terminal?* What can I type **there**? 

```
@echo off
echo Hello, what is your name?
set /p name=
echo Nice to meet you, %name%!
pause
```

Finding my first commands was exciting. `cd`, `dir`, `set`, and `echo`. Fun!

## Forums, my first developer community.

In trying to find how the terminal worked by searching the internet, I got immersed into my first forums, and I started writing scripts to try to do some fun text adventures. Doing file operations and writing scripts here or there and even simple  games, was the first time I started coding. Finding a new way to use a command was so *awesome*.

> Curiosity and exploration are essential for learning.

During that time, the way to get knowledge was surfing through forums. I joined several to find out how to program. They talked about *C++, Batch files, VB6, Perl*. Exploring the forum world was like having a community that would guide you immediately to opening more doors. Threads like "*Learn to code in C++, 1 of 10*" and  "*Why scripting in PERL is so powerful*". I spent a good 2-3 years learning everything in forums. How to build my own Portable app (So you didn't have to carry the CD?!).  Everything was fun and new, and I got a community to talk about it (maybe the equivalent today is dev.to?).

A typical forum exchange might look like:
```
Me: How do I make my batch file ask for user input?

ForumGuru98: Try using the SET /P command:
SET /P variable=Prompt text

Me: It worked! Can I also clear the screen?

ForumGuru98: CLS is your friend :)
```

> Communities (& forums) accelerate learning

## Linux Adventures: Failing to Win.

Another important learning experience was setting up my own Linux distro and dual boot. I'd set up my own Linux from scratch at the start of the year with different distros. I managed to bork my laptop every year with some step I did wrong. 

  Installed the wrong graphic drivers? BORKED. 

  Modified `/etc/X11/xorg.conf` without backup? BORKED. 

  Accidentally deleted critical system files? BORKED.

It took several years to understand how Linux configurations worked and to discover that you could switch to terminal sessions with Ctrl+Alt+F1 through F6 to rescue a system with a broken GUI.

A particularly painful lesson came when I tried editing my first configuration file:

```
# My first attempt at editing xorg.conf
# (with no backup, of course)
sudo vim /etc/X11/xorg.conf

# Example edits I would do
Section "Device"
  Identifier "My Graphics Card"
  Driver "nvidia"  # Should have been "nouveau"
  Option "Resolution" "1600x1200"  # lol
EndSection
```

Each borked system taught me more about how computers actually worked than any successful installation ever could.

> Borking things (specially Linux) should be required for every computer scientist.

## Web Development: The Neopets Era

The start of my web dev career was setting up my **Neopets store**. For those unfamiliar, Neopets was an interactive browser game in which you could feed your pet, care for it, and battle with other pets, while gaining in-game currency by playing super fun flash games. Part of being in Neopets, is that you had to create your store/gallery with HTML so that people could buy things from you or to show your hardly-earned items in a display for bragging rights.

The amount of creativity accross the different stores was amazing, and creating yours  nicely, meant more people would visit it, hence **you would get more NeoPoints (!!)**. People had the most advanced stores in there, filled with repeating gifs, tiled jpegs and marquee effects. There even was community-shared templates which you could edit and reuse. This was the first time I ever approached CSS. HTML and *centering things*. 

An example NeoPets store would look like this:
```
<html>
<head>
  <title>My Awesome Neopets Shop</title>
</head>
<body bgcolor="#FFCCFF">
  <center>
    <font face="Comic Sans MS" size="5" color="purple">
      Welcome to My Shop!
    </font>
    <marquee><img src="http://images.neopets.com/items/toy_plushie_faerie.gif"></marquee>
    <table border="1" width="500">
      <tr>
        <td>Item</td>
        <td>Price</td>
      </tr>
      <tr>
        <td>Magic Healing Potion</td>
        <td>5,000 NP</td>
      </tr>
    </table>
  </center>
</body>
</html>
```

> Gamifying programming is super effective in creating interested programmers

Looking back, it's clear that these early experiences were more than just a passing phase - they were the foundation upon which my career would be built. From the command line to the web, from the forums to the gaming communities, each step of the journey played a part in shaping the developer I would become.

What are the things that made you get into technology? Comment below!