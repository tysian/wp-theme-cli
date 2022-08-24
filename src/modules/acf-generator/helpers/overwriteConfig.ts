import chalk from 'chalk';
import inquirer from 'inquirer';
import { cloneDeep, set } from 'lodash-es';
import {
  AcfGeneratorConfig,
  config,
  ConfigDescription,
  configDescriptions,
  FileTypeKey,
} from '../acf-generator.config.js';
import { fileExists } from '../../../utils/fileExist.js';
import { logger, updateLogger } from '../../../utils/logger.js';
import { writeStream } from '../../../utils/writeStream.js';
import { saveConfig } from '../../../utils/saveConfig.js';
import { DEFAULT_CONFIG_FILENAME } from '../acf-generator.const.js';

export const overwriteConfig = async (
  configObject: AcfGeneratorConfig = config,
  descriptions: ConfigDescription = configDescriptions
) => {
  let newConfig = cloneDeep(configObject);

  for (const [configKey, inquirerQuestion] of Object.entries(descriptions)) {
    // Add name to each question
    if ('type' in inquirerQuestion) {
      const answers = await inquirer.prompt({
        ...inquirerQuestion,
        name: configKey,
      });
      newConfig = { ...newConfig, ...answers };
    } else if (configKey === 'fileTypes') {
      // Handle questions for multiple file types
      const { selectFileTypes } = newConfig as AcfGeneratorConfig & { selectFileTypes: string[] };

      if (!Array.isArray(selectFileTypes)) {
        return newConfig;
      }

      const fileTypeConfig = {};

      // Set active for selected items
      Object.keys(config.fileTypes).forEach((fileType) => {
        set(fileTypeConfig, `${fileType}.active`, selectFileTypes.includes(fileType));
      });

      // Overwrite config
      for (const fileType of selectFileTypes) {
        const questions = descriptions[configKey][fileType];
        const answers = await inquirer.prompt(questions);

        Object.entries(answers).forEach(([key, value]) => {
          if (!['haveImports', 'customTemplate'].includes(key)) {
            set(fileTypeConfig, `${fileType}.${key}`, value);
          } else if (key === 'customTemplate' && value === false) {
            set(
              fileTypeConfig,
              `${fileType}.template`,
              config.fileTypes[fileType as FileTypeKey].template
            );
          }
        });
      }

      newConfig = { ...newConfig, [configKey as FileTypeKey]: fileTypeConfig };
    }
  }

  await saveConfig<AcfGeneratorConfig>(DEFAULT_CONFIG_FILENAME, newConfig);

  return newConfig;
};
