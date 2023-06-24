import createApp from '../../src/microservices-are-made-for-testing.js'

/**
 * @param {string} postgresAddress
 */
export async function setupApp(postgresAddress) {
  const connectionString = `postgresql://user:password@${postgresAddress}/postgres`

  const appInstance = await createApp({
    databaseConnectionString: connectionString,
  })

  return {baseUrl: await appInstance.listen()}
}
