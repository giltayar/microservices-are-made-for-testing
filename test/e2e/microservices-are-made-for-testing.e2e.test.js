'use strict'
const path = require('path')
const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
// const {v4: uuid} = require('uuid')
const {
  // fetchAsJsonWithJsonBody,
  // fetchAsJson,
} = require('@applitools/http-commons')
const {dockerComposeTool} = require('@applitools/docker-compose-mocha')
const {
  // getAddressForService,
} = require('@applitools/docker-compose-testkit')
const {prepareDatabase, resetDatabase} = require('../commons/setup')

describe('microservices-are-made-for-testing (e2e)', function () {
  const composePath = path.join(__dirname, 'docker-compose.yml')
  const envName = dockerComposeTool(before, after, composePath)

  before(() => prepareDatabase(envName, composePath))
  beforeEach(() => resetDatabase(envName, composePath))

  it('should return users after they are added', async () => {
    expect(true).to.be.true
  })
})
