import {createRequire} from 'module'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'
import {prepareDatabase, resetDatabase} from '../commons/setup.js'
// import {setupApp} from './setup-app.mjs'
// import httpCommons from '@applitools/http-commons'
import dockerCompose from '@applitools/docker-compose-mocha'

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url))
// @ts-ignore
const require = createRequire(import.meta.url)
const {describe, it, before, after, beforeEach} = require('mocha')
const {expect} = require('chai')
// const {v4: uuid} = require('uuid')

describe('microservices-are-made-for-testing (e2e)', function () {
  const composePath = join(__dirname, 'docker-compose.yml')
  const envName = dockerCompose.dockerComposeTool(before, after, composePath)

  before(() => prepareDatabase(envName, composePath))
  beforeEach(() => resetDatabase(envName, composePath))

  it('should return users after they are added', async () => {
    expect(true).to.be.true  })
})
