import {join, dirname} from 'path'
import {describe, before, after, beforeEach, it} from 'mocha'
import {expect} from 'chai'
import {v4 as uuid} from 'uuid'
import {fetchAsJsonWithJsonBody, fetchAsJson, fetchAsText} from '@giltayar/http-commons'
import {runDockerCompose} from '@giltayar/docker-compose-testkit'
import {postgresHealthCheck, setupDatabaseSchema, resetDatabaseTables} from '../commons/setup.js'
import {runApp} from './run-app.js'

const __dirname = dirname(new URL(import.meta.url).pathname)

describe('microservices-are-made-for-testing (it)', function () {
  let teardown, findAddress
  before(
    async () =>
      ({teardown, findAddress} = await runDockerCompose(join(__dirname, 'docker-compose.yml'))),
  )
  after(() => teardown())

  let baseUrl
  before(
    async () =>
      ({baseUrl} = await runApp(await findAddress('postgres', 5432, postgresHealthCheck))),
  )

  before(async () => setupDatabaseSchema(await findAddress('postgres', 5432, postgresHealthCheck)))
  beforeEach(async () =>
    resetDatabaseTables(await findAddress('postgres', 5432, postgresHealthCheck)),
  )

  it('should return OK on /', async () => {
    const text = await fetchAsText(`${baseUrl}/`)
    expect(text).to.equal('OK')
  })

  it('should return empty array on no tenants', async () => {
    // fetch tenant list
    const tenantList = await fetchAsJson(`${baseUrl}/api/tenants`)

    // check that it's empty
    expect(tenantList).to.eql([])
  })

  it('should return tenant after it is added', async () => {
    const tenant = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}

    // Add a tenant
    await fetchAsJsonWithJsonBody(`${baseUrl}/api/tenants/${tenant.id}`, tenant)

    // Check tenant was added
    const tenantList = await fetchAsJson(`${baseUrl}/api/tenants`)
    expect(tenantList).to.eql([tenant])
  })

  it('should update a user', async () => {
    const tenant = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}

    // Add a tenant
    await fetchAsJsonWithJsonBody(`${baseUrl}/api/tenants/${tenant.id}`, tenant)

    // Update its last name
    const updatedTenant = {...tenant, lastName: 'Gayar'}
    await fetchAsJsonWithJsonBody(`${baseUrl}/api/tenants/${updatedTenant.id}`, updatedTenant, {
      method: 'PUT',
    })

    // Check tenant was updated
    expect(await fetchAsJson(`${baseUrl}/api/tenants`)).to.eql([updatedTenant])
  })

  it('should delete a user', async () => {
    // Live coding time!
  })
})
