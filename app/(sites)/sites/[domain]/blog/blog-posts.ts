import { listBlogPostTitles, writeBlogPost } from '@/.ai/functions/content'
import type { BlogPost } from '@/components/sites/blog-ui/blog-posts'
import { getContent } from '../content'
import slugify from 'slugify'
import { readingTime } from 'reading-time-estimator'

// Sample blog posts data
const blogPosts: BlogPost[] = [
  {
    slug: 'bringing-ai-back-to-code',
    title: 'Bringing AI Back to Code: Introducing Functions.do',
    description: 'How Functions.do makes generative AI feel like classic programming again.',
    date: '3-23-2025',
    category: 'Functions',
    image: '/images/blog-functions.png',
  },
  {
    slug: 'building-with-llm-do',
    title: 'Building Intelligent Applications with LLM.do',
    description: 'A comprehensive guide to leveraging LLM.do for your next project.',
    date: '3-20-2025',
    category: 'Agents',
    image: '/images/blog-llm.png',
  },
  {
    slug: 'future-of-ai-development',
    title: 'The Future of AI Development',
    description: 'Exploring trends and predictions for AI development in the coming years.',
    date: '3-15-2025',
    category: 'Business',
    image: '/images/apis-plus-ai.png', // Fixed typo here
  },
  {
    slug: 'optimizing-ai-performance',
    title: 'Optimizing AI Performance in Production',
    description: 'Best practices for deploying and scaling AI models in production environments.',
    date: '3-10-2025',
    category: 'Business',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    slug: 'ai-ethics-considerations',
    title: 'Ethical Considerations in AI Development',
    description: 'Navigating the complex ethical landscape of artificial intelligence.',
    date: '3-5-2025',
    category: 'Business',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    slug: 'getting-started-with-apis-do',
    title: 'Getting Started with APIs.do',
    description: "A beginner's guide to using APIs.do for your development needs.",
    date: '3-1-2025',
    category: 'Integrations',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    slug: 'machine-learning-basics',
    title: 'Machine Learning Basics for AI Developers',
    description: 'An introduction to machine learning concepts for developers working with AI.',
    date: '2-25-2025',
    category: 'Data',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    slug: 'developer-tools-for-ai',
    title: 'Essential Developer Tools for AI Projects',
    description: 'A curated list of the most useful tools for AI development workflows.',
    date: '2-20-2025',
    category: 'Integrations',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    slug: 'ai-transformation-case-study',
    title: 'Case Study: AI Transformation at Enterprise Scale',
    description: 'How a Fortune 500 company implemented AI across their organization.',
    date: '2-15-2025',
    category: 'Business',
    image: '/placeholder.svg?height=200&width=400',
  },
]

export async function getAllBlogPosts(domain: string): Promise<BlogPost[]> {
  const content = await getContent(domain)
  const posts = await listBlogPostTitles(content)
  return posts
}

export async function getBlogPostBySlug(domain: string, slug: string): Promise<BlogPost> {
  const content = await getContent(domain)
  const posts = await listBlogPostTitles(content)
  const blogPost: BlogPost = posts.find((post) => slugify(post.title) === slug) || { title: slug.replaceAll('_', ' '), description: '', category: posts[0].category }
  blogPost.markdown = await writeBlogPost({ website: content, blogPost })

  if (blogPost.markdown) {
    const stats = readingTime(blogPost.markdown, 200)
    blogPost.readingTime = stats.text
  }

  return blogPost
}

export async function getAllCategories(domain: string): Promise<string[]> {
  const categories = new Set(blogPosts.map((post) => post.category))
  return Array.from(categories)
}
