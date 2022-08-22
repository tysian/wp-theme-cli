import chalk from 'chalk';
import { Statistics, StatisticsCollection } from '../../utils/Statistics.js';

export enum OperationType {
  REMOVE_FILE = 'REMOVE_FILE',
  REMOVE_FILE_LINE = 'REMOVE_FILE_LINE',
  MODIFY_JSON = 'MODIFY_JSON',
  REMOVE_DIRECTORY = 'REMOVE_DIRECTORY',
}

export const cleanerStats = {
  unchanged: {
    value: 0,
    description: `Files unchanged`,
  },
  modified: {
    value: 0,
    description: `Files removed`,
  },
  removed: {
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
