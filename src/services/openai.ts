import { OpenAI } from 'openai'
import chalk from '../utils/chalk.js'

export async function streamCompletion(
  openai: OpenAI,
  prompt: string,
  persona: string
) {
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

  let buffer = '' // Holds the ongoing stream
  let insideCodeBlock = false // Tracks if inside a code block

  for await (const part of stream) {
    if (part.choices && part.choices[0]?.delta?.content) {
      const chunk = part.choices[0].delta.content

      buffer += chunk // Append the chunk to the buffer

      while (buffer.includes('```')) {
        const [before, after] = buffer.split('```', 2)

        if (insideCodeBlock) {
          // Closing backticks detected
          process.stdout.write(chalk.blue(`\`\`\`${before}\`\`\``))
          insideCodeBlock = false
        } else {
          // Opening backticks detected
          process.stdout.write(chalk.yellow(before))
          insideCodeBlock = true
        }

        buffer = after // Update the buffer with the remaining data
      }

      // If no backticks detected, print normally if not inside a code block
      if (!insideCodeBlock) {
        process.stdout.write(buffer)
        buffer = '' // Clear the buffer
      }
    }
  }

  // Flush remaining buffer after the stream ends
  if (buffer) {
    process.stdout.write(insideCodeBlock ? chalk.blue(buffer) : buffer)
  }
}
