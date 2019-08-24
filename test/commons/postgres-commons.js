'use strict'
const {Client} = require('pg')

async function connect({connectionString}) {
  const client = new Client({connectionString})
  await client.connect()

  return {client}
}

async function close({connection}) {
  const {client} = connection

  await client.end()

  connection.client = undefined
}

async function createSchema({connection, schema}) {
  const {client} = connection

  await client.query(`${schema};`)
}

async function resetTable({connection, table}) {
  const {client} = connection

  await client.query(`DELETE FROM ${table}`)
}

module.exports = {
  connect,
  close,
  createSchema,
  resetTable,
}
