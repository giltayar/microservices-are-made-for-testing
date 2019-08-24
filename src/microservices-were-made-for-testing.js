'use strict'
const fastify = require('fastify')
const {Client} = require('pg')

async function createApp({databaseConnectionString}) {
  const app = fastify()

  const client = new Client({connectionString: databaseConnectionString})
  await client.connect()
  app.addHook('onClose', async () => await client.end())

  app.get('/', async () => {
    return 'OK'
  })

  app.get('/api/tenants', async () => {
    const response = await client.query('SELECT first_name, last_name FROM tenants')

    return response.rows
  })

  app.post('/api/tenants/:id', async req => {
    const {id} = req.params
    const {firstName, lastName} = req.body

    const {rows} = await client.query(`INSERT INTO tenants VALUES ($1, $2, $3)`, [
      id,
      firstName,
      lastName,
    ])

    return rows
  })

  app.put('/api/tenants/:id', async req => {
    const {id} = req.params
    const {firstName, lastName} = req.body

    const {rows} = await client.query(
      `UPDATE tenants SET first_name=$2, last_name=$3 WHERE id=$1`,
      [id, firstName, lastName],
    )

    return rows
  })

  app.delete('/api/tenants/:id', async req => {
    const {id} = req.params

    await client.query('DELETE FROM tenants WHERE id=$1', [id])

    return {}
  })

  return app
}

const databaseSchema = `
  CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    first_name VARCHAR,
    last_name VARCHAR
  )
`

module.exports = createApp
module.exports.databaseSchema = databaseSchema
