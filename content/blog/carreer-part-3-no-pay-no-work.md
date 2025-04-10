+++
title = "Part 3: No Pay, No Work; Early Career Lessons"
description = "Part 3 of my 12-year journey—what my first rocky job taught me about boundaries and value."
tags = [
    "practical-experience"
]
date = "2025-04-07"
categories = [
    "career",
    "education"
]
series = ["My career so far"]
+++

*Little elephant company* — *7 people working out of a random house* — *2013*


I know we haven't paid you for 30 days, but would you be willing to float another month?
{.bubble .left .p}


No, sorry, I'm out.
{.bubble .p .right}


Ok, sad to see you are not loyal to the company.
{.bubble .p .left }


No pay, no work
{.bubble .p .right}

{.p}
It was the end of 2013; I'd gone two paychecks without pay. The client still hadn't paid, I wasn't about to start working for free. 

I resigned. I told my boss at the time: *"no pay, no work"*. 

Walking away wasn't easy. They gave me my first shot as a professional coder. I was genuinely sad to leave the office, going with my coworkers to the nearby Subway restaurant, and especially the cat that roamed our office/house workspace.

Before the payment drama, this had been an objectively awesome job for a 17 year-old. This was a company that did AR, and other super cool projects for the time. When I started, this company focused in a project for one of Mexico's efforts for renewable energy. A page for companies to apply for their energy savings grants for commercial builders. 

If companies met the requisites, they would be awarded money which had to be closely tracked with reciepts/invoices and other kinds of controls. This meant we had to do a lot of stuff: 
- Complex business rules that changed frequently
- Multi-stage application processes with interdependent fields
- Calculation-heavy rebate formulas
- Document verification workflows

## Domain-Specific Languages and Form Wizardry

Due to the complicated nature of these web controls, my manager developed a domain-specific language (DSL) for PHP. We'd encode business rules into this DSL, and the framework would automatically generate the appropriate web form fields. It was quite impressive to see a real-world example of meta-programming that I'd only read about in forums.

I'd then modify the forms with JavaScript to make it nicer to fill (add calendars, autohide if there are dependencies/constraints etc. some jQuery magic). I got hired to implement the magic toggles with jQuery/JavaScript, but you have to understand this is 2013 JavaScript. [ECMAScript wasn't even a thing back then, types, Typescript wasn't yet invented. Zero. Zilch.](https://www.youtube.com/watch?v=Kq4FpMe6cRs) At that time we used Firefox and Firebug to test our code.  I'd load the things with JavaScript/jQuery, and test them in an early incantation of the chrome debugging tools called Firebug. I'd augment the UI of the fields that were created with our business logic with some nice JavaScript on top. 

```
$('#project_type').on('change', function() {
    var selectedType = $(this).val();

    if (selectedType === 'renewable') {
        $('#solar_panels_section').show();
        $('#efficiency_section').hide();
    } else if (selectedType === 'efficiency') {
        $('#solar_panels_section').hide();
        $('#efficiency_section').show();
    } else {
        $('#solar_panels_section').hide();
        $('#efficiency_section').hide();
    }
}
```
*Welcome to FUN kids. React or Angular didn't exist.*

We also did nice calculators/calculations for the rebates people would get in JavaScript (oh god, the horror). At that time, JQuery was the boom, it was amazing for not having to manage the DOM directly. I still remember the `$.on( "click")` monster functions I'd used to do. They still haunt me till this day.

![](/images/blog/career/firebug.png)
*Firebug: The developer's best friend in 2013. CSS debugging had never been so... adequate.*

Maybe advanced for its time, but for a kid that only had pushed through FTP his websites using version control with SVN was state of the art. The wonky part is that we coordinated which files people had checked out by literally yelling across the office: "Hey, I'm going to check out the rebate calculator, please don't touch it, k thanks bye!" 

*No pull requests. No code reviews. No branches. Just a shared understanding that if someone yelled about a file, it was temporarily "theirs." It wasn't until years later that I understood how important proper version control workflows were for project success.*

## Mobile First? The promise that never came until React Native.

This also got me to write my first android app in PhoneGap. Performance was terrible, and UI was clunky. Sadly, this would not be the last time I would face PhoneGap. There was so much attractiveness in writing your app once in a web server and then automatically reflect everything in an app. For people that don’t know PhoneGap ~was~ is a technology that allows creating a web server and setting up a cross platform app. It’s an early incantation of react native but really bad. There was so much attractiveness in the write-once-run-everywhere promise, but the reality was significantly more painful.

## The end?

Despite the technical challenges and the somewhat chaotic development environment, I grew a lot. The small team meant I got exposure to the entire stack: backend PHP, frontend JavaScript, mobile development, and even some system administration.

But after several months, the cracks started to show. Our main client delayed payments, and the company started running out of cash. First, it was "payment might be a few days late." Then, "We'll pay you next week for sure." Finally, "I know we haven't paid you for 30 days, but would you be willing to float another month?"

That's when I learned one of the most important lessons of my career: **No pay, no work.**

The guilt trip about "loyalty" didn't work on me, even at 17. I understood that employment is a two-way-deal. I provide value through my skills and time, and the company provides value through compensation. When one side stops fulfilling their end, the deal ends.

As I packed up my things and said goodbye to the office cat, I wasn't bitter. I was grateful for the experience and the lessons learned. And for getting the chance to work for an actual development shop at 17.

Thank you, little elephant company.

Have you ever had a "No pay, no work moment?" Comment below or in HN.