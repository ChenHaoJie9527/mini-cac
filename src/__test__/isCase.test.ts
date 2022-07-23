import { describe, expect, it, } from 'vitest';
import Cli from 'cac';
const cli = Cli();
describe('work cac-case', () => {
  it('should case', () => {
    cli
      .command('dev [opt]', 'Start dev server')
      .option('--hello <foo>', 'remove recursively')
      .action(opt => {
        console.log('开始action');
        console.log(opt);
      });
    cli.help();
    cli.version('1.0.1');
    const parse = cli.parse(['dev', '123', '--hello', 'bar', ], {run: true});
    expect(parse.options.hello).toBe('bar');
    console.log('parse', parse);
  });
});
