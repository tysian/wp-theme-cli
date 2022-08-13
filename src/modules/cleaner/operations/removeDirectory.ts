import fs from 'fs/promises';
import { OPERATION_TYPE } from '../cleaner.const.js';
import { AppResult } from '../helpers/AppResult.js';

export const removeDirectory = async (file, options = {}) => {
  const { disableLogging = [] } = options;
  const result = new AppResult(OPERATION_TYPE.REMOVE_DIRECTORY, disableLogging);

  try {
    await fs.access(file);
    try {
      await fs.rmdir(file, { recursive: true });
      result.success = true;
    } catch (e) {
      result.errorMessage = e.message;
    }
  } catch (e) {
    result.success = null;
  }

  result.log(file);
  return result.success;
};
