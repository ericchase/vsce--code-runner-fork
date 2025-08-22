import { BunPlatform_Glob_Match } from '../../../src/lib/ericchase/BunPlatform_Glob_Match.js';
import { Builder } from '../../core/Builder.js';
import { Logger } from '../../core/Logger.js';
import { PATTERN } from '../../core/processor/Processor_TypeScript_Generic_Bundler.js';

export function Processor_JavaScript_Rollup(config: Config): Builder.Processor {
  return new Class(config);
}
class Class implements Builder.Processor {
  ProcessorName = Processor_JavaScript_Rollup.name;
  channel = Logger(this.ProcessorName).newChannel();

  /** path -> bytes */
  bytes_map = new Map<string, Uint8Array<ArrayBuffer>>();
  /** path -> hash */
  hash_map = new Map<string, bigint>();

  cmd: string[] = [];
  constructor(readonly config: Config) {}
  async onStartUp(): Promise<void> {
    this.config.external ??= [];
    this.cmd = ['bun', 'run', 'rollup'];
    if (this.config.external.length > 0) {
      this.cmd.push(`--external=${this.config.external.join(',')}`);
    }
    this.cmd.push('--format=cjs');
    this.cmd.push('--stdin=js');
  }
  async onAdd(files: Set<Builder.File>): Promise<void> {
    for (const file of files) {
      if (BunPlatform_Glob_Match(file.src_path, `${Builder.Dir.Src}/**/*${PATTERN.MODULE}`)) {
        file.addProcessor(this, this.onProcess);
      }
    }
  }
  async onRemove(files: Set<Builder.File>): Promise<void> {
    for (const file of files) {
      if (BunPlatform_Glob_Match(file.src_path, `${Builder.Dir.Src}/**/*${PATTERN.MODULE}`)) {
        this.hash_map.delete(file.src_path);
      }
    }
  }

  async onProcess(file: Builder.File): Promise<void> {
    this.channel.log(`Rollup: "${file.src_path}"`);

    const src_bytes = await file.getBytes();
    const src_hash = Bun.hash.wyhash(src_bytes);

    const cache_hash = this.hash_map.get(file.src_path);
    if (cache_hash !== undefined && cache_hash === src_hash) {
      const cache_bytes = this.bytes_map.get(file.src_path);
      if (cache_bytes !== undefined) {
        file.setBytes(cache_bytes);
        return;
      }
    }

    const p0 = Bun.spawn(this.cmd, { stdin: src_bytes, stderr: 'pipe', stdout: 'pipe' });
    await p0.exited;
    this.channel.error(await new Response(p0.stderr).text());

    const out_bytes = await new Response(p0.stdout).bytes();
    this.bytes_map.set(file.src_path, out_bytes);
    this.hash_map.set(file.src_path, src_hash);
    file.setBytes(out_bytes);
  }
}
interface Config {
  /** @default [] */
  external?: string[];
}
