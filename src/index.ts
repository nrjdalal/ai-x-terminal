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
  program
    .name('x')
    .option('-f, --file <file>', 'append file content to prompt')
    .option('-w, --workspace', 'append all files in directory to prompt')
    .option('-ls, --list', 'list all filenames in directory')
    .option('-p, --persona <persona>', 'set custom persona')
    .arguments('<args...>')
    .action(
      async (
        args: string[],
        opts: {
          file: string
          workspace: boolean
          list: boolean
          persona: string
        }
      ) => {
        const keyFile = path.join(os.homedir(), '/.config/.ai-terminal')
        const configFile = path.join(process.cwd(), '.ax.json')

        if (!fs.existsSync(keyFile)) {
          console.error('API Key not found. Please enter your OpenAI API key.')

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
            fs.writeFileSync(keyFile, api)
            console.log('API Key saved to config file.')
          } else {
            console.error('Invalid API key. Exiting...')
            return
          }
        }

        const apiKey = fs.readFileSync(keyFile, 'utf-8').trim()

        const openai = new OpenAI({
          apiKey,
        })

        let persona = 'You are a helpful assistant.'
        let isConfigFileNewlyCreated = false
        if (fs.existsSync(configFile)) {
          const configData = JSON.parse(fs.readFileSync(configFile, 'utf-8'))
          persona = configData.persona || persona
        } else {
          isConfigFileNewlyCreated = true
        }

        if (opts.persona) {
          persona = opts.persona
          fs.writeFileSync(configFile, JSON.stringify({ persona }, null, 2))
          console.log('\x1b[32m\nPersona updated.\x1b[0m')
        }

        if (isConfigFileNewlyCreated) {
          const gitignorePath = path.join(process.cwd(), '.gitignore')
          if (fs.existsSync(gitignorePath)) {
            const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8')
            if (!gitignoreContent.includes('.ax.json')) {
              fs.appendFileSync(gitignorePath, '\n# ai-x-terminal\n.ax.json\n')
            }
          } else {
            fs.writeFileSync(gitignorePath, '# ai-x-terminal\n.ax.json\n')
          }
        }

        const streamCompletion = async (prompt: string) => {
          const stream = await openai.chat.completions.create({
            model: 'gpt-4o-2024-08-06',
            messages: [
              {
                role: 'system',
                content: persona,
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
