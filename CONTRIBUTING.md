# Contributing to Drivly AI

Thank you for your interest in contributing to Drivly AI! This document provides guidelines and instructions to help you contribute effectively to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others when contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/YOUR-USERNAME/ai.git
   cd ai
   ```
3. **Install dependencies**
   ```bash
   pnpm install
   ```
4. **Create a new branch** for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Project Structure

This is a monorepo managed with pnpm workspaces. The main directories include:

- `api/`: API implementations
- `dash/`: Dashboard application
- `data/`: Data processing utilities
- `docs/`: Documentation
- `pkgs/`: Shared packages
- `sdks/`: Software Development Kits
- `web/`: Web applications
- `workflows/`: Workflow definitions

### Code Style

We use Prettier to maintain consistent code formatting. The configuration is defined in `package.json`.

Key formatting rules:

- Single quotes
- No semicolons
- Trailing commas
- 180 character line width
- JSX uses single quotes
- JSX brackets on the same line

To format your code:

```bash
pnpm format
```

### Naming Conventions

Consistent naming helps make our codebase more readable and maintainable:

#### Files and Directories

- Use kebab-case for file names: `user-profile.tsx`, `api-client.ts`
- Use descriptive names that reflect the file's purpose
- For component files, use PascalCase if they export a single React component: `Button.tsx`
- Test files should match the name of the file they test with `.test` or `.spec` suffix: `user-profile.test.tsx`

#### Variables and Functions

- Use camelCase for variables and function names: `userData`, `fetchUserProfile()`
- Use descriptive names that indicate purpose
- Boolean variables should use prefixes like `is`, `has`, or `should`: `isLoading`, `hasPermission`

#### Constants

- Use UPPER_SNAKE_CASE for constants: `API_URL`, `MAX_RETRY_COUNT`
- Place shared constants in dedicated files/modules

#### Components

- Use PascalCase for React components and their filenames: `UserProfile`
- Use camelCase for component instances: `<UserProfile userName="John" />`

#### Interfaces and Types

- Use PascalCase for interfaces, types, and classes: `UserData`, `ApiResponse`
- Prefix interfaces with `I` only when necessary to distinguish from a class: `IUserService` vs `UserService`
- Use descriptive names that reflect the data structure

### Testing

Before submitting a pull request, make sure to test your changes thoroughly.

## Pull Request Process

1. **Update your fork** with the latest changes from the main repository
2. **Run tests** to ensure your changes don't break existing functionality
3. **Format your code** using `pnpm format`
4. **Push your changes** to your fork
5. **Create a pull request** with a clear title and description
   - Describe what your changes do
   - Reference any related issues
   - Include screenshots if applicable

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This leads to more readable messages that are easy to follow when looking through the project history and helps with automated versioning and changelog generation.

Each commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Examples

```
feat(auth): implement JWT authentication

- Add token generation and validation
- Create login and registration endpoints
- Set up middleware for protected routes

Closes #123
```

```
fix(api): prevent race condition in user data fetch

Resolves an issue where concurrent requests could lead to data corruption.

Fixes #456
```

```
docs(readme): update installation instructions
```

For breaking changes, add `BREAKING CHANGE:` in the footer followed by a description:

```
feat(api): change authentication API endpoints

BREAKING CHANGE: Authentication endpoints now use /auth prefix instead of /user
```

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [pnpm Documentation](https://pnpm.io/motivation)

## Questions?

If you have any questions or need help, please open an issue or reach out to the maintainers.

Thank you for contributing to Drivly AI!
