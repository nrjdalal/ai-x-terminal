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

async function main() {
  program
    .name('x')
    .option('-f, --file <file>', 'append file contents to prompt')
    .arguments('<args...>')
    .action(async (args: string[], opts: { file: string }) => {
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
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.',
            },
            { role: 'user', content: prompt },
          ],
          stream: true,
        })

        for await (const part of stream) {
          if (part.choices && part.choices[0]?.delta?.content) {
            process.stdout.write(part.choices[0].delta.content)
          }
        }
      }

      let prompt = args.join(' ')

      if (opts.file) {
        let file = opts.file

        const files = await globby('**/*', {
          gitignore: true,
        })

        const filePath = files.find((f) => f.includes(file))

        if (filePath) {
          const fileContents = fs.readFileSync(filePath, 'utf-8')

          prompt += `\n--- ${filePath}\n${fileContents}\n---`
        } else {
          console.error(`File not found: ${file}`)
          return
        }
      }

      await streamCompletion(prompt)
    })

  program.parse()
}

main()
