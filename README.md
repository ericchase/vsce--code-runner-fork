## Code Runner Fork

### Changes

- Changed `Temporary File Name` setting to resolve absolute and relative paths, instead of only just a file name. ie:
  - `C:\Users\<user name>\AppData\Roaming\CodeRunner\tempCodeRunnerFile`
  - `./temp/tempCodeRunnerFile`
  - Environment variables (ie. `%APPDATA%`) will not be resolved. Shell expansions (ie. `~`) will not be expanded. Please provide a raw absolute or relative path.
- Notes:
  - You must have **permissions** to create the file path provided.
  - `/tempCodeRunnerFile` will attempt to create a file in the root folder of the drive (ie. `C:/`), which might not be allowed on your file system.

![Absolute Temporary File Path](example.png)

- Removed the quotes from customized parameters (placeholders) like `$dir`, which has been a problem for people for years.
