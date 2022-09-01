import path from 'path';
import { PackageJson } from 'type-fest';
import { ROOT_DIR } from '../constants.js';
import { getObjectFromJSON } from './getObjectFromJSON.js';

export const getPackageJSON = async (): Promise<PackageJson> => {
  const packageJSONPath = path.resolve(`${ROOT_DIR}/../package.json`);

  return getObjectFromJSON<PackageJson>(packageJSONPath);
};
