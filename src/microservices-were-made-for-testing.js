'use strict'
const fastify = require('fastify')

module.exports = createApp

async function createApp() {
  const app = fastify()

  app.get('/', async () => {
    return 'OK'
  })

  return app
}
