import type { GrantConfig } from 'grant'

export const grantConfig: GrantConfig = {
  defaults: {
    origin: process.env.NODE_ENV === 'production' ? 'https://apis.do' : 'http://localhost:3000',
    transport: 'session',
    state: true,
  },
  openai: {
    callback: '/api/oauth/callback/openai',
  },
  zapier: {
    callback: '/api/oauth/callback/zapier',
  },
}

export const addClientConfig = (
  name: string, 
  callback: string,
  config: Partial<GrantConfig[string]> = {}
) => {
  grantConfig[name] = {
    callback,
    ...config,
  }
  return grantConfig
}

export const getGrantConfig = () => grantConfig
