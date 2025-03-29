import * as React from "react";

interface HeroSectionProps {
  className?: string;
}

export default function HeroSection({ className }: HeroSectionProps) {
  return (
    <section className="py-32 px-4 max-w-[1400px] mx-auto">
      <div className="max-w-[980px] mx-auto flex flex-col items-center gap-4 text-center">
        <h1 className="text-5xl font-bold leading-tight tracking-tight">
          Build, Run, and Evaluate <br />
          <span className="text-primary">AI-Powered Tools</span> Effortlessly
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
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
