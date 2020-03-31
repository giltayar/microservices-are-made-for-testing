'use strict'
const {camelCase} = require('camel-case')
const {mapKeys} = require('@applitools/functional-commons')

function fieldToProperty(field) {
  return camelCase(field)
}

function sqlRowToObject(row) {
  return mapKeys(row, fieldToProperty)
}

function sqlRowsToObjects(rows) {
  return rows.map(sqlRowToObject)
}

module.exports = {
  fieldToProperty,
  sqlRowToObject,
  sqlRowsToObjects,
}
