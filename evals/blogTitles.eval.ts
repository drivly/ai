import { evalite, Evalite } from 'evalite'
import { Battle } from 'autoevals'
import { ai } from 'functions.do'
import { domains } from './domains'
import { models } from './models'

type EvalData = {
  domain: string;
  model: string;
}

type BlogTitlesOutput = any; // Type for the output of the listBlogPostTitles function

const experimental_customColumns = async (
  data: Evalite.ScoreInput<EvalData, BlogTitlesOutput, {}>
) => {
  return [
    { label: 'Domain', value: data.input.domain },
    { label: 'Model', value: data.input.model },
    { label: 'Output', value: data.output }
  ]
}

evalite('Blog Titles Evaluation', {
  data: () => domains.flatMap(domain => 
    models.map(model => ({
      input: { domain, model },
      expected: {/* optional baseline */},
    }))
  ),
  task: async ({ domain, model }: EvalData) => {
    const result = await ai.listBlogPostTitles(
      { topic: domain },
      ['list of SEO-optimized blog post titles'],
      { model }
    )
    return result
  },
  scorers: [Battle as any], // Type assertion to resolve compatibility issue
  experimental_customColumns,
})
