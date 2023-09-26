import 'clarify';
import 'trace';
import { Command } from 'commander';
// import { Command } from '@commander-js/extra-typings';
import inquirer from 'inquirer';
import inquirerFileTreeSelection from 'inquirer-file-tree-selection-prompt';
import semver from 'semver';
import chalk from 'chalk';
import { bin, description, engines as pkgEngines, version } from '../package.json';
import { acfGenerator } from './modules/acf-generator/acf-generator.js';
import { loggerListElements, logger, loggerMergeMessages } from './shared/utils/index.js';
import { cleaner } from './modules/cleaner/cleaner.js';
import { styleCssGenerator } from './modules/style-css-generator/create-style-css.js';
import { StyleCssGeneratorOptions } from './modules/style-css-generator/create-style-css.config.js';

export const bootstrap = async () => {
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

  inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection);
  const program = new Command();
  program.name(Object.keys(bin)[0]).description(description).version(version);

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
    .description('Generate style.css meta file for WordPress using package.json data.')
    .option(
      '--dont-overwrite',
      `Prevent from overwriting style.css meta if this file already exists`,
      false
    )
    .option('--validate-schema', `Validate schema against WordPress required fields`, false)
    .option('--use-restricted-tags', `Allow WordPress accepted tags when validating schema`, false)
    .addHelpText(
      'after',
      `\nYou can use of one those properties: ${loggerListElements(
        ['wp', 'wordpress', 'wp-theme-cli'],
        { parentheses: false }
      )} in your package.json.\nThen provide bunch of properties accepted by WP.\nUse ${chalk.bold.italic(
        `--validate-schema`
      )} option to validate it.
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
};
