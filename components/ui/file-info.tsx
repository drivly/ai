import React from 'react'
import { formatFileSize } from '../../lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const fileVariants = cva('font-geist grid gap-[4px] leading-none font-medium [&_p]:overflow-hidden [&_p]:text-ellipsis', {
  variants: {
    variant: {
      default: 'text-muted-foreground',
      secondary: 'text-secondary',
    },
    size: {
      default: 'text-[12px] py-[2px]',
      md: 'text-[13px] py-[3px]',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export const FileInfo = ({
  title,
  fileSize,
  variant,
  size,
  contentType,
}: React.ComponentProps<'div'> &
  VariantProps<typeof fileVariants> &
  (
    | {
        contentType?: never
        fileSize: number
      }
    | { contentType: 'image' | 'pdf' | 'other'; fileSize?: never }
  )) => {
  return (
    <div className={fileVariants({ variant, size })}>
      <p title={title} className='line-clamp-1 overflow-hidden text-ellipsis'>
        {title}
      </p>
      <p>{fileSize ? formatFileSize(fileSize || 0) : contentType}</p>
    </div>
  )
}
