import { evalite } from 'evalite'
import { Battle } from 'autoevals'
import { ai } from 'functions.do'
import { domains } from './domains'
import { models } from './models'

const battleScorer = Battle as any

evalite('Blog Titles Evaluation', {
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
    const result = await ai.listBlogPostTitles({ topic: domain }, ['list of SEO-optimized blog post titles'], { model })
    return result
  },
  scorers: [battleScorer],
  experimental_customColumns: async (data) => [
    { label: 'Domain', value: data.input.domain },
    { label: 'Model', value: data.input.model },
    { label: 'Output', value: data.output },
  ],
})
