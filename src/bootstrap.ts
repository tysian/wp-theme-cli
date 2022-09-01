import 'trace';
import 'clarify';
import chalk from 'chalk';
import { Command } from 'commander';
import inquirer from 'inquirer';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import semver from 'semver';
import { PackageJson } from 'type-fest';
import { acfGenerator } from './modules/acf-generator/acf-generator.js';
import { logger } from './utils/logger.js';
import { getObjectFromJSON } from './utils/getObjectFromJSON.js';
import { loggerListElements } from './utils/logger-utils.js';

export const bootstrap = async () => {
  const pkg = await getObjectFromJSON<PackageJson>('../package.json');
  const { bin = '', description = '', version = '', engines: pkgEngines = {} } = pkg;

  const currentVersion = process.versions.node;
  const engines = pkgEngines?.node ?? '';
  const isSupported = semver.satisfies(currentVersion, engines);

  if (!isSupported) {
    console.error(`Your Node.js version (v${currentVersion}) is not supported.`);
    console.error(`Please use Node.js v${engines} or higher.`);
    process.exit(1);
  }

  inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);
  const program = new Command();
  program.name(Object.keys(bin)[0]).description(description).version(version);

  program
    .command('generate')
    .alias('g')
    .description('Generate files')
    .argument('<type>', `what to generate, accepting: ${loggerListElements(['modules'])}`)
    .action((type) => {
      if (type === 'modules') acfGenerator();
      else {
        logger.none(`Wrong type, accepting only: ${loggerListElements(['modules'])}`);
      }
    });

  program.parse();
};
