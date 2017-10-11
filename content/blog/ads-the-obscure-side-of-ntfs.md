+++
title = "Alternate data streams, the dark side of NTFS."
description = "Alternate data streams are a feature of NTFS which let's you encode more files inside a file."
tags = [
    "infosec",
    "software",
]
date = "2018-06-12"
categories = [
    "infosec",
    "software",
]
+++

Have you ever had a hard drive which runs out of space while there is still space remaining? Have you ever wondered where that space goes? Let me show you a **magic trick**

First I'll save a message in message.txt

![A gif that shows me saving a message in a folder.](/images/alternate/alternate.gif)

Nothing here nothing there, I'll save two **secret** messages the first one is a secret, the second one a big file of text. (but I could save a jpg or an exe). The first message is a suposed password, the second one is the complete works of shakespeare.

![A gif that shows using alternate data streams to encode messages into a file. This is made with a semicolon between the names. file semicolon file to save](/images/alternate/SaveSecretMessage.gif)

Well, tada, I've put two bunnies in the hat. Let's now show them with **dir**

![Dir shows the message in 16 bytes instead of using something in the order of kilobytes. Dir doesn't show ads](/images/alternate/waitWhat.png)

Wait. *What?*. 23 bytes? That is way less than the complete works of shakespeare. Most importantly I can recall perfectly fine my files.
 
![A gif showing that the files can be opened](/images/alternate/recall.gif)

First of all, I'm trying this in the latest build of Windows 10. This is how this file looks in explorer

![A picture showing that explorer says it is only 1KB](/images/alternate/explorer.png)

Well, there is this one obscure feature of NTFS that you can't find too much information in Google about, It is rumored that people hide things inside this sector when they really want to hide something. This is Alternate Data Streams, or as I call them NTFS Tags. 

## NTFS & Alternate Data Streams

Alternate Data Streams are a gift from the past, back from when the Macintosh HFS was being implemented, and Windows had to present a compatibility layer for HFS, which has two parts to a file, the resource fork and the data fork. Resource forks stored bitmaps, other files and different kinds of resources needed for a file. The data fork recalled the file's contents itself. Well, as NTFS was being implemented, there was no way of putting resources into a file, so they created ADS to store the resources. 

I've stumbled into this obscure NTFS property in my digital forensics classes with Andrés Velazaquez. Turns out, that NTFS can tag things along in a key value store for each file, and add them as Alternate Data Strings. This happens with the poorly supported, poorly documented, yet-still-there semicolon for files in NTFS. 

![A picture with a visual representation of the ads](/images/alternate/explain.png)

In order to create a new ADS, you have to add colon after the name of the file

```
> notepad file1.txt:secret.txt
> notepad file1.txt:photo.jpg
```

Each Tag, as it is a string, allows us to store everything from binaries, to images, to text to any kind of content we'd want. And have the content dissapear from disk. We can copy (but not run) exe binaries, images, pdfs and all other kinds of things.

You can't start a program by giving it the relative route:

```
C:\Users\danie>message.txt:secret.exe
The filename, directory name, or volume label syntax is incorrect.

C:\Users\danie>c:\Users\danie\message.txt:secret.exe
The filename, directory name, or volume label syntax is incorrect.:

C:\Users\danie>start message.txt:secret.exe
Access is denied.
```

You have to give it the full route:

```
C:\Users\danie>start c:\Users\danie\message.txt:secret.exe
Oh no, you've been hacked!
```

**Wait what?**

I know, right? It's one of those things you would think is in the public spotlight, but they still remain as a relic from the past.

Some other blogs have wrote about this, but the lexicon is so complex, that you might as well glance over it.

>Unfortunately, it is virtually impossible to natively protect your system against ADS hidden files if you use NTFS. The use of Alternate Data Streams is not a feature that can be disabled and currently there is no way to limit this capability against files that the user already has access to. 
- [Techgenix](http://techgenix.com/alternate_data_streams/)

It turns out, that ADS are not all bad, they can help you encode information inside your files, [John Marlin, explains how ADS are used to enhance funcionality](https://blogs.technet.microsoft.com/askcore/2013/03/24/alternate-data-streams-in-ntfs/), but I still find it pretty entretaining and rather obscure.

[John Marlin, a devleoper for Microsoft Windows Core team, goes into details](https://blogs.technet.microsoft.com/askcore/2013/03/24/alternate-data-streams-in-ntfs/)

## Are all ADS bad?

Well, no, usually they are used to tag content to a file to give context. As mentioned in the blog above, internet explorer used it to determine which zone of protection the file has. There is also a big caveat in using ADS, they aren't transferred if you change filesystems. So moving it to an USB seems to be not useful, as the ADS are destroyed. (Assuming a FAT32 filesystem).

## Wait, but how do I know if there is ADS?

Well my friend, here are the good news, you no longer need any fancy tools to detect ADS, now you can simply go to the cmd and write

```
dir \R
```

You'll get all the list of the files, with their respective ADS.

![dir /r displays the three files](/images/alternate/dirr.png)

You can also hit the properties context menu and you'll get some indication that ADS are embedded to a file.

![The properties context menu displays that the size on disk is 1.23 MB](/images/alternate/properties.png)

This is all for today folks, If you have any feedback for this article, [make a pull request in github](http://github.com/danielsada/danielsada.mx/)

What are your obscure filesystem tricks? 
