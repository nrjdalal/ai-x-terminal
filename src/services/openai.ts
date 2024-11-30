import { OpenAI } from 'openai'
import chalk from '../utils/chalk.js'
import { highlight } from 'cli-highlight'

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

  let chunker: any = ''
  let codeblock = 0
  let inCodeBlock = false
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
        // holdMode = true
        // chunker += chunk
        slidingWindow.push(chunk)

        if (slidingWindow.length === 3) {
          if (slidingWindow.join('').includes('```')) {
            console.log(chalk.yellow(slidingWindow))

            // if (inCodeBlock && codeblock === 1) {
            //   inCodeBlock = false
            //   codeblock = 2
            //   process.stdout.write(chalk.green(chunker))
            //   console.log(chalk.warn('Code block ended.'))
            // }

            // if (!inCodeBlock && codeblock === 0) {
            //   inCodeBlock = true
            //   codeblock = 1
            //   console.log(chalk.warn('Code block started.'))
            // }
          }

          // if (!inCodeBlock && codeblock === 2) {
          //   codeblock = 0
          //   turnOffHoldMode = true
          //   chunker = ''
          // }

          // if (!inCodeBlock && codeblock === 0) {
          //   turnOffHoldMode = true
          //   process.stdout.write(chalk.warn(chunker))
          //   chunker = ''
          // }

          slidingWindow = []
        }
      }

      if (!holdMode) {
        process.stdout.write(chunk)
      }
    }
  }
}

const colorCode = (chunk: string) => {
  const chunkParts = chunk.split('```')

  const code = {
    language: chunkParts[1].split('\n')[0],
    content: chunkParts[1].split('\n').slice(1).join('\n'),
  }
  const precode = chunkParts[0] + '```' + code.language + '\n'
  const postcode = '```' + '\n' + chunkParts[2]

  return (
    precode +
    highlight(code.content, {
      language: code.language,
      ignoreIllegals: true,
    }) +
    postcode
  )
}
