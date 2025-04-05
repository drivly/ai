import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

const copyDir = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
      const jsContent = fs
        .readFileSync(srcPath, 'utf8')
        .replace(/\.ts';/g, ".js';")
        .replace(/\.ts";/g, '.js\";')
        .replace(/from ['"]agents['"]/, "from 'agents'")

      fs.writeFileSync(destPath.replace('.ts', '.js'), jsContent)

      const dtsContent = fs
        .readFileSync(srcPath, 'utf8')
        .replace(/\.ts';/g, ".js';")
        .replace(/\.ts";/g, '.js\";')

      fs.writeFileSync(destPath.replace('.ts', '.d.ts'), dtsContent)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

copyDir('src', 'dist/src')

fs.copyFileSync('types.ts', 'dist/types.ts')
fs.copyFileSync('types.ts', 'dist/types.js')
fs.copyFileSync('types.ts', 'dist/types.d.ts')

fs.writeFileSync('dist/index.js', `export * from './src/index.js';\nexport { default } from './src/index.js';\n`)
fs.writeFileSync('dist/index.d.ts', `export * from './src/index';\nexport { default } from './src/index';\n`)

console.log('Build completed successfully!')
