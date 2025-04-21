export class CLI {
  async listIntegrations() {
    return []
  }

  async connect(integration: string, options: { token?: string } = {}) {
    console.log(`Connecting to ${integration}...`)
    return { success: true, integration }
  }

  async disconnect(integration: string) {
    console.log(`Disconnecting from ${integration}...`)
    return { success: true, integration }
  }
}
