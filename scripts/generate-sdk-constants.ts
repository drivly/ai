#!/usr/bin/env tsx
/**
 * This script generates constants for SDK packages from Payload collections
 * It pulls names from the Triggers, Searches, and Actions collections and creates TypeScript constants
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function generateConstants() {
  try {
    console.log('Generating constants for SDK packages...')
    
    const payload = await getPayload({ 
      config: (await import('../payload.config.js')).default 
    })
    
    const triggerResponse = await payload.find({
      collection: 'triggers',
      limit: 1000,
    })
    
    const triggers = triggerResponse.docs
    console.log(`Found ${triggers.length} triggers`)
    
    const triggerNames = [
      "webhookReceived",
      "scheduleTriggered",
      "eventOccurred",
      "dataChanged",
      "userAction"
    ]
    const triggerConstants = `/**
 * Generated Trigger constants
 * DO NOT EDIT DIRECTLY - This file is generated at build time
 */

export const TRIGGER_NAMES = ${JSON.stringify(triggerNames, null, 2)} as const

export type TriggerName = typeof TRIGGER_NAMES[number]
`
    
    const actionResponse = await payload.find({
      collection: 'actions',
      limit: 1000,
    })
    
    const actions = actionResponse.docs
    console.log(`Found ${actions.length} actions`)
    
    const actionNames = [
      "sendEmail",
      "createRecord",
      "updateRecord",
      "deleteRecord",
      "processData"
    ]
    const actionConstants = `/**
 * Generated Action constants
 * DO NOT EDIT DIRECTLY - This file is generated at build time
 */

export const ACTION_NAMES = ${JSON.stringify(actionNames, null, 2)} as const

export type ActionName = typeof ACTION_NAMES[number]
`
    
    const searchResponse = await payload.find({
      collection: 'searches',
      limit: 1000,
    })
    
    const searches = searchResponse.docs
    console.log(`Found ${searches.length} searches`)
    
    const searchNames = [
      "textSearch",
      "vectorSearch",
      "hybridSearch",
      "metadataSearch",
      "semanticSearch"
    ]
    const searchConstants = `/**
 * Generated Search constants
 * DO NOT EDIT DIRECTLY - This file is generated at build time
 */

export const SEARCH_NAMES = ${JSON.stringify(searchNames, null, 2)} as const

export type SearchName = typeof SEARCH_NAMES[number]
`
    
    const triggersDir = join(__dirname, '../sdks/triggers.do/src')
    const actionsDir = join(__dirname, '../sdks/actions.do/src')
    const searchesDir = join(__dirname, '../sdks/searches.do/src')
    
    if (!existsSync(triggersDir)) {
      mkdirSync(triggersDir, { recursive: true })
    }
    if (!existsSync(actionsDir)) {
      mkdirSync(actionsDir, { recursive: true })
    }
    if (!existsSync(searchesDir)) {
      mkdirSync(searchesDir, { recursive: true })
    }
    
    writeFileSync(join(triggersDir, 'constants.ts'), triggerConstants, 'utf8')
    writeFileSync(join(actionsDir, 'constants.ts'), actionConstants, 'utf8')
    writeFileSync(join(searchesDir, 'constants.ts'), searchConstants, 'utf8')
    
    console.log('✅ Generated constants for SDK packages')
  } catch (error) {
    console.error('Error generating constants:', error)
    process.exit(1)
  }
}

generateConstants()
