import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { cn } from '@/lib/utils'
import { IBM_Plex_Mono as FontIBM, Geist, Inter } from 'next/font/google'
import type React from 'react'
import { Providers } from '../providers'
import './styles.css'

const fontIBM = FontIBM({
  subsets: ['latin'],
  variable: '--font-IBM_Plex_Sans',
  weight: ['400', '500', '600', '700'],
})

const fontGeist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='apple-mobile-web-app-title' content='dotdo.ai' />
      </head>
      <body className={cn('bg-background flex min-h-screen flex-col antialiased', fontGeist.variable, fontIBM.variable, fontInter.variable)}>
        <Providers>
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
            {children}
            <Toaster richColors />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}

const providers = [
  {
    name: 'Google Vertex',
    slug: 'vertex',
    quantization: null,
    context: 200000,
    maxCompletionTokens: 64000,
    providerModelId: 'claude-3-7-sonnet@20250219',
    pricing: {
      prompt: '0.000003',
      completion: '0.000015',
      image: '0.0048',
      request: '0',
      inputCacheRead: '0.0000003',
      inputCacheWrite: '0.00000375',
      webSearch: '0',
      internalReasoning: '0',
      discount: 0,
    },
    supportedParameters: ['max_tokens', 'temperature', 'stop', 'tools', 'tool_choice'],
    inputCost: 3,
    outputCost: 15,
    throughput: 57.0315,
    latency: 1874,
  },
  {
    name: 'Amazon Bedrock',
    slug: 'amazonBedrock',
    quantization: null,
    context: 200000,
    maxCompletionTokens: 128000,
    providerModelId: 'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
    pricing: {
      prompt: '0.000003',
      completion: '0.000015',
      image: '0.0048',
      request: '0',
      inputCacheRead: '0.0000003',
      inputCacheWrite: '0.00000375',
      webSearch: '0',
      internalReasoning: '0',
      discount: 0,
    },
    supportedParameters: ['max_tokens', 'temperature', 'stop', 'tools', 'tool_choice'],
    inputCost: 3,
    outputCost: 15,
    throughput: 36.996,
    latency: 1646,
  },
  {
    name: 'Anthropic',
    slug: 'anthropic',
    quantization: null,
    context: 200000,
    maxCompletionTokens: 128000,
    providerModelId: 'claude-3-7-sonnet-20250219',
    pricing: {
      prompt: '0.000003',
      completion: '0.000015',
      image: '0.0048',
      request: '0',
      inputCacheRead: '0.0000003',
      inputCacheWrite: '0.00000375',
      webSearch: '0',
      internalReasoning: '0',
      discount: 0,
    },
    supportedParameters: ['max_tokens', 'temperature', 'stop', 'tools', 'tool_choice'],
    inputCost: 3,
    outputCost: 15,
    throughput: 58.4035,
    latency: 1528.5,
  },
  {
    name: 'Google Vertex (Europe)',
    slug: 'googleVertex (europe)',
    quantization: null,
    context: 200000,
    maxCompletionTokens: 64000,
    providerModelId: 'claude-3-7-sonnet@20250219',
    pricing: {
      prompt: '0.000003',
      completion: '0.000015',
      image: '0.0048',
      request: '0',
      inputCacheRead: '0.0000003',
      inputCacheWrite: '0.00000375',
      webSearch: '0',
      internalReasoning: '0',
      discount: 0,
    },
    supportedParameters: ['max_tokens', 'temperature', 'stop', 'tools', 'tool_choice'],
    inputCost: 3,
    outputCost: 15,
    throughput: 49.793,
    latency: 1558,
  },
]
