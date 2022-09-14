import chalk from 'chalk';
import filenamify from 'filenamify';
import inquirer from 'inquirer';
import { DEFAULT_CONFIGS_DIR } from '../constants.js';
import { fileExists } from './fileExist.js';
import { loggerMergeMessages } from './logger-utils.js';
import { logger, updateLogger } from './logger.js';
import { writeStream } from './writeStream.js';

const handleFileName = (filename: string) => {
  const cleanFilename = filenamify(filename).trim().toLowerCase();
  if (!cleanFilename) return '';
  return cleanFilename.endsWith('.json') ? cleanFilename : `${cleanFilename}.json`;
};

export const saveConfig = async <Config>(_defaultFullFilename: string, config: Config) => {
  const defaultFullFilename = handleFileName(_defaultFullFilename);
  if (!defaultFullFilename) {
    throw new Error(
      `Can't save config, the file name is empty or corrupted ${loggerMergeMessages([
        _defaultFullFilename,
      ])}`
    );
  }

  const defaultConfigDir = await fileExists(DEFAULT_CONFIGS_DIR)
    .then(() => DEFAULT_CONFIGS_DIR)
    .catch(() => '.');

  // Ask user if they want to save this config
  const { wannaSave } = await inquirer.prompt<{ wannaSave: boolean }>([
    {
      type: 'confirm',
      message: 'Do you want to save this config?',
      name: 'wannaSave',
      default: false,
    },
  ]);

  if (!wannaSave) return;

  logger.info(`New config will be saved in ${chalk.green(`${defaultConfigDir}/`)}`);
  // Ask user only for a config name, which is better than asking for a full filename
  const [defaultConfigName] = defaultFullFilename.split('.');
  const { userConfigName } = await inquirer.prompt<{ userConfigName: string }>([
    {
      type: 'input',
      message: 'Provide the name of your new config',
      name: 'userConfigName',
      default: defaultConfigName,
      validate: async (input: string) => {
        try {
          await fileExists(
            `${defaultConfigDir}/${defaultFullFilename.replace(defaultConfigName, input)}`
          );
          return 'File already exists';
        } catch (e) {
          return true;
        }
      },
    },
  ]);

  const finalFilename = handleFileName(
    defaultFullFilename.replace(defaultConfigName, userConfigName)
  );
  const finalPath = `${defaultConfigDir}/${finalFilename}`;

  updateLogger.start(`Creating ${chalk.green(finalFilename)}`);
  await writeStream(finalPath, JSON.stringify(config, null, 2));
  updateLogger.success(`Config ${chalk.green(finalFilename)} saved successfully.`);
  updateLogger.done();
};
