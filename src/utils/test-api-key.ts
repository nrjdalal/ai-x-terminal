import chalk from './chalk.js'

export const testApiKey = async (apiKey: string) => {
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    const res = (await response.json()) as any

    if (response.ok) {
      console.log(
        'API key is valid. Models available:',
        res.data.map((model: any) => model.id)
      )
    } else {
      console.log(chalk.red('\nError:', res.error.message))
      process.exit(1)
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(chalk.red('\nError:', error.message))
    } else {
      console.log(chalk.red('\nError:', String(error)))
    }
    process.exit(1)
  }
}
