import { describe, it, expect } from 'vitest'
import { json5Field } from '../../../pkgs/payload-utils/src/fields/json5Field'

describe('json5Field', () => {
  it('returns two fields with default options', () => {
    const fields = json5Field()
    expect(fields).toHaveLength(2)
    expect(fields[0]).toHaveProperty('name', 'json5Data')
    expect(fields[1]).toHaveProperty('name', 'shape')
  })

  it('customizes field names', () => {
    const fields = json5Field({
      jsonFieldName: 'data',
      codeFieldName: 'customJson5',
    })
    expect(fields[0]).toHaveProperty('name', 'customJson5')
    expect(fields[1]).toHaveProperty('name', 'data')
  })

  it('always sets defaultFormat to json5', () => {
    const fields = json5Field()
    expect(fields[0].admin).toHaveProperty('language', 'json')
  })

  it('passes through custom options', () => {
    const fields = json5Field({
      label: 'Custom Label',
      hideJsonField: false,
      editorOptions: {
        lineNumbers: 'on',
        padding: { top: 10, bottom: 10 },
      },
    })
    
    expect(fields[0]).toHaveProperty('label', 'Custom Label')
    expect(fields[0].admin).toHaveProperty('language', 'json')
    expect(fields[1].admin).toHaveProperty('hidden', false)
  })
})
