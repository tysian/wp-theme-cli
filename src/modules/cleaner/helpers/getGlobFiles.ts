import fastGlob, { Options } from 'fast-glob';
import path from 'path';
import normalize from 'normalize-path';
import { asArray } from '../../../utils/asArray.js';

export const getGlobFiles = async (
  glob: string | string[],
  exclude: string | string[] = [],
  globOptions: Options = {}
) => {
  // Make sure the files are array
  let files = asArray(glob);
  const ignore = asArray(exclude);

  console.log({ files, ignore });

  // Make them unique, relative & posix-type path
  files = [...new Set(files)].map(normalize);

  console.log('after unique, relative, posix', files);

  files = await fastGlob([...files, '!**/(node_modules|vendor)/**'], {
    // ignore,
    // dot: true,
    // onlyFiles: false,
    absolute: true,
    // ...globOptions,
  });

  console.log('after glob', files);
  console.log('--------');

  return files;
};
