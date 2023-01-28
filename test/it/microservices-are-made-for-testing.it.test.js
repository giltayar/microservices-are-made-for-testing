import {join, dirname} from 'path'
import {describe, it, before, after, beforeEach} from '@seasquared/mocha-commons'
import {expect} from 'chai'
import {v4 as uuid} from 'uuid'
import {fetchAsJsonWithJsonBody, fetchAsJson, fetchAsText} from '@seasquared/http-commons'
import {runDockerCompose} from '@seasquared/docker-compose-testkit'
import {prepareDatabase, resetDatabase} from '../commons/setup.js'
import {setupApp} from './setup-app.js'

const __dirname = dirname(new URL(import.meta.url).pathname)

describe('microservices-are-made-for-testing (it)', function () {
  const composePath = join(__dirname, 'docker-compose.yml')

  const {teardown, findAddress} = before(async () => runDockerCompose(composePath))

  before(() => prepareDatabase(findAddress()))
  beforeEach(() => resetDatabase(findAddress()))

  const {baseUrl} = before(() => setupApp(findAddress()))

  after(() => teardown()())

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
    await fetchAsJsonWithJsonBody(`${baseUrl()}/api/tenants/${updatedTenant.id}`, updatedTenant, {
      method: 'PUT',
    })

    // Check tenant was updated
    expect(await fetchAsJson(`${baseUrl()}/api/tenants`)).to.eql([updatedTenant])
  })

  it('should delete a user', async () => {
    // Live coding time!
  })
})
