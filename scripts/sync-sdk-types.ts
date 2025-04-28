#!/usr/bin/env tsx
/**
 * This script syncs types from payload.types.ts to SDKs
 * Run this after `pnpm generate:types` to update SDK types
 *
 * Note: Due to module augmentation issues, we manually define types
 * instead of importing directly from payload.types.ts
 */

import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Project } from 'ts-morph'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const payloadTypesPath = join(__dirname, '../payload.types.ts')
const apisDoTypesPath = join(__dirname, '../sdks/apis.do/types.ts')

const payloadTypesContent = readFileSync(payloadTypesPath, 'utf8')
const sdkTypesContent = readFileSync(apisDoTypesPath, 'utf8')

const project = new Project({ useInMemoryFileSystem: true })
const sourceFile = project.createSourceFile('temp.ts', payloadTypesContent)

// List of interfaces to extract from payload.types.ts
const interfacesToExtract = [
  'Function',
  'Workflow',
  'Agent',
  'Thing',
  'Noun',
  'Verb',
  'Trigger',
  'Search',
  'Action',
  'Generation',
  'Event',
  'Trace',
  'Integration',
  'IntegrationTrigger',
  'IntegrationAction'
]

// Function to extract and simplify interfaces from payload.types.ts
const extractInterfaces = () => {
  let interfaces = ''
  
  const allInterfaces = sourceFile.getInterfaces()
  
  for (const interfaceName of interfacesToExtract) {
    const interfaceDeclaration = allInterfaces.find(i => i.getName() === interfaceName)
    
    if (interfaceDeclaration) {
      const docs = interfaceDeclaration.getJsDocs().map(doc => doc.getText()).join('\n')
      
      if (docs) {
        interfaces += `${docs}\n`
      } else {
        interfaces += `/**\n * ${interfaceName} definition\n */\n`
      }
      
      interfaces += `export interface ${interfaceName} {\n`
      
      const properties = interfaceDeclaration.getProperties()
      for (const prop of properties) {
        if (prop.getName() === 'tenant') continue
        
        const propDocs = prop.getJsDocs().map(doc => doc.getText()).join('\n')
        if (propDocs) {
          interfaces += `${propDocs}\n`
        }
        
        let propText = prop.getText()
        
        propText = propText.replace(/string \| ([A-Z][A-Za-z]+)/g, 'string')
        
        propText = propText.replace(/\(string \| null\) \| ([A-Za-z]+)/g, 'string')
        
        propText = propText.replace(/\(string \| ([A-Z][A-Za-z]+)\)\[\]/g, 'string[]')
        
        interfaces += `  ${propText}\n`
      }
      
      interfaces += '}\n\n'
    }
  }
  
  return interfaces
}

// Handle special case for WorkflowStep which doesn't exist in payload.types.ts
// Extract it from the current SDK types file
const extractWorkflowStep = () => {
  const workflowStepRegex = /\/\*\*\s*\n\s*\*\s*Workflow step configuration[\s\S]*?export interface WorkflowStep[\s\S]*?}\s*\n\s*\n/
  const workflowStep = sdkTypesContent.match(workflowStepRegex)?.[0] || ''
  return workflowStep
}

// Extract utility types from the SDK file (these are not in payload.types.ts)
const utilityTypesRegex = /export interface ErrorResponse[\s\S]*$/
const utilityTypes = sdkTypesContent.match(utilityTypesRegex)?.[0] || ''

// Extract the interfaces from payload.types.ts
const extractedInterfaces = extractInterfaces()
const workflowStep = extractWorkflowStep()

const header = `/**
 * Type definitions for apis.do SDK
 * 
 * These types are compatible with the Payload CMS collection types
 * but defined here to avoid module resolution issues.
 */`

writeFileSync(
  apisDoTypesPath, 
  `${header}\n\n${extractedInterfaces}${workflowStep}${utilityTypes}`, 
  'utf8'
)

console.log('✅ Updated apis.do/types.ts with latest types from payload.types.ts')
