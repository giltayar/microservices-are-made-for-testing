import dockerComponse from '@applitools/docker-compose-testkit'

import app from '../../src/microservices-are-made-for-testing.js'

export async function setupApp(envName, composePath) {
  const postgresAddress = await dockerComponse.getAddressForService(
    envName,
    composePath,
    'postgres',
    5432,
  )
  const connectionString = `postgresql://user:password@${postgresAddress}/postgres`

  const appInstance = await app({
    databaseConnectionString: connectionString,
  })

  await appInstance.listen(0)

  return appInstance
}
