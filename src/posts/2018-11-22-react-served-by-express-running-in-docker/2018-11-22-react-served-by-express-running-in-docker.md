---
path: "/react-served-by-express-running-in-docker"
date: "2018-11-22"
title: "React front-end served by Express from Docker container"
summary: "Moving to Docker requires special considerations for the front-end. In this case there is a need to dynamically inform the front-end of the backend service it should be talking to. In the case of multiple environments, the same docker image should be re-used while moving from TST to ACC for example."
image: ""
author: "Giwan Persaud"
---

Once a Docker container has been built the static assets can no longer be changed. That would require a new build.
When the front-end code is running in a docker container it will very likely want to get it's data from a back-end service. If that service is running on the same host, request and simply be pointed to `/api/xyz`.

## Data from third-party services

However if the front-end needs data from third-party services, which are not on the same hosts, things get more complicated. If the third-party host can be injected at build time, then it's fine. However the case below is when you want to specify the third-party host at run time.

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

The above code uses the endpoint `/api/data` to get the data it needs. Effectively that means that if the front-end is running on http://localhost:3000, then the api request will also go to that host. (Providing there is no proxying going on).
