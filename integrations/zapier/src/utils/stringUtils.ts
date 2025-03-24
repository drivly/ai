/**
 * Converts a string to camelCase
 * @param str The string to convert
 * @returns The camelCase string
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^([A-Z])/, (m) => m.toLowerCase());
}

/**
 * Converts a string to PascalCase
 * @param str The string to convert
 * @returns The PascalCase string
 */
export function pascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (m) => m.toUpperCase());
}

/**
 * Converts a string to kebab-case
 * @param str The string to convert
 * @returns The kebab-case string
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Converts a string to Title Case
 * @param str The string to convert
 * @returns The Title Case string
 */
export function titleCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? ' ' + c.toUpperCase() : ' '))
    .trim()
    .replace(/^(.)/, (m) => m.toUpperCase());
}

/**
 * Converts a string to Sentence case
 * @param str The string to convert
 * @returns The Sentence case string
 */
export function sentenceCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? ' ' + c.toLowerCase() : ' '))
    .trim()
    .replace(/^(.)/, (m) => m.toUpperCase());
}