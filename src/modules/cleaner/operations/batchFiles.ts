import glob from 'fast-glob';
import path from 'path';
import chalk from 'chalk';
import { log } from '../../../utils/logger.js';
import { OperationType } from '../cleaner.const.js';
import { AppResult } from '../helpers/AppResult.js';
import { modifyJSON } from './modifyJSON.js';
import { removeDirectory } from './removeDirectory.js';
import { removeFile } from './removeFile.js';
import { removeFileLine } from './removeFileLine.js';
import { getGlobFiles } from '../helpers/getGlobFiles.js';
import type { Operation } from '../cleaner.config.js';

export const batchFiles = async ({ input }: Operation) => {
  const files = getGlobFiles(input);

  const file = (Array.isArray(fileRaw) ? fileRaw : [fileRaw]).map((p) => path.posix.join('./', p));

  const { search = '', disableLogging = [], glob: isSearchGlob = false } = options;
  const result = new AppResult(OperationType.BATCH_FILES, disableLogging);

  if (file.length) {
    try {
      const searchGlob = Array.isArray(file) ? file : [file];
      let searchFiles = [];

      if (isSearchGlob) {
        searchFiles = await glob([...searchGlob, '!**/(node_modules|vendor)/**'], {
          ignore: ['class-wp-bootstrap-navwalker.php'],
        });
      } else {
        searchFiles = [...new Set([...searchFiles, ...searchGlob])];
      }

      // const hasMultipleFiles = searchFiles.length > 1;
      const statistics = {
        unchanged: 0,
        removed: 0,
        modified: 0,
        errors: 0,
      };
      // if (hasMultipleFiles) {
      //   const multipleFilesText = (searchGlob.length > 1 ? '\n\t' : '') + searchGlob.join('\n\t');
      //   console.log(
      //     `${chalk.bold.blue('[Info]')}: Processing multiple files in ${multipleFilesText}`
      //   );
      // }
      for await (const singleFile of searchFiles) {
        let handler = null;
        if (operationType === OperationType.REMOVE_FILE_LINE) {
          handler = await removeFileLine(singleFile, search);
          if (handler) statistics.modified += 1;
        } else if (operationType === OperationType.REMOVE_FILE) {
          handler = await removeFile(singleFile);
          if (handler) statistics.removed += 1;
        } else if (operationType === OperationType.MODIFY_JSON) {
          handler = await modifyJSON(singleFile, options);
          if (handler) statistics.modified += 1;
        } else if (operationType === OperationType.REMOVE_DIRECTORY) {
          handler = await removeDirectory(singleFile);
          if (handler) statistics.removed += 1;
        } else {
          log('Wrong operation type.', 'error');
          handler = false;
        }
        if (handler !== null && !handler) statistics.error += 1;
        else if (!handler && !isSearchGlob) statistics.unchanged += 1;
      }

      // const isUnchanged = !Object.values(statistics).filter((stat) => stat > 0).length;
      // if (hasMultipleFiles) {
      //   console.log(
      //     `${chalk.bold.blue('[Info]')}: ${
      //       isUnchanged ? 'Nothing was' : 'All files were'
      //     } processed`
      //   );
      // }

      return statistics;
    } catch (error) {
      result.errorMessage = error.message;
    }
  } else {
    result.errorMessage = `Please provide ${chalk.italic('file')} parameter`;
  }

  if (result.success === false) result.log();
  return null;
};
