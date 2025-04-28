#!/usr/bin/env tsx
/**
 * This script copies payload.types.ts to SDKs/apis.do/types.ts
 * Run this after `pnpm generate:types` to update SDK types
 */

import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const payloadTypesPath = join(__dirname, '../payload.types.ts')
const apisDoTypesPath = join(__dirname, '../sdks/apis.do/types.ts')

const payloadTypesContent = readFileSync(payloadTypesPath, 'utf8')

const cleanedPayloadTypes = payloadTypesContent.replace(/\s*declare module ['"]payload['"] {[\s\S]*?}/, '')

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
writeFileSync(
  apisDoTypesPath, 
  `${header}\n\n${cleanedPayloadTypes}\n\n${utilityTypes}`, 
  'utf8'
)

console.log('✅ Updated apis.do/types.ts with complete types from payload.types.ts')
