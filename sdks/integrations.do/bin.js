#!/usr/bin/env node

import { cli } from 'apis.do'
import { integrations } from './index.js'

cli.extend({
  name: 'integrations',
  description: 'Manage integrations between applications',
  commands: [
    {
      name: 'list',
      description: 'List available integrations',
      action: async () => {
        const result = await integrations.list()
        console.table(result)
      }
    },
    {
      name: 'get',
      description: 'Get details about a specific integration',
      args: [
        {
          name: 'service',
          description: 'Service name',
          required: true
        }
      ],
      action: async (args) => {
        const result = await integrations.get(args.service)
        console.log(JSON.stringify(result, null, 2))
      }
    },
    {
      name: 'connect',
      description: 'Connect to a service',
      args: [
        {
          name: 'service',
          description: 'Service name',
          required: true
        },
        {
          name: 'auth-type',
          description: 'Authentication type (oauth, apiKey)',
          required: true
        }
      ],
      options: [
        {
          name: '--client-id',
          description: 'OAuth client ID'
        },
        {
          name: '--client-secret',
          description: 'OAuth client secret'
        },
        {
          name: '--api-key',
          description: 'API key for authentication'
        }
      ],
      action: async (args, options) => {
        const authConfig = {}
        
        if (args.authType === 'oauth') {
          authConfig.clientId = options.clientId
          authConfig.clientSecret = options.clientSecret
        } else if (args.authType === 'apiKey') {
          authConfig.apiKey = options.apiKey
        }
        
        const result = await integrations.connect(args.service, {
          authType: args.authType,
          credentials: authConfig
        })
        
        console.log('Connection established:')
        console.log(JSON.stringify(result, null, 2))
      }
    }
  ]
})

cli.run()
