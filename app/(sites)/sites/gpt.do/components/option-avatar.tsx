/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils'
import { useCallback, useState } from 'react'

export interface OptionAvatarProps<TSize extends number> {
  logoUrl?: string
  size: TSize
  direction: 'up' | 'down'
  imageIndex: number
}

const getOptimizedUrl = (url: string, width: number) => (url.includes('?') ? `${url}&width=${width}` : `${url}?width=${width}`)
const imagePriority = (index: number, direction: 'up' | 'down') => (direction === 'up' ? index < 5 : index > 5)

export const OptionAvatar = <TSize extends number>({ logoUrl, size, direction, imageIndex }: OptionAvatarProps<TSize>) => {
  const [error, setError] = useState(false)

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
      className={cn('relative overflow-hidden rounded-[4px] focus-visible:outline-none', `size-${twSize} `, {
        'opacity-50': !logoUrl,
      })}>
      <source media='(min-width: 0px)' srcSet={logoUrl} />
      <img
        src={getOptimizedUrl(logoUrl, size)}
        alt={logoUrl || 'Integration Logo'}
        className='absolute aspect-square size-auto object-cover focus-visible:outline-none'
        srcSet={logoUrl}
        loading={imagePriority(imageIndex, direction) ? 'eager' : 'lazy'}
        fetchPriority={imagePriority(imageIndex, direction) ? 'high' : 'low'}
        onError={onImageError}
        width={size}
        height={size}
        style={{ translate: `${imageIndex * -100}%` }}
      />
    </figure>
  )
}
