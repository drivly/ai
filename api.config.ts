import { NextRequest, NextResponse } from 'next/server'
import punycode from 'punycode'
import { PayloadDB, createNodePayloadClient, createEdgePayloadClient } from '@/pkgs/simple-payload'
import { API as ClickableAPI, modifyQueryString as clickableModifyQueryString } from '@/pkgs/clickable-apis'

export const getPayloadClient = async () => {
  if (typeof window === 'undefined') {
    try {
      const { getPayload } = await import('payload')
      const config = await import('@payload-config')
      const payload = await getPayload({ 
        config: config.default 
      })
      
      const db = createNodePayloadClient(payload)
      
      return { payload, db }
    } catch (error) {
      console.error('Error initializing payload client:', error)
      throw error
    }
  } else {
    console.warn('Payload client not available in browser environment')
    return { 
      payload: null, 
      db: createEdgePayloadClient({
        apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
      }) 
    }
  }
}

export const apis: Record<string, string> = {
  functions: 'Reliable Structured Output',
  workflows: '',
  database: '',
  agents: '',
  nouns: '',
  verbs: '',
  things: '',
  triggers: '',
  searches: '',
  actions: '',
  llm: '',
  evals: '',
  analytics: '',
  experiments: '',
  integrations: '',
  models: ' ',
}

export const related: Record<string, string[]> = {
  functions: ['nouns', 'verbs', 'things'],
  workflows: ['triggers', 'searches', 'actions'],
  database: ['evals', 'analytics', 'experiments'],
  agents: ['integrations', 'models'],
  llm: ['evals', 'analytics', 'experiments'],
}

export const symbols: Record<string, string> = {
  入: 'functions',
  巛: 'workflows',
  彡: 'database',
  人: 'agents',
  // 回: '',
  // 亘: ''
  // 目: '',
  // 田: '',
  // 卌: '',
  // 口: '',
}

export const API = <T = any>(handler: any) => 
  ClickableAPI(handler, { getPayloadClient })

export const modifyQueryString = clickableModifyQueryString
