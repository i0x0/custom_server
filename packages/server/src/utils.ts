import chalk from "chalk"

export const error = (x: string) => console.log(`${chalk.bold.red("[!]")} ${x}`)

export const ok = (x: string) => console.log(`${chalk.bold.green("[✓]")} ${x}`)

export const info = (x: string) => console.log(`${chalk.bold("[!]")} ${x}`)

export const warning = (x: string) => console.log(`${chalk.bold.yellow("[?]")} ${x}`)

