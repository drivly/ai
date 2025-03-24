---
# https://docs.all-hands.dev/modules/usage/prompting/microagents-overview#microagent-format
# https://docs.all-hands.dev/modules/usage/prompting/microagents-repo
name: repo
type: repo
agent: CodeActAgent
---

# AI Primitives

## Repository Overview

This repository contains a collection of AI primitives for building enterprise-grade AI functions, workflows, and agents. The project is organized as a monorepo with multiple packages and services.

## Directory Structure

- `/api/`: API implementations for various services (agents.do, functions.do, workflows.do, etc.)
- `/app/`: Application code
- `/collections/`: Collection definitions
- `/components/`: Reusable UI components
- `/content/`: Content files and assets
- `/examples/`: Example implementations
- `/lib/`: Library code and utilities
- `/pkgs/`: Shared packages and libraries
- `/sdks/`: Software Development Kits
- `/tasks/`: Task definitions
- `/tests/`: Test files (unit, integration, E2E)
- `/websites/`: Website implementations
- `/workers/`: Cloudflare Workers implementations
- `/workflows/`: Workflow definitions and implementations

## Development Guidelines

- Use TypeScript for new code
- Follow the existing code style (Prettier configuration in package.json)
- Code style:
  - Single quotes for strings
  - No semicolons
  - 2 spaces for indentation
  - Trailing commas
  - 180 character print width
  - JSX single quotes
  - JSX bracket same line
- Naming conventions:
  - Use kebab-case for file names
  - Use camelCase for variables and function names (boolean variables use `is/has/should` prefix)
  - Use PascalCase for React components and their filenames
  - Use PascalCase for types and interfaces with meaningful names
  - Use UPPER_SNAKE_CASE for constants
- Commits follow conventional format: `type(scope): message`
- Error handling: Use try/catch with meaningful error messages

## Testing Requirements

- Add appropriate tests for new features:
  - Unit tests for individual functions and components
  - Integration tests for API endpoints and services
  - E2E tests for complete workflows

## Setup Instructions

- Use pnpm as the package manager
- Run `pnpm install` to install dependencies
- The project uses a workspace structure defined in package.json

## Common Commands

- Build: `pnpm build` or `pnpm build:turbo`
- Dev: `pnpm dev` or `pnpm dev:turbo`
- Clean: `pnpm clean:turbo`
- Test: `pnpm test:turbo` (all tests) or `pnpm test -- -t "test pattern"` (in package directory)
- Test watch mode: `pnpm test:watch`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint` or `pnpm lint:turbo`
- Format: `pnpm format` or `pnpm prettier-fix`

## Key Primitives

- **Functions.do**: Strongly-typed composable building blocks
- **Workflows.do**: Declarative state machines and workflows
- **Agents.do**: Autonomous digital workers
- **Triggers.do**: Initiate workflows based on events
- **Searches.do**: Query and retrieve data
- **Actions.do**: Perform tasks within workflows
- **LLM.do**: Intelligent AI gateway
- **Evals.do**: Evaluate Functions, Workflows, and Agents
- **Integrations.do**: Connect external APIs and systems
- **Database.do**: Persistent data storage
- **APIs.do**: Unified API Gateway

## Pull Request Guidelines

- Ensure all tests pass
- Follow the existing code style
- Include appropriate documentation
- Reference related issues
- All commits and PRs must follow conventional commit format
