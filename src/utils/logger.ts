import chalk, { Color } from 'chalk';

type LogTypes = {
  [key: string]: {
    label: string;
    color: typeof Color;
  };
};

const types: LogTypes = {
  success: {
    label: 'Success',
    color: 'green',
  },
  unchanged: {
    label: 'Unchanged',
    color: 'gray',
  },
  error: {
    label: 'Error',
    color: 'red',
  },
  info: {
    label: 'Info',
    color: 'blue',
  },
  warn: {
    label: 'Warning',
    color: 'yellow',
  },
  debug: {
    label: 'DEBUG',
    color: 'magenta',
  },
};

export const log = (message: string, _type: keyof typeof types = 'info') => {
  const type = types[_type];

  console.log(`${chalk.bold[type.color](`[${type.label}]`)} ${message}`);
};
