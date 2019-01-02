---
path: "/free-static-site"
date: "2018-12-29"
title: "Free static site"
summary: "How to create and host a static site, including SSL and domain name for 0 euros! Static sites can be hosted for free thanks to some amazing services available as of 2018. "
image: ""
author: "Giwan Persaud"
---

Setting up a free static site is completely possible. Naturally if your site grows and needs more resources, those are likely to cost some money.

At that time there's hopefully enough traction for you to bill your users / visitors allowing you to pay for the resources you're consuming.

## Executive Summary

-   Create a repository on github
-   Create index.html file with basic html
-   Connect Netlify.com to github.com to pull

## Initialise repository

Start by creating the git respository. This workflow has been tested with [github](https://github.com) so that's what will be used to host this respository. If prefer, [bitbucket](https://bitbucket.com) or [gitlab](https://gitlab.com) are possible alternatives. I would recommend staying with github for this article though.

Create a new repository. I named mine "JAM".
Now create a new file: `index.html` and add the following basic html code. This will help to show the site is up and running as expected.

```html
<!DOCTYPE html>

<html lang="en">
    <head>
        <meta charset="utf-8" />

        <title>JAM example</title>
        <meta name="description" content="" />
        <meta name="author" content="" />
    </head>

    <body>
        <h1>JAM Stack demo</h1>
    </body>
</html>
```

## Build and deploy with Netlify

With the index.html page ready, the next step is to ensure the site will deploy to netlify everytime a push is made to the master branch.

Login on [netlify.com](https://netlify.com) using your github account. This makes it very easy to connect to your github repo. Then click "create new site from git" to connect to the repo created above. As of December 2018 netlify presents three git repositories to connect to:

-   github.com
-   gitlab.com
-   bitbucket.com

Go ahead and choose github. The authentication screen now shown, is to verify that you are ok with netlify accessing your github account. This is necessary to pull down the repo and deploy the project. Click Authorize to continue.
Next, choose the account and repositories you would like to provide access to. In this case I'll choose my personal account and select the repository "jam". If you're prompted to provide your password, please go ahead and do so.

This should finish the second step of the process. Now click the repository to continue. In my case this is `Giwan/jam`.

In the last step the master branch is configured as the build trigger. Any pushes made to the master branch will trigger the project to rebuild.

That's it for now. Click `Deploy Site` to, euh, deploy.
Netlify will deploy the site and provide you with a custom netlify url that you can see the deploy site.

That's it. The simple basics of deploying a simple site to netlify.com.

## Custom domain

The site is pretty basic right now. The goal of this post was to show how you could easily get up and running. The site can be made much better but I prefer to do that as a progressive enhancement. Next we are going to create a custom domain. That free domain will unlock the possibility to add SSL to our website.

### freenom.com

[freenom.com](https://freenom.com) provides free domain names. Simply search for a free domain and add it to your account. For the purpose of this article, I have registered "mycustomdomainname.ga" for 12 months for free. The domain will therefore expire December 2019.

### Netlify DNS

Next the domain is configured in netlify. The easiest free way to do this is to ensure that the domain name uses netlify's Name Servers. Open the project in your netlify account and go to settings. Click on domain settings. From there you can choose "Check DNS configuration" and then "Setup Netlify DNS for custom domain mycustomdomainname.ga". This will start the walkthrough to setup the Name Servers.

The walkthrough checks that you are the owner of the domain. It then adds the DNS entries that points the custom domain "mycustomdomainname.ga" to the actual build.

In the last step, the DNS settings for Netlify's DNS are provided. These simply need to be configured on freenom.com where we registered the domain name.

-   dns1.p06.nsone.net
-   dns2.p06.nsone.net
-   dns3.p06.nsone.net
-   dns4.p06.nsone.net

Open freenom.com and click manage **my domains**. Click manage domain for mycustomdomainname.ga and then choose management tools.

From the two options presented, choose \*\*use custom nameservers". This is where netlify's nameservers can be entered.

Copy and paste the values from netlify.com over to freenom.com and save.

Next click "Done" on the netlify page. In the settings page of the netlify project, it should now show that the domain name has been registered.

### SSL

With the custom domain in place, netlify will go ahead and provision the security certificates to secure your site with SSL.
