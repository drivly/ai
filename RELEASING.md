# Release Process

This repository uses multi-semantic-release to automate versioning and changelog generation based on commit messages.

## How it works

1. When code is pushed to the `main` branch, the GitHub Actions workflow runs multi-semantic-release
2. multi-semantic-release analyzes commit messages to determine version bumps
3. During development, all version increments are restricted to patch versions (0.0.x)
4. Packages in the `sdks` directory are versioned in sync with each other
5. Packages in the `pkgs` directory are versioned independently

## Commit message format

We use the [Angular commit message format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format) to determine version bumps:

```
<type>(<scope>): <short summary>
```

Common types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `build`: Changes to build process or dependencies
- `ci`: Changes to CI configuration
- `chore`: Other changes that don't modify src or test files

## Local testing

To test the release process locally without publishing:

```
pnpm version-pr
```

This will simulate a release and show what versions would be bumped.
