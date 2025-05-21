# Testing Strategy for Workspace Dependency Conversion

This document outlines how to test the workspace dependency conversion functionality implemented in PR #2193 (ENG-849).

## 1. Manual Testing of the Conversion Script

```bash
# Navigate to a package with workspace dependencies
cd pkgs/services-as-software

# Run the conversion script directly
node ../../scripts/convert-workspace-deps.js

# Verify package.json has converted dependencies
cat package.json
```

**Expected outcome:** The workspace dependencies (like `"apis.do": "workspace:*"`) should be converted to actual version numbers (like `"apis.do": "1.2.3"`).

## 2. Testing the prepublishOnly Hook

```bash
# Navigate to the package
cd pkgs/services-as-software

# Run npm publish with dry-run flag
npm publish --dry-run
```

**Expected outcome:** The logs should show the conversion script running as part of the prepublishOnly hook, and the workspace dependencies should be converted to actual version numbers.

## 3. Testing the Release Script Validation

```bash
# Create a test package with workspace dependencies
mkdir -p /tmp/test-pkg
cp pkgs/services-as-software/package.json /tmp/test-pkg/

# Try to run the release script
node scripts/release-pkgs.js /tmp/test-pkg
```

**Expected outcome:** The script should detect workspace dependencies, attempt to convert them, and validate that none remain. If conversion fails, it should exit with an error.

## 4. End-to-End Test

1. Publish a package that previously had workspace dependencies:

   ```bash
   cd pkgs/services-as-software
   npm publish
   ```

2. Install the published package in a separate project:

   ```bash
   mkdir -p /tmp/test-install
   cd /tmp/test-install
   npm init -y
   npm install services-as-software
   ```

3. Verify it installs without the 'ERR_PNPM_WORKSPACE_PKG_NOT_FOUND' error.

## 5. Verification Checklist

- [ ] Conversion script successfully converts workspace dependencies to actual versions
- [ ] prepublishOnly hook runs the conversion script before publishing
- [ ] Release script validates that no workspace dependencies remain
- [ ] Published package can be installed without workspace dependency errors
