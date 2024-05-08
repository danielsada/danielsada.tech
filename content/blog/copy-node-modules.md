+++
title = "How to copy all your repositories without node_modules with rsync."
aliases = [
    "how-to-copy-all-your-repositories-without-node-modules"
]
description = ""
tags = [
    "node_modules",
    "rsync",  
    "javascript",  
]
date = "2018-01-23"
categories = [
    "how-to",
]
+++


Sometimes when we are making backups on our files, and specially if you are a Node.js developer, you'll suffer whilst copying your repositories to another place for making a backup. (Provided you don't have git for all your repositories)

Just do:

```  rsync -av --exclude 'node_modules' source destination  ```

And you are set. You could also exclude some other things like adding adding gitignore rules

``` rsync -av --filter=":- .gitignore" source destination ```