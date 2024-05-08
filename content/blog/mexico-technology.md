+++
title = "Mexico uses asymmetric encryption for university diplomas and taxes."
description = "It's really interesting that it is not well known that Mexico uses asymmetric  encryption"
tags = [
    "infosec",
    "mexico",
    "asymmetric encription"
]
date = "2020-11-25"
categories = [
    "infosec",
]
+++

I recently graduated, and in order to get my official graduation title I needed to get my private and public key from the government. **That's right, you go to the government's office, certify that you are who you are, and you'll get a private and public key in an USB key from the government** which you can use to do all your bureaucracy. 

You also get a TaxID which is comprised of

![An image explaining the structure of RFC, the Mexican Tax ID.](/images/blog/rfc.png)

With this key you can:

## Do government related bureaucracy

Want to get your passport? Sign in with your private key and password to the government portal and get it. Want your birth certificate? Get it online with your private key. Want to check your scholarship or any related paperwork? Just login online. This has made Mexican bureaucracy really good for the amount of people it handles. It specially astonishes me that it is instant, compared to most of the paperwork in the US which you have to mail stuff and it's in ten thousand different places.

## Get your digitally signed university diploma.

You enter your key via a web portal, and you can then get a signed copy of your university diploma by the government, which then links to a public government page which certifies you are the holder of that diploma. You can use this to certify that someone is a doctor, or lawyer or whatever with this system. I can also print as many university diplomas from the government portal whenever I want, as they are just a digitally signed sheet of paper (with a QR with the public key).

## Create signed invoices of goods and services & pay taxes

With your keys, you can also sign your invoices and guarantee that it is you who created them, and when you create a transaction, it automatically goes into the recipient's Tax ID. That means, that at the end of the year, I just login into the government portal/whatever software I like, and it **automatically calculates how many taxes I have to pay**. I can also login with my key into the government's website and pay my taxes with it.

## Why I created this post?

I think [social security numbers are not ideal](https://www.youtube.com/watch?v=Erp8IAUouus) and some of the government bureaucracy in the US still requires mail or checks or a physical office, this is merely inspiration or information hoping for something better.







