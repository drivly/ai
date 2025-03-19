import { API } from '@/api.config'

export const GET = API(async (request, { db, user, origin, url }) => {
  // Using the new db interface for more concise syntax
  // const functions = await db.functions.find()


  
  return { 
    featured: {
      functions: origin + '/functions',
      workflows: origin + '/workflows',
      agents: origin + '/agents'
    },
    core: {
      database: origin + '/database',
      evals: origin + '/evals',
    },
    actions: {
      toggleDomains: url + '?domains'
    }
   }
})
