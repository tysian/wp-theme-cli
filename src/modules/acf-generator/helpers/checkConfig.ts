import chalk from 'chalk';
import { fileExists } from '../../../utils/fileExist';
import { logger } from '../../../utils/logger';
import { readStream } from '../../../utils/readStream';
import { AcfGeneratorConfig, fileTypeLabel } from '../acf-generator.config';

export const checkConfig = async (config: AcfGeneratorConfig) => {
  try {
    logger.start('Checking config...');

    if (!['ignore', 'overwrite'].includes(config.conflictAction)) {
      throw new Error(
        `conflictAction property accepts: ${chalk.green.bold('ignore')}, ${chalk.green(
          'overwrite'
        )}`
      );
    }
    logger.success('Conflict action - OK');

    for (const [fileType, configOptions] of Object.entries(config.fileTypes).filter(
      ([_, configOption]) => configOption.active
    )) {
      logger.awaiting(`${fileTypeLabel(fileType)} Checking existence of output files...`);
      await fileExists(configOptions.output);
      logger.success(`${fileTypeLabel(fileType)} Output files - OK`);

      logger.awaiting(`${fileTypeLabel(fileType)} Checking existence of template files...`);
      if (configOptions.template !== 'default') {
        await fileExists(configOptions.template);
      }
      logger.success(`${fileTypeLabel(fileType)} Templates - OK`);

      if (configOptions?.import) {
        const { filePath, search } = configOptions.import;

        logger.awaiting(`${fileTypeLabel(fileType)} Checking import file path...`);
        await fileExists(filePath);
        logger.success(`${fileTypeLabel(fileType)} Import file - OK`);

        logger.awaiting(`${fileTypeLabel(fileType)} Checking import file...`);
        await fileExists(filePath);
        const importFileContent = await readStream(filePath);
        if (!importFileContent.includes(search)) {
          throw new Error(
            `${chalk.green(`'${filePath}'`)} file doesn't have ${chalk.green(`'${search}'`)} in it.`
          );
        }
        logger.success(`${fileTypeLabel(fileType)} Import file - OK`);
      }
    }

    logger.complete('Config is correct.');
  } catch (error) {
    throw error;
  }
};
