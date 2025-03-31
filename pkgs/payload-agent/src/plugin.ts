import { Config } from 'payload'
import type { DefaultChatOptions } from './types/chat'

const payloadAgentPlugin =
  (pluginConfig: DefaultChatOptions) =>
  (incomingConfig: Config): Config => {
    if (pluginConfig.enabled === false) {
      return incomingConfig
    }

    // Ensure admin components exist
    if (!incomingConfig.admin) {
      incomingConfig.admin = {}
    }
    if (!incomingConfig.admin.components) {
      incomingConfig.admin.components = {}
    }
    if (!incomingConfig.admin.components.providers) {
      incomingConfig.admin.components.providers = []
    }

    // Create type-specific client props
    let clientProps: DefaultChatOptions

    const baseProps = {
      aiAvatar: pluginConfig.aiAvatar,
      defaultMessage: pluginConfig.defaultMessage,
      chatOptions: pluginConfig.chatOptions,
      suggestions: pluginConfig.suggestions,
      getAuthResult: pluginConfig.getAuthResult,
      requireAuth: !!pluginConfig.getAuthResult,
      ...('logo' in pluginConfig ? { logo: pluginConfig.logo as string, title: undefined } : { title: pluginConfig.title as string, logo: undefined }),
    }

    // Handle each type separately to satisfy the union type
    switch (pluginConfig.type) {
      case 'resizable':
        clientProps = {
          ...baseProps,
          type: 'resizable',
          direction: pluginConfig.direction,
        }
        break
      case 'panel':
      case 'modal':
        clientProps = {
          ...baseProps,
          type: pluginConfig.type,
          withOverlay: pluginConfig.withOverlay,
          withOutsideClick: pluginConfig.withOutsideClick,
        }
        break
    }

    // Add chat provider to admin
    incomingConfig.admin.components.providers.push({
      path: '@drivly/payload-agent/chat-bot',
      clientProps,
    })

    return incomingConfig
  }

export { payloadAgentPlugin }
