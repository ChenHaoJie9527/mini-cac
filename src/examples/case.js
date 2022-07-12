import Cli from 'cac';
const cli = Cli();

cli
  // 在命令名称中使用括号时，尖括号表示必需的命令参数，而方括号表示可选参数。
  .command('dev [opt]', 'Start dev server')
  // 在选项名称中使用括号时，尖括号表示需要字符串/数字值，而方括号表示该值也可以是true.
  .option('--hello-world <foo>', 'Remove recursively')
  .action(options => {
    console.log('开始actions');
    console.log(options?.helloWorld);
  });

cli.help();

cli.version('1.0.1');

const parse = cli.parse();

console.log(JSON.stringify(parse, null, 2));
