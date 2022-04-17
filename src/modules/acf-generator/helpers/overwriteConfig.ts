import inquirer from 'inquirer';
import commentJSON from 'comment-json';
import { AcfGeneratorConfig, config, configDescriptions } from '../acf-generator.config';

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

export const overwriteConfig = async (): Promise<boolean> => {
  const { shouldOverwrite } = await inquirer.prompt([
    {
      type: 'confirm',
      message: 'Do you want to overwrite this config?',
      name: 'shouldOverwrite',
      default: false,
    },
  ]);

  if (!shouldOverwrite) {
    return true;
  }

  const { overwrittenConfig: overwrittenConfigRaw } = await inquirer.prompt([
    {
      type: 'editor',
      name: 'overwrittenConfig',
      message: `Update config in the IDE of your choice.`,
      default: configWithDescriptions(config, configDescriptions),
      validate: async (answer) => {
        return !!commentJSON.parse(answer, undefined, true);
      },
      postfix: 'json',
    },
  ]);
  const overwrittenConfig = commentJSON.parse(overwrittenConfigRaw, undefined, true);
  console.log(overwrittenConfig);

  return true;
};
