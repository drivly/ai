import * as React from "react";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1400px] mx-auto px-8 flex h-14 items-center">
        <div className="flex-1 text-sm text-muted-foreground">
          © {new Date().getFullYear()} LLM.do All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/drivly/ai" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a 
            href="https://discord.gg/a87bSRvJkx" 
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}
