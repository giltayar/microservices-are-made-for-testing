import {join, dirname} from 'path'
import {describe, it, before, after, beforeEach} from 'mocha'
import {expect} from 'chai'
import {v4 as uuid} from 'uuid'
import {fetchAsJsonWithJsonBody, fetchAsJson} from '@giltayar/http-commons'
import {runDockerCompose} from '@giltayar/docker-compose-testkit'
import {postgresHealthCheck, setupDatabaseSchema, resetDatabaseTables} from '../commons/setup.js'

const __dirname = dirname(new URL(import.meta.url).pathname)

describe.skip('microservices-are-made-for-testing (e2e)', function () {
  let teardown, findAddress
  before(
    async () =>
      ({teardown, findAddress} = await runDockerCompose(join(__dirname, 'docker-compose.yml'))),
  )
  after(() => teardown())

  before(async () => setupDatabaseSchema(await findAddress('postgres', 5432, postgresHealthCheck)))
  beforeEach(async () =>
    resetDatabaseTables(await findAddress('postgres', 5432, postgresHealthCheck)),
  )

  it('should return users after they are added', async () => {
    const appAddress = await findAddress('app', 80)

    const tenant = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}

    await fetchAsJsonWithJsonBody(`http://${appAddress}/api/tenants/${tenant.id}`, tenant)

    expect(await fetchAsJson(`http://${appAddress}/api/tenants`)).to.eql([tenant])
  })
})
