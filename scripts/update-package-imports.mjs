// Script to update @/pkgs/* imports to use direct package names
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Map of package paths to their package names
const packageNameMap = {};

// Build a map of package paths to their names
function buildPackageNameMap() {
  const pkgDirs = fs.readdirSync(path.join(process.cwd(), 'pkgs'));
  
  pkgDirs.forEach(dir => {
    const packageJsonPath = path.join(process.cwd(), 'pkgs', dir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.name) {
          packageNameMap[`@/pkgs/${dir}`] = packageJson.name;
        }
      } catch (error) {
        console.error(`Error reading package.json for ${dir}:`, error.message);
      }
    }
  });
  
  console.log('Package name map:', packageNameMap);
}

// Find files with @/pkgs/ imports
function findFilesWithPackageImports() {
  const findCommand = "find . -type f -name \"*.ts\" -o -name \"*.tsx\" -o -name \"*.js\" -o -name \"*.jsx\" | grep -v \"node_modules\" | xargs grep -l \"from '@/pkgs/\"";
  const files = execSync(findCommand, { cwd: process.cwd() })
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);
  
  console.log(`Found ${files.length} files with @/pkgs/ imports to update`);
  return files;
}

// Update imports in files
function updateImports(files) {
  let updatedFiles = 0;
  
  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let updatedContent = content;
      let fileWasUpdated = false;
      
      // Replace all @/pkgs/* imports with direct package imports
      Object.entries(packageNameMap).forEach(([pkgPath, pkgName]) => {
        // Match @/pkgs/package-name with optional /src or other subpaths
        const regex = new RegExp(`from\\s+['"]${pkgPath}(\\/[^'"]*)?['"]`, 'g');
        
        updatedContent = updatedContent.replace(regex, (match, subPath = '') => {
          fileWasUpdated = true;
          return `from '${pkgName}${subPath}'`;
        });
      });
      
      if (fileWasUpdated) {
        fs.writeFileSync(filePath, updatedContent);
        console.log(`Updated imports in ${filePath}`);
        updatedFiles++;
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  });
  
  console.log(`Successfully updated imports in ${updatedFiles} files`);
}

// Main execution
buildPackageNameMap();
const files = findFilesWithPackageImports();
updateImports(files);
