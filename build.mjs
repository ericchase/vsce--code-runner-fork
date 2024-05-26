import * as fs from 'node:fs/promises';

// source files
fs.copyFile('./out/src/appInsightsClient.js', './package/appInsightsClient.js');
fs.copyFile('./out/src/codeManager.js', './package/codeManager.js');
fs.copyFile('./out/src/constants.js', './package/constants.js');
fs.copyFile('./out/src/extension.js', './package/extension.js');
fs.copyFile('./out/src/utility.js', './package/utility.js');

// supplementary files
fs.copyFile('LICENSE', './package/LICENSE');
fs.copyFile('BACKERS.md', './package/BACKERS.md');
fs.copyFile('CHANGELOG.md', './package/CHANGELOG.md');
fs.copyFile('README.md', './package/README.md');
