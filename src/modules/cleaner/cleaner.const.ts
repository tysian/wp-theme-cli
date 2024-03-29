import chalk from 'chalk';
import { DEFAULT_CONFIGS_DIR } from '$/constants.js';
import { Statistics, StatisticsCollection } from '$/shared/utils/Statistics.js';

export const DEFAULT_CONFIG_FILENAME = `default.cleaner-config.json`;
export const DEFAULT_CONFIG_PATH = `${DEFAULT_CONFIGS_DIR}/${DEFAULT_CONFIG_FILENAME}`;

export enum OperationType {
  REMOVE_FILE = 'REMOVE_FILE',
  REMOVE_FILE_LINE = 'REMOVE_FILE_LINE',
  REMOVE_DIRECTORY = 'REMOVE_DIRECTORY',
  REMOVE_FROM_JSON = 'REMOVE_FROM_JSON',
  REMOVE_ACF_LAYOUT = 'REMOVE_ACF_LAYOUT',
}

export const cleanerStats = {
  unchanged: {
    value: 0,
    description: `Files unchanged`,
  },
  removed: {
    value: 0,
    description: `Files removed`,
  },
  modified: {
    value: 0,
    description: `Files modified`,
  },
  error: {
    value: 0,
    description: `Errors`,
    color: chalk.red,
  },
};

export type CleanerStatistics = Statistics<StatisticsCollection<keyof typeof cleanerStats>>;
