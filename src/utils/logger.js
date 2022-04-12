const chalk = require('chalk');

const log = (message, _type = 'info') => {
  const types = {
    success: {
      label: 'Success',
      color: 'green',
    },
    unchanged: {
      label: 'Unchanged',
      color: 'gray',
    },
    error: {
      label: 'Error',
      color: 'red',
    },
    info: {
      label: 'Info',
      color: 'blue',
    },
    warn: {
      label: 'Warning',
      color: 'yellow',
    },
    debug: {
      label: 'DEBUG',
      color: 'magenta',
    },
  };
  const type = types[_type];

  console.log(`${chalk.bold[type.color](`[${type.label}]`)} ${message}`);
};

module.exports = log;
