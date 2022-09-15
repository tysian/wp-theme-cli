import { PathLike } from 'fs';
import { lstat } from 'fs/promises';

export const isDirectory = async (path: PathLike) =>
  lstat(path)
    .then((stat) => stat.isDirectory())
    .catch(() => false);
