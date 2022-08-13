import { OPERATION_TYPE } from './cleaner.const';
import { deleteInACFModulesJSON } from './helpers/deleteInACFModulesJSON.js';
import { deleteInJSON } from './helpers/deleteInJSON.js';

export const configs = {
  ir: [
    // remove dist
    {
      operationType: OPERATION_TYPE.REMOVE_DIRECTORY,
      file: ['dist'],
    },
    // ACF
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: [
        'includes/acf-json/group_5a82d35e01c17.json',
        'includes/acf-json/group_5a82f8c844b69.json',
        'includes/acf-json/group_5a8343daeac1d.json',
        'includes/acf-json/group_5a8374445b2be.json',
      ],
    },
    // remove IR modules from modules field
    {
      operationType: OPERATION_TYPE.MODIFY_JSON,
      file: 'includes/acf-json/group_5d380bc6e0ae8.json',
      options: {
        callback: (content) => deleteInACFModulesJSON(content, ['quarterly-data-table']),
      },
    },

    // Modules
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: ['modules/quarterly-data-table.php'],
    },

    // Templates
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: [
        'templates/template-calendar.php',
        'templates/template-gathering.php',
        'templates/template-reports.php',
      ],
    },

    // gulpfile
    {
      operationType: OPERATION_TYPE.REMOVE_FILE_LINE,
      file: 'gulpfile.js',
      options: {
        search: [
          '/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css',
          '/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js',
          '/moment/min/moment.min.js',
        ],
      },
    },

    // scss
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: [
        'src/scss/pages/_calendars.scss',
        'src/scss/pages/_reports.scss',
        'src/scss/modules/_quarterly-data-table.scss',
      ],
    },
    {
      operationType: OPERATION_TYPE.REMOVE_FILE_LINE,
      file: 'src/scss/main.scss',
      options: {
        search: ['modules/quarterly-data-table', 'pages/reports', 'pages/calendars'],
      },
    },

    // js
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: ['src/js/filters.js', 'src/js/ics.js', 'src/js/ir.js'],
    },

    // images
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: ['src/images/outlook.svg'],
    },

    // cpt
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: ['includes/functions/custom-post-types/cpt-raporty_biezace.php'],
    },
    {
      operationType: OPERATION_TYPE.REMOVE_FILE_LINE,
      file: 'includes/functions/custom-post-types.php',
      options: {
        search: 'custom-post-types/cpt-raporty_biezace.php',
      },
    },

    // package.json
    {
      operationType: OPERATION_TYPE.MODIFY_JSON,
      file: 'package.json',
      options: {
        callback: (content) => {
          let output = content;
          output = deleteInJSON(['dependencies', 'bootstrap-datepicker'], output);
          output = deleteInJSON(['dependencies', 'moment'], output);
          return output;
        },
      },
    },

    // remove files
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: ['yarn.lock'],
    },
  ],
  report: [
    // remove dist
    {
      operationType: OPERATION_TYPE.REMOVE_DIRECTORY,
      file: ['dist'],
    },
    // ACF
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: 'includes/acf-json/group_60794bf92f64a.json',
    },
    // remove report modules from modules field
    {
      operationType: OPERATION_TYPE.MODIFY_JSON,
      file: 'includes/acf-json/group_5d380bc6e0ae8.json',
      options: {
        callback: (content) => deleteInACFModulesJSON(content, ['gri_text']),
      },
    },

    // remove directories
    {
      operationType: OPERATION_TYPE.REMOVE_DIRECTORY,
      file: ['includes/dictionary', 'includes/gri-admin'],
    },
    {
      operationType: OPERATION_TYPE.REMOVE_FILE_LINE,
      file: 'functions.php',
      options: {
        search: ['includes/gri-admin/gri-admin', 'includes/dictionary/dictionary-admin'],
      },
    },

    // cpt
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: [
        'includes/functions/custom-post-types/cpt-gri_indicator.php',
        'includes/functions/custom-post-types/cpt-noty_objasniajace.php',
        'includes/functions/custom-post-types/tax-dictionary.php',
      ],
    },
    {
      operationType: OPERATION_TYPE.REMOVE_FILE_LINE,
      file: 'includes/functions/custom-post-types.php',
      options: {
        search: [
          'custom-post-types/cpt-gri_indicator',
          'custom-post-types/cpt-noty_objasniajace',
          'custom-post-types/tax-dictionary',
        ],
      },
    },

    // modules
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: ['modules/gri_text.php'],
    },

    // partials
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: ['partials/gri_indexes.php', 'partials/notes-tool.php', 'partials/search-modal.php'],
    },

    // scss
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: [
        'src/scss/modules/_gri.scss',
        'src/scss/modules/_notes.scss',
        'src/scss/partials/_tools-reports.scss',
        'src/scss/partials/_tools-a11y.scss',
        'src/scss/pages/sections/_sidebar.scss',
      ],
    },
    {
      operationType: OPERATION_TYPE.REMOVE_FILE_LINE,
      file: 'src/scss/main.scss',
      options: {
        search: [
          'modules/gri',
          'modules/notes',
          'partials/tools-reports',
          'partials/tools-a11y',
          'pages/sections/sidebar',
        ],
      },
    },

    // js
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: ['src/js/tools-reports.js', 'src/js/tools-a11y.js'],
    },

    // templates
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: [
        'templates/template-notes.php',
        'templates/template-noty_objasniajace.php',
        'templates/template-print-basket.php',
        'templates/template-gritable.php',
      ],
    },

    // remove files
    {
      operationType: OPERATION_TYPE.REMOVE_FILE,
      file: ['sidebar.php', 'single-noty_objasniajace.php', 'yarn.lock'],
    },

    // remove in all files
    {
      operationType: OPERATION_TYPE.REMOVE_FILE_LINE,
      file: '**/*.php',
      options: {
        search: [
          'get_sidebar()',
          'partials/notes-tool',
          'partials/gri_indexes',
          'partials/search-modal',
        ],
        glob: true,
      },
    },
  ],
};
