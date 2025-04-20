import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import path from 'path'

const EXCLUDE_PATTERNS = [
  'node_modules',
  'workers',
  'pkgs',
  'websites',
  'templates'
]

const calculateAbsolutePath = (filePath: string, importPath: string): string => {
  let relativeImportPath = importPath
  while (relativeImportPath.startsWith('../')) {
    relativeImportPath = relativeImportPath.substring(3)
  }
  
  const fileDir = path.dirname(filePath)
  
  const upLevels = importPath.split('/').filter(part => part === '..').length
  
  let currentDir = fileDir
  for (let i = 0; i < upLevels; i++) {
    currentDir = path.dirname(currentDir)
  }
  
  const absolutePath = path.relative(process.cwd(), path.resolve(currentDir, relativeImportPath))
  
  return absolutePath
}

const findCommand = `find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v "${EXCLUDE_PATTERNS.join('" | grep -v "')}" | xargs grep -l "from '\\.\\.\/\\.\\.\/"`

console.log(`Running command: ${findCommand}`)
const files = execSync(findCommand, { cwd: process.cwd() }).toString().trim().split('\n').filter(Boolean)

console.log(`Found ${files.length} files with deep relative imports to update`)

let updatedFiles = 0
files.forEach((filePath: string) => {
  try {
    const content = readFileSync(filePath, 'utf8')
    let updatedContent = content
    
    const staticImportRegex = /from\s+['"](\.\.\/(\.\.\/)+[^'"]+)['"]/g
    
    let match
    while ((match = staticImportRegex.exec(content)) !== null) {
      const fullImportPath = match[1]
      const absolutePath = calculateAbsolutePath(filePath, fullImportPath)
      if (!absolutePath.startsWith('.')) {
        updatedContent = updatedContent.replace(
          new RegExp(`from\\s+['"]${fullImportPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g'),
          `from '@/${absolutePath}'`
        )
      }
    }
    
    const dynamicImportRegex = /import\(\s*['"](\.\.\/(\.\.\/)+[^'"]+)['"]\s*\)/g
    
    while ((match = dynamicImportRegex.exec(content)) !== null) {
      const fullImportPath = match[1]
      const absolutePath = calculateAbsolutePath(filePath, fullImportPath)
      if (!absolutePath.startsWith('.')) {
        updatedContent = updatedContent.replace(
          new RegExp(`import\\(\\s*['"]${fullImportPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]\\s*\\)`, 'g'),
          `import('@/${absolutePath}')`
        )
      }
    }
    
    if (content !== updatedContent) {
      writeFileSync(filePath, updatedContent)
      console.log(`Updated imports in ${filePath}`)
      updatedFiles++
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, (error as Error).message)
  }
})

const findDynamicCommand = `find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v "${EXCLUDE_PATTERNS.join('" | grep -v "')}" | xargs grep -l "await import(\\\\s*['\\\\\\"]\\\\.\\\\.\\\\/\\\\.\\\\.\\\\/"`

console.log(`Running command for dynamic imports: ${findDynamicCommand}`)

try {
  const dynamicFiles = execSync(findDynamicCommand, { cwd: process.cwd() }).toString().trim().split('\n').filter(Boolean)
  
  console.log(`Found ${dynamicFiles.length} files with deep dynamic imports to update`)
  
  dynamicFiles.forEach((filePath: string) => {
    try {
      const content = readFileSync(filePath, 'utf8')
      let updatedContent = content
      
      const dynamicImportRegex = /await\s+import\(\s*['"](\.\.\/(\.\.\/)+[^'"]+)['"]\s*\)/g
      
      let match
      while ((match = dynamicImportRegex.exec(content)) !== null) {
        const fullImportPath = match[1]
        const absolutePath = calculateAbsolutePath(filePath, fullImportPath)
        if (!absolutePath.startsWith('.')) {
          updatedContent = updatedContent.replace(
            new RegExp(`await\\s+import\\(\\s*['"]${fullImportPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]\\s*\\)`, 'g'),
            `await import('@/${absolutePath}')`
          )
        }
      }
      
      if (content !== updatedContent) {
        writeFileSync(filePath, updatedContent)
        console.log(`Updated dynamic imports in ${filePath}`)
        updatedFiles++
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, (error as Error).message)
    }
  })
} catch (error) {
  console.error(`Error finding dynamic imports:`, (error as Error).message)
}

console.log(`Successfully updated imports in ${updatedFiles} total files`)
