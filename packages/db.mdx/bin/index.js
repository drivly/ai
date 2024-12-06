#!/usr/bin/env node

import { generateTypes } from '../dist/lib/generateTypes.js'

console.log('Generating types...')

generateTypes()

console.log('Done!')
