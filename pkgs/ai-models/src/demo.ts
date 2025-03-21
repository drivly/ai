import { generateText } from 'ai'
import { getModel } from './modelSelector'
import { parse } from './parser'
const prompt = 'What is greater, 9.11 or 9.9?'

console.log(
  await generateText({
    model: getModel('drivly/frontier:reasoning'),
    prompt,
  }).then((x) => x.text),
)

console.log(parse('google/gemini-2.0-flash-001:reasoning'))
