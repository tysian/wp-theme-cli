import type { StyleCssGeneratorOptions } from './modules/style-css-generator/create-style-css.config.js';
import chalk from 'chalk';
import { Command } from 'commander';
// import { Command } from '@commander-js/extra-typings';
import inquirer from 'inquirer';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import semver from 'semver';
import pkg from '../package.json' with { type: 'json' };
import { findDeprecatedConfig, loadCliConfig } from './config.js';
import { CLI_NAME } from './constants.js';
import { acfGenerator } from './modules/acf-generator/acf-generator.js';
import { cleaner } from './modules/cleaner/cleaner.js';
import { COMMIT_AFTER_MSG } from './modules/style-css-generator/create-style-css.config.js';
import { styleCssGenerator } from './modules/style-css-generator/create-style-css.js';
import {
  gitCheck,
  handleError,
  logger,
  loggerListElements,
  loggerMergeMessages,
} from './shared/utils/index.js';
import 'clarify';
import 'trace';

export const bootstrap = async () => {
  try {
    const { description, engines: pkgEngines, version } = pkg;
    const currentVersion = process.versions.node;
    const engines = pkgEngines?.node ?? '';
    const isSupported = semver.satisfies(currentVersion, engines);

    if (!isSupported) {
      throw new Error(
        loggerMergeMessages([
          `Your Node.js version (v${currentVersion}) is not supported.`,
          `Please use Node.js v${engines} or higher.`,
        ])
      );
    }
    // Check if old config exist, log deprecation warning
    await findDeprecatedConfig();

    // Check if there are any uncommited changes
    await gitCheck();

    // Load and validate config
    await loadCliConfig();

    inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);

    const program = new Command();
    program.name(CLI_NAME).description(description).version(version);
    program
      .command('generate')
      .alias('g')
      .description('Generate files')
      .argument(
        '<type>',
        `what to generate, accepting: ${loggerListElements(['modules', 'style-css'])}`
      )
      .action((type) => {
        switch (type) {
          case 'modules':
            acfGenerator();
            break;
          default:
            logger.none(
              `Wrong type: ${chalk.red(type)}, accepting only: ${loggerListElements(
                ['modules', 'style-css'],
                { parentheses: false }
              )}`
            );
            break;
        }
      });

    program
      .command('create-style-css')
      .description('Generate style.css meta file for WordPress using package.json data')
      .option(
        '--dont-overwrite',
        `Prevent from overwriting style.css meta if this file already exists`
      )
      .option('--no-interactive', `Disable all interactive features and use defaults.`)
      .option('--commit', 'Commit after generating')
      .option('-m, --message <message>', 'Commit message', COMMIT_AFTER_MSG)
      .option('--validate', `Validate schema against WordPress required fields`)
      .addHelpText(
        'after',
        `\nYou can use of one those properties: ${loggerListElements(
          ['wp', 'wordpress', 'wp-theme-cli'],
          { parentheses: false }
        )} in your package.json.\nThen provide bunch of properties accepted by WP.
        `
      )
      .action((_, ctx) => {
        styleCssGenerator(ctx.opts() as StyleCssGeneratorOptions);
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
  } catch (error) {
    handleError(error);
  }
};
