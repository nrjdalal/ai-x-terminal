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
  let holdMode = false
  let slidingWindow = []
  let turnOffHoldMode = false
  let codeblock = 0

  for await (const part of stream) {
    if (part.choices && part.choices[0]?.delta?.content) {
      const chunk = part.choices[0].delta.content

      if (turnOffHoldMode) {
        holdMode = false
        turnOffHoldMode = false
      }

      if (holdMode || chunk.includes('`')) {
        chunker += chunk
        slidingWindow.push(chunk)
        holdMode = true

        if (slidingWindow.length === 3) {
          process.stdout.write(chalk.green(chunker))
          chunker = ''
          turnOffHoldMode = true

          if (slidingWindow.join('').includes('```')) {
            if (codeblock === 1) {
              codeblock--
            }
            codeblock++
          }

          slidingWindow = []
        }
      }

      if (!holdMode) {
        process.stdout.write(chunk)
      }
    }
  }
}
