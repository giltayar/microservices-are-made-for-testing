'use strict'
const snakeCase = require('snake-case')
const camelCase = require('camel-case')
const {mapKeys} = require('@applitools/functional-commons')

function fieldToProperty(field) {
  return camelCase(field)
}

function propertyToField(field) {
  return snakeCase(field)
}

function sqlRowToObject(row) {
  return mapKeys(row, fieldToProperty)
}

function sqlRowsToObjects(rows) {
  return rows.map(sqlRowToObject)
}

function objectToSqlRow(row) {
  return mapKeys(row, propertyToField)
}

module.exports = {
  fieldToProperty,
  propertyToField,
  sqlRowToObject,
  objectToSqlRow,
  sqlRowsToObjects,
}
