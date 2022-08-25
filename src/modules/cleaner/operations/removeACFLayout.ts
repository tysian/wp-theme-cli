import { AcfGroup } from '../../../types.js';
import { loggerRelativePath } from '../../../utils/loggerRelativePath.js';
import { getObjectFromJSON } from '../../../utils/getObjectFromJSON.js';
import { handleError } from '../../../utils/handleError.js';
import { updateLogger } from '../../../utils/logger.js';
import { writeStream } from '../../../utils/writeStream.js';
import { loggerPrefix } from '../../acf-generator/acf-generator.config.js';
import { RemoveACFLayoutOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';
import { unsetInObject } from '../helpers/unsetInObject.js';

export const removeACFLayout = async (
  file: string,
  { groupName = '', description = '', layouts = [] }: RemoveACFLayoutOperation,
  statistics: CleanerStatistics
) => {
  try {
    const prefix = groupName ? loggerPrefix(groupName) : '';
    const message = description || 'Removed ACF Layout';
    const relativePath = loggerRelativePath(file);

    updateLogger.start('Removing ACF Layout');

    const acfModulesGroup: AcfGroup = await getObjectFromJSON(file);

    const acfModulesIndex = acfModulesGroup.fields.findIndex(({ name = '' }) => name === 'modules');
    const acfModule = acfModulesIndex > -1 ? acfModulesGroup.fields[acfModulesIndex] : null;

    if (!acfModule || acfModule?.type !== 'flexible_content' || !acfModule?.layouts) {
      throw new Error('No flexible_content field.');
    }

    const removePaths = Object.values(acfModule.layouts)
      .filter(({ name = '' }) => layouts.includes(name))
      .map(({ key }) => `fields[${acfModulesIndex}].layouts[${key}]`);

    const modifiedAcfGroup = unsetInObject(acfModulesGroup, removePaths);

    const stringifiedContent = JSON.stringify(acfModulesGroup, null, 2);
    const stringifiedModifiedContent = JSON.stringify(modifiedAcfGroup, null, 2);

    // If something was changed - update file
    if (stringifiedContent.length !== stringifiedModifiedContent.length) {
      await writeStream(file, stringifiedModifiedContent);
      statistics.incrementStat('modified');
      return true;
    }
  } catch (error) {
    handleError(error as Error);
    statistics.incrementStat('error');
    return false;
  }

  updateLogger.skip([prefix, message]);
  updateLogger.done();
  statistics.incrementStat('unchanged');
  return null;
};
