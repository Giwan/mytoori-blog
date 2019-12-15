---
path: "/node-screenshots"
date: "2019-12-13"
title: "Browser dev tools"
image: ""
author: "Giwan Persaud"
published: true
---

The dev tools in the browser grow more advanced every day. This post keeps track of some of the most useful features. Where possible key differences between browsers is highlighted. Most features are in Chrome on MacOS.

# The elements pane

On MacOS open dev tools quickly with `Option + CMD + i`. Typically dev tools show the elements pane where the nodes that make up the page are shown.

## Search in elements pane

`CMD + f` allows for searching through the elements pane. Searching is possible by:

-   String
-   Selector
-   xPath

Selector example to search for an tag and class that starts with a given string
`img[class^="AuthorLandingPage"]`

Source:

[Find out more about selectors on MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors "Selector basics on MDN")

# Quick access feature `CMD + Shift + p`

There are lots of features in dev tools. One of the fastest ways to search through them all is with the quick access menu: `CMD + Shift + p`. Type the command and hit enter to activate it.

## Node screenshots

Node screenshots focus screenshots on a single node. This can be quite useful during development.

1. Open the elements panel and select a node
2. Type `CMD + Shift + p` to open the quick access menu and search for `node screenshot`.
3. Press enter to screenshot the node

The file is saved in `~/Downloads` by default.

# Console

The console is very versatile. This section only highlights some of the things it can do:

-   `console.log("test")`
-   `console.error("test")`
-   `console.info("test")`

Log an array as a table

`console.dir(arr)`

# Audit (with Lighthouse)

Audit your application and easily see where you should improve.

1. Click on the audits panel
2. Click generate report

## Track Improvemnts

After you make improvements, it's possible to run the report again while keeping the old one. In the top left corner the `plus` button creates a new audit report while still saving the old one.

# Performance analysis

Performance is a critical part of UX. The performance tab will analyse the time it takes to get the HTML, CSS and JS. After receiving the files, the content still needs to be rendered on screen.

The flame chart that is generated show show long each rendering phase takes. There is much more detail here than I want to get into in this post. More detailed information can be found here:
https://developers.google.com/web/tools/chrome-devtools/evaluate-performance

# Shortcuts

## general shortcuts

| Shortcut         |    Description    |
| ---------------- | :---------------: |
| Option + CMD + i |  Open dev tools   |
| CMD + Shift + p  | Quick access menu |
