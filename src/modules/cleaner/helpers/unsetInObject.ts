import { cloneDeep, unset } from 'lodash-es';
import { asArray } from '../../../utils/asArray.js';

export const unsetInObject = (object: object, _properties: string | string[]) => {
  const clonedJSON = cloneDeep(object);
  const properties = asArray(_properties);

  properties.forEach((property) => {
    unset(clonedJSON, property);
  });

  return clonedJSON;
};
