import inquirer from 'inquirer';
import git from 'simple-git';
import { logger } from './logger';

export const gitCheck = async (): Promise<boolean> => {
  const isRepo = await git().checkIsRepo();
  if (!isRepo) {
    logger.warn('No repo found.');
    return true;
  }

  const status = await git().status();
  if (status.isClean()) {
    logger.skip('Nothing to commit, continuing...');
    return true;
  }

  const { shouldCommit } = await inquirer.prompt([
    {
      type: 'list',
      message: 'You got uncommited changes, what should we do?',
      name: 'shouldCommit',
      default: 'commit',
      choices: [
        {
          name: 'Commit my changes now',
          short: 'Commit',
          value: 'commit',
        },
        {
          name: 'Ignore my changes & continue without commiting',
          short: 'Ignore & continue',
          value: 'continue',
        },
        {
          name: 'Abort',
          value: 'abort',
        },
      ],
    },
  ]);

  if (shouldCommit === 'commit') {
    const { commitMessage } = await inquirer.prompt([
      {
        type: 'input',
        name: 'commitMessage',
        message: 'Provide commit message.',
        default: () => 'Changes before generating ACF modules files',
        validate: (input) => input.trim().length > 0,
      },
    ]);

    try {
      logger.start('Commiting');
      await git().add('.');
      await git().commit(commitMessage);
      logger.complete('Changes commited successfully!');
      return true;
    } catch (error) {
      logger.error((error as Error)?.message ?? 'Failed to finish this operation.');
      return false;
    }
  } else if (shouldCommit === 'continue') {
    logger.skip('Continuing without commiting.');
    return true;
  } else if (shouldCommit === 'abort') {
    logger.error('Abort!');
    return false;
  }

  return shouldCommit;
};
