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

type Module = {
  layout: AcfLayout;
  fileTypes: Record<FileTypeKey, FileType>;
  conflictAction: 'overwrite' | 'ignore';
};

const getDefaultTemplate = (fileType: FileTypeKey) =>
  path.resolve(`${root}/../public/templates/template.${fileType.toLowerCase()}.ejs`);

const createModule = async ({ layout, fileTypes, conflictAction }: Module): Promise<boolean> => {
  for (const [fileType, options] of Object.entries(fileTypes)) {
    const { active, output, template: customTemplate } = options;
    if (!active) {
      return true;
    }

    let template = getDefaultTemplate(fileType as FileTypeKey);
    if (customTemplate && customTemplate !== 'default' && customTemplate !== template) {
      template = customTemplate;
    }

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
    await fileExists(template);
    const outputPath = path.resolve(output, moduleData.fileName);
    const renderedTemplate = await ejs.renderFile(template, { data: moduleData }, { async: true });
    const outputExists = await fileExists(outputPath).catch(() => false);
    if (outputExists) {
      if (conflictAction === 'ignore') {
        updateLogger.skip(`File ${chalk.green(`${moduleData.fileName}`)} already exist.`);
        updateLogger.done();
        continue;
      }

      if (conflictAction === 'overwrite') {
        updateLogger.warn(
          `File ${moduleData.fileName} already exist - ${chalk.bold.red('OVERWRITING')}`
        );
        updateLogger.done();
      }
    }
    await writeStream(outputPath, renderedTemplate);
    updateLogger.success(` File ${chalk.green(`${moduleData.fileName}`)} has been created.`);
    updateLogger.done();
  }

  return true;
};

export const writeModules = async (acfModules: AcfLayout[], config: AcfGeneratorConfig) => {
  logger.none(); // just empty line
  logger.start('Creating files...');
  const timeStart = performance.now();
  const { fileTypes, conflictAction } = config;

  for (const layout of acfModules) {
    const returnValue = await createModule({ layout, fileTypes, conflictAction });
  }
  const timeEnd = performance.now();
  logger.complete(
    `Created files, which took ${chalk.blue(`${(timeEnd - timeStart).toFixed(3)}ms`)}`
  );

  // create files in loop
  //    if has imports - additionaly add perform an import action
};
