import chalk from 'chalk';
import { readStream, logger } from '$/shared/utils/index.js';
import { AcfGroup, AcfLayout } from '$/types.js';
import { AcfGeneratorConfig } from '../acf-generator.config.js';

export const getAcfModules = async (
  filePath: AcfGeneratorConfig['modulesFilePath'],
  fieldName: AcfGeneratorConfig['modulesFieldName']
): Promise<AcfLayout[]> => {
  // Check if modules field exists
  const modulesFileContent: AcfGroup = await readStream(filePath).then((c) => JSON.parse(c));
  if (
    !modulesFileContent?.fields ||
    !Array.isArray(modulesFileContent.fields) ||
    !modulesFileContent.fields.length
  ) {
    logger.debug(modulesFileContent);
    throw new Error(
      `This JSON file doesn't have ${chalk.italic('fields')} property or it's empty.`
    );
  }

  const modulesField = modulesFileContent.fields.find((field) => field.name === fieldName);
  if (!modulesField) {
    throw new Error(`There is no ${fieldName} field.`);
  }

  if (!modulesField?.layouts || !Object.values(modulesField.layouts).length) {
    throw new Error('Modules field have no layouts.');
  }

  return Object.values(modulesField.layouts);
};
