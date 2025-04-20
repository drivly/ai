// import { model } from 'ai-providers'
import { model } from '../../lib/ai'
import { generateObject, generateText } from 'ai'
import yaml from 'yaml'
import { z } from 'zod'

export const writeBlogPost = (input: any) =>
  generateText({
    model: model('google/gemini-2.5-pro-preview-03-25'),
    system: 'You are an expert at writing compelling and SEO-optimized blog content',
    prompt: `Write a blog post about: \n\n${typeof input === 'string' ? input : yaml.stringify(input)}`,
  }).then((result) => {
    return result.text
  })

export const listBlogPostTitles = (input: any) =>
  generateObject({
    model: model('google/gemini-2.5-pro-preview-03-25', { structuredOutputs: true }),
    system: 'You are an expert at writing compelling and SEO-optimized blog content',
    prompt: `List blog post titles: \n\n${typeof input === 'string' ? input : yaml.stringify(input)}`,
    schema: z.object({
      titles: z.array(z.string()),
    }),
  }).then((result) => {
    return result.object.titles
  })
