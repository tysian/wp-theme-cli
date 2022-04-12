import inquirer from 'inquirer';
import chalk from 'chalk';
import { log } from '../utils/logger';

export const acfGenerator = async () => {
  console.log('ACF Flexible field files generator!');
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
};
