import { cloneDeep, unset } from 'lodash-es';
import { asArray } from '../../../utils/asArray.js';

export const unsetInObject = (obj: object, _properties: string[]) => {
  const clonedJSON = cloneDeep(obj);
  const properties = asArray(_properties);

  properties.forEach((property) => {
    unset(clonedJSON, property);
  });

  return clonedJSON;
};
