import chalk from 'chalk';

type LogTypes = {
  [key: string]: string;
};

const types: LogTypes = {
  info: chalk.blue('info'),
  success: chalk.green('success'),
  warning: chalk.yellow('warning'),
  error: chalk.red('error'),
  debug: chalk.magenta('debug'),
};

export const log = (message: string, _type: keyof typeof types = 'info') => {
  const type = types[_type] ?? 'info';

  console.log(`${type} ${message}`);
};

