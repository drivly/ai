'use client'

import { getQueryClient } from './get-query-client'
import { QueryClientProvider } from '@tanstack/react-query'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export const TanstackProvider = ({ children }: ProvidersProps) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools buttonPosition='bottom-left' /> */}
    </QueryClientProvider>
  )
}
