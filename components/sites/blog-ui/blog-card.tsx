import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { BlogPost } from './blog-posts'
import slugify from 'slugify'

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <div className='bg-card flex min-h-[400px] flex-col overflow-hidden rounded-lg border transition-all duration-300 hover:translate-y-[-5px] hover:shadow-md'>
      <Link href={`./blog/${post.slug || slugify(post.title)}`} className='group flex h-full flex-col'>
        <div className='relative h-1/2 w-full overflow-hidden'>
          <Image
            src={post.image || '/placeholder.svg?height=200&width=400&bg=161616'}
            alt={post.title}
            fill
            loading='lazy' // Added lazy loading to prevent timeout issues in CI (ENG-607)
            priority={false} // Ensure it's not prioritized
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
        </div>
        <div className='flex flex-grow flex-col overflow-hidden p-4'>
          <h3 className='group-hover:text-primary line-clamp-2 text-xl font-semibold tracking-tight transition-colors'>{post.title}</h3>
          <p className='text-muted-foreground mt-2 line-clamp-2 flex-grow text-sm'>{post.description}</p>
          <div className='mt-4 flex items-center justify-between'>
            <Badge variant='outline' className='text-xs'>
              {post.category}
            </Badge>
            <span className='text-muted-foreground text-xs'>
              {new Date(post.date?.split('-').join('/') || new Date().toISOString()).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
