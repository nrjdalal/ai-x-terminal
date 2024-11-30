import * as Chalks from 'chalk'

const Chalk = Chalks.default

// Extend Chalk while preserving its prototype chain
const chalk = Object.assign(Object.create(Chalk), {
  warn: Chalk.hex('#f97316'),
})

export default chalk
