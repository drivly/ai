/*
 * This file contains overwrites for the AI models.
 * OpenRouter's data is not always 100% accurate, so we can overwrite certain
 * models with our own data.
 */

export const overwrites = {
  'anthropic/claude-3.7-sonnet': {
    // Explicitly remove reasoning from this model as it's not actually supported.
    'endpoint.supportedParameters': ['max_tokens', 'temperature', 'stop', 'tools', 'tool_choice'],
  },
}
