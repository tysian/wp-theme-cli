import { cloneDeep, unset } from 'lodash-es';
import { asArray } from '../../../utils/asArray.js';

export const deleteInJSON = (json: object, _properties: string[]) => {
  const clonedJSON = cloneDeep(json);
  const properties = asArray(_properties);

  properties.forEach((property) => {
    unset(clonedJSON, property);
  });

  return clonedJSON;
};
