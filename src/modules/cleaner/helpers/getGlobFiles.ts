import fastGlob, { Options } from 'fast-glob';
import path from 'path';
import { asArray } from '../../../utils/asArray.js';

export const getGlobFiles = async (
  glob: string | string[],
  exclude: string | string[] = [],
  globOptions: Options = {}
) => {
  // Make sure the files are array
  let files = asArray(glob);
  const ignore = asArray(exclude);

  // Make them unique, relative & posix-type path
  files = [...new Set(files)].map((p) => path.posix.resolve(`./${p}`));

  files = await fastGlob([...files, '!**/(node_modules|vendor)/**'], {
    ignore,
    dot: true,
    onlyFiles: false,
    absolute: true,
    ...globOptions,
  });

  return files;
};
