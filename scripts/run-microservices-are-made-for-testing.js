#!/usr/bin/env node
import createApp from '../src/microservices-are-made-for-testing.js'

const app = await createApp({
  databaseConnectionString: process.env.DATABASE_CONNECTION_STRING,
})

const port = parseInt(process.env.PORT, 10) || 3000

await app.listen(port, '0.0.0.0')

console.log(`Listening on port ${port}`)
