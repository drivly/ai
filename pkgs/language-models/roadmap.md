# `ai-models` Roadmap

This roadmap outlines the planned features and considerations for the `ai-models` package, which provides utilities for working with AI SDKs, functions, workflows, observability, and evaluations.

## Model Identification & Syntax

- [ ] Support for provider/creator/model naming convention
- [ ] Determine whether to use the @ sign in naming syntax
- [ ] Support for creator/model syntax without provider specification
- [ ] Alignment with OpenRouter's syntax where possible
- [ ] Design naming convention: `@{provider}/{creator}/{model}:{config,capabilities,tools,priorities}`
- [ ] Alternative syntax support: `{creator}/{model}:{config,capabilities,tools,priorities}`

## Routing & Model Selection

- [ ] Implement our own version of openrouter/auto and openrouter/auto:online
- [ ] Tie routing logic to message content and/or priorities (performance, latency, throughput, cost)
- [ ] Support dynamic model fallback pattern
- [ ] Enable runtime tweaking of provider/model/settings/tools via query parameters

## Capabilities & Features

- [ ] Handle reasoning capabilities (follow OpenRouter's :reasoning flag)
- [ ] Support for code execution tools
- [ ] Design composite type tools for transforming outputs between models
- [ ] Implement online search capability routing (to models like gemini, perplexity, 4o-search)
- [ ] Support for general-purpose tools (similar to agentic.so)
- [ ] Develop secure code execution tool for JavaScript (as alternative to Python-based tools)

## Structured Output & Response Formats

- [ ] Support various methods for structured outputs:
  - [ ] Native structured_output support
  - [ ] Tool use with schema enforcement
  - [ ] Response_format with JSON guarantees
  - [ ] System prompt fallback method
- [ ] Handle compatibility between different output methods

## Use Cases Implementation

- [ ] Evaluation framework with dynamic model/settings/tools configuration
- [ ] Experimentation support (LLM-as-Judge comparisons between models)
- [ ] "Best model" specification without cost/price requirements
- [ ] Specific capability routing (e.g., reasoning-only models)
- [ ] Caching opt-in/out functionality
- [ ] Logging controls for sensitive PII situations
- [ ] Seed parameter support

## Phased Implementation

- [ ] Phase 1: Core model identification and routing
- [ ] Phase 2: Structured output and basic capabilities
- [ ] Phase 3: Advanced features and tools integration
- [ ] Phase 4: Comprehensive evaluation and experimentation framework
