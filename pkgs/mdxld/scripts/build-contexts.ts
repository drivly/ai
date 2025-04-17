import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import json5 from 'json5';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '..', 'src', 'contexts', 'source');
const BUILD_DIR = path.join(__dirname, '..', 'src', 'contexts', 'build');

// Create build directory if it doesn't exist
fs.mkdirSync(BUILD_DIR, { recursive: true });

interface JsonLdContext {
  '@context'?: Record<string, unknown>;
  [key: string]: unknown;
}

// Transform @ prefixes to $ prefixes in an object
function transformPrefixes(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) return obj;

  const result: Record<string, unknown> = Array.isArray(obj) ? [] : {};

  // Handle special cases for different contexts
  if (!Array.isArray(obj) && '@context' in obj && typeof obj['@context'] === 'object' && obj['@context'] !== null) {
    const context = obj['@context'] as Record<string, unknown>;

    // Handle schema.org context
    if ('schema' in context && context.schema === 'https://schema.org/') {
      result.$vocab = 'http://schema.org/';
    }

    // Handle EPCIS context
    if ('epcis' in context && typeof context.epcis === 'string') {
      result.$vocab = context.epcis;
      // Ensure the epcis property is preserved in the context
      if (!result.$context) result.$context = {};
      (result.$context as Record<string, unknown>).epcis = context.epcis;
    }
  }

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const newKey = key.startsWith('@') ? `$${key.slice(1)}` : key;
    result[newKey] = transformPrefixes(value);
  }

  return result;
}

function generateTypeScriptContent(constName: string, data: unknown): string {
  return `// Generated from ${constName}.jsonld
/* eslint-disable */
// @ts-nocheck - Large type definition
export const ${constName}: Record<string, any> = ${json5.stringify(data, null, 2)} as const;
`;
}

try {
  // Process each JSON-LD file
  const files = fs.readdirSync(SOURCE_DIR)
    .filter(file => file.endsWith('.jsonld'));

  for (const file of files) {
    try {
      const sourcePath = path.join(SOURCE_DIR, file);
      const content = fs.readFileSync(sourcePath, 'utf8');
      const json = JSON.parse(content) as JsonLdContext;
      const transformed = transformPrefixes(json);

      // Create TypeScript constant
      const constName = path.basename(file, '.jsonld')
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        .replace(/\./g, '');  // Remove dots from names

      const outputPath = path.join(BUILD_DIR, `${constName}.ts`);
      const outputContent = generateTypeScriptContent(constName, transformed);

      fs.writeFileSync(outputPath, outputContent);
      console.log(`Processed ${file} -> ${path.basename(outputPath)}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error processing ${file}:`, error.message);
      } else {
        console.error(`Error processing ${file}:`, error);
      }
    }
  }

  // Create index.ts to export all contexts
  const exportStatements = files
    .map(file => {
      const constName = path.basename(file, '.jsonld')
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        .replace(/\./g, '');  // Remove dots from names
      return `export { ${constName} } from './${constName}.js';`;
    })
    .join('\n');

  fs.writeFileSync(
    path.join(BUILD_DIR, 'index.ts'),
    `// Generated exports for JSON-LD contexts\n${exportStatements}\n`
  );

  console.log('Context build complete!');
} catch (error) {
  if (error instanceof Error) {
    console.error('Build process failed:', error.message);
  } else {
    console.error('Build process failed:', error);
  }
  process.exit(1);
}
