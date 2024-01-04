import chalk from 'chalk';
import {
  logger,
  updateLogger,
  fileExists,
  loggerPrefix,
  readStream,
  stringIncludesIgnoreQuotes,
  FileExistenceError,
} from '$/shared/utils/index.js';
import { AcfGeneratorConfig } from '../acf-generator.config.js';

export const checkConfig = async (config: AcfGeneratorConfig) => {
  logger.none();
  logger.start('Checking config...');

  updateLogger.awaiting('Checking if modules JSON file exists...');
  const modulesFilePathExists = await fileExists(config.modulesFilePath);
  if (!modulesFilePathExists) {
    throw new FileExistenceError(config.modulesFilePath);
  }
  updateLogger.success(`Module JSON file exist - OK`);
  updateLogger.done();

  if (!['ignore', 'overwrite'].includes(config.conflictAction)) {
    throw new Error(
      `conflictAction property accepts: ${chalk.green.bold('ignore')}, ${chalk.green('overwrite')}`
    );
  }
  logger.success('Conflict action - OK');

  for await (const [fileType, configOptions] of Object.entries(config.fileTypes).filter(
    ([, configOption]) => configOption.active
  )) {
    updateLogger.awaiting(`${loggerPrefix(fileType)} Checking existence of output files...`);
    const outputExists = await fileExists(configOptions.output);
    if (!outputExists) {
      throw new FileExistenceError(configOptions.output);
    }
    updateLogger.success(`${loggerPrefix(fileType)} Output files - OK`);
    updateLogger.done();

    // Check if template exists
    if (typeof configOptions.template === 'string' && configOptions.template !== 'default') {
      updateLogger.awaiting(`${loggerPrefix(fileType)} Checking existence of template files...`);
      const templateExists = await fileExists(configOptions.template);
      if (!templateExists) {
        throw new FileExistenceError(configOptions.template);
      }

      updateLogger.success(`${loggerPrefix(fileType)} Templates - OK`);
      updateLogger.done();
    }

    if (configOptions?.import) {
      const { filePath = '', search = '' } = configOptions.import;

      updateLogger.awaiting(`${loggerPrefix(fileType)} Checking import file path...`);
      if (!filePath.trim().length) {
        throw new Error(`Property ${chalk.green(`'filePath'`)} cannot be empty.`);
      }
      const filePathExists = await fileExists(filePath);
      if (!filePathExists) {
        throw new FileExistenceError(filePath);
      }
      updateLogger.success(`${loggerPrefix(fileType)} Import file - OK`);
      updateLogger.done();

      updateLogger.awaiting(`${loggerPrefix(fileType)} Checking import search string...`);
      if (!search.trim().length) {
        throw new Error(`Property ${chalk.green(`'search'`)} cannot be empty.`);
      }

      const importFileContent = await readStream(filePath);
      if (!stringIncludesIgnoreQuotes(importFileContent, search)) {
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
