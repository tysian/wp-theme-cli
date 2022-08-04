import 'clarify';
import 'trace';
import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import path from 'path';
import { fileURLToPath } from 'url';
import { acfGenerator } from './modules/acf-generator/acf-generator.js';
import { logger } from './utils/logger.js';
import { readStream } from './utils/readStream.js';

export const root = path.dirname(fileURLToPath(import.meta.url));

export const bootstrap = async () => {
  inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);
  const { bin, description, version } = await readStream(`${root}/../package.json`).then((str) =>
    JSON.parse(str)
  );

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
