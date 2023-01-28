import createApp from '../../src/microservices-are-made-for-testing.js'

/**
 * @param {{ (serviceName: string, port?: number | undefined, options?: { serviceIndex?: number | undefined; healthCheck?: ((address: string) => Promise<void>) | undefined; } | undefined): Promise<string>; (arg0: string, arg1: number): any; }} findAddress
 */
export async function setupApp(findAddress) {
  const postgresAddress = await findAddress('postgres', 5432)
  const connectionString = `postgresql://user:password@${postgresAddress}/postgres`

  const appInstance = await createApp({
    databaseConnectionString: connectionString,
  })

  return {baseUrl: await appInstance.listen()}
}
