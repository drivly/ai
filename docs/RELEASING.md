# Release Process

This repository uses semantic-release to automate versioning and changelog generation based on commit messages.

## How it works

1. When code is pushed to the `main` branch, the GitHub Actions workflow runs semantic-release
2. semantic-release analyzes commit messages to determine version bumps
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
pnpm version-pr          # Test both SDK and package releases
pnpm version-pr-sdks     # Test SDK releases only
pnpm version-pr-pkgs     # Test package releases only
```

These will simulate a release and show what versions would be bumped.

## Separate Release Processes

The repository supports separate release processes for SDK packages and other packages:

1. SDK packages (in the `sdks` directory) are released together with synchronized versioning
2. Other packages (in the `pkgs` directory) are released independently

To trigger a release:

- For SDK packages only: Update `.github/version-stamp-sdks.txt`
- For other packages only: Update `.github/version-stamp-pkgs.txt`
- For both: Update both files

You can also use the following npm scripts:

```
pnpm release-sdks      # Release only SDK packages
pnpm release-pkgs      # Release only packages in pkgs directory
pnpm release           # Release both SDK and other packages
```
