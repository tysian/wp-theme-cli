import inquirer from 'inquirer';
import { simpleGit, SimpleGit } from 'simple-git';
import { updateLogger } from './logger.js';

const git: SimpleGit = simpleGit();

export const gitCheck = async (): Promise<boolean> => {
  updateLogger.start('Looking for git repository...');
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    updateLogger.warn('No repo found.');
    updateLogger.done();
    return true;
  }

  updateLogger.start('Checking git status...');
  const status = await git.status();
  if (status.isClean()) {
    updateLogger.skip('Nothing to commit, continuing...');
    updateLogger.done();
    return true;
  }

  updateLogger.info('You got uncommited changes.');
  const { shouldCommit } = await inquirer.prompt<{
    shouldCommit: 'commit' | 'continue' | 'abort';
  }>([
    {
      type: 'list',
      message: 'Do you want to commit?',
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
        { type: 'separator' },
        {
          name: 'Abort',
          value: 'abort',
        },
      ],
    },
  ]);

  if (shouldCommit === 'commit') {
    const { commitMessage } = await inquirer.prompt<{ commitMessage: string }>([
      {
        type: 'input',
        name: 'commitMessage',
        message: 'Provide commit message.',
        default: 'Changes made before running script',
        validate: (input) => input.trim().length > 0,
      },
    ]);

    updateLogger.done();
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
