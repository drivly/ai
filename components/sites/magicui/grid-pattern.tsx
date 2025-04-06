'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'

interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: string
  strokeWidth?: number
  squares?: number[][]
  className?: string
  containerClassName?: string
}

export function GridPattern({
  width = 40,
  height = 40,
  x = 0,
  y = 0,
  strokeDasharray,
  strokeWidth = 1.5,
  squares = [[0, 0]],
  className,
  containerClassName,
  ...props
}: GridPatternProps) {
  const id = React.useId()
  const patternId = `pattern-${id}`

  return (
    <div className={cn('absolute inset-0 z-0', containerClassName)}>
      <svg className={cn('absolute inset-0 h-full w-full', className)} {...props}>
        <defs>
          <pattern id={patternId} width={width} height={height} patternUnits='userSpaceOnUse' x={x} y={y}>
            <path d={`M ${height} 0 L 0 0 0 ${width}`} fill='none' stroke='currentColor' strokeWidth={strokeWidth} strokeDasharray={strokeDasharray} />
          </pattern>
        </defs>
        <rect width='100%' height='100%' fill={`url(#${patternId})`} />
        {squares?.map(([x, y], i) => (
          <rect key={`rect-${i}`} width={width / 2} height={height / 2} x={x * width + width / 4} y={y * height + height / 4} className='fill-foreground' fill='currentColor' />
        ))}
      </svg>
    </div>
  )
}
