#!/usr/bin/env node

import { generateTypes } from './dist/bin/generateTypes.js'

if (process.argv.includes('generate:types')) {
  await generateTypes()
} else {

}

