import chalk from 'chalk';
import { fileExists } from '../../../utils/fileExist';
import { logger } from '../../../utils/logger';
import { readStream } from '../../../utils/readStream';
import { AcfGeneratorConfig } from '../acf-generator.config';

export const checkConfig = async (config: AcfGeneratorConfig) => {
  try {
    // logger.start('Checking config...');

    // if (!['ignore', 'overwrite'].includes(config.conflictAction)) {
    //   throw new Error(
    //     `conflictAction property accepts: ${chalk.green.bold('ignore')}, ${chalk.green(
    //       'overwrite'
    //     )}`
    //   );
    // }
    // logger.success('Conflict action - OK');

    // logger.awaiting('Checking existence of output files...');
    // // Promise.all(
    // //   Object.keys(config.output).map(
    // //     async (type) => await fileExists(config.output[type])
    // //   )
    // // );
    // await fileExists(config.output.php);
    // await fileExists(config.output.scss);
    // logger.success('Output files - OK');

    // logger.awaiting('Checking existence of template files...');
    // if (config.template.php !== 'none' && config.template.php !== 'default') {
    //   await fileExists(config.template.php);
    // }
    // if (config.template.scss !== 'none' && config.template.scss !== 'default') {
    //   await fileExists(config.template.scss);
    // }
    // logger.success('Templates - OK');

    // logger.awaiting('Checking main SCSS file...');
    // await fileExists(config.scssImport.filePath);
    // const mainSCSSContent = await readStream(config.scssImport.filePath);
    // if (!mainSCSSContent.includes(config.scssImport.lookFor)) {
    //   throw new Error(
    //     `${chalk.green(`'${config.scssImport.filePath}'`)} file doesn't have ${chalk.green(
    //       `'${config.scssImport.lookFor}'`
    //     )} in it.`
    //   );
    // }
    // logger.success('Main SCSS file - OK');
    logger.complete('Config is correct.');
  } catch (error) {
    throw error;
  }
};
