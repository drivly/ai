// import { model } from 'ai-providers'
import { BLOG_CATEGORIES } from '@/app/(sites)/sites/[domain]/blog/constants'
import { model } from '@/lib/ai'
import { generateObject, generateText } from 'ai'
import yaml from 'yaml'
import { z } from 'zod'

export const BlogCategorySchema = z.enum(BLOG_CATEGORIES)

export const writeBlogPost = (
  input: any,
  {
    // modelName = 'google/gemini-2.5-pro-preview-03-25',
    modelName = 'google/gemini-2.5-flash-preview',
    system = 'You are an expert at writing compelling and SEO-optimized blog content. Respond only in markdown format starting with "# [Title]"',
    temperature = 1,
  } = {},
) =>
  generateText({
    model: model(modelName),
    system,
    prompt: `Write a blog post about: \n\n${typeof input === 'string' ? input : yaml.stringify(input)}`,
    temperature,
  }).then((result) => {
    return result.text
  })

export const listBlogPostTitles = (
  input: any,
  {
    // count = 30,
    count = 10,
    // modelName = 'google/gemini-2.5-pro-preview-03-25',
    modelName = 'google/gemini-2.5-flash-preview',
    system = 'You are an expert at writing compelling and SEO-optimized blog content',
    temperature = 1,
  } = {},
) =>
  generateObject({
    model: model(modelName),
    system,
    prompt: `List ${count} blog post titles: \n\n${typeof input === 'string' ? input : yaml.stringify(input)}`,
    temperature,
    schema: z.object({
      posts: z.array(
        z.object({
          title: z.string().describe('The title of the blog post'),
          description: z.string().describe('A short description of the blog post'),
          category: BlogCategorySchema.describe('The category of the blog post'),
        }),
      ),
    }),
  }).then((result) => {
    return result.object.posts
  })

export const siteContent = (
  input: any,
  {
    // modelName = 'google/gemini-2.5-pro-preview-03-25',
    modelName = 'google/gemini-2.5-flash-preview',
    system = 'You are an expert at writing compelling and SEO-optimized site content for `.do` - an AI-powered Agentic Workflow Platform to do Business-as-Code and deliver valuable Services-as-Software through simple APIs and SDKs. ',
    temperature = 1,
  } = {},
) =>
  generateObject({
    model: model(modelName),
    system,
    prompt: `Write site content for: \n\n${typeof input === 'string' ? input : yaml.stringify(input)}`,
    temperature,
    schema: siteContentSchema,
  }).then((result) => {
    console.log({ modelName, system }, result.object)
    return result.object
  })

export const siteContentSchema = z.object({
  seo: z.object({
    title: z.string().describe("Format should be '{domain} - description' where domain is the .do domain name"),
    description: z.string(),
    keywords: z.array(z.string()),
  }),
  hero: z.object({
    headline: z.string(),
    subheadline: z.string(),
  }),
  badge: z.string({ description: '3-word eyebrow text above hero headline' }),
  codeExample: z.string({
    description:
      'Extremely elegant, simple, and concise code examples. Depending on the context, you will either return a Typescript code example or an example JSON object which would be returned from an API that does this activity.',
  }),
  codeLang: z.enum(['typescript', 'json']),
  // features: z.array(z.object({
  //   title: z.string(),
  //   description: z.string(),
  // })),
  // benefits: z.array(z.object({
  //   title: z.string(),
  //   description: z.string(),
  // })),
  faqs: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    }),
  ),
})
