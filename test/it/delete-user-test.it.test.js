import {createRequire} from 'module'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'
import {prepareDatabase, resetDatabase} from '../commons/setup.js'
import {setupApp} from './setup-app.js'
import httpCommons from '@applitools/http-commons'
import dockerCompose from '@applitools/docker-compose-mocha'

const require = createRequire(import.meta.url)
const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const {v4: uuid} = require('uuid')

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('delete-user (it)', function () {
  const composePath = join(__dirname, 'docker-compose.yml')
  const envName = dockerCompose.dockerComposeTool(before, after, composePath)

  before(() => prepareDatabase(envName, composePath))
  beforeEach(() => resetDatabase(envName, composePath))

  let appInstance
  before(async () => (appInstance = await setupApp(envName, composePath)))

  const baseUrl = () => `http://localhost:${appInstance.server.address().port}`

  it('should delete a user', async () => {
    const tenant1 = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}
    const tenant2 = {id: uuid(), firstName: 'Shai', lastName: 'Reznik'}

    await Promise.all([
      httpCommons.fetchAsJsonWithJsonBody(`${baseUrl()}/api/tenants/${tenant1.id}`, tenant1),
      httpCommons.fetchAsJsonWithJsonBody(`${baseUrl()}/api/tenants/${tenant2.id}`, tenant2),
    ])

    await httpCommons.fetchAsJson(`${baseUrl()}/api/tenants/${tenant1.id}`, {
      method: 'DELETE',
    })

    expect(await httpCommons.fetchAsJson(`${baseUrl()}/api/tenants`)).to.eql([tenant2])
  })
})
