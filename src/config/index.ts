import fs from 'fs'
import path from 'path'

export function loadConfig(): any {
  const configPath = path.join(process.cwd(), '.ax.json')

  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  }

  return {}
}

export function saveConfig(config: any) {
  const configPath = path.join(process.cwd(), '.ax.json')
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
}
