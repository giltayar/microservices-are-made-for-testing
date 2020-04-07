#!/usr/bin/env node
import createApp from '../src/microservices-are-made-for-testing.js'

async function main() {
  const app = await createApp({
    databaseConnectionString: process.env.DATABASE_CONNECTION_STRING,
  })
  await app.listen(parseInt(process.env.PORT, 10) || 3000, '0.0.0.0')
  console.log(
    `Listening on port ${/**@type import('net').AddressInfo */ (app.server.address()).port}`,
  )
}

main().catch(async (err) => {
  try {
    console.error('Webserver crashed', err.stack || err)
  } finally {
    process.exit(1)
  }
})
