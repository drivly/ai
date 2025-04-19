import camelCase from 'camelcase'

const allProviders = [
  'OpenAI',
  'Anthropic',
  'Google',
  'Google AI Studio',
  'Amazon Bedrock',
  'Groq',
  'SambaNova',
  'Cohere',
  'Mistral',
  'Together',
  'Together 2',
  'Fireworks',
  'DeepInfra',
  'Lepton',
  'Novita',
  'Avian',
  'Lambda',
  'Azure',
  'Modal',
  'AnyScale',
  'Replicate',
  'Perplexity',
  'Recursal',
  'OctoAI',
  'DeepSeek',
  'Infermatic',
  'AI21',
  'Featherless',
  'Inflection',
  'xAI',
  'Cloudflare',
  'SF Compute',
  'Minimax',
  'Nineteen',
  'Liquid',
  'Stealth',
  'NCompass',
  'InferenceNet',
  'Friendli',
  'AionLabs',
  'Alibaba',
  'Nebius',
  'Chutes',
  'Kluster',
  'Crusoe',
  'Targon',
  'Ubicloud',
  'Parasail',
  'Phala',
  'Cent-ML',
  'Venice',
  'OpenInference',
  'Atoma',
  '01.AI',
  'HuggingFace',
  'Mancer',
  'Mancer 2',
  'Hyperbolic',
  'Hyperbolic 2',
  'Lynn 2',
  'Lynn',
  'Reflection',
]

export const getProviderName = (provider: string) => {
  // Reverse a camelCase string into the provider's name

  switch (provider) {
    case 'vertex':
      return 'Google'
    case 'google':
      return 'Google AI Studio'
    default:
      return allProviders.find((p) => camelCase(p) === provider)
  }
}
