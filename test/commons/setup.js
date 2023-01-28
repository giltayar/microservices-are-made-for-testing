import pg from 'pg'

import {databaseSchema} from '../../src/microservices-are-made-for-testing.js'
/**
 * @param {{ (serviceName: string, port?: number | undefined, options?: { serviceIndex?: number | undefined; healthCheck?: ((address: string) => Promise<void>) | undefined; } | undefined): Promise<string>; (arg0: string, arg1: number): any; }} findAddress
 */
export async function prepareDatabase(findAddress) {
  const postgresAddress = await findAddress('postgres', 5432, {
    healthCheck: async (address) => {
      const client = new pg.Client({
        connectionString: `postgresql://user:password@${address}/postgres`,
      })
      await client.connect()
      await client.end()
    },
  })
  const connectionString = `postgresql://user:password@${postgresAddress}/postgres`
  const client = new pg.Client({connectionString})
  await client.connect()

  await client.query(databaseSchema)

  await client.end()
}

/**
 * @param {{ (serviceName: string, port?: number | undefined, options?: { serviceIndex?: number | undefined; healthCheck?: ((address: string) => Promise<void>) | undefined; } | undefined): Promise<string>; (arg0: string, arg1: number): any; }} findAddress
 */
export async function resetDatabase(findAddress) {
  const postgresAddress = await findAddress('postgres', 5432)

  const connectionString = `postgresql://user:password@${postgresAddress}/postgres`
  const client = new pg.Client({connectionString})
  await client.connect()

  await client.query(`DELETE FROM tenants`)

  await client.end()
}
