import chalk from 'chalk';
import inquirer from 'inquirer';
import { cloneDeep } from 'lodash-es';
import { logger } from '../../../utils/logger.js';
import type { CleanerConfig, Operation } from '../cleaner.config.js';

export const filterOperations = async (_config: CleanerConfig) => {
  const config = cloneDeep(_config);
  const choices = config.groups
    .map((group) => (group.key !== 'common' ? { name: group.name, value: group.key } : false))
    .filter(Boolean);

  const commonIndex = config.groups.findIndex((group) => group.key === 'common');
  if (commonIndex > -1) {
    logger.info(`${chalk.green('Common')} operation will be added automatically.`);
  }

  const { categories } = await inquirer.prompt([
    {
      type: 'checkbox',
      message: `Select operations group (checked groups will be ${chalk.bold.red('REMOVED')}):`,
      name: 'categories',
      choices,
      validate: (input) => !!input.length || 'You must choose at least one option',
    },
  ]);

  if (commonIndex > -1) {
    categories.unshift('common');
  }

  return config.groups
    .filter((group) => categories.includes(group.key))
    .reduce(
      (operations, group) => [
        ...operations,
        ...group.operations.map((op) => ({ ...op, groupKey: group.key })),
      ],
      [] as Operation[]
    );
};
