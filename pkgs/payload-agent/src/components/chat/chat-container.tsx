'use client'

import { Button } from '../ui/button'
import { ChatContainer } from '../ui/chat-container'
import { useCheckMobile, useOutsideClick } from '../ui/hooks'
import { cn } from '@/lib/utils'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable'
import { ScrollButton } from '../ui/scroll-button'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '../ui/sheet'
import { MessageSquareText, X, XIcon } from 'lucide-react'
import type { ForwardRefComponent, HTMLMotionProps } from 'motion/react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import type { ReactNode } from 'react'
import React, { Fragment, useEffect, useRef } from 'react'
import { PanelGroup } from 'react-resizable-panels'
import { useAuthResult, useCommand } from '@/hooks'
import type { PayloadAgentAuthResult } from '../../types/auth'
import { ChatProvider, useChatMessages } from '../store/context'
import type { Suggestion } from '../store/modal-store'
import { useModal, useModalConfig, useModalUser } from '../store/modal-store'
import { DefaultMessage } from '../ui'
import { ChatInput } from './chat-input'
import { ChatMessage } from './chat-message'

export interface RootProps extends React.ComponentProps<'div'> {
  aiAvatar?: string | null
  defaultMessage?: string
  initialAuthResult: PayloadAgentAuthResult
  logo?: string
  suggestions?: Suggestion[]
  getAuthResult?: () => Promise<PayloadAgentAuthResult>
  requireAuth?: boolean
}

export interface ResizableRootProps extends RootProps {
  layoutChildren: ReactNode
  direction?: 'horizontal' | 'vertical'
}

export interface ModalProps extends ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>> {
  children: ReactNode
  className?: string
  withOutsideClick?: boolean
  withOverlay?: boolean
}

export interface HeaderProps extends React.ComponentProps<'div'> {
  buttonStyle?: string
  logoStyle?: string
  titleStyle?: string
}

const useChatContainer = (props: RootProps) => {
  const { aiAvatar, defaultMessage, logo, title, suggestions, initialAuthResult, getAuthResult, requireAuth = !!getAuthResult } = props

  const authResult = useAuthResult({ initialAuthResult, getAuthResult })
  const { setConfig } = useModalConfig()
  const { setUser } = useModalUser()

  useEffect(() => {
    if (logo) setConfig({ aiAvatar, defaultMessage, logo, suggestions })
    else if (title) setConfig({ aiAvatar, defaultMessage, title, suggestions })
  }, [defaultMessage, logo, setConfig, authResult, setUser, title, suggestions, aiAvatar])

  if (requireAuth && !authResult?.user) return null

  return { authResult }
}

const withChatContainer = <TProps extends RootProps>(WrappedComponent: React.ComponentType<TProps>) => {
  return (props: TProps) => {
    const result = useChatContainer(props)
    if (!result) return null
    return <WrappedComponent {...props} />
  }
}

const BaseContainer = ({ children, className }: RootProps) => (
  <ChatProvider>
    <div data-chat-widget='root' className={cn('fixed right-[16px] bottom-[16px] z-50 h-0 w-full', className)}>
      {children}
    </div>
  </ChatProvider>
)

const PanelContainer = ({ children, className }: RootProps) => {
  const { isOpen, open } = useModal()

  return (
    <ChatProvider>
      <Sheet open={isOpen} onOpenChange={open}>
        <div data-chat-widget='panel' className={cn('fixed right-[16px] bottom-[16px] z-50 h-0 w-full', className)}>
          {children}
        </div>
      </Sheet>
    </ChatProvider>
  )
}

const ResizableContainer = ({ children, className, direction = 'horizontal', layoutChildren }: ResizableRootProps) => (
  <ChatProvider>
    <ResizablePanelGroup direction={direction} autoSaveId='resizable-chat' autoSave='localStorage' className={className}>
      <ResizablePanel defaultSize={100} minSize={25} className='scrollbar-hide h-full min-h-screen !overflow-x-hidden !overflow-y-scroll'>
        {layoutChildren}
      </ResizablePanel>
      {children}
    </ResizablePanelGroup>
  </ChatProvider>
)

const PanelRoot = withChatContainer(PanelContainer)
const Root = withChatContainer(BaseContainer)
const ResizableRoot = withChatContainer(ResizableContainer)

function Panel({ className, withOverlay, ...props }: React.ComponentProps<typeof SheetContent> & { withOverlay?: boolean }) {
  return (
    <SheetContent
      data-chat-widget='panel-content'
      closeButton={false}
      overlay={withOverlay}
      className={cn(
        'bg-background border-border font-geist z-50 flex w-full max-w-full flex-col overflow-hidden border shadow-2xl sm:w-[600px] sm:max-w-1/2 dark:bg-[#0f0f10]',
        className,
      )}
    >
      <SheetTitle className='sr-only'>Chat</SheetTitle>
      <SheetDescription className='sr-only'>Chat panel description</SheetDescription>
      {props.children}
    </SheetContent>
  )
}

const modalVariants = (isMobile: boolean) => ({
  initial: {
    x: isMobile ? 0 : '100%',
    y: isMobile ? '100%' : 0,
  },
  animate: {
    x: 0,
    y: 0,
    transition: {
      type: 'tween',
      duration: 0.2,
    },
  },
  exit: {
    x: isMobile ? 0 : '100%',
    y: isMobile ? '100%' : 0,
    transition: {
      type: 'tween',
      duration: 0.2,
    },
  },
})

const Modal = ({ children, className, withOutsideClick = true, withOverlay = false, ...props }: ModalProps) => {
  const { isOpen, open } = useModal()
  const modalRef = useOutsideClick({ isOpen, open, withOutsideClick })
  const isMobile = useCheckMobile()

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {withOverlay && (
            <motion.div
              data-chat-widget='overlay'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className='fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] dark:bg-black/60'
            />
          )}
          <motion.div
            data-chat-widget='modal-content'
            ref={modalRef}
            variants={modalVariants(isMobile)}
            initial='initial'
            animate='animate'
            exit='exit'
            className={cn(
              'bg-background border-border font-geist fixed inset-x-0 bottom-0 z-50 flex h-[99%] w-full max-w-full flex-col overflow-hidden rounded-t-xl border shadow-2xl sm:inset-x-auto sm:right-[16px] sm:bottom-[80px] sm:h-[85vh] sm:w-[500px] sm:rounded-xl dark:bg-[#0f0f10]',
              className,
            )}
            {...props}
          >
            {children}
          </motion.div>
        </Fragment>
      )}
    </AnimatePresence>
  )
}

const Resizable = ({
  children,
  ...props
}: React.ComponentProps<typeof PanelGroup> & {
  className?: string
}) => {
  const { isOpen } = useModal()

  return (
    <Fragment>
      {isOpen && <ResizableHandle withHandle />}
      {isOpen && (
        <ResizablePanel
          defaultSize={30}
          minSize={25}
          maxSize={70}
          className={cn('bg-background border-border font-geist z-50 flex w-full max-w-full flex-col overflow-hidden border shadow-2xl dark:bg-[#0f0f10]', props.className)}
        >
          {children}
        </ResizablePanel>
      )}
    </Fragment>
  )
}

const Trigger = (props: React.ComponentProps<'button'>) => {
  const { isOpen, open } = useModal()
  useCommand()

  return (
    <button
      data-chat-widget='trigger-button'
      type='button'
      className={cn(
        'group bg-background/80 border-input hover:bg-background hover:border-border text-muted-foreground hover:text-primary absolute right-0 bottom-0 z-[1] flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border transition-all duration-200 ease-out',
        props.className,
      )}
      onClick={() => open(!isOpen)}
    >
      {isOpen ? (
        <>
          <XIcon size={18} />
        </>
      ) : (
        <>{props.children ? props.children : <MessageSquareText size={18} />}</>
      )}
    </button>
  )
}

const Header = ({ className, buttonStyle, logoStyle, titleStyle, ...props }: HeaderProps) => {
  const { open } = useModal()
  const { config } = useModalConfig()

  return (
    <div
      data-chat-widget='header'
      aria-label='Chat header'
      className={cn(
        'border-border bg-background [&>h2]:font-geist [&>h2]:text-primary flex w-full items-center justify-between border-b p-[16px] dark:bg-[#0f0f10] [&>h2]:text-[14px] [&>h2]:font-semibold',
        className,
      )}
      {...props}
    >
      {config.title && (
        <h2 aria-label='Chat title' className={cn(titleStyle)}>
          {config.title}
        </h2>
      )}
      {config.logo && <Image aria-label='Chat logo' src={config.logo} alt='Chat Logo' width={46} height={24} className={cn('invert-0 dark:invert', logoStyle)} priority />}
      <Button
        onClick={() => open(false)}
        className={cn('hover:bg-muted text-muted-foreground hover:text-primary h-8 w-8 cursor-pointer rounded-md border-none bg-transparent transition-colors', buttonStyle)}
        aria-label='Close chat'
      >
        <X className='h-5 w-5' />
      </Button>
    </div>
  )
}

function Content() {
  const { isOpen } = useModal()
  const { messages } = useChatMessages()
  const { config } = useModalConfig()

  const containerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const bottomRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>

  if (!isOpen) return null

  return (
    <Fragment>
      <ChatContainer data-chat-widget='chat-container' className='flex flex-1 flex-col overflow-y-auto px-2 py-4' ref={containerRef}>
        {messages.length === 0 && <DefaultMessage message={config.defaultMessage} />}
        {messages.map((message) => (
          <ChatMessage
            data-chat-widget='chat-message'
            key={message.id}
            chatId={message.id}
            role={message.role}
            parts={message.parts}
            attachments={message.experimental_attachments}
          />
        ))}
      </ChatContainer>
      <ChatInput data-chat-widget='chat-input' />
      <div data-chat-widget='scroll-button' className='absolute right-4 bottom-[56px] mr-px'>
        <ScrollButton containerRef={containerRef} scrollRef={bottomRef} />
      </div>
    </Fragment>
  )
}

export { Content, Header, Modal, Panel, PanelRoot, Resizable, ResizableRoot, Root, Trigger }
