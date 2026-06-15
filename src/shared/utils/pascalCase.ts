import { camelCase } from 'lodash-es';

export function pascalCase(raw: string) {
  const val = camelCase(raw);
  return val.charAt(0).toUpperCase() + val.slice(1);
}
