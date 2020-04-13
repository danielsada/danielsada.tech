+++
title = "Programs that have saved me 100+ hours by automating repetitive tasks"
aliases = [
    "programs-that-have-saved-me-more-than-100-hours-by-automating-repetitive-tasks"
]
description = "My top 5 programs that have saved me pains, time and tears."
tags = [
    "productivity",
    "automate",
    "folder-cleanup",
    "software"
]
date = "2017-03-15"
categories = [
    "productivity",
    "automation",
]
+++

*Since I wrote this, there has been two HN threads on this blog, they contain super useful links and programs, go see them! Thank you for reading!*
https://news.ycombinator.com/item?id=13887237
https://news.ycombinator.com/item?id=22849208


Along the year I've been working on several web platforms where repetitive tasks are usually the norm. From batch optimizing a thousand images, to changing from this obscure format to csv or json. What if you need to critically update a file in your client's and you aren't fancy enough to use some kind of continuous integration tool I'll give you some tips and tricks to be productive.

# 1\. PhotoBulk

A client comes by, dumps you a folder of 10 GB of pictures in 4000x4000 and each one of them weights 30MB in JPEG format. The client needs all this images tomorrow in the webpage, watermarked and with specific names. As you mop tears from the floor, you read this guide and discover PhotoBulk for [Windows](https://www.eltima.com/products/bulk-photo-editor.html) and [Mac](https://mac.eltima.com/bulk-image-editor.html). 

![](https://phaven-prod.s3.amazonaws.com/files/image_part/asset/1850945/Q6oltvJvG4Kwgy_V23yBvDPOqW4/thumb_Screen_Shot_2017-03-15_at_5.46.19_PM.png)

Photobulk lets you resize, watermark, optimize and rename images in bulk, or in batches. This was one of the main tools that have saved me hours and hours, so I widely recommend it. I know some of this things could be done via console, or via a photoshop action. But this is way faster.

# 2\. Regex and Sublime Text

The same client, not happy that you took 4 hours to do the shenanigans to the images and upload them, goes and asks you to add a palette of 200 colors, given in an php array, to complete the migration of their color palette to javascript.

<iframe src="https://giphy.com/embed/j2xXLmnnN8N2g" width="480" height="192" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/j2xXLmnnN8N2g">via GIPHY</a></p>

Regex is so powerful to create fast changes in massive data, that i've saved countless hours of conversions or friend's tasks that it is worth learning. I never understood the power of regex, until I used it in a text editor. Really amazing.

# 3\. Coda or KomodoIDE

After uploading the pallette of colors to the website, the customer needs in a hurry to edit the website, because he added his CC number to a username field. Clearly this is trouble. Better than that, he also managed to hard code it somehow to the php code. In this client's alternative world, continous integration doesn't exist. Imagine going to a world where you have to fire up Filezilla, download the file for the code. Edit it, and then upload it. Also firing up your mySQL db manager, or console, searching the concrete entry, and changing it.

After sometime doing this, for urgent tasks in places without versioning \*shudders\* I've used Coda, from panic. (for macOS) or Komodo IDE (for Windows). Both this programs, allow to set up a direct FTP link and mySQL connection to a DB, where you double click the site, and you get an instant connection to the server. So you manage to control the leak of customer's data to 10 minutes because you were fast.

# 4\. Alfred or Spotlight.

One of the tools that have saved me the most time are Alfred and Spotlight (maybe Cortana, but it is still not there). Want to open a file quickly? Cmd + Space -> file.xls . Want to do a conversion? Cmd + Space -> 100 USD to CAD or 10 lt to gal Want to do math? Cmd + Space -> (13239*(1232+24)*2) + 123 % 2

  

![](https://www.alfredapp.com/media/pages/home/clipboard.jpg)

Alfred is even more awesome, you can program scripts to run or searches given certain keywords. You just get everything instantly.

# 5\. Hazel

Now, after working 3+ years in the same computer, with multiple clients,  I _despise _getting it in order. So I decided that I'd get Hazel (or File Juggler for windows). Where you can create rules on your folders, based on how you want them organized. 

![](https://www.noodlesoft.com/kb/uploads/xmain.png.pagespeed.ic.4wQ59TUX7j.webp)

For example, I can create a rule that watches my desktop for files more than 4 hours old, that are screenshots, and it takes them to my "Screenshot folder", or downloads that I haven't used in more than X weeks. Or create a rule that filters out images. Or create a folder which "sorts" all the files I put into it.

  

# But, hey, this is pretty basic.

I know this is fairly basic, but there is people who _manually _ does this actions, because they don't want to bother themselves with this kind of automation. Or they don't have the time to automate them themselves. So if this saves some time, I'd like for it to be useful as it was to me.

What are your 100 hour time savers?
