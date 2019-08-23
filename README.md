# microservices-were-made-for-testing

Application that yada yada yada.

## Installing

* This package is meant to be used as a docker container, passing the environment variables as defined below.

```sh
docker run -d applitools/microservices-were-made-for-testing
```

* Alternatively, it can be run using `./scripts/run-microservices-were-made-for-testing.js`,
  passing the environment variables as defined below.

```sh
npm install -g @applitools/microservices-were-made-for-testing
run-microservices-were-made-for-testing.js
```

* Alternatively, you can import it and create the app (see below), passing it the configuration as defined below.

```sh
npm install @applitools/microservices-were-made-for-testing
```

## Services it depends on

* Yada: yada yada

### Queue Job Schema

A JSON with the following fields:

* `yada`: yada yada

## Environment variables needed by docker container and application

* `YADA_YADA`: yada

## Using the package to run the application

```js
const createApp = require('@applitools/microservices-were-made-for-testing')

// configuration options aee the same as the above corresponding environment variables
const app = createApp({})

// app is an express app. Use listen to start it in the usual way
app.listen(/*...*/)
```
