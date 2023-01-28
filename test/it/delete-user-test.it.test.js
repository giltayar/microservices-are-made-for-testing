import {join, dirname} from 'path'
import {describe, it, before, after, beforeEach} from '@seasquared/mocha-commons'
import {expect} from 'chai'
import {v4 as uuid} from 'uuid'
import {fetchAsJsonWithJsonBody, fetchAsJson} from '@seasquared/http-commons'
import {runDockerCompose} from '@seasquared/docker-compose-testkit'
import {prepareDatabase, resetDatabase} from '../commons/setup.js'
import {setupApp} from './setup-app.js'

const __dirname = dirname(new URL(import.meta.url).pathname)

describe('delete-user (it)', function () {
  const composePath = join(__dirname, 'docker-compose.yml')

  const {teardown, findAddress} = before(async () => runDockerCompose(composePath))

  before(() => prepareDatabase(findAddress()))
  beforeEach(() => resetDatabase(findAddress()))

  const {baseUrl} = before(() => setupApp(findAddress()))

  after(() => teardown()())

  it.skip('should delete a user', async () => {
    const tenant1 = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}
    const tenant2 = {id: uuid(), firstName: 'Shai', lastName: 'Reznik'}

    await Promise.all([
      fetchAsJsonWithJsonBody(`${baseUrl()}/api/tenants/${tenant1.id}`, tenant1),
      fetchAsJsonWithJsonBody(`${baseUrl()}/api/tenants/${tenant2.id}`, tenant2),
    ])

    await fetchAsJson(`${baseUrl()}/api/tenants/${tenant1.id}`, {
      method: 'DELETE',
    })

    expect(await fetchAsJson(`${baseUrl()}/api/tenants`)).to.eql([tenant2])
  })
})
