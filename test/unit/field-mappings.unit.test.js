'use strict'
const {describe, it} = require('mocha')
const {expect} = require('chai')

const {
  objectToSqlRow,
  sqlRowToObject,
  sqlRowsToObjects,
  fieldToProperty,
  propertyToField,
} = require('../../src/field-mappings')

describe('field-mappings (unit)', function() {
  it('should map field name to property name', async () => {
    expect(fieldToProperty('first_name')).to.equal('firstName')
    expect(fieldToProperty('last_name')).to.equal('lastName')
    expect(fieldToProperty('id')).to.equal('id')
  })

  it('should map property name to field name', async () => {
    expect(propertyToField('firstName')).to.equal('first_name')
    expect(propertyToField('lastName')).to.equal('last_name')
    expect(propertyToField('id')).to.equal('id')
  })

  it('should map an SQL row to an object', async () => {
    expect(sqlRowToObject({id: 'a', first_name: 'b', last_name: 'c'})).to.eql({
      id: 'a',
      firstName: 'b',
      lastName: 'c',
    })
  })

  it('should map SQL rows to an object array', async () => {
    expect(
      sqlRowsToObjects([
        {id: 'a', first_name: 'b', last_name: 'c'},
        {id: 'd', first_name: 'e', last_name: 'f'},
      ]),
    ).to.eql([
      {
        id: 'a',
        firstName: 'b',
        lastName: 'c',
      },
      {
        id: 'd',
        firstName: 'e',
        lastName: 'f',
      },
    ])
  })

  it('should map an object to an sql row', async () => {
    expect(objectToSqlRow({id: 'a', firstName: 'b', lastName: 'c'})).to.eql({
      id: 'a',
      first_name: 'b',
      last_name: 'c',
    })
  })
})
