#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CLI } from 'apis.do/src/cli';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

const args = process.argv.slice(2);

async function main() {
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return;
  }

  if (args[0] === '--version' || args[0] === '-v') {
    console.log(`my-cli v${version}`);
    return;
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  try {
    const cli = new CLI({
      apiKey: process.env.MY_CLI_API_KEY,
      configPath: '.ai/config.json'
    });

    switch (command) {
      case 'hello':
        console.log(`Hello, ${commandArgs[0] || 'world'}!`);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
my-cli v${version}

Usage:
  my-cli <command> [options]

Commands:
  hello [name]     Say hello to someone
  --help, -h       Show this help message
  --version, -v    Show version information
`);
}

main().catch((error) => {
  console.error('Unhandled error:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
