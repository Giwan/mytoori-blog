---
path: "/browser-extension-with-react"
date: "2018-12-01"
title: "A chrome extension built with ReactJS"
image: ""
author: "Giwan Persaud"
published: false
---

# Chrome extension with React

React can also be used when developing chrome browser extensions. This post goes into the details of creating such an extension.
After building a news reader with React, I was tasked with building a Chrome extension. Naturally I wanted to use React for this as well. The extension was a companion app to the news reader built before. It made sense to re-use some of the components created in the newsreader app allowing for faster development.

**Requirements**

-   Runs in chrome browser as extension
-   Retrieves data from backend service (i.e: TST, ACC, PRD)
-   Multiple user interface languages

We’ll cover the basics of creating a new extension and work our way up to a more complex extension addressing all the requirements above.

## A word on privacy and security

Browser extension are very powerful! It’s important to carefully read the permissions being requested and verify that the developer is someone or company that is trustworthy.

Many developers are looking to create helpful tools. That often requires access and control like that provided by a browser extensions.

There are, however, also developers who will abuse the system. Effectively they can follow you all over the internet.

Fortunately the code is very easy to access for anyone. If any popular extension were to do such shady things, it would quickly be noticed and reported. More obscure extension might not have this luxury, however.

## Getting started

We will start out with a basic extension, and then switch to using React.
Create your project folder and create the following files:

1. `manifest.json`
2. `popup.html`
3. `menu_icon.png`

### Manifest.js

This file describes the entire project meta data. When your extension is loaded into the browser or the the google chrome web store, much of the information displayed there is from this file.
Not all though since the web store requires additional information to be entered when uploading the extension for publishing.

### Popup.html

If you have used browser extensions before, you have probably seen a little menu when you click the extensions icon, usually next to the address bar of the browser. Popup.js is where we can control what is presented to the user in this popup window. This script is initiated by the browser when the user clicks the menu icon.

### Menu_icon.png

This is the icon that will be shown in chrome to active the popup window of the extension. Any icon can be used. Search for a licence free png file that is about 64x64 pixels and add it to the project. For convenience, rename it to menu_icon.png.

---

Now the code can be added. Here is the example `manifest.json`.

```json
{
    "name": "Simple Chrome Extension",
    "description": "A simple chrome extension to demonstrate how this works",
    "version": "1.0",
    "manifest_version": 2,
    "browser_action": {
        "default_popup": "popup.html",
        "default_icon": "menu_icon.png"
    }
}
```

The browser action indicates to chrome that `popup.html` should be rendered when the user clicks the menu icon.

A standard html page in `popup.html` allows for verification that the the extension is running as expected.

```html
<!-- // popup.html -->

<html>
    <body>
        <h1>Simple extension demo</h1>
        <h2>It will form the basis for a react based extension</h2>
    </body>
</html>
```

### Testing

Let's verify that this is working. Open `chrome://extensions/` in the chrome browser. This will show the extensions available for this browser. If you have not installed an extension before, this could be empty.

Ensure **developer mode** is enabled. This will give you the option to `load unpacked extension`. Normally an extension is packed (i.e. zipped) as a `.crx` file. While developing it's best to avoid the compression step so "load unpacked extension" is used.

In the file navigator, find the directory where the project code resides. Add it and you should now see the menu icon in the browser. Click it to see the html page in a popup window.

---

# Render popup window with React

Instead of writing pure html in `popup.html` it would be better if we can write our code in react and render popup.html as the final output. Why is that better? React allows us to build our app with **components** this means that we can re-use standard react components. Essentially this means it's easier to build more complex extensions, hopefully adding more value to the user while improving the developer experience.

## No create-react-app but custom webpack.config.js

Normally when creating a new react project, reaching for create-react-app is the easiest option. However in this case different output files are needed. This means customising the webpack configuration file. To keep this light, a basic version of webpack.config.js will be created.

### webpack

Create-react-app uses webpack under the hood. Since we are going to create our own webpack config, it's worthwhile to build this up gradually. First webpack will be used to simply bundle all the resources without using react just yet.
