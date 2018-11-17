---
path: "/server-side-rendering-with-react"
date: "2018-11-11"
title: "Server side rendering with React"
summary: "this is a test"
image: ""
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

All the content of the application is either in the `app.js` file that the web crawler cannot parse or will be loaded later using REST.

## Server side rendering

With server side rendering (SSR), the SPA is is first fully rendered on the server before it's sent to the client. All of the html content is sent in that first request just as it would be with a statically rendered site.
