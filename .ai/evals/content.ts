/*
import { evalite } from 'evalite'
import { domains } from '@/.velite'
import { siteContent } from '../functions/content'
import { Battle } from 'autoevals'
import { sampleSize } from 'lodash'

const context = ' for `.do` - an AI-powered Agentic Workflow Platform to do Business-as-Code and deliver valuable Services-as-Software through simple APIs and SDKs. '

const models = [
  'google/gemini-2.5-pro-preview-03-25',
  'google/gemini-2.5-flash-preview',
  'google/gemini-2.0-flash-001',
  'google/gemini-2.0-flash-lite-001',
  'openai/gpt-4.5-preview',
  'openai/gpt-4.1',
  'openai/gpt-4.1-mini',
  'openai/gpt-4.1-nano',
  'anthropic/claude-3.7-sonnet',
  'meta-llama/llama-4-maverick',
  'meta-llama/llama-4-scout',
  'x-ai/grok-3-beta',
  'x-ai/grok-3-mini-beta',
]

for (const domain of sampleSize(domains, 10)) {
  for (const modelName of models) {
    console.log(`Evaluating ${domain.domain} with ${modelName}`)
    const expected = {} // await siteContent({ domain }, { modelName, system: 'You are an expert at writing compelling and SEO-optimized site content' + context, temperature: 1 })
    evalite(`siteContent ${domain.domain} ${modelName}`, {
      data: async () => {
        const combinations = cartesian({
          system: [
            'You are an expert at writing compelling and SEO-optimized site content' + context,
            'You are an expert at content marketing for startups and you were hired by' + context,
            'You are a YC Group Partner having office hours' + context,
          ],
          temperature: [0.7, 0.8, 0.9, 1.0],
        })
        return combinations.map((input) => ({ input, expected, instructions: 'Write site content for the given domain' }))
      },
      task: async ({ system, temperature }) => siteContent(domain, { modelName, system, temperature }),
      scorers: [],
      experimental_customColumns: async ({ input, output, expected }) => {
        return [
          { label: 'System', value: input.system },
          { label: 'Temperature', value: input.temperature },
          { label: 'Headline', value: output.hero.headline },
          { label: 'Subhead', value: output.hero.subheadline },
        ]
      },
    })
  }
}
*/
