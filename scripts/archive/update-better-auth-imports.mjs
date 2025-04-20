// Script to update @/ imports in better-auth-plugin package
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Find files with @/ imports in better-auth-plugin
const findCommand = "find ./pkgs/better-auth-plugin -type f -name \"*.ts\" -o -name \"*.tsx\" | xargs grep -l \"from '@/\"";
const files = execSync(findCommand, { cwd: process.cwd() })
  .toString()
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${files.length} files with @/ imports to update in better-auth-plugin`);

// Process each file
let updatedFiles = 0;
files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Replace @/ imports with relative paths
    // For @/../ imports (going up from the package)
    let updatedContent = content.replace(
      /from\s+['"]@\/\.\.\/([^'"]+)['"]/g, 
      (match, importPath) => {
        // Calculate relative path based on file location
        const fileDir = path.dirname(filePath);
        const relativeToSrc = path.relative(fileDir, path.join(process.cwd(), 'pkgs/better-auth-plugin/src'));
        const relativePath = path.join(relativeToSrc, '..', importPath).replace(/\\/g, '/');
        return `from '${relativePath}'`;
      }
    );
    
    // For @/ imports (within the package)
    updatedContent = updatedContent.replace(
      /from\s+['"]@\/([^'"]+)['"]/g, 
      (match, importPath) => {
        // Calculate relative path based on file location
        const fileDir = path.dirname(filePath);
        const relativeToSrc = path.relative(fileDir, path.join(process.cwd(), 'pkgs/better-auth-plugin/src'));
        const relativePath = path.join(relativeToSrc, importPath).replace(/\\/g, '/');
        return `from '${relativePath}'`;
      }
    );
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent);
      console.log(`Updated imports in ${filePath}`);
      updatedFiles++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`Successfully updated imports in ${updatedFiles} files`);
