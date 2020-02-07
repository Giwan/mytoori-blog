---
path: "/jest-coverage-in-create-react-app"
date: "2020-02-20"
title: "Jest coverage in CRA"
image: ""
author: "Giwan Persaud"
published: true
---

When creating a project with Create-React-App jest is already included as part of the package. Coverage however is not there by default. With coverage it's possible to see how much of the code has been covered by tests.

# Getting started

Create a new project using create-react-app. Navigate into the folder and run the test.

```shell
npx create-react-app my-test-project
cd my-test-project

# run tests with out coverage
npm run test
```

With the default tests passing, the next step is to see how mch of the code was covered.

Add the following script to the `package.json` file.

```json
"scripts": {
  "test": "react-scripts test",
  "test:coverage": "CI=true npm test -- --coverage --color"
}
```

## Continuous integration

By setting CI to true, the test is prevented from going into watch mode.

## NPM test

Since the test script has already been defined, it's reused in the `test:coverage` script. The `--coverage --color` flag shows the coverage report in color.

# Bonus: Bitbucket pipeline

If the project is using bitbucket pipelines, this is how it can be configured to run the test before the deployment.

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

## NPM cit

This cleans the `node_modules` folder, installs the dependencies and runs the test.
