import inquirer from 'inquirer';
import path from 'path';
import { ACF_GENERATOR_DEFAULT_CONFIG_PATH } from '../../../constants.js';
import { fileExists } from '../../../utils/fileExist.js';
import { logger } from '../../../utils/logger.js';
import { readStream } from '../../../utils/readStream.js';
import {
  AcfGeneratorConfig,
  config,
  configDescriptions,
  printConfig,
} from '../acf-generator.config.js';
import { overwriteConfig } from './overwriteConfig.js';

export const selectConfig = async (): Promise<AcfGeneratorConfig> => {
  const { configType } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Select config type',
      name: 'configType',
      default: 'default',
      choices: [
        {
          name: 'Default config',
          value: 'default',
          short: 'default',
        },
        {
          name: 'Overwrite default config',
          value: 'overwrite',
          short: 'overwrite',
        },
        {
          name: 'External config file',
          value: 'external-config-file',
          short: 'external',
        },
      ],
    },
  ]);

  if (configType === 'default') {
    // Show current config and ask for overwrite
    logger.info('Here is default config of this generator.');
    printConfig();
    const { confirmDefaultConfig } = await inquirer.prompt([
      {
        type: 'confirm',
        message: 'Are you sure you want to use default config?',
        name: 'confirmDefaultConfig',
        default: true,
      },
    ]);

    if (confirmDefaultConfig) {
      return config;
    }

    await selectConfig();
  }

  if (configType === 'overwrite') {
    const overwrittenConfig = await overwriteConfig(config, configDescriptions);

    return overwrittenConfig as AcfGeneratorConfig;
  }

  if (configType === 'external-config-file') {
    // Ask for external config path
    const externalConfigFilePath = await fileExists(ACF_GENERATOR_DEFAULT_CONFIG_PATH).catch(
      () => ''
    );
    const { externalConfigFile } = await inquirer.prompt([
      {
        type: 'file-tree-selection',
        message: 'Select external config file',
        name: 'externalConfigFile',
        default: externalConfigFilePath || null,
        validate: (item: string) => path.extname(item) === '.json' || `You need json extension`,
      },
    ]);

    const externalConfigContent = await readStream(externalConfigFile);
    try {
      const parsedConfig = JSON.parse(externalConfigContent);
      return parsedConfig;
    } catch (e) {
      throw new Error(`Invalid JSON file - ${externalConfigFile}`);
    }
  }

  return config;
};

