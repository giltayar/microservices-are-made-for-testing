'use strict'
const path = require('path')
const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const {v4: uuid} = require('uuid')
const {
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

  it('should delete a user', async () => {
    const tenant1 = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}
    const tenant2 = {id: uuid(), firstName: 'Shai', lastName: 'Reznik'}

    await Promise.all([
      fetchAsJsonWithJsonBody(
        `${baseUrl()}/api/tenants/${tenant1.id}`,
        tenant1,
      ),
      fetchAsJsonWithJsonBody(
        `${baseUrl()}/api/tenants/${tenant2.id}`,
        tenant2,
      ),
    ])

    await fetchAsJson(`${baseUrl()}/api/tenants/${tenant1.id}`, {
      method: 'DELETE',
    })

    expect(await fetchAsJson(`${baseUrl()}/api/tenants`)).to.eql([
      tenant2,
    ])
  })
})
