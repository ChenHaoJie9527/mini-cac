// 点嵌套选项将合并为一个选项
import Cli from "cac";
const cli = Cli();

cli
  .command("build", "desc")
  // option和example合并成一个选项了
  .option("--env <env>", "run dev")
  .example("--env.API xxx")
  .action((options) => {
    console.log("options", options);
  });
cli.help();
cli.parse();
