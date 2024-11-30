import { highlight } from 'cli-highlight'

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
