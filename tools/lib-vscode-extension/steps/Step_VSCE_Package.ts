import { Async_BunPlatform_File_Move } from '../../../src/lib/ericchase/BunPlatform_File_Move.js';
import { Async_BunPlatform_File_Read_Text } from '../../../src/lib/ericchase/BunPlatform_File_Read_Text.js';
import { Async_BunPlatform_File_Write_Text } from '../../../src/lib/ericchase/BunPlatform_File_Write_Text.js';
import { Async_BunPlatform_Glob_Scan_Generator } from '../../../src/lib/ericchase/BunPlatform_Glob_Scan_Generator.js';
import { NODE_PATH } from '../../../src/lib/ericchase/NodePlatform.js';
import { NodePlatform_PathObject_Relative_Class } from '../../../src/lib/ericchase/NodePlatform_PathObject_Relative_Class.js';
import { Builder } from '../../core/Builder.js';
import { SEMVER_UTIL } from '../../core/bundle/semver-util/semver-util.js';
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
    // write empty .vscodeignore file, as we don't need it
    await Async_BunPlatform_File_Write_Text(NODE_PATH.join(Builder.Dir.Out, '.vscodeignore'), '');
    // modify package.json
    const { error, value: text } = await Async_BunPlatform_File_Read_Text(NODE_PATH.join(Builder.Dir.Out, 'package.json'));
    if (text !== undefined) {
      const package_json = JSON.parse(text);
      // remove scripts and devDependencies
      delete package_json.scripts;
      delete package_json.devDependencies;
      // set entrypoint
      const entrypoint = this.config.entrypoint ?? package_json.main ?? undefined;
      if (entrypoint !== undefined) {
        package_json.main = NodePlatform_PathObject_Relative_Class(entrypoint).replaceExt('.js').toPosix().join({ dot: true });
      }
      // increment version
      if (this.config.increment_version !== undefined) {
        const new_version = SEMVER_UTIL.increment(package_json.version, this.config.increment_version);
        if (new_version !== undefined) {
          package_json.version = new_version;
        } else {
          this.channel.error(new Error('The package.json "version" property is not a valid semantic version.'));
        }
      }
      await Async_BunPlatform_File_Write_Text(NODE_PATH.join(Builder.Dir.Out, 'package.json'), JSON.stringify(package_json, null, 2));
    } else {
      throw error;
    }
    await Builder.ExecuteStep(Step_Bun_Run({ cmd: ['npm', 'install', '--omit=dev'], dir: Builder.Dir.Out }));
    await Builder.ExecuteStep(Step_Bun_Run({ cmd: ['bun', 'run', 'vsce', 'package'], dir: Builder.Dir.Out }));
    for await (const path of Async_BunPlatform_Glob_Scan_Generator(Builder.Dir.Out, '*.vsix')) {
      await Async_BunPlatform_File_Move(NODE_PATH.join(Builder.Dir.Out, path), NODE_PATH.join(this.config.release_dirpath, path), true);
    }
  }
}
interface Config {
  release_dirpath: string;
  /**
   * Note: Not all extensions need an entrypoint.
   * @default undefined
   */
  entrypoint?: string;
  /**
   * Use this to increment the package.json "version" property once for this
   * build. Useful when patching an existing extension. For your own extension,
   * update the actual "version" property of the actual package.json, instead.
   * @default undefined
   */
  increment_version?: Parameters<typeof SEMVER_UTIL.increment>[1];
}
