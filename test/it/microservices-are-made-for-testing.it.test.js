import {createRequire} from 'module'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'
import {prepareDatabase, resetDatabase} from '../commons/setup.js'
import {setupApp} from './setup-app.js'
import httpCommons from '@applitools/http-commons'
import dockerCompose from '@applitools/docker-compose-mocha'

//@ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url))
//@ts-ignore
const require = createRequire(import.meta.url)
const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const {v4: uuid} = require('uuid')

describe('microservices-are-made-for-testing (it)', function () {
  const composePath = join(__dirname, 'docker-compose.yml')
  const envName = dockerCompose.dockerComposeTool(before, after, composePath)

  before(() => prepareDatabase(envName, composePath))
  beforeEach(() => resetDatabase(envName, composePath))

  let appInstance
  before(async () => (appInstance = await setupApp(envName, composePath)))

  const baseUrl = () => `http://localhost:${appInstance.server.address().port}`

  it('should return OK on /', async () => {
    const text = await httpCommons.fetchAsText(`${baseUrl()}/`)
    expect(text).to.equal('OK')
  })

  it('should return empty array on no tenants', async () => {
    // fetch tenant list
    const tenantList = await httpCommons.fetchAsJson(`${baseUrl()}/api/tenants`)

    // check that it's empty
    expect(tenantList).to.eql([])
  })

  it('should return tenant after it is added', async () => {
    const tenant = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}

    // Add a tenant
    await httpCommons.fetchAsJsonWithJsonBody(`${baseUrl()}/api/tenants/${tenant.id}`, tenant)

    // Check tenant was added
    const tenantList = await httpCommons.fetchAsJson(`${baseUrl()}/api/tenants`)
    expect(tenantList).to.eql([tenant])
  })

  it('should update a user', async () => {
    const tenant = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}

    // Add a tenant
    await httpCommons.fetchAsJsonWithJsonBody(`${baseUrl()}/api/tenants/${tenant.id}`, tenant)

    // Update its last name
    const updatedTenant = {...tenant, lastName: 'Gayar'}
    await httpCommons.fetchAsJsonWithJsonBody(
      `${baseUrl()}/api/tenants/${updatedTenant.id}`,
      updatedTenant,
      {
        method: 'PUT',
      },
    )

    // Check tenant was updated
    expect(await httpCommons.fetchAsJson(`${baseUrl()}/api/tenants`)).to.eql([updatedTenant])
  })

  it('should delete a user', async () => {
    // Live coding time!
  })
})
