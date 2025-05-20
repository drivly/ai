/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils'
import { useCallback, useState } from 'react'

export interface OptionAvatarProps<TSize extends number> {
  className?: string
  logoUrl?: string
  size: TSize
  direction: 'up' | 'down'
  imageIndex: number
  label?: string
}

const getOptimizedUrl = (url: string, width: number) => (url.includes('?') ? `${url}&width=${width}` : `${url}?width=${width}`)

export const OptionAvatar = <TSize extends number>({ logoUrl, size, direction, imageIndex, label, className }: OptionAvatarProps<TSize>) => {
  const [error, setError] = useState(false)

  const isOpenAI = label?.toLowerCase().includes('openai')
  const twSize = Math.round(size / 4)

  const onImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.preventDefault()
    setError(true)
  }, [])

  if (!logoUrl) return null

  if (error) {
    return <div className={cn('bg-muted-foreground/50 aspect-auto rounded-[4px]', `size-${twSize} `)} />
  }

  return (
    <figure
      className={cn('relative overflow-hidden rounded-[4px] focus-visible:outline-none', `size-${twSize} `, className, {
        'opacity-50': !logoUrl,
        'dark:invert': isOpenAI,
      })}>
      <source media='(min-width: 0px)' srcSet={logoUrl} />
      <img
        src={getOptimizedUrl(logoUrl, size)}
        alt={logoUrl || 'Integration Logo'}
        className='absolute aspect-square size-auto rounded-[4px] object-fill focus-visible:outline-none'
        srcSet={logoUrl}
        loading='eager'
        fetchPriority='high'
        onError={onImageError}
        width={size}
        height={size}
        style={{ translate: `${imageIndex * -100}%` }}
      />
    </figure>
  )
}
