import camelCase from 'camelcase'

const URL = 'https://openrouter.ai/api/frontend/models/find?order=top-weekly'

function camelCaseDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(camelCaseDeep) as any;
  }
  
  if (input !== null && typeof input === 'object') {
    return Object.entries(input).reduce((acc, [key, value]) => {
      acc[camelCase(key)] = camelCaseDeep(value);
      return acc;
    }, {} as Record<string, any>) as any;
  }
  
  return input;
}

const response = await fetch(URL).then(res => res.json())

const models = camelCaseDeep(response.data)

console.log(models)