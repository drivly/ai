// TODO: finish this implementation once `ai-workflows` is ready
// import { AI } from 'ai-workflows'
import { AI } from '@/lib/ai'

export const ai = AI({
  // createFunction: async (args, { ai, api, db }) => {
  //   const functionDefinition = await ai.defineFunction(args)

  //   return functionDefinition
  // },

  defineFunction: {
    name: 'Function name',
    description: 'Describe the purpose of the function',
    results: 'Deterministic | Non-deterministic',
    observations: 'Think carefully about what is the ideal type ',
    returnType: 'Object | List | Array | Code | Markdown',
  },

  createUnitTests: {
    name: 'Function name',
    description: 'Describe the purpose of the function',
    observations: 'Think carefully about what is the ideal type ',
    returnType: 'Object | List | Array | Code | Markdown',
  },

  developFunction: {
    name: 'Function name',
    description: 'Describe the purpose of the function',
    observations: 'Think carefully about what is the ideal type ',
    returnType: 'Object | List | Array | Code | Markdown',
  },

  conjugateVerbs: {
    action: 'active tense like Create',
    act: 'third person singular present tense like Creates',
    activity: 'gerund like Creating',
    event: 'past tense like Created',
    subject: 'subject like Creator',
    object: 'object like Creation',
    inverse: 'opposite like Destroy',
    inverseAct: 'third person singular present tense like Destroys',
    inverseActivity: 'gerund like Destroying',
    inverseEvent: 'past tense like Destroyed',
    inverseSubject: 'subject like Destroyer',
    inverseObject: 'object like Destruction',
  },

  inflectNouns: {
    singular: 'singular noun like User',
    plural: 'plural noun like Users',
    possessive: `possessive noun like User's`,
    pluralPossessive: `possessive plural noun like Users'`,
    verb: 'verb like Use',
    act: 'third person singular present tense like Uses',
    activity: 'gerund like Using',
    event: 'past tense like Used',
  },
})
