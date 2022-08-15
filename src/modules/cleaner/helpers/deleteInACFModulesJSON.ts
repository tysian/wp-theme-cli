import { cloneDeep } from 'lodash-es';
import type { AcfGroup } from '../../../types.js';
import { deleteInJSON } from './deleteInJSON.js';

export const deleteInACFModulesJSON = (acfModulesGroup: AcfGroup, acfModulesToRemove: string[]) => {
  const outputObject = cloneDeep(acfModulesGroup);
  const acfModulesIndex = outputObject.fields.findIndex(({ name = '' }) => name === 'modules');
  const acfModule = acfModulesIndex > -1 ? outputObject.fields[acfModulesIndex] : null;

  if (!acfModule || acfModule?.type !== 'flexible_content' || !acfModule?.layouts) {
    throw new Error('No flexible_content module field.');
  }

  const removeKeys = Object.values(acfModule.layouts).filter(({ name = '' }) =>
    acfModulesToRemove.includes(name)
  );

  const removePaths = removeKeys.map(({ key }) => `fields[${acfModulesIndex}].layouts[${key}]`);
  return deleteInJSON(outputObject, removePaths);
};
