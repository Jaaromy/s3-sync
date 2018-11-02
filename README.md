# s3-sync

## Install

```bash
npm install
s3-sync -s '.' -b 'my-bucket'
```

## Console Help Contents

```bash
s3-sync --help
```

```text
Watch a local file, directory, or glob for changes and sync them to an s3 bucket (or bucket and path). Must have aws CLI installed.

Usage: app.js -s [string] -b [string]

Options:
  --version     Show version number                                    [boolean]
  -h, --help    Show help                                              [boolean]
  -s, --source                                                        [required]
  -b, --bucket                                                        [required]

Examples:
  s3-sync -s '/path/to/file/or/directory' -b 's3-bucket/and/path'
  s3-sync --source '/a/glob/*/**' --bucket 's3-bucket'
```

## Use Built in PM2

```bash
npm run sync -- -s '/path/to/file/or/directory' -b 's3-bucket'
npm run stop
npm run monitor # Monitor the process in PM2's app
npm run status # Quick status
npm run logs # A tail of the most recent logs
```
