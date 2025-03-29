"use client"

import { useState } from "react"
import { BlogCard } from "@/components/blog/blog-card"
import { CategoryFilter } from "@/components/blog/category-filter"
import { Search } from "@/components/blog/search"
import type { BlogPost } from "@/types/blog"

interface BlogPageClientProps {
  initialPosts: BlogPost[]
  categories: string[]
}

export function BlogPageClient({ initialPosts, categories }: BlogPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Filter posts based on search query and selected categories
  const filteredPosts = initialPosts.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(post.category)

    return matchesSearch && matchesCategory
  })

  return (
    <>
      <div className="mb-8 grid gap-6 md:grid-cols-3 items-center">
        <div className="md:col-span-2">
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onSelectCategories={setSelectedCategories}
          />
        </div>
        <div className="md:col-span-1">
          <Search value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="mt-12 text-center">
          <h2 className="text-xl font-medium">No posts found</h2>
          <p className="mt-2 text-muted-foreground">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  )
}

