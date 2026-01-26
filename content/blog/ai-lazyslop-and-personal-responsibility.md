+++
title = "AI Lazyslop, and Personal Responsibility"
description = "A love letter on owning AI-generated code and the importance of personal accountability in code reviews"
tags = [
    "ai",
    "code review",
    "engineering culture",
    "personal responsibility"
]
date = "2026-01-26"
categories = [
    "software engineering",
    "ai"
]
+++

Once upon a time, I got a PR from a coworker, I'll call him Mike. 

Mike sent me a 1600 line pull-request with no tests, entirely written by AI, and expected me to approve it immediately as to not to block him on his deployment schedule.

When asking for tests, I'd get pushback on "why do I need tests? It works already". Then, I'd get a ping from his manager asking on why am I blocking the review.

After I "Requested changes" he'd get frustrated that I'd do that, and put all his changes in an already approved PR and sneak merge it in another PR. 

**I don't blame Mike, I blame the system that forced him to do this.**

But this is the love letter I'd wish I could have written to him. 

## AI and personal responsibility.

Dear Mike,

I know you wrote your PR entirely using AI but you didn't review it at all.  I'm not opposed to you using AI, but what I want to know is:

- What was your thought process using AI?
  - Share your prompts! Share your process! It helps me understand your rationale.
- Did you personally review the code?
  - One tip I personally do is to add comments to my own PR to show the team my process.
- Did you use any AI reviewing tools? What things did you decide to fix and ignore?
  - I care more about what **you** think.
- How do you have confidence that this works?
  - The cost of tests is cheaper with AI, can you write a test for it?
  - But also don't lazy-slop-tests that only test language fundamentals. (Classic test testing dictionaries getters and setters.)

## Others in the industry

As we find ourselves in this new world, there is still some *shame* in using AI. But we shouldn't! Ghostty is asking people to [disclose the use of AI upfront](https://github.com/ghostty-org/ghostty/pull/8289) and I think changes like this are positive.

[Linus Torvalds recently mentioned playing and vibe-coding with AI](https://github.com/torvalds/AudioNoise) for a language he didn't master. We are experiencing a cultural shift in how this tool integrates in our daily lives. Even if you, personally, don't use AI; There is a high probability that a coworker or collaborator will, and then, you have to decide the rules of engagement. 

Given that, I want to define AI Lazyslop.

>AI Lazyslop: AI generation that was not read by the creator, which generates a burden on the reader to review.

## The anti-AI Lazyslop manifesto.

I will own my code, and the outputs of the parts of the LLM I decide to accept. I will disclose use of AI for my code.

I attest that:
- I have read and tested all my code.
- I have included relevant plans/prompts in my PR.
- I have reviewed my code with some AI assistance, and this is the summary of what I decided to fix:
- I can explain the logic and design decisions in this code without referring back to AI.


## What happened to Mike?

Well, I'd like to say there was a happy story, but Mike evolved to the semi-lazy-slop mode, in which he relayed all of the comments reviewers had to his PR to the LLM. Is that better? Is that worse? I'm not sure, but I'm guessing this is happening in a lot of places.

## AI Disclosure

I used claude to help me "Help me review my blog post for style and grammar". It catched the following:

```
Line 18: Missing space after "immediately"
Current: immediately not to block him
Better: immediately so as not to block him or immediately to avoid blocking him
Line 18: Question punctuation
Current: "why do I need tests, it works already"
Should be: "why do I need tests? It works already" (separate sentences or use semicolon)
Line 20: Unnecessary quotes around "Requesting changes"
Current: After me "Requesting changes"
Better: After I requested changes or After my "Requesting changes" review
Line 46: Typo
Current: rules of engeagement
Should be: rules of engagement
Line 46: Comma splice
Current: Even if you, personally, don't use AI; There is a high probability
Should be: Even if you, personally, don't use AI, there is a high probability (lowercase "there" after semicolon, or use period)

Line 51: The sentence is a bit long. Consider: I will own my code and the LLM outputs I decide to accept. I will disclose my use of AI.
```