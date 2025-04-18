import { evalite } from 'evalite'
import { Battle } from 'autoevals'
import { ai } from 'functions.do'
import { domains } from './domains'
import { models } from './models'

const battleScorer = Battle as any

evalite('Blog Posts Evaluation', {
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
    const result = await ai.generateBlogPost(
      { topic: domain },
      {
        title: 'SEO-optimized blog post title',
        introduction: 'engaging introduction to the topic',
        sections: [
          {
            heading: 'section heading',
            content: 'section content with key points and examples',
          },
        ],
        conclusion: 'summary of key points and call to action',
        tags: ['relevant keywords for the post'],
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
