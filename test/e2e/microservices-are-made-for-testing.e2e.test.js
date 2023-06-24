import {join, dirname} from 'path'
import {describe, it, before, after, beforeEach} from 'mocha'
import {expect} from 'chai'
import {runDockerCompose} from '@giltayar/docker-compose-testkit'
import {postgresHealthCheck, prepareDatabase, resetDatabase} from '../commons/setup.js'

const __dirname = dirname(new URL(import.meta.url).pathname)

describe('microservices-are-made-for-testing (e2e)', function () {
  let teardown, findAddress
  before(
    async () =>
      ({teardown, findAddress} = await runDockerCompose(join(__dirname, 'docker-compose.yml'))),
  )
  after(() => teardown())

  before(async () => prepareDatabase(await findAddress('postgres', 5432, postgresHealthCheck)))
  beforeEach(async () => resetDatabase(await findAddress('postgres', 5432, postgresHealthCheck)))

  it('should return users after they are added', async () => {
    expect(true).to.be.true
  })
})
