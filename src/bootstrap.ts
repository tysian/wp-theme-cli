import 'clarify';
import 'trace';
import { Command } from 'commander';
import inquirer from 'inquirer';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import semver from 'semver';
import { bin, description, engines as pkgEngines, version } from '../package.json';
import { acfGenerator } from './modules/acf-generator/acf-generator.js';
import { loggerListElements, logger } from './shared/utils/index.js';

export const bootstrap = async () => {
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
    .alias('c')
    .description('Update and remove files using provided config')
    .argument('[type]', `what to clean, accepting: ${loggerListElements(['theme'])}`, 'theme')
    .option('--allow-outside-cwd', 'Allow cleaning outside of current working directory')
    .action((type, options) => {
      global.programOptions = options;
      switch (type) {
        case 'theme':
          cleaner();
          break;
        default:
          logger.none(`Wrong type, accepting only: ${loggerListElements(['theme'])}`);
          break;
      }
    });

  program.parse();
};
