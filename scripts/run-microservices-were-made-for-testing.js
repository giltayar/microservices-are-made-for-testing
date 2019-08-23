#!/usr/bin/env node
'use strict'

const webApp = require('../')

async function main() {
  const app = await webApp({})
  await app.listen(process.env.PORT || 3000, '0.0.0.0')
  await app.ready()
  console.log(`Listening on port ${app.server.address().port}`)
}

main().catch(async err => {
  try {
    console.error('Webserver crashed', err.stack || err)
  } finally {
    process.exit(1)
  }
})
