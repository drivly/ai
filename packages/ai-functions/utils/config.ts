import path from 'path'
import fs from 'fs'

export async function loadConfig() {
    const configDir = process.cwd() // Root of the consuming project
    const possibleConfigs = ['ai.config.ts', 'ai.config.js']

    for (const fileName of possibleConfigs) {
        const filePath = path.join(configDir, fileName)
        if (fs.existsSync(filePath)) {
            if (fileName.endsWith('.ts')) {
                // Dynamically require ts-node for TypeScript files
                require('ts-node').register()
            }
            const config = await import(filePath)
            return config.default || config // Handle default exports
        }
    }

    console.log('No configuration file found. Using default configuration.')
    return {}
}