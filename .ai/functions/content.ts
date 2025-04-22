// import { model } from 'ai-providers'
import { model } from '@/lib/ai'
import { generateObject, generateText } from 'ai'
import yaml from 'yaml'
import { z } from 'zod'

export const writeBlogPost = (input: any) =>
  generateText({
    model: model('google/gemini-2.5-pro-preview-03-25'),
    system: 'You are an expert at writing compelling and SEO-optimized blog content',
    prompt: `Write a blog post about: \n\n${typeof input === 'string' ? input : yaml.stringify(input)}`,
    temperature: 1,
  }).then((result) => {
    return result.text
  })

export const listBlogPostTitles = (input: any) =>
  generateObject({
    model: model('google/gemini-2.5-pro-preview-03-25', { structuredOutputs: true }),
    system: 'You are an expert at writing compelling and SEO-optimized blog content',
    prompt: `List 30 blog post titles: \n\n${typeof input === 'string' ? input : yaml.stringify(input)}`,
    temperature: 1,
    schema: z.object({
      posts: z.array(z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
      })),
    }),
  }).then((result) => {
    return result.object.posts
  })

export const siteContent = (input: any) =>
  generateObject({
    model: model('google/gemini-2.5-pro-preview-03-25', { structuredOutputs: true }),
    system: 'You are an expert at writing compelling and SEO-optimized site content',
    prompt: `Write site content for: \n\n${typeof input === 'string' ? input : yaml.stringify(input)}`,
    temperature: 1,
    schema: siteContentSchema,
  }).then((result) => {
    return result.object
  })


export const siteContentSchema = z.object({
  seo: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
  }),
  hero: z.object({
    headline: z.string(),
    subheadline: z.string(),
  }),
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })),
  benefits: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })),
})