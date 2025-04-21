/**
 * Type definitions for studio.do SDK
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
  /**
   * Custom logo URL
   */
  logo?: string
  /**
   * Custom favicon URL
   */
  favicon?: string
}

export interface PayloadAgentOptions {
  /**
   * Type of chat interface
   */
  type?: 'modal' | 'panel' | 'resizable'
  /**
   * Display logo image or title text
   */
  logo?: string
  /**
   * Avatar image URL for AI messages
   */
  aiAvatar?: string
  /**
   * Initial message to display
   */
  defaultMessage?: string
  /**
   * Show background overlay
   */
  withOverlay?: boolean
  /**
   * Close on outside click
   */
  withOutsideClick?: boolean
  /**
   * Suggested prompts
   */
  suggestions?: Array<{
    title: string
    label: string
    action: string
  }>
}

export interface StudioSDKOptions {
  /**
   * Project ID to create studio for
   */
  projectId: string
  /**
   * Theme options for white-labeling
   */
  theme?: ThemeOptions
  /**
   * Payload Agent options for chat widget
   */
  agentOptions?: PayloadAgentOptions
}

export interface Collection {
  slug: string
  admin: {
    useAsTitle: string
    group?: string
    description?: string
  }
  fields: Array<{
    name: string
    type: string
    required?: boolean
    [key: string]: any
  }>
}

export interface PayloadClient {
  [collection: string]: {
    find: (query?: any) => Promise<any>
    findOne: (query?: any) => Promise<any>
    findById: (id: string, query?: any) => Promise<any>
    create: (data: any, query?: any) => Promise<any>
    update: (id: string, data: any, query?: any) => Promise<any>
    delete: (id: string, query?: any) => Promise<any>
  }
}
