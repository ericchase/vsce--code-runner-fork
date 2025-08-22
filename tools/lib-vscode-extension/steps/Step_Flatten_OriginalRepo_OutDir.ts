import { Async_BunPlatform_File_Read_Text } from '../../../src/lib/ericchase/BunPlatform_File_Read_Text.js';
import { Async_BunPlatform_File_Write_Text } from '../../../src/lib/ericchase/BunPlatform_File_Write_Text.js';
import { BunPlatform_Glob_Match } from '../../../src/lib/ericchase/BunPlatform_Glob_Match.js';
import { Core_JSON_Merge } from '../../../src/lib/ericchase/Core_JSON_Merge.js';
import { NODE_PATH } from '../../../src/lib/ericchase/NodePlatform.js';
import { Async_NodePlatform_File_Delete } from '../../../src/lib/ericchase/NodePlatform_File_Delete.js';
import { Builder } from '../../core/Builder.js';
import { JSONC } from '../../core/bundle/jsonc-parse/jsonc-parse.js';
import { Logger } from '../../core/Logger.js';
import { Step_FS_Copy_Files } from '../../core/step/Step_FS_Copy_Files.js';
import { Step_FS_Delete_Directory } from '../../core/step/Step_FS_Delete_Directory.js';

export function Step_Flatten_OriginalRepo_OutDir(config: Config): Builder.Step {
  return new Class(config);
}
class Class implements Builder.Step {
  StepName = Step_Flatten_OriginalRepo_OutDir.name;
  channel = Logger(this.StepName).newChannel();

  steps: Builder.Step[] = [];

  constructor(readonly config: Config) {}
  async onStartUp(): Promise<void> {
    this.config.overwrite ??= true;

    this.steps.push(
      Step_FS_Copy_Files({ from_path: NODE_PATH.join(Builder.Dir.Out, this.config.original_subdir), to_path: Builder.Dir.Out, include_patterns: ['**'], overwrite: this.config.overwrite }),
      Step_FS_Delete_Directory(NODE_PATH.join(Builder.Dir.Out, this.config.original_subdir)),
      //
    );

    for (const step of this.steps) {
      try {
        await step.onStartUp?.();
      } catch (error) {
        this.channel.error(error, `Unhandled exception in "${step.StepName}" onStartUp:`);
      }
    }
  }
  async onRun(): Promise<void> {
    for (const merge_path of this.config.merge_list ?? []) {
      try {
        const original_path = NODE_PATH.join(Builder.Dir.Out, this.config.original_subdir, merge_path);
        const new_path = NODE_PATH.join(Builder.Dir.Out, merge_path);
        if (BunPlatform_Glob_Match(merge_path, '**/*.json') === true) {
          await Async_BunPlatform_File_Write_Text(new_path, await Async_MergeJSONFiles(original_path, new_path));
          await Async_NodePlatform_File_Delete(original_path);
          this.channel.log(`Merged "${original_path}" -> "${new_path}".`);
          continue;
        }
        if (BunPlatform_Glob_Match(merge_path, '**/*{.md,.txt}') === true) {
          await Async_BunPlatform_File_Write_Text(new_path, await Async_MergeTextFiles(new_path, original_path));
          await Async_NodePlatform_File_Delete(original_path);
          this.channel.log(`Merged "${original_path}" -> "${new_path}".`);
          continue;
        }
      } catch (error) {
        this.channel.error(error, `Merge error for "${merge_path}".`);
      }
    }

    for (const step of this.steps) {
      try {
        await step.onRun?.();
      } catch (error) {
        this.channel.error(error, `Unhandled exception in "${step.StepName}" onRun:`);
      }
    }
  }
  async onCleanUp(): Promise<void> {
    for (const step of this.steps) {
      try {
        await step.onCleanUp?.();
      } catch (error) {
        this.channel.error(error, `Unhandled exception in "${step.StepName}" onCleanUp:`);
      }
    }
  }
}
interface Config {
  /**
   * Merge `*.json`, `*.md`, and `*.txt` files from `original_subdir` into
   * `Builder.Dir.Out`. The new `*.json` files are merged on top of the
   * original ones. The original `*.md` and `*.txt` files are appended to the
   * ends of the new ones. Don't include the `original_subdir` folder in the
   * paths.
   * @default []
   */
  merge_list?: string[];
  /**
   * Don't include the out folder in the path. Set this value to the value of
   * `original_subdir` from the path `<Builder.Dir.Out>/<original_subdir>`.
   */
  original_subdir: string;
  /** @default true */
  overwrite?: boolean;
}

/** Writes `path_a`, then merges `path_b` on top. */
async function Async_MergeJSONFiles(path_a: string, path_b: string): Promise<string> {
  const result_a = await Async_BunPlatform_File_Read_Text(path_a);
  const result_b = await Async_BunPlatform_File_Read_Text(path_b);
  if (result_a.error !== undefined) {
    throw result_a.error;
  }
  if (result_b.error !== undefined) {
    throw result_b.error;
  }
  const json_a = JSONC.parse(result_a.value ?? '{}');
  const json_b = JSONC.parse(result_b.value ?? '{}');
  return JSON.stringify(Core_JSON_Merge(json_a, json_b), null, 2).trim() + '\n';
}

/** Writes `path_a`, then `path_b` underneath. */
async function Async_MergeTextFiles(path_a: string, path_b: string): Promise<string> {
  const result_a = await Async_BunPlatform_File_Read_Text(path_a);
  const result_b = await Async_BunPlatform_File_Read_Text(path_b);
  if (result_a.error !== undefined) {
    throw result_a.error;
  }
  if (result_b.error !== undefined) {
    throw result_b.error;
  }
  const text_a = result_a.value?.trim() ?? '';
  const text_b = result_b.value?.trim() ?? '';
  const list = [];
  if (text_a !== '') {
    list.push(text_a);
  }
  if (text_b !== '') {
    list.push(text_b);
  }
  return list.join('\n\n') + '\n';
}
