#!/usr/bin/env node

const pm2 = require("pm2");
const shell = require("shelljs");
const yargs = require("yargs");

const argv = yargs
  .options({
    source: {
      alias: "s",
      describe: "local source directory, file, or blob"
    },
    bucket: {
      alias: "b",
      describe: "S3 bucket (with optional path) that is destination of sync"
    },
    list: {
      describe: "list active syncs"
    },
    logs: {
      alias: "l",
      describe: "show last 15 lines of logs"
    },
    stop: {
      describe: "stop watching all sources"
    }
  })
  .usage("Watch a local file, directory, or glob for changes and sync them to an s3 bucket (or bucket and path). Must have aws CLI installed.")
  .usage("")
  .usage("Usage: $0 -s [string] -b [string]")
  .help("h")
  .alias("h", "help")
  .example("$0 -s '/path/to/file/or/directory' -b 's3-bucket/and/path'")
  .example("$0 --source '/a/glob/*/**' --bucket 's3-bucket'").argv;

console.log(process.cwd());
let pm2Path = `${process.cwd()}/node_modules/.bin/pm2`; //await getInstalledPath("pm2", { local: true });

if (argv.list) {
  shell.exec(`${pm2Path} list`);
  return;
}

if (argv.logs) {
  shell.exec(`${pm2Path} logs --nostream`);
  return;
}

if (argv.stop) {
  shell.exec(`${pm2Path} delete sync-s3`);
  return;
}

if (!argv.bucket && !argv.source) {
  console.log("");
  console.error("Missing required arguments: source, bucket");
  console.log("s3-sync --help");
  return;
}

pm2.start(
  {
    name: "sync-s3",
    script: "sync.js",
    args: [argv.source, argv.bucket]
  },
  function(err) {
    pm2.disconnect(); // Disconnects from PM2

    if (err) throw err;

    process.exit(0);
  }
);
