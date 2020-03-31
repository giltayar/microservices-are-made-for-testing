# microservices-are-made-for-testing

Companion code to the "These microservices are made for testing, and testing is what we'll do" talk.

You can find the talk slides [here](http://bit.ly/microservices-are-made-for-testing-jsil)

This package is a microservice, complete with testing, that gives CRUD functionality to a "tenants" database.

> Note! This package uses Node's ESM support, so Node v13 is the minimum version

## Installing and running

* To install and build it, run:

```sh
npm ci
npm run build # Builds the docker image
npm test # Tests the microservice
```

* To run it as a microservice in a docker container

```sh
# run postgres
docker run --name postgres -d -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:12.1
# run the microservice
docker run -d -e "DATABASE_CONNECTION_STRING=postgresql://user:password@postgres:5432/postgres" giltayar/microservices-are-made-for-testing
```

* Alternatively, it can be run outside of the docker container,
  using `./scripts/run-microservices-are-made-for-testing.js` (or `npm start`),
  and the environment variables as defined below.

```sh
# run postgres
docker run -d -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:12.1
export DATABASE_CONNECTION_STRING=postgresql://user:password@localhost:5432/postgres
npm start
```

## Services it depends on

* Docker: you need it to run the tests, but not necessarily in production
* Postgres: you don't need to install Postgres to run the tests
(because the tests run the Postgres docker container by themselves),
but you will need it in a production environment.

## Using the package to run the application


```js
const createApp = require('@giltayar/microservices-are-made-for-testing')

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
