import chalk from 'chalk';
import inquirer from 'inquirer';
import { set } from 'lodash-es';
import {
  AcfGeneratorConfig,
  config,
  configDescriptions,
  FileTypeKey,
} from '../acf-generator.config.js';
import { fileExists } from '../../../utils/fileExist.js';
import { logger, updateLogger } from '../../../utils/logger.js';
import { writeStream } from '../../../utils/writeStream.js';
import { ACF_GENERATOR_DEFAULT_CONFIG_PATH } from '../../../constants.js';

export const overwriteConfig = async (configObject = config, descriptions = configDescriptions) => {
  let newConfig = { ...configObject };

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

  // Ask user if they want to save this config
  const { wannaSave } = await inquirer.prompt([
    {
      type: 'confirm',
      message: 'Do you want to save this config?',
      name: 'wannaSave',
      default: false,
    },
  ]);

  if (wannaSave) {
    logger.info('New config will be saved in current working directory.');
    const handleFileName = (filename: string) => {
      const cleanFilename = filename.trim().toLowerCase();
      return cleanFilename.endsWith('.json') ? cleanFilename : `${cleanFilename}.json`;
    };

    const { configFileName } = await inquirer.prompt([
      {
        type: 'input',
        message: 'Pass the config file name',
        name: 'configFileName',
        default: ACF_GENERATOR_DEFAULT_CONFIG_PATH.split('/').reverse()[0],
        validate: async (input: string) => {
          const exists = await fileExists(`./${handleFileName(input)}`)
            .then(() => 'File already exists')
            .catch(() => true);
          console.log('exists', exists);
          return exists;
        },
      },
    ]);

    updateLogger.start(`Creating ${chalk.green(handleFileName(configFileName))}`);
    await writeStream(handleFileName(configFileName), JSON.stringify(newConfig, null, 2));
    updateLogger.success(
      `Config ${chalk.green(handleFileName(configFileName))} saved successfully.`
    );
    updateLogger.done();
  }

  return newConfig;
};
