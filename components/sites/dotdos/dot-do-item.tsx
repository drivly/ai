import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export interface DotDoItemProps {
  title: string
  description?: string
  href: string
  mounted: boolean
  hasSdk?: boolean
  tags?: string[]
  links?: Array<{
    title: string
    url: string
  }>
  currentTld?: string
  domain?: string // Add domain prop to ensure correct TLD handling
}

export const DotDoItem = ({ title, description, href, mounted, hasSdk, tags, links, currentTld = '', domain }: DotDoItemProps) => {
  const itemDomain = domain || (href.startsWith('https://') ? href.substring(8) : title)

  if (!mounted && process.env.NODE_ENV === 'development') {
    return (
      <div className='relative flex h-full flex-col rounded-md border border-gray-800 bg-slate-700/15 bg-[linear-gradient(rgba(0,0,0,0)_0%,_rgb(0,0,0)_100%,_rgb(0,0,0)_100%)] p-5 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg'>
        <h3 className='relative z-10 mb-2 text-xl font-semibold tracking-tight'>{title}</h3>
        <p className='text-muted-foreground relative z-10 mb-auto text-sm opacity-70'>{description || ''}</p>
      </div>
    )
  }

  return (
    <div className='relative flex h-full flex-col rounded-md border border-gray-800 bg-slate-700/15 bg-[linear-gradient(rgba(0,0,0,0)_0%,_rgb(0,0,0)_100%,_rgb(0,0,0)_100%)] p-5 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg'>
      <Link href={href} className='mb-auto block'>
        <h3 className='relative z-10 mb-2 text-xl font-semibold tracking-tight'>{title}</h3>
        <p className='text-muted-foreground relative z-10 text-sm opacity-70'>{description || ''}</p>
      </Link>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className='relative z-10 mt-3 flex flex-wrap gap-2'>
          {tags.map((tag, index) => (
            <Badge key={index} variant='outline' className='border-white/10 bg-white/5 text-xs'>
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Links */}
      <div className='relative z-10 mt-4 flex flex-wrap gap-2'>
        {/* Default links */}
        <a href={`https://${itemDomain}${currentTld}/api`} target='_blank' rel='noopener noreferrer'>
          <Badge variant='secondary' className='cursor-pointer border-white/10 bg-white/5 text-xs hover:bg-white/10'>
            API
          </Badge>
        </a>
        {hasSdk && (
          <a href={`https://www.npmjs.com/package/${itemDomain.replace(/\.do(\.gt|\.mw)?$/, '')}`} target='_blank' rel='noopener noreferrer'>
            <Badge variant='secondary' className='cursor-pointer border-white/10 bg-white/5 text-xs hover:bg-white/10'>
              SDK
            </Badge>
          </a>
        )}
        <a href={`https://${itemDomain}${currentTld}/docs`} target='_blank' rel='noopener noreferrer'>
          <Badge variant='secondary' className='cursor-pointer border-white/10 bg-white/5 text-xs hover:bg-white/10'>
            Docs
          </Badge>
        </a>

        {/* Custom links from YAML */}
        {links &&
          links.map((link, index) => (
            <a key={index} href={link.url} target='_blank' rel='noopener noreferrer'>
              <Badge variant='secondary' className='cursor-pointer border-white/10 bg-white/5 text-xs hover:bg-white/10'>
                {link.title}
              </Badge>
            </a>
          ))}
      </div>
    </div>
  )
}
