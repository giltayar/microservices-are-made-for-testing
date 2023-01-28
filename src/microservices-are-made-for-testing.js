import fastify from 'fastify'
import retry from 'p-retry'
import pg from 'pg'
import {sqlRowsToObjects} from './field-mappings.js'

export default async function createApp({databaseConnectionString}) {
  const app = fastify()
  let _

  const databaseClient = await retry(connectToDatabase, {onFailedAttempt: console.error})

  app.get('/', async () => {
    return 'OK'
  })

  app.get('/api/tenants', async () => {
    const {rows} = await databaseClient.query('SELECT id, first_name, last_name FROM tenants')

    return sqlRowsToObjects(rows)
  })

  _ =
    /**@type {typeof app.post<{Params: {id: string}, Body: {firstName: String, lastName: string}}>}*/ (
      app.post
    )('/api/tenants/:id', async (req) => {
      const {id} = req.params
      const {firstName, lastName} = req.body

      await databaseClient.query(`INSERT INTO tenants VALUES ($1, $2, $3)`, [
        id,
        firstName,
        lastName,
      ])

      return {}
    })

  _ =
    /**@type {typeof app.post<{Params: {id: string}, Body: {firstName: String, lastName: string}}>}*/ (
      app.put
    )('/api/tenants/:id', async (req) => {
      const {id} = req.params
      const {firstName, lastName} = req.body

      await databaseClient.query(`UPDATE tenants SET first_name=$2, last_name=$3 WHERE id=$1`, [
        id,
        firstName,
        lastName,
      ])

      return {}
    })

  _ = /**@type {typeof app.post<{Params: {id: string}}>}*/ (app.delete)(
    '/api/tenants/:id',
    async (req) => {
      const {id} = req.params

      await databaseClient.query('DELETE FROM tenants WHERE id=$1', [id])

      return {}
    },
  )

  return app

  async function connectToDatabase() {
    const client = new pg.Client({
      connectionString: databaseConnectionString,
    })
    await client.connect()
    client.on('error', () => 1)

    return client
  }
}

export const databaseSchema = `
  CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY,
    first_name VARCHAR,
    last_name VARCHAR
  )
`
