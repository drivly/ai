#!/usr/bin/env tsx
/**
 * This script copies payload.types.ts to SDKs/apis.do/types.ts
 * Run this after `pnpm generate:types` to update SDK types
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const payloadTypesPath = join(__dirname, '../payload.types.ts')
const apisDoTypesPath = join(__dirname, '../sdks/apis.do/types.ts')
const collectionsUtilPath = join(__dirname, '../sdks/apis.do/src/utils/collections.ts')

const payloadTypesContent = readFileSync(payloadTypesPath, 'utf8')

const moduleDeclarationIndex = payloadTypesContent.indexOf("declare module 'payload'")
let cleanedPayloadTypes = payloadTypesContent

if (moduleDeclarationIndex !== -1) {
  cleanedPayloadTypes = payloadTypesContent.substring(0, moduleDeclarationIndex)
}

// Read the existing SDK types file
const sdkTypesContent = readFileSync(apisDoTypesPath, 'utf8')

// Extract utility types not present in payload.types.ts
const utilityTypesRegex = /\/\*\*\s*\n\s*\*\s*Workflow step configuration[\s\S]*$/
const utilityTypes = sdkTypesContent.match(utilityTypesRegex)?.[0] || ''

const header = `/**
 * Type definitions for apis.do SDK
 * 
 * These types are copied from Payload CMS collection types.
 */`

// Combine and write to SDK types file
writeFileSync(apisDoTypesPath, `${header}\n\n${cleanedPayloadTypes}\n\n${utilityTypes}`, 'utf8')

// Extract collection names from Config.collections interface
const collectionsMatch = cleanedPayloadTypes.match(/export interface Config {[\s\S]*?collections: {([\s\S]*?)}/m)
const collectionsContent = collectionsMatch ? collectionsMatch[1] : ''

const collectionRegex = /\s+(\w+(?:-\w+)*): /g
const collections = []
let match
while ((match = collectionRegex.exec(collectionsContent)) !== null) {
  collections.push(match[1])
}

const utilsDir = dirname(collectionsUtilPath)
if (!existsSync(utilsDir)) {
  mkdirSync(utilsDir, { recursive: true })
}

const collectionsUtilContent = `/**
 * Generated collection utilities for apis.do SDK
 * DO NOT MODIFY THIS FILE DIRECTLY
 * Run \`pnpm generate:types\` to regenerate
 */

export const COLLECTIONS = [
  ${collections.map(c => `'${c}'`).join(',\n  ')}
] as const;

export type Collection = typeof COLLECTIONS[number];

/**
 * Checks if a string is a valid collection name
 */
export function isCollection(name: string): name is Collection {
  return COLLECTIONS.includes(name as Collection);
}
`

writeFileSync(collectionsUtilPath, collectionsUtilContent, 'utf8')

console.log('✅ Updated apis.do/types.ts with complete types from payload.types.ts')
console.log('✅ Generated collections utility with isCollection function')
