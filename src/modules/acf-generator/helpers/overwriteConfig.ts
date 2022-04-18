import inquirer from 'inquirer';
import commentJSON from 'comment-json';
import { AcfGeneratorConfig, config, configDescriptions } from '../acf-generator.config';
import chalk from 'chalk';
import { logger } from '../../../utils/logger';
import { fileExists } from '../../../utils/fileExist';
import { relativeToAbsolutePath } from '../../../utils/relativeToAbsolutePath';

const configWithDescriptions = (
  configObject: AcfGeneratorConfig,
  descriptions: Record<string, string>
): string => {
  let stringifiedConfig = JSON.stringify(configObject, null, 2);

  Object.keys(configObject).forEach((key) => {
    const formattedDescription = descriptions[key]
      .split('\n')
      .map((line) => `  // ${line.trim()}`)
      .join('\n');

    stringifiedConfig = stringifiedConfig.replace(
      `"${key}":`,
      `\n${formattedDescription}\n  "${key}":`
    );
  });

  return stringifiedConfig;
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

  const { overwrittenConfig } = await inquirer.prompt([
    {
      type: 'editor',
      name: 'overwrittenConfig',
      message: `Update config in the IDE of your choice.`,
      default: configWithDescriptions(config, configDescriptions),
      validate: async (answer) => {
        return !!commentJSON.parse(answer, undefined, true);
      },
      postfix: '.jsonc',
    },
  ]);

  return commentJSON.parse(overwrittenConfig, undefined, true) as AcfGeneratorConfig;
};

