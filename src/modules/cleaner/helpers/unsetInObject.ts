import { asArray } from '$/shared/utils/asArray.js';
import { cloneDeep, unset } from 'lodash-es';

export const unsetInObject = (object: object, _properties: string | string[]) => {
  const clonedJSON = cloneDeep(object);
  const properties = asArray(_properties);

  for (const property of properties) {
    unset(clonedJSON, property);
  }

  return clonedJSON;
};
