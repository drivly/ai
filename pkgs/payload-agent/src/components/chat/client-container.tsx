'use client'

import { cn } from '@/lib/utils'
import { BotMessageSquare } from 'lucide-react'
import React, { Fragment } from 'react'
import { Wrapper } from '../../lib'
import type { ClientContainerProps } from '../../types/chat'
import * as Container from './chat-container'

const ClientContainer: React.FC<ClientContainerProps> = ({
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
  initialAuthResult,
}) => {
  return (
    <Fragment>
      {type !== 'resizable' && children}
      <Wrapper
        as={type === 'modal' ? Container.Root : type === 'panel' ? Container.PanelRoot : Container.ResizableRoot}
        defaultMessage={defaultMessage}
        logo={logo}
        title={title}
        initialAuthResult={initialAuthResult}
        className={chatOptions?.rootStyle}
        layoutChildren={type === 'resizable' && children}
        direction={type === 'resizable' ? direction : undefined}
        suggestions={suggestions}
        aiAvatar={aiAvatar}>
        <Container.Trigger
          className={cn(chatOptions?.triggerStyle, {
            'right-[32px] bottom-[16px]': type === 'resizable',
          })}>
          <BotMessageSquare size={18} />
        </Container.Trigger>
        <Wrapper
          as={type === 'modal' ? Container.Modal : type === 'panel' ? Container.Panel : Container.Resizable}
          withOverlay={withOverlay}
          withOutsideClick={withOutsideClick}
          className={chatOptions?.containerStyle}>
          <Container.Header
            className={chatOptions?.headerStyle}
            buttonStyle={chatOptions?.headerButtonStyle}
            logoStyle={chatOptions?.headerLogoStyle}
            titleStyle={chatOptions?.headerTitleStyle}
          />
          <Container.Content />
        </Wrapper>
      </Wrapper>
    </Fragment>
  )
}

export default ClientContainer
