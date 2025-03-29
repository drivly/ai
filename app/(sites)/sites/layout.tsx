import type React from "react"
import '@/app/(sites)/sites/styles.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "LLM.do",
  description: "Build, Run, and Evaluate AI-Powered Tools Effortlessly",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col", fontSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
