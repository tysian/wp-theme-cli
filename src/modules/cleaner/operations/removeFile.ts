import fs from 'fs/promises';
import path from 'path';
import { fileExists } from '../../../utils/fileExist.js';
import { handleError } from '../../../utils/handleError.js';
import { CleanerStatistics } from '../cleaner.const.js';

export const removeFile = async (file: string, statistics: CleanerStatistics) => {
  try {
    const exists = await fileExists(file).catch(() => false);
    if (!exists) {
      statistics.incrementStat('unchanged');
      return null;
    }

    const fullPath = path.resolve(file);
    await fs.unlink(fullPath);

    statistics.incrementStat('removed');
    return true;
  } catch (error) {
    statistics.incrementStat('error');
    handleError(error as Error);
    return false;
  }
};
