'use strict'
const path = require('path')
const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const {fetchAsText, fetchAsJson} = require('@applitools/http-commons')
const {dockerComposeTool} = require('@applitools/docker-compose-mocha')
const {getAddressForService} = require('@applitools/docker-compose-testkit')
const {connect, close, resetTable, createSchema} = require('../commons/postgres-commons')

const app = require('../..')

describe('microservices-were-made-for-testing (it)', function() {
  const composePath = path.join(__dirname, 'docker-compose.yml')
  after(async () => {
    await appInstance.close()
    await close({connection})
  })
  const envName = dockerComposeTool(before, after, composePath, {
    brutallyKill: true,
    shouldPullImages: false,
    envVars: {
      POSTGRES_USER: 'user',
      POSTGRES_PASSWORD: 'password',
    },
  })

  let connection
  let appInstance
  before(async () => {
    const postgresAddress = await getAddressForService(envName, composePath, 'postgres', 5432, {
      customHealthCheck: async address => {
        const connection = await connect({
          connectionString: `postgresql://user:password@${address}/postgres`,
        })
        await close({connection})
        return true
      },
    })
    const connectionString = `postgresql://user:password@${postgresAddress}/postgres`
    connection = await connect({connectionString})

    await createSchema({connection, schema: app.databaseSchema})

    appInstance = await app({databaseConnectionString: connectionString})
    await appInstance.listen()
  })

  const baseUrl = () => `http://localhost:${appInstance.server.address().port}`

  beforeEach(async () => resetTable({connection, table: 'tenants'}))

  it('should return OK on /', async () => {
    const text = await fetchAsText(`${baseUrl()}/`)
    expect(text).to.equal('OK')
  })

  it('return empty array on no users', async () => {
    expect(await fetchAsJson(`${baseUrl()}/api/tenants`)).to.eql([])
  })
})
