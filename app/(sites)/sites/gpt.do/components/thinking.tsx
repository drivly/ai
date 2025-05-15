import { cn } from '@/lib/utils'
import { Bot } from 'lucide-react'

// 1. Morphing Dots - dots that change size and opacity
function ThinkingDotsAnimation() {
  return (
    <div className='flex gap-1'>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn('bg-primary h-2 w-2 rounded-full', 'animate-[thinking_1.4s_ease-in-out_infinite]', i === 1 && 'animation-delay-200', i === 2 && 'animation-delay-400')}
        />
      ))}
    </div>
  )
}

// 2. Typing Cursor Effect
function ThinkingCursorEffect() {
  return <div className='bg-primary h-4 w-2 animate-[cursor_0.8s_step-end_infinite]' />
}

// 3. Circular Loading - dots moving in a circle
function ThinkingCircularDots() {
  return (
    <div className='relative h-8 w-8'>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={cn('bg-primary absolute h-1.5 w-1.5 rounded-full', 'animate-[circular_1.2s_linear_infinite]')}
          style={{
            left: '50%',
            top: '50%',
            transform: `rotate(${i * 45}deg) translate(0, -150%)`,
            opacity: 1 - i * 0.1,
            animationDelay: `${-i * 0.15}s`,
          }}
        />
      ))}
    </div>
  )
}

// 4. Gradient Wave
function ThinkingGradientWave() {
  return (
    <div className='relative h-6 w-16 overflow-hidden'>
      <div className={cn('absolute inset-0', 'via-primary bg-gradient-to-r from-transparent to-transparent', 'animate-[wave_2s_ease-in-out_infinite]')} />
    </div>
  )
}

// 5. Bouncing Bar Graph
function ThinkingBarGraph() {
  return (
    <div className='flex h-6 items-end gap-1'>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn('bg-primary w-1 rounded-t-sm', 'animate-[bounce_1s_ease-in-out_infinite]')}
          style={{
            animationDelay: `${i * 0.15}s`,
            height: `${Math.max(0.3, Math.random())}rem`,
          }}
        />
      ))}
    </div>
  )
}

export const thinking = {
  dots: <ThinkingDotsAnimation />,
  cursor: <ThinkingCursorEffect />,
  circular: <ThinkingCircularDots />,
  wave: <ThinkingGradientWave />,
  bar: <ThinkingBarGraph />,
}

export function ThinkingIndicator<T extends keyof typeof thinking>({ type, className }: { type: T; className?: string }) {
  return (
    <div className={cn('mt-3 flex items-center gap-2 px-4', className)}>
      <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
        <Bot className='text-primary h-4 w-4' />
      </div>

      {thinking[type]}

      <span className='text-muted-foreground text-sm'>AI is thinking...</span>
    </div>
  )
}
