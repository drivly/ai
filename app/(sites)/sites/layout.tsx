import type React from "react"
import '@/app/(sites)/globals.css'
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
      <body style={{
        minHeight: "100vh",
        backgroundColor: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column"
      }}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <Navbar />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  )
}
