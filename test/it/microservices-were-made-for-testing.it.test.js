'use strict'
const path = require('path')
const {
  describe = global.describe,
  it = global.it,
  before = global.before,
  after = global.after,
} = require('mocha')
const {expect} = require('chai')
const {fetchAsText} = require('@applitools/http-commons')
const {dockerComposeTool} = require('@applitools/docker-compose-mocha')
const {getAddressForService} = require('@applitools/docker-compose-testkit')

const app = require('../..')

describe('microservices-were-made-for-testing it', function() {
  const composePath = path.join(__dirname, 'docker-compose.yml')
  const envName = dockerComposeTool(before, after, composePath, {
    brutallyKill: true,
  })

  const {baseUrl} = setupApp()

  it('should return OK on /', async () => {
    const text = await fetchAsText(`${baseUrl()}/`)
    expect(text).to.equal('OK')
  })

  it('should do something interesting...', async () => {
    // You can remove these two lines later
    const someService =
      false && (await getAddressForService(envName, composePath, 'some-service', 80))
    expect(someService).to.be.false
  })
})

function setupApp() {
  let server, appInst

  before(async () => {
    appInst = await app()
    await appInst.listen()
    await appInst.ready()
    server = appInst.server
  })
  after(done => appInst.close(done))

  return {
    baseUrl: () => `http://localhost:${server.address().port}`,
    address: () => `localhost:${server.address().port}`,
  }
}
