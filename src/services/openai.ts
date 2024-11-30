import chalk from '../utils/chalk.js'
import { OpenAI } from 'openai'

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

  for await (const part of stream) {
    if (part.choices && part.choices[0]?.delta?.content) {
      process.stdout.write(part.choices[0].delta.content)
    }
  }
}
