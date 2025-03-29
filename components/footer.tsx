import * as React from "react";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container flex h-14 items-center">
        <div className="flex-1 text-sm text-muted-foreground">
          © {new Date().getFullYear()} LLM.do All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <a href="https://github.com/drivly/ai" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            GitHub
          </a>
          <a href="https://discord.gg/a87bSRvJkx" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}
