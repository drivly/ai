import { FaDiscord, FaGithub, FaXTwitter } from "react-icons/fa6"
import Link from "next/link"

const footerSocials = [
  {
    href: "https://github.com",
    name: "GitHub",
    icon: <FaGithub className="h-5 w-5" />,
  },
  {
    href: "https://discord.gg/qus39VeA",
    name: "Discord",
    icon: <FaDiscord className="h-5 w-5" />,
  },
  {
    href: "https://x.com",
    name: "X",
    icon: <FaXTwitter className="h-5 w-5" />,
  },
]

export function Footer() {
  return (
    <footer className="mt-auto">
      <div className="container px-3 sm:px-8 md:px-8 lg:px-8 mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-md border-neutral-700/20 py-8 sm:py-12 gap-4">
          {/* Social icons on the left */}
          <div className="flex space-x-5 justify-center sm:justify-start">
            {footerSocials.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="text-gray-500 hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
                <span className="sr-only">{social.name}</span>
              </Link>
            ))}
          </div>

          <span className="text-sm text-gray-500 text-center dark:text-gray-400 order-3 sm:order-2">
            Copyright © {new Date().getFullYear()}{" "}
            <Link href="/" className="cursor-pointer">
              llm.do
            </Link>
            . All Rights Reserved.
          </span>

          {/* Terms, Privacy, and Jobs */}
          <div className="flex space-x-6 justify-center sm:justify-end order-2 sm:order-3">
            <Link
              href="https://careers.do"
              className="text-sm text-gray-500 hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jobs
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-primary transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

