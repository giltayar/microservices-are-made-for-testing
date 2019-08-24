'use strict'
const path = require('path')
const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const {v4: uuid} = require('uuid')
const {fetchAsJsonWithJsonBody, fetchAsJson} = require('@applitools/http-commons')
const {dockerComposeTool} = require('@applitools/docker-compose-mocha')
const {getAddressForService} = require('@applitools/docker-compose-testkit')
const {connect, close, resetTable, createSchema} = require('../commons/postgres-commons')

describe('microservices-were-made-for-testing (e2e)', function() {
  const composePath = path.join(__dirname, 'docker-compose.yml')
  const envName = dockerComposeTool(before, after, composePath, {containerCleanUp: false})

  const {databaseSchema} = require('../..')

  let connection
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

    await createSchema({connection, schema: databaseSchema})
  })
  beforeEach(async () => resetTable({connection, table: 'tenants'}))

  it('should return users after they were added', async () => {
    const appAddress = await getAddressForService(envName, composePath, 'app', 80)

    const tenant = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}

    await fetchAsJsonWithJsonBody(`http://${appAddress}/api/tenants/${tenant.id}`, tenant)

    expect(await fetchAsJson(`http://${appAddress}/api/tenants`)).to.eql([tenant])
  })
})
