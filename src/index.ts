#!/usr/bin/env node

import { program } from 'commander'
import fs from 'fs'
import path from 'path'
import os from 'os'
import password from '@inquirer/password'
import { OpenAI } from 'openai'
import { globby } from 'globby'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

const excludePatterns = [
  '.git/**',
  '.Trash/**',
  'node_modules/**',
  'Library/**',
  'Pictures/**',
  'Downloads/**',
  'Desktop/**',
  'Applications/**',
  'Applications \\(Parallels\\)/**',
  'Documents/**',
  'Movies/**',
  'Music/**',
  'Parallels/**',
  'FontBase/**',
  'Public/**',
  'Pictures/**',
]

async function main() {
  program
    .name('x')
    .option('-f, --file <file>', 'append file content to prompt')
    .option('-w, --workspace', 'append all files in directory to prompt')
    .option('-ls, --list', 'list all filenames in directory')
    .arguments('<args...>')
    .action(
      async (
        args: string[],
        opts: { file: string; workspace: boolean; list: boolean }
      ) => {
        const configFile = path.join(os.homedir(), '/.config/.ai-terminal')

        if (!fs.existsSync(configFile)) {
          console.error('config file not found')

          const api = await password({
            message: 'API Key',
            mask: '*',
          })

          const testApiKey = async (apiKey: string) => {
            try {
              const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                },
              })
              const res = (await response.json()) as any

              if (response.ok) {
                console.log(
                  'API key is valid. Models available:',
                  res.data.map((model: any) => model.id)
                )
                return true
              } else {
                console.error('Error:', res.error.message)
                return false
              }
            } catch (error: any) {
              console.error('Error connecting to OpenAI API:', error.message)
              return false
            }
          }

          const isValidApiKey = await testApiKey(api)

          if (isValidApiKey) {
            fs.writeFileSync(configFile, api)
            console.log('API Key saved to config file.')
          } else {
            console.error('Invalid API key. Exiting...')
            return
          }
        }

        const apiKey = fs.readFileSync(configFile, 'utf-8').trim()

        const openai = new OpenAI({
          apiKey,
        })

        const streamCompletion = async (prompt: string) => {
          const stream = await openai.chat.completions.create({
            model: 'gpt-4o-2024-08-06',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful assistant.',
              },
              { role: 'user', content: prompt },
            ],
            stream: true,
          })

          console.log('')

          for await (const part of stream) {
            if (part.choices && part.choices[0]?.delta?.content) {
              process.stdout.write(part.choices[0].delta.content)
            }
          }

          console.log('')
        }

        let prompt = args.join(' ')
        let fileCount = 0
        const query = prompt

        if (opts.file) {
          const searchFile = opts.file

          const files = await globby('**/*', {
            gitignore: true,
            ignore: excludePatterns,
          })

          const file = files.find((f) => f.includes(searchFile))

          if (file) {
            const fileContents = fs.readFileSync(file, 'utf-8').trim() + '\n---'

            fileCount++

            prompt += `\n\n--- ${file}\n${fileContents}`
          } else {
            console.error(`File not found: ${file}`)
            return
          }
        }

        if (opts.workspace) {
          const files = await globby(['**/*', '**/.*'], {
            gitignore: true,
            ignore: excludePatterns,
          })

          for (const file of files) {
            const fileContents = fs.readFileSync(file, 'utf-8').trim() + '\n---'

            fileCount++

            prompt += `\n\n--- ${file}\n${fileContents}`
          }
        }

        if (opts.list) {
          const files = await globby(['**/*', '**/.*'], {
            gitignore: true,
            ignore: excludePatterns,
          })

          fileCount = files.length

          prompt += `\n\n--- files listing ---\n${files.join(
            '\n'
          )}\n---------------------`
        }

        console.log(
          '\nPrompt:',
          prompt.length < 1000
            ? `\x1b[32m${prompt}\x1b[0m`
            : `\x1b[32m${
                query +
                '\n\n' +
                '--- ' +
                fileCount +
                ' files attacted but content is not displayed as prompt is ' +
                prompt.length +
                ' characters ---'
              }\x1b[0m`
        )

        await streamCompletion(prompt)
      }
    )

  program.parse()
}

main()
