---
path: "/react-served-by-express-running-in-docker"
date: "2018-11-22"
title: "React front-end served by Express from Docker container"
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

Now we want this application to get dat from a TST backend.

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

In our case we would like the api request to go to a different host. The challenging part is that we do not know which host this is until later. In the case of a normal React application, one can use the environment variables available build time. These need to start with `REACT_APP_` after which you can add any variables you would like.

So building the front-end production version would result in the apiHost populated correctly. These can be specified in our `.env` file where react would read them at build time.

```bash

# -- .env

REACT_APP_API_HOST=http://someremotehost.com
```

Building the application with `npm run build` results in the remote host being inserted replacing REACT_APP_API_HOST where ever it's used.

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
