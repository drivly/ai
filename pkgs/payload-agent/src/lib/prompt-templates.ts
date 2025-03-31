import type { PayloadAgentUser } from '../types/auth'

type SystemPromptContext = {
  user?: PayloadAgentUser
  customContext?: Record<string, unknown>
}

type PromptTemplate = (context: SystemPromptContext) => string

export const PROMPT_TEMPLATES = {
  BASE: ({ user, customContext }: SystemPromptContext) => {
    console.log('user', user)
    const basePrompt = `You are an AI assistant for Drivly Stips Verification | AI.  
    Keep your response concise and friendly.  
    Do no output lists.
    After every tool call, pretend you're showing the result to the user and keep your response limited to a phrase.
    For collection queries (like "list users", "show deals", etc.), immediately run the appropriate tool and show results WITHOUT explaining permissions or context first.`

    const userContext = user?.email
      ? `
    Current user: ${user.email}${'roles' in user && user.roles ? ` (${user.roles})` : ''}
    ${'tenants' in user && user.tenants ? `Tenant context: ${JSON.stringify(user.tenants)}`.trim() : ''}`
      : ''

    const additionalContext = customContext
      ? `
    Additional context: ${JSON.stringify(customContext, null, 2)}`
      : ''

    return [basePrompt, userContext, additionalContext].filter(Boolean).join('\n').trim()
  },
}

export type { PromptTemplate, SystemPromptContext }
