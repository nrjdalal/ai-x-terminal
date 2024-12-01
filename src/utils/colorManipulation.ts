import chalk from 'chalk'
import { highlight } from 'cli-highlight'
import fs from 'fs'

export const manipulateCode = (codeBlock: string, opts: any) => {
  if (!codeBlock.includes(`\`\`\``)) return codeBlock

  try {
    const code = {
      language:
        codeBlock.split(`\`\`\``)[1].split('\n')[0].split(' ')[0] ||
        'plaintext',
      langpath: codeBlock.split(`\`\`\``)[1].split('\n')[0].split(' ')[1] || '',
      content: codeBlock
        .split(`\`\`\``)
        .slice(1, -1)
        .join('')
        .split('\n')
        .slice(1)
        .join('\n'),
    }

    // if langpath starts with path: split it and get the path
    if (code.langpath && code.langpath.startsWith('path:')) {
      code.langpath = code.langpath.split('path:')[1]
    }

    if (!fs.existsSync('.dev')) {
      fs.mkdirSync('.dev')
    }

    fs.writeFileSync('.dev/logs.txt', JSON.stringify(code, null, 2) + '\n')

    const precode =
      (
        codeBlock.slice(0, codeBlock.indexOf(`\`\`\``)) +
        `\`\`\`` +
        code.language +
        ' ' +
        code.langpath
      ).trimEnd() + '\n'
    const lastOccurence = codeBlock.lastIndexOf(`\`\`\``)
    const postcode = `\`\`\`` + codeBlock.slice(lastOccurence + 3)

    if (opts.replace && code.langpath) {
      try {
        fs.writeFileSync(code.langpath, code.content)
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
