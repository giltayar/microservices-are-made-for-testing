'use strict'
const path = require('path')
const {describe, it, before, after} = require('mocha')
const {expect} = require('chai')
const {fetchAsText} = require('@applitools/http-commons')
const {dockerComposeTool} = require('@applitools/docker-compose-mocha')
const {
  getAddressForService,
  generateEnvVarsWithDependenciesVersions,
} = require('@applitools/docker-compose-testkit')

describe.skip('microservices-were-made-for-testing e2e', function() {
  const composePath = path.join(__dirname, 'docker-compose.yml')
  const envName = dockerComposeTool(before, after, composePath, {
    shouldPullImages: !!process.env.NODE_ENV && process.env.NODE_ENV !== 'development',
    brutallyKill: true,
    envVars: {
      ...generateEnvVarsWithDependenciesVersions(require('../../package.json')),
    },
  })

  it('should return OK on /', async () => {
    const appAddress = await getAddressForService(envName, composePath, 'app', 80)

    const response = await fetchAsText(`http://${appAddress}/`)

    expect(response).to.equal('OK')
  })
})
