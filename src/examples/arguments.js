import Cli from "cac";
const cli = Cli();

cli
  // 命令的最后一个参数可以是可变参数，并且只能是最后一个参数。要使参数可变参数，您必须添加...到参数名称的开头，就像 JavaScript 中的 rest 运算符一样
  .command("build <entry> [...reset]", "Build your App")
  .option("-foo", "Foo options")
  .action((entry, reset, options) => {
    console.log("entry", entry); // 执行命令的入口文件
    console.log("reset", reset); // 可变参数
    console.log("options", options); // 命令选项
  });
cli.help();
cli.parse();
