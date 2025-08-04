import { Async_BunPlatform_File_Move } from '../../../src/lib/ericchase/BunPlatform_File_Move.js';
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

  constructor(public config: Config) {}
  async onStartUp(): Promise<void> {}
  async onRun(): Promise<void> {
    await Step_Bun_Run({ cmd: ['bun', 'run', 'vsce', 'package'], dir: Builder.Dir.Out }).onRun?.();
    for await (const path of Async_BunPlatform_Glob_Scan_Generator(Builder.Dir.Out, '*.vsix')) {
      await Async_BunPlatform_File_Move(NODE_PATH.join(Builder.Dir.Out, path), NODE_PATH.join(this.config.release_dir, path), true);
    }
  }
  async onCleanUp(): Promise<void> {}
}
interface Config {
  release_dir: string;
}
