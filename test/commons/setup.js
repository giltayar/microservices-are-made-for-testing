import pg from 'pg'

import {databaseSchema} from '../../src/microservices-are-made-for-testing.js'
/**
 * @param {string} postgresAddress
 */
export async function prepareDatabase(postgresAddress) {
  const connectionString = `postgresql://user:password@${postgresAddress}/postgres`
  const client = new pg.Client({connectionString})
  await client.connect()

  await client.query(databaseSchema)

  await client.end()
}

/**
 * @param {string} postgresAddress
 */
export async function resetDatabase(postgresAddress) {
  const connectionString = `postgresql://user:password@${postgresAddress}/postgres`
  const client = new pg.Client({connectionString})
  await client.connect()

  await client.query(`DELETE FROM tenants`)

  await client.end()
}

export const postgresHealthCheck = {
  healthCheck: async (address) => {
    const client = new pg.Client({
      connectionString: `postgresql://user:password@${address}/postgres`,
    })
    await client.connect()
    await client.end()
  },
}
