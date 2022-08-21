import chalk from 'chalk';
import inquirer from 'inquirer';
import { cloneDeep } from 'lodash-es';
import { temporaryConfig } from '../cleaner.config.js';
import type { CleanerConfig } from '../cleaner.config.js';

export const selectConfig = async (): Promise<CleanerConfig> => {
  console.log('temporary config');
  return temporaryConfig;
};
