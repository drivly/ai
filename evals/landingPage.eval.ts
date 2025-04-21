import { evalite } from 'evalite'
import { Battle } from 'autoevals'
import { ai } from 'functions.do'
import { domains } from './domains'
import { models } from './models'

const battleScorer = Battle as any

evalite('Landing Page Evaluation', {
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
    const result = await ai.generateLandingPage(
      {
        brand: domain,
        idea: 'AI-powered service for business optimization',
      },
      {
        headline: 'attention-grabbing headline that clearly states value proposition',
        subheadline: 'supporting statement that adds clarity to the headline',
        productDescription: 'concise explanation of what the product does',
        keyFeatures: ['list of main features or benefits'],
        socialProof: ['testimonials, user counts, or other trust indicators'],
        callToAction: 'primary button text and action',
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
