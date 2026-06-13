import chalk from 'chalk';
import { AcfGroup, AcfLayout } from '$/types.js';
import { loadAcfJsonFile } from '$/modules/acf-generator/helpers/loadAcfJsonFile.js';
import { getAcfGroupFields } from '$/modules/acf-generator/helpers/getAcfGroupFields.js';
import { AcfGeneratorConfig } from '../acf-generator.config.js';

export const getAcfModules = async (
  modulesDirectory: AcfGeneratorConfig['modulesDirectory'],
  modulesGroupKey: AcfGeneratorConfig['modulesGroupKey'],
  fieldName: AcfGeneratorConfig['modulesFieldName']
): Promise<AcfLayout[]> => {
  const modulesFileContent = await loadAcfJsonFile<AcfGroup>(modulesDirectory, modulesGroupKey);
  const fields = getAcfGroupFields(modulesFileContent);
  if (!fields) {
    throw new Error(
      `This JSON file (${chalk.green(modulesGroupKey)}) doesn't have ${chalk.italic(
        'fields'
      )} property or it's empty.`
    );
  }

  const modulesField = fields.find((field) => field.name === fieldName);
  if (!modulesField) {
    throw new Error(`There is no ${fieldName} field.`);
  }

  if (!modulesField?.layouts || !Object.values(modulesField.layouts).length) {
    throw new Error('Modules field have no layouts.');
  }

  return Object.values(modulesField.layouts);
};
