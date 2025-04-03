import Link from 'next/link'
import { Badge } from '../badge'

export interface DotDoItemProps {
  title: string
  description: string
  href: string
  type: 'External' | 'Internal'
  mounted: boolean
  glowColor: string
}

export const DotDoItem = ({ title, description, href, mounted, glowColor, type }: DotDoItemProps) => {
  return (
    <Link
      href={href}
      className='relative flex h-full flex-col rounded-xl border border-white/10 bg-black/20 p-5 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:shadow-lg'
      style={{
        boxShadow: mounted ? `0 0 20px -15px ${glowColor}` : undefined,
      }}>
      {mounted && (
        <div
          className='absolute inset-0 rounded-xl opacity-5 transition-opacity duration-300 hover:opacity-10'
          style={{ background: `linear-gradient(135deg, ${glowColor}40 0%, transparent 100%)` }}
        />
      )}
      <h3 className='relative z-10 mb-3 text-xl font-semibold tracking-tight'>{title}</h3>
      <p className='text-muted-foreground relative z-10 mb-auto text-sm opacity-70'>{description}</p>
      <Badge variant='secondary' className='relative z-10 mt-4 self-start border-white/10 bg-white/5 text-xs'>
        {type}
      </Badge>
    </Link>
  )
}
