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

Write clear, concise commit messages that explain the changes you've made. Follow these guidelines:
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests after the first line

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [pnpm Documentation](https://pnpm.io/motivation)

## Questions?

If you have any questions or need help, please open an issue or reach out to the maintainers.

Thank you for contributing to Drivly AI!
