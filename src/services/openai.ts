import { OpenAI } from 'openai'
import chalk from '../utils/chalk.js'
import ora, { Ora } from 'ora'
import { colorCode } from '../utils/colorCode.js'

export async function streamCompletion(
  openai: OpenAI,
  prompt: string,
  config: any
): Promise<string> {
  let spinner: Ora | null = null
  let finalContent = ''

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        { role: 'system', content: config.persona },
        { role: 'user', content: prompt },
      ],
      stream: true,
    })

    let buffer = '\n'
    let insideCodeBlock = false

    for await (const part of stream) {
      if (part.choices && part.choices[0]?.delta?.content) {
        const chunk = part.choices[0].delta.content
        finalContent += chunk // Collect the content

        buffer += chunk

        while (buffer.includes(`\`\`\``)) {
          const [before, after] = buffer.split(`\`\`\``, 2)

          if (insideCodeBlock) {
            if (spinner) {
              spinner.stop()
              spinner = null
            }
            process.stdout.write(colorCode(`\`\`\`${before}\`\`\``))
            insideCodeBlock = false
          } else {
            process.stdout.write(chalk.yellow(before))
            insideCodeBlock = true

            if (!spinner) {
              spinner = ora({
                text: 'Writing code...',
                spinner: 'dots',
              }).start()
            }
          }

          buffer = after
        }

        if (!insideCodeBlock) {
          if (spinner) {
            spinner.stop()
            spinner = null
          }
          process.stdout.write(buffer)
          buffer = ''
        }
      }
    }

    if (buffer) {
      if (insideCodeBlock) {
        if (spinner) {
          spinner.stop()
          spinner = null
        }
        process.stdout.write(chalk.blue(buffer))
      } else {
        process.stdout.write(buffer)
      }
    }
  } catch (error) {
    console.error(
      chalk.red('An error occurred while streaming completion:'),
      error instanceof Error ? error.message : String(error)
    )
    return ''
  } finally {
    if (spinner) {
      spinner.stop()
    }
  }
  return finalContent
}

export function parseCompletion(completion: string): string {
  // Add parsing logic here if needed to handle multiple code blocks or delimiters
  return completion
}
