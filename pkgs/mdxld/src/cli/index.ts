async function getVersion() {
  const packageJson = await import('../../package.json', { assert: { type: 'json' } })
  return packageJson.default.version
}

interface CliOptions {
  version?: boolean
  help?: boolean
}

export function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {}

  for (const arg of args) {
    if (arg === '-v' || arg === '--version') {
      options.version = true
    } else if (arg === '-h' || arg === '--help') {
      options.help = true
    }
  }

  return options
}

export function showHelp(): void {
  console.log(`
Usage: package-template [options]

Options:
  -v, --version  Show version number
  -h, --help     Show help
`)
}

export async function showVersion(): Promise<void> {
  const version = await getVersion()
  console.log(`v${version}`)
}

export async function cli(args: string[] = process.argv.slice(2)): Promise<void> {
  const options = parseArgs(args)

  if (options.version) {
    await showVersion()
  } else if (options.help) {
    showHelp()
  } else {
    showHelp()
  }
}
