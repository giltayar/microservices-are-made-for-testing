# microservices-were-made-for-testing

Companion code to the "These microservices were made for testing, and testing is what we'll do" talk.

You can find the talk slides [here](http://bit.ly/microservices-were-made-for-testing-jsil)

This package is a microservice, complete with testing, that gives CRUD functionality to a "tenants" database.

## Installing

* This package is meant to be used as a docker container, passing the environment variables as defined below.

```sh
docker run -d -e "DATABASE_CONNECTION_STRING=..." giltayar/microservices-were-made-for-testing
```

* see `test/e2e/docker-compose.yml` for an example run used in the end to end tests.

* Alternatively, it can be run using `./scripts/run-microservices-were-made-for-testing.js`,
  using the environment variables as defined below.

```sh
npm install @giltayar/microservices-were-made-for-testing
export DATABASE_CONNECTION_STRING=...
npx run-microservices-were-made-for-testing
```

* Alternatively, you can import it and create the app (see below), passing it the configuration as defined below.

```sh
npm install @giltayar/microservices-were-made-for-testing
```

## Services it depends on

* Postgres: you don't need to install Postgres to run the tests, but you will need it in a production environment.

## Using the package to run the application

```js
const createApp = require('@giltayar/microservices-were-made-for-testing')

// configuration options aee the same as the above corresponding environment variables
const app = createApp({databaseConnectionString: '...'})

// app is a fastify app. Use listen to start it in the usual way for [fastify](https://fastify.io)
await app.listen(/*...*/)
```

You can see an example of such use in `test/commons/setup.js`.

## Building and Testing

To build and test it:

```sh
npm ci
npm run build # Builds the docker image
npm test # Tests the microservice
```

## Tests

Tests can be found in the `test` folder, where there are three folders:

* `unit`: for the unit tests
* `it`: for the integration tests, where I run the app using `require` and HTTP against it to check it
* `e2e`: for the "e2e" tests, where I run the app using its docker container and HTTP against it to check it

## Publishing

To publish the microservice, do:

```sh
npm publish
```

This will publish both the NPM package and the microservice.
