'use client'

import { useState } from 'react'
import { BlogCard } from './blog-card'
import { CategoryFilter } from './category-filter'
import { Search } from './search'
import { slugify } from '@/lib/slugify'

export interface BlogPost {
  slug?: string
  title: string
  description: string
  date?: string
  readingTime?: string // Add this field
  category: string
  image?: string
  markdown?: string
}

interface BlogPageClientProps {
  initialPosts: BlogPost[]
  categories: string[]
}

export function BlogPosts({ initialPosts, categories }: BlogPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Filter posts based on search query and selected categories
  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch = searchQuery === '' || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(post.category)

    return matchesSearch && matchesCategory
  })

  return (
    <>
      <div className='mb-8 grid items-center gap-6 md:grid-cols-3'>
        <div className='md:col-span-2'>
          <CategoryFilter categories={categories} selectedCategories={selectedCategories} onSelectCategories={setSelectedCategories} />
        </div>
        <div className='md:col-span-1'>
          <Search value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className='mt-12 text-center'>
          <h2 className='text-xl font-medium'>No posts found</h2>
          <p className='text-muted-foreground mt-2'>Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      ) : (
        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug || slugify(post.title)} post={post} />
          ))}
        </div>
      )}
    </>
  )
}
