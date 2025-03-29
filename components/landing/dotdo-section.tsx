import * as React from "react";
import { cn } from "@/lib/utils";
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
    <section className={cn("container px-4 py-16 md:py-24", className)}>
      <div className="grid gap-8 md:grid-cols-3">
        {services.map((service) => (
          <div key={service.title} className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-bold">{service.title}</h3>
            <p className="mb-4 text-muted-foreground">{service.description}</p>
            <Link
              href={service.href}
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Learn more
              <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
