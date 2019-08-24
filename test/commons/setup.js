'use strict'
const {Client} = require('pg')
const {getAddressForService} = require('@applitools/docker-compose-testkit')

const {databaseSchema} = require('../../')

async function prepareDatabase(envName, composePath) {
  const postgresAddress = await getAddressForService(envName, composePath, 'postgres', 5432, {
    customHealthCheck: async address => {
      const client = new Client({
        connectionString: `postgresql://user:password@${address}/postgres`,
      })
      await client.connect()
      await client.end()
      return true
    },
  })
  const connectionString = `postgresql://user:password@${postgresAddress}/postgres`
  const client = new Client({connectionString})
  await client.connect()

  await client.query(databaseSchema)

  await client.end()
}

async function resetDatabase(envName, composePath) {
  const postgresAddress = await getAddressForService(envName, composePath, 'postgres', 5432)

  const connectionString = `postgresql://user:password@${postgresAddress}/postgres`
  const client = new Client({connectionString})
  await client.connect()

  await client.query(`DELETE FROM tenants`)

  await client.end()
}

module.exports = {
  prepareDatabase,
  resetDatabase,
}
