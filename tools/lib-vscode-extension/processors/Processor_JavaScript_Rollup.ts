import { BunPlatform_Glob_Match } from '../../../src/lib/ericchase/BunPlatform_Glob_Match.js';
import { Core_Array_Are_Equal } from '../../../src/lib/ericchase/Core_Array_Are_Equal.js';
import { Core_Array_Uint8_To_String } from '../../../src/lib/ericchase/Core_Array_Uint8_To_String.js';
import { Async_Core_Stream_Uint8_Read_All } from '../../../src/lib/ericchase/Core_Stream_Uint8_Read_All.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { PATTERN } from '../../core/processor/Processor_TypeScript_Generic_Bundler.js';

export function Processor_JavaScript_Rollup(config: Config): Builder.Processor {
  return new Class(config);
}
class Class implements Builder.Processor {
  ProcessorName = Processor_JavaScript_Rollup.name;
  channel = Logger(this.ProcessorName).newChannel();

  cmd: string[];
  constructor(public config: Config) {
    this.config.external ??= [];
    this.cmd = ['bun', 'run', 'rollup'];
    if (this.config.external.length > 0) {
      this.cmd.push(`--external=${this.config.external.join(',')}`);
    }
    this.cmd.push('--format=cjs');
    this.cmd.push('--stdin=js');
  }
  async onStartUp(): Promise<void> {}
  async onAdd(files: Set<Builder.File>): Promise<void> {
    for (const file of files) {
      if (BunPlatform_Glob_Match(file.src_path, `**/*${PATTERN.MODULE_IIFE}`)) {
        file.addProcessor(this, this.onProcess);
      }
    }
  }
  async onRemove(files: Set<Builder.File>): Promise<void> {}
  async onCleanUp(): Promise<void> {}

  async onProcess(file: Builder.File): Promise<void> {
    this.channel.log(`Rollup: "${file.src_path}"`);
    const p0 = Bun.spawn(this.cmd, { stdin: await file.getBytes(), stderr: 'pipe', stdout: 'pipe' });
    await p0.exited;
    /**
     * Rollup writes `- → stdout...` to stderr, possibly to indicate that
     * the results can be read from stdout. To handle actual errors, we
     * simply compare the stringified bytes of stderr to the bytes that are
     * seemingly output when no errors happen. On mismatch, we write the
     * actual error text to console.
     */
    const stderr = await Async_Core_Stream_Uint8_Read_All(p0.stderr);
    if (Core_Array_Are_Equal(stderr.slice(0, 45), new Uint8Array([27, 91, 51, 54, 109, 10, 27, 91, 49, 109, 45, 27, 91, 50, 50, 109, 32, 226, 134, 146, 32, 27, 91, 49, 109, 115, 116, 100, 111, 117, 116, 27, 91, 50, 50, 109, 46, 46, 46, 27, 91, 51, 57, 109, 10]))) {
      this.channel.errorNotEmpty(Core_Array_Uint8_To_String(stderr.slice(45)));
    } else {
      this.channel.errorNotEmpty(Core_Array_Uint8_To_String(stderr));
    }
    file.setBytes(await Async_Core_Stream_Uint8_Read_All(p0.stdout));
  }
}
interface Config {
  external?: string[];
}
