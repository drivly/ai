import { AI } from 'workflows.do'

export default AI({
  
  createFunction: ({ ai, api, db, event }) => {

  },

  defineFunction: {
    name: 'Function name',
    description: 'Describe the purpose of the function',
    results: 'Deterministic | Non-deterministic',
    observations: 'Think carefully about what is the ideal type ',
    type: 'Object | List | Array | Code | Markdown',
  },

  createUnitTests: {
    name: 'Function name',
    description: 'Describe the purpose of the function',
    observations: 'Think carefully about what is the ideal type ',
    type: 'Object | List | Array | Code | Markdown',
  },

  developFunction: {
    name: 'Function name',
    description: 'Describe the purpose of the function',
    observations: 'Think carefully about what is the ideal type ',
    type: 'Object | List | Array | Code | Markdown',
  },

})
