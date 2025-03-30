# Versioning Strategy

This repository uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing of packages.

## Key Points

- Packages in the `sdks/` directory are versioned together and always have the same version number.
- Packages in the `pkgs/` directory are versioned independently based on individual package changes.

## Adding a Changeset

When making changes to packages, you should create a changeset to document those changes:

```sh
pnpm changeset
```

This will prompt you to:
1. Select the packages that have changed
2. Choose the type of change (patch, minor, major) for each package
3. Provide a description of the changes

## Publishing

Versioning and publishing is automated through GitHub Actions. When changes are merged to the main branch:

1. A "Version Packages" PR will be created to update package versions
2. When the PR is merged, the packages will be published to npm

## Special Considerations

- Changes to any package in the `sdks/` directory will increment the version of all packages in that directory, even if only one package has changed.
- Only modified packages in the `pkgs/` directory will have their versions incremented.
