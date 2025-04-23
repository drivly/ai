#!/usr/bin/env node

import { program } from 'commander'
import { parseMarkdownWithFrontmatter, createVideoFromSlides } from '../dist/index.js'
import fs from 'fs'

program.name('motion.md').description('Convert Markdown to video presentations using Remotion').version('0.1.0')

program
  .command('render <input>')
  .description('Render a markdown file to video')
  .option('-o, --output <path>', 'Output file path')
  .option('-q, --quality <quality>', 'Video quality (draft or production)', 'draft')
  .option('--no-tts', 'Disable text-to-speech')
  .action(async (input, options) => {
    try {
      const markdownContent = fs.readFileSync(input, 'utf-8')

      const { globalConfig, slides } = parseMarkdownWithFrontmatter(markdownContent)

      const outputPath = options.output || globalConfig.output || 'output.mp4'

      console.log(`Rendering video to ${outputPath}...`)

      const result = await createVideoFromSlides({
        slides,
        config: globalConfig,
        outputPath,
        options: {
          tts: options.tts,
          quality: options.quality,
        },
      })

      console.log(`Video generated successfully!`)
      console.log(`Output: ${result.outputPath}`)
      console.log(`Duration: ${result.duration}s`)
      console.log(`Size: ${result.size} bytes`)
    } catch (error) {
      console.error('Error generating video:', error)
      process.exit(1)
    }
  })

program.parse(process.argv)
