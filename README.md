# koa-single-page [![CircleCI](https://circleci.com/gh/sandcastle/koa-single-page/tree/master.svg?style=svg)](https://circleci.com/gh/sandcastle/koa-single-page/tree/master)

> A koa 2 server for hosting a SPA applications


## Getting Started

The repository has the following folders:

- `src` - The source files
- `test` - The test suite
- `script` - Contains helper scripts (see below)

### Scripts

The below helper scripts are available for convenience:

- `script/setup` - sets up the repo for the first time
- `script/update` - run after pulling latest from the repo
- `script/clean` - cleans all temporary directories used for build and packaging
- `script/build` - build the application
- `script/test` - run all the integration tests
- `script/package` - packages the app as a docker container (must be run after `script/build`)
