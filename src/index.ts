import 'trace';
import 'clarify';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { acfGenerator } from './modules/acf-gen';
// import { log } from './utils/logger';

async function bootstrap() {
  yargs(hideBin(process.argv))
    .showHelpOnFail(true)
    .command('gen', 'Generate acf modules files', {}, acfGenerator)
    .command({
      command: '*',
      handler() {
        yargs.showHelp();
      },
    })
    .demandCommand();

  yargs.parse();
}

export default bootstrap;
