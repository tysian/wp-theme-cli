import path from 'path';
import chalk from 'chalk';
import ejs from 'ejs';
import filenamify from 'filenamify';
import { snakeCase, kebabCase } from 'lodash-es';
import { stringIncludesIgnoreQuotes } from '$/shared/utils/stringIncludesIgnoreQuotes.js';
import {
  updateLogger,
  fileExists,
  readStream,
  writeStream,
  handleError,
} from '$/shared/utils/index.js';
import { AvailableFileType, FileType } from '../acf-generator.config.js';
import { AcfGeneratorStatistics } from '../acf-generator.const.js';
import { getDefaultTemplate } from './getDefaultTemplate.js';
import { AcfLayout } from './getAcfModules.js';

type Module = {
  layout: AcfLayout;
  fileTypes: Record<AvailableFileType, FileType>;
  conflictAction: 'overwrite' | 'ignore';
};

export const createModule = async (
  { layout, fileTypes, conflictAction }: Module,
  statistics: AcfGeneratorStatistics
): Promise<void> => {
  for await (const [fileType, options] of Object.entries(fileTypes)) {
    try {
      const { active, output, template: customTemplate, import: moduleImport } = options;
      if (!active) {
        return;
      }

      // Prepare data structure to create modules
      const moduleData = {
        name: layout.name,
        variableName: snakeCase(filenamify(layout.name)),
        fileName: `${fileType === 'scss' ? '_' : ''}${layout.name}.${fileType}`,
        className: kebabCase(filenamify(layout.name)),
        subfields: layout.sub_fields
          .filter((subfield) => subfield?.name)
          .map((subfield) => ({
            name: subfield.name,
            variableName: snakeCase(filenamify(subfield.name)),
          })),
      };

      updateLogger.pending(`Creating ${chalk.green(`${moduleData.fileName}`)}...`);

      // Prepare output path
      const outputPath = path.resolve(output, moduleData.fileName);

      // Check if output exists and proceed conflictAction if necessary
      const outputExists = await fileExists(outputPath);
      if (outputExists) {
        switch (conflictAction) {
          case 'ignore':
            updateLogger.skip(`${chalk.green(`${moduleData.fileName}`)} already exists.`);
            statistics.incrementStat('unchanged');
            break;
          case 'overwrite':
            updateLogger.warn(
              `File ${moduleData.fileName} already exist - ${chalk.bold.red('OVERWRITING')}`
            );
            break;
          default:
            break;
        }
        updateLogger.done();
      }

      // Setup template - use default if default, else use custom template from config
      let template = getDefaultTemplate(fileType as AvailableFileType);
      if (customTemplate && customTemplate !== 'default') {
        template = await readStream(customTemplate);
      }

      // Render template using EJS
      const renderedTemplate = await ejs.render(template, { data: moduleData }, { async: true });

      // Create module file
      if (!outputExists || (outputExists && conflictAction === 'overwrite')) {
        await writeStream(outputPath, renderedTemplate);
        statistics.incrementStat('created');
        updateLogger.success(` ${chalk.green(`${moduleData.fileName}`)} created.`);
        updateLogger.done();
      }

      // Handle imports
      if (moduleImport) {
        updateLogger.pending(`Including imports for ${chalk.green(`${moduleData.fileName}`)}...`);

        const importFileContent = await readStream(moduleImport.filePath);

        // For SCSS files - remove starting `_` and ending `.scss`
        let { fileName } = moduleData;
        if (fileName.startsWith('_') && fileName.endsWith('.scss')) {
          fileName = fileName.substring(1).slice(0, -5);
        }

        const textToAppend = moduleImport.append
          .replace('{file_name}', fileName)
          .replace('{module_name}', moduleData.name)
          .replace('{module_variable_name}', moduleData.variableName);

        const isImported = stringIncludesIgnoreQuotes(importFileContent, textToAppend);

        if (isImported) {
          updateLogger.skip(`${chalk.green(`${moduleData.fileName}`)} already imported.`);
          updateLogger.done();
          statistics.incrementStat('unchanged');
          return;
        }

        // Find last index
        const contentArray = importFileContent.split('\n');
        const lastIndex = [...contentArray].reduce(
          (acc, row, idx) => (stringIncludesIgnoreQuotes(row, moduleImport.search) ? idx : acc),
          -1
        );

        if (lastIndex < 0) {
          updateLogger.skip(
            `This should never happen, but didn't found ${chalk.blueBright(moduleImport.search)}.`
          );
          statistics.incrementStat('unchanged');
          updateLogger.done();
          return;
        }

        contentArray.splice(lastIndex + 1, 0, textToAppend);
        const contentWithImports = contentArray.join('\n');
        await writeStream(path.resolve(moduleImport.filePath), contentWithImports);
        updateLogger.success(` ${chalk.green(`${moduleData.fileName}`)} successfully imported.`);
        updateLogger.done();
        statistics.incrementStat('modified');
      }
    } catch (error) {
      statistics.incrementStat('error');
      handleError(error as Error);
    }
  }
};
