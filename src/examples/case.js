import Cli from "cac";
const cli = Cli();

cli
  .command("dev", "Start dev server")
  .option("--hello-world", "Remove recursively")
  .action((options) => {
    console.log('开始actions');
    console.log(options.helloWorld)
  });

cli.help();

cli.version('1.0.1')

const parse = cli.parse();

console.log(JSON.stringify(parse, null, 2));
