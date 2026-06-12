import { basename, dirname, extname } from 'path';

export const resolveModulesFilePath = (
  modulesFilePath: string
): {
  modulesDirectory: string;
  modulesGroupKey: string;
} => ({
  modulesDirectory: dirname(modulesFilePath),
  modulesGroupKey: basename(modulesFilePath, extname(modulesFilePath)),
});
