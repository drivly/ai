import type { Field, TextFieldSingleValidation } from 'payload'
import path from 'path'

type URLFieldOptions = {
  name?: string
  label?: string
  required?: boolean
  validate?: TextFieldSingleValidation
  admin?: Record<string, unknown>
}

/**
 * Creates a URL field that renders as a clickable link in the admin UI
 * Links open in new windows with proper security attributes
 */
export const urlField = ({ name = 'url', label = 'URL', required = false, validate, admin = {} }: URLFieldOptions = {}): Field => {
  return {
    name,
    type: 'text',
    label,
    required,
    admin: {
      description: 'Enter a valid URL (e.g., https://example.com)',
      className: 'payload-url-field',
      components: {
        Cell: path.resolve(__dirname, './components/URLCell'),
      },
      ...admin,
    },
    hooks: {
      afterRead: [
        ({ value }) => {
          return value
        },
      ],
    },
    validate: ((value, options) => {
      if ((options?.required || required) && !value) {
        return 'URL is required'
      }

      if (value && !validateURL(value)) {
        return 'Please enter a valid URL'
      }

      if (validate && value) {
        return validate(value, options)
      }

      return true
    }) as TextFieldSingleValidation,
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
