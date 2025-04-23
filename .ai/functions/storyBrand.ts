import { AI } from 'functions.do'

export default AI({
  storyBrand: {
    productName: 'name of the product or service',
    hero: 'description of the customer and their challenges',
    problem: {
      external: 'tangible external problem the customer faces',
      internal: 'internal frustration caused by the external problem',
      philosophical: 'why this matters on a deeper level',
      villain: 'antagonistic force causing the problem',
    },
    guide: 'how the brand positions itself as a guide with empathy and authority',
    plan: ['clear steps the customer needs to take'],
    callToAction: 'specific action the customer should take',
    success: 'description of what success looks like after using the product',
    failure: "description of what failure looks like if they don't use the product",
    messagingExamples: ['example marketing messages based on this framework'],
  },
})
