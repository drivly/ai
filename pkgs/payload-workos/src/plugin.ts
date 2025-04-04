import type { Config } from 'payload/config'
import { WorkOSPluginConfig } from './types'
import { WorkOSClient } from './lib/workos-client'

/**
 * Create endpoint handlers for WorkOS integration
 */
const createEndpointHandlers = (workosClient: WorkOSClient, config: WorkOSPluginConfig) => {
  const handlers: Record<string, any> = {}

  if (config.features?.sso) {
    handlers.ssoCallback = async (req: any, res: any) => {
      try {
        const { code } = req.query
        if (!code || typeof code !== 'string') {
          return res.status(400).json({ error: 'Invalid code parameter' })
        }

        const { profile } = await workosClient.authenticateWithSSO(code)
        
        if (req.session) {
          req.session.workosUser = profile
        }

        const redirectTo = req.query.state || '/'
        return res.redirect(redirectTo as string)
      } catch (error) {
        console.error('SSO authentication error:', error)
        return res.status(500).json({ error: 'Authentication failed' })
      }
    }
  }

  if (config.features?.magicAuth) {
    handlers.magicAuthCallback = async (req: any, res: any) => {
      try {
        const { code } = req.query
        if (!code || typeof code !== 'string') {
          return res.status(400).json({ error: 'Invalid code parameter' })
        }

        const { user } = await workosClient.verifyMagicAuthSession(code)
        
        if (req.session) {
          req.session.workosUser = user
        }
        
        const redirectTo = req.query.state || '/'
        return res.redirect(redirectTo as string)
      } catch (error) {
        console.error('Magic Auth error:', error)
        return res.status(500).json({ error: 'Authentication failed' })
      }
    }
  }

  if (config.features?.webhooks) {
    handlers.webhook = async (req: any, res: any) => {
      try {
        if (config.webhooks?.endpointSecret) {
        }

        const event = req.body
        
        switch (event.type) {
          case 'directory_user.created':
          case 'directory_user.updated':
          case 'directory_user.deleted':
            break
          default:
            console.log(`Unhandled event type: ${event.type}`)
        }

        return res.status(200).json({ success: true })
      } catch (error) {
        console.error('Webhook processing error:', error)
        return res.status(500).json({ error: 'Failed to process webhook' })
      }
    }
  }

  return handlers
}

/**
 * WorkOS plugin for Payload CMS
 */
export const workosPlugin = (pluginConfig: WorkOSPluginConfig = {}) => {
  return (incomingConfig: Config): Config => {
    const workosClient = new WorkOSClient(pluginConfig)
    
    const handlers = createEndpointHandlers(workosClient, pluginConfig)
    
    const defaultConfig: WorkOSPluginConfig = {
      features: {
        sso: true,
        directorySync: true,
        mfa: true,
        adminPortal: true,
        magicAuth: true,
        secrets: true,
        webhooks: true,
      },
      userCollection: 'users',
      organizationCollection: 'organizations',
      sso: {
        callbackPath: '/api/workos/sso/callback',
      },
      magicAuth: {
        callbackPath: '/api/workos/magic/callback',
        emailField: 'email',
      },
      webhooks: {
        path: '/api/workos/webhooks',
      },
    }
    
    const config = {
      ...defaultConfig,
      ...pluginConfig,
      features: {
        ...defaultConfig.features,
        ...pluginConfig.features,
      },
      sso: {
        ...defaultConfig.sso,
        ...pluginConfig.sso,
      },
      magicAuth: {
        ...defaultConfig.magicAuth,
        ...pluginConfig.magicAuth,
      },
      webhooks: {
        ...defaultConfig.webhooks,
        ...pluginConfig.webhooks,
      },
    }
    
    const endpoints = [
      ...(config.features?.sso ? [{
        path: config.sso?.callbackPath || '/api/workos/sso/callback',
        method: 'get',
        handler: handlers.ssoCallback,
      }] : []),
      
      ...(config.features?.magicAuth ? [{
        path: config.magicAuth?.callbackPath || '/api/workos/magic/callback',
        method: 'get',
        handler: handlers.magicAuthCallback,
      }] : []),
      
      ...(config.features?.webhooks ? [{
        path: config.webhooks?.path || '/api/workos/webhooks',
        method: 'post',
        handler: handlers.webhook,
      }] : []),
    ]
    
    return {
      ...incomingConfig,
      admin: {
        ...incomingConfig.admin,
        user: incomingConfig.admin?.user || config.userCollection,
      },
      onInit: async (payload) => {
        (payload as any).workosClient = workosClient
        
        if (incomingConfig.onInit) {
          await incomingConfig.onInit(payload)
        }
      },
      endpoints: [
        ...((incomingConfig.endpoints as any[]) || []),
        ...endpoints,
      ],
    }
  }
}
