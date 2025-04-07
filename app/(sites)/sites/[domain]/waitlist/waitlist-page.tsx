'use client'

import { Typewriter } from '@/components/typewriter'
import { Button } from '@drivly/ui/button'
import { BookOpen, CheckCircle2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { FaGithub } from 'react-icons/fa6'

interface WaitlistPageProps {
  email: string
  name: string
  subtitle: string
}

const WaitlistPage = ({ email, name, subtitle }: WaitlistPageProps) => {
  const messages = [
    '// Thanks for joining .do waitlist!',
    '// We are working on a lot of new features and will be launching soon!',
    `// We'll notify you at ${email} when you have access.`,
  ]

  return (
    <div className='font-geist flex min-h-screen flex-col items-center justify-center bg-black text-white'>
      <div className='flex w-full max-w-2xl flex-col items-center space-y-8 px-4'>
        {/* Success Icon with Glow */}
        <div className='relative mt-8 mb-2'>
          <div className='absolute inset-0 rounded-full bg-[#00ff9d] opacity-70 blur-[20px]'></div>
          <div className='absolute inset-0 rounded-full bg-[#00a3ff] opacity-30 blur-[30px]'></div>
          <div className='relative rounded-full border-2 border-[#00ff9d]/30 bg-black p-3'>
            <CheckCircle2 className='h-10 w-10 text-[#00ff9d]' />
          </div>
        </div>

        {/* Heading with gradient text */}
        <div className='mb-10 space-y-1 text-center'>
          <h1 className='bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-4xl leading-none font-medium tracking-tighter text-balance text-transparent dark:from-white dark:to-white/40'>
            <span className=''>Thanks, </span>
            <span className=''>{name}!</span>
          </h1>
          <p className='text-lg text-gray-300'>{subtitle}</p>
        </div>

        {/* Terminal Code Box */}
        <div className='mb-6 w-full overflow-hidden rounded-lg border border-gray-800 bg-[#141923] shadow-lg'>
          <div className='flex items-center bg-[#0c111b] px-4 py-2'>
            <div className='flex space-x-2'>
              <div className='h-3 w-3 rounded-full bg-red-500'></div>
              <div className='h-3 w-3 rounded-full bg-yellow-500'></div>
              <div className='h-3 w-3 rounded-full bg-green-500'></div>
            </div>
            <div className='ml-4 text-sm text-gray-400'>waitlist.do</div>
          </div>
          <pre className='p-4 font-mono text-sm whitespace-pre-wrap text-[#00ff9d]'>
            <Typewriter examples={messages} />
          </pre>
        </div>

        {/* Call to Action Buttons - Matching reference */}
        <div className='grid w-full max-w-sm grid-cols-1 gap-4 md:grid-cols-2'>
          <Button variant='secondary' asChild>
            <Link href='https://github.com/drivly/ai' target='_blank'>
              <FaGithub className='h-4 w-4' />
              <span>Star on GitHub</span>
            </Link>
          </Button>
          <Button variant='outline' asChild>
            <Link href='/docs'>
              <BookOpen className='h-4 w-4' />
              <span>Explore Docs</span>
            </Link>
          </Button>
        </div>

        {/* Community Links - Simplified */}
        <div className='mt-8 text-center'>
          <p className='mb-4 text-gray-400'>Join our community</p>
          <div className='flex justify-center space-x-8'>
            <Link href='https://discord.gg/qus39VeA' className='text-gray-400 transition-colors hover:text-[#5865F2]'>
              <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z'></path>
              </svg>
            </Link>
            <Link href='https://github.com/drivly/ai' className='text-gray-400 transition-colors hover:text-white'>
              <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                <path
                  fillRule='evenodd'
                  d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                  clipRule='evenodd'></path>
              </svg>
            </Link>
            <Link href='https://dotdo.ai' className='text-gray-400 transition-colors hover:text-[#00ff9d]'>
              <ExternalLink className='h-6 w-6' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitlistPage
