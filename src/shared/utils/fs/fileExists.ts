import fs from 'node:fs/promises';
import path from 'node:path';

export const fileExists = async (filePath: string) => {
  const resolvedPath = path.resolve(filePath);
  return fs
    .stat(resolvedPath)
    .then(() => true)
    .catch(() => false);
};
