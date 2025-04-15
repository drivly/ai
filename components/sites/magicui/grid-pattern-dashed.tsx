'use client'

import { cn } from '@/lib/utils'
import { GridPattern } from './grid-pattern'

export function GridPatternDashed() {
  return (
    <div className='absolute inset-0 z-0 overflow-hidden'>
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={'4 2'}
        className={cn('text-gray-500 opacity-30 [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]')}
      />
    </div>
  )
}
