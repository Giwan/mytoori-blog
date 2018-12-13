---
path: "/server-side-rendering-with-react"
date: "2018-11-11"
title: "Server side rendering with React and NodeJS"
summary: "Web crawlers can't parse JS which means that Single Page Applications need to render on the server if they want to be indexed by the search engines."
image: ""
author: "Giwan Persaud"
---

Mytoori.com's front-end is built with React as a single page application (SPA). Typically these do not play nice with web crawlers from google or bing. This can be seen in the network tab of dev tools. The first response would look like this.

```html
<!-- first response from https://mytoori.com/ -->


<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible"
        content="IE=edge">
    <title>Mytoori</title>
    <meta name="description"
        content="Bilingual books">
    <meta name="author"
        content="Giwan Persaud">
    <meta name="viewport"
        content="width=device-width, initial-scale=1">
</head>

<body>
    <div id="app" />
    <script src="app.js" />
</body>
</html>
```

There is not much here for a web crawler to work with. All the content of the application is either in the `app.js` file that the web crawler cannot parse or will be loaded later using REST. On a browser client this works just fine. It parses the JavaScript and retrieves the XHR content.

## Server side rendering

With server side rendering (SSR), the Single Page Application is is first fully rendered on the server before it's sent to the client. All of the HTML content is sent in that first request just as it would be with a statically rendered site. The client can skip the javascript rendering step and simply "display" the received HTML to the user.

### Create the Server

To render on the server, a _server_ is required. Express running on NodeJS fits quite well here.
Create a folder in the root of the project named `server`. It consists of three main components.

-   server.js
-   routes.js
-   renderer.js

#### server.js

This is the file that is initially loaded. It injects important dependencies and then starts the app.

Server styles are ignored with the "ignore-styles" module. "url-loader" and "file-loader" are also part of the standard requirements. The dynamic import ensure that where ever `import` is used in the code it's replaced with `require`. Then the whole thing is pulled through Babel. Babel converts JSX to javascript.
Install the packages.

```bash
npm i --save ignore-styles babel-preset-es2015 babel-preset-react-app file-loader url-loader babel-plugin-syntax-dynamic-import

# Support dynamic importing
npm i babel-plugin-dynamic-import-node --save-dev
```

Next, the express server is initialised and started. The express app is configured to use the router configuration with `app.use(router)`.

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
require("babel-register")({
    ignore: [/(node_modules)/],
    presets: ["es2015", "react-app"],
    plugins: ["syntax-dynamic-import", "dynamic-import-node"],
})

// -- initiate the rest of the app

import express from "express"
import router from "./controller/index"

const app = express()
const port = 4000

/**
 * Tell the app to use the router imported above
 */

app.use(router)

// start the app
app.listen(port, () => console.log(`express running on port ${port}`)) //eslint-disable-line
```

#### server/router.js

Here the router is configured and exported. Three main routes are defined to ensure the static assets can always be served while API requests are directed to the back-end service.

```javascript
// -- server/controller/index.js (router.js)
// todo: rename this file to router.js

import express from "express"
import path from "path"
import serverRenderer from "../renderer"

/**
 * Create the router object
 */
const router = express.Router()

// root (/) should always serve our server rendered page
// serverRenderer will be discussed in the next section.
router.use("^/$", serverRenderer())

// Static resources should just be served as they are
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

export default router
```

#### serverRenderer

The last part is to render the Single Page Application and serve it. There is a lot going on in this file but it's not too complicated if we take it step by step.

1. The initial request is triggered by the router (/)
2. Request the initial data that will be used in the application
3. Read index.html from the build directory into memory
4. Populate redux state with the received network (i.e. API response) data
5. Render the app (to String)
    1. Specify react-router path
    2. Inject redux state in the store
6. The redux state is attached to a window object (required during the Hydrate stage)
7. Replace root div with the results from step 1 - 6
8. Sent to client

```javascript
// -- server/renderer.js

import React from "react"
import { renderToString } from "react-dom/server" // renders react app to string
import App from "../../src/components/App" // The app itself
import { StaticRouter, Route } from "react-router-dom" // Static router instead of browser router
import store from "../../src/store/store" // the redux store
import { Provider } from "react-redux" // The redux provider

// Normally these are available from the browser but since
// this is not a browser environment they need to be added
import serialize from "serialize-javascript"
import fetch from "isomorphic-fetch"

const path = require("path")
const fs = require("fs")
const filePath = path.resolve(__dirname, "..", "..", "build", "index.html")

// reuse components from src
// fetch the topics
import { networkFetchCollection } from "../../src/actions/collectionActions"
// fetch books for a given topic
import { networkFetchBooks } from "../../src/actions/booksListActions"
import { fetchBookData } from "../../src/actions/bookActions"
import logger from "../logger"

/**
 * Takes the requested url and decides if
 * book data should be provided based on that
 * @param  {String}  url The url as a string
 * @param {Object} logger The server logger to keep track of what's happening on the server
 * @return {Array}   The array of book data objects
 */
const fetchBooksDataServer = async (url, logger) => {
    logger.log({ level: "info", message: "fetching books data on server" })
    let booksData = []
    if (/books\/+/.test(url)) {
        const params = url.split("/") || []
        const collection = params.pop() || "featured"
        booksData = await networkFetchBooks(collection, 10).catch(e =>
            logger.log(`failed to fetch books ${e}`)
        )
    }
    return booksData
}

const fetchBookDataServer = async (url, logger) => {
    logger.log({ level: "info", message: "fetch data for a book" })
    let book = {}
    if (/book\/+/.test(url)) {
        const params = url.split("/") || []
        const bookId = params.pop()
        book = await fetchBookData(bookId).catch(e =>
            logger.log(`failed to fetch book ${e}`)
        )
    }
    return book
}

/**
 * This is the initial request.
 * From here the data is collected, the app rendered and then sent
 * as fully rendered html to the client.
 */
const initialRequest = () => async (request, response) => {
    const data = await networkFetchCollection().catch(e =>
        logger.log(`failed to fetch topics ${e}`)
    )

    const booksData = await fetchBooksDataServer(request.url, logger)
    const book = await fetchBookDataServer(request.url, logger)

    // point to the html file created by CRA's build tool

    fs.readFile(filePath, "utf8", (error, htmlData) => {
        if (error) {
            console.error("error", error) // eslint-disable-line
            return response.status(404).end()
        }

        // Populate the redux object
        const reduxState = store.getState()
        reduxState.booksReducer.collections = data
        reduxState.booksReducer.books = booksData
        reduxState.booksReducer.selectedBook = book

        // render the app as a string
        const html = renderToString(
            <StaticRouter location={request.url} context={{}}>
                <Provider store={store}>
                    <Route path="/" component={App} />
                </Provider>
            </StaticRouter>
        )

        // The initial data is also needed on the client
        // for the hydration step
        const initialData = `
                <script>
                    window.__REDUX_INITIAL_DATA__ = ${serialize(reduxState)};
                </script>`

        // inject the rendered app into index.html and send
        return response.send(
            htmlData.replace(
                '<div id="root"></div>',
                `<div id="root">${html}</div>${initialData}`
            )
        )
    })
}

export default initialRequest
```

### Hydrating

Now that the client, web-crawler or web-browser, has the html it needs, the javascript bundle, app.js, is also downloaded. Why?

The SPA can be read but is not interactive. If the user were to click an element with an `onClick` event nothing would happen.

Once the javascript bundle has been downloaded, the hydrating step can take place. Effectively this makes the server rendered application **interactive** for the end-user.

```javascript
// --- index.js
...

const root = document.getElementById("root");
root.hasChildNodes()
    ? hydrate(<AppContainer />, root)
    : render(<AppContainer />, root);

```

In the above case, hydrating only takes place if there are childNodes. This confirms that the initial render on the server went as expected and that the root now has child elements (with text).

## Running locally

Run the app locally to ensure the initial render is indeed being served by the server.

```bash

# first create a new build (used for hydration)
npm run build

# Now start the server
NODE_ENV=production node ./server/server.js
```

---

## Generate new sitemap.xml

With server side rendering in place the sitemap.xml generators can find all of the pages of the site. The generated file can then be fed (uploaded) to the webmaster pages of the popular search engines (Google, Bing, Yahoo, Yandex, etc.). This allows the crawlers to more easily index the site.

# Summary

All in all it took some time to get this setup properly. The benefits are definitely there though.

Giwan

---

# Future updates / articles

How to verify that server side rendering is indeed working (using various browsers), especially when service workers are in the mix.

# Links

[Rendering React **only** on the server](/react-instead-of-jsp/)
