import { API, formatUrl } from '@/lib/api'

export const GET = API(async (request, { db, user, origin, url, domain }) => {
  const showDomains = url.searchParams.has('domains')

  const formatWithOptions = (path: string, defaultDomain?: string) =>
    formatUrl(path, {
      origin,
      domain,
      showDomains,
      defaultDomain,
    })

  const response: Record<string, any> = {
    featured: {
      'Functions - Typesafe Results without Complexity': formatWithOptions('functions', 'functions.do'),
      'Workflows - Reliably Execute Business Processes': formatWithOptions('workflows', 'workflows.do'),
      'Agents - Deploy & Manage Autonomous Digital Workers': formatWithOptions('agents', 'agents.do'),
    },
    events: {
      'Triggers - Initiate workflows based on events': formatWithOptions('triggers', 'triggers.do'),
      'Searches - Query and retrieve data': formatWithOptions('searches', 'searches.do'),
      'Actions - Perform tasks within workflows': formatWithOptions('actions', 'actions.do'),
    },
    chat: {
      'Chat - AI Conversations': formatWithOptions('api/chat', 'chat.do'),
      'History - Chat History': formatWithOptions('api/history', 'history.do'),
      'Document - User Documents': formatWithOptions('api/document', 'document.do'),
      'Suggestions - Document Suggestions': formatWithOptions('api/suggestions', 'suggestions.do'),
      'Vote - Message Votes': formatWithOptions('api/vote', 'vote.do'),
    },
    core: {
      'LLM - Intelligent AI Gateway': formatWithOptions('llm', 'llm.do'),
      'Evals - Evaluate Functions, Workflows, and Agents': formatWithOptions('evals', 'evals.do'),
      'Analytics - Economically Validate Workflows': formatWithOptions('analytics', 'analytics.do'),
      'Experiments - Economically Validate Workflows': formatWithOptions('experiments', 'experiments.do'),
      'Database - AI Native Data Access (Search + CRUD)': formatWithOptions('database', 'database.do'),
      'Integrations - Connect External APIs and Systems': formatWithOptions('integrations', 'integrations.do'),
    },
  }

  if (domain === 'apis.do') {
    response.resources = {
      'Nouns - People, Places, Things, and Ideas': formatWithOptions('nouns', 'nouns.do'),
      'Verbs - The Actions Performed to and by Nouns': formatWithOptions('verbs', 'verbs.do'),
    }
  }

  response.actions = {
    toggleDomains: url.searchParams.has('domains') ? url.toString().replace(/[?&]domains/, '') : url.toString() + (url.toString().includes('?') ? '&domains' : '?domains'),
  }

  return response
})

// "featured": {
//     "Functions - Typesafe Results without Complexity": "https://functions.do",
//     "Workflows - Reliably Execute Business Processes": "https://workflows.do",
//     "Agents - Deploy & Manage Autonomous Digital Workers": "https://agents.do"
//   },
//   "events": {
//     "Triggers - Initiate workflows based on events": "https://triggers.do",
//     "Searches - Query and retrieve data": "https://searches.do",
//     "Actions - Perform tasks within workflows": "https://actions.do"
//   },
//   "core": {
//     "LLM - Intelligent AI Gateway": "https://llm.do",
//     "Evals - Evaluate Functions, Workflows, and Agents": "https://evals.do",
//     "Analytics - Economically Validate Workflows": "https://analytics.do",
//     "Experiments - Economically Validate Workflows": "https://experiments.do",
//     "Database - AI Native Data Access (Search + CRUD)": "https://database.do",
//     "Integrations - Connect External APIs and Systems": "https://integrations.do"
//   },
