+++
title = "PEAR: Lessons from functional programming."
aliases = [
    "introducing-pear-the-functional-solid"
]
description = ""
tags = [
    "software",
    "quality",
    "SOLID"  
]
date = "2018-04-15"
categories = [
    "software",
    "engineering",
]
+++

After reading the [article from Edward Guiness with examples on how SOLID is implemented](http://webcem01.cem.itesm.mx:8005/s201811/tc3049/solid.html), I've come to want to add some things to SOLID myself, that were learned from my adventures in functional programming.

  

I'm introducing now:

# PEAR

(P)ure functions

(E)xpect (A)nything (and Address Domain)

(R)eturn early.

(also because acronyms are cool)

  

## (P)ure Functions

As long as you don't have to do things that modify state, or writes to I/O, try to encapsulate them into pure functions. Pure functions are those who don't have a side effect.

  

When possible, and not constrained by memory use:

  

[https://gist.github.com/danielsada/11ad85dc1011d89637642b0a2c0af1c5](https://gist.github.com/danielsada/11ad85dc1011d89637642b0a2c0af1c5)

## (E)xpect (A)nything (and Address Domain)

Let's say you are making a function to sum the digits in an array. One of the main learnings of my trip through clojure was to make your input work, for all the elements in a domain.

  

Let's assume two things, we don't have python's sum(), and we are creating a function that adds all the elements in a list.

  

[https://gist.github.com/danielsada/76051af3a877f7225141a5e7e574ae8a](https://gist.github.com/danielsada/76051af3a877f7225141a5e7e574ae8a)

  

This guarantees that your software isn't going to crash because of an unhandled exception, and allows you to think in different ways.

  

You can even do this in statically typed languages like C#, for certain types, or using dynamic.

  

[https://gist.github.com/danielsada/9b6a92eed4c77ce87ba9a311b60147de](https://gist.github.com/danielsada/9b6a92eed4c77ce87ba9a311b60147de)

  

## (R)eturn early

Return early is really good, [and this has been talked about in several posts in hacker news, that explain it better than I can.](http://blog.timoxley.com/post/47041269194/avoid-else-return-early)

  

But I'll show a simple example.

  

[https://gist.github.com/danielsada/3b1822f735aebc4d11462340f0d27e57](https://gist.github.com/danielsada/3b1822f735aebc4d11462340f0d27e57)

  

Over time, i've found in my short coding career, that these save a lot of time figuring out pain points, and helps get to more practical and usable software.

  

What are your coding principles? The ones you couldn't live without? I'd love to know more principles you like.

  

### References 

_“Understanding the SOLID Principles” by Edward Guiness (from the book “Ace the Programming Interview: 160 Questions and Answers for Success” published by Wiley in 2013) Retrieved from: http://webcem01.cem.itesm.mx:8005/s201811/tc3049/solid.html_