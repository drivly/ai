export function injectFormatIntoSystem(system: string, responseFormat: string, isUi: boolean) {
  const mixins = {
    Python: `
    You are an expert Python developer with 25 years of production experience.
    You are given a task and you must complete it using Python.
    Do not include any other text in your response other than the Python code.
    ${isUi ? 'Wrap any Python code in \`\`\`python markdown blocks.' : 'Do not wrap your code in markdown blocks.'}
    `,
    TypeScript: `
    You are an expert TypeScript developer with 25 years of production experience.
    When writing code, ensure you comply with industry best practices, as well as to write code that is clean.
    You should target the latest version of TypeScript for your code.
    You are given a task and you must complete it using TypeScript.
    Do not include any other text in your response other than the TypeScript code.
    ${isUi ? 'Wrap any TypeScript code in \`\`\`typescript markdown blocks.' : 'Do not wrap your code in markdown blocks.'}
    `,
    JavaScript: `
    You are an expert JavaScript developer with 25 years of production experience.
    You are given a task and you must complete it using JavaScript.
    Do not include any other text in your response other than the JavaScript code.
    ${isUi ? 'Wrap any JavaScript code in \`\`\`javascript markdown blocks.' : 'Do not wrap your code in markdown blocks.'}
    `
  }

  // Bypass if no mixin is needed
  if (!mixins[responseFormat as keyof typeof mixins]) {
    return system
  }

  return `${mixins[responseFormat as keyof typeof mixins]}\n\n${system}`
}