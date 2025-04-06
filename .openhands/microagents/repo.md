---
# https://docs.all-hands.dev/modules/usage/prompting/microagents-overview#microagent-format
# https://docs.all-hands.dev/modules/usage/prompting/microagents-repo
name: repo
type: repo
agent: CodeActAgent
---

# AI Primitives

## Repository Overview

This repository contains a collection of AI primitives for building enterprise-grade AI functions, workflows, and agents. The project is organized as a monorepo with multiple packages and services, focusing on composable building blocks that enable developers to create, deploy, and manage AI applications with minimal complexity while maintaining reliability and scalability.

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

### SDK Implementation Patterns

- SDK implementations in `/sdks/` must maintain zero dependencies (except apis.do) to be publishable on npm
- Backend implementations of SDK features should be placed in the `/tasks/` folder
- When moving code from SDK to tasks, ensure all SDK files are completely reverted to maintain zero dependencies
- Task implementations can use workspace-level dependencies (installed with -w flag)
- Package entry points in package.json files should point to built files (e.g., dist/index.js) rather than source files
- Use modern Node.js features (Node 20+ or 22+):
  - Use built-in fetch instead of node-fetch or require('https')
  - Avoid older Node.js built-in modules when modern alternatives exist

### Dependency Management

- pnpm-lock.yaml must be kept in sync with package.json dependencies
- CI environments use frozen-lockfile setting by default
- When updating dependencies, run `pnpm i` at the root of the monorepo
- When changing workspace dependencies (like changing from `workspace:*` to a specific version), update the lockfile
- Do not use --no-frozen-lockfile flag unless explicitly instructed

## Testing Requirements

- Add appropriate tests for new features:
  - Unit tests for individual functions and components
  - Integration tests for API endpoints and services
  - E2E tests for complete workflows

## Setup Instructions

- Use pnpm as the package manager (requires pnpm ^9 || ^10)
- Node.js version requirements: ^20 ||^22
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
- **Agents.do**: Autonomous digital workers with concise implementation style
  ```typescript
  export const agentName = new Agent({
    name: 'agent-name',
    instructions: "Brief, clear instructions about the agent's role and purpose",
    model: openai('model-name'),
  })
  ```
  - Supports MDX-based agent definitions with:
    - Structured data through frontmatter (tools, inputs, outputs)
    - Full code execution capabilities with import/export support
    - Visual component integration rendered as JSX/React components
    - Agent state visualization with support for multiple states/modes
    - Executable code blocks for dynamic behavior
- **Triggers.do**: Initiate workflows based on events
- **Searches.do**: Query and retrieve data
- **Actions.do**: Perform tasks within workflows (can be used as tools by agents)
- **LLM.do**: Intelligent AI gateway for routing requests to optimal models
  - Provides managed tool calling under the hood
  - Routes requests to appropriate models based on capabilities
- **Evals.do**: Evaluate Functions, Workflows, and Agents
- **Integrations.do**: Connect external APIs and systems (can be used as tools by agents)
- **Database.do**: Persistent data storage with Payload CMS
- **APIs.do**: Unified API Gateway for all services

### Documentation Practices

- Documentation files and references should use plural names for core primitives (Functions, Agents, Workflows) to match domain names
- The README.md in the root directory contains the strategic vision and should be used as the source of truth
- MDX files in the content folder should be aligned with this vision
- Use consistent terminology: Functions, Workflows, Integrations/Actions (not "tools")
- Composio provides the underlying infrastructure but this should not be exposed in user-facing documentation

## Commit Guidelines

- All commits must follow conventional commit format
- Use the following commit types:
  - `feat`: New feature
  - `fix`: Bug fix
  - `docs`: Documentation
  - `style`: Code style
  - `refactor`: Code refactoring
  - `test`: Add tests
  - `chore`: Build process
  - `revert`: Revert changes
- Use the following commit scopes:
  - `api`: API changes
  - `app`: Application changes
  - `collections`: Collection changes
  - `components`: Component changes
  - `content`: Content changes
  - `examples`: Example changes
  - `lib`: Library changes
  - `pkgs`: Package changes
  - `sdks`: SDK changes
  - `tasks`: Task changes
  - `tests`: Test changes
  - `websites`: Website changes
  - `workers`: Worker changes
  - `workflows`: Workflow changes
- Use the following commit message format: `type(scope): message`
- Include a description of the changes
- Reference related issues with `closes #<issue_number>`

## Pull Request Guidelines

- Ensure `pnpm build` passes
- Ensure all tests pass
- Follow the existing code style
- Include appropriate documentation
- Reference related issues
- Only make a single PR per issue

## Package Versioning

- Packages in the `sdks` directory must maintain synchronized version numbers
- All changes to packages in the `sdks` directory must include a changeset (`pnpm changeset`)
- Packages in the `pkgs` directory can be versioned independently
- During API instability phase, use patch versions (0.0.x) for SDK packages
- Version numbers in workspace package dependencies must be synchronized before running Changesets
- Package names in changesets must exactly match names in respective package.json files

## Deployment Patterns

- Vercel is used for deployment and preview environments
- Preview environments follow the URL pattern: https://ai-git-{branch-name}.dev.driv.ly/
- Preview deployments require authentication using VERCEL_AUTOMATION_BYPASS_SECRET
- The Velite content build step (`build:content`) must be integrated into the Vercel build process
- Documentation is accessible at the same path structure in preview as in local development
  - Local: http://localhost:3000/docs
  - Preview: https://ai-git-{branch-name}.dev.driv.ly/docs

### Build Configuration

- Use Turborepo for managing the build order in monorepo packages
- Use Turbopack for Next.js applications, making transpilePackages configuration unnecessary
- Keep next.config.mjs minimal with only essential configurations
- Avoid complex webpack configurations entirely
- Tests should be excluded from the build process
- Nextra v4 configuration is primarily managed in app/(docs)/docs/layout.tsx
