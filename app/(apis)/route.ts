import { API } from '@/api.config'
export const GET = API(async (request, { db, user, origin, url, domain }) => {
  // Using the new db interface for more concise syntax
  // const functions = await db.functions.find()

  return domain !== 'localhost'
    ? {
        ai: {
          '入 Functions - Typesafe Results without Complexity': 'https://functions.do/api',
          '巛 Workflows - Reliably Execute Business Processes': 'https://workflows.do/api',
          '回 Agents - Deploy & Manage Autonomous Digital Workers': 'https://agents.do/api',
        },
        things: {
          'Nouns - People, Places, Things, and Ideas': 'https://nouns.do',
          'Verbs - The Actions Performed to and by Nouns': 'https://verbs.do',
        },
        events: {
          'Triggers - Initiate workflows based on events': 'https://triggers.do',
          'Searches - Query and retrieve data': 'https://searches.do',
          'Actions - Perform tasks within workflows': 'https://actions.do',
        },
        core: {
          'LLM - Intelligent AI Gateway': 'https://llm.do',
          'Evals - Evaluate Functions, Workflows, and Agents': 'https://evals.do',
          'Analytics - Economically Validate Workflows': 'https://analytics.do',
          'Experiments - Economically Validate Workflows': 'https://experiments.do',
          'Database - AI Native Data Access (Search + CRUD)': 'https://database.do',
          'Integrations - Connect External APIs and Systems': 'https://integrations.do',
        },
      }
    : {
        ai: {
          '入 Functions - Typesafe Results without Complexity': origin + '/functions',
          '巛 Workflows - Reliably Execute Business Processes': origin + '/workflows',
          '回 Agents - Deploy & Manage Autonomous Digital Workers': origin + '/agents',
        },
        events: {
          'Triggers - Initiate workflows based on events': origin + '/triggers',
          'Searches - Query and retrieve data': origin + '/searches',
          'Actions - Perform tasks within workflows': origin + '/actions',
        },
        core: {
          'LLM - Intelligent AI Gateway': origin + '/llm',
          'Evals - Evaluate Functions, Workflows, and Agents': origin + '/evals',
          'Analytics - Economically Validate Workflows': origin + '/analytics',
          'Experiments - Economically Validate Workflows': origin + '/experiments',
          'Database - AI Native Data Access (Search + CRUD)': origin + '/database',
          'Integrations - Connect External APIs and Systems': origin + '/integrations',
        },
        actions: {
          toggleDomains: url + '?domains',
        },
      }
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
