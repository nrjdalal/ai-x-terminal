import { program } from 'commander'

export function initializeCLI() {
  program
    .name('ax')
    .option('-f, --file <file>', 'append file content to prompt')
    .option('-w, --workspace', 'append all files in directory to prompt')
    .option('-ls, --list', 'list all filenames in directory')
    .option('-p, --persona <persona>', 'set custom persona')
    .arguments('[args...]')

  return program
}
