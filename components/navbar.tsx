import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur", className)}>
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80">
            <span className="font-bold">LLM.do</span>
          </Link>
        </div>
        <nav className="flex flex-1 items-center justify-end space-x-4">
          <Link href="https://functions.do" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Functions
          </Link>
          <Link href="https://workflows.do" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Workflows
          </Link>
          <Link href="https://agents.do" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Agents
          </Link>
        </nav>
      </div>
    </header>
  );
}
