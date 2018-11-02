#!/usr/bin/env node

const fs = require("fs");
const shell = require("shelljs");
const chokidar = require("chokidar");

const argv = require("yargs")
  .usage("Watch a local file, directory, or glob for changes and sync them to an s3 bucket (or bucket and path). Must have aws CLI installed.")
  .usage("")
  .usage("Usage: $0 -s [string] -b [string]")
  .alias("s", "source")
  .alias("b", "bucket")
  .help("h")
  .alias("h", "help")
  .demandOption(["s", "b"])
  .example("$0 -s '/path/to/file/or/directory' -b 's3-bucket/and/path'")
  .example("$0 --source '/a/glob/*/**' --bucket 's3-bucket'").argv;

if (!fs.existsSync(argv.source)) {
  console.error(`Path '${argv.source}' does not exist`);
  process.exit(1);
}

console.log(`Watching ${argv.source}`);

function sync() {
  try {
    let res = shell.exec(`aws s3 sync ${argv.source} s3://${argv.bucket} --delete`);

    if (res.stdout) {
      console.log(res.stdout);
    }
  } catch (err) {
    console.error(err);
  }
}

let watcher = chokidar.watch(argv.source, { ignored: /(^|[\/\\])\.DS_Store/, ignoreInitial: true });

watcher.on("ready", () => {
  sync();
});

watcher.on("all", (eventType, filename) => {
  sync(eventType, filename);
});

watcher.on("error", err => {
  console.error(err);
  process.exit(1);
});
