---
name: repo
type: repo
agent: CodeActAgent
---

# Drivly AI Primitives Repository

## Repository Overview
This repository contains a collection of AI primitives for building enterprise-grade AI functions, workflows, and agents. The project is organized as a monorepo with multiple packages and services.

## Directory Structure
- `/api/`: API implementations for various services (agents.do, functions.do, workflows.do, etc.)
- `/dash/`: Dashboard application
- `/data/`: Data management and storage
- `/docs/`: Documentation
- `/pkgs/`: Shared packages and libraries
- `/sdks/`: Software Development Kits
- `/tests/`: Test files (unit, integration, E2E)
- `/web/`: Web applications and interfaces
- `/workflows/`: Workflow definitions and implementations

## Development Guidelines
- Use TypeScript for new code
- Follow the existing code style (Prettier configuration in package.json)
- Single quotes for strings
- No semicolons
- JSX single quotes
- JSX bracket same line
- 180 character print width

## Testing Requirements
- Add appropriate tests for new features:
  - Unit tests for individual functions and components
  - Integration tests for API endpoints and services
  - E2E tests for complete workflows

## Setup Instructions
- Use pnpm as the package manager
- Run `pnpm install` to install dependencies
- The project uses a workspace structure defined in package.json

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