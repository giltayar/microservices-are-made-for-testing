import {join, dirname} from 'path'
import mocha from 'mocha'
import chai from 'chai'
import {v4 as uuid} from 'uuid'
import {prepareDatabase, resetDatabase} from '../commons/setup.js'
import httpCommons from '@applitools/http-commons'
import dockerCompose from '@applitools/docker-compose-mocha'
import dct from '@applitools/docker-compose-testkit'

const __dirname = dirname(new URL(import.meta.url).pathname)
const {describe, it, before, after, beforeEach} = mocha
const {expect} = chai

describe('microservices-are-made-for-testing (e2e)', function () {
  const composePath = join(__dirname, 'docker-compose.yml')
  const envName = dockerCompose.dockerComposeTool(before, after, composePath)

  before(() => prepareDatabase(envName, composePath))
  beforeEach(() => resetDatabase(envName, composePath))

  it.skip('should return users after they are added', async () => {
    const appAddress = await dct.getAddressForService(envName, composePath, 'app', 80)

    const tenant = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}

    await httpCommons.fetchAsJsonWithJsonBody(
      `http://${appAddress}/api/tenants/${tenant.id}`,
      tenant,
    )

    expect(await httpCommons.fetchAsJson(`http://${appAddress}/api/tenants`)).to.eql([tenant])
  })
})
