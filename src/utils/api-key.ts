import os from 'os'
import password from '@inquirer/password'
import fs from 'fs'
import path from 'path'
import { testApiKey } from './test-api-key.js'
import chalk from './chalk.js'

const keyFile = path.join(os.homedir(), '/.config/.ai-terminal')

export async function loadAPIKey() {
  if (!fs.existsSync(keyFile)) {
    console.log(
      chalk.warn('\nAPI Key not found. Please enter your OpenAI API key.\n')
    )

    const neWKey = await password({
      message: 'API Key:',
      mask: '*',
    })

    await testApiKey(neWKey)

    fs.writeFileSync(keyFile, neWKey)
  }

  return fs.readFileSync(keyFile, 'utf-8').trim()
}
