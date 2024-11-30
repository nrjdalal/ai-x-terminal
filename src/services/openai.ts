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

  let slidingWindow = []

  for await (const part of stream) {
    if (part.choices && part.choices[0]?.delta?.content) {
      const chunk = part.choices[0].delta.content

      let hold = false
      let releaseHold = false

      if (chunk.includes('`')) {
        hold = true
        releaseHold = false
        slidingWindow.push(chunk)

        if (slidingWindow.length && slidingWindow.length <= 3) {
          if (slidingHasCode(slidingWindow)) {
            process.stdout.write(
              chalk.yellow(
                slidingWindow.join('').replace(/`.*`/, `\`\`\``).trim()
              )
            )
            slidingWindow = []
            releaseHold = true
          }

          if (slidingWindow.length === 3) {
            process.stdout.write(chalk.blue(slidingWindow.join('')))
            slidingWindow = []
            releaseHold = true
          }
        }
      }

      if (!hold) {
        process.stdout.write(chunk)
      }

      if (releaseHold) {
        hold = false
        releaseHold = false
      }
    }
  }
}

const slidingHasCode = (window: string[]) => {
  return window.join('').includes(`\`\`\``)
}
