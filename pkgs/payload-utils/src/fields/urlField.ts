import type { Field } from 'payload'
import React from 'react'

type URLFieldOptions = {
  name?: string
  label?: string
  required?: boolean
  validate?: (value: string) => string | boolean
  admin?: Record<string, unknown>
}

/**
 * Creates a URL field that renders as a clickable link in the admin UI
 * Links open in new windows with proper security attributes
 */
export const urlField = ({
  name = 'url',
  label = 'URL',
  required = false,
  validate,
  admin = {},
}: URLFieldOptions = {}): Field => {
  return {
    name,
    type: 'text',
    label,
    required,
    admin: {
      components: {
        Cell: function URLFieldCell({ cellData }: { cellData: unknown }) {
          if (!cellData || typeof cellData !== 'string') {
            return null
          }
          
          return React.createElement(
            'a',
            {
              href: cellData,
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'underline hover:opacity-80'
            },
            cellData
          )
        },
      },
      ...admin,
    },
    validate: function validateURLField(value: unknown): string | boolean {
      if (required && !value) {
        return 'URL is required'
      }
      
      if (value && typeof value === 'string' && !validateURL(value)) {
        return 'Please enter a valid URL'
      }
      
      if (validate && value && typeof value === 'string') {
        return validate(value)
      }
      
      return true
    },
  }
}

/**
 * Validates a URL string
 * Checks for proper URL format with http/https protocol
 */
function validateURL(url: string): boolean {
  if (!url) return false
  
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch (error) {
    return false
  }
}
