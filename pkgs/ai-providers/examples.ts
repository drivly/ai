import { models } from './src';

// Example 1: Direct usage
async function example1() {
  const result = await models.generateText({
    model: 'gpt-4.5-preview',
    prompt: 'Write a blog post about the future of work',
  });
  
  console.log(result.text);
}

// Example 2: Get model instance
async function example2() {
  const model = models.get('gpt-4.5-preview');
  const result = await model.generateText('Write a blog post about the future of work');
  
  console.log(result.text);
}

// Example 3: Using providers
async function example3() {
  // This will be routed to Anthropic
  const claudeResult = await models.generateText({
    model: 'claude-3-opus',
    prompt: 'Write a blog post about the future of work',
  });
  
  console.log('Claude result:', claudeResult.text);
  
  // This will be routed to Google
  const geminiResult = await models.generateText({
    model: 'gemini-pro',
    prompt: 'Write a blog post about the future of work',
  });
  
  console.log('Gemini result:', geminiResult.text);
}
