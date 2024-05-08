+++
title = "Apollo: A history of software design."
aliases = [
    "apollo-a-history-of-software-design"
]
description = ""
tags = [
    "stories",
]
date = "2018-01-15"
categories = [
    "stories",
]
+++


As tradition follows, we usually get screenings of interesting movies in class, today we got a screening of **Moon Machines \[1\]** a documentary by the science channel about the Apollo Guidance system and their corresponding code.This documentary was about the testimonies of people in MIT and the general creation of the whole Apollo mission.

What is interesting is that some years ago, I saw a [GitHub repository of the commentated Apollo  code,](https://github.com/chrislgarry/Apollo-11) It is wonderful to see such a marvelous display of engineering be on a repository in the internet. I invite you to also read the[ issues on the repository](https://github.com/chrislgarry/Apollo-11/issues?q=is%3Aissue+is%3Aclosed+label%3A%22Type%3A+Humour%22).

I'll add some excerpts here that I found interesting, but what is more interesting yet, is that there is a compiler in the internet for this code, you can head over to the [VirtualAGC GitHub](http://www.ibiblio.org/apollo/) and compile your own Apollo 11 and simulate a lunar landing. If you want to spare yourself the hassle of learning everything about Apollo's computer, check out [this YouTube video](https://www.youtube.com/watch?v=E301HplyA7A) which does everything the astronauts did to get to the moon. 

What is most impressive for me is the way this guys thought about software in a very specific fault-proof way. Today we have compilers which foolproof our ability to do faulty code.  Is it real that we are inside the time that software quality is at its all time low? I don't have the answer for that question, but what I can say is that this code is árt, even though we aren't able to read it easily (more because it is just subroutines directly) we can see that for this guys to do something never done before, with this precision, takes a huge amount of determination, perseverance, and  intelligence.

> LOAD VERBS IF ALARM CONDITION IS DETECTED DURING EXECUTE,
> CHECK FAIL LIGHT IS TURNED ON AND ENDOFJOB.  IF ALARM CONDITION IS
> DETECTED DURING ENTER OF DATA, CHECK FAIL IS TURNED ON AND IT RECYCLES
> TO EXECUTE OF ORIGINAL LOAD VERB.  RECYCLE CAUSED BY 1) DECIMAL MACHINE
> CADR 2) MIXTURE OF OCTAL/DECIMAL DATA 3) OCTAL DATA INTO DECIMAL
> ONLY NOUN 4) DEC DATA INTO OCT ONLY NOUN 5) DATA TOO LARGE FOR SCALE
> 6) FEWER THAN 3 DATA WORDS LOADED FOR HRS, MIN, SEC NOUN.8  (2)-(6) ALARM
> AND RECYCLE OCCUR AT FINAL ENTER OF SET. (1) ALARM AND RECYCLE OCCUR AT
> ENTER OF CADR.

It is incredible that they really thought of everything, even then when compilers only compiled, you had no way of detecting beforehand runtime errors, or have static analysis.  

    **“Moon Machines: The Navigation Computer”** produced by the Science Channel. This video was seen during class on Tuesday, January 9 \[1\]