import { generateObject } from 'ai'
import type { LanguageModel } from 'ai'
import { openai } from '@ai-sdk/openai'

type AIConfig = Partial<Parameters<typeof generateObject>[0]> & { model: string}

type PrependUnderscoreToKeys<T> = {
  [K in keyof T as `_${string & K}`]: T[K];
}

type AIObjectGenerator =  Record<string, (schema: Record<string, any>, config?: AIConfig) => Promise<any>>
type AITaggedTemplate = (strings: TemplateStringsArray, ...values: any[]) => Promise<string>
type AITaggedTemplateWithConfig = {
  (strings: TemplateStringsArray, ...values: any[]): CallablePromise<string>;
  (strings: string): CallablePromise<string>;
} & {
  (strings: TemplateStringsArray, ...values: any[]): {
    (config: AIConfig): Promise<string>;
  };
}
type AIFunction = AIObjectGenerator | AITaggedTemplate | AITaggedTemplateWithConfig


type CallablePromise<T> = Promise<T> & {
  (config: AIConfig): Promise<T>;
};

export function ai(strings: TemplateStringsArray | string, ...values: any[]): AITaggedTemplateWithConfig {
  // Create the base promise
  const basePromise = new Promise<string>((resolve) => {
    const prompt = typeof strings === 'string' 
      ? strings 
      : strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
    resolve(prompt);
  });

  // Create a callable function that returns a new promise
  const callable = ((config?: AIConfig) => {
    if (config) {
      return basePromise.then(prompt => prompt);
    }
    return basePromise;
  }) as CallablePromise<string>

  // Copy over Promise methods to make it "thenable"
  Object.setPrototypeOf(callable, Promise.prototype);
  
  // Copy the promise methods from basePromise to our callable function
  const methods = ['then', 'catch', 'finally'] as const;
  methods.forEach(method => {
    (callable as any)[method] = basePromise[method].bind(basePromise);
  });

  return callable as unknown as AITaggedTemplateWithConfig;
}
