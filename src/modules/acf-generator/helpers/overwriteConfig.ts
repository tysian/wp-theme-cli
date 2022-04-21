import inquirer from 'inquirer';
import {
  AcfGeneratorConfig,
  config,
  ConfigDescription,
  configDescriptions,
} from '../acf-generator.config';

type OverwriteOptions = { parentKey: string | null; fileType: string | null };

const overwrite = async (
  configObject = config,
  descriptions = configDescriptions,
  options: OverwriteOptions = {
    parentKey: null,
    fileType: null,
  }
) => {
  let newConfig = { ...configObject };
  const { parentKey = null, fileType = null } = options;
  for (const [configKey, inquirerQuestion] of Object.entries(descriptions)) {
    if (inquirerQuestion.hasOwnProperty('type') && parentKey === null) {
      const answers = await inquirer.prompt([{ ...inquirerQuestion, name: configKey }]);
      newConfig = { ...newConfig, ...answers };
    } else {
      if (configKey === 'fileTypes') {
        const subfieldAnswers = overwrite(
          newConfig[configKey as keyof AcfGeneratorConfig] as AcfGeneratorConfig,
          descriptions[configKey as keyof AcfGeneratorConfig] as ConfigDescription,
          { parentKey: configKey, fileType: null }
        );
        newConfig = { ...newConfig, [configKey as keyof AcfGeneratorConfig]: subfieldAnswers };
      } else {
        if (parentKey === 'fileTypes') {
          for (const fileType of Object.keys(config.fileTypes)) {
            const subfieldAnswers = overwrite(
              newConfig[configKey as keyof AcfGeneratorConfig] as AcfGeneratorConfig,
              descriptions[configKey as keyof AcfGeneratorConfig] as ConfigDescription,
              {
                parentKey: fileType,
                fileType,
              }
            );
          }
        }
      }
    }
    return newConfig;
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

  return overwrittenConfig as AcfGeneratorConfig;
};
