import inquirer from 'inquirer';
import chalk from 'chalk';
import { logger } from '../../utils/logger';
import { gitCheck } from '../../utils/gitCheck';
import { printConfig } from './acf-generator.config';

export const acfGenerator = async (): Promise<boolean> => {
  logger.none('ACF Flexible field files generator!');
  const gitCheckStatus = await gitCheck();
  if (!gitCheckStatus) {
    return gitCheckStatus;
  }
  logger.none('Here is default config of this generator.\n');
  printConfig();
  // const { categories } = await inquirer.prompt([
  //   {
  //     type: 'checkbox',
  //     message: `Select category of files (selected category will be ${chalk.bold.red('REMOVED')}):`,
  //     name: 'categories',
  //     choices: [
  //       {
  //         name: 'IR stuff',
  //         value: 'ir',
  //         short: 'IR',
  //       },
  //       {
  //         name: 'Report stuff',
  //         value: 'report',
  //         short: 'Report',
  //       },
  //     ],
  //     validate: (input) => (input.length === 0 ? 'You must choose at least one option' : true),
  //   },
  // ]);
  return true;
};
