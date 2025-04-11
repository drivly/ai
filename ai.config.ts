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

  generateSiteContent: {
    domain: 'The domain name to generate content for',
    title: 'The title of the site',
    description: 'A brief description of the site',
    headline: 'A compelling headline for the site',
    subhead: 'A supporting subheadline (optional)',
    brandColor: 'The brand color in hex format (optional)',
    badge: 'Badge text to display (optional)',
    codeExample: 'Example code to showcase site functionality (optional)',
    codeLang: 'Language of the code example (optional)',
    group: 'Grouping category for the site (optional)',
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

  listBlogPostTitles: {
    name: 'List Blog Post Titles',
    description: 'Generate a list of blog post titles',
    domain: 'The domain to generate blog posts for',
    count: 'Number of blog post titles to generate',
    topics: 'Optional topics to focus on',
    returnType: 'TextArray',
  },

  writeBlogPost: {
    name: 'Write Blog Post',
    description: 'Generate content for a blog post',
    title: 'The title of the blog post',
    domain: 'The domain the blog post is for',
    tone: 'Optional tone for the content (professional, casual, etc.)',
    length: 'Optional desired length (short, medium, long)',
    returnType: 'Markdown',
  },
})
