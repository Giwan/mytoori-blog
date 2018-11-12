---
path: "/vscode-debugging"
date: "2018-01-05"
author: "Giwan Persaud"
title: "VSCode debugging"
---

# Debugging with Visual Studio Code

## Tags

-   Javascript
-   React
-   Chrome
-   VSCode

VSCode has this nifty feature that allows breakpoints to be set in the editor while building the front-end in the chrome browser.

Before getting started, you'll need to install the `debugger for Chrome` extension

In the debug view click on the cog wheel in the top left to have VSCode automatically load up the `launch.json` file.

```
{
    "name": "run localhost:3000",
    "type": "chrome",
    "request": "launch",
    "url": "http://localhost:3000",
    "webRoot": "${workspaceFolder}"
}
```

-   `name`: The name of the task shown next to the play button (top left)
-   `Type`: What type of process are you running. (_Node | Chrome_)
-   `Request`: should it attach to an existing session or create a new one (_alt: attach_)
-   `webRoot`: Points to the source files or say the build files. I.e. `${workspaceFolder}/build` or `${workspaceFolder}/dist`

Start the front-end from the terminal and leave it running. Press the play button in the debug menu. A new chrome session will be started.
Set a breakpoint in vscode by clicking to the left of the line number.
Now run the front-end normally and the execution should stop at the breakpoint.

### Attaching to a running process

This does require chrome to be started with remote debugging enabled:
`$> /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222`

```
{
            "name": "Attach",
            "type": "chrome",
            "request": "attach",
            "port": 9222,
            "url": "http://localhost:3000",
            "webRoot": "${workspaceFolder}"
        },
```

## Conditional breakpoint

Now that it's possible to set break points directly in the editor, it would be nice to have some more control. Conditional breakpoints provide a conditional, which if true, will trigger the breakpoint.

Pro:
Pause execution directly in vscode.

Con:
The source maps need to be setup correctly or you might get confusing output

# Resources

[VSCode on github](https://github.com/Microsoft/vscode-chrome-debug)