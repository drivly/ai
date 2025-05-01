import dynamic from 'next/dynamic'
import { Fragment, useState, useEffect } from 'react'
import type { DefaultChatOptions } from '@/types/chat'
import type { PayloadAgentAuthResult } from '@/types/auth'
import React from 'react'

// Use a relative path for dynamic import with loading state
const ClientContainer = dynamic(() => import('./client-container'), {
  loading: () => <div>Loading chat widget...</div>,
})

export const ChatBot = ({
  aiAvatar,
  children,
  defaultMessage,
  chatOptions,
  logo,
  title,
  type,
  direction,
  withOverlay,
  withOutsideClick,
  suggestions,
  getAuthResult,
  requireAuth = !!getAuthResult,
}: DefaultChatOptions) => {
  const [authResult, setAuthResult] = useState<PayloadAgentAuthResult | { user: null; permissions: any[] }>({ user: null, permissions: [] })
  const [isLoading, setIsLoading] = useState(!!getAuthResult)
  
  useEffect(() => {
    if (getAuthResult) {
      setIsLoading(true)
      getAuthResult().then(result => {
        setAuthResult(result)
        setIsLoading(false)
      })
    }
  }, [getAuthResult])
  
  if (isLoading) return <div>Loading...</div>
  if (requireAuth && !authResult?.user) return children

  return (
    <Fragment>
      <ClientContainer
        aiAvatar={aiAvatar}
        children={children}
        defaultMessage={defaultMessage}
        chatOptions={chatOptions}
        logo={logo}
        title={title}
        type={type}
        direction={direction}
        withOverlay={withOverlay}
        withOutsideClick={withOutsideClick}
        suggestions={suggestions}
        initialAuthResult={authResult}
      />
    </Fragment>
  )
}
