'use client'

import { ChakraProvider, ClientOnly, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode'

export function Provider(props: ColorModeProviderProps) {
  return (
    // <ClientOnly>
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
    // </ClientOnly>
  )
}
