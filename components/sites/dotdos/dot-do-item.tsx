import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export interface DotDoItemProps {
  title: string
  description: string
  href: string
  mounted: boolean
  hasSdk?: boolean
}

export const DotDoItem = ({ title, description, href, mounted, hasSdk }: DotDoItemProps) => {
  const domain = href.startsWith('https://') ? href.substring(8) : title

  if (!mounted) {
    return (
      <div className='relative flex h-full flex-col rounded-md border border-gray-800 bg-slate-700/15 bg-[linear-gradient(rgba(0,0,0,0)_0%,_rgb(0,0,0)_100%,_rgb(0,0,0)_100%)] p-5 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg'>
        <h3 className='relative z-10 mb-2 text-xl font-semibold tracking-tight'>{title}</h3>
        <p className='text-muted-foreground relative z-10 mb-auto text-sm opacity-70'>{description}</p>
      </div>
    )
  }

  return (
    <Link
      href={href}
      className='relative flex h-full flex-col rounded-md border border-gray-800 bg-slate-700/15 bg-[linear-gradient(rgba(0,0,0,0)_0%,_rgb(0,0,0)_100%,_rgb(0,0,0)_100%)] p-5 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg'>
      <h3 className='relative z-10 mb-2 text-xl font-semibold tracking-tight'>{title}</h3>
      <p className='text-muted-foreground relative z-10 mb-auto text-sm opacity-70'>{description}</p>
      <div className='relative z-10 mt-4 flex flex-wrap gap-2'>
        <a href={`https://${domain}/api`} target='_blank' rel='noopener noreferrer'>
          <Badge variant='secondary' className='cursor-pointer border-white/10 bg-white/5 text-xs hover:bg-white/10'>
            API
          </Badge>
        </a>
        {hasSdk && (
          <a href={`https://www.npmjs.com/package/${domain.replace('.do', '')}`} target='_blank' rel='noopener noreferrer'>
            <Badge variant='secondary' className='cursor-pointer border-white/10 bg-white/5 text-xs hover:bg-white/10'>
              SDK
            </Badge>
          </a>
        )}
        <a href={`https://${domain}/docs`} target='_blank' rel='noopener noreferrer'>
          <Badge variant='secondary' className='cursor-pointer border-white/10 bg-white/5 text-xs hover:bg-white/10'>
            Docs
          </Badge>
        </a>
      </div>
    </Link>
  )
}
