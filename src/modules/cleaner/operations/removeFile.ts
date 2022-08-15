import fs from 'fs/promises';
import path from 'path';
import { fileExists } from '../../../utils/fileExist.js';

export const removeFile = async (file: string) => {
  try {
    await fileExists(file);
  } catch (e) {
    return null;
  }

  const fullPath = path.resolve(file);
  await fs.unlink(fullPath);
  return true;
};
