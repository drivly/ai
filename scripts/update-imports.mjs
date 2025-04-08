// Script to update relative imports to use @/ path alias
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Get list of files with relative imports
const findCommand = "find . -type f -name \"*.ts\" -o -name \"*.tsx\" -o -name \"*.js\" -o -name \"*.jsx\" | grep -v \"node_modules\" | xargs grep -l \"from '\\.\\./\\.\\./\"";
const files = execSync(findCommand, { cwd: process.cwd() })
  .toString()
  .trim()
  .split('\n')
  .filter(Boolean);

console.log(`Found ${files.length} files with relative imports to update`);

// Process each file
let updatedFiles = 0;
files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Replace relative imports with @/ path alias
    const updatedContent = content.replace(
      /from\s+['"]\.\.\/\.\.\/(.+?)['"]/g, 
      (match, importPath) => `from '@/${importPath}'`
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
