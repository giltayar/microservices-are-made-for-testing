import * as fc from '@giltayar/functional-commons'
import cc from 'camel-case'

/**
 *
 * @param {string} field
 * @returns
 */
export function fieldToProperty(field) {
  return cc.camelCase(field)
}

/**
 * @param {Record<string, any>} row
 * @returns
 */
export function sqlRowToObject(row) {
  return fc.mapKeys(row, fieldToProperty)
}

/**
 * @param {Record<string, any>[]} rows
 * @returns
 */
export function sqlRowsToObjects(rows) {
  return rows.map(sqlRowToObject)
}
