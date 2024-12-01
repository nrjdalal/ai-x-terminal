import chalk from 'chalk'
import { highlight } from 'cli-highlight'
import fs from 'fs'

export const manipulateCode = (codeBlock: string, opts: any) => {
  if (!codeBlock.includes(`\`\`\``)) return codeBlock

  try {
    const code = {
      language:
        codeBlock.split('```')[1].split('\n')[0].split(' ')[0] || 'plaintext',
      langpath:
        codeBlock.split('```')[1].split('\n')[0].split(' ')[1] || '__temp__',
      content: codeBlock
        .split('```')
        .slice(1, -1)
        .join('```')
        .split('\n')
        .slice(1)
        .join('\n'),
    }

    const precode = codeBlock.slice(0, codeBlock.indexOf('```')) + '```'
    const lastOccurence = codeBlock.lastIndexOf('```')
    const postcode = `\`\`\`` + codeBlock.slice(lastOccurence + 3)

    if (opts.replace) {
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
