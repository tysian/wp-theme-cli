import type { Statistics, StatisticsCollection } from '$/shared/utils/Statistics.js';
import chalk from 'chalk';
import { DEFAULT_CONFIGS_DIR } from '../../constants.js';

export const DEFAULT_CONFIG_FILENAME = `default.acf-generator-config.json`;
export const DEFAULT_CONFIG_PATH = `${DEFAULT_CONFIGS_DIR}/${DEFAULT_CONFIG_FILENAME}`;

export const acfGeneratorStats = {
  unchanged: {
    value: 0,
    description: `Files unchanged`,
  },
  modified: {
    value: 0,
    description: `Files modified`,
  },
  created: {
    value: 0,
    description: `Files created`,
  },
  error: {
    value: 0,
    description: `Errors`,
    color: chalk.red,
  },
};

export type AcfGeneratorStatistics = Statistics<
  StatisticsCollection<keyof typeof acfGeneratorStats>
>;
