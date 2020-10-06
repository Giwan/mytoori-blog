---
path: "/serverless-functions-on-netlify"
date: "2020-10-06"
title: "Getting started with serverless functions on netlify"
summary: "Setup a simple demo login function to see serverless functions in action"
image: ""
author: "Giwan Persaud"
published: true
---

Almost Without fail, the first reply when mentioning serverless functions, is that there _is_ a server. It's just not a server you need to maintain. And that can be a good thing.
It allows for a **minimal backend infrastructure**. At it's most basic, handle a form submission for example. But, there are many more possibilities.

---

# Pros & Cons

## Pro: Easily run a server function

Imagine a simple exam practice site. It's very simple. No database involved.
There's a simple function on the server, returning a random question when the end-point is called.
Since there is no database though, that list of questions is hard-coded on the server.

There is no need to setup, maintain and run a backend server. It saves quite some time. Focus instead on the end-user experience.

## Con: Knowledge and lock in?

First you'll need to figure out how a particular hosting provider has configured their serverless functions. Depending on what you're building you might not want to tie your entire backend to a single company.
The details of that are a separate post however.

# Netlify

There are many parties offering (front-end) hosting. I started using Netlify because of how easy it is.
In a follow-up post, I'll dive into the use of FaunaDB for a more complete backend infrastructure.

To get started create a free account on netlify.com.

## Netlify-cli

The `netlify-cli` makes it easy to use the serverless functions while developing.

```bash
brew install netlify-cli
```

Login with the cli to connect it to the account created previously.

```bash
netlify login
```

Create a new site with the following. The `--name` parameter is optional.

```bash
netlify sites:create
```

We now have a site entity for netlify and can start creating the front-end app.
My go to is **create-react-app**. Feel free to use a different framework if you're more comfortable with that.
It shouldn't matter too much for the serverless functions.

```bash
// create react project
npx create-react-app serverless-fauna

// open react project with vscode
code ./serverless-fauna
```

## Starting the project

Normally `npm start` is used to start the react project. In this case however, use `netlify`. It will also serve the serverless functions.

```bash
// start project with netlify
netlify dev
```

By default, port 8888 is used. Navigate to http://localhost:8888 in the browser to see the project running locally.

## Cleanup default project files

The project will just have a few buttons. These, in turn, trigger the serverless functions. Replace the contents of `App.js` with the following:

```javascript
import React from "react"
import "./App.css"

function App() {
    return (
        <div className="App">
            <h1>Serverless functions demo</h1>
            <button>Login</button>
        </div>
    )
}

export default App
```

Delete the files not imported anywhere.

# Serverless functions

## Creating the first function

A mock login function can take a username and password parameter to indicate success or failure.
At this point nothing is connected to the database yet.

Netlify needs to know where the serverless functions are stored. In this case this is indicated in the `netlify.toml` configuration file.

```toml
# netlify.toml

[build]
    functions="functions"

```

```bash
netlify functions:create --name login
```

`netlify-cli` provides a list of templates to choose from. Choose the easiest (first) one:
`[hello-world] Basic function that shows async/await usage, and response formatting`

The codebase now has a `functions` folder with `login.js`.
That `login.js` represents an API endpoint. Type CTRL-C to stop the development server and run netlify dev again. Now test it.

```bash
# API call to serverless function
curl http://localhost:8888/.netlify/functions/login/login.js
```

`.netlify` in the target url signals to netlify that it should serve a serverless function. After that the function is in a folder path named **functions/login**.

With this template function the template returns "hello world"

```json
// Response from /.netlify/functions/login/login.js
{ "message": "Hello World" }
```

This default function also accepts input from the client. It can be provided with a name parameter which will be returned in the output:

```bash
# API call with queryString parameter
curl http://localhost:8888/.netlify/functions/login/login.js?name=client
```

```json
// response from the server
{ "message": "Hello world from client" }
```

## Login function (without database connection)

This login function will accept a static username and password POST input and confirm whether the user should be given access or not.

```javascript
// functions/login/login.js

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const authFailed = (message = "authentication failed") => ({
    statusCode: 401,
    body: JSON.stringify({ message }),
})

exports.handler = async (event, context) => {
    try {
        if (!event.body) return authFailed("username and password required")
        const { username, password } = JSON.parse(event.body)

        if (!(username && password)) {
            return authFailed("invalid username password combination")
        }

        if (!(username === "admin" && password === "123")) {
            return authFailed("invalid username password combination")
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "access granted" }),
        }
    } catch (err) {
        return { statusCode: 500, body: err.toString() }
    }
}
```

The function now checks `event.body` for the credentials which have to be posted in JSON format. The helper function `authFailed` is called from several places if anything fails.

Call the function without providing any input data.

```bash
# API call to login.js
curl --location --request GET 'http://localhost:8888/.netlify/functions/login/login.js'
```

It fails with a `401 unauthorized` and returns the following message.

```json
// API response for curl --location --request GET 'http://localhost:8888/.netlify/functions/login/login.js'
{ "message": "username and password required" }
```

In practice the `401` return code should be sufficient but this demonstrates the options available.

Another call with invalid credentials returns a slightly different message.

```bash
# API call to login.js

curl --location --request GET 'http://localhost:8888/.netlify/functions/login/login.js' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "test",
    "password": "test"
}'
```

```json
// API call response
{ "message": "invalid username password combination" }
```

repeat the call above with `username="admin"` and `password=123` and the server responds with HTTP status 200.

```bash
# API call to login.js

curl --location --request GET 'http://localhost:8888/.netlify/functions/login/login.js' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "admin",
    "password": "123"
}'
```

```json
// API call response
{ "message": "access granted" }
```

# Front-end using API end-point

Fnow now the login button will call the end-point with the credentials. If HTTP 200 is received the front-end redirects to the /admin page.

```bash
npm i react-router react-router-dom
```

Update `index.js` so there is support for react-router from the root. Wrapp `<App />` in `<BrowserRouter>`.

```javascript
// index.js

import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { BrowserRouter } from "react-router-dom"

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
)
```

Next configure `App.js` with two routes. A `LoginPage` and a `AdminPage`. With the `<Switch />` component only one of the two routes is loaded.

```javascript
// App.js

import React from "react"
import "./App.css"
import { Route, Switch } from "react-router-dom"
import LoginPage from "./components/LoginPage"

function App() {
    return (
        <div className="App">
            <h1>Serverless functions demo</h1>
            <Switch>
                <Route path="/admin" component={() => <h1>Admin page</h1>} />
                <Route path="/" component={LoginPage} />
            </Switch>
        </div>
    )
}

export default App
```

Create a components folder and add the `LoginPage.js` component. It shows a basic login form.
If successful, the admin page is loaded in the `/admin` route. Note: There is no validation on the Admin page! This merely demonstrates that the app received a HTTP 200 from the server and redirected the client.

```javascript
// LoginPage.js

import React from "react"

export const headers = {
    method: "POST",
    "Content-Type": "application/json",
}

const LoginPage = ({ history }) => {
    const handleSubmit = async e => {
        e.preventDefault()
        const { username, password } = e.currentTarget
        if (!username.value && password.value) {
            console.warning("username and password required")
            return
        }

        try {
            headers.body = JSON.stringify({
                username: username.value,
                password: password.value,
            })
            const response = await fetch(
                "/.netlify/functions/login/login.js",
                headers
            )

            if (!response.ok) {
                throw new Error(`Login failed: ${response.status}`)
            }

            history.push("/admin")
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="username" required />
            <input type="password" name="password" required />
            <button>Login</button>
        </form>
    )
}

export default LoginPage
```
