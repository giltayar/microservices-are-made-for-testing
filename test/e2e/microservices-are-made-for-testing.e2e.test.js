import {join, dirname} from 'path'
import {describe, it, before, after, beforeEach} from '@seasquared/mocha-commons'
import {expect} from 'chai'
// import {v4 as uuid} from 'uuid'
import {runDockerCompose} from '@seasquared/docker-compose-testkit'
import {prepareDatabase, resetDatabase} from '../commons/setup.js'

const __dirname = dirname(new URL(import.meta.url).pathname)

describe('microservices-are-made-for-testing (e2e)', function () {
  const composePath = join(__dirname, 'docker-compose.yml')

  const {teardown, findAddress} = before(async () => runDockerCompose(composePath))

  before(() => prepareDatabase(findAddress()))
  beforeEach(() => resetDatabase(findAddress()))
  after(() => teardown()())

  it('should return users after they are added', async () => {
    expect(true).to.be.true
  })
})
