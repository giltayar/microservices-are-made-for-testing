'use strict'
const {getAddressForService} = require('@applitools/docker-compose-testkit')

const app = require('../..')

async function setupApp(envName, composePath) {
  const postgresAddress = await getAddressForService(envName, composePath, 'postgres', 5432)
  const connectionString = `postgresql://user:password@${postgresAddress}/postgres`

  const appInstance = await app({
    databaseConnectionString: connectionString,
  })

  await appInstance.listen()

  return appInstance
}

module.exports = setupApp
