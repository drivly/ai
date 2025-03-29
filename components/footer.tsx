import * as React from "react";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer style={{
      borderTop: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--background))"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 2rem",
        display: "flex",
        height: "3.5rem",
        alignItems: "center"
      }}>
        <div style={{
          flex: 1,
          fontSize: "0.875rem",
          color: "hsl(var(--muted-foreground))"
        }}>
          © {new Date().getFullYear()} LLM.do All rights reserved.
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}>
          <a 
            href="https://github.com/drivly/ai" 
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "hsl(var(--muted-foreground))",
              transition: "color 0.2s"
            }}
          >
            GitHub
          </a>
          <a 
            href="https://discord.gg/a87bSRvJkx" 
            style={{
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "hsl(var(--muted-foreground))",
              transition: "color 0.2s"
            }}
          >
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}
