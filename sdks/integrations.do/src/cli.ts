import { API } from 'apis.do'

export class CLI {
  private api: API

  constructor(options: { apiKey?: string; baseUrl?: string } = {}) {
    this.api = new API({ apiKey: options.apiKey, baseUrl: options.baseUrl })
  }

  async listIntegrations() {
    return this.api.get('/integrations')
  }

  async connect(integration: string, options: { token?: string } = {}) {
    return this.api.post(`/integrations/${integration}/connect`, options)
  }

  async disconnect(integration: string) {
    return this.api.post(`/integrations/${integration}/disconnect`, {})
  }
}
