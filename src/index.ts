import 'trace';
import 'clarify';
import inquirer from 'inquirer';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import { acfGenerator } from './modules/acf-generator';
import { Command } from 'commander';
import chalk from 'chalk';
import { logger } from './utils/logger';

async function bootstrap() {
  inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);
  const program = new Command();
  program
    .name('wp-theme-cli')
    .description('Generate, update & remove files in our WordPress theme')
    .version('0.1.0');

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
}

export default bootstrap;
