import chalk from 'chalk';
import { fileExists } from '../../../utils/fileExist.js';
import { loggerPrefix } from '../../../utils/logger-utils.js';
import { logger, updateLogger } from '../../../utils/logger.js';
import { readStream } from '../../../utils/readStream.js';
import { replaceAll } from '../../../utils/replaceAll.js';
import { AcfGeneratorConfig } from '../acf-generator.config.js';

export const checkConfig = async (config: AcfGeneratorConfig) => {
  logger.start('Checking config...');
  updateLogger.awaiting('Checking if modules JSON file exists...');
  await fileExists(config.modulesFilePath);
  updateLogger.success(`Module JSON file exist - OK`);
  updateLogger.done();

  if (!['ignore', 'overwrite'].includes(config.conflictAction)) {
    throw new Error(
      `conflictAction property accepts: ${chalk.green.bold('ignore')}, ${chalk.green('overwrite')}`
    );
  }
  logger.success('Conflict action - OK');

  for (const [fileType, configOptions] of Object.entries(config.fileTypes).filter(
    ([, configOption]) => configOption.active
  )) {
    updateLogger.awaiting(`${loggerPrefix(fileType)} Checking existence of output files...`);
    await fileExists(configOptions.output);
    updateLogger.success(`${loggerPrefix(fileType)} Output files - OK`);
    updateLogger.done();

    // Check if template exists
    if (configOptions.template !== 'default') {
      updateLogger.awaiting(`${loggerPrefix(fileType)} Checking existence of template files...`);
      await fileExists(configOptions.template);

      updateLogger.success(`${loggerPrefix(fileType)} Templates - OK`);
      updateLogger.done();
    }

    if (configOptions?.import) {
      const { filePath, search } = configOptions.import;

      updateLogger.awaiting(`${loggerPrefix(fileType)} Checking import file path...`);
      await fileExists(filePath);
      updateLogger.success(`${loggerPrefix(fileType)} Import file - OK`);
      updateLogger.done();

      updateLogger.awaiting(`${loggerPrefix(fileType)} Checking import search string...`);
      const importFileContent = await readStream(filePath);
      if (!replaceAll(`"`, `'`, importFileContent).includes(replaceAll(`"`, `'`, search))) {
        throw new Error(
          `File ${chalk.green(`'${filePath}'`)} doesn't have search string (${chalk.green(
            `${search}`
          )}).`
        );
      }
      updateLogger.success(`${loggerPrefix(fileType)} Search string - OK`);
      updateLogger.done();
    }
  }

  logger.complete('Config is correct.');
};
