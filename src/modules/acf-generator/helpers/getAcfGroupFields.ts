import { AcfField, AcfGroup } from '$/types.js';

export const getAcfGroupFields = (group: AcfGroup | null): AcfField[] => {
  if (!group || !group.fields || !Array.isArray(group.fields) || !group.fields.length) {
    return [];
  }

  return group.fields;
};
