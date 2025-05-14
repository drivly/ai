import React from 'react'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Attachment } from './attachment'

export interface AttachmentFile {
  id: string
  file: File
  type: 'image' | 'pdf' | 'other'
  url?: string // For preview
  thumbnailUrl?: string // For chat display
  isUploading: boolean
  uploadProgress: number
  error?: string
  metadata?: {
    name: string
    size: number
    dimensions?: {
      width: number
      height: number
    }
    pageCount?: number // For PDFs
  }
}

interface FilePreviewProps {
  attachments: AttachmentFile[]
  onRemove: (id: string) => void
  className?: string
}

export function FilePreview({ attachments, onRemove, className }: FilePreviewProps) {
  if (attachments.length === 0) return null

  return (
    <AnimatePresence>
      {attachments.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={cn('bg-accent dark:bg-background w-full overflow-hidden', className)}
        >
          <div className='flex items-center gap-[12px] overflow-x-auto p-[12px] transition-opacity'>
            {attachments.map((attachment) => (
              <Attachment
                key={attachment.id}
                id={attachment.id}
                url={attachment.url || ''}
                thumbnailUrl={attachment.thumbnailUrl}
                name={attachment.file.name}
                type={attachment.type}
                size={attachment.file.size}
                onRemove={onRemove}
                compact
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
