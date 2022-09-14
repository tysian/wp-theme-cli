import chalk from 'chalk';
import { spawn } from 'child_process';
import inquirer from 'inquirer';
import { getUserPackageManager, PackageManager } from './getUserPackageManager.js';
import { logger } from './logger.js';

export const askForInstallDependencies = async (): Promise<PackageManager | false> => {
  const { packageManager } = await inquirer.prompt<{ packageManager: PackageManager | 'Cancel' }>([
    {
      type: 'list',
      message: `Do you want to install dependencies using your favorite package manager?`,
      name: 'packageManager',
      choices: [
        { name: 'npm' },
        { name: 'yarn' },
        { name: 'pnpm' },
        { type: 'separator' },
        { name: 'Cancel' },
      ],
      default: getUserPackageManager(),
    },
  ]);

  return packageManager !== 'Cancel' ? packageManager : false;
};

export const installDependencies = async (packageManager = 'npm') => {
  const { runInstall } = await inquirer.prompt<{ runInstall: boolean }>([
    {
      type: 'confirm',
      message: `Do you want to run ${chalk.yellow(packageManager)} command?`,
      name: 'runInstall',
      default: true,
    },
  ]);

  if (!runInstall) {
    logger.info(
      `You can install your dependencies later using ${chalk.yellow(packageManager)} install.`
    );
    return;
  }

  logger.info('Installing dependencies...');
  await new Promise((resolve, reject) => {
    const child = spawn(packageManager, ['install'], { stdio: 'inherit' });
    child.on('error', (error) => {
      reject(error);
    });
    child.on('close', resolve);
  });

  logger.success('Installation finished.');
};
