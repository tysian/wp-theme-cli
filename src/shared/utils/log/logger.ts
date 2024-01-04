import chalk, { ChalkInstance } from 'chalk';
import isUnicodeSupported from 'is-unicode-supported';
import logUpdate from 'log-update';

type LogTypes =
  | 'none'
  | 'success'
  | 'awaiting'
  | 'complete'
  | 'debug'
  | 'deprecated'
  | 'error'
  | 'info'
  | 'pause'
  | 'start'
  | 'stop'
  | 'warn'
  | 'skip'
  | 'pending';

type TypesMap = {
  [type in LogTypes]: {
    symbol: string;
    color: ChalkInstance;
    label: string;
  };
};

const types: TypesMap = {
  none: { symbol: '', label: '', color: chalk.gray },
  awaiting: { symbol: '…', label: 'awaiting', color: chalk.blue },
  complete: { symbol: '☑', label: 'complete', color: chalk.green },
  debug: { symbol: '◯', label: 'debug', color: chalk.magenta },
  deprecated: { symbol: '⚠', label: 'deprecated', color: chalk.yellow },
  error: { symbol: '✖', label: 'error', color: chalk.red },
  info: { symbol: 'ℹ', label: 'info', color: chalk.blue },
  pause: { symbol: '■', label: 'pause', color: chalk.yellow },
  pending: { symbol: '☐', label: 'pending', color: chalk.magenta },
  start: { symbol: '▶', label: 'start', color: chalk.green },
  stop: { symbol: '■', label: 'stop', color: chalk.red },
  success: { symbol: '✔', label: 'success', color: chalk.green },
  skip: { symbol: '≫', label: 'skipping', color: chalk.blue },
  warn: { symbol: '⚠', label: 'warning', color: chalk.yellow },
};

// Return string of formatted message
export const logMessage = (message: string, logType: LogTypes): string => {
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

  let finalLabelString = finalLabel.join(' ');
  if (finalLabelString) {
    finalLabelString = `${color(finalLabelString)} `;
  }
  return `${finalLabelString}${message}`;
};

// Log formatted message
export const log = (message: string, type: LogTypes): void => {
  console.log(logMessage(message, type));
};

type Logger = Record<LogTypes, (message?: any) => void>;

export const logger = Object.keys(types).reduce(
  (acc, type) => ({
    ...acc,
    [type]: (message: any = '') => log(message, type as LogTypes),
  }),
  {} as Logger
);

export const updateLogger = [...Object.keys(types), 'done'].reduce(
  (acc, type) => ({
    ...acc,
    [type]: (message: any = '') => {
      if (type === 'done') {
        return logUpdate.done();
      }
      return logUpdate(logMessage(message, type as LogTypes));
    },
  }),
  {} as Logger & { done: () => void }
);
