"use client"

import { useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

export function CodeBlock({ code, language = "typescript", className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn("relative group", className)}>
      <pre className="overflow-x-auto rounded-lg bg-[#282a36] p-4 text-[#f8f8f2] text-sm font-mono border border-[#44475a]">
        <code className={`language-${language}`}>
          {/* Apply Dracula theme colors to different code elements */}
          {code.split(/\b/).map((part, index) => {
            // This is a simplified version - a real syntax highlighter would be more complex
            if (
              /^(const|let|var|function|return|await|async|import|export|from|class|interface|type|extends|implements)$/.test(
                part,
              )
            ) {
              return (
                <span key={index} className="text-[#ff79c6]">
                  {part}
                </span>
              ) // Keywords in pink
            } else if (/^(true|false|null|undefined|this|super)$/.test(part)) {
              return (
                <span key={index} className="text-[#bd93f9]">
                  {part}
                </span>
              ) // Constants in purple
            } else if (/^[A-Z][A-Za-z0-9_]*$/.test(part)) {
              return (
                <span key={index} className="text-[#8be9fd]">
                  {part}
                </span>
              ) // Classes in cyan
            } else if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(part)) {
              return (
                <span key={index} className="text-[#f8f8f2]">
                  {part}
                </span>
              ) // Identifiers in white
            } else if (/^[0-9]+$/.test(part)) {
              return (
                <span key={index} className="text-[#bd93f9]">
                  {part}
                </span>
              ) // Numbers in purple
            } else if (part.startsWith('"') || part.startsWith("'") || part.startsWith("`")) {
              return (
                <span key={index} className="text-[#f1fa8c]">
                  {part}
                </span>
              ) // Strings in yellow
            }
            return <span key={index}>{part}</span>
          })}
        </code>
      </pre>

      {/* Right-aligned container for language type and copy button */}
      <div className="absolute right-2 top-2 flex items-center gap-2">
        {language && (
          <div className="rounded bg-[#44475a] px-2 py-1 text-xs text-[#f8f8f2] opacity-80 flex items-center">
            {language}
          </div>
        )}
        <button
          onClick={copyToClipboard}
          className="rounded-md p-1.5 text-[#44475a] hover:text-[#f8f8f2] hover:bg-[#44475a]/30 transition-colors flex items-center justify-center"
          aria-label="Copy code"
        >
          {copied ? <CheckIcon className="h-4 w-4 text-[#50fa7b]" /> : <CopyIcon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

