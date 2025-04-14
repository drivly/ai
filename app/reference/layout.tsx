import { ReactNode } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'API Reference',
  description: 'API Reference Documentation',
}

export default function ReferenceLayout({
  children,
}: {
  children: ReactNode
}) {
  return children
}
