import chalk, { Chalk } from 'chalk';
import isUnicodeSupported from 'is-unicode-supported';

type LogTypes =
  | 'none'
  | 'success'
  | 'awaiting'
  | 'complete'
  | 'debug'
  | 'error'
  | 'info'
  | 'pause'
  | 'start'
  | 'stop'
  | 'warning'
  | 'skip'
  | 'pending';

type TypesMap = {
  [type in LogTypes]: {
    symbol: string;
    color: Chalk;
    label: string;
  };
};

const types: TypesMap = {
  none: { symbol: '', label: '', color: chalk.gray },
  awaiting: { symbol: '…', label: 'awaiting', color: chalk.blue },
  complete: { symbol: '☑', label: 'complete', color: chalk.green },
  debug: { symbol: '◯', label: 'debug', color: chalk.magenta },
  error: { symbol: '✖', label: 'error', color: chalk.red },
  info: { symbol: 'ℹ', label: 'info', color: chalk.blue },
  pause: { symbol: '■', label: 'pause', color: chalk.yellow },
  pending: { symbol: '☐', label: 'pending', color: chalk.magenta },
  start: { symbol: '▶', label: 'start', color: chalk.green },
  stop: { symbol: '■', label: 'stop', color: chalk.red },
  success: { symbol: '✔', label: 'success', color: chalk.green },
  skip: { symbol: '≫', label: 'skipping', color: chalk.blue },
  warning: { symbol: '⚠', label: 'warning', color: chalk.yellow },
};

// Return string of formatted message
const logMessage = (message: string, logType: LogTypes): string => {
  const finalLabel = [];
  const desiredType = types[logType] ?? null;
  if (!desiredType) {
    throw new Error('Wrong log type provided');
  }

  const { symbol, label, color } = desiredType;
  if (isUnicodeSupported() && symbol) {
    finalLabel.push(symbol);
  }

  if (label) {
    finalLabel.push(label);
  }

  return `${color(finalLabel.join(' '))} ${message}`.trim();
};

// Log formatted message
export const log = (message: string, type: LogTypes) => {
  console.log(logMessage(message, type));
};

type Logger = Record<LogTypes, typeof logMessage>;

export const logger = Object.keys(types).reduce(
  (acc, type) => ({
    ...acc,
    [type]: (message: string) => log(message, type as LogTypes),
  }),
  {} as Logger
);

