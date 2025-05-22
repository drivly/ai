// A CLI interface for the parser.

import { getModel } from './parser'

// Get the model name from the command line arguments
const modelName = process.argv[2]

// Get the model from the parser
const model = getModel(modelName)

console.log(model)
