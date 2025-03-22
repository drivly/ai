# CLAUDE.md - Coding Assistant Guidelines

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
- Formatting: Single quotes, no semicolons, 2 spaces, 180 char width
- Files: Kebab-case for files, PascalCase for components
- Variables: camelCase, boolean variables use `is/has/should` prefix
- Types: PascalCase, interfaces and types with meaningful names
- Components: PascalCase, props in camelCase
- Commits: Conventional format `type(scope): message`
- Monorepo: app/, pkgs/, sdks/, api/, web/, workflows/
- Error handling: Use try/catch with meaningful error messages