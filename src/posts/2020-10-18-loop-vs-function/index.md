---
path: "/loop-vs-function"
date: "2020-10-18"
title: "Loop versus function"
summary: "Using for loops is basic however JS offers several ways of looping with functions."
image: ""
author: "Giwan Persaud"
published: true
---

A few challenges will help clarify the use of functions.

---

# Challenge: return the first duplicate

```

//Given an array = [2,5,1,2,3,5,1,2,4]:
//It should return 2

//Given an array = [2,1,1,2,3,5,1,2,4]:
//It should return 1

//Given an array = [2,3,4,5]:
//It should return undefined

// [2,5,5,2,3,5,1,2,4]
// return 5 because the pairs are before 2,2

```

Given the first array, the following function is created to return the duplicate:

```javascript
// function to find the first duplicate
function firstRecurringCharacter(input) {
    let uniqueList = []

    for (let i = 0; i < input.length; i++) {
        if (uniqueList.includes(input[i])) {
            return input[i]
        }
        uniqueList.push(input[i])
    }
}
```

Test this function with the challenges provided above:

```javascript
const input1 = [2, 5, 1, 2, 3, 5, 1, 2, 4]
console.log(firstRecurringCharacter(input1))
// 2

const input2 = [2, 1, 1, 2, 3, 5, 1, 2, 4]
console.log(firstRecurringCharacter(input2))
// 1

const input3 = [2, 3, 4, 5]
console.log(firstRecurringCharacter(input3))
// undefined

const input4 = [2, 5, 5, 2, 3, 5, 1, 2, 4]
console.log(firstRecurringCharacter(input4))
// 5
```

## Avoiding the for loop

Another way of doing this is by using the builtin `every` function. It loops over the give array and takes a test function as an argument. If every item of the array passes the test, it returns true.

```javascript
// Avoid using a for loop
function firstRecurringCharacter(input) {
    let uniqueList = []
    let duplicateVal

    input.every(val => {
        const isUnique = !uniqueList.includes(val)
        if (isUnique) uniqueList.push(val)
        else {
            duplicateVal = val
        }

        return isUnique
    })

    return duplicateVal
}
```

It effectively does the same thing exept it uses `every` instead of a for loop. Note `return isUnique`. If `false` is returned then the loop stops.
At this point it might be hard to justify why this is "better".

## With closures?

Ultimately the duplicate value, if found, should be returned. Using closures it's possible to split up the function.

```javascript
const helper1 = (() => {
    let uniqueList = []
    let _duplicate

    return function(val) {
        const isUnique = !uniqueList.includes(val)
        if (isUnique) uniqueList.push(val)
        else _duplicate = val

        return {
            isUnique,
            val: isUnique ? undefined : val,
            reset: () => {
                uniqueList = []
                _duplicate = undefined
            },
            duplicate: () => _duplicate,
        }
    }
})()

function firstRecurringCharacter(input) {
    helper1().reset()

    input.every(val => {
        const { isUnique } = helper1(val)
        return isUnique
    })

    return helper1().duplicate()
}
```

The `helper1` function uses closures to effectively maintain it's own internal list and duplicate value. Because of the object being returned, the helper1 can be called at any time and asked for the value of the duplicate. If `reset` has not been called the last duplicate value is provided.

`reset()` clears the last list so that when the function is called again the `uniqueList` is empty;

This is a lot more code for something this simple. It does however demonstrates closures.
