---
path: "/animation"
date: "2020-12-23"
title: "Animation basics"
summary: "This post looks at making some basic animations using vanilla js"
image: ""
author: "Giwan Persaud"
published: true
---

Some examples with explanation on how to make them.

---

# Radar

The goal of this part is to create a simple radar animation. This is something many of us have seen often in movies. I'm not actually sure if that is what it looks like in real life.

<style>
    a[href="https://ebony-shaded-duckling.glitch.me"] {
        text-align: center; 
        display: block;
        margin: 16px 0;
        color: var(--color-primary);
        font-weight: 800;
    }
</style>
<a href="https://ebony-shaded-duckling.glitch.me" target="_blank" rel="noopener noreference">
    Radar Demo
</a>

We start by drawing a canvas element with a fixed width and height of `600`. The rest is boilerplate code to accesss the js and css files.

```html
// index.html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Radar Animation</title>
        <link rel="stylesheet" href="index.css" />
    </head>
    <body>
        <h1>Radar</h1>
        <canvas id="animationCanvas" width="600" height="600"></canvas>
        <script src="./index.js"></script>
    </body>
</html>
```

## HTML and large circle

Now the `index.js` file the rest of the work can be done. First access the canvas, get the context and create the large circle.

```javascript
// index.js

const canvas = document.getElementById("animationCanvas");
const ctx = canvas.getContext("2d");

// The center of the circle
// The canvas is 600 x 600
const center = {
    cx: 300,
    cy: 300,
};

// draw center circle
const drawContainerCircle = ({ cx, cy }) => {
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.arc(cx, cy, 250, 0, Math.PI * 2, true);
    ctx.stroke();
};

// execute the function above
drawContainerCircle(center);
```

The `arc` function is give by the `canvas context`. https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc

## A dot in the middle

```javascript
// index.js

const drawCenterCircle = ({ cx, cy }) => {
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.fillStyle = "green";
    ctx.lineWidth = 2;
    ctx.arc(cx, cy, 5, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.fill();
};
```

A new path is started with `ctx.beginPath()` which essentially clears out any non-committed paths. https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/beginPath

`ctx.fill();` ensures the circle is filled with the previously filled colour.

## Configuration

Setup the configuration to use later when drawing.

```javascript
// index.js
const startAngle = 180; // start at the top of the circle
const endAngle = -startAngle; // restart point
let angle = startAngle; // will be updated on every tick
let radius = 250; //
```

The radar radius needle which like the seconds of a clock starts at the top of the clock.
At angle 0 the needle starts at the bottom. Setting it to 180 means that it starts at the top.

The `endAngle` is where the reset happens.
`angle` is incremented on every tick.
`radius` remains constant through out.

## Calculate the points on the circle.

The points on the circle are calculated with the following function. It's called every tick to calculate the new position of `x` and `y`. First the angle provided which needs to be to converted to radians for the next calculation step.

```javascript
// index.js

const getPointsOnCircle = ({ radius, angle, cx, cy }) => {
    angle = angle * (Math.PI / 180); // convert from degrees to radians
    const x = cx + radius * Math.sin(angle);
    const y = cy + radius * Math.cos(angle);
    return {
        x,
        y,
        cx,
        cy,
    };
};
```

The resulting object is passed to the next function `drawRadarScanner`. A new path is started, move to the position of the center and draw a line to the newly calculated position. After that `window.requestAnimationFrame` ensures the process is repeated by calling the `draw` function which in turn executes `drawRadarScanner(getPointsOnCircle({ radius, angle, cx, cy }));`

```javascript
// index.js

const drawRadarScanner = ({ x, y, cx, cy }) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();

    window.requestAnimationFrame(() => draw({ cx, cy }));
};
```

Here is the draw function which checks if the circle is complete. It also checks if the animation is actuall on.

```javascript
// index.js

const draw = ({ cx, cy }) => {
    if (angle <= endAngle) {
        ctx.clearRect(0, 0, 600, 600);
        drawContainerCircle({ cx, cy });
        angle = startAngle;
    }

    if (!isRadarOn) {
        return;
    }

    angle -= 0.35;
    drawRadarScanner(getPointsOnCircle({ radius, angle, cx, cy }));
};
```

That's all. Putting the code together gets you the animation shown in the <a href="https://ebony-shaded-duckling.glitch.me" target="_blank" rel="noopener noreference">Radar demo</a>

The most important parts of this why I wrote this blog post:

```javascript
const getPointsOnCircle = ({ radius, angle, cx, cy }) => {
    angle = angle * (Math.PI / 180); // convert from degrees to radians
    const x = cx + radius * Math.sin(angle);
    const y = cy + radius * Math.cos(angle);
    return {
        x,
        y,
        cx,
        cy,
    };
};
```

---

The source code can be found both on the demo link on <a href="https://ebony-shaded-duckling.glitch.me/" alt="demo on glith">glitch</a> and on <a href="https://github.com/Giwan/demo-radar" alt="project source code">github</a>.
