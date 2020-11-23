---
path: "/javascript-uncanny-valley"
date: "2020-09-25"
title: "JavaScript's Uncanny Valley"
summary: "The uncanny valley is time needed for browsers to process JS code and build your application"
image: ""
author: "Giwan Persaud"
published: true
---

With a large amount of Javascript, the client CPU, be it laptop or phone, will have to work hard to build the page. That build time is the **uncanny valley**.

> Some real world applications send **thousands** of lines of JS (including data) to the browser.

It's wasteful in many ways. There is unecessary network transfer and CPU processing. Obviously it's also very wastefull for your battery.
From a UX perspective the user is also waiting much longer than necessary.

# Rendering an SPA

1. Download HTML, CSS and JavaScript
2. Construct the page based on the files received
3. Download other required files (i.e. images)

Suppose step 1 requires 5 minutes to request and receive the files over the network. The JS file is quite large. Now the browser has to **parse** all of it and build the page.

A React SPA _without_ server side rendering (SSR) will have an empty HTML page. Even with SSR, the page still needs to **hydrate**. Until that **hydration** step is complete the user can only read but not click any element to interact with the page.

What is the solution?
There are several things one should do to address this issue:

## Keep the JS - and data files as small as possible

The more JS there is to parse the longer it will take. The data provided will also add to this rendering time. Reducing the size of these and the amount of data required results in faster rendering and hydration timeframe.

## Use code splitting

Suppose there is a component where the user can reset her password. That component is rarely used and perhaps not needed on first load. By splitting it out of our main bundle the overall size is reduced.

Should the user click on it, it's dowloaded and made available. That download time does add to the overall wait time of the user. The tradeoff is still worth it though considering the infrequent use of this module.

---

# Hydration

With server side rendering the browser **first** receives static HTML. This initial page is **not** interactive on a SPA. To make it interactive, the JS needs to be executed. This allows all the buttons, links etc. to actually trigger the functions defined in the SPA's JS code. Hydration refers to this last step where the static HTML page receives that last bit it needs to make the page interactive.

Hydration can be fast but obviously it depends on the size of your JS bundle. If there is a large amount of JavaScript to download _and_ process, then the user will **not** be able to interact with your app.

On newer machines this is not as easy to spot to the untrained eye. And yes, there are devs out there who are blind to this. On older machines with a lesser CPU one quickly notices that it should not take this long to load a simple app.
