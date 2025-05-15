import { Markdown } from '@/components/ui/markdown'
import { cn } from '@/lib/utils'

export function MarkdownContent({ className, markdown }: { className?: string; markdown: string }) {
  return (
    <div className={cn('prose prose-lg dark:prose-invert max-w-none', className)}>
      <Markdown>{markdown}</Markdown>
    </div>
  )
}
