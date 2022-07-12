// 使用 CAC 作为简单的参数解析器
import Cli from 'cac';
// 创建一个CLi实例，可选择指定用于帮助和版本消息中显示信息，接受一个name可选参数，未设置时，使用argv[1]
const cli = Cli();

// 设置一个全局选项
cli.option('--type<type>', 'Choose a project type', {
  default: 'node', // 命令行 默认值 即 --type node
  // type: [], // 设置数组时，会将该命令行传递的参数存储到数组中，并且是一个string[]，如果不设置数组，那么就是一个key:value形式的键值对
});

/**
 * fn{cli.parse}
 * 转换函数，会将解析出来的数据转换成
 * {
  args: string[]
  options: {
    [k: string]: any
  }
}
 */
const parsed = cli.parse();

console.log('cli.rawArgs', cli.rawArgs);
console.log('cli.args', cli.args);
console.log('cli.matchedCommand', cli.matchedCommand);

// 命令行传递参数的集合
console.log('parsed', parsed);
console.log(JSON.stringify(parsed, null, 2));
