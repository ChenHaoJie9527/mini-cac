import Cli from "cac";
const cli = Cli();

cli
  .command("rm <dir>", "remove a dir")
  .option("-r, --recursive", "Remove recursively")
  .action((dir, options) => {
    console.log("remove " + dir + (options.recursive ? " recursively" : ""));
  });

cli.help();

cli.version('1.0.1')

const parse = cli.parse();

console.log(JSON.stringify(parse, null, 2));
