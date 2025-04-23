import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import path from 'path'

const findCommand = 'find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v "node_modules" | grep -v "/workers/" | grep -v "/pkgs/" | grep -v "/websites/" | grep -v "/templates/" | xargs grep -l "from \'@\/\.\.\/"'

try {
  const files = execSync(findCommand, { cwd: process.cwd() }).toString().trim().split('\n').filter(Boolean)
  
  console.log(`Found ${files.length} files with mixed import patterns to fix`)
  
  let updatedFiles = 0
  files.forEach((filePath: string) => {
    try {
      const content = readFileSync(filePath, 'utf8')
      
      let updatedContent = content.replace(/from\s+['"]@\/\.\.\/(\.+?)['"]/g, (match: string, importPath: string) => {
        return `from '@/${importPath}'`
      })
      
      updatedContent = updatedContent.replace(/import\(\s*['"]@\/\.\.\/(\.+?)['"]\s*\)/g, (match: string, importPath: string) => {
        return `import('@/${importPath}')`
      })
      
      if (content !== updatedContent) {
        writeFileSync(filePath, updatedContent)
        console.log(`Fixed mixed import patterns in ${filePath}`)
        updatedFiles++
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, (error as Error).message)
    }
  })
  
  console.log(`Successfully fixed mixed import patterns in ${updatedFiles} files`)
} catch (error) {
  console.log('No files with mixed import patterns found')
}
