import path from 'path';
import chalk from 'chalk';
import { readStream } from '../fs/readStream.js';

export const getObjectFromJSON = async <JSONObject = object>(file: string): Promise<JSONObject> => {
  if (!file || !file.toString().trim()) {
    throw new Error(`Pass a correct ${chalk.italic('file')} parameter.`);
  }

  const fileExt = path.extname(file);
  if (fileExt !== '.json') {
    throw new Error(`Wrong file extension (${fileExt}). Please provide JSON file.`);
  }

  const config = await readStream(file);
  try {
    const parsedConfig: JSONObject = JSON.parse(config);
    return parsedConfig;
  } catch (error) {
    throw new Error(`Invalid JSON file - ${file}`);
  }
};
