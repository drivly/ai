import { getBlogPostBySlug } from "@/lib/blog"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { BlogContent } from "@/components/blog/blog-content"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ShareButtons } from "@/components/blog/share-buttons"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Use a relative URL instead of constructing with environment variables
  const postUrl = `/blog/${post.slug}`

  // Default fallback image
  const fallbackImage = "/images/blog-llm.png"

  // Format date manually to avoid potential issues
  const dateObj = new Date(post.date.split("-").join("/"))
  const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString("default", { month: "short" })} ${dateObj.getFullYear()}`

  return (
    <div className="container max-w-4xl px-4 pt-24 pb-12 md:pt-32">
      <Link
        href="/blog"
        className="inline-flex items-center mb-6 text-sm text-gray-500 hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Link>

      <div className="mb-8">
        <Badge variant="blog" className="mb-4">
          {post.category}
        </Badge>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-xl text-muted-foreground">{post.description}</p>
        <div className="mt-4 flex flex-row items-center justify-between gap-2">
          <div className="text-sm text-muted-foreground">{formattedDate}</div>
          <ShareButtons title={post.title} url={postUrl} hideLabel={true} />
        </div>
      </div>

      <div className="relative mb-8 h-[400px] w-full overflow-hidden rounded-lg">
        <Image src={post.image || fallbackImage} alt={post.title} fill className="object-cover" priority />
      </div>

      <BlogContent />
    </div>
  )
}

