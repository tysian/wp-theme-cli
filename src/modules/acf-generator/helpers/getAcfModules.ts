import chalk from 'chalk';
import { logger } from '../../../utils/logger.js';
import { readStream } from '../../../utils/readStream.js';
import { AcfGeneratorConfig } from '../acf-generator.config.js';

export type AcfLayout = {
  key: string;
  label: string;
  name: string;
  display: string;
  sub_fields: AcfField[];
  [key: string]: any;
};

export type AcfField = {
  key: string;
  label: string;
  name: string;
  type: string;
  layouts?: Record<string, AcfLayout>;
  [key: string]: any;
};

export type AcfGroup = {
  key: string;
  title: string;
  fields: AcfField[];
  [key: string]: any;
};

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
