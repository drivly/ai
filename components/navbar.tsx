import * as React from "react";
import Link from "next/link";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-[1400px] mx-auto px-8 flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <span className="font-bold">LLM.do</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center justify-end gap-4">
          <Link href="https://functions.do" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Functions
          </Link>
          <Link href="https://workflows.do" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Workflows
          </Link>
          <Link href="https://agents.do" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Agents
          </Link>
        </nav>
      </div>
    </header>
  );
}
