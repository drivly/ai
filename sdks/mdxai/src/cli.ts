import { processFile } from './mdx-processor.js'
import { loadConfig } from './config.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import { glob } from 'glob'

export class CLI {
  async init() {
    console.log('Initializing mdxai configuration...')
    const config = {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      outputDir: './'
    }
    
    try {
      await loadConfig()
      console.log('Configuration already exists. Use --force to overwrite.')
    } catch (error) {
      try {
        const configPath = path.join(process.cwd(), '.mdxai.json')
        await fs.writeFile(configPath, JSON.stringify(config, null, 2))
        console.log(`Configuration created at ${configPath}`)
      } catch (err) {
        console.error(`Failed to create configuration: ${err.message}`)
        throw err
      }
    }
  }
  
  async generate(targetPath, options = {}) {
    if (!targetPath) {
      throw new Error('Path is required for generate command')
    }
    
    console.log(`Generating MDX content for ${targetPath}...`)
    const config = await loadConfig()
    
    const mdxPath = this.ensureMdxExtension(targetPath)
    const outputPath = path.resolve(process.cwd(), mdxPath)
    
    try {
      const dir = path.dirname(outputPath)
      await fs.mkdir(dir, { recursive: true })
      
      const content = await processFile(mdxPath, {
        ...config,
        ...options,
        mode: 'generate'
      })
      
      await fs.writeFile(outputPath, content)
      console.log(`Generated MDX content saved to ${outputPath}`)
    } catch (err) {
      console.error(`Failed to generate MDX content: ${err.message}`)
      throw err
    }
  }
  
  async edit(targetPath, options = {}) {
    if (!targetPath) {
      throw new Error('Path is required for edit command')
    }
    
    console.log(`Editing MDX content in ${targetPath}...`)
    const config = await loadConfig()
    
    const mdxPath = this.ensureMdxExtension(targetPath)
    const inputPath = path.resolve(process.cwd(), mdxPath)
    
    try {
      await fs.access(inputPath)
      
      const existingContent = await fs.readFile(inputPath, 'utf-8')
      
      const updatedContent = await processFile(mdxPath, {
        ...config,
        ...options,
        mode: 'edit',
        content: existingContent
      })
      
      await fs.writeFile(inputPath, updatedContent)
      console.log(`Updated MDX content saved to ${inputPath}`)
    } catch (err) {
      console.error(`Failed to edit MDX content: ${err.message}`)
      throw err
    }
  }
  
  async batch(pattern, options = {}) {
    if (!pattern) {
      throw new Error('Pattern is required for batch command')
    }
    
    console.log(`Processing files matching pattern: ${pattern}...`)
    const config = await loadConfig()
    
    try {
      const files = await glob(pattern)
      
      if (files.length === 0) {
        console.log('No files found matching the pattern')
        return
      }
      
      console.log(`Found ${files.length} files to process`)
      
      for (const file of files) {
        console.log(`Processing ${file}...`)
        try {
          const content = await fs.readFile(file, 'utf-8')
          const updatedContent = await processFile(file, {
            ...config,
            ...options,
            mode: 'edit',
            content
          })
          
          await fs.writeFile(file, updatedContent)
          console.log(`Updated ${file}`)
        } catch (fileErr) {
          console.error(`Error processing ${file}: ${fileErr.message}`)
        }
      }
      
      console.log('Batch processing complete')
    } catch (err) {
      console.error(`Failed to process batch: ${err.message}`)
      throw err
    }
  }
  
  private ensureMdxExtension(filePath) {
    if (!filePath.endsWith('.mdx')) {
      return `${filePath}.mdx`
    }
    return filePath
  }
  
  private async findMdxFiles(directory) {
    const mdxFiles = await glob(`${directory}/**/*.mdx`)
    return mdxFiles
  }
}
