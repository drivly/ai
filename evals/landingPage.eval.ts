import { evalite, Evalite } from 'evalite'
import { Battle } from 'autoevals'
import { ai } from 'functions.do'
import { domains } from './domains'
import { models } from './models'

type EvalData = {
  domain: string;
  model: string;
}

type LandingPageOutput = any; // Type for the output of the generateLandingPage function

const experimental_customColumns = async (
  data: Evalite.ScoreInput<EvalData, LandingPageOutput, {}>
) => {
  return [
    { label: 'Domain', value: data.input.domain },
    { label: 'Model', value: data.input.model },
    { label: 'Output', value: data.output }
  ]
}

evalite('Landing Page Evaluation', {
  data: () => domains.flatMap(domain => 
    models.map(model => ({
      input: { domain, model },
      expected: {/* optional baseline */},
    }))
  ),
  task: async ({ domain, model }: EvalData) => {
    const result = await ai.generateLandingPage(
      { 
        brand: domain, 
        idea: 'AI-powered service for business optimization'
      },
      {
        headline: 'attention-grabbing headline that clearly states value proposition',
        subheadline: 'supporting statement that adds clarity to the headline',
        productDescription: 'concise explanation of what the product does',
        keyFeatures: ['list of main features or benefits'],
        socialProof: ['testimonials, user counts, or other trust indicators'],
        callToAction: 'primary button text and action',
      },
      { model }
    )
    return result
  },
  scorers: [Battle as any], // Type assertion to resolve compatibility issue
  experimental_customColumns,
})
