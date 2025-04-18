import { evalite } from 'evalite'
import { Battle } from 'autoevals'
import { ai } from 'functions.do'
import { domains } from './domains'
import { models } from './models'

const battleScorer = Battle as any

evalite('LeanCanvas Evaluation', {
  data: () =>
    domains.flatMap((domain) =>
      models.map((model) => ({
        input: { domain, model },
        expected: {
          /* optional baseline */
        },
      })),
    ),
  task: async ({ domain, model }) => {
    const result = await ai.leanCanvas(
      { domain },
      {
        productName: 'name of the product or service',
        problem: ['top 3 problems the product solves'],
        solution: ['top 3 solutions the product offers'],
        uniqueValueProposition: 'clear message that states the benefit of your product',
        unfairAdvantage: 'something that cannot be easily copied or bought',
        customerSegments: ['list of target customer segments'],
        keyMetrics: ['list of key numbers that tell you how your business is doing'],
        channels: ['path to customers'],
        costStructure: ['list of operational costs'],
        revenueStreams: ['list of revenue sources'],
      },
      { model },
    )
    return result
  },
  scorers: [battleScorer],
  experimental_customColumns: async (data) => [
    { label: 'Domain', value: data.input.domain },
    { label: 'Model', value: data.input.model },
    { label: 'Output', value: data.output },
  ],
})
