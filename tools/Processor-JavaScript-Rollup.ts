import { ArrayEquals } from '../src/lib/ericchase/Algorithm/Array.js';
import { U8StreamReadAll } from '../src/lib/ericchase/Algorithm/Stream.js';
import { U8ToString } from '../src/lib/ericchase/Algorithm/Uint8Array.js';
import { Logger } from '../src/lib/ericchase/Utility/Logger.js';
import { BuilderInternal, ProcessorModule, ProjectFile } from './lib/Builder.js';

const logger = Logger(Processor_JavaScript_Rollup.name);

type RollupConfig = { external?: string[] };

export function Processor_JavaScript_Rollup({ external = [] }: RollupConfig): ProcessorModule {
  return new CProcessor_JavaScript_Rollup({ external });
}

class CProcessor_JavaScript_Rollup implements ProcessorModule {
  channel = logger.newChannel();

  cmd: string[];
  constructor(readonly config: Required<RollupConfig>) {
    this.cmd = ['rollup'];
    const external = config.external.join(',');
    if (external.length > 0) {
      this.cmd.push(`--external=${external}`);
    }
    this.cmd.push('--format=cjs');
    this.cmd.push('--stdin=js');
  }
  async onAdd(builder: BuilderInternal, files: Set<ProjectFile>) {
    for (const file of files) {
      if (builder.platform.Utility.globMatch(file.src_path.standard, '**/*{.module,.script}{.ts,.tsx,.jsx}')) {
        file.addProcessor(this, this.onProcess);
      }
    }
  }
  async onRemove(builder: BuilderInternal, files: Set<ProjectFile>): Promise<void> {}
  async onProcess(builder: BuilderInternal, file: ProjectFile): Promise<void> {
    this.channel.log(`Rollup: "${file.src_path.raw}"`);
    const p0 = Bun.spawn(this.cmd, { stdin: await file.getBytes(), stderr: 'pipe', stdout: 'pipe' });
    await p0.exited;
    /**
     * Rollup writes `- → stdout...` to stderr, possibly to indicate that
     * the results can be read from stdout. To handle actual errors, we
     * simply compare the stringified bytes of stderr to the bytes that are
     * seemingly output when no errors happen. On mismatch, we write the
     * actual error text to console.
     */
    const stderr = await U8StreamReadAll(p0.stderr);
    if (ArrayEquals(stderr.slice(0, 45), new Uint8Array([27, 91, 51, 54, 109, 10, 27, 91, 49, 109, 45, 27, 91, 50, 50, 109, 32, 226, 134, 146, 32, 27, 91, 49, 109, 115, 116, 100, 111, 117, 116, 27, 91, 50, 50, 109, 46, 46, 46, 27, 91, 51, 57, 109, 10]))) {
      this.channel.errorNotEmpty(U8ToString(stderr.slice(45)));
    } else {
      this.channel.errorNotEmpty(U8ToString(stderr));
    }
    file.setBytes(await U8StreamReadAll(p0.stdout));
  }
}
