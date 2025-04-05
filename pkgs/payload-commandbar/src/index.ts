/**
 * Payload CMS Command Bar Plugin
 */

export interface CommandBarOptions {
  /**
   * Enable or disable the command bar
   */
  enabled?: boolean
}

/**
 * Command Bar Plugin for Payload CMS
 */
export const commandBarPlugin = (options: CommandBarOptions = {}) => {
  return {
    name: 'commandBarPlugin',
    admin: {
      components: {
      }
    }
  }
}

export default commandBarPlugin
