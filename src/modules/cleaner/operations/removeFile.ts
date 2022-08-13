import fs from 'fs/promises';
import { fileExists } from '../../../utils/fileExist.js';

export const removeFile = async (file: string) => {
  // Use try..catch here, because if file doesn't exist, we can simply return null and skip operation
  try {
    await fileExists(file);
  } catch (e) {
    return null;
  }

  await fs.unlink(file);
  return true;
};
