
# AI Primitives Project Guidelines

## Core Operating Principles

1. **Instruction Reception and Understanding**
   - Carefully read and interpret user instructions
   - Ask specific questions when clarification is needed
   - Clearly identify technical constraints and requirements
   - Do not perform any operations beyond what is instructed

2. **In-depth Analysis and Planning**
   ```markdown
   ## Task Analysis
   - Purpose: [Final goal of the task]
   - Technical Requirements: [Technology stack and constraints]
   - Implementation Steps: [Specific steps]
   - Risks: [Potential issues]
   - Quality Standards: [Requirements to meet]

   ## Implementation Plan
   1. [Specific step 1]
      - Detailed implementation content
      - Expected challenges and countermeasures
   2. [Specific step 2]
      ...
   ```

3. **Comprehensive Implementation and Verification**
   - Execute file operations and related processes in optimized complete sequences
   - Continuously verify against quality standards throughout implementation
   - Address issues promptly with integrated solutions
   - Execute processes only within the scope of instructions, without adding extra features or operations

4. **Continuous Feedback**
   - Regularly report implementation progress
   - Confirm at critical decision points
   - Promptly report issues with proposed solutions

## Technology Stack and Constraints

### Core Technologies
- TypeScript: ^5.7.3
- Node.js: ^20 ||^22
- Package Manager: pnpm ^9 || ^10

### Frontend
- Next.js: ^15.2.4
- React: ^19.0.0
- React DOM: ^19.0.0
- Vercel for deployment and preview environments

### Backend
- Payload CMS: ^3.28.1
- MongoDB (via @payloadcms/db-mongodb): latest
- Cloudflare Workers (for APIs)
- Hono: ^4.7.4
- Zod: ^3.24.1
- Composio for underlying infrastructure

### Development Tools
- ESLint: ^9.16.0
- Prettier: ^3.5.3
- TypeScript: ^5.7.3
- Wrangler: ^4.2.0


### Common Commands
- Build: `pnpm build` or `pnpm build:turbo`
- Dev: `pnpm dev` or `pnpm dev:turbo`
- Clean: `pnpm clean:turbo`
- Test: `pnpm test:turbo` (all tests) or `pnpm test -- -t "test pattern"` (in package directory)
- Test watch mode: `pnpm test:watch`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint` or `pnpm lint:turbo`
- Format: `pnpm format` or `pnpm prettier-fix`
## Quality Management Protocol

### 1. Code Quality
- Strict TypeScript type checking
- Full compliance with ESLint rules
- Consistent code formatting using Prettier
- Follow Conventional Commits specification
- Adhere to the project's naming conventions

### 2. Performance
- Prevention of unnecessary re-rendering in React components
- Efficient data fetching
- Bundle size optimization
- Optimize Cloudflare Workers for edge performance

### 3. Security
- Strict input validation using Zod
- Appropriate error handling
- Secure management of sensitive information
- Follow best practices for API security

### 4. UI/UX
- Responsive design
- Accessibility compliance
- Consistent design system
- Clear and intuitive user interfaces
## Strategic Vision

The AI Primitives platform provides composable building blocks that enable developers to create, deploy, and manage AI applications with minimal complexity while maintaining reliability and scalability. The platform emphasizes:

1. **Economically valuable work** delivered through simple APIs
2. **Practical applications** of AI that deliver measurable business value
3. **Composable architecture** with Functions, Workflows, and Agents as core primitives
4. **Enterprise-grade reliability** with comprehensive testing and evaluation

## Project Structure Convention

```
ai/
├── api/                  # API implementations for various services
├── app/                  # Application code
│   ├── (apis)/           # API route handlers
│   ├── (websites)/       # Website components
│   └── (payload)/        # Payload CMS admin configurations
├── collections/          # Collection definitions
│   ├── ai/               # AI-related collections (Functions, Workflows, Agents)
│   ├── data/             # Data model collections (Things, Nouns, Verbs)
│   ├── events/           # Event-related collections (Triggers, Searches, Actions)
│   └── observability/    # Monitoring collections (Generations)
├── components/           # Reusable UI components
├── content/              # Content files and assets (MDX files at /content/**/*.mdx)
├── examples/             # Example implementations
├── lib/                  # Library code and utilities
├── pkgs/                 # Shared packages and libraries (can have dependencies)
│   ├── ai-models/        # AI model abstractions and selection
│   ├── deploy-worker/    # Cloudflare Workers deployment utilities
│   └── clickable-links/  # API handler utilities
├── sdks/                 # Software Development Kits (zero dependencies except apis.do)
├── tasks/                # Task implementations with dependencies
├── tests/                # Test suites
├── websites/             # Website implementations
├── workers/              # Cloudflare Workers implementations
└── workflows/            # Workflow definitions
```

## Important Constraints

### Monorepo Structure
- Respect the monorepo architecture using pnpm workspaces
- Place new code in the appropriate directory based on its purpose
- Follow the naming conventions outlined in CONTRIBUTING.md
- SDK implementations in `/sdks/` must maintain zero dependencies (except apis.do) to be publishable on npm
- Backend implementations of SDK features should be placed in the `/tasks/` folder with workspace-level dependencies
- Package entry points in package.json files should point to built files (e.g., dist/index.js) rather than source files

### Versioning Strategy
- Use semantic-release for version management across SDKs and packages
- Packages in the `sdks` directory must maintain synchronized version numbers
- Packages in the `pkgs` directory can be versioned independently
- During API instability phase, restrict all automatic version increments to patch versions (0.0.x) only
- All packages must be properly configured in pnpm-workspace.yaml
- Package names must exactly match names in respective package.json files

### Deployment Patterns
- Vercel is used for deployment and preview environments
- Preview environments follow the URL pattern: https://ai-git-{branch-name}.dev.driv.ly/
- The Velite content build step (build:content) must be integrated into the Vercel build process
- Keep next.config.mjs minimal with only essential configurations
- Avoid using node: imports in package files, particularly in ai-models

### Code Style
- Single quotes
- No semicolons
- 2 spaces for indentation
- Trailing commas
- 180 character line width
- JSX uses single quotes
- JSX brackets on the same line
- Use modern Node.js features (Node 20+ or 22+):
  - Use built-in fetch instead of node-fetch or require('https')
  - Avoid older Node.js built-in modules when modern alternatives exist
  - Remove unnecessary dependencies in favor of built-in alternatives

### Naming Conventions
- Use kebab-case for file names
- Use camelCase for variables and function names (boolean variables use `is/has/should` prefix)
- Use PascalCase for React components and their filenames
- Use PascalCase for types and interfaces with meaningful names
- Use UPPER_SNAKE_CASE for constants
## Implementation Process

### 1. Initial Analysis Phase
```markdown
### Requirements Analysis
- Identify functional requirements
- Confirm technical constraints
- Check consistency with existing code

### Risk Assessment
- Potential technical challenges
- Performance impacts
- Security risks
```

### MDX-Based Agent Capabilities
- MDX-based agent definitions support:
  - Structured data through frontmatter including tools, inputs, and outputs
  - Full code execution capabilities with import/export support
  - Visual component integration rendered as JSX/React components
  - Agent state visualization with support for multiple states/modes
- MDX content files should be located at `/content/**/*.mdx`
- The Velite content build step (`build:content`) must be integrated into the Vercel build process
- Content files should use plural names for core primitives (Functions, Agents, Workflows) to match domain names

### Build Configuration Principles
- Use Turborepo for managing the build order in monorepo packages
- Use Turbopack for Next.js applications, making transpilePackages configuration unnecessary
- Keep next.config.mjs minimal with only essential configurations
- Avoid complex webpack configurations entirely
- Tests should be excluded from the build process
- Nextra v4 configuration is primarily managed in app/(docs)/docs/layout.tsx

### 2. Implementation Phase
- Integrated implementation approach
- Continuous verification
- Maintenance of code quality
- Follow the project's established patterns

### 3. Verification Phase
- Unit testing
- Integration testing
- Performance testing
- Ensure compatibility with the rest of the system

### 4. Final Confirmation
- Consistency with requirements
- Code quality
- Documentation completeness
- Adherence to project standards

## Error Handling Protocol

### Problem Identification
- Error message analysis
- Impact scope identification
- Root cause isolation

### Solution Development
- Evaluation of multiple approaches
- Risk assessment
- Optimal solution selection

### Implementation and Verification
- Solution implementation
- Verification through testing
- Side effect confirmation

### Documentation
- Record of problem and solution
- Preventive measure proposals
- Sharing of learning points

I will follow these instructions to deliver high-quality implementations. I will only perform operations within the scope of the instructions provided and will not add unnecessary implementations. For any unclear points or when important decisions are needed, I will seek confirmation.
