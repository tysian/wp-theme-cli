import inquirer from 'inquirer';
import { AcfGeneratorConfig, config, configDescriptions } from '../acf-generator.config';

const overwrite = async (
  configObject = config,
  descriptions = configDescriptions,
  parentKey = null
) => {
  const newConfig = { ...configObject };
  for (const [configKey, inquirerQuestion] of Object.entries(descriptions)) {
    if (inquirerQuestion.hasOwnProperty('type')) {
      inquirerQuestion.name = configKey;
      const answers = await inquirer.prompt([inquirerQuestion]);
      console.log(answers);
    }
    // if(typeof inquirerQuestion === 'object' && !inquirerQuestion.hasOwnProperty('type') ) {

    // }
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

