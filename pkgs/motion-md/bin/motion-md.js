#!/usr/bin/env node

const { program } = require('commander')
const path = require('path')
const fs = require('fs')
const { parseMarkdownWithFrontmatter, createVideoFromSlides } = require('../dist')

program
  .name('motion-md')
  .description('Convert Markdown to video presentations using Remotion')
  .version('0.1.0')

program
  .command('render <input>')
  .description('Render a Markdown file to video')
  .option('-o, --output <path>', 'Output file path')
  .option('-q, --quality <quality>', 'Video quality (draft or production)', 'production')
  .option('--no-tts', 'Disable text-to-speech')
  .action(async (input, options) => {
    try {
      const inputPath = path.resolve(process.cwd(), input)
      const markdown = fs.readFileSync(inputPath, 'utf-8')
      
      const { globalConfig, slides } = parseMarkdownWithFrontmatter(markdown)
      
      const outputPath = options.output || globalConfig.output || 'output.mp4'
      const resolvedOutputPath = path.resolve(process.cwd(), outputPath)
      
      console.log(`Rendering ${inputPath} to ${resolvedOutputPath}...`)
      
      const result = await createVideoFromSlides({
        slides,
        config: globalConfig,
        outputPath: resolvedOutputPath,
        options: {
          tts: options.tts,
          quality: options.quality,
        },
      })
      
      console.log(`Video generated successfully!`)
      console.log(`Output: ${result.outputPath}`)
      console.log(`Duration: ${result.duration.toFixed(2)}s`)
      console.log(`Size: ${(result.size / 1024 / 1024).toFixed(2)} MB`)
    } catch (error) {
      console.error('Error rendering video:', error)
      process.exit(1)
    }
  })

program.parse()
