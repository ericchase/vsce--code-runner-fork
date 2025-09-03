import { BunPlatform_Argv_Includes } from '../src/lib/ericchase/BunPlatform_Argv_Includes.js';
import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Builder } from './core/Builder.js';
import { Processor_Merge_Files } from './core/processor/Processor_Merge_Files.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { Processor_TypeScript_Generic_Bundler } from './core/processor/Processor_TypeScript_Generic_Bundler.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Step_FS_Copy_Files } from './core/step/Step_FS_Copy_Files.js';
import { Step_FS_Delete_Directory } from './core/step/Step_FS_Delete_Directory.js';
import { Step_FS_Move_Files } from './core/step/Step_FS_Move_Files.js';
import { Processor_JavaScript_Rollup } from './lib-vscode-extension/processors/Processor_JavaScript_Rollup.js';
import { Step_VSCE_Package } from './lib-vscode-extension/steps/Step_VSCE_Package.js';

// If needed, add `cache` directory to the logger's file writer.
// await AddLoggerOutputDirectory('cache');

if (BunPlatform_Argv_Includes('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
Builder.SetVerbosity(Builder.VERBOSITY._1_LOG);

Builder.SetStartUpSteps(
  Step_Dev_Project_Update_Config({ project_dir: '.' }),
  // Update packages manually
  // Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
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
  Processor_TypeScript_Generic_Bundler({ target: 'node' }, { bundler_mode: 'iife', exclude_patterns: ['lib/server/hot-reload.iife.ts'] }),
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
      `original-repo/images/**`,
      `original-repo/syntaxes/**`,
      `original-repo/LICENSE`,
      `original-repo/BACKERS.md`,
      //
    ],
    value: true,
  }),
  Processor_Merge_Files(
    {
      type: 'json',
      merge_paths: ['original-repo/package.json', 'package.json'],
      out_path: 'package.json',
      modify: (data: any) => {
        // remove the spyware
        delete data.contributes.configuration.properties['code-runner.enableAppInsights'];
        delete data.dependencies.applicationinsights;
        // these are for dev only
        delete data.devDependencies;
        delete data.scripts;
      },
    },
    {
      type: 'text',
      merge_paths: ['CHANGELOG.md', 'original-repo/CHANGELOG.md'],
      out_path: 'CHANGELOG.md',
    },
  ),
  //
);

Builder.SetAfterProcessingSteps(
  Step_FS_Copy_Files({
    include_patterns: ['**'],
    from_dir: `${Builder.Dir.Out}/original-repo`,
    into_dir: Builder.Dir.Out,
    overwrite: true,
  }),
  //
);

Builder.SetCleanUpSteps(
  Step_FS_Move_Files({
    include_patterns: ['**'],
    from_dir: `${Builder.Dir.Out}/original-repo`,
    into_dir: Builder.Dir.Out,
    overwrite: true,
  }),
  Step_FS_Delete_Directory(`${Builder.Dir.Out}/original-repo`),
  Step_Dev_Format({ showlogs: false }),
  Step_VSCE_Package({ release_dir: 'release' }),
  //
);

await Builder.Start();
