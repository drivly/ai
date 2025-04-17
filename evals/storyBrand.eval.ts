import { evalite, Evalite } from 'evalite'
import { Battle } from 'autoevals'
import { ai } from 'functions.do'
import { domains } from './domains'
import { models } from './models'

type EvalData = {
  domain: string;
  model: string;
}

type StoryBrandOutput = any; // Type for the output of the storyBrand function

const experimental_customColumns = async (
  data: Evalite.ScoreInput<EvalData, StoryBrandOutput, {}>
) => {
  return [
    { label: 'Domain', value: data.input.domain },
    { label: 'Model', value: data.input.model },
    { label: 'Output', value: data.output }
  ]
}

evalite('StoryBrand Evaluation', {
  data: () => domains.flatMap(domain => 
    models.map(model => ({
      input: { domain, model },
      expected: {/* optional baseline */},
    }))
  ),
  task: async ({ domain, model }: EvalData) => {
    const result = await ai.storyBrand(
      { guide: domain },
      {
        productName: 'name of the product or service',
        hero: 'description of the customer and their challenges',
        problem: {
          external: 'tangible external problem the customer faces',
          internal: 'internal frustration caused by the external problem',
          philosophical: 'why this matters on a deeper level',
          villain: 'antagonistic force causing the problem'
        },
        guide: 'how the brand positions itself as a guide with empathy and authority',
        plan: ['clear steps the customer needs to take'],
        callToAction: 'specific action the customer should take',
        success: 'description of what success looks like after using the product',
        failure: 'description of what failure looks like if they don\'t use the product',
        messagingExamples: ['example marketing messages based on this framework']
      },
      { model }
    )
    return result
  },
  scorers: [Battle as any], // Type assertion to resolve compatibility issue
  experimental_customColumns,
})
