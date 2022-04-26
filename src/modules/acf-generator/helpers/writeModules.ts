import path from 'path';
import slugify from 'slugify';
import ejs from 'ejs';
import chalk from 'chalk';
import { kebabCase, snakeCase } from 'lodash-es';
import { performance } from 'perf_hooks';
import { root } from '../../..';
import { fileExists } from '../../../utils/fileExist';
import { logger, updateLogger } from '../../../utils/logger';
import { AcfGeneratorConfig, FileType, FileTypeKey } from '../acf-generator.config';
import { AcfLayout } from './getAcfModules';
import { writeStream } from '../../../utils/writeStream';
import { readStream } from '../../../utils/readStream';

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
    // Render tempalte using EJS
    const renderedTemplate = await ejs.renderFile(template, { data: moduleData }, { async: true });
    // Check if output exists and proceed conflictAction if necessary
    const outputExists = await fileExists(outputPath).catch(() => false);
    if (outputExists) {
      if (conflictAction === 'ignore') {
        updateLogger.skip(`File ${chalk.green(`${moduleData.fileName}`)} already exist.`);
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
      updateLogger.success(` File ${chalk.green(`${moduleData.fileName}`)} has been created.`);
      updateLogger.done();
    }

    // Handle imports
    if (moduleImport) {
      const importFileContent = await readStream(moduleImport.filePath);
      const contentArray = importFileContent.split('\n');
      const lastIndex = contentArray.lastIndexOf(moduleImport.search);
      contentArray.splice(lastIndex, 0, ...['123', '432', '233', '98']);
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

  // create files in loop
  //    if has imports - additionaly add perform an import action
};

