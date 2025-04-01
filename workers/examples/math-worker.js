/**
 * A simple math worker with exported functions and constants
 */

export const PI = 3.14159
export const E = 2.71828
export const VERSION = '1.0.0'

/**
 * Adds two numbers
 * @param {Object} params - The parameters
 * @param {number} params.a - First number
 * @param {number} params.b - Second number
 * @returns {number} The sum of a and b
 */
export function add(params) {
  const { a, b } = params
  return a + b
}

/**
 * Multiplies two numbers
 * @param {Object} params - The parameters
 * @param {number} params.a - First number
 * @param {number} params.b - Second number
 * @returns {number} The product of a and b
 */
export function multiply(params) {
  const { a, b } = params
  return a * b
}

/**
 * Calculates the area of a circle
 * @param {Object} params - The parameters
 * @param {number} params.radius - The radius of the circle
 * @returns {number} The area of the circle
 */
export function circleArea(params) {
  const { radius } = params
  return PI * radius * radius
}

export default {
  fetch: (request, env, ctx) => {
    return new Response('Math Worker')
  }
}
