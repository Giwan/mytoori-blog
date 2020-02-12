---
path: "/jest-coverage-in-create-react-app"
date: "2020-02-20"
title: "Jest coverage in CRA"
image: ""
author: "Giwan Persaud"
published: true
---


<style>
.gatsby-highlight pre {
  overflow: hidden;
}
.intro-block {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 16px;
  margin-bottom: 16px;
}
</style>
<div class="intro-block">
When creating a project with Create-React-App jest is already included. Coverage however, is not provided by default. With coverage it's possible to see how much of the code has been covered by tests. 100% coverage ensures that tests touch each part of our application code. That's not a 100% guarantee that we still don't have bugs, the tests themselves can have bugs after all, but it does provide some checks.

  <div>
  <h1>Getting started</h1>

  Create a new project using create-react-app. Navigate into the folder and run the test.
  ```shell
  npx create-react-app my-test-project
  cd my-test-project

  # run tests with out coverage
  npm run test
  ```
  </div>
</div>


<div class="intro-block">
<div>
<h2>Coverage</h2>
With the default tests passing, the next step is to check how much of the code was covered.
Add the following to `package.json`.
</div>

```json
"scripts": {
  "test": "react-scripts test",
  "test:coverage": "CI=true npm test -- --coverage --color"
}
```
</div>

<style>
@media (min-width: 650px) {
  .code-detail {
    display: grid;
    grid-template-columns: 1fr 3fr;
    margin-bottom: 32px;
  }
}
</style>
<div class="code-detail">

### Continuous integration

By setting CI to true, the test is prevented from going into watch mode.

### NPM test

Since the test script has already been defined, it's reused in the `test:coverage` script. The `--coverage --color` flag shows the coverage report in color.
</div>


<div class="intro-block">
<div>
<h1>Bonus: Bitbucket pipeline</h1>

If the project is using bitbucket pipelines, this is how it can be configured to run the test before the deployment.
</div>

```yaml
image: node:13.7.0

pipelines:
    branches:
        master:
            - step:
                  name: Build and test
                  script:
                      - CI=true npm cit
```
</div>

## NPM cit

This cleans the `node_modules` folder, installs the dependencies and runs the test.
