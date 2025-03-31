import { CPath, Path } from '../src/lib/ericchase/Platform/FilePath.js';
import { Logger } from '../src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, Step } from './lib/Builder.js';
import { Step_Bun_Run } from './lib/steps/Bun-Run.js';

const logger = Logger(Step_VSCE_Package.name);

export function Step_VSCE_Package(release_dirpath: CPath | string): Step {
  return new CStep_VSCE_Package(Path(release_dirpath));
}

class CStep_VSCE_Package implements Step {
  channel = logger.newChannel();

  constructor(readonly release_dirpath: CPath) {}
  async onRun(builder: BuilderInternal): Promise<void> {
    await Step_Bun_Run({ cmd: ['vsce', 'package'], dir: builder.dir.out }).onRun?.(builder);
    for await (const path of builder.platform.Directory.globScan(builder.dir.out, '*.vsix')) {
      await builder.platform.File.move(Path(builder.dir.out, path), Path(this.release_dirpath, path), true);
    }
  }
}
