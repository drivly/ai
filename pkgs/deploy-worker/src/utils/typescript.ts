import { TypeScriptOptions } from '../types'
import * as ts from 'typescript'

/**
 * Validates TypeScript code
 * @param code TypeScript code to validate
 * @param options TypeScript options
 * @returns Array of errors if any
 */
export async function validateTypeScript(code: string, options: TypeScriptOptions = {}): Promise<string[]> {
  const { checkTypes = true, compilerOptions = {} } = options

  if (!checkTypes) {
    return []
  }

  // Create a virtual file system
  const fileSystem: { [key: string]: string } = {
    'worker.ts': code,
  }

  // Create compiler options
  const defaultCompilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    ...compilerOptions,
  }

  // Create compiler host
  const compilerHost = ts.createCompilerHost(defaultCompilerOptions)
  const originalGetSourceFile = compilerHost.getSourceFile

  // Override getSourceFile to use our virtual file system
  compilerHost.getSourceFile = (fileName, languageVersion) => {
    const sourceText = fileSystem[fileName as keyof typeof fileSystem]
    if (sourceText !== undefined) {
      return ts.createSourceFile(fileName, sourceText, languageVersion)
    }
    return originalGetSourceFile(fileName, languageVersion)
  }

  // Create program
  const program = ts.createProgram(Object.keys(fileSystem), defaultCompilerOptions, compilerHost)

  // Get diagnostics
  const diagnostics = [...program.getSyntacticDiagnostics(), ...program.getSemanticDiagnostics()]

  // Convert diagnostics to error messages
  return diagnostics.map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
    if (diagnostic.file && diagnostic.start !== undefined) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
      return `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
    }
    return message
  })
}
