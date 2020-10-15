---
path: "/browser-debugging-with-breakpoints"
date: "2020-10-15"
title: "Browser debugging with breakpoints (React)"
summary: "Breakpoints are great but seem to be troublesome in some cases"
image: ""
author: "Giwan Persaud"
published: true
---

Breakpoints in the browser's devToolls are great, when they actually work. Normally Chrome does a pretty decent job. With create-react-app there seems to be an issue. The breakpoints catch sporadically. It seems the culprit is Hot Module Reloading.

---

## Create-react-app

While working on React apps, built with Create-React-App, the breakpoints don't work consistently in Chrome. It's annoying when tracing down a bug. Firefox does a much better job at stopping on breakpoints. I try to use it as much as possible.

Unfortunately the internal specialised app has Chrome as it's primary requirement. That means I often have to switch back to Chrome.

The `debugger` statement does catch more consistently in Chrome. A single `debugger` statement enables other browser breakpoints to work as well. However breakpoints are preferable. They don't pollute the code and it's much easier to disable.

### Create-React-App Disable cache

This post suggest that by disabling the cache in Create-React-App will allow the breakpoints to work better. It sounded exactly like the solution I was looking for.

https://www.mattbutton.com/2019/04/27/chrome-breakpoints-dont-work-when-using-create-react-app/

Having tried it for a few days, the results are **disappointing**.

### Github thread

There is an active thread on Github about this:
https://github.com/facebook/create-react-app/issues/6074

The problem, it seems is related to the way that Chrome handles **hot module reloading (HMR)**. Why this is not an issue in Firefox though?
