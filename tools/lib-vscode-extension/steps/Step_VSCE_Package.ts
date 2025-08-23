import { Async_BunPlatform_File_Move } from '../../../src/lib/ericchase/BunPlatform_File_Move.js';
import { Async_BunPlatform_File_Write_Text } from '../../../src/lib/ericchase/BunPlatform_File_Write_Text.js';
import { Async_BunPlatform_Glob_Scan_Generator } from '../../../src/lib/ericchase/BunPlatform_Glob_Scan_Generator.js';
import { NODE_PATH } from '../../../src/lib/ericchase/NodePlatform.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { Step_Bun_Run } from '../../core/step/Step_Bun_Run.js';

export function Step_VSCE_Package(config: Config): Builder.Step {
  return new Class(config);
}
class Class implements Builder.Step {
  StepName = Step_VSCE_Package.name;
  channel = Logger(this.StepName).newChannel();

  constructor(readonly config: Config) {}
  async onRun(): Promise<void> {
    // write empty `.vscodeignore` file, as we don't need it
    await Async_BunPlatform_File_Write_Text(NODE_PATH.join(Builder.Dir.Out, '.vscodeignore'), '');
    await Builder.ExecuteStep(Step_Bun_Run({ cmd: ['npm', 'install', '--omit=dev'], cwd: Builder.Dir.Out }));
    await Builder.ExecuteStep(Step_Bun_Run({ cmd: ['bun', 'run', 'vsce', 'package'], cwd: Builder.Dir.Out }));
    for await (const path of Async_BunPlatform_Glob_Scan_Generator(Builder.Dir.Out, '*.vsix')) {
      await Async_BunPlatform_File_Move(NODE_PATH.join(Builder.Dir.Out, path), NODE_PATH.join(this.config.release_dir, path), true);
    }
  }
}
interface Config {
  release_dir: string;
}
