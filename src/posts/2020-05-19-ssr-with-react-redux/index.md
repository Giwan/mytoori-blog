---
path: "/server-side-rendering-with-react-and-redux"
date: "2020-05-19"
title: "Server side rendering with React & Redux"
summary: "When handling server side rendering, the Redux data should be populated as well"
image: ""
author: "Giwan Persaud"
published: true
---

This article [server-side-rendering-with-react](https://blog.mytoori.com/server-side-rendering-with-react) discusses the basic setup for Server side rendering. It's lacking details on data preloading. Let's discuss how to dynamically request data based on the route component being loaded.

Concept

1. When a certain route is loaded, collect all the data needed for that route
2. Use `store.dispatch` to pass the data into the store
3. The application renders on the server, recognises that it has book data and renders that to the UI component
4. That now filled in UI component is sent to the client.


In scenario 1 a request comes in for the `/` route. For example the user typed `mytoori.com` and enter.
The server recognises the route and checks if any data is required for it to be loaded.

```Javascript
// server/controller/index.js

import express from "express";
import path from "path";
import serverRenderer from "../middleware/renderer";
import configureStore from "../../src/store/configureStore";
import routes from "../../src/routes";
import { matchPath } from "react-router-dom";

const router = express.Router();

let store = configureStore();

const isServerRenderingRequired = async (req, res, next) => {
  const route = routes.find((r) => matchPath(req.path, r));

  if (!route) {
    return next();
  }

  // render on the server
  store = route.loadData ? await route.loadData(store, req.path) : store;
  serverRenderer(store)(req, res, next);
};

router.use(isServerRenderingRequired);

// other static resources should just be served as they are
router.use(
  express.static(path.resolve(__dirname, "..", "..", "build"), {
    maxAge: "30d",
  })
);

module.exports = router;

```

Line `router.use(isServerRenderingRequired);` is where the request first hits. The function is immediately invoked as there is no regular expression argument to indicate when the function should be invoked.

Inside `isServerRenderingRequired` the `react-router-dom` import `matchPath` is used to determine if the route entered by the user matches one of the routes we have defined in our `routes.js` file.

## Routes.js

The `routes.js` file is a new addition to this setup. a separate file with the routes is recommended since both on the client and and on the server are we using this list of routes.

```Javascript
// src/routes.js

import App from "./App";
import Books from "./components/Books/Books";
import Book from "./components/Book/Book";
import { fetchListOfBooks, fetchBook } from "./actions/bookActions";

const loadBookData = async (store, path) => {
  try {
    const id = path.split("/").pop();

    await fetchBook(id)(store.dispatch);

    return store;
  } catch (e) {
    console.error("handle this: ", e.message);
  }
};

const loadBooksData = async (store) => {
  try {
    await fetchListOfBooks()(store.dispatch);

    return store;
  } catch (e) {
    console.error("handle this ", e.message);
  }
};

export default [
  {
    path: "/books",
    component: Books,
    loadData: loadBooksData,
  },
  {
    path: "/book/:id",
    component: Book,
    loadData: loadBookData,
  },
  {
    path: "/",
    component: App,
  },
];


```

It has a `loadData` function which can be used on the server to pre-fetch the data when rendering on the server. On the client, data is fetched in the `componentDidMount` or `useEffect` function.

## Matched a route
If no route is matched, the `next()` function is called to just continue without data and SSR.

When a route is matched though, the process for server side rendering is started. Part of this process is to check _if_ data is required. If yes, it's pre-loaded and passed down the chain.

```Javascript
// server/controller/index.js
// ...

// pre-load data on the server
  store = route.loadData ? await route.loadData(store, req.path) : store;
  serverRenderer(store)(req, res, next);


// ...
```

### Store
The store is an important part of the redux setup. In this `server/controller/index.js` file, a store is also needed. To get that we simply create it similarly to creating it on the client.

```javascript

// server/controller/index.js

// ...

import configureStore from "../../src/store/configureStore";
let store = configureStore();

// ...

```

The `configureStore` function is created in `src/store/configureStore` and is also used on normal client side rendering.

## Pre-Loading data

In the `routes.js` file let's take a closer look at the function called to pre-load the data.
The `loadBooksData` function simply fetches a list of books to show to the user.

```Javascript

// src/routes.js

const loadBooksData = async (store) => {
  try {
    await fetchListOfBooks()(store.dispatch);

    return store;
  } catch (e) {
    console.error("handle this ", e.message);
  }
};

```

The `fetchListOfBooks` function is the same **redux action** called by the client side code when loading the list of books without SSR.

On the client, after the books are loaded, Redux's `dispatch` function passes the received data to the redux store.

On the server, the same is allowed to happen because the store is passed to the `loadBooksData` function.

## Rendering on the server with data

Now that our data has been dispatched to the store, we pass the store to do the final rendering and send it to the client. `serverRenderer(store)(req, res, next);`

```javascript
// server/middleware/renderer.js

import React from "react";
import { renderToString } from "react-dom/server";
import App from "../../src/App";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom";
import serialize from "serialize-javascript";

const path = require("path");
const fs = require("fs");

export default (store) => (req, res, next) => {
  // point to the html file created by CRA's build tool
  const filePath = path.resolve(__dirname, "..", "..", "build", "index.html");
  fs.readFile(filePath, "utf8", (error, htmlData) => {
    if (error) {
      console.error("error", error);
      return res.status(404).end();
    }

    const context = {};

    // render the app as a string
    const html = renderToString(
      <StaticRouter location={req.url} context={context}>
        <Provider store={store}>
          <App />
        </Provider>
      </StaticRouter>
    );

    const reduxState = serialize(store.getState());

    // inject the rendered app into our html and send it
    // IMPORTANT: No spaces on `window.REDUX_STATE="{}"`. The response is built from the uglified html file
    return res.send(
      htmlData
        .replace("window.REDUX_STATE={}", `window.REDUX_STATE = ${reduxState}`)
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    );
  });
};

```

`server/middleware/renderer.js` which is responsible for rendering receives a fully populated store. It finds the `public/index.html` file and opens it for modification.

First the **newHTML** contents is generated with the `renderToString` function. By passing in `req.url` `react-router-dom` does it's thing to filter out only the components that match the current path the user entered. If the path is `https://mytoori.com/book/xyz` then the components `booksList` is ignored.

The book component is rendered and since we also used that path to pre-load the data, we know that the store has been populated. The data from the store is serialized (`JSON.stringify`) and added tot the window object. The whole package can then be sent to the client.

```Javascript

// server/middleware/renderer.js

// ...

const reduxState = serialize(store.getState());

    // inject the rendered app into our html and send it
    // IMPORTANT: No spaces on `window.REDUX_STATE="{}"`. The response is built from the uglified html file
    return res.send(
      htmlData
        .replace("window.REDUX_STATE={}", `window.REDUX_STATE = ${reduxState}`)
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    );
  });

```

## Hydrating the client

The client now receives the fully rendered HTML as it was intended. If the browser has javascript turned off the user will still be able to read all the contents. They won't however be able to interact with the page. For that to happen the client needs to be hydrated.

```Javascript
// src/index.js

import React from "react";
import { hydrate, render } from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";
import { Router } from "react-router-dom";
import history from "./history";

const reduxData = window.REDUX_STATE; // from server
const store = configureStore(reduxData);
const AppBundle = () => (
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
);

// ensures the website can dynamically respond to the user (Javascript)
const root = document.getElementById("root");
root.hasChildNodes()
  ? hydrate(<AppBundle />, root)
  : render(<AppBundle />, root);

```

First the data loaded on the server is pulled from the window object. It should also be deleted later as way of cleanup. It's then used to create a store object on the client. With that store now populated with the same data, the React App is rendered.

```Javascript
// src/index.js

// ...

const reduxData = window.REDUX_STATE; // from server
const store = configureStore(reduxData);
const AppBundle = () => (
  <Router history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
);

// ...
```

The next step is to check if the DOM has content. If it does, it means that our application has been rendered on the server already. Therefore only **hydration** is required. If no content is available, the `render` function is called to simply render on the client.

```Javascript
// src/index.js

// ...

const root = document.getElementById("root");
root.hasChildNodes()
  ? hydrate(<AppBundle />, root)
  : render(<AppBundle />, root);

```
