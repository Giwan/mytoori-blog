---
path: "/react-served-by-express-running-in-docker-container"
date: "2018-11-22"
title: "React App Served by Express from Docker container"
summary: "Moving to Docker requires special considerations for the front-end. The front-end should dynamically retrieve the backend endpoint. In the case of multiple environments, the same docker image could be re-used while moving from TST to ACC for example."
image: ""
author: "Giwan Persaud"
---

Once a Docker container has been built the static assets can no longer be changed. That would require a new build.
When the front-end code is running in a docker container it will very likely want to get it's data from a back-end service. If that service is running on the same host, request and simply be pointed to `/api/xyz`.

## Data from third-party services

However if the front-end needs data from third-party services, which are **not on the same host**, things get more complicated. If the third-party host can be injected at build time, it's fine. However the case below is when you want to specify the third-party host at **runtime**.

## Technology stack

-   Docker
-   NodeJS
-   Express
-   React --> static assets (html, css, javascript)

Imagine we have a very simple react application.

```javascript
// --- app.js

import React from "react"
import { render } from "react-dom"

const App = () => <div>Hello World</div>

render(<App />, document.getElementById("root"))
```

Now we want this application to get dat from a TST backend. With the following, the data is retrieved when the component is mounted.

```javascript
// --- app.js

import React from "react"
import { render } from "react-dom"

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
        }
    }

    /**
     * When the component is mounted,
     * fetch the data from the network
     */
    async componentDidMount() {
        try {
            const res = await fetch("/api/data") // fetch the data
            const jsonData = res.status === 200 ? await res.json() : res
            if (jsonData.status === 200) {
                this.setState({ data: jsonData })
            } else {
                throw new Error(`Expected JSON data but received: ${jsonData}`)
            }
        } catch (error) {
            console.error("failed to fetch data", error)
        }
    }

    render() {
        return <div>Hello {this.state.data}</div>
    }
}

render(<App />, document.getElementById("root"))
```

The above code uses the endpoint `/api/data` to get the data it needs. Effectively that means that if the front-end is running on `http://localhost:3000`, then the api request will got to `http://localhost:3000/api/data`. (Providing there is no proxying going on).

In our case we would like the api request to go to a different host. The challenging part is that we do not know which host this is until later (at runtime). In the case of a "normal" React application, one can use the environment variables available at build time. These need to start with `REACT_APP_` after which you can add any variables you would like.

So building the front-end production version would result in the apiHost populated correctly. These can be specified in our `.env` file where react would read them at build time.

```bash

# -- .env

REACT_APP_API_HOST=http://someremotehost.com
```

Building the application with `npm run build` results in the remote host being inserted replacing `REACT_APP_API_HOST` where ever it's used.

```javascript
// --- app.js

import React from "react"
import { render } from "react-dom"

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: null,
        }
    }

    /**
     * When the component is mounted,
     * fetch the data from the network
     */
    async componentDidMount() {
        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_HOST}/api/data`
            ) // fetch the data
            const jsonData = res.status === 200 ? await res.json() : res
            if (jsonData.status === 200) {
                this.setState({ data: jsonData })
            } else {
                throw new Error(`Expected JSON data but received: ${jsonData}`)
            }
        } catch (error) {
            console.error("failed to fetch data", error)
        }
    }

    render() {
        return <div>Hello {this.state.data}</div>
    }
}

render(<App />, document.getElementById("root"))
```

> But, what if we don't have the host at build time but only at runtime?

## Running in Docker

When running in Docker, there is another layer of complexity. The idea of a Docker image is build it once and run it in various places. In the case of our front-end we might want to re-use our docker image for TST on ACC and eventually on PRD.
The issue there is that once the Docker image has been built, it's much harder to inject dynamic variables such as our apiHost.

To run our front-end in Docker, a server is created in the Docker container anyway. That server can be used to provide the **apiHost** to the front-end. A node / express server will help us with this. When starting the Docker container, environment variables are provided at run time. Docker container receives and passes the environment variables on to the express server, which then provides that variable to the front-end.

<div style="display:flex;justify-content:center;">
    <span style="padding:16px;color:black;background-color:#ccc;border-radius:10px;">ENV_VARS => Docker container => Express server  ==API==>  front-end</span>
</div>

```bash
# run docker image with environment variables
docker run -e "API_HOST=https://mydockerdynamichost.com" -p 3000:3000 mydockerimagename

```

> [The complete source on github](https://github.com/Giwan/fe-docker-dynamic-be)

While this is a workable solution, there are some downsides to this approach. Our front-end has to request the host before it can make any actual data request. Network latency means that our application is slower because of this solution. In the next part we will look at a solution that will allow us to use server side rendering to address this issue better.

# Server Side Rendering to provide the API HOST

Using server side rendering in the Docker container means that not only is the app rendered on the server before sending it to the client, it also has the opportunity to provide it the API HOST right away. This removes the need for an extra network call and initial data can also be loaded before sending the response to the client.

First ensure the app expects the apiHost as a prop.

```javascript
// -- src/app.js

import React, { Component } from "react"
import "./App.css"

class App extends Component {
    render() {
        return (
            <div className="App">
                <h1>Sample app testing dynamic backend</h1>
                <div>Loaded backend host: {this.props.apiHost} </div>
            </div>
        )
    }
}

export default App
```

[source: app.js](https://github.com/Giwan/fe-docker-dynamic-be/blob/ssr/src/App.js)

Also during Hydration is the apiHost required. During the render step on the server it will become clear why the variable `__API_HOST__` is a global on the window object.

```javascript
// -- src/index.js

import React from "react"
import { render, hydrate } from "react-dom"
import "./index.css"
import App from "./App"

const apiHost = window.__API_HOST__
const root = document.getElementById("root")

/**
 * If childNodes exist, then server rendering
 * happened and we only need to hydrate
 */
root.hasChildNodes()
    ? hydrate(<App apiHost={apiHost} />, root)
    : render(<App apiHost={apiHost} />, root)
```

[source: index.js](https://github.com/Giwan/fe-docker-dynamic-be/blob/ssr/src/index.js)

## Server side rendering

To setup server side rendering (SSR), create a folder named `server` in the root folder of the project. The render is divided into three files.

1. server.js _(including required files for JSX and ES6 imports)_
2. router.js _(routing to direct network requests)_
3. renderer.js _(actuallly render the app on the server and respond to the client)_

### Server.js

```javascript
// -- server/server.js

/**
 * (pre)Load the necessary libraries to ensure
 * the react app can be built on the server.
 * -- Normally these are loaded by webpack --
 */
require("ignore-styles")
require("url-loader")
require("file-loader")
require("@babel/polyfill")
require("@babel/register")({
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-proposal-export-default-from",
    ],
})

/** --- Now load the application as normal --- */

const express = require("express")
const router = require("./router")

// Initiate App
const app = express()
const { PORT = 3000 } = process.env // default to 3000

/**
 * Tell the app to use the router imported above
 */
app.use(router)

// start the express server and log what port it's running on
app.listen(PORT, () => console.log(`running on http://localhost:${PORT}`))
```

[source: server.js](https://github.com/Giwan/fe-docker-dynamic-be/blob/ssr/server/server.js)

### Router.js

Next add the router.js file.

```javascript
// -- server/router.js

// -- server/router.js

const express = require("express")
const path = require("path")
const serverRenderer = require("./serverRenderer")

/**
 * Create the router object
 */
const router = express.Router()

/**
 * this route will not be used with serverside rendering
 * working properly.
 * However getting this route will require an additional
 * request to be sent to the server.
 */
router.get("/environment.json", ({}, response) => {
    response.json({
        apiHost: "http://somehost.com",
    })
})

// root (/) should always serve our server rendered page
// serverRenderer will be disussed in the next section.
router.use("^/$", serverRenderer())

// Static assests should just be accessible
router.use(
    express.static(path.resolve(__dirname, "..", "build"), {
        maxAge: "30d",
    })
)

/**
 * Ensures the front-end source and assets are still
 * found if the user refreshes the page on a deep route:
 * /book/com.mytoori.book.sample4
 * If this route is not here the front-end assets are not found
 */
router.use("^(?!api$)", serverRenderer())

module.exports = router
```

[source: router.js](https://github.com/Giwan/fe-docker-dynamic-be/blob/ssr/server/router.js)

### Renderer.js

Before the app is rendered, read the API_HOST environment variable from `process.env`.
As part of the rendering step the API_HOST can be provided as a prop. The variable is also added to the HTML file so it can be picked up on the client and used during the Hydration step.

```javascript
// -- server/renderer.js

const React = require("react")
const { renderToString } = require("react-dom/server") // renders react app to string
const fs = require("fs")
const path = require("path")
const { API_HOST = "http://fallbackapihost.com" } = process.env
import App from "../src/App" // import the app that is going to be rendered on the server
const indexFilePath = path.resolve(__dirname, "..", "build", "index.html")

const serverRenderer = () => async ({}, response) => {
    // read the public/index.html file into memory
    // The rendered html string is then inserted
    // and sent to the client
    fs.readFile(indexFilePath, "utf8", (err, indexHTMLFile) => {
        if (err) {
            console.error("Failed to read index.html ", err)
            return response.status(404).end()
        }

        // Render the entire React app to HTML string
        const renderedHTML = renderToString(<App apiHost={API_HOST} />)

        // Add (Global) variable with data to
        // the client window object
        const initialData = `
            <script>
                window.__API_HOST__ = "${API_HOST}"
            </script>
        `

        return response.send(
            indexHTMLFile.replace(
                '<div id="root"></div>',
                `<div id="root">${renderedHTML}</div>${initialData}`
            )
        )
    })
}

module.exports = serverRenderer
```

[source: renderer.js](https://github.com/Giwan/fe-docker-dynamic-be/blob/ssr/server/serverRenderer.js)

### Running in Docker

The entire project can also be executed in a docker container. Copy the following to run the project in docker. It will build the project and run the start command when finished to start the project.

```bash
# Use the following image to build this docker image
# This is pulled from docker.com and has everything
# needed to run a node project
FROM node:alpine

# Back_env is set during build
# telling the front-end which back-end
# it should be talking to
# ARG backend_env
# ENV BACKEND_ENV $backend_env
ENV PORT 3000

# Navigate (cd) to the app folder in the docker container
WORKDIR /usr/src/app

# Copy all package.json / package-lock.json etc. to the root folder
# this is executed on build: docker build .
COPY ./package*.json ./

RUN npm install

# copy everything from the external directory to the container folder in docker
COPY . .

# build the front-end with react build scripts and store them in the build folder
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

#### starting up

The start:prod command initiates the node process with the server/server.js file.

```json
"start:prod": "NODE_ENV=production node ./server/server.js",
```

To test outside of Docker, simply run `npm run start:prod` from the terminal.

While running the docker container the api host is provided as a environment variable. That is then read when rendering the app on the server.

```bash
# build docker
docker build -t mydockercontainer .

# run docker container with environment variable
docker run -e "API_HOST=https://dockerruntimeapihost.com" -p 3000:3000 mydockercontainer
```
