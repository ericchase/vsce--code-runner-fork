import { BunPlatform_Argv_Includes } from '../src/lib/ericchase/BunPlatform_Argv_Includes.js';
import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Builder } from './core/Builder.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { Processor_TypeScript_Generic_Bundler } from './core/processor/Processor_TypeScript_Generic_Bundler.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Processor_JavaScript_Rollup } from './lib-vscode-extension/processors/Processor_JavaScript_Rollup.js';
import { Step_Flatten_OriginalRepo_OutDir } from './lib-vscode-extension/steps/Step_Flatten_OriginalRepo_OutDir.js';
import { Step_VSCE_Package } from './lib-vscode-extension/steps/Step_VSCE_Package.js';

// If needed, add `cache` directory to the logger's file writer.
// await AddLoggerOutputDirectory('cache');

if (BunPlatform_Argv_Includes('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
Builder.SetVerbosity(Builder.VERBOSITY._1_LOG);

Builder.SetStartUpSteps(
  Step_Dev_Project_Update_Config({ project_path: '.' }),
  // Update packages manually
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_FS_Clean_Directory(Builder.Dir.Out),
  //
);

const external = [
  'vscode',
  'applicationinsights',
  'micromatch',
  'node:fs',
  'node:module',
  'node:os',
  'node:path',
  'tree-kill',
  //
];

Builder.SetProcessorModules(
  // Bundle the IIFE scripts and module scripts.
  Processor_TypeScript_Generic_Bundler({ target: 'node' }, { bundler_mode: 'iife' }),
  Processor_TypeScript_Generic_Bundler({ external, target: 'node' }, { bundler_mode: 'module' }),
  Processor_JavaScript_Rollup({ external }),
  // Write non-bundle and non-library files.
  Processor_Set_Writable({
    include_patterns: [
      // src
      'package.json',
      'CHANGELOG.md',
      'README.md',
      'example.png',
      // src/original-repo
      'original-repo/*.md',
      'original-repo/images/**',
      'original-repo/syntaxes/**',
      'original-repo/LICENSE',
      'original-repo/package.json',
      //
    ],
    value: true,
  }),
  //
);

Builder.SetCleanUpSteps(
  // Flatten the out folder for original repo.
  Step_Flatten_OriginalRepo_OutDir({ original_subdir: 'original-repo', merge_list: ['package.json', 'CHANGELOG.md', 'README.md'] }),
  Step_Dev_Format({ showlogs: false }),
  Step_VSCE_Package({ entrypoint: 'extension.module.ts', release_dirpath: 'release' }),
  //
);

await Builder.Start();
