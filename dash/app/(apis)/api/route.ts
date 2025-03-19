import { API } from '@/api.config'

export const GET = API(async (request, { db, user, origin, url }) => {
  // Using the new db interface for more concise syntax
  // const functions = await db.functions.find()

  return {
    featured: {
      'Functions - Typesafe Results without Complexity': origin + '/functions',
      'Workflows - Reliably Execute Business Processes': origin + '/workflows',
      'Agents - Deploy & Manage Autonomous Digital Workers': origin + '/agents',
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