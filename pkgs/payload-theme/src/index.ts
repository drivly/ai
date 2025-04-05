/**
 * Payload CMS Theme Plugin
 */

export interface ThemeOptions {
  /**
   * Custom theme colors
   */
  colors?: {
    primary?: string
    secondary?: string
    background?: string
    text?: string
  }
  /**
   * Custom font settings
   */
  fonts?: {
    body?: string
    heading?: string
  }
}

/**
 * Theme Plugin for Payload CMS
 */
export const themePlugin = (options: ThemeOptions = {}) => {
  return {
    name: 'themePlugin',
    admin: {
      components: {
      }
    }
  }
}

export default themePlugin
