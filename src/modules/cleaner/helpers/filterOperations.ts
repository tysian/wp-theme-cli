import chalk from 'chalk';
import inquirer from 'inquirer';
import { cloneDeep } from 'lodash-es';
import type { CleanerConfig, Operation } from '../cleaner.config.js';

export const filterOperations = async (_config: CleanerConfig) => {
  const config = cloneDeep(_config);

  const { categories } = await inquirer.prompt([
    {
      type: 'checkbox',
      message: `Select category of files (selected category will be ${chalk.bold.red('REMOVED')}):`,
      name: 'categories',
      choices: [
        {
          name: 'IR stuff',
          value: 'ir',
          short: 'IR',
        },
        {
          name: 'Report stuff',
          value: 'report',
          short: 'Report',
        },
      ],
      validate: (input) => (input.length === 0 ? 'You must choose at least one option' : true),
    },
  ]);

  return Object.entries(config.operations).reduce(
    (acc, [configKey, configValue]) =>
      categories.includes(configKey) ? [...acc, ...configValue] : acc,
    [] as Operation[]
  );
};
