'use strict'
const path = require('path')
const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const {v4: uuid} = require('uuid')
const {fetchAsText, fetchAsJson, fetchAsJsonWithJsonBody} = require('@applitools/http-commons')
const {dockerComposeTool} = require('@applitools/docker-compose-mocha')
const {prepareDatabase, resetDatabase} = require('../commons/setup')
const setupApp = require('./setup-app')

describe('microservices-are-made-for-testing (it)', function () {
  const composePath = path.join(__dirname, 'docker-compose.yml')
  const envName = dockerComposeTool(before, after, composePath)

  before(() => prepareDatabase(envName, composePath))
  beforeEach(() => resetDatabase(envName, composePath))

  let appInstance
  before(async () => (appInstance = await setupApp(envName, composePath)))

  const baseUrl = () => `http://localhost:${appInstance.server.address().port}`

  it('should return OK on /', async () => {
    const text = await fetchAsText(`${baseUrl()}/`)
    expect(text).to.equal('OK')
  })

  it('should return empty array on no tenants', async () => {
    // fetch tenant list
    const tenantList = await fetchAsJson(`${baseUrl()}/api/tenants`)

    // check that it's empty
    expect(tenantList).to.eql([])
  })

  it('should return tenant after it is added', async () => {
    const tenant = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}

    // Add a tenant
    await fetchAsJsonWithJsonBody(`${baseUrl()}/api/tenants/${tenant.id}`, tenant)

    // Check tenant was added
    const tenantList = await fetchAsJson(`${baseUrl()}/api/tenants`)
    expect(tenantList).to.eql([tenant])
  })

  it('should update a user', async () => {
    const tenant = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}

    // Add a tenant
    await fetchAsJsonWithJsonBody(`${baseUrl()}/api/tenants/${tenant.id}`, tenant)

    // Update its last name
    const updatedTenant = {...tenant, lastName: 'Gayar'}
    await fetchAsJsonWithJsonBody(`${baseUrl()}/api/tenants/${tenant.id}`, updatedTenant, {
      method: 'PUT',
    })

    // Check tenant was updated
    expect(await fetchAsJson(`${baseUrl()}/api/tenants`)).to.eql([updatedTenant])
  })

  it('should delete a user', async () => {
    // Live coding time!
  })
})
