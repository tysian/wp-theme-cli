import fs from 'fs/promises';
import path from 'path';

export const fileExists = async (filePath: string) => {
  const resolvedPath = path.resolve(filePath);
  return fs
    .stat(resolvedPath)
    .then(() => true)
    .catch(() => false);
};
