import React from 'react'

export const DefaultMessage = ({ message = 'No messages yet. Start a conversation!' }: { message?: string }) => {
  return (
    <div className='flex h-full items-center justify-center'>
      <p className='text-muted-foreground text-center text-[14px] leading-[24px] font-medium'>{message}</p>
    </div>
  )
}
