import { isEqual } from 'lodash-es';
import {
  loggerMergeMessages,
  loggerListElements,
  getObjectFromJSON,
  writeStream,
} from '$/shared/utils/index.js';
import { AcfGroup } from '$/types.js';
import { asArray } from '$/shared/utils/asArray.js';
import { handleError } from '$/shared/utils/handleError.js';
import { RemoveACFLayoutOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';
import { OperationsLogger } from '../helpers/OperationLogger.js';
import { unsetInObject } from '../helpers/unsetInObject.js';

export const removeACFLayout = async (
  file: string,
  { groupKey = '', description = '', layouts = [] }: RemoveACFLayoutOperation,
  statistics: CleanerStatistics
) => {
  const operationLogger = new OperationsLogger({
    relativePath: file,
    prefix: groupKey,
    message: description || 'Removed ACF Layout',
  });

  const layoutsArray = asArray(layouts);
  try {
    operationLogger.start(
      `${loggerMergeMessages(['Removing ACF Layouts', loggerListElements(layoutsArray)])}`
    );

    const acfModulesGroup: AcfGroup = await getObjectFromJSON(file);

    const acfModulesIndex = acfModulesGroup.fields.findIndex(({ name }) => name === 'modules');
    const acfModule = acfModulesIndex > -1 ? acfModulesGroup.fields[acfModulesIndex] : null;

    if (!acfModule || acfModule?.type !== 'flexible_content' || !acfModule?.layouts) {
      throw new Error('No flexible_content field.');
    }

    const removePaths = Object.values(acfModule.layouts)
      .filter(({ name }) => layoutsArray.includes(name))
      .map(({ key }) => `fields[${acfModulesIndex}].layouts[${key}]`);

    const modifiedAcfModulesGroup = unsetInObject(acfModulesGroup, removePaths);

    if (isEqual(acfModulesGroup, modifiedAcfModulesGroup)) {
      operationLogger.skip();
      statistics.addFile('unchanged', file);
      return;
    }

    // Stringify object and write to file
    const stringifiedModifiedContent = JSON.stringify(modifiedAcfModulesGroup, null, 2);
    await writeStream(file, stringifiedModifiedContent);

    operationLogger.complete();
    statistics.addFile('modified', file);
  } catch (error) {
    statistics.addFile('error', file);
    handleError(error as Error, operationLogger.prefix);
  }
};
