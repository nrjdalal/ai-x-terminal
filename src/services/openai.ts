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
          if (slidingWindow.join('').includes('```')) {
            if (codeblock === 1) {
              codeblock--

              turnOffHoldMode = true
              // chunker = chunker.split('```')

              // const precode = chunker[0]
              // const code = {
              //   language: chunker[1].split('\n')[0],
              //   content: chunker[1].split('\n').slice(1).join('\n'),
              // }
              // const postcode = chunker[2]

              // process.stdout.write(
              //   precode +
              //     highlight(code.content, {
              //       language: code.language,
              //       ignoreIllegals: true,
              //     }) +
              //     postcode
              // )

              process.stdout.write(chalk.green(chunker))
              chunker = ''
            }
            if (codeblock === 0) codeblock++
          }

          if (codeblock !== 1) {
            turnOffHoldMode = true
            process.stdout.write(chalk.green(chunker))
            chunker = ''
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
