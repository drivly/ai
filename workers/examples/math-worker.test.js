import { describe, it, expect } from 'vitest'
import { add, multiply, circleArea, PI, E, VERSION } from './math-worker'

describe('Math Worker', () => {
  describe('Constants', () => {
    it('should export PI constant', () => {
      expect(PI).toBe(3.14159)
    })
    
    it('should export E constant', () => {
      expect(E).toBe(2.71828)
    })
    
    it('should export VERSION constant', () => {
      expect(VERSION).toBe('1.0.0')
    })
  })
  
  describe('add function', () => {
    it('should add two positive numbers', () => {
      const result = add({ a: 2, b: 3 })
      expect(result).toBe(5)
    })
    
    it('should add a positive and negative number', () => {
      const result = add({ a: 5, b: -2 })
      expect(result).toBe(3)
    })
    
    it('should add two negative numbers', () => {
      const result = add({ a: -3, b: -4 })
      expect(result).toBe(-7)
    })
  })
  
  describe('multiply function', () => {
    it('should multiply two positive numbers', () => {
      const result = multiply({ a: 2, b: 3 })
      expect(result).toBe(6)
    })
    
    it('should multiply a positive and negative number', () => {
      const result = multiply({ a: 5, b: -2 })
      expect(result).toBe(-10)
    })
    
    it('should multiply two negative numbers', () => {
      const result = multiply({ a: -3, b: -4 })
      expect(result).toBe(12)
    })
  })
  
  describe('circleArea function', () => {
    it('should calculate the area of a circle with radius 1', () => {
      const result = circleArea({ radius: 1 })
      expect(result).toBe(3.14159)
    })
    
    it('should calculate the area of a circle with radius 2', () => {
      const result = circleArea({ radius: 2 })
      expect(result).toBe(12.56636)
    })
  })
})
