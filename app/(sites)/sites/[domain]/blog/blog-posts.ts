import type { BlogPost } from '@/components/sites/blog-ui/blog-posts'
import { ai } from 'functions.do'

let cachedBlogPosts: BlogPost[] | null = null
const defaultCategories = ['AI Functions', 'Developer Tools', 'API Design', 'Language Models', 'Industry Insights', 'Best Practices', 'Ethics', 'Tutorials']

const fallbackBlogPosts: BlogPost[] = [
  {
    slug: 'bringing-ai-back-to-code',
    title: 'Bringing AI Back to Code: Introducing Functions.do',
    description: 'How Functions.do makes generative AI feel like classic programming again.',
    date: '3-23-2025',
    category: 'AI Functions',
    image: '/images/blog-functions.png',
  },
  {
    slug: 'building-with-llm-do',
    title: 'Building Intelligent Applications with LLM.do',
    description: 'A comprehensive guide to leveraging LLM.do for your next project.',
    date: '3-20-2025',
    category: 'Language Models',
    image: '/images/blog-llm.png',
  },
  {
    slug: 'future-of-ai-development',
    title: 'The Future of AI Development',
    description: 'Exploring trends and predictions for AI development in the coming years.',
    date: '3-15-2025',
    category: 'Industry Insights',
    image: '/images/apis-plus-ai.png',
  },
]

/**
 * Generate a list of blog posts using AI
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (cachedBlogPosts) return cachedBlogPosts
  
  try {
    const posts = await ai.generateBlogPosts(
      { 
        topics: defaultCategories, 
        count: 10,
        productName: 'functions.do',
        companyName: 'Drivly',
        includeRecentTrends: true
      },
      {
        posts: [{
          slug: 'url-friendly-slug',
          title: 'attention-grabbing title',
          description: 'brief summary',
          date: 'date in MM-DD-YYYY format',
          category: 'category name',
          image: 'image path'
        }]
      }
    )
    
    const formattedPosts = posts.posts.map(post => {
      const dateParts = post.date.split('-')
      const formattedDate = `${parseInt(dateParts[0])}-${parseInt(dateParts[1])}-${dateParts[2]}`
      
      const imagePath = post.image.startsWith('/') 
        ? post.image 
        : `/placeholder.svg?height=200&width=400`
      
      return {
        ...post,
        date: formattedDate,
        image: imagePath
      }
    })
    
    cachedBlogPosts = formattedPosts
    return formattedPosts
  } catch (error) {
    console.error('Error generating blog posts:', error)
    cachedBlogPosts = fallbackBlogPosts
    return fallbackBlogPosts
  }
}

/**
 * Get a blog post by its slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const posts = await getAllBlogPosts()
  return posts.find((post) => post.slug === slug)
}

/**
 * Get all unique categories from blog posts
 */
export async function getAllCategories(): Promise<string[]> {
  try {
    const posts = await getAllBlogPosts()
    const categories = new Set(posts.map((post) => post.category))
    return Array.from(categories)
  } catch (error) {
    console.error('Error getting categories:', error)
    return defaultCategories
  }
}
