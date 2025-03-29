import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/types/blog"
import { Badge } from "@/components/ui/badge"

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md hover:translate-y-[-5px] duration-300 min-h-[400px] flex flex-col">
      <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
        <div className="relative h-1/2 w-full overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg?height=200&width=400&bg=161616"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-hidden">
          <h3 className="line-clamp-2 text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground flex-grow">{post.description}</p>
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {post.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(post.date.split("-").join("/")).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

