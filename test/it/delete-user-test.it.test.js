import {join, dirname} from 'path'
import {describe, it, before, after, beforeEach} from 'mocha'
import {expect} from 'chai'
import {v4 as uuid} from 'uuid'
import {fetchAsJsonWithJsonBody, fetchAsJson} from '@giltayar/http-commons'
import {runDockerCompose} from '@giltayar/docker-compose-testkit'
import {postgresHealthCheck, setupDatabaseSchema, resetDatabaseTables} from '../commons/setup.js'
import {runApp} from './run-app.js'

const __dirname = dirname(new URL(import.meta.url).pathname)

describe.skip('delete-user (it)', function () {
  const composePath = join(__dirname, 'docker-compose.yml')

  let teardown, findAddress
  before(async () => ({teardown, findAddress} = await runDockerCompose(composePath)))

  before(async () => setupDatabaseSchema(await findAddress('postgres', 5432, postgresHealthCheck)))
  beforeEach(async () =>
    resetDatabaseTables(await findAddress('postgres', 5432, postgresHealthCheck)),
  )

  let baseUrl
  before(
    async () =>
      ({baseUrl} = await runApp(await findAddress('postgres', 5432, postgresHealthCheck))),
  )

  after(() => teardown())

  it('should delete a user', async () => {
    const tenant1 = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}
    const tenant2 = {id: uuid(), firstName: 'Shai', lastName: 'Reznik'}

    await Promise.all([
      fetchAsJsonWithJsonBody(`${baseUrl}/api/tenants/${tenant1.id}`, tenant1),
      fetchAsJsonWithJsonBody(`${baseUrl}/api/tenants/${tenant2.id}`, tenant2),
    ])

    await fetchAsJson(`${baseUrl}/api/tenants/${tenant1.id}`, {
      method: 'DELETE',
    })

    expect(await fetchAsJson(`${baseUrl}/api/tenants`)).to.eql([tenant2])
  })
})
