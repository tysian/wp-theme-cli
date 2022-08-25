import { z } from 'zod';
import { OperationType } from './cleaner.const.js';

// Base operation
export const baseOperationSchema = z.object({
  operationType: z.nativeEnum(OperationType),
  groupKey: z.string().optional(),
  description: z.string().optional(),
  input: z.union([z.string(), z.string().array()]),
  exclude: z.union([z.string(), z.string().array()]).optional(),
});
export type BaseOperation = z.infer<typeof baseOperationSchema>;

// Remove directory operation
export const removeDirectoryOperationSchema = baseOperationSchema.and(
  z.object({
    operationType: z.literal(OperationType.REMOVE_DIRECTORY),
  })
);
export type RemoveDirectoryOperation = z.infer<typeof removeDirectoryOperationSchema>;

// Remove file operation
export const removeFileOperationSchema = baseOperationSchema.and(
  z.object({
    operationType: z.literal(OperationType.REMOVE_FILE),
  })
);
export type RemoveFileOperation = z.infer<typeof removeFileOperationSchema>;

export type RemoveFromJSONOperation = BaseOperation & {
  operationType: OperationType.REMOVE_FROM_JSON;
  propertyPaths: string[];
};

export type RemoveACFLayoutOperation = BaseOperation & {
  operationType: OperationType.REMOVE_ACF_LAYOUT;
  layouts: string[];
};

export type RemoveFileLineOperation = BaseOperation & {
  operationType: OperationType.REMOVE_FILE_LINE;
  search: string | string[];
};

export type Operation =
  | RemoveDirectoryOperation
  | RemoveFileOperation
  | RemoveFileLineOperation
  | RemoveFromJSONOperation
  | RemoveACFLayoutOperation;

export type OperationGroup = {
  key: string;
  name: string;
  operations: Operation[];
};

export type CleanerConfig = {
  name?: string;
  description?: string;
  groups: OperationGroup[];
};

export const temporaryConfig: CleanerConfig = {
  name: 'Temporary Config',
  description: 'Description for temporary config',
  groups: [
    {
      key: 'common',
      name: 'Common',
      operations: [
        {
          description: 'Remove dist folder',
          operationType: OperationType.REMOVE_DIRECTORY,
          input: ['dist'],
        },
        {
          description: 'Remove lock file',
          operationType: OperationType.REMOVE_FILE,
          input: ['yarn.lock'],
        },
      ],
    },
    {
      key: 'ir',
      name: 'IR Stuff',
      operations: [
        {
          description: 'Remove ACF modules',
          operationType: OperationType.REMOVE_FILE,
          input: [
            'includes/acf-json/group_5a82d35e01c17.json',
            'includes/acf-json/group_5a82f8c844b69.json',
            'includes/acf-json/group_5a8343daeac1d.json',
            'includes/acf-json/group_5a8374445b2be.json',
          ],
        },
        {
          description: 'Remove modules from ACF JSON modules field',
          operationType: OperationType.REMOVE_ACF_LAYOUT,
          input: 'includes/acf-json/group_5d380bc6e0ae8.json',
          layouts: ['quarterly-data-table'],
        },
        {
          description: 'Remove modules',
          operationType: OperationType.REMOVE_FILE,
          input: ['modules/quarterly-data-table.php'],
        },
        {
          description: 'Remove WP templates',
          operationType: OperationType.REMOVE_FILE,
          input: [
            'templates/template-calendar.php',
            'templates/template-gathering.php',
            'templates/template-reports.php',
          ],
        },
        {
          description: 'Update gulpfile config',
          operationType: OperationType.REMOVE_FILE_LINE,
          input: 'gulpfile.js',
          search: [
            '/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css',
            '/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
            '/moment/min/moment.min.js',
          ],
        },
        {
          description: 'Remove SCSS files',
          operationType: OperationType.REMOVE_FILE,
          input: [
            'src/scss/pages/_calendars.scss',
            'src/scss/pages/_reports.scss',
            'src/scss/modules/_quarterly-data-table.scss',
          ],
        },
        {
          description: 'Update main.scss imports',
          operationType: OperationType.REMOVE_FILE_LINE,
          input: 'src/scss/main.scss',
          search: ['modules/quarterly-data-table', 'pages/reports', 'pages/calendars'],
        },
        {
          description: 'Remove JS files',
          operationType: OperationType.REMOVE_FILE,
          input: ['src/js/filters.js', 'src/js/ics.js', 'src/js/ir.js'],
        },
        {
          description: 'Remove images',
          operationType: OperationType.REMOVE_FILE,
          input: ['src/images/outlook.svg'],
        },
        {
          description: 'Remove Custom Post Type files',
          operationType: OperationType.REMOVE_FILE,
          input: ['includes/functions/custom-post-types/cpt-raporty_biezace.php'],
        },
        {
          description: 'Remove Custom Post Type imports',
          operationType: OperationType.REMOVE_FILE_LINE,
          input: 'includes/functions/custom-post-types.php',
          search: 'custom-post-types/cpt-raporty_biezace.php',
        },
        {
          description: 'Update package.json',
          operationType: OperationType.REMOVE_FROM_JSON,
          input: 'package.json',
          propertyPaths: ['dependencies.bootstrap-datepicker', 'dependencies.moment'],
        },
      ],
    },
    {
      key: 'report',
      name: 'Report stuff',
      operations: [
        {
          description: 'Remove ACF modules',
          operationType: OperationType.REMOVE_FILE,
          input: 'includes/acf-json/group_60794bf92f64a.json',
        },
        {
          description: 'Remove modules from ACF JSON modules field',
          operationType: OperationType.REMOVE_ACF_LAYOUT,
          input: 'includes/acf-json/group_5d380bc6e0ae8.json',
          layouts: ['gri_text'],
        },
        {
          description: 'Remove report related directories',
          operationType: OperationType.REMOVE_DIRECTORY,
          input: ['includes/dictionary', 'includes/gri-admin'],
        },
        {
          description: 'Remove report related imports',
          operationType: OperationType.REMOVE_FILE_LINE,
          input: 'functions.php',
          search: ['includes/gri-admin/gri-admin', 'includes/dictionary/dictionary-admin'],
        },
        {
          description: 'Remove Custom Post Type files',
          operationType: OperationType.REMOVE_FILE,
          input: [
            'includes/functions/custom-post-types/cpt-gri_indicator.php',
            'includes/functions/custom-post-types/cpt-noty_objasniajace.php',
            'includes/functions/custom-post-types/tax-dictionary.php',
          ],
        },
        {
          description: 'Remove Custom Post Type imports',
          operationType: OperationType.REMOVE_FILE_LINE,
          input: 'includes/functions/custom-post-types.php',
          search: [
            'custom-post-types/cpt-gri_indicator',
            'custom-post-types/cpt-noty_objasniajace',
            'custom-post-types/tax-dictionary',
          ],
        },
        {
          description: 'Remove report modules files',
          operationType: OperationType.REMOVE_FILE,
          input: ['modules/gri_text.php'],
        },
        {
          description: 'Remove partials',
          operationType: OperationType.REMOVE_FILE,
          input: [
            'partials/gri_indexes.php',
            'partials/notes-tool.php',
            'partials/search-modal.php',
          ],
        },
        {
          description: 'Remove SCSS files',
          operationType: OperationType.REMOVE_FILE,
          input: [
            'src/scss/modules/_gri.scss',
            'src/scss/modules/_notes.scss',
            'src/scss/partials/_tools-reports.scss',
            'src/scss/partials/_tools-a11y.scss',
            'src/scss/pages/sections/_sidebar.scss',
          ],
        },
        {
          description: 'Update main.scss imports',
          operationType: OperationType.REMOVE_FILE_LINE,
          input: 'src/scss/main.scss',
          search: [
            'modules/gri',
            'modules/notes',
            'partials/tools-reports',
            'partials/tools-a11y',
            'pages/sections/sidebar',
          ],
        },
        {
          description: 'Remove JS files',
          operationType: OperationType.REMOVE_FILE,
          input: ['src/js/tools-reports.js', 'src/js/tools-a11y.js'],
        },
        {
          description: 'Remove WP templates',
          operationType: OperationType.REMOVE_FILE,
          input: [
            'templates/template-notes.php',
            'templates/template-noty_objasniajace.php',
            'templates/template-print-basket.php',
            'templates/template-gritable.php',
          ],
        },
        {
          description: 'Remove additional files',
          operationType: OperationType.REMOVE_FILE,
          input: ['sidebar.php', 'single-noty_objasniajace.php'],
        },
        {
          description: 'Update PHP file ({filename})',
          operationType: OperationType.REMOVE_FILE_LINE,
          input: '**/*.php',
          exclude: ['class-wp-bootstrap-navwalker.php'],
          search: [
            'get_sidebar()',
            'partials/notes-tool',
            'partials/gri_indexes',
            'partials/search-modal',
          ],
        },
      ],
    },
  ],
};
