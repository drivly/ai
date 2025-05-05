#!/usr/bin/env node

/**
 * Script to convert workspace dependencies to actual published versions
 * This ensures packages can be installed from npm without workspace references
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

/**
 * Check if a package is a local package in the monorepo
 * @param {string} packageName - The name of the package to check
 * @returns {boolean} - Whether the package is a local package
 */
const isLocalPackage = (packageName) => {
  try {
    for (const sdkPath of ['sdks', 'pkgs']) {
      const packagePath = resolve(process.cwd(), '..', sdkPath, packageName.replace('.do', '.do'));
      if (execSync(`test -d ${packagePath} && echo "exists"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).includes('exists')) {
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
};

const getPackageVersions = (dependencies) => {
  const versions = {};
  for (const dep of Object.keys(dependencies)) {
    if (dependencies[dep].startsWith('workspace:')) {
      try {
        const version = execSync(`npm view ${dep} version`, { encoding: 'utf8' }).trim();
        if (version) {
          versions[dep] = version;
        }
      } catch (e) {
        console.warn(`Could not find published version for ${dep}`);
      }
    }
  }
  return versions;
};

const convertWorkspaceDeps = () => {
  const pkgPath = resolve(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  let modified = false;
  
  if (pkg.dependencies) {
    const versions = getPackageVersions(pkg.dependencies);
    for (const [dep, version] of Object.entries(pkg.dependencies)) {
      if (version.startsWith('workspace:')) {
        if (versions[dep]) {
          pkg.dependencies[dep] = versions[dep];
          modified = true;
          console.log(`Converting dependency ${dep} to version ${versions[dep]}`);
        } else {
          console.warn(`WARNING: Could not find published version for ${dep}, using local reference`);
          if (isLocalPackage(dep)) {
            console.log(`${dep} is a local package that needs publishing first, using version 0.0.1`);
            pkg.dependencies[dep] = '0.0.1';
            modified = true;
          } else {
            console.warn(`${dep} is not a local package, keeping workspace reference for now`);
          }
        }
      }
    }
  }
  
  if (pkg.devDependencies) {
    const versions = getPackageVersions(pkg.devDependencies);
    for (const [dep, version] of Object.entries(pkg.devDependencies)) {
      if (version.startsWith('workspace:')) {
        if (versions[dep]) {
          pkg.devDependencies[dep] = versions[dep];
          modified = true;
          console.log(`Converting devDependency ${dep} to version ${versions[dep]}`);
        } else {
          console.warn(`WARNING: Could not find published version for ${dep}, using local reference`);
          if (isLocalPackage(dep)) {
            console.log(`${dep} is a local package that needs publishing first, using version 0.0.1`);
            pkg.devDependencies[dep] = '0.0.1';
            modified = true;
          } else {
            console.warn(`${dep} is not a local package, keeping workspace reference for now`);
          }
        }
      }
    }
  }
  
  if (pkg.peerDependencies) {
    const versions = getPackageVersions(pkg.peerDependencies);
    for (const [dep, version] of Object.entries(pkg.peerDependencies)) {
      if (version.startsWith('workspace:')) {
        if (versions[dep]) {
          pkg.peerDependencies[dep] = versions[dep];
          modified = true;
          console.log(`Converting peerDependency ${dep} to version ${versions[dep]}`);
        } else {
          console.warn(`WARNING: Could not find published version for ${dep}, using local reference`);
          if (isLocalPackage(dep)) {
            console.log(`${dep} is a local package that needs publishing first, using version 0.0.1`);
            pkg.peerDependencies[dep] = '0.0.1';
            modified = true;
          } else {
            console.warn(`${dep} is not a local package, keeping workspace reference for now`);
          }
        }
      }
    }
  }
  
  if (modified) {
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log('Updated package.json with converted workspace dependencies');
  }
};

convertWorkspaceDeps();
