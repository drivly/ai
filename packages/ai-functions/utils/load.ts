import fs from 'fs'
import path from 'path'

export function loadConfig(configPath: string) {
  const config = fs.readFileSync(path.resolve(configPath), 'utf8')
  return config
}
