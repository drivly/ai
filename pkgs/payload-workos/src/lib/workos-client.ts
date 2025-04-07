import { WorkOS } from '@workos-inc/node'
import { WorkOSPluginConfig } from '../types'

export class WorkOSClient {
  private workos: WorkOS
  private config: WorkOSPluginConfig

  constructor(config: WorkOSPluginConfig) {
    this.config = config

    const apiKey = config.apiKey || process.env.WORKOS_API_KEY
    if (!apiKey) {
      throw new Error('WorkOS API key is required. Set it in the plugin config or as WORKOS_API_KEY environment variable.')
    }

    this.workos = new WorkOS(apiKey)
  }

  getClient(): WorkOS {
    return this.workos
  }

  async getAuthorizationURL(options: { connection?: string; organization?: string; redirectURI?: string; state?: string }) {
    const redirectURI = options.redirectURI || this.config.redirectUri
    if (!redirectURI) {
      throw new Error('Redirect URI is required for SSO authentication')
    }

    return (this.workos.sso as any).getAuthorizationURL({
      connection: options.connection,
      organization: options.organization,
      redirectURI,
      state: options.state,
    })
  }

  async authenticateWithSSO(code: string) {
    return (this.workos.sso as any).getProfileAndToken(code)
  }

  async listUsers(options?: { directory?: string }) {
    return (this.workos.directorySync as any).listUsers({
      directory: options?.directory,
    })
  }

  async getUser(userId: string) {
    return (this.workos.directorySync as any).getUser(userId)
  }

  async getSecret(name: string) {
    throw new Error('Secret Manager is not available in the current WorkOS SDK version')
  }

  async createSecret(name: string, value: string) {
    throw new Error('Secret Manager is not available in the current WorkOS SDK version')
  }

  async getMFAFactors(userId: string) {
    return (this.workos.mfa as any).listFactors(userId)
  }

  async enrollMFAFactor(options: { type: string; userId: string; phoneNumber?: string; totp?: string }) {
    return (this.workos.mfa as any).enrollFactor({
      type: options.type,
      userId: options.userId,
      phoneNumber: options.phoneNumber || '',
      totpIssuer: options.totp ? 'Payload CMS' : undefined,
      totpUser: options.totp || '',
    })
  }

  async sendMagicAuthEmail(email: string, redirectURI?: string) {
    return (this.workos.passwordless as any).createSession({
      email,
      redirectURI: redirectURI || this.config.redirectUri,
    })
  }

  async verifyMagicAuthSession(code: string) {
    return (this.workos.passwordless as any).authenticateSession(code)
  }
}
