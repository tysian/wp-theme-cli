import { set } from 'lodash-es';
import inquirer, { QuestionCollection } from 'inquirer';
import {
  AcfGeneratorConfig,
  config,
  ConfigDescription,
  configDescriptions,
  FileTypeKey,
} from '../acf-generator.config';

const overwrite = async (configObject = config, descriptions = configDescriptions) => {
  let newConfig = { ...configObject };

  for (const [configKey, inquirerQuestion] of Object.entries(descriptions)) {
    if (inquirerQuestion.hasOwnProperty('type')) {
      const answers = await inquirer.prompt({
        ...inquirerQuestion,
        name: configKey,
      });
      newConfig = { ...newConfig, ...answers };
    } else if (configKey === 'fileTypes') {
      const { selectFileTypes } = newConfig as AcfGeneratorConfig & { selectFileTypes: string[] };

      if (Array.isArray(selectFileTypes)) {
        const fileTypeConfig = {};

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
                config.fileTypes?.[fileType as FileTypeKey]?.template ?? 'default'
              );
            }
          });
        }

        newConfig = { ...newConfig, [configKey]: fileTypeConfig };
      }
    }
  }

  return newConfig;
};

export const overwriteConfig = async (): Promise<AcfGeneratorConfig> => {
  const { shouldOverwrite } = await inquirer.prompt([
    {
      type: 'confirm',
      message: 'Do you want to overwrite this config?',
      name: 'shouldOverwrite',
      default: false,
    },
  ]);

  if (!shouldOverwrite) {
    return config;
  }

  const overwrittenConfig = await overwrite(config, configDescriptions);
  console.dir(overwrittenConfig, { depth: null });

  return overwrittenConfig as AcfGeneratorConfig;
};
