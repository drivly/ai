import { AI } from 'workflows.do'

export default AI({
  
  createFunction: async (args, { ai, api, db }) => {

    const functionDefinition = await ai.defineFunction(args)

    return functionDefinition

  },

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

})
