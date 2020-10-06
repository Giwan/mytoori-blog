---
path: "/css-grid-one-line"
date: "2020-10-01"
title: "CSS grid one liners"
summary: "CSS layouts achieved in a single line"
image: ""
author: "Giwan Persaud"
published: false
---

Create interesting layouts quickly.

---

This post is based on the talk and demo from here: https://1linelayouts.glitch.me

## Quickly center items

```css
div {
    display: grid;
    place-items: center;
}
```

## Three tall cards next to each other

```css
main {
    display: flex;
    flex-wrap: wrap;
}

section {
    /* flex: none | [] */
    flex: 0 1 100px; /* grow = 0 so it doesn't strech */
    flex: 1 0 100px; /* allow grow but not shrink */
}
```

## Main and aside

```css
main {
    display: grid;
    grid-template-columns: minmax(200px, 1fr), 3fr;
}
```
