import chalk from 'chalk';
import { fileExists } from '../../../utils/fileExist.js';
import { logger, updateLogger } from '../../../utils/logger.js';
import { readStream } from '../../../utils/readStream.js';
import { replaceAll } from '../../../utils/replaceAll.js';
import { AcfGeneratorConfig, FileTypeKey, fileTypeLabel } from '../acf-generator.config.js';
import { getDefaultTemplate } from './getDefaultTemplate.js';

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
    updateLogger.awaiting(`${fileTypeLabel(fileType)} Checking existence of output files...`);
    await fileExists(configOptions.output);
    updateLogger.success(`${fileTypeLabel(fileType)} Output files - OK`);
    updateLogger.done();

    // Check if template exists
    updateLogger.awaiting(`${fileTypeLabel(fileType)} Checking existence of template files...`);
    const template =
      configOptions.template === 'default'
        ? getDefaultTemplate(fileType as FileTypeKey)
        : configOptions.template;
    await fileExists(template);

    updateLogger.success(`${fileTypeLabel(fileType)} Templates - OK`);
    updateLogger.done();

    if (configOptions?.import) {
      const { filePath, search } = configOptions.import;

      updateLogger.awaiting(`${fileTypeLabel(fileType)} Checking import file path...`);
      await fileExists(filePath);
      updateLogger.success(`${fileTypeLabel(fileType)} Import file - OK`);
      updateLogger.done();

      updateLogger.awaiting(`${fileTypeLabel(fileType)} Checking import search string...`);
      const importFileContent = await readStream(filePath);
      if (!replaceAll(`"`, `'`, importFileContent).includes(replaceAll(`"`, `'`, search))) {
        updateLogger.done();
        throw new Error(
          `${chalk.green(`'${filePath}'`)} file doesn't have ${chalk.green(`${search}`)} in it.`
        );
      }
      updateLogger.success(`${fileTypeLabel(fileType)} Search string - OK`);
      updateLogger.done();
    }
  }

  logger.complete('Config is correct.');
};
