import chalk from 'chalk';
import { spawn } from 'child_process';
import inquirer from 'inquirer';
import { logger } from './logger.js';

export const installDependencies = async () => {
  const { runInstall } = await inquirer.prompt([
    {
      type: 'confirm',
      message: `Do you want to run ${chalk.yellow('yarn')} command?`,
      name: 'runInstall',
      default: true,
    },
  ]);

  if (runInstall) {
    logger.none();
    logger.info('Installing dependencies...');

    const install = () =>
      new Promise<void>((resolve, reject) => {
        const child = spawn('yarn', ['install'], { stdio: 'inherit' });
        child.on('error', (error) => {
          reject(error);
        });
        child.on('close', (code) => {
          if (code !== 0) {
            reject();
          }
          resolve();
        });
      });

    await install();
    logger.success('Installation finished.');
  }
};
