import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { File, FileImage, Loader } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const thumbnailVariants = cva('flex-shrink-0', {
  variants: {
    variant: {
      default: '[&_svg]:text-muted-foreground',
      primary: '[&_svg]:text-primary',
      blue: '[&_svg]:text-blue-400',
    },
    size: {
      sm: '[&>div]:h-[24px] [&>div]:w-[24px] [&_svg]:h-[24px] [&_svg]:w-[24px]',
      default: '[&>div]:h-[32px] [&>div]:w-[32px] [&_svg]:h-[32px] [&_svg]:w-[32px]',
      lg: '[&>div]:h-[40px] [&>div]:w-[40px] [&_svg]:h-[40px] [&_svg]:w-[40px]',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

interface ThumbnailProps extends VariantProps<typeof thumbnailVariants> {
  showContent: boolean
  error: boolean
  type: 'image' | 'pdf' | 'other'
  thumbnailUrl?: string
  url: string
  name: string
  onImageError?: () => void
}

export const Thumbnail = ({ showContent, error, type, thumbnailUrl, url, name, onImageError, variant, size }: ThumbnailProps) => {
  return (
    <div className={cn(thumbnailVariants({ variant, size }))}>
      {!showContent ? (
        <div className='flex items-center justify-center'>
          <Loader className='!h-[20px] !w-[20px] animate-spin' />
        </div>
      ) : type === 'image' && !error ? (
        <div className='relative overflow-clip'>
          <Image
            src={thumbnailUrl || url}
            alt={name}
            width={100}
            height={100}
            className='flex shrink-0 -translate-x-px items-center justify-center overflow-hidden rounded-sm'
            onError={onImageError}
          />
        </div>
      ) : type === 'pdf' ? (
        <File />
      ) : (
        <FileImage />
      )}
    </div>
  )
}
