import { BunPlatform_Args_Has } from '../src/lib/ericchase/BunPlatform_Args_Has.js';
import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Processor_HTML_Custom_Component_Processor } from './core-web/processor/Processor_HTML_Custom_Component_Processor.js';
import { Builder } from './core/Builder.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { PATTERN, Processor_TypeScript_Generic_Bundler } from './core/processor/Processor_TypeScript_Generic_Bundler.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Processor_JavaScript_Rollup } from './lib-vscode-extension/processors/Processor_JavaScript_Rollup.js';
import { Step_NPM_Install_Extension_Dependencies } from './lib-vscode-extension/steps/Step_NPM_Install_Extension_Dependencies.js';
import { Step_VSCE_Package } from './lib-vscode-extension/steps/Step_VSCE_Package.js';

// Use command line arguments to set watch mode.
if (BunPlatform_Args_Has('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
Builder.SetVerbosity(Builder.VERBOSITY._1_LOG);

// These steps are run during the startup phase only.
Builder.SetStartUpSteps(
  Step_Dev_Project_Update_Config({ project_path: './' }),
  // Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }), // "applicationinsights" must remain at "0.19.0"
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  Step_FS_Clean_Directory(Builder.Dir.Out),
  Step_Dev_Format({ showlogs: false }),
  //
);

// The processors are run for every file that added them during every
// processing phase.
Builder.SetProcessorModules(
  // Process the custom html components.
  Processor_HTML_Custom_Component_Processor(),
  // Bundle the modules.
  Processor_TypeScript_Generic_Bundler({ external: ['vscode'], target: 'node' }),
  Processor_JavaScript_Rollup({ external: ['vscode', 'node:module', 'fs', 'os', 'path'] }),
  // Write non-bundle files and non-library files.
  Processor_Set_Writable({ include_patterns: ['**/*'], exclude_patterns: [`**/*${PATTERN.TS_TSX_JS_JSX}`] }),
);

// These steps are run during the shutdown phase only.
Builder.SetCleanUpSteps(
  // This takes a little while, so best to do it once at the end.
  Step_NPM_Install_Extension_Dependencies(),
  Step_VSCE_Package({ release_dir: 'release' }),
  //
);

await Builder.Start();
