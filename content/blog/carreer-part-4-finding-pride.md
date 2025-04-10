+++
title = "Part 4: Finding pride in shipping real features"
description = "Part 4 of my software journey—bridging academic learning with real-world impact."
tags = [
    "internships",
    "microsoft",
    "college",
    "practical-experience"
]
date = "2025-04-09"
categories = [
    "career",
    "education"
]
series = ["My career so far"]
+++

"There I was, sitting in a Project Management class, watching my professor demonstrate Microsoft Project; the same software I had just spent my summer adding features to. Some education happens in classrooms; the best happens in the wild."

One of the strange things of college, is that before I started, I already had worked for some time in the field, as well as had some coding for some years before I got in. This created an interesting dynamic, sometimes I knew more than what was being taught, other times I realized how much theoretical foundation I was missing. 

My strategy to get a  job, was to apply to everything, *literally everything*. Any job fair or campus recruitment event that came to my school, I was there with resume in hand. Microsoft regularly held recruitment events at my university where they'd present new technologies and encourage students to apply. I showed up, applied, completed a full round of interviews at Microsoft, and landed my first Microsoft internship!

### (First internship) Microsoft Project Server.

You might not be familiar with Microsoft Project Server, but it's a significant enterprise product. It's a SharePoint-backed server that manages on-premise and cloud-based Microsoft Project files for large organizations. Surprisingly, Microsoft Project generates substantial revenue just from licenses, support, and servers. It might be arguably larger than some recent unicorn startups. The reason is simple: scheduling and planning work across large distributed teams is extremely challenging, and companies will pay a premium for tools that help solve this problem (And might make them save millions!).

https://www.microsoft.com/en-us/microsoft-365/project/enterprise-project-server

Microsoft Project Server was built on SQL Server and SharePoint. I vividly remember the pain of deploying SharePoint locally for development, it would take hours before I could be productive. My internship project focused on optimizing performance through:
- Deploying new SQL indexes to speed up common queries
- Ensuring templates for SQL Server Integration Services (SSIS) were efficient
- Optimizing resource load patterns for enterprise deployments
  
This was my first real introduction to database performance concepts like indexes, table scans, and query optimization.

I struggled with understanding who the hell Project Server's customers were. There was a massive contrast: connecting directly to users being in a startup to being three times removed from the final user. My customer was an ~IT admin~ wizard that deploys a server for people who need to plan a project which needs to be managed so that someone can do something somewhere. I did not like to be so far removed from the people I'd help. 

### (Second internship) Microsoft Project Client

On my second internship, I wanted to explore the actual C++ implementation of the Project Client application. . At that time, Project was playing catch-up with competitors by adding Kanban board functionality. My internship project was implementing the sorting, searching, and UI enhancements for cards in the Kanban view.

![](/images/blog/career/project-board.png)
> **Look mom, I'm in Office!**

I specifically made:

- The filter dropdown implementation
- The search button and underlying algorithm
- Card shadow effects when moving between columns
- Column sorting functionality
- Parts of the "New task" button behavior

This was an incredibly busy summer, but I felt immense pride seeing my code ship in a product used by millions of people. There's something special about pointing to a window in a commercial application and saying, "I built that part." 

Also, I was not prepared for Office C++, for context, there was a lot of things office had to implement since it started in the 90's. Most of the code was in this Office specific C++ flavor that was *weird*. The entire team really worked hard to get our C++ to modern standards. 

One of my mentors was specially happy that I got to use `std::shared_ptr` and `std::unique_ptr` here. There is a sense of respect and admiration you get from reading code that's 25 years old (and still working!). Some of Office's features and interactions are actually scripted in LUA. This is real digital archeology.
    
## The Full Circle Moment: Learning About the Software I Helped Build

When I returned to school after my Microsoft Project internships, I enrolled in a project management class. The software we used? Microsoft Project. Watching my professor demonstrate features I had helped develop created a surreal full-circle moment. I was simultaneously a student learning project management theory and a developer who had contributed to the tool being used to teach it.

# Edgebound: Startup Life Between Classes

College was an intense time for me. While taking classes and doing Microsoft internships, I also joined Edgebound, a small e-commerce startup in Mexico City. They specialized in building regional online stores for major fashion brands like Tommy Hilfiger, Guess, and Coach.

Working directly with the CTO was an incredible learning experience. One of my most valuable memories was when he methodically walked all of the devs in the office in a Socratic-like forum where he would go over a feature we need to understand. I still vividly remember him going through every property of an HTTP call, header by header. He would do these "explain townhalls" regularly, which helped the entire team understand our technology stack from first principles.

His calm demeanor  yet helpful teaching style was particularly effective:

*"Now, what does that 'cache-control' header do exactly? And how might it affect our page load performance?"*

At Edgebound, I also crossed paths with PhoneGap again.  There is an app I wrote for a school that [is still live today](https://play.google.com/store/apps/details?id=com.IberoApp&hl=en_US) using PhoneGap. I still shudder when I think about that code. I think it has a lot of users even today. 

![](/images/blog/career/ibero.jpg)
*The Ibero app a PhoneGap creation that somehow still works years later*

This was also when I really experienced Node's infamous callback hell. All the authentication systems for our e-commerce sites were built with Node, resulting in deeply nested callback structures:

```
// The pyramid of doom - circa 2014
getUser(username, function(err, user) {
  if (err) {
    return handleError(err);
  }
  
  getPermissions(user.id, function(err, permissions) {
    if (err) {
      return handleError(err);
    }
    
    getStoreData(storeId, function(err, storeData) {
      if (err) {
        return handleError(err);
      }
      
      // Finally, now we can do something with all this data
      renderPage(user, permissions, storeData);
    });
  });
});
```


### (Third internship) Microsoft OneNote Services

My third Microsoft internship, with the OneNote Services team, was the most enjoyable. By this point, I had enough experience to hit the ground running with feature implementation. I developed internal tools for the team to debug notebooks. 

One of my main projects was a diagnostic tool that could:

- Parse OneNote's internal notebook structure
- Identify sync conflicts and data corruption
- Provide repair options for common issues

The technical challenges were significant. Notebooks could contain hundreds of sections and thousands of pages, all with complex relationships. I think you can still see my code in [onenote.com/notebooks](https://www.onenote.com/notebooks) [[link to obfuscated js]](https://site-cdn.onenote.net/161872740458_Scripts/Notebooks.js). It was a combination of contributing to the web in jQuery and contributing to servers in ASP.net. Here, I found jQuery again! *My friend*. Turns out you aren't so dead after all.
