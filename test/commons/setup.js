import dct from '@applitools/docker-compose-testkit'
import pg from 'pg'

import {databaseSchema} from '../../src/microservices-are-made-for-testing.js'

export async function prepareDatabase(envName, composePath) {
  const postgresAddress = await dct.getAddressForService(envName, composePath, 'postgres', 5432, {
    customHealthCheck: async (address) => {
      const client = new pg.Client({
        connectionString: `postgresql://user:password@${address}/postgres`,
      })
      await client.connect()
      await client.end()
      return true
    },
  })
  const connectionString = `postgresql://user:password@${postgresAddress}/postgres`
  const client = new pg.Client({connectionString})
  await client.connect()

  await client.query(databaseSchema)

  await client.end()
}

export async function resetDatabase(envName, composePath) {
  const postgresAddress = await dct.getAddressForService(envName, composePath, 'postgres', 5432)

  const connectionString = `postgresql://user:password@${postgresAddress}/postgres`
  const client = new pg.Client({connectionString})
  await client.connect()

  await client.query(`DELETE FROM tenants`)

  await client.end()
}
