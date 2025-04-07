import { Button } from '@/components/ui/button'
import { FaGithub } from 'react-icons/fa'
import { CodeWindow } from '@/components/sites/code-window'

interface HeroSectionProps {
  badge: string
  buttonText: string
  codeExample: string
  description: React.ReactNode
  title: React.ReactNode
}
export default function HeroSection(props: HeroSectionProps) {
  return (
    <section id='hero' className='relative mx-auto mt-32 max-w-[80rem] px-6 text-center md:px-8 lg:mt-48'>
      <div className='group inline-flex h-7 items-center justify-between gap-1 rounded-full border border-white/5 bg-white/10 px-3 text-xs text-white backdrop-filter-[12px] transition-all ease-in hover:cursor-pointer hover:bg-white/20 dark:text-black'>
        <p className='mx-auto inline-flex max-w-md items-center justify-center text-neutral-600/50 dark:text-neutral-400/50'>
          <span>{props.badge}</span>
        </p>
      </div>
      <h1 className='bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl leading-none font-medium tracking-tighter text-balance text-transparent sm:text-7xl dark:from-white dark:to-white/40'>
        {props.title}
      </h1>
      <p className='mb-12 text-lg tracking-tight text-balance text-gray-400 md:text-xl'>{props.description}</p>
      <Button className='gap-2 rounded-lg text-white ease-in-out dark:text-black'>
        <FaGithub className='h-4 w-4' />
        <span>{props.buttonText}</span>
      </Button>

      {/* Code window with glow effect */}
      <div className='relative mt-[2rem] -mr-[20%] w-[120%] sm:mt-[4rem] md:mx-auto md:w-auto md:max-w-3xl'>
        {/* Add the green glow effect directly behind the code window */}
        <div
          className='absolute -inset-10 -z-10 opacity-70 blur-2xl'
          style={{
            background: 'radial-gradient(circle at center, #05b2a6, transparent 70%)',
            transform: 'translateY(20px)',
          }}
        />

        <div>
          <CodeWindow code={props.codeExample} />
        </div>
      </div>
    </section>
  )
}
