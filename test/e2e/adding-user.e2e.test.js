import {createRequire} from 'module'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'
import {prepareDatabase, resetDatabase} from '../commons/setup.js'
import httpCommons from '@applitools/http-commons'
import dockerCompose from '@applitools/docker-compose-mocha'
import dct from '@applitools/docker-compose-testkit'

//@ts-ignore
const require = createRequire(import.meta.url)
//@ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url))
const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
const {v4: uuid} = require('uuid')

describe('microservices-are-made-for-testing (e2e)', function () {
  const composePath = join(__dirname, 'docker-compose.yml')
  const envName = dockerCompose.dockerComposeTool(before, after, composePath)

  before(() => prepareDatabase(envName, composePath))
  beforeEach(() => resetDatabase(envName, composePath))

  it('should return users after they are added', async () => {
    const appAddress = await dct.getAddressForService(envName, composePath, 'app', 80)

    const tenant = {id: uuid(), firstName: 'Gil', lastName: 'Tayar'}

    await httpCommons.fetchAsJsonWithJsonBody(
      `http://${appAddress}/api/tenants/${tenant.id}`,
      tenant,
    )

    expect(await httpCommons.fetchAsJson(`http://${appAddress}/api/tenants`)).to.eql([tenant])
  })
})
