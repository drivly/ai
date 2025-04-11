import { ai } from '@/ai.config'
import type { BlogPost } from '@/components/sites/blog-ui/blog-posts'
import { titleToSlug } from '@/lib/utils/slug'
import { getAllBlogPosts } from '@/app/(sites)/sites/[domain]/blog/blog-posts'

const categories = [
  'AI Functions',
  'Language Models',
  'Industry Insights',
  'Best Practices',
  'Ethics',
  'Tutorials',
  'Machine Learning',
  'Developer Tools',
  'Case Studies',
]

const imagePaths = [
  '/images/blog-functions.png',
  '/images/blog-llm.png',
  '/images/apis-plus-ai.png',
  '/placeholder.svg?height=200&width=400',
]

/**
 * Generate a list of blog posts with AI-generated titles
 */
export async function generateBlogPosts(domain: string, count: number = 9, topics?: string): Promise<BlogPost[]> {
  try {
    const titles = await ai.listBlogPostTitles({
      domain,
      count,
      topics,
    })

    const today = new Date()
    const dateString = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`

    return titles.map((title: string, index: number) => {
      return {
        slug: titleToSlug(title),
        title: title,
        description: `AI-generated blog post about ${title.toLowerCase()}`,
        date: dateString,
        category: categories[index % categories.length],
        image: imagePaths[index % imagePaths.length],
      }
    })
  } catch (error) {
    console.error('Error generating blog posts:', error)
    return getAllBlogPosts()
  }
}

/**
 * Get the content for a specific blog post by title
 */
export async function getBlogPostContent(title: string, domain: string): Promise<string> {
  try {
    const content = await ai.writeBlogPost({
      title,
      domain,
    })
    
    return content
  } catch (error) {
    console.error('Error generating blog post content:', error)
    return '### Error generating content\nUnable to generate content for this blog post. Please try again later.'
  }
}
