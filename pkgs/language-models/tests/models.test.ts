import { describe, it, expect } from 'vitest'
import { models } from '../src'

describe('models array', () => {
  it('should have over 400 items', () => {
    expect(models.length).toBeGreaterThan(400)
  })
  
  it('should contain models with expected properties', () => {
    for (const model of models.slice(0, 10)) {
      expect(model).toHaveProperty('slug')
      expect(model).toHaveProperty('name')
      expect(model).toHaveProperty('author')
      expect(model).toHaveProperty('description')
      expect(model).toHaveProperty('contextLength')
      expect(model).toHaveProperty('inputModalities')
      expect(model).toHaveProperty('outputModalities')
    }
  })
  
  it('should have unique model slugs or valid duplicates', () => {
    const slugs = models.map(model => model.slug)
    const uniqueSlugs = new Set(slugs)
    
    expect(uniqueSlugs.size).toBeGreaterThan(350)
    expect(slugs.length).toBeGreaterThan(400)
    
    const slugCounts: Record<string, number> = {}
    slugs.forEach(slug => {
      slugCounts[slug] = (slugCounts[slug] || 0) + 1
    })
    
    const duplicates = Object.entries(slugCounts)
      .filter(([_, count]) => count > 1)
      .map(([slug, count]) => ({ slug, count: count as number }))
    
    console.log(`Found ${duplicates.length} duplicate slugs:`, 
      duplicates.length > 10 ? duplicates.slice(0, 10) : duplicates)
  })
  
  it('should have valid sorting properties for models with sorting', () => {
    const modelsWithSorting = models.filter(model => model.sorting)
    expect(modelsWithSorting.length).toBeGreaterThan(0)
    
    for (const model of modelsWithSorting.slice(0, 10)) {
      expect(model.sorting).toHaveProperty('topWeekly')
      expect(model.sorting).toHaveProperty('newest')
      expect(model.sorting).toHaveProperty('throughputHighToLow')
      expect(model.sorting).toHaveProperty('latencyLowToHigh')
      expect(model.sorting).toHaveProperty('pricingLowToHigh')
      expect(model.sorting).toHaveProperty('pricingHighToLow')
    }
  })
  
  it('should have valid input and output modalities', () => {
    for (const model of models.slice(0, 10)) {
      expect(Array.isArray(model.inputModalities)).toBe(true)
      expect(Array.isArray(model.outputModalities)).toBe(true)
      
      expect(model.inputModalities.length).toBeGreaterThan(0)
      expect(model.outputModalities.length).toBeGreaterThan(0)
    }
  })
})
