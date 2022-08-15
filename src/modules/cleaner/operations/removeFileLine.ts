import chalk from 'chalk';
import path from 'path';
import { fileExists } from '../../../utils/fileExist.js';
import { readStream } from '../../../utils/readStream.js';
import { writeStream } from '../../../utils/writeStream.js';
import { removeLineInText } from '../helpers/removeLineInText.js';

export const removeFileLine = async (file: string, search: string) => {
  if (!search.length || !file.length) {
    throw new Error(
      `Please provide a ${chalk.green('file')} and ${chalk.green('search')} parameters.`
    );
  }
  const fileExt = path.extname(file);
  await fileExists(file);
  const fileContent = await readStream(file);
  let modifiedFileContent = removeLineInText(fileContent, search);

  // Remove empty <?php ?> from .php file
  if (fileExt === '.php') {
    modifiedFileContent = modifiedFileContent.replace(/\s?<\?php(\s)*\?>\s?/gim, '');
  }

  // If something was changed - update file
  if (fileContent.length !== modifiedFileContent.length) {
    await writeStream(file, modifiedFileContent);
    return true;
  }

  return null;
};
