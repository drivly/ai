import type { WorkerExport, FunctionExport, ConstantExport, ExampleTest, FunctionDoc } from './types.js'

/**
 * Get a list of all exports from a module
 * @param moduleExports The module exports object
 * @returns An object with export name and type information
 */
export function getModuleExports(moduleExports: any): Record<string, FunctionExport | ConstantExport> {
  const exports: Record<string, FunctionExport | ConstantExport> = {}
  
  for (const [name, value] of Object.entries(moduleExports)) {
    if (typeof value === 'function') {
      exports[name] = {
        type: 'function',
        examples: [], // Will be populated later
        documentation: value.toString()
      }
    } else {
      exports[name] = {
        type: 'constant',
        value
      }
    }
  }
  
  return exports
}

/**
 * Extract examples from test files
 * @param testContent The content of the test file
 * @returns Array of examples extracted from the tests
 */
export function extractExamplesFromTests(testContent: string): Record<string, ExampleTest[]> {
  const examples: Record<string, ExampleTest[]> = {}
  
  
  const testBlocks = testContent.split('it(').slice(1);
  
  for (const block of testBlocks) {
    const descMatch = block.match(/['"]([^'"]+)['"]/);
    if (!descMatch) continue;
    const testDescription = descMatch[1];
    
    const functionCallMatch = block.match(/(?:const|let)\s+(?:result|response)\s*=\s*(?:await\s+)?([a-zA-Z0-9_]+)\s*\(\s*({[^}]+})\s*\)/);
    if (!functionCallMatch) continue;
    
    const [_, functionName, functionParams] = functionCallMatch;
    
    const expectMatch = block.match(/expect\s*\(\s*(?:result|response)\s*\)\.(?:toBe|toEqual|toStrictEqual)\s*\(\s*([^)]+)\s*\)/);
    let expectedResult = 'undefined';
    if (expectMatch) {
      expectedResult = expectMatch[1];
    }
    
    if (!examples[functionName]) {
      examples[functionName] = [];
    }
    
    examples[functionName].push({
      id: examples[functionName].length,
      description: testDescription.trim(),
      input: functionParams.trim(),
      expectedOutput: expectedResult.trim(),
    });
  }
  
  return examples;
}

/**
 * Generate a wrapper for a worker module
 * @param originalModule The original module to wrap
 * @param testContent Optional test file content to extract examples from
 * @returns A wrapped module with introspection capabilities
 */
export function generateWorkerWrapper(originalModule: any, testContent?: string): any {
  const moduleExports = getModuleExports(originalModule)
  
  if (testContent) {
    const examples = extractExamplesFromTests(testContent)
    
    for (const [functionName, functionExamples] of Object.entries(examples)) {
      if (moduleExports[functionName] && moduleExports[functionName].type === 'function') {
        (moduleExports[functionName] as FunctionExport).examples = functionExamples
      }
    }
  }
  
  return {
    fetch: async (request: Request, env: any, ctx: any) => {
      const url = new URL(request.url)
      const pathname = url.pathname
      
      if (pathname === '/__worker_introspect' || pathname === '/') {
        return new Response(JSON.stringify(moduleExports), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      const pathParts = pathname.split('/').filter(Boolean)
      const exportName = pathParts[0]
      
      if (!exportName || !moduleExports[exportName]) {
        return new Response(JSON.stringify({ error: 'Export not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      const exportDef = moduleExports[exportName]
      
      if (exportDef.type === 'constant') {
        return new Response(JSON.stringify({
          name: exportName,
          type: 'constant',
          value: (exportDef as ConstantExport).value
        }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      if (exportDef.type === 'function') {
        const functionExport = exportDef as FunctionExport
        
        if (pathParts[1] === 'examples' && pathParts[2]) {
          const exampleId = parseInt(pathParts[2], 10)
          const example = functionExport.examples.find((ex: ExampleTest) => ex.id === exampleId)
          
          if (!example) {
            return new Response(JSON.stringify({ error: 'Example not found' }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' }
            })
          }
          
          try {
            const inputParams = eval(`(${example.input})`)
            const result = await originalModule[exportName](inputParams)
            
            return new Response(JSON.stringify({
              name: exportName,
              type: 'function',
              example: {
                ...example,
                actualOutput: result
              }
            }), {
              headers: { 'Content-Type': 'application/json' }
            })
          } catch (error) {
            return new Response(JSON.stringify({
              error: 'Error executing function',
              details: error instanceof Error ? error.message : String(error)
            }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            })
          }
        }
        
        return new Response(JSON.stringify({
          name: exportName,
          type: 'function',
          documentation: functionExport.documentation,
          examples: functionExport.examples
        }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      return new Response(JSON.stringify({ error: 'Invalid export type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}
