import { Badge } from '@/components/ui/badge'
import { slugify } from '@/lib/slugify'
import { Clock } from 'lucide-react'
import Link from 'next/link'
import { BlogPost } from './blog-posts'

interface BlogCardProps {
  post: BlogPost
}

// TODO: We don't actually have the whole blog post here, just the title, description, category, and slug, so calculating the reading time is a bit tricky

export function BlogCard({ post }: BlogCardProps) {
  return (
    <div className='flex h-full flex-col rounded-md border border-gray-800 p-4 transition-all duration-300 ease-in-out hover:scale-[1.015] hover:border-gray-700 hover:bg-black/50 hover:shadow-[0_0_15px_rgba(5,178,166,0.15)]'>
      <Link prefetch={true} href={`/blog/${post.slug || slugify(post.title)}`} className='flex h-full flex-grow flex-col justify-between'>
        <div className='flex flex-grow flex-col overflow-hidden p-4'>
          <h3 className='group-hover:text-primary line-clamp-2 text-xl font-semibold tracking-tight transition-colors'>{post.title}</h3>
          <p className='text-muted-foreground mt-2 line-clamp-2 flex-grow text-sm'>{post.description}</p>
        </div>
        <div className='mt-4 flex items-center justify-between'>
          <Badge variant='outline' className='text-xs'>
            {post.category}
          </Badge>
          <div className='text-muted-foreground flex items-center text-xs'>
            <Clock className='mr-1 h-3 w-3' />
            {post.readingTime || '3 min read'}
          </div>
        </div>
      </Link>
    </div>
  )
}

/**
 * Calculates the estimated reading time for a blog post
 *
 * In a real implementation, this would analyze the actual content
 * and calculate based on word count / average reading speed.
 *
 * @param post The blog post to calculate reading time for
 * @returns A formatted string with the reading time (e.g., "5 min read")
 */
export function getReadingTime(post: BlogPost): string {
  // This is a placeholder implementation
  // In a real app, you would:
  // 1. Count the actual words in the blog content
  // 2. Divide by average reading speed (e.g., 250 words per minute)
  // 3. Round up to the nearest minute

  // For now, we'll generate a consistent reading time based on the post slug length
  // to ensure the same post always shows the same reading time
  const minutes = Math.max(3, Math.min(15, Math.floor(post.slug?.length || 0 / 2)))
  return `${minutes} min read`
}
