import 'trace';
import 'clarify';
import { Command } from 'commander';
import inquirer from 'inquirer';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import semver from 'semver';
import { acfGenerator } from './modules/acf-generator/acf-generator.js';
import { logger } from './utils/logger.js';
import { loggerListElements } from './utils/logger-utils.js';
import { getPackageJSON } from './utils/getPackageJSON.js';
import { cleaner } from './modules/cleaner/cleaner.js';

export const bootstrap = async () => {
  const pkg = await getPackageJSON();
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
      switch (type) {
        case 'modules':
          acfGenerator();
          break;
        default:
          logger.none(`Wrong type, accepting only: ${loggerListElements(['modules'])}`);
          break;
      }
    });

  program
    .command('clean')
    .description('Update and remove files using provided config')
    .option('--allow-outside-cwd', 'Allow cleaning outside of current working directory')
    .action((options) => {
      global.programOptions = options;
      cleaner();
    });

  program.parse();
};
