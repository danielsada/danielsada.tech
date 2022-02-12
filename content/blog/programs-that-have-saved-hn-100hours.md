+++
title = "Programs that have saved HackerNews 100+ hours by automating repetitive tasks"
description = "The top programs that have saved HN 100+ hours."
tags = [
    "productivity",
    "automate",
    "folder-cleanup",
    "software"
]
date = "2022-02-11"
categories = [
    "productivity",
    "automation",
]
+++

Five years ago (how fast time flies) [I made a blog post about programs that have saved me 100+ hours](https://danielsada.tech/blog/programs-saved-me-100-hours/), after uploading my article to [HackerNews](https://news.ycombinator.com/) a lot of people responded with their favorite programs that have saved them 100+ hours. I went out and took the best ones and compiled them into this list.

# AutoHotKey

AutoHotKey is a free, open-source scripting language for Windows that allows users to easily create small to complex scripts for all kinds of tasks such as: form fillers, auto-clicking, macros, etc. 

With AutoHotKey its easy to imagine how you can save hundreds of hours, with an example of our fictional friend Timmy:

*Timmy works in a paper business call center, he routinely has to take calls and send emails with the result of the call just after they happen. He has to do this several times per day, instead of having notes and copy pasting, he creates an AutoHotKey script that launches his email app.*

```
; Pseudo-Hotkey for brevity
^n:: ; Ctrl + N
Run Outlook
*LWin::Send {LControl+N down} ;open new mail.
Send boss@paper.com
{Alt down}{tab}
{Alt up};
Send Dear Boss, Call Log [d {enter} 
Send The customer reported a successful 
Send installation of <x> reams of paper.
return
```
*After each call, Timmy then just presses Ctrl + N and adjusts the numbers of reams of paper he sold.*

*Some time later, his boss asks him to fill in a database with his name and address and the customers after his call, because Timmy is so well versed in Auto Hot Key, he's able to automate filling the DB, and save 100s of hours.*

AutoHotKey is seriously nuts, the amount of things you can do, automate and test with it is incredible, [a quick glance to their docs](https://www.autohotkey.com/docs/Hotkeys.htm), can make you dream of the possibilities of automation, but always remember the rule of thumb XKCD:

![](https://imgs.xkcd.com/comics/is_it_worth_the_time_2x.png)
Randall Munroe ([xkcd.com](https://xkcd.com/1205/))

[Roisoyok, from the HN comments](https://news.ycombinator.com/item?id=13889315) mentions:
"Here are a few - these are small things, but they can incrementally save hours and hours
- CTRL+@ - pastes my email address at the cursor
- ALT+MouseWheel - Page up / Page down
- ]d - send the current date and time to the cursor
- CAPSLOCK - sets transparency of window to 75 as long as caps is held down
- #t - open http://e.ggtimer.com"

[Vasilli111 also recommends ](https://news.ycombinator.com/item?id=13890426)  [Awesome AutoHotkey list](https://github.com/ahkscript/awesome-AutoHotkey)
A curated list of awesome AutoHotkey libraries, library distributions, scripts, tools, and resources. 

**For MacOSX users**, there is BetterTouchTool (https://www.boastr.net/) [as mentioned by gadtfly](https://news.ycombinator.com/item?id=13892307) "is kinda like an AutoHotKey for OS X -- but on top of custom keyboard shortcuts, it also allows you to configure custom trackpad gestures." and [fatratchet adds](https://news.ycombinator.com/item?id=13891025) "I love BetterTouchTool, especially since it allows setting everything on a per application basis. I use it to have the same keyboard shortcuts for navigating tabs in everything, like browsers, iterm, finder, IDEs and more, it's so nice to have consistent shortcuts.

They also mention: "It's also really practical for programs that don't even support custom keybinds or when running multiple instances at the same time like multiple firefox profiles. No need to set the new shortcuts in every profile, they just always work on every running firefox instance."

# Standard Unix Utils

Most of the comments on HN, mentioned at least one Unix util. And I agree, having a good repertoire of Unix magic spells to become the ultimate Unix wizard can save you (or lose you!) hundreds of hours. 
> "I'd have to throw most of the standard Unix utils in there: grep, awk, cut, sed, sort, uniq, and of course, vim. Outside of the tech world, people seem to think that grabbing some columns out of a file and rearranging them or pasting them somewhere else is some kind of sorcery."
> -[AdmiralAsshat](https://news.ycombinator.com/item?id=13887932) 

I'm definitely not qualified to give you an explanation of each tool, [which is a good moment to remind my audience that this blog post is under GNU GPL 3.0 and I accept PRs to correct me](https://github.com/danielsada/danielsada.tech) Let's go into it then.

## Grep

Grep will let you search for text in a given input pipe, i.e. Search all the instances of thy in [Shakespeare entire work](https://ocw.mit.edu/ans7870/6/6.006/s08/lecturenotes/files/t8.shakespeare.txt) instantly.

```
shakespeare.txt | grep "thy"
```

By the way, there are 1732.

## Awk

The way I see awk, is a tool that allows you to handle CSV or TSV or even space separated tables, and have them match regex patterns, transform, and summarize them; given a table of paper sales like this (paper.txt):

```
1) Peter 100 Paper
2) Mark 200 Paper
3) Paul 50 Paper
4) Peter 400 Paper
```

You could:
```awk /Peter/ paper.txt```

```
1) Peter 100 Paper
4) Peter 400 Paper
```
You could also pretty print it:
```
awk '/Peter/ {print $2 " has sold " $4 " in " $3 " quantity"}' 
paper.txt
```

Which would display:
```
Peter has sold Paper in 100 quantity
Peter has sold Paper in 400 quantity
```

![](https://imgs.xkcd.com/comics/regular_expressions.png)
Randall Munroe ([xkcd.com](https://xkcd.com/208/))


## Sed
Sed is a really versatile utility, My Favorite [Sed guide](https://www.grymoire.com/Unix/Sed.html#uh-0) explains has a beautiful explanation on all the power of sed. The most popular command for sed is the substitution command. 

If you have a file like lorem.txt:
```
Lorem ipsum ipsum dolor sit amet, consectetur
Lorem ipsum dolor sit amet, consectetur
```
If then you run this:
```
sed s/ipsum/lapsum/ lorem.txt > out.txt ; cat out.txt
```
It will display:
```
Lorem lapsum ipsum dolor sit amet, consectetur
Lorem lapsum dolor sit amet, consectetur
```
Sed operates per line, so you can see only the first ipsum of each line gets changed.
You can do all magical kinds of things by changing the pattern "s/ipsum/lapsum/" to regexes, patterns or even full programs as [sed is Turing complete](https://catonmat.net/proof-that-sed-is-turing-complete)

The big issue is that then as Perl, there is something as too much sed. [[1]](https://www.grymoire.com/Unix/Sed.html#uh-47)
```
yes | head -10 | cat -n | sed -n -e '/1/,/7/ p' -e '/5/,/9/ p'
```
will print
```
     1	y
     2	y
     3	y
     4	y
     5	y
     5	y
     6	y
     6	y
     7	y
     7	y
     8	y
     9	y
    10	y
```

As a last comment on Unix utilities, [gshakir recommends](https://news.ycombinator.com/user?id=gshakir) [commandlinefu.com](https://commandlinefu.com) to search for some popular command line fu and have saved him 100s of hours.

# Perl

I'm not doing a section on Perl, but funnily enough, a lot of my tools in my work in Microsoft OneNote are built in Perl. *(Who are you Perl wizard who wrote these?)*

![](https://imgs.xkcd.com/comics/lisp.jpg)
Randall Munroe ([xkcd.com](https://xkcd.com/224/))

# Beyond Compare

Some [HNers like peapicker](https://news.ycombinator.com/item?id=13896374) and friends of mine (Hi Arturo!) swear by [Beyond Compare](https://www.scootersoftware.com/) which lets you compare [tables, pictures, files, folders, folder structures, hex files, mp3s, and executables](https://www.scootersoftware.com/features.php?zz=features_multifaceted). It's power seems truly limitless.

# Some extra software of mine

Finally, I wanted to list some of the new ones that are saving me hundreds of hours on specific platforms:

# Spectacle on OSX

One of the **most jarring things missing in OSX** is being able to snap windows to the sides or in quarters, similar to what Win + arrow keys does in Windows. [Spectacle](https://www.spectacleapp.com/) does this by providing you shortcuts on OSX to do this.

![](https://www.spectacleapp.com/images/right.jpg)

# Power Toys on Windows.

[Power Toys on Windows](https://docs.microsoft.com/en-us/windows/powertoys/install) has a lot of utilities that were missing on windows. My favorites in any order are:


## Power Toys Run
Similar to Spotlight for OSX, but for Windows, fully customizable.
![](https://docs.microsoft.com/en-us/windows/images/pt-powerrun-demo.gif)

## Color picker
You can now find colors you used in your screen! OSX also has a color picker included under Utilities.
![](https://docs.microsoft.com/en-us/windows/images/pt-colorpicker-hex-editor.png)

## Image Resizer
Resize images with right click.
![](https://docs.microsoft.com/en-us/windows/images/powertoys-resize-images.gif)

## Power Rename
Bulk rename files
![](https://docs.microsoft.com/en-us/windows/images/powerrename-menu.png)

