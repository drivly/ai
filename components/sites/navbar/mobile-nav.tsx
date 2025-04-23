import { JoinWaitlistButton } from '@/components/shared/join-waitlist-button'
import { navigation } from '@/components/site-config'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { type Dispatch, Fragment, type SetStateAction } from 'react'
import { IconType } from 'react-icons/lib'
import { backgroundAnimation, heightAnimation, translateAnimation } from './animations'

export interface MobileNavProps {
  domain?: string
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const MobileNav = ({ domain, isOpen, setOpen }: MobileNavProps) => {
  return (
    <Fragment>
      <motion.div
        className='bg-background/50 absolute inset-0 h-full min-h-0 w-full md:hidden'
        variants={backgroundAnimation}
        initial='initial'
        animate={isOpen ? 'enter' : 'exit'}
      />
      <MobileNavButton isOpen={isOpen} toggleOpen={() => setOpen(!isOpen)} />
      <AnimatePresence mode='wait'>
        {isOpen && (
          <motion.div
            variants={heightAnimation}
            initial='initial'
            animate='enter'
            exit='exit'
            className='!bg-background/95 fixed top-14 right-0 z-50 min-w-full overflow-hidden backdrop-blur-md md:hidden'>
            <nav className='w-full px-4 py-6'>
              <MobileNavMenu onClose={() => setOpen(false)} domain={domain} />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  )
}

export function MobileNavButton({ isOpen, toggleOpen }: { isOpen: boolean; toggleOpen: () => void }) {
  return (
    <button className='z-10 ml-auto cursor-pointer p-2 md:hidden' onClick={toggleOpen} aria-label='Toggle menu' aria-expanded={isOpen}>
      <div className='flex h-5 w-6 flex-col justify-between border border-transparent'>
        <span
          className={cn('h-0.5 w-full transform bg-current transition-transform duration-300', {
            'translate-y-2 rotate-45': isOpen,
          })}
        />
        <span
          className={cn('h-0.5 w-full bg-current transition-opacity duration-300', {
            'opacity-0': isOpen,
          })}
        />
        <span
          className={cn('h-0.5 w-full transform bg-current transition-transform duration-300', {
            '-translate-y-2 -rotate-45': isOpen,
          })}
        />
      </div>
    </button>
  )
}

export const getChar = (Icon: IconType | undefined, title: string) => {
  let chars: React.ReactNode[] = []

  if (Icon) {
    chars.push(
      <motion.span key={`icon_${Icon.name}`} custom={[0, title.length * 0.01]} variants={translateAnimation} initial='initial' animate='enter' exit='exit' className='inline-block'>
        <Icon className='mr-2 h-5 w-5' />
      </motion.span>,
    )
  }

  title.split('').forEach((char, index) => {
    chars.push(
      <motion.span
        key={`c_${index}`}
        custom={typeof Icon !== 'undefined' ? [(index + 1) * 0.02, (title.length - index - 1) * 0.01] : [index * 0.02, (title.length - index - 1) * 0.01]}
        variants={translateAnimation}
        initial='initial'
        animate='enter'
        exit='exit'
        className='inline-block'>
        {char}
      </motion.span>,
    )
  })

  return chars
}

export function MobileNavMenu({ onClose, domain }: { onClose: () => void; domain?: string }) {
  return (
    <ul className='flex flex-col space-y-3.5'>
      {navigation.map((link, index) => {
        if (link.name === 'Blog' && domain) {
          return <NavItem key={link.name} name={link.name} href={link.href} onClose={onClose} index={index} />
        } else if (link.name !== 'Blog' && link.href) {
          return (
            <NavItem
              key={link.name}
              name={link.name}
              href={link.href}
              target={'external' in link ? '_blank' : undefined}
              rel={'external' in link ? 'noopener noreferrer' : undefined}
              onClose={onClose}
              Icon={'icon' in link ? link.icon : undefined}
              index={index}
            />
          )
        }
      })}

      <li className='pt-4'>
        <JoinWaitlistButton className='h-10 w-full text-base transition-colors sm:text-sm' type='cta' />
      </li>
    </ul>
  )
}

interface NavItemProps {
  name: string
  href: string
  target?: string
  rel?: string
  Icon?: IconType
  onClose: () => void
  index: number
}

export const NavItem = ({ name, href, target, rel, Icon, onClose, index }: NavItemProps) => {
  return (
    <li>
      <Link
        className='hover:text-primary flex h-10 items-center overflow-hidden text-lg font-medium text-gray-400 transition-colors'
        href={href}
        target={target}
        rel={rel}
        onClick={onClose}>
        <p className='flex items-center'>{getChar(Icon, name)}</p>
      </Link>
    </li>
  )
}
