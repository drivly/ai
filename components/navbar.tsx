import * as React from "react";
import Link from "next/link";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      width: "100%",
      borderBottom: "1px solid hsl(var(--border))",
      backgroundColor: "hsla(var(--background), 0.95)",
      backdropFilter: "blur(4px)"
    }}>
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "0 2rem",
        display: "flex",
        height: "3.5rem",
        alignItems: "center"
      }}>
        <div style={{ marginRight: "1rem", display: "flex" }}>
          <Link href="/" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5rem",
            transition: "opacity 0.2s"
          }}>
            <span style={{ fontWeight: "bold" }}>LLM.do</span>
          </Link>
        </div>
        <nav style={{ 
          display: "flex", 
          flex: 1, 
          alignItems: "center", 
          justifyContent: "flex-end", 
          gap: "1rem" 
        }}>
          <Link href="https://functions.do" style={{ 
            fontSize: "0.875rem", 
            fontWeight: "500", 
            color: "hsl(var(--muted-foreground))",
            transition: "color 0.2s"
          }}>
            Functions
          </Link>
          <Link href="https://workflows.do" style={{ 
            fontSize: "0.875rem", 
            fontWeight: "500", 
            color: "hsl(var(--muted-foreground))",
            transition: "color 0.2s"
          }}>
            Workflows
          </Link>
          <Link href="https://agents.do" style={{ 
            fontSize: "0.875rem", 
            fontWeight: "500", 
            color: "hsl(var(--muted-foreground))",
            transition: "color 0.2s"
          }}>
            Agents
          </Link>
        </nav>
      </div>
    </header>
  );
}
