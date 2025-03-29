import * as React from "react";
import Link from "next/link";

interface DotdoSectionProps {
  className?: string;
}

export default function DotdoSection({ className }: DotdoSectionProps) {
  const services = [
    {
      title: "Functions.do",
      description: "Strongly-typed AI functions with automatic documentation and testing.",
      href: "https://functions.do"
    },
    {
      title: "Workflows.do",
      description: "Reliable business processes that orchestrate functions.",
      href: "https://workflows.do"
    },
    {
      title: "Agents.do",
      description: "Autonomous digital workers that combine functions and workflows.",
      href: "https://agents.do"
    }
  ];

  return (
    <section style={{
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "4rem 1rem"
    }}>
      <div style={{
        display: "grid",
        gap: "2rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))"
      }}>
        {services.map((service) => (
          <div 
            key={service.title} 
            style={{
              borderRadius: "0.5rem",
              border: "1px solid hsl(var(--border))",
              backgroundColor: "hsl(var(--card))",
              padding: "1.5rem",
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
            }}
          >
            <h3 style={{
              marginBottom: "0.5rem",
              fontSize: "1.25rem",
              fontWeight: "bold"
            }}>
              {service.title}
            </h3>
            <p style={{
              marginBottom: "1rem",
              color: "hsl(var(--muted-foreground))"
            }}>
              {service.description}
            </p>
            <Link
              href={service.href}
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "hsl(var(--primary))"
              }}
            >
              Learn more
              <svg style={{
                marginLeft: "0.25rem",
                height: "1rem",
                width: "1rem"
              }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
