import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from './button'
import { FileInfo } from './file-info'
import { PromptInputAction } from './prompt-input'
import { Thumbnail } from './thumbnail'

export interface AttachmentProps {
  id: string
  url: string
  thumbnailUrl?: string
  name: string
  type: 'image' | 'pdf' | 'other'
  size?: number
  onView?: (id: string) => void
  onRemove?: (id: string) => void
  className?: string
  compact?: boolean
}

export function Attachment({ id, url, thumbnailUrl, name, type, size, onRemove, className, compact = false }: AttachmentProps) {
  const [showContent, setShowContent] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  const handleImageError = () => {
    setError(true)
  }

  // compact version
  if (compact) {
    return (
      <PromptInputAction delayDuration={0} className='rounded-sm bg-black p-1 dark:bg-white' tooltip='File preview'>
        <div
          className={cn(
            'group bg-card hover:bg-accent border-border relative flex h-[40px] w-[150px] cursor-pointer items-center gap-[8px] rounded-sm border py-[4px] pr-[12px] pl-[4px] transition-colors duration-200 ease-out dark:bg-[#141415] hover:dark:bg-[#1f1f22]',
            className,
          )}
        >
          <Thumbnail showContent={showContent} error={error} type={type} thumbnailUrl={thumbnailUrl} url={url} name={name} />
          <FileInfo title={name} fileSize={size || 0} />

          {/* X button */}
          {onRemove && (
            <PromptInputAction delayDuration={0} tooltip='Remove'>
              <Button
                variant='ghost'
                size='icon'
                className="border-border bg-background/50 text-primary hover:bg-accent hover:text-primary absolute -top-2 -right-2 h-[16px] w-[16px] cursor-pointer rounded-full border-2 p-0 shadow-none [&_svg:not([class*='size-'])]:size-3"
                onClick={() => onRemove(id)}
              >
                <X />
              </Button>
            </PromptInputAction>
          )}
        </div>
      </PromptInputAction>
    )
  }

  // in-message (larger) version -no remove button
  return (
    <div
      className={cn(
        'group bg-card hover:bg-accent border-border relative flex h-[56px] w-[210px] cursor-pointer items-center gap-[8px] rounded-sm border py-[8px] pr-[12px] pl-[8px] transition-colors duration-200 ease-out dark:bg-[#141415] hover:dark:bg-[#1f1f22]',
        className,
      )}
    >
      <Thumbnail showContent={showContent} error={error} type={type} thumbnailUrl={thumbnailUrl} url={url} name={name} size='lg' />
      <FileInfo title={name} size='md' contentType={type} />
    </div>
  )
}
