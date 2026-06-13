import { buildModulesFilePath } from '$/modules/acf-generator/helpers/handleModulesFilePath.js';
import { fileExists, readStream } from '$/shared/utils/index.js';

export const loadAcfJsonFile = async <T extends object>(
  modulesDirectory: string,
  modulesGroupKey: string
): Promise<T | null> => {
  const filePath = buildModulesFilePath(modulesDirectory, modulesGroupKey);
  if (!(await fileExists(filePath))) return null;

  return readStream(filePath)
    .then((c) => JSON.parse(c) as T)
    .catch(() => null);
};
