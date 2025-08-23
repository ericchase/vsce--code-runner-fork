### (2025-08-22) 1.0.0

- Upgraded project to build tools v4
- Removed telemetry code (`applicationinsights`)

### (2024-09-25) 0.13.1

- Added `{ recursive: true }` to the mkdir call so that directory paths can be created without worry.
- Updated `@types/node` package to `^14.16.0`, which I believe is the supported Node version for the minimum supported VSCode version.

### (2024-05-26) 0.13.0

- Changed `Temporary File Name` setting to resolve absolute and relative paths, instead of only just a file name. ie:
  - `C:\Users\<user name>\AppData\Roaming\CodeRunner\tempCodeRunnerFile`
  - `./temp/tempCodeRunnerFile`
  - Environment variables (ie. `%APPDATA%`) will not be resolved. Shell expansions (ie. `~`) will not be expanded. Please provide a raw absolute path.
  - Note: you must have permissions to create the path provided; `/tempCodeRunnerFile` will attempt to create a file in the root folder of the drive (ie. `C:/`), which might not be allowed on your file system.
- Removed the quotes from customized parameters (placeholders) like `$dir`, which has been a problem for people for years.

---
