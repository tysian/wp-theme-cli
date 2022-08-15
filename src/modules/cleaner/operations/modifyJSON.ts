import chalk from 'chalk';
import path from 'path';
import { fileExists } from '../../../utils/fileExist.js';
import { readStream } from '../../../utils/readStream.js';
import { writeStream } from '../../../utils/writeStream.js';
import type { ModifyJSONCallback } from '../cleaner.config.js';
import { deleteInACFModulesJSON } from '../helpers/deleteInACFModulesJSON.js';
import { deleteInJSON } from '../helpers/deleteInJSON.js';

export const modifyJSON = async (file: string, { functionName, args }: ModifyJSONCallback) => {
  if (!file.toString().trim()) {
    throw new Error(`Pass a correct ${chalk.italic('file')} parameter.`);
  }

  const fileExt = path.extname(file);
  if (fileExt !== '.json') {
    throw new Error(`Wrong file extension (${fileExt}). Please provide JSON file.`);
  }

  if (!functionName || !Array.isArray(args)) {
    throw new Error(
      `You need to pass correct ${chalk.italic('functionName')} and ${chalk.italic('args')}.`
    );
  }
  const availableCallbacks = {
    deleteInACFModulesJSON,
    deleteInJSON,
  };

  if (!Object.keys(availableCallbacks).includes(functionName)) {
    throw new Error('This function is not available.');
  }

  await fileExists(file);
  const callback = availableCallbacks[functionName];

  const fileContent = await readStream(file);
  const parsedFileContent = JSON.parse(fileContent);
  const modifiedFileContent = JSON.stringify(callback(parsedFileContent, args), null, 2);

  // If something was changed - update file
  if (fileContent.length !== modifiedFileContent.length) {
    await writeStream(file, modifiedFileContent);
    return true;
  }

  return null;
};
