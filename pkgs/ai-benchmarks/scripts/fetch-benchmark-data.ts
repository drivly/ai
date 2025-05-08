import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import AdmZip from 'adm-zip'
import { parse } from 'csv-parse/sync'
import JSON5 from 'json5'
import camelCase from 'camelcase'
import type { BenchmarkCSVRow, ModelBenchmark, BenchmarkDataset } from '../src/types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BENCHMARK_URL = 'https://epoch.ai/data/benchmark_data.zip'
const OUTPUT_DIR = path.resolve(__dirname, '../src/benchmarks')
const TMP_DIR = path.resolve(__dirname, '../tmp')

async function downloadBenchmarkData() {
  try {
    console.log(`Downloading benchmark data from ${BENCHMARK_URL}...`)
    const response = await fetch(BENCHMARK_URL)
    
    if (!response.ok) {
      throw new Error(`Failed to download benchmark data: ${response.statusText}`)
    }
    
    if (!fs.existsSync(TMP_DIR)) {
      fs.mkdirSync(TMP_DIR, { recursive: true })
    }
    
    const zipPath = path.resolve(TMP_DIR, 'benchmark_data.zip')
    const buffer = await response.arrayBuffer()
    fs.writeFileSync(zipPath, Buffer.from(buffer))
    
    console.log(`Benchmark data downloaded to ${zipPath}`)
    return zipPath
  } catch (error) {
    console.error('Error downloading benchmark data:', error)
    throw error
  }
}

function extractZipFile(zipPath: string) {
  try {
    console.log(`Extracting ${zipPath}...`)
    // @ts-expect-error - AdmZip is a constructor but TypeScript doesn't recognize it correctly
    const zip = new AdmZip(zipPath)
    const extractPath = path.resolve(TMP_DIR, 'benchmark_data')
    
    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath, { recursive: true })
    }
    
    zip.extractAllTo(extractPath, true)
    console.log(`Extracted to ${extractPath}`)
    return extractPath
  } catch (error) {
    console.error('Error extracting zip file:', error)
    throw error
  }
}

function parseCSVFiles(extractPath: string) {
  try {
    console.log(`Parsing CSV files from ${extractPath}...`)
    const csvFiles = fs.readdirSync(extractPath)
      .filter(file => file.endsWith('.csv'))
    
    const allBenchmarkRows: BenchmarkCSVRow[] = []
    
    for (const csvFile of csvFiles) {
      console.log(`Parsing ${csvFile}...`)
      const csvPath = path.resolve(extractPath, csvFile)
      const csvContent = fs.readFileSync(csvPath, 'utf-8')
      
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      }) as BenchmarkCSVRow[]
      
      allBenchmarkRows.push(...records)
    }
    
    console.log(`Parsed ${allBenchmarkRows.length} benchmark records`)
    return allBenchmarkRows
  } catch (error) {
    console.error('Error parsing CSV files:', error)
    throw error
  }
}

function processBenchmarkData(benchmarkRows: BenchmarkCSVRow[]) {
  try {
    console.log('Processing benchmark data...')
    const modelBenchmarks: Record<string, ModelBenchmark> = {}
    
    for (const row of benchmarkRows) {
      const modelSlug = row.model.toLowerCase().replace(/\s+/g, '-')
      
      if (!modelBenchmarks[modelSlug]) {
        modelBenchmarks[modelSlug] = {
          modelSlug,
          benchmarks: {},
          categories: {}
        }
      }
      
      const benchmark = {
        score: parseFloat(row.score),
        timestamp: row.timestamp,
        version: row.version,
        ...(Object.keys(row)
          .filter(key => !['model', 'benchmark', 'category', 'score', 'timestamp', 'version'].includes(key))
          .reduce((acc, key) => {
            if (row[key] !== undefined) {
              acc[camelCase(key)] = row[key] as string
            }
            return acc
          }, {} as Record<string, string>))
      }
      
      modelBenchmarks[modelSlug].benchmarks[row.benchmark] = benchmark
      
      const category = row.category || 'uncategorized'
      if (!modelBenchmarks[modelSlug].categories[category]) {
        modelBenchmarks[modelSlug].categories[category] = []
      }
      modelBenchmarks[modelSlug].categories[category].push(benchmark)
    }
    
    for (const modelSlug in modelBenchmarks) {
      const benchmarkValues = Object.values(modelBenchmarks[modelSlug].benchmarks)
      if (benchmarkValues.length > 0) {
        const sum = benchmarkValues.reduce((acc, b) => acc + b.score, 0)
        modelBenchmarks[modelSlug].overallScore = sum / benchmarkValues.length
      }
    }
    
    const benchmarkDataset: BenchmarkDataset = {
      models: modelBenchmarks,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    }
    
    console.log(`Processed benchmark data for ${Object.keys(modelBenchmarks).length} models`)
    return benchmarkDataset
  } catch (error) {
    console.error('Error processing benchmark data:', error)
    throw error
  }
}

function createModelGroups(dataset: BenchmarkDataset) {
  try {
    console.log('Creating model groups...')
    const modelGroups: Record<string, Record<string, ModelBenchmark>> = {}
    
    for (const [modelSlug, modelBenchmark] of Object.entries(dataset.models)) {
      const provider = modelSlug.split('/')[0] || 'unknown'
      
      if (!modelGroups[provider]) {
        modelGroups[provider] = {}
      }
      
      modelGroups[provider][modelSlug] = modelBenchmark
    }
    
    return modelGroups
  } catch (error) {
    console.error('Error creating model groups:', error)
    throw error
  }
}

function writeModelGroupFiles(modelGroups: Record<string, Record<string, ModelBenchmark>>, dataset: BenchmarkDataset) {
  try {
    console.log('Writing model group files...')
    
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    }
    
    const indexPath = path.resolve(OUTPUT_DIR, 'index.ts')
    const imports = Object.keys(modelGroups)
      .map(group => `import ${camelCase(group)} from './${group}'`)
      .join('\n')
    
    const exports = `
export const modelGroups = {
  ${Object.keys(modelGroups).map(group => `${camelCase(group)}`).join(',\n  ')}
}

export const lastUpdated = '${dataset.lastUpdated}'
export const version = '${dataset.version}'

export default {
  models: {
    ${Object.keys(modelGroups).map(group => 
      `...${camelCase(group)}`
    ).join(',\n    ')}
  },
  lastUpdated,
  version
}
`
    
    fs.writeFileSync(indexPath, `${imports}\n\n${exports}`)
    
    for (const [group, models] of Object.entries(modelGroups)) {
      const groupPath = path.resolve(OUTPUT_DIR, `${group}.ts`)
      const content = `// Auto-generated benchmark data for ${group} models

export default ${JSON5.stringify(models, null, 2)}
`
      fs.writeFileSync(groupPath, content)
    }
    
    console.log(`Wrote ${Object.keys(modelGroups).length} model group files to ${OUTPUT_DIR}`)
  } catch (error) {
    console.error('Error writing model group files:', error)
    throw error
  }
}

async function main() {
  try {
    const zipPath = await downloadBenchmarkData()
    const extractPath = extractZipFile(zipPath)
    const benchmarkRows = parseCSVFiles(extractPath)
    const dataset = processBenchmarkData(benchmarkRows)
    const modelGroups = createModelGroups(dataset)
    writeModelGroupFiles(modelGroups, dataset)
    
    console.log('Benchmark data processing complete!')
  } catch (error) {
    console.error('Error in benchmark data processing:', error)
    process.exit(1)
  }
}

main()
