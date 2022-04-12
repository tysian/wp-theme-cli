import git from 'simple-git';

export const isRepo = async () => git().checkIsRepo();

export const hasUncommitedChanges = async () => {
  const status = await git().status();
  return [
    status.not_added,
    status.conflicted,
    status.created,
    status.deleted,
    status.modified,
    status.renamed,
    status.staged,
  ].some((s) => s.length);
};
