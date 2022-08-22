import inquirer from 'inquirer';
import { simpleGit, SimpleGit } from 'simple-git';
import { logger, updateLogger } from './logger.js';

const git: SimpleGit = simpleGit();

export const gitCheck = async (): Promise<boolean> => {
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    logger.warn('No repo found.');
    return true;
  }

  const status = await git.status();
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
        default: 'Changes made before running script',
        validate: (input) => input.trim().length > 0,
      },
    ]);

    updateLogger.start('Commiting');
    await git.add('.');
    await git.commit(commitMessage);
    updateLogger.complete('Changes commited successfully!');
    updateLogger.done();

    return true;
  }

  if (shouldCommit === 'continue') {
    updateLogger.skip('Continuing without commiting.');
    updateLogger.done();
    return true;
  }

  if (shouldCommit === 'abort') {
    throw new Error('Abort!');
  }

  return true;
};
