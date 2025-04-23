import { describe, it, expect } from 'vitest'
import { simplerJSON } from 'payload-utils'

describe('simplerJSON', () => {
  it('returns two fields with default options', () => {
    const fields = simplerJSON()
    expect(fields).toHaveLength(2)
    expect(fields[0]).toHaveProperty('name', 'schemaYaml')
    expect(fields[1]).toHaveProperty('name', 'shape')
  })

  it('customizes field names', () => {
    const fields = simplerJSON({
      jsonFieldName: 'data',
      codeFieldName: 'yaml',
    })
    expect(fields[0]).toHaveProperty('name', 'yaml')
    expect(fields[1]).toHaveProperty('name', 'data')
  })

  it('configures language based on defaultFormat', () => {
    const yamlFields = simplerJSON({ defaultFormat: 'yaml' })
    const jsonFields = simplerJSON({ defaultFormat: 'json5' })

    expect(yamlFields[0].admin).toHaveProperty('language', 'yaml')
    expect(jsonFields[0].admin).toHaveProperty('language', 'json')
  })
})
