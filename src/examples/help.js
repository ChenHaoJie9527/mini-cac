// 显示帮助信息和版本
import Cli from 'cac';
const cli = Cli();

cli.option('--type [type]', 'Choose a project type', {
  default: 'node',
});

cli.option('--name <name>', 'Provide your name');

cli.command('lint [...files]', 'Lint files').action((files, options) => {
  console.log(files, options);
});

// 显示帮助信息 -h --help
cli.help();

// 显示版本号 -v --version
cli.version('1.0.0');

const parsed = cli.parse();

console.log('cli.rawArgs', cli.rawArgs);
console.log('cli.args', cli.args);
console.log('cli.matchedCommand', cli.matchedCommand);

// 命令行传递参数的集合
console.log('parsed', parsed);
console.log(JSON.stringify(parsed, null, 2));
