import * as React from "react";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className={cn("container px-4 pb-8 pt-32 md:pt-40 lg:pt-48", className)}>
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Build, Run, and Evaluate <br />
          <span className="text-primary">AI-Powered Tools</span> Effortlessly
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
          A composable platform for developing and deploying AI applications with built-in evaluation and observability.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://functions.do"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Get Started
          </a>
          <a
            href="https://github.com/drivly/ai"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-6 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
