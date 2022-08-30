import 'trace';
import 'clarify';
import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import { acfGenerator } from './modules/acf-generator/acf-generator.js';
import { logger } from './utils/logger.js';
import { bin, description, version } from '../package.json';

export const bootstrap = async () => {
  inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

  const program = new Command();
  program.name(Object.keys(bin)[0]).description(description).version(version);

  const generateAcceptedTypes = ['modules'].map((s) => chalk.green(s)).join(', ');
  program
    .command('generate')
    .alias('g')
    .description('Generate files')
    .argument('<type>', `what to generate, accepting: ${generateAcceptedTypes}`)
    .action((type) => {
      if (type === 'modules') acfGenerator();
      else {
        logger.none(`Wrong type, accepting only: ${generateAcceptedTypes}`);
      }
    });

  program.parse();
};
