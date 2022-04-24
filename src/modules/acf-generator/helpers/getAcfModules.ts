import chalk from 'chalk';
import path from 'path';
import { fileExists } from '../../../utils/fileExist';
import { logger } from '../../../utils/logger';
import { readStream } from '../../../utils/readStream';
import { config } from '../acf-generator.config';

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
  filePath = config.modulesFilePath,
  fieldName = config.modulesFieldName
): Promise<AcfLayout[]> => {
  // Check if modules field exists
  const modulesFileContent: AcfGroup = await readStream(filePath).then((c) => JSON.parse(c));
  if (
    !modulesFileContent ||
    !modulesFileContent.hasOwnProperty('fields') ||
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
    !modulesField.hasOwnProperty('layouts') ||
    !Object.values(modulesField.layouts)
  ) {
    throw new Error('Modules field have no layouts.');
  }

  return Object.values(modulesField.layouts) as AcfLayout[];
};
