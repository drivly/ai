import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname } from 'path';

// Ensure dist directory exists
if (!existsSync('./dist')) {
  mkdirSync('./dist', { recursive: true });
}

// Build the main index.js file
build({
  entryPoints: ['./index.ts'],
  bundle: true,
  outfile: './dist/index.js',
  format: 'esm',
  platform: 'neutral',
  external: ['apis.do'],
  target: 'es2020',
}).then(() => {
  console.log('✅ Built index.js');
  
  // Create a simple types.d.ts file
  const typesContent = readFileSync('./types.ts', 'utf8');
  const dtsContent = typesContent
    .replace(/export\s+type/g, 'export type')
    .replace(/export\s+interface/g, 'export interface');
  
  writeFileSync('./dist/types.d.ts', dtsContent);
  console.log('✅ Created types.d.ts');
  
  // Create index.d.ts file
  const indexContent = `
import { AIConfig, AIFunction, FunctionDefinition, FunctionCallback, SchemaValue, AI_Instance, SchemaToOutput, MarkdownOutput } from './types';
export type { FunctionResponse, FunctionDefinition as ClientFunctionDefinition, AIConfig as ClientAIConfig } from './src/index';
export { default as FunctionsClient } from './src/index';

export declare const AI: <T extends Record<string, FunctionDefinition | FunctionCallback>>(
  functions: T,
  config?: AIConfig
) => {
  [K in keyof T]: T[K] extends FunctionDefinition
    ? AIFunction<any, SchemaToOutput<T[K]>> & ((input: any, config?: AIConfig) => Promise<SchemaToOutput<T[K]>>)
    : T[K] extends FunctionCallback<infer TArgs>
      ? FunctionCallback<TArgs>
      : never;
};

export declare const ai: AI_Instance;
`;
  
  writeFileSync('./dist/index.d.ts', indexContent);
  console.log('✅ Created index.d.ts');
  
  console.log('✅ Build completed successfully!');
}).catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});
