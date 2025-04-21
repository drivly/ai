'use client'

import { BotMessageSquare } from 'lucide-react'
import React, { Fragment } from 'react'
import type { ClientContainerProps } from '../../types/chat'

const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ')
}

const Wrapper = ({
  as: Component = 'div',
  withOverlay,
  withOutsideClick,
  ...rest
}: {
  as?: React.ElementType
  withOverlay?: boolean
  withOutsideClick?: boolean
  [key: string]: any
}) => {
  return <Component {...rest} />
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
    <Fragment>
      {children}
      <div className={chatOptions?.rootStyle}>
        <button className={cn(chatOptions?.triggerStyle, type === 'resizable' && 'right-[32px] bottom-[16px]')}>
          <BotMessageSquare size={18} />
        </button>
        <Wrapper as='div' withOverlay={withOverlay} withOutsideClick={withOutsideClick} className={chatOptions?.containerStyle}>
          <div className={chatOptions?.headerStyle}>
            {logo && <div className={chatOptions?.headerLogoStyle}>{logo}</div>}
            {title && <div className={chatOptions?.headerTitleStyle}>{title}</div>}
          </div>
          <div>{/* Content would go here */}</div>
        </Wrapper>
      </div>
    </Fragment>
  )
}

export default ClientContainer
