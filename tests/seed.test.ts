import { describe, it, expect, vi } from 'vitest'

// Sample Schema.org data for testing
const mockSchemaData = {
  '@graph': [
    {
      '@type': 'rdfs:Class',
      '@id': 'schema:Person',
      'rdfs:subClassOf': {
        '@id': 'schema:Thing',
      },
    },
    {
      '@type': 'rdfs:Class',
      '@id': 'schema:Organization',
      'rdfs:subClassOf': {
        '@id': 'schema:Thing',
      },
    },
    {
      '@type': 'rdfs:Class',
      '@id': 'schema:BuyAction',
      'rdfs:subClassOf': {
        '@id': 'schema:Thing',
      },
    },
    {
      '@type': 'rdfs:Class',
      '@id': 'schema:SellAction',
      'rdfs:subClassOf': {
        '@id': 'schema:Thing',
      },
    },
  ],
}

describe('Seed Script', () => {
  it('should extract nouns and verbs correctly from Schema.org data', async () => {
    // Import the extraction function
    const { extractNounsAndVerbs } = await import('../scripts/seedDatabase')

    // Test the extraction function
    const { nouns, verbs } = extractNounsAndVerbs(mockSchemaData)

    // Verify nouns
    expect(nouns).toContain('Person')
    expect(nouns).toContain('Organization')

    // Verify verbs
    const verbActions = verbs.map((v) => v.action)
    expect(verbActions).toContain('Buy')
    expect(verbActions).toContain('Sell')
  })
})
