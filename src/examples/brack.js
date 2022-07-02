// 默认命令
import Cli from "cac";
const cli = Cli();

cli
  // 使用可变参数作为指令的默认名字
  .command("[...reset]", "Build files")
  // [...reset] 提供一个数组作为选项值
  .option("--miniVue [...reset]", "start mini-vue")
  .action((files, options) => {
    console.log("files", files);
    console.log("options", options);
  });

cli.help();
cli.parse();
