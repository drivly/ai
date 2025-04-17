import { evalite, Evalite } from 'evalite'
import { Battle } from 'autoevals'
import { ai } from 'functions.do'
import { domains } from './domains'
import { models } from './models'

type EvalData = {
  domain: string;
  model: string;
}

type BlogPostOutput = any; // Type for the output of the generateBlogPost function

const experimental_customColumns = async (
  data: Evalite.ScoreInput<EvalData, BlogPostOutput, {}>
) => {
  return [
    { label: 'Domain', value: data.input.domain },
    { label: 'Model', value: data.input.model },
    { label: 'Output', value: data.output }
  ]
}

evalite('Blog Posts Evaluation', {
  data: () => domains.flatMap(domain => 
    models.map(model => ({
      input: { domain, model },
      expected: {/* optional baseline */},
    }))
  ),
  task: async ({ domain, model }: EvalData) => {
    const result = await ai.generateBlogPost(
      { topic: domain },
      {
        title: 'SEO-optimized blog post title',
        introduction: 'engaging introduction to the topic',
        sections: [{
          heading: 'section heading',
          content: 'section content with key points and examples'
        }],
        conclusion: 'summary of key points and call to action',
        tags: ['relevant keywords for the post']
      },
      { model }
    )
    return result
  },
  scorers: [Battle as any], // Type assertion to resolve compatibility issue
  experimental_customColumns,
})
