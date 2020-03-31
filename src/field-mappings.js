import fc from '@applitools/functional-commons'
import cc from 'camel-case'

export function fieldToProperty(field) {
  return cc.camelCase(field)
}

export function sqlRowToObject(row) {
  return fc.mapKeys(row, fieldToProperty)
}

export function sqlRowsToObjects(rows) {
  return rows.map(sqlRowToObject)
}
