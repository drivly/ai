'use client'

import { DotdoLogo } from '@/components/shared/dotdo-logo'
import useConfetti from '@/components/shared/use-confetti'
import { Button } from '@/components/ui/button'
import { RiDiscordFill } from '@remixicon/react'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import ReactCanvasConfetti from 'react-canvas-confetti'

interface WaitlistProps {
  email: string
  name: string
}

export const Waitlist = ({ email, name }: WaitlistProps) => {
  const { canvasStyles, getInstance, fire } = useConfetti()
  const messages = ["// You're on the .do waitlist! 🎉", `// We'll notify you at ${email} when you have access.`, '// In the meantime, join our Discord community below 👇.']

  useEffect(() => {
    fire()
  }, [fire])

  return (
    <Fragment>
      <div className='font-geist flex min-h-screen flex-col items-center justify-center bg-black text-white'>
        <div className='flex w-full max-w-2xl flex-col items-center space-y-8 px-3'>
          <div className='relative flex flex-col items-center justify-center text-center'>
            <DotdoLogo className='mb-2 flex items-center justify-center' as='div' />
            <h1 className='bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-4xl leading-none font-medium tracking-tight text-balance text-transparent dark:from-white dark:to-white/40'>
              <span className=''>Thanks, </span>
              <span className=''>{name}!</span>
            </h1>
          </div>
          <div className='w-full overflow-hidden rounded-lg border border-gray-800 bg-[#141923]/30 shadow-lg'>
            <pre className='p-4 font-mono text-sm leading-8 whitespace-pre-wrap text-white/80'>
              <Typewriter examples={messages} />
            </pre>
          </div>
          <div className='flex w-full justify-center'>
            <Button variant='secondary' asChild className='h-10 w-full rounded-sm bg-[#7289da] text-black hover:bg-[#839AED] sm:w-1/3'>
              <Link href='https://discord.gg/26nNxZTz9X' target='_blank'>
                <RiDiscordFill className='h-4 w-4' />
                <span>Join community</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <ReactCanvasConfetti className='z-50' onInit={getInstance} style={canvasStyles} />
    </Fragment>
  )
}

interface TypewriterProps {
  examples: string[]
}

function Typewriter({ examples }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (!examples.length) return

    const interval = setInterval(() => {
      if (currentIndex >= examples.length) {
        clearInterval(interval)
        return
      }

      if (charIndex < examples[currentIndex].length) {
        setDisplayedText((prev) => prev + examples[currentIndex][charIndex])
        setCharIndex(charIndex + 1)
      } else {
        if (currentIndex < examples.length - 1) {
          setDisplayedText((prev) => prev + '\n')
          setCurrentIndex(currentIndex + 1)
          setCharIndex(0)
        } else {
          clearInterval(interval)
        }
      }
    }, 50)

    return () => clearInterval(interval)
  }, [examples, currentIndex, charIndex])

  return (
    <div className='whitespace-pre-line'>
      {displayedText}
      <span className='animate-pulse'>|</span>
    </div>
  )
}
