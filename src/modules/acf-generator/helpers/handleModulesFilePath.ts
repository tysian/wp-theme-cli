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

export const buildModulesFilePath = (modulesDirectory: string, modulesGroupKey: string): string =>
  `${modulesDirectory}/${modulesGroupKey}.json`;
