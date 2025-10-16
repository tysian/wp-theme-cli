import type { PathLike } from 'node:fs';
import { lstat } from 'node:fs/promises';

export const isDirectory = async (path: PathLike) =>
  lstat(path)
    .then((stat) => stat.isDirectory())
    .catch(() => false);
