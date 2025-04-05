'use client'

import { BotMessageSquare } from 'lucide-react'
import React from 'react'
import type { ClientContainerProps } from '../../types/chat'

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

const ClientContainer: React.FC<ClientContainerProps> = ({
  aiAvatar,
  children,
  defaultMessage,
  chatOptions,
  logo,
  title,
  type = 'modal',
  direction,
  withOverlay,
  withOutsideClick,
  suggestions,
  initialAuthResult,
}) => {
  return (
    <React.Fragment>
      {children}
      <div className={chatOptions?.rootStyle}>
        <button className={cn(chatOptions?.triggerStyle)}>
          <BotMessageSquare size={18} />
        </button>
        <div className={chatOptions?.containerStyle}>
          <div className={chatOptions?.headerStyle}>
            {logo && <div className={chatOptions?.headerLogoStyle}>{logo}</div>}
            {title && <div className={chatOptions?.headerTitleStyle}>{title}</div>}
          </div>
          <div>{/* Content would go here */}</div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ClientContainer
