import path from 'path';
import slugify from 'slugify';
import ejs from 'ejs';
import chalk from 'chalk';
import { kebabCase, snakeCase } from 'lodash-es';
import { performance } from 'perf_hooks';
import { root } from '../../../bootstrap';
import { fileExists } from '../../../utils/fileExist';
import { logger, updateLogger } from '../../../utils/logger';
import { AcfGeneratorConfig, FileType, FileTypeKey } from '../acf-generator.config';
import { AcfLayout } from './getAcfModules';
import { writeStream } from '../../../utils/writeStream';
import { readStream } from '../../../utils/readStream';
import { replaceAll } from '../../../utils/replaceAll';

type Module = {
  layout: AcfLayout;
  fileTypes: Record<FileTypeKey, FileType>;
  conflictAction: 'overwrite' | 'ignore';
};

export const getDefaultTemplate = (fileType: FileTypeKey) =>
  path.resolve(`${root}/../public/templates/template.${fileType.toLowerCase()}.ejs`);

const createModule = async ({ layout, fileTypes, conflictAction }: Module): Promise<boolean> => {
  for (const [fileType, options] of Object.entries(fileTypes)) {
    const { active, output, template: customTemplate, import: moduleImport } = options;
    if (!active) {
      return true;
    }

    // Setup template - use default if default, else use custom template from config
    let template = getDefaultTemplate(fileType as FileTypeKey);
    if (customTemplate && customTemplate !== 'default' && customTemplate !== template) {
      template = customTemplate;
    }

    // Prepare data structure to create modules
    const moduleData = {
      name: layout.name,
      variableName: snakeCase(slugify(layout.name)),
      fileName: `${fileType === 'scss' ? '_' : ''}${layout.name}.${fileType}`,
      className: kebabCase(slugify(layout.name)),
      subfields: layout.sub_fields
        .filter((subfield) => subfield?.name)
        .map((subfield) => ({
          name: subfield.name,
          variableName: snakeCase(slugify(subfield.name)),
        })),
    };

    updateLogger.pending(`Creating ${chalk.green(`${moduleData.fileName}`)}...`);

    // Prepare output path
    const outputPath = path.resolve(output, moduleData.fileName);

    // Render template using EJS
    const renderedTemplate = await ejs.renderFile(template, { data: moduleData }, { async: true });

    // Check if output exists and proceed conflictAction if necessary
    const outputExists = await fileExists(outputPath).catch(() => false);
    if (outputExists) {
      if (conflictAction === 'ignore') {
        updateLogger.skip(`${chalk.green(`${moduleData.fileName}`)} already exists.`);
        updateLogger.done();
      }

      if (conflictAction === 'overwrite') {
        updateLogger.warn(
          `File ${moduleData.fileName} already exist - ${chalk.bold.red('OVERWRITING')}`
        );
        updateLogger.done();
      }
    }

    // Create module file
    if (!outputExists || (outputExists && conflictAction === 'overwrite')) {
      await writeStream(outputPath, renderedTemplate);
      updateLogger.success(` ${chalk.green(`${moduleData.fileName}`)} created.`);
      updateLogger.done();
    }

    // Handle imports
    if (moduleImport) {
      updateLogger.pending(`Including imports for ${chalk.green(`${moduleData.fileName}`)}...`);

      const importFileContent = await readStream(moduleImport.filePath);

      // remove starting `_` and ending `.scss`
      let { fileName } = moduleData;
      if (fileName.startsWith('_') && fileName.endsWith('.scss')) {
        fileName = fileName.substring(1).slice(0, -5);
      }

      let textToAppend = moduleImport.append;
      textToAppend = textToAppend
        .replace('{file_name}', fileName)
        .replace('{module_name}', moduleData.name)
        .replace('{module_variable_name}', moduleData.variableName);

      const isImported = replaceAll(`"`, `'`, importFileContent).includes(
        replaceAll(`"`, `'`, textToAppend)
      );

      if (isImported) {
        updateLogger.skip(`${chalk.green(`${moduleData.fileName}`)} already imported.`);
        updateLogger.done();
        return true;
      }

      // Find last index
      const contentArray = importFileContent.split('\n');
      const lastIndex = [...contentArray].reduce(
        (acc, row, idx) =>
          replaceAll(`"`, `'`, row).includes(replaceAll(`"`, `'`, moduleImport.search)) ? idx : acc,
        -1
      );

      if (lastIndex < 0) {
        updateLogger.skip(
          `This should never happen, but didn't found ${chalk.blueBright(moduleImport.search)}.`
        );
        updateLogger.done();
        return true;
      }

      contentArray.splice(lastIndex + 1, 0, textToAppend);
      const contentWithImports = contentArray.join('\n');
      await writeStream(path.resolve(moduleImport.filePath), contentWithImports);
      updateLogger.success(` ${chalk.green(`${moduleData.fileName}`)} successfully imported.`);
      updateLogger.done();
    }
  }

  return true;
};

export const writeModules = async (acfModules: AcfLayout[], config: AcfGeneratorConfig) => {
  logger.none(); // just empty line
  logger.start('Creating files...');
  const timeStart = performance.now();
  const { fileTypes, conflictAction } = config;

  for (const layout of acfModules) {
    await createModule({ layout, fileTypes, conflictAction });
  }
  const timeEnd = performance.now();
  logger.complete(
    `Created files, which took ${chalk.blue(`${(timeEnd - timeStart).toFixed(3)}ms`)}`
  );
};
