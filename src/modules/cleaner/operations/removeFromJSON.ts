import { getObjectFromJSON } from '../../../utils/getObjectFromJSON.js';
import { handleError } from '../../../utils/handleError.js';
import {
  loggerMergeMessages,
  loggerPrefix,
  loggerRelativePath,
} from '../../../utils/logger-utils.js';
import { updateLogger } from '../../../utils/logger.js';
import { writeStream } from '../../../utils/writeStream.js';
import { RemoveFromJSONOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';
import { unsetInObject } from '../helpers/unsetInObject.js';

export const removeFromJSON = async (
  file: string,
  { groupKey = '', description = '', propertyPaths }: RemoveFromJSONOperation,
  statistics: CleanerStatistics
): Promise<boolean | null> => {
  const relativePath = loggerRelativePath(file);
  const prefix = groupKey ? loggerPrefix(groupKey) : '';
  const message = description || 'Removed from JSON';

  try {
    updateLogger.start(loggerMergeMessages([prefix, `Removing in JSON`, relativePath]));
    const parsedFileContent: object = await getObjectFromJSON(file);
    const modifiedFileContent = unsetInObject(parsedFileContent, propertyPaths);

    const stringifiedContent = JSON.stringify(parsedFileContent, null, 2);
    const stringifiedModifiedContent = JSON.stringify(modifiedFileContent, null, 2);

    // If something was changed - update file
    if (stringifiedContent.length !== stringifiedModifiedContent.length) {
      await writeStream(file, stringifiedModifiedContent);

      updateLogger.complete(loggerMergeMessages([prefix, message, relativePath]));
      updateLogger.done();
      statistics.incrementStat('modified');
      return true;
    }
  } catch (error) {
    handleError(error as Error, prefix);
    statistics.incrementStat('error');
    return false;
  }

  updateLogger.skip(loggerMergeMessages([prefix, `No changes were made`, relativePath]));
  updateLogger.done();
  statistics.incrementStat('unchanged');
  return null;
};
