"use client"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState, useEffect } from "react"
import { LlmsdoLogo } from "@/components/llmsdo-logo"
import { FaGithub, FaDiscord } from "react-icons/fa"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <header
      className={cn(
        "fixed left-0 top-0 z-50 w-full backdrop-blur-[12px] transition-all duration-200",
        hasScrolled ? "bg-background/80 border-b" : "bg-transparent border-transparent",
      )}
    >
      <div className="container px-3 sm:px-8 md:px-8 lg:px-8 flex h-14 items-center justify-between">
        <LlmsdoLogo />

        {/* Desktop navigation */}
        <div className="hidden md:flex h-full items-center justify-end space-x-4">
          <Link
            href="https://github.com/drivly/ai"
            className="mr-4 text-sm text-gray-500 hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://discord.gg/qus39VeA"
            className="mr-6 text-sm text-gray-500 hover:text-primary transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaDiscord className="h-5 w-5" />
            <span className="sr-only">Discord</span>
          </Link>
          <Link
            className="mr-6 text-sm text-gray-500 hover:text-primary transition-colors font-semibold absolute left-1/2 transform -translate-x-1/2"
            href="/blog"
          >
            Blog
          </Link>
          <Link
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "mr-6 text-sm text-gray-500 hover:text-primary transition-colors",
              hasScrolled && "bg-white text-black hover:bg-white hover:text-primary",
            )}
            href="https://apis.do/"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Docs
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="ml-auto md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span
              className={`h-0.5 w-full bg-current transform transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`}
            ></span>
            <span
              className={`h-0.5 w-full bg-current transition-opacity ${isOpen ? "opacity-0" : "opacity-100"}`}
            ></span>
            <span
              className={`h-0.5 w-full bg-current transform transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile menu - simplified */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md">
          <nav className="container px-4 py-6">
            <ul className="flex flex-col space-y-6">
              <li>
                <Link
                  className="flex items-center text-lg font-medium text-gray-200 hover:text-primary transition-colors"
                  href="/blog"
                  onClick={() => setIsOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center text-lg font-medium text-gray-200 hover:text-primary transition-colors"
                  href="https://github.com/drivly/ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  <FaGithub className="h-5 w-5 mr-2" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  className="flex items-center text-lg font-medium text-gray-200 hover:text-primary transition-colors"
                  href="https://discord.gg/qus39VeA"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  <FaDiscord className="h-5 w-5 mr-2" />
                  Discord
                </Link>
              </li>
              <li className="pt-4">
                <Link
                  className={cn(
                    buttonVariants({
                      variant: "default",
                    }),
                    "w-full justify-center text-sm",
                  )}
                  href="https://apis.do/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                >
                  View Docs
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}

