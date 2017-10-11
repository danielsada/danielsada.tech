+++
title = "Please ignore and remove your wp-config from GitHub"
aliases = [
    "please-ignore-and-remove-your-wp-config-from-github"
]
description = ""
tags = [
    "infosec",
    "stories",  
]
date = "2018-01-15"
categories = [
    "software",
    "infosec",
]
+++

# In my InfoSec class, we were asked to show a preliminary attempt at google hacking.

We were tasked to try to get some indices of google hacking performed, to show us the importance of monitoring our site's search engine exposure and possible file requests permissions. Examples included:

>  site:something filename:admin.php

While it certainly is something that sounds fun, for me this is more of a gimmick, nevertheless it made me think for a second. Besides the [famous search for "add password" or "aws keys" or looking for .pem files,](https://www.theregister.co.uk/2015/01/06/dev_blunder_shows_github_crawling_with_keyslurping_bots/) we could ideally search for files that contain connection strings. So an idea sprang to mind. Which files usually have database configs, which might be uploaded to a repository.

![](https://phaven-prod.s3.amazonaws.com/files/image_part/asset/2003062/iPzhe15hQK7Trx2c65x1WTJ2LuI/thumb_GithubResults.png)

Oh... darn.

For those who aren't well versed on the internals of WordPress, when you install a WordPress site, you generate a wp-config.php file which determines your Salts, Keys and connection strings to a DB. The possible impact of having this exploited is minimal if you have good security practices, If you have your localhost db configured to only accept connections from yourself, knock yourself out and publish your somewhat secret wp-config. But even then, having the Salts and API keys to your github is almost as bad as having your files stored as plain text.\[1\]

Well, it seems it is pretty common to have your wp-config on github. You would **expect** someone to do the sensible thing and declare this as secret files like this:

![](https://phaven-prod.s3.amazonaws.com/files/image_part/asset/2003063/eI8EDVzuMc21pR4GUNF7HZ4s58o/thumb_secureWP.png)

Nevertheless I found some things like this: 

![](https://phaven-prod.s3.amazonaws.com/files/image_part/asset/2003066/Y7TnhukC6eFvQ94UNx1aNnp7E-g/thumb_results.png)

All of this, in public repositories. 

Also there is plenty of commits which mention "deleted wp-config", which also have the commit history for that file for the repository, so even though you are deleting sensitive info, it still exists in previous versions. That is really important to consider. while deleting your wp-config. Or at the very least, [renew your hashes.](https://ithemes.com/security/wordpress-salt/)

Et tu, readers? What other files should people be aware to .gitignore that aren't commonly mentioned?

\[1\] From Wikipedia: "Using a single salt also means that every user who inputs the same password will have the same hash. This makes it easier to attack multiple users by cracking only one hash." While it isn't storing your passwords in  plaintext, de-hashing your password becomes easy. Also see: [https://codex.wordpress.org/Editing\_wp-config.php#Security\_Keys](https://codex.wordpress.org/Editing_wp-config.php#Security_Keys)