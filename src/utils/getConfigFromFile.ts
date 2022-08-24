import { readStream } from './readStream.js';

export const getConfigFromFile = async <Config>(file: string): Promise<Config> => {
  const config = await readStream(file);
  try {
    const parsedConfig: Config = JSON.parse(config);
    return parsedConfig;
  } catch (error) {
    throw new Error(`Invalid JSON file - ${file}`);
  }
};
