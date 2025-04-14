import React from 'react'
import { Decorator } from '@storybook/react'

const ServerComponentDecorator: Decorator = (Story) => {
  return (
    <div className="p-4 bg-background text-foreground">
      <Story />
    </div>
  )
}

export default ServerComponentDecorator
