import dynamic from 'next/dynamic'
import { Fragment } from 'react'
import type { DefaultChatOptions } from '@/types/chat'
import React from 'react'

// Use a relative path for dynamic import
const ClientContainer = dynamic(() => import('./client-container'))

export const ChatBot = async ({
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
  const authResult = getAuthResult ? await getAuthResult() : { user: null, permissions: [] }

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
