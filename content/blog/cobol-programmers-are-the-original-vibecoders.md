+++
title = "COBOL Programmers Are the Original Vibe Coders"
description = "COBOL programmers didn't care about elegance or technical correctness—they cared about getting stuff done. Sound familiar?"
tags = [
    "cobol",
    "vibecoding",
    "programming",
    "history"
]
date = "2026-07-19"
categories = [
    "programming",
    "software-history"
]
+++
I was reading Marianne Bellotti's *Kill It with Fire* when I found a description of COBOL that sounded strangely familiar:

> COBOL was a language built for people who did not want to understand how the computer worked; they just wanted to get the job done.

Today, we would probably call those people vibe coders.

That comparison might sound insulting to COBOL programmers, vibe coders, or both. I don't mean it that way. COBOL changed the world precisely because it allowed more people to use computers without first becoming computer scientists. It gave people a tool that looked closer to the language of business than to the language of the machine.

The promise of AI is similar: tell the computer what outcome you want, and let the tool translate that intent into instructions the machine can execute.

We have been here before.

## COBOL and ALGOL

Bellotti describes two groups with very different incentives:

> Computer scientists during this period had opposite incentives. While COBOL users were judged and rewarded based on their ability to get nontechnical things done faster with computers, ALGOL 60 users were judged and rewarded based on their ability to expand the functionality of what was even possible to do with the machines in the first place.

The COBOL programmer used the computer to solve a payroll problem. The ALGOL programmer tried to expand what programming languages and computers could do. What makes this history interesting is not that COBOL users lacked technical ambition. It is that they did not need technical ambition to create value with a computer.

Bellotti writes:

> This group of people didn't care about being "real programmers." They cared about getting stuff done, better and faster than the competition if possible. Technical correctness didn't matter. Elegance didn't matter. Execution mattered, and anything that lowered the barrier to using computers to execute their goals was preferable to more powerful tools that were harder to learn.

This is almost exactly how people talk about AI-assisted programming today. The vibe coder does not necessarily care whether the generated code uses the ideal abstraction. They care that the website works, the report gets generated, or the repetitive task disappears.

> The lesson to learn here is the systems that feel familiar to people always provide more value than the systems that have structural elegance but run contrary to expectations.

The professional programmer may look at the same code and see duplication, weak error handling, security problems, or a maintenance burden. Those concerns are real. But they are not always the concerns by which the creator is judged.

## The people who make the magic possible

Last week, I attended [Software Should Work](https://softwareshould.work), where I met Richard Hipp, the creator of SQLite; Andrew Kelley, the creator of Zig; Carson Gross, the creator of HTMX; and Richard Feldman, the creator of Roc. They gave excellent talks about software and how AI is changing the industry. Richard Hipp's talk is [available here](https://sqlite.org/talks/shouldwork-20260716.pdf). The creator of Roc mentioned how the language we choose shapes the culture around how many dependencies we ship and how much care we put into our software.

These people are much closer to the ALGOL side of the table. They think deeply about databases, languages, compilers, protocols, and the shape of software itself. They expand what the rest of programmers are able to do.

For example, Richard detailed how, over the last 25 years of developing SQLite, the project reached 100% MC/DC coverage and adopted profile-guided fuzzing, query fuzzing, mutation testing, and now AI-assisted bug testing. MC/DC, or modified condition/decision coverage, verifies that each condition in a decision can independently affect its outcome. Thanks to the extraordinary care he put into this software, vibe coders can now enjoy a `.db` file powering their vibe-coded Claude dashboards.

**Every simple interface rests on an enormous amount of complexity that somebody else had to understand.** COBOL users could ignore machine instructions because compiler designers could not. A developer can ask an AI agent to create a database, but somebody still has to make SQLite reliable.

This is the part missing from most arguments about whether AI will replace programmers. The future does not belong exclusively to people who understand every layer, or exclusively to people who can produce software without understanding any layer. Computing has always needed both.

## What's the cost of being wrong when vibe coding?

Neither approach is universally appropriate. I wouldn't apply SQLite's years of rigorous testing to my [watolls project](/blog/watolls-washington-toll-visualizer/), but I would apply that level of rigor to something whose failure has extreme consequences. What was ingrained in me was something deeper: systems exist on a continuum of criticality, and we have to decide how much care each kind of software requires.

My thesis is now: **Vibe coding is not inherently irresponsible. The amount of understanding and verification required should scale with the consequences of failure.**

I'd argue that failures in browsers, operating systems, databases, and language runtimes can have grave consequences.

Dear reader, I challenge you to think: how many *testing sprinkles* should you give the following five projects?

- A personal visualization generated once and run in a sandbox.
- A Claude dashboard backed by a local SQLite file.
- A payroll system that writes to that SQLite file.
- SQLite itself.
- A pacemaker.

The amount of care and understanding you give to a project should reflect the importance of its reliability. Terence Tao offers a useful framework in [his blog post](https://terrytao.wordpress.com/2026/07/13/a-paper-diagram-visualizer/). He identifies five conditions that make a project well suited to LLM-generated code:

1. **Not mission-critical.** The app is not a source of truth, so a small error rate is acceptable.
2. **Stand-alone.** It will not become part of a larger codebase, so its technical debt is bounded.
3. **Deterministic and sandboxed.** It runs without runtime LLM calls or access to sensitive files and services.
4. **Not replacing primary skills.** Delegating the work does not erode an ability central to the creator's profession.
5. **Not competing with humans.** The generated app does not duplicate existing human effort.

He then cautions people to be more careful when one or more of these conditions do not hold.

## What now?

We now find ourselves in a strange reality: the less care and thought application developers put into disposable software, the more they rely on infrastructure developers having put extraordinary care into the layers underneath it. Andrew Kelley's talk left me with a parting thought: *"We look out to the world and we see the state of software is just a bunch of flaming piles of garbage everywhere. [...] But the thing that gets me excited is that the tools we use to build good software are the best they've ever been. We have the most knowledge about building good software and how to build good software."* He later mentioned, *"These testing techniques, like deterministic simulation testing, property-based testing, and formal methods, have never been easier and more available to use."* Andrew finally concluded: *"These two tenets that I have are care and understanding. You can't build good software without care and understanding."*

Let's stop pitting COBOL programmers against ALGOL programmers. We should value both the people who use software to solve problems and the people who think deeply about its foundations. Vibe coders can build what they could not build before because someone else cared enough to make the underlying systems trustworthy.

## AI disclosure

I used AI to review this blog post, and to review the consistency of my prose. I wrote the blog myself.
























