import { Markdown } from '@/components/ui/markdown'

export function BlogContent({ markdown }: { markdown: string }) {
  return (
    <div className='prose prose-lg dark:prose-invert max-w-none'>
      <Markdown>{markdown}</Markdown>
    </div>
  )
}
