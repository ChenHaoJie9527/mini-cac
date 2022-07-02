import Cli from "cac";
const cli = Cli();

cli
  .command("build [project]", "Build a project")
  // --no-config 可以让config的默认值设置为false
  .option("--no-config", "Disable config file")
  .option('--config', 'Disable config file')
  .action((options) => {
    console.log("options:", options);
  });
cli.help();
cli.version("1.0.1");
const parse = cli.parse();
console.log(JSON.stringify(parse, null, 2));
