import { Logger } from '../src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, Step } from './lib/Builder.js';
import { Step_Bun_Run } from './lib/steps/Bun-Run.js';

const logger = Logger(Step_NPM_InstallDependencies.name);

export function Step_NPM_InstallDependencies(): Step {
  return new CStep_NPM_InstallDependencies();
}

class CStep_NPM_InstallDependencies implements Step {
  channel = logger.newChannel();

  async end(builder: BuilderInternal) {}
  async run(builder: BuilderInternal) {
    await Step_Bun_Run({ cmd: ['bun', 'install'], dir: builder.dir.out }).run(builder);
  }
}
