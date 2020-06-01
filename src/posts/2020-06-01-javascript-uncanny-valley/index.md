---
path: "/javascript-uncanny-valley"
date: "2020-06-01"
title: "Javascript uncanny valley"
summary: "The uncanny valley is time needed for client machines to process JS code"
image: ""
author: "Giwan Persaud"
published: false
---

If your page has a large amount of Javascript code, the client CPU, be it laptop or phone, will be working hard to build that page. That time it takes to build that page is what is considered the uncanny valley.

For the sake explanation let us exaggerate. Here are the steps require to render our SPA on a client.

1. Download HTML, CSS and javascript
2. Construct the page based on the contents of the HTML, CSS and JS files
3. Download other files required (i.e. images)

Let's say step 1 takes about 5 minutes to get the files over the network. Our JS file is quite large though. Now the browser has to **parse** that javascript and build the page.

A React SPA that does not have server side rendering (SSR) will have an empty HTML page. Even with SSR though the page still needs to **hydrate**. Until that **hydration** step is complete the user can only read but not click any element to interact with the page.

What is the solution?
