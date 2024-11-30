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

  let chunker = ''
  let codeblock = 0
  let holdMode = false
  let slidingWindow = []
  let turnOffHoldMode = false

  for await (const part of stream) {
    if (part.choices && part.choices[0]?.delta?.content) {
      const chunk = part.choices[0].delta.content

      if (turnOffHoldMode) {
        holdMode = false
        turnOffHoldMode = false
      }

      if (holdMode || chunk.includes('`')) {
        holdMode = true
        chunker += chunk
        slidingWindow.push(chunk)

        if (slidingWindow.length === 3) {
          process.stdout.write(chalk.green(chunker))
          turnOffHoldMode = true
          chunker = ''

          if (slidingWindow.join('').includes('```')) {
            if (codeblock === 1) {
              codeblock--
            }
            codeblock++
          }

          slidingWindow = []
        }
      }

      if (codeblock === 1) {
        process.stdout.write(chalk.warn(chunk))
      }

      if (!holdMode) {
        process.stdout.write(chunk)
      }
    }
  }
}
