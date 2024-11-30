import { OpenAI } from 'openai'
import chalk from '../utils/chalk.js'
import ora, { Ora } from 'ora'
import { colorCode } from '../utils/colorCode.js'

export async function streamCompletion(
  openai: OpenAI,
  prompt: string,
  persona: string
) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o-2024-08-06',
    messages: [
      { role: 'system', content: persona },
      { role: 'user', content: prompt },
    ],
    stream: true,
  })

  let buffer = '\n' // Holds the ongoing stream
  let insideCodeBlock = false // Tracks if inside a code block
  let spinner: Ora | null = null // Spinner instance

  for await (const part of stream) {
    if (part.choices && part.choices[0]?.delta?.content) {
      const chunk = part.choices[0].delta.content

      buffer += chunk // Append the chunk to the buffer

      while (buffer.includes(`\`\`\``)) {
        const [before, after] = buffer.split(`\`\`\``, 2)

        if (insideCodeBlock) {
          // Closing backticks detected
          if (spinner) {
            spinner.stop() // Stop the spinner
            spinner = null // Clear the spinner reference
          }
          process.stdout.write(colorCode(`\`\`\`${before}\`\`\``))
          insideCodeBlock = false
        } else {
          // Opening backticks detected
          process.stdout.write(chalk.yellow(before))
          insideCodeBlock = true

          // Start the spinner when inside a code block
          if (!spinner) {
            spinner = ora({ text: 'Writing code...', spinner: 'dots' }).start()
          }
        }

        buffer = after // Update the buffer with the remaining data
      }

      // If no backticks detected, print normally if not inside a code block
      if (!insideCodeBlock) {
        if (spinner) {
          spinner.stop() // Stop the spinner for non-code block text
          spinner = null
        }
        process.stdout.write(buffer)
        buffer = '' // Clear the buffer
      }
    }
  }

  // Flush remaining buffer after the stream ends
  if (buffer) {
    if (insideCodeBlock) {
      if (spinner) {
        spinner.stop() // Stop the spinner for leftover code
        spinner = null
      }
      process.stdout.write(chalk.blue(buffer))
    } else {
      process.stdout.write(buffer)
    }
  }

  // Ensure spinner is stopped after stream ends
  if (spinner) {
    spinner.stop()
  }
}
