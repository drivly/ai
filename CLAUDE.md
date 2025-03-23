# CLAUDE.md - Coding Assistant Guidelines

## Technology Stack

- TypeScript: ^5.7.3
- Node.js: ^18.20.2 || >=20.9.0
- Package Manager: pnpm ^9 || ^10
- Frontend: Next.js ^15.2.2, React ^19.0.0
- Backend: Payload CMS ^3.28.1, MongoDB, Cloudflare Workers, Hono ^4.7.4, Zod ^3.24.2
- Development Tools: ESLint ^9.16.0, Prettier ^3.4.2, Wrangler ^4.2.0

## Build Commands

- Build: `pnpm build` or `pnpm build:turbo`
- Dev: `pnpm dev` or `pnpm dev:turbo`
- Clean: `pnpm clean:turbo`

## Test Commands

- Run all tests: `pnpm test:turbo`
- Test single file: `pnpm test -- -t "test pattern"` (in package directory)
- Test watch mode: `pnpm test:watch`
- Typecheck: `pnpm typecheck`

## Lint Commands

- Lint: `pnpm lint` or `pnpm lint:turbo`
- Format: `pnpm format` or `pnpm prettier-fix`

## Code Style

- Formatting: Single quotes, no semicolons, 2 spaces, trailing commas, 180 char width
- Files: Kebab-case for files, PascalCase for components
- Variables: camelCase, boolean variables use `is/has/should` prefix
- Types: PascalCase, interfaces and types with meaningful names
- Components: PascalCase, props in camelCase
- Constants: UPPER_SNAKE_CASE
- Commits: Conventional format `type(scope): message`
- Error handling: Use try/catch with meaningful error messages

## Project Structure

- Monorepo structure with directories:
  - api/: API implementations for various services
  - app/: Application code
  - collections/: Collection definitions
  - components/: Reusable UI components
  - content/: Content files and assets
  - examples/: Example implementations
  - lib/: Library code and utilities
  - pkgs/: Shared packages and libraries
  - sdks/: Software Development Kits
  - tasks/: Task definitions
  - tests/: Test suites
  - websites/: Website implementations
  - workers/: Cloudflare Workers implementations
  - workflows/: Workflow definitions
