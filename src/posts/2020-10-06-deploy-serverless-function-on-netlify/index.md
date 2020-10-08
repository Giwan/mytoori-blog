---
path: "/deploy-serverless-function-on-netlify"
date: "2020-10-08"
title: "Deploy a React SPA with serverless functions to netlify"
summary: "Deploy and test the project directly from the remote server."
image: ""
author: "Giwan Persaud"
published: true
---

In the previous post, a simple serverless function was created with a basic front-end project. In this article it will be deployed to netlify.

The code repository on github https://github.com/Giwan/react-serverless

Login to your account website on netlify.com. You should see the project that was created in the previous article. https://blog.mytoori.com/serverless-functions-on-netlify

It is, however, not deployed yet.

# Deploy to netlify

Since the project works locally, run the following to deploy it.

```bash
# in the project root directory
netlify deploy --prod
```

The CLI checks if the current directory is already linked to an existing site if no `siteId` config is found. Follow the wizard to configure the proper site.

Afterwards it's also necessary to indicate which folder contains the compiled code. Since we're in a create-react-app application this should be a `build` directory.

The directory might not exist yet but as soon as you run `npm run build` it will be created. Now run `netlify deploy --prod` again to actuallly deploy.

## /admin doesn't work

Your app has a url that ends `.netlify.app`. In my case for example:
`https://wizardly-noether-9006a1.netlify.app`

Navigate to https://wizardly-noether-9006a1.netlify.app/admin and there is an error however. This is because `/admin` is supposed to be handled on the **client**. The server recieves it however. It looks for `/admin/index.html` on the server but doesn't find it.

The client router **does** know how to handle this request. So the server merely needs configuration to point back to the client.

The `netlify.toml` allows for this configuration:

```toml
[build]
    functions = "functions"
    publish = "build"
    base = "/"

# routing is handled on the client
[[redirects]]
    from="/*"
    to="/index.html"
    status=200
```

The **`[build]` section** is important. I if `base = "/"` is not configured, it will fail.
