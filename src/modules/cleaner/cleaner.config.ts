import { OperationType } from './cleaner.const';

type BaseOperation = {
  input: string | string[];
};

type RemoveDirectoryOperation = BaseOperation & {
  operationType: OperationType.REMOVE_DIRECTORY;
};

type RemoveFileOperation = BaseOperation & {
  operationType: OperationType.REMOVE_FILE;
};

type ModifyJSONOperation = BaseOperation & {
  operationType: OperationType.MODIFY_JSON;
  callback: {
    functionName: 'deleteInACFModulesJSON' | 'deleteInJSON';
    args: any[];
  };
};

type RemoveFileLineOperation = BaseOperation & {
  operationType: OperationType.REMOVE_FILE_LINE;
  search: string | string[];
};

type Operation =
  | RemoveDirectoryOperation
  | RemoveFileOperation
  | ModifyJSONOperation
  | RemoveFileLineOperation;

export const configs: Record<string, Operation[]> = {
  ir: [
    // remove dist
    {
      operationType: OperationType.REMOVE_DIRECTORY,
      input: ['dist'],
    },
    // ACF
    {
      operationType: OperationType.REMOVE_FILE,
      input: [
        'includes/acf-json/group_5a82d35e01c17.json',
        'includes/acf-json/group_5a82f8c844b69.json',
        'includes/acf-json/group_5a8343daeac1d.json',
        'includes/acf-json/group_5a8374445b2be.json',
      ],
    },
    // remove IR modules from modules field
    {
      operationType: OperationType.MODIFY_JSON,
      input: 'includes/acf-json/group_5d380bc6e0ae8.json',
      callback: {
        functionName: 'deleteInACFModulesJSON',
        args: ['quarterly-data-table'],
      },
    },

    // Modules
    {
      operationType: OperationType.REMOVE_FILE,
      input: ['modules/quarterly-data-table.php'],
    },

    // Templates
    {
      operationType: OperationType.REMOVE_FILE,
      input: [
        'templates/template-calendar.php',
        'templates/template-gathering.php',
        'templates/template-reports.php',
      ],
    },

    // gulpfile
    {
      operationType: OperationType.REMOVE_FILE_LINE,
      input: 'gulpfile.js',
      search: [
        '/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css',
        '/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
        '/moment/min/moment.min.js',
      ],
    },

    // scss
    {
      operationType: OperationType.REMOVE_FILE,
      input: [
        'src/scss/pages/_calendars.scss',
        'src/scss/pages/_reports.scss',
        'src/scss/modules/_quarterly-data-table.scss',
      ],
    },
    {
      operationType: OperationType.REMOVE_FILE_LINE,
      input: 'src/scss/main.scss',
      search: ['modules/quarterly-data-table', 'pages/reports', 'pages/calendars'],
    },

    // js
    {
      operationType: OperationType.REMOVE_FILE,
      input: ['src/js/filters.js', 'src/js/ics.js', 'src/js/ir.js'],
    },

    // images
    {
      operationType: OperationType.REMOVE_FILE,
      input: ['src/images/outlook.svg'],
    },

    // cpt
    {
      operationType: OperationType.REMOVE_FILE,
      input: ['includes/functions/custom-post-types/cpt-raporty_biezace.php'],
    },
    {
      operationType: OperationType.REMOVE_FILE_LINE,
      input: 'includes/functions/custom-post-types.php',
      search: 'custom-post-types/cpt-raporty_biezace.php',
    },
    // package.json
    {
      operationType: OperationType.MODIFY_JSON,
      input: 'package.json',
      callback: {
        functionName: 'deleteInJSON',
        args: ['dependencies.bootstrap-datepicker', 'dependencies.moment'],
      },
    },

    // remove files
    {
      operationType: OperationType.REMOVE_FILE,
      input: ['yarn.lock'],
    },
  ],
  report: [
    // remove dist
    {
      operationType: OperationType.REMOVE_DIRECTORY,
      input: ['dist'],
    },
    // ACF
    {
      operationType: OperationType.REMOVE_FILE,
      input: 'includes/acf-json/group_60794bf92f64a.json',
    },
    // remove report modules from modules field
    {
      operationType: OperationType.MODIFY_JSON,
      input: 'includes/acf-json/group_5d380bc6e0ae8.json',
      callback: {
        functionName: 'deleteInACFModulesJSON',
        args: ['gri_text'],
      },
    },

    // remove directories
    {
      operationType: OperationType.REMOVE_DIRECTORY,
      input: ['includes/dictionary', 'includes/gri-admin'],
    },
    {
      operationType: OperationType.REMOVE_FILE_LINE,
      input: 'functions.php',
      search: ['includes/gri-admin/gri-admin', 'includes/dictionary/dictionary-admin'],
    },

    // cpt
    {
      operationType: OperationType.REMOVE_FILE,
      input: [
        'includes/functions/custom-post-types/cpt-gri_indicator.php',
        'includes/functions/custom-post-types/cpt-noty_objasniajace.php',
        'includes/functions/custom-post-types/tax-dictionary.php',
      ],
    },
    {
      operationType: OperationType.REMOVE_FILE_LINE,
      input: 'includes/functions/custom-post-types.php',
      search: [
        'custom-post-types/cpt-gri_indicator',
        'custom-post-types/cpt-noty_objasniajace',
        'custom-post-types/tax-dictionary',
      ],
    },

    // modules
    {
      operationType: OperationType.REMOVE_FILE,
      input: ['modules/gri_text.php'],
    },

    // partials
    {
      operationType: OperationType.REMOVE_FILE,
      input: ['partials/gri_indexes.php', 'partials/notes-tool.php', 'partials/search-modal.php'],
    },

    // scss
    {
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

    // js
    {
      operationType: OperationType.REMOVE_FILE,
      input: ['src/js/tools-reports.js', 'src/js/tools-a11y.js'],
    },

    // templates
    {
      operationType: OperationType.REMOVE_FILE,
      input: [
        'templates/template-notes.php',
        'templates/template-noty_objasniajace.php',
        'templates/template-print-basket.php',
        'templates/template-gritable.php',
      ],
    },

    // remove files
    {
      operationType: OperationType.REMOVE_FILE,
      input: ['sidebar.php', 'single-noty_objasniajace.php', 'yarn.lock'],
    },

    // remove in all files
    {
      operationType: OperationType.REMOVE_FILE_LINE,
      input: '**/*.php',
      search: [
        'get_sidebar()',
        'partials/notes-tool',
        'partials/gri_indexes',
        'partials/search-modal',
      ],
    },
  ],
};
