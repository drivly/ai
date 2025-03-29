"use client"

import { useTheme } from "next-themes"
import Link from "next/link"

export function LlmsdoLogo({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Link href="/" >
      <span className="text-lg font-medium">llm.do</span>
    </Link>
  )
}

