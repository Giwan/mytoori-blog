---
path: "/react-server-pages"
date: "2018-11-11"
title: "React Server Pages"
image: ""
author: "Giwan Persaud"
published: true
---

React can replace Java Server Pages (JSP), handlebarJS, etc. as a templating language on the server. There are various reasons why might want this. Re-using knowledge you already have for example.

Recently I had to work on a project that required JSP (Java Server Pages). My knowledge of JSP is pretty poor and so instead of JSP, I wondered if it would be possible to just use React on the server.

## The concept

The idea is that react would be executed on the server, resulting in pure HTML and CSS, that is then sent to the client.
In reality react is simply used where otherwise something like [handlebars.js](https://handlebarsjs.com/) or [ejs](https://github.com/tj/ejs) is used.

## The Benefits

The benefit is that if you already know react then you don't need to learn something else.

Perhaps more importantly, the component structure. You can write self-contained react components. A rendered view could then consist of one react component or multiple components combined.

JSP and other such templating languages already allow for this but I would argue not elegantly as React. Again existing React knowledge weighs heavy here so your milage might vary.

## Getting Started

Create a standard node application with express. We first create the application with

```bash
# -- terminal


# create project folder
mkdir react-on-the-server

# nav into project folder
cd $!

# Initiate project
npm init -y

# create gitignore
touch .gitignore

# install some basic dependencies
npm i --save express react react-dom express-react-views

```

## express-react-views

[Express-react-views](https://github.com/reactjs/express-react-views) will allow react to run as the view engine on the server. More information. The following is the express file that will set react as our view engine.

```javascript
// -- server.js

const express = require("express")
const app = express()

// Set the view engine
// indicate that template
// files will end with "JSX"
app.set("views", __dirname + "/views")
app.set("view engine", "jsx")
app.engine("jsx", require("express-react-views").createEngine())

// This is where express can find it's static assets
app.use(express.static("public"))

// Renders "index.jsx" on the route "/"
// In addition the value "hello world" is passed
// to the view as props
app.get("/", (request, response) => {
    response.render("index", { name: "hello world" })
})

// listen for requests :)
const listener = app.listen(9000, () => {
    console.log(`Listening on port ${listener.address().port}`)
})
```

Now that the server.js file has been setup to find our view file, the next step is to create the views.

```bash
# -- terminal


# create the views folder
mkdir views

# create the view (react) file
# It's important that that extension matches
# that which has been configured in server.js
touch views/index.jsx
```

Open the newly created `index.jsx` file to convert it into a react component that renders the content.

```javascript
// -- index.jsx

const React = require("react")
class HelloMessage extends React.Component {
    render() {
        return <div>Hello {this.props.name} </div>
    }
}

module.exports = HelloMessage
```

The name of the component is ignored. The view is accessed through the file name.

```javascript
// --highlight
response.render("index", { name: "hello world" })
```

---

With that the project can be started.

```bash
# -- terminal

node server.js
```

The react component is rendered and the browser receives the html and css that is the output of that.

---

## Editable Example

Check out this live example on glitch.com and try it out for yourself:

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    allow="geolocation; microphone; camera; midi; encrypted-media"
    src="https://glitch.com/embed/#!/embed/node-express-react-view?path=views/index.jsx"
    alt="node-express-react-view on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>
