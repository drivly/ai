import { getAllBlogPosts, getAllCategories } from "@/lib/blog"
import { BlogPageClient } from "@/components/blog/blog-page-client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BlogPage() {
  // Move data fetching to the server component
  const posts = getAllBlogPosts()
  const categories = getAllCategories()

  return (
    <div className="container px-4 pt-20 pb-12 md:pt-24 md:pb-24 lg:pb-32">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center mb-4 text-sm text-gray-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Link>
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Blog</h1>
      </div>

      <BlogPageClient initialPosts={posts} categories={categories} />
    </div>
  )
}

