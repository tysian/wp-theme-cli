import { cloneDeep, unset } from 'lodash-es';

export const deleteInJSON = (json: object, _properties: string[]) => {
  const clonedJSON = cloneDeep(json);
  const properties = Array.isArray(_properties) ? _properties : [_properties];

  properties.forEach((property) => {
    unset(clonedJSON, property);
  });

  return clonedJSON;
};
