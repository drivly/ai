import * as React from "react";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className }: HeroSectionProps) {
  return (
    <section style={{
      padding: "8rem 1rem 2rem",
      maxWidth: "1400px",
      margin: "0 auto"
    }}>
      <div style={{
        maxWidth: "980px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: "3rem",
          fontWeight: "bold",
          lineHeight: "1.1",
          letterSpacing: "-0.025em"
        }}>
          Build, Run, and Evaluate <br />
          <span style={{ color: "hsl(var(--primary))" }}>AI-Powered Tools</span> Effortlessly
        </h1>
        <p style={{
          maxWidth: "700px",
          fontSize: "1.125rem",
          color: "hsl(var(--muted-foreground))"
        }}>
          A composable platform for developing and deploying AI applications with built-in evaluation and observability.
        </p>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem"
        }}>
          <a
            href="https://functions.do"
            style={{
              display: "inline-flex",
              height: "2.5rem",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.375rem",
              backgroundColor: "hsl(var(--primary))",
              padding: "0.5rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "hsl(var(--primary-foreground))",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              transition: "background-color 0.2s"
            }}
          >
            Get Started
          </a>
          <a
            href="https://github.com/drivly/ai"
            style={{
              display: "inline-flex",
              height: "2.5rem",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.375rem",
              border: "1px solid hsl(var(--input))",
              backgroundColor: "hsl(var(--background))",
              padding: "0.5rem 1.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "hsl(var(--foreground))",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              transition: "background-color 0.2s, color 0.2s"
            }}
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
