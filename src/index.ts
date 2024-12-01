#!/usr/bin/env node

import fs from 'fs'
import { initializeCLI } from './cli/index.js'
import { loadAPIKey } from './utils/api-key.js'
import { streamCompletion } from './services/openai.js'
import { OpenAI } from 'openai'
import { loadConfig, saveConfig } from './config/index.js'
import { globby } from 'globby'

const excludePatterns = [
  '.git/**',
  '.Trash/**',
  'Applications \\(Parallels\\)/**',
  'Applications/**',
  'Desktop/**',
  'Documents/**',
  'Downloads/**',
  'FontBase/**',
  'Library/**',
  'Movies/**',
  'Music/**',
  'node_modules/**',
  'Parallels/**',
  'Pictures/**',
  'Public/**',
]

async function main() {
  const program = initializeCLI()

  program.action(async (args: string[], opts) => {
    try {
      const apiKey = await loadAPIKey()
      const config = {
        persona: 'You are a helpful assistant.',
        ...loadConfig(),
      }

      if (opts.persona) {
        config.persona = opts.persona
        saveConfig(config)
      }

      const openai = new OpenAI({ apiKey })
      const initialPrompt = args.join(' ') || 'Hello from AI Terminal!'
      let fileCount = 0
      let filesToReplace: string[] = []
      let prompt = initialPrompt

      const processFiles = async (files: string[]) => {
        for (const file of files) {
          const fileContents = fs.readFileSync(file, 'utf-8').trim() + '\n---'
          fileCount++
          prompt += `\n\n--- ${file}\n${fileContents}`
          if (opts.replace) {
            filesToReplace.push(file)
          }
        }
      }

      if (opts.file) {
        const files = await globby('**/*', {
          gitignore: true,
          ignore: excludePatterns,
        })
        const file = files.find((f) => f.includes(opts.file))
        if (file) {
          await processFiles([file])
        } else {
          throw new Error(`File not found: ${opts.file}`)
        }
      }

      if (opts.workspace || opts.list) {
        const files = await globby(['**/*', '**/.*'], {
          gitignore: true,
          ignore: excludePatterns,
        })
        if (opts.workspace) {
          await processFiles(files)
        }
        if (opts.list) {
          fileCount = files.length
          prompt += `\n\n--- files listing ---\n${files.join(
            '\n'
          )}\n---------------------`
        }
      }

      console.log(
        '\nPrompt:',
        prompt.length < 1000
          ? `\x1b[32m${prompt}\x1b[0m`
          : `\x1b[32m${
              initialPrompt +
              '\n\n' +
              '--- ' +
              fileCount +
              ' files attached but content is not displayed as prompt is ' +
              prompt.length +
              ' characters ---'
            }\x1b[0m`
      )

      // Stream completion
      await streamCompletion(openai, prompt, config, opts)
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message)
      } else {
        console.error('Error:', error)
      }
    }
  })

  program.parse()
}

main()
