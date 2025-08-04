import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { Step_Bun_Run } from '../../core/step/Step_Bun_Run.js';

export function Step_NPM_Install_Extension_Dependencies(): Builder.Step {
  return new Class();
}
class Class implements Builder.Step {
  StepName = Step_NPM_Install_Extension_Dependencies.name;
  channel = Logger(this.StepName).newChannel();

  constructor() {}
  async onStartUp(): Promise<void> {}
  async onRun(): Promise<void> {
    await Step_Bun_Run({ cmd: ['bun', 'install'], dir: Builder.Dir.Out }).onRun?.();
  }
  async onCleanUp(): Promise<void> {}
}
