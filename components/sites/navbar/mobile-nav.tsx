import { JoinWaitlistButton } from '@/components/shared/join-waitlist-button'
import { navigation } from '@/components/site-config'
import { cn } from '@drivly/ui/lib'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { type Dispatch, Fragment, type SetStateAction, useState } from 'react'
import { IconType } from 'react-icons/lib'
import { backgroundAnimation, blurAnimation, heightAnimation, translateAnimation } from './animations'

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
    <button className='z-10 ml-auto p-2 md:hidden' onClick={toggleOpen} aria-label='Toggle menu' aria-expanded={isOpen}>
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

export const getChar = (title: string) => {
  let chars: React.ReactNode[] = []
  title.split('').forEach((char, index) => {
    chars.push(
      <motion.span
        key={`c_${index}`}
        custom={[index * 0.02, (title.length - index) * 0.01]}
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
  const [hovered, setHovered] = useState({ isActive: false, index: 0 })
  return (
    <ul className='flex flex-col space-y-6'>
      {navigation.map((link, index) => {
        if (link.name === 'Blog' && domain) {
          return (
            <NavItem key={link.name} name={link.name} href={link.href} onClose={onClose} index={index} setHovered={setHovered} hovered={hovered}>
              {getChar(link.name)}
            </NavItem>
          )
        } else if (link.name !== 'Blog' && link.href) {
          return (
            <NavItem
              key={link.name}
              name={link.name}
              href={link.href}
              target={'target' in link ? link.target : undefined}
              rel={'rel' in link ? link.rel : undefined}
              onClose={onClose}
              Icon={'icon' in link ? link.icon : undefined}
              index={index}
              setHovered={setHovered}
              hovered={hovered}>
              {getChar(link.name)}
            </NavItem>
          )
        }
      })}

      <li className='pt-4'>
        <JoinWaitlistButton className='w-full bg-white text-sm transition-colors'>Join waitlist</JoinWaitlistButton>
      </li>
    </ul>
  )
}

interface NavItemProps {
  children: React.ReactNode
  name: string
  href: string
  target?: string
  rel?: string
  Icon?: IconType
  onClose: () => void
  index: number
  setHovered: Dispatch<SetStateAction<{ isActive: boolean; index: number }>>
  hovered: { isActive: boolean; index: number }
}

export const NavItem = ({ children, name, href, target, rel, Icon, onClose, index, setHovered, hovered }: NavItemProps) => {
  return (
    <li onMouseOver={() => setHovered({ isActive: true, index })} onMouseLeave={() => setHovered({ isActive: false, index })}>
      <Link
        className='hover:text-primary flex items-center overflow-hidden text-lg font-medium text-gray-200 transition-colors'
        href={href}
        target={target}
        rel={rel}
        onClick={onClose}>
        <motion.p variants={blurAnimation} initial='initial' animate={hovered.isActive && hovered.index !== index ? 'blur' : 'unblur'} className='flex items-center'>
          {Icon && (
            <motion.span
              key={`c_${index}`}
              custom={[index * 0.02, (name.length - index) * 0.01]}
              variants={translateAnimation}
              initial='initial'
              animate='enter'
              exit='exit'
              className='inline-block'>
              <Icon className='mr-2 h-5 w-5' />
            </motion.span>
          )}
          {children}
        </motion.p>
      </Link>
    </li>
  )
}
