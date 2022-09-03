import chalk from 'chalk';
import { AcfGroup, AcfLayout } from '../../../types.js';
import { logger } from '../../../utils/logger.js';
import { readStream } from '../../../utils/readStream.js';

export const getAcfModules = async (filePath: string, fieldName: string): Promise<AcfLayout[]> => {
  // Check if modules field exists
  const modulesFileContent: AcfGroup = await readStream(filePath).then((c) => JSON.parse(c));
  if (
    !modulesFileContent ||
    !Object.prototype.hasOwnProperty.call(modulesFileContent, 'fields') ||
    !Array.isArray(modulesFileContent.fields) ||
    modulesFileContent.fields.length === 0
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

  if (
    !modulesField?.layouts ||
    !Object.prototype.hasOwnProperty.call(modulesField, 'layouts') ||
    !Object.values(modulesField.layouts)
  ) {
    throw new Error('Modules field have no layouts.');
  }

  return Object.values(modulesField.layouts) as AcfLayout[];
};
