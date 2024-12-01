import chalk from 'chalk'
import { highlight } from 'cli-highlight'
import fs from 'fs'

export const manipulateCode = (codeBlock: string, opts: any) => {
  if (!codeBlock.includes(`\`\`\``)) return codeBlock

  try {
    const chunkParts = codeBlock.split(`\`\`\``)

    const code = {
      language: chunkParts[1].split('\n')[0].split(' ')[0],
      langpath: chunkParts[1].split('\n')[0].split(' ')[1] || '_noPathFound_',
      content: chunkParts[1].split('\n').slice(1).join('\n'),
    }

    const precode =
      chunkParts[0] +
      `\`\`\`` +
      code.language +
      ' ' +
      (code.langpath || '_noPathFound_') +
      '\n'

    const lastOccurence = codeBlock.lastIndexOf('```')
    const postcode = `\`\`\`` + codeBlock.slice(lastOccurence + 3)

    if (opts.replace) {
      console.log(chalk.green(`Writing to ${code.langpath}`))
      try {
        fs.writeFileSync(code.langpath, code.content.trim())
      } catch (err) {
        console.error(chalk.red(`Failed to write to ${code.langpath}:`), err)
      }
    }

    return (
      precode +
      highlight(code.content, {
        language: code.language,
        ignoreIllegals: true,
      }) +
      postcode
    )
  } catch (error) {
    console.error(chalk.red('Error processing code block:'), error)
    return codeBlock
  }
}
