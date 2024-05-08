+++
title = "Developer productivity is 99% perception"
description = ""
tags = [
    "developer productivity",
    "software",
    "culture"
]
date = "2024-05-08"
categories = [
    "developer productivity",
]
series = ["Introduction to Developer Productivity"]
+++

While I was working in OneNote, one of the things the organization wanted to improve was developer productivty. We would conduct a survey called DevSat and get a general developer satisfaction score, measured in Net Satisfaction (NSAT) [^1]. The EVP would sit every week in this meeting to make sure this developer satisfaction was high across all teams in Microsoft. Microsoft is convinced that there is a correlation between dev satisfaction and productivity. [^2]

## WTF moments.

One of the most surprising things I learnt in these meetings, is that measuring dev productity affects dev productivity. 

The DevSat survey had been going on for years, and in OneNote, we were in low 60s (out of 200) and our response rate was low. We decided to send a single email out asking people to please fill the survey. Sending this email asking people to fill the survey gave us a statistically significant +20 points to sit in the low 80s. 

**We hadn't done anything and we got 20 points.**

Feeling great about ourselves, we went to ship build optimizations that took builds from 1 hour to 50 minutes. We then announced to the organization that **builds were faster** *yay!*.

**Dev productity rose by 15 points to 95**

After sending the email celebrating our big "win", we then went to check the average build time for all developers, **it hadn't changed**. Turns out, we'd forgot to switch the config, and there was no boost in build times, yet Developer Satisfaction rose sharply! WTF. Turns out, announcing the improvement, improved developer satisfaction. 

Now, I'm not saying this is a susteinable model[^3] – Or that you should gaslight your users into productivity – but this is an interesting insight into how *some aspects* of satisfaction is based on perception and not on hard cold data.

## Developer productivty is perception

Let me guide you through a thought experiment: You are a new engineer in a team, and you have two possible onboarding buddies, one is Happy Eustace, and the other one is Sad Dave. You excitedly join the team, and your mentor is showing you the ropes.

### With **Happy Eustace**, the conversation goes like this:

– Hey, I'm happy you joined us, here is the guide on how you build,  it takes 1 hour, **but it's pretty good**, sometimes you can go work on other things while it progresses. There is a team that will help if it becomes slower.

– Does it fail sometimes?

– Yes, but we rebuild, and then it succeeds :).

### With **Sad Dave** the conversation goes like this:

– Oh, hey there, I guess you're new here, follow the guide. So, you want to build the codebase? Well, you'll need to use make build, it sucks, it takes at least an hour *when it works*. Sometimes longer, and there’s a good chance it’ll fail halfway through. If that happens, you'll need to start over. And no, there's not much help available if it breaks.

– Is there anything I can do to speed it up or avoid those failures?

– Not really. It's been like this for a while. Just try to get used to it, and maybe keep yourself busy with something else during the long build times. It's all infra's fault.

> How your peers address the language of your system **affects your productivity**

I'm not saying to get rosed-colored-glasses, or to be a relentless optimist; but being careful on how you navigate conversations in your work can have a huge impact on your developer's productivity.

I'll go back to one of my favorite quotes:
>   I think it’s unwise in life to become too cynical - cynicism can lead to paralysis under a theory that “well, we’re all fucked anyway so why bother.” - Jimmy Wales 

## Placebo works, use it.

Over time, we corrected our mistake, but what is really interesting for all teams that started doing this is that **just listening to developer feedback and acknowledging it** improved developer productivity for the team. Starting to listen and having interviews with developers can take you a long way to start addressing your users' needs. 

## Perception is important, what's why the framework focus on them.

Jumping into the future of the series, most of the major developer productivity frameworks work with perception in some level.

I've taken this screenshot from a screenshot of the ACM description of SPACE Metrics, and I've highlighted in green all of the places where perception comes in:
![A highlight of all the SPACE metrics that have to do with perception, in this case satisfaction and perception is highlighted several times, navigate to the article for space below for more detail. ](/images/blog/dev-productivity-annotated.png) [Article](https://queue.acm.org/detail.cfm?id=3454124)

Same thing for the DevEx Framework! I've highlighted in green perceptions
![A highlight of all the SPACE metrics that have to do with perception, in this case satisfaction and perception is highlighted several times, navigate to the article for space below for more detail. ](/images/blog/devex-annotated.png) [Image source](https://www.hatica.io/blog/devex-framework/)

I don't really believe Developer Productivity is 99% perception, but not understanding that it is a deep component of Developer Productivity is a huge miss in understanding how to make your developers more satisfied.

### Footnotes

[^1]: This is a bit of a brutal formula, due to it taking more weight towards dissatisifieds being: % really satisfied - dissatisfied % - really dissatisfied % + 100 

[^2]: [Study here](https://www.microsoft.com/en-us/research/publication/towards-a-theory-of-software-developer-job-satisfaction-and-perceived-productivity/)

[^3]: Eventually, your developers figure out you are full of BS and then they will revert to the mean... or lower.

