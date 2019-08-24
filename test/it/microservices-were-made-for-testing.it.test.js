'use strict'
const path = require('path')
const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const {v4: uuid} = require('uuid')
const {
  fetchAsText,
  fetchAsJson,
  fetchAsJsonWithJsonBody,
} = require('@applitools/http-commons')
const {dockerComposeTool} = require('@applitools/docker-compose-mocha')
const {prepareDatabase, resetDatabase} = require('../commons/setup')
const setupApp = require('./setup-app')

describe('microservices-were-made-for-testing (it)', function() {
  const composePath = path.join(__dirname, 'docker-compose.yml')
  const envName = dockerComposeTool(before, after, composePath)

  before(() => prepareDatabase(envName, composePath))
  beforeEach(() => resetDatabase(envName, composePath))

  let appInstance
  before(
    async () => (appInstance = await setupApp(envName, composePath)),
  )

  const baseUrl = () =>
    `http://localhost:${appInstance.server.address().port}`

  it('should return OK on /', async () => {
    const text = await fetchAsText(`${baseUrl()}/`)
    expect(text).to.equal('OK')
  })

  it('should return empty array on no users', async () => {
    expect(await fetchAsJson(`${baseUrl()}/api/tenants`)).to.eql([])
  })

  it('should return users after they were added', async () => {
    const tenant = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}

    await fetchAsJsonWithJsonBody(
      `${baseUrl()}/api/tenants/${tenant.id}`,
      tenant,
    )

    expect(await fetchAsJson(`${baseUrl()}/api/tenants`)).to.eql([
      tenant,
    ])
  })

  it('should update a user', async () => {
    const tenant = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}

    await fetchAsJsonWithJsonBody(
      `${baseUrl()}/api/tenants/${tenant.id}`,
      tenant,
    )

    const updatedTenant = {...tenant, lastName: 'Gayar'}

    await fetchAsJsonWithJsonBody(
      `${baseUrl()}/api/tenants/${tenant.id}`,
      updatedTenant,
      {method: 'PUT'},
    )

    expect(await fetchAsJson(`${baseUrl()}/api/tenants`)).to.eql([
      updatedTenant,
    ])
  })

  it('should delete a user', async () => {
    //
  })
})
