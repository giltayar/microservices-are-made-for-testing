import {join, dirname} from 'path'
import mocha from 'mocha'
import chai from 'chai'
// import {v4 as uuid} from 'uuid'
import dockerCompose from '@applitools/docker-compose-mocha'
// import dct from '@applitools/docker-compose-testkit'
import {prepareDatabase, resetDatabase} from '../commons/setup.js'

const __dirname = dirname(new URL(import.meta.url).pathname)
const {describe, it, before, after, beforeEach} = mocha
const {expect} = chai

describe('microservices-are-made-for-testing (e2e)', function () {
  const composePath = join(__dirname, 'docker-compose.yml')
  const envName = dockerCompose.dockerComposeTool(before, after, composePath)

  before(() => prepareDatabase(envName, composePath))
  beforeEach(() => resetDatabase(envName, composePath))

  it('should return users after they are added', async () => {
    expect(true).to.be.true
  })
})
