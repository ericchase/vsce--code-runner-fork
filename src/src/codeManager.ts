'use strict';
import * as fs from 'fs';
import * as micromatch from 'micromatch';
import * as os from 'os';
import { basename, dirname, extname, resolve, isAbsolute } from 'path';
import * as vscode from 'vscode';
import { AppInsightsClient } from './appInsightsClient';
import { Constants } from './constants';
import { Utility } from './utility';

const TmpDir = os.tmpdir();

export class CodeManager implements vscode.Disposable {
  private _outputChannel: vscode.OutputChannel;
  private _terminal: vscode.Terminal;
  private _isRunning: boolean;
  private _process;
  private _codeFile: string;
  private _isTmpFile: boolean;
  private _languageId: string;
  private _cwd: string;
  private _runFromExplorer: boolean;
  private _document: vscode.TextDocument;
  private _workspaceFolder: string;
  private _config: vscode.WorkspaceConfiguration;
  private _appInsightsClient: AppInsightsClient;
  private _TERMINAL_DEFAULT_SHELL_WINDOWS: string | null = null;

  constructor() {
    this._outputChannel = vscode.window.createOutputChannel('Code');
    this._terminal = null;
    this._appInsightsClient = new AppInsightsClient();
  }

  public onDidCloseTerminal(): void {
    this._terminal = null;
  }

  public async run(languageId: string = null, fileUri: vscode.Uri = null) {
    if (this._isRunning) {
      vscode.window.showInformationMessage('Code is already running!');
      return;
    }

    this._runFromExplorer = this.checkIsRunFromExplorer(fileUri);
    if (this._runFromExplorer) {
      this._document = await vscode.workspace.openTextDocument(fileUri);
    } else {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        this._document = editor.document;
      } else {
        vscode.window.showInformationMessage('No code found or selected.');
        return;
      }
    }

    this.initialize();

    const fileExtension = extname(this._document.fileName);
    const executor = this.getExecutor(languageId, fileExtension);
    // undefined or null
    if (executor == null) {
      vscode.window.showInformationMessage('Code language not supported or defined.');
      return;
    }

    this.getCodeFileAndExecute(fileExtension, executor);
  }

  public runCustomCommand(): void {
    if (this._isRunning) {
      vscode.window.showInformationMessage('Code is already running!');
      return;
    }

    this._runFromExplorer = false;
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      this._document = editor.document;
    }

    this.initialize();

    const executor = this._config.get<string>('customCommand');

    if (this._document) {
      const fileExtension = extname(this._document.fileName);
      this.getCodeFileAndExecute(fileExtension, executor, false);
    } else {
      this.executeCommand(executor, false);
    }
  }

  public runByLanguage(): void {
    this._appInsightsClient.sendEvent('runByLanguage');
    const config = this.getConfiguration('code-runner');
    const executorMap = config.get<any>('executorMap');
    vscode.window.showQuickPick(Object.keys(executorMap), { placeHolder: 'Type or select language to run' }).then((languageId) => {
      if (languageId !== undefined) {
        this.run(languageId);
      }
    });
  }

  public stop(): void {
    this._appInsightsClient.sendEvent('stop');
    this.stopRunning();
  }

  public dispose() {
    this.stopRunning();
  }

  private checkIsRunFromExplorer(fileUri: vscode.Uri): boolean {
    const editor = vscode.window.activeTextEditor;
    if (!fileUri || !fileUri.fsPath) {
      return false;
    }
    if (!editor) {
      return true;
    }
    if (fileUri.fsPath === editor.document.uri.fsPath) {
      return false;
    }
    return true;
  }

  private stopRunning() {
    if (this._isRunning) {
      this._isRunning = false;
      vscode.commands.executeCommand('setContext', 'code-runner.codeRunning', false);
      const kill = require('tree-kill');
      kill(this._process.pid);
    }
  }

  private initialize(): void {
    this._config = this.getConfiguration('code-runner');
    this._cwd = this._config.get<string>('cwd');
    if (this._cwd) {
      return;
    }
    this._workspaceFolder = this.getWorkspaceFolder();
    if ((this._config.get<boolean>('fileDirectoryAsCwd') || !this._workspaceFolder) && this._document && !this._document.isUntitled) {
      this._cwd = dirname(this._document.fileName);
    } else {
      this._cwd = this._workspaceFolder;
    }
    if (this._cwd) {
      return;
    }
    this._cwd = TmpDir;
  }

  private getConfiguration(section?: string): vscode.WorkspaceConfiguration {
    return Utility.getConfiguration(section, this._document);
  }

  private getWorkspaceFolder(): string {
    if (vscode.workspace.workspaceFolders) {
      if (this._document) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(this._document.uri);
        if (workspaceFolder) {
          return workspaceFolder.uri.fsPath;
        }
      }
      return vscode.workspace.workspaceFolders[0].uri.fsPath;
    } else {
      return undefined;
    }
  }

  private getCodeFileAndExecute(fileExtension: string, executor: string, appendFile: boolean = true): any {
    let selection;
    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor) {
      selection = activeTextEditor.selection;
    }
    const ignoreSelection = this._config.get<boolean>('ignoreSelection');

    if ((this._runFromExplorer || !selection || selection.isEmpty || ignoreSelection) && !this._document.isUntitled) {
      this._isTmpFile = false;
      this._codeFile = this._document.fileName;

      if (this._config.get<boolean>('saveAllFilesBeforeRun')) {
        return vscode.workspace.saveAll().then(() => {
          this.executeCommand(executor, appendFile);
        });
      }

      if (this._config.get<boolean>('saveFileBeforeRun')) {
        return this._document.save().then(() => {
          this.executeCommand(executor, appendFile);
        });
      }
    } else {
      let text = this._runFromExplorer || !selection || selection.isEmpty || ignoreSelection ? this._document.getText() : this._document.getText(selection);

      if (this._languageId === 'php') {
        text = text.trim();
        if (!text.startsWith('<?php')) {
          text = '<?php\r\n' + text;
        }
      }

      this._isTmpFile = true;
      const folder = this._document.isUntitled ? this._cwd : dirname(this._document.fileName);
      this.createRandomFile(text, folder, fileExtension);
    }

    this.executeCommand(executor, appendFile);
  }

  private rndName(): string {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 10);
  }

  private createRandomFile(content: string, folder: string, fileExtension: string) {
    let fileType = '';
    const languageIdToFileExtensionMap = this._config.get<any>('languageIdToFileExtensionMap');
    if (this._languageId && languageIdToFileExtensionMap[this._languageId]) {
      fileType = languageIdToFileExtensionMap[this._languageId];
    } else {
      if (fileExtension) {
        fileType = fileExtension;
      } else {
        fileType = '.' + this._languageId;
      }
    }
    const temporaryFileName = this._config.get<string>('temporaryFileName');
    const tmpFileNameWithoutExt = temporaryFileName ? temporaryFileName : 'temp' + this.rndName();
    const tmpFileName = tmpFileNameWithoutExt + fileType;
    // ! ericchase: let user provide an absolute path
    // ! // this._codeFile = join(folder, tmpFileName);
    // ! // fs.writeFileSync(this._codeFile, content);
    this._codeFile = isAbsolute(tmpFileName) ? tmpFileName : resolve(folder, tmpFileName);
    try {
      fs.mkdirSync(dirname(this._codeFile), { recursive: true });
      fs.writeFileSync(this._codeFile, content);
    } catch (err) {
      const logger = vscode.window.createOutputChannel('code-runner-fork');
      logger.appendLine(`Could not create file: ${this._codeFile}`);
      logger.appendLine('Please check that you have permissions to create the file path.');
      logger.appendLine('If all else fails, please use a different path for code-runner.temporaryFileName in settings.');
      logger.show();
    }
    // ! ericchase: fs.exists was deprecated, not sure if it matters
    // ! // fs.exists(this._codeFile, (isExist) => {
    // ! //   if(isExist !== true) {
    if (fs.existsSync(this._codeFile) !== true) {
      const logger = vscode.window.createOutputChannel('code-runner-fork');
      logger.appendLine(`Could not create file: ${this._codeFile}`);
      logger.appendLine('Please check that you have permissions to create the file path.');
      logger.appendLine('If all else fails, please use a different path for code-runner.temporaryFileName in settings.');
      logger.show();
    }
    // ! //   }
    // ! // });
  }

  private getExecutor(languageId: string, fileExtension: string): string {
    this._languageId = languageId === null ? this._document.languageId : languageId;

    let executor = null;

    // Check if file contains hash-bang
    if (languageId == null && this._config.get<boolean>('respectShebang')) {
      const firstLineInFile = this._document.lineAt(0).text;
      if (/^#!(?!\[)/.test(firstLineInFile)) {
        // #![...] are used in rust https://doc.rust-lang.org/reference/attributes.html
        executor = firstLineInFile.slice(2);
      }
    }

    if (executor == null) {
      const executorMapByGlob = this._config.get<any>('executorMapByGlob');
      if (executorMapByGlob) {
        const fileBasename = basename(this._document.fileName);
        for (const glob of Object.keys(executorMapByGlob)) {
          if (micromatch.isMatch(fileBasename, glob)) {
            executor = executorMapByGlob[glob];
            break;
          }
        }
      }
    }

    const executorMap = this._config.get<any>('executorMap');

    if (executor == null) {
      executor = executorMap[this._languageId];
    }

    // executor is undefined or null
    if (executor == null && fileExtension) {
      const executorMapByFileExtension = this._config.get<any>('executorMapByFileExtension');
      executor = executorMapByFileExtension[fileExtension];
      if (executor != null) {
        this._languageId = fileExtension;
      }
    }
    if (executor == null) {
      this._languageId = this._config.get<string>('defaultLanguage');
      executor = executorMap[this._languageId];
    }

    return executor;
  }

  private executeCommand(executor: string, appendFile: boolean = true) {
    if (this._config.get<boolean>('runInTerminal')) {
      this.executeCommandInTerminal(executor, appendFile);
    } else {
      this.executeCommandInOutputChannel(executor, appendFile);
    }
  }

  private getWorkspaceRoot(codeFileDir: string): string {
    return this._workspaceFolder ? this._workspaceFolder : codeFileDir;
  }

  /**
   * Gets the base name of the code file, that is without its directory.
   */
  private getCodeBaseFile(): string {
    const regexMatch = this._codeFile.match(/.*[\/\\](.*)/);
    return regexMatch ? regexMatch[1] : this._codeFile;
  }

  /**
   * Gets the code file name without its directory and extension.
   */
  private getCodeFileWithoutDirAndExt(): string {
    const regexMatch = this._codeFile.match(/.*[\/\\](.*(?=\..*))/);
    return regexMatch ? regexMatch[1] : this._codeFile;
  }

  /**
   * Gets the directory of the code file.
   */
  private getCodeFileDir(): string {
    const regexMatch = this._codeFile.match(/(.*[\/\\]).*/);
    return regexMatch ? regexMatch[1] : this._codeFile;
  }

  /**
   * Gets the drive letter of the code file.
   */
  private getDriveLetter(): string {
    const regexMatch = this._codeFile.match(/^([A-Za-z]:).*/);
    return regexMatch ? regexMatch[1] : '$driveLetter';
  }

  /**
   * Gets the directory of the code file without a trailing slash.
   */
  private getCodeFileDirWithoutTrailingSlash(): string {
    return this.getCodeFileDir().replace(/[\/\\]$/, '');
  }

  /**
   * Includes double quotes around a given file name.
   */
  private quoteFileName(fileName: string): string {
    return '"' + fileName + '"';
  }

  /**
   * Gets the executor to run a source code file
   * and generates the complete command that allow that file to be run.
   * This executor command may include a variable $1 to indicate the place where
   * the source code file name have to be included.
   * If no such a variable is present in the executor command,
   * the file name is appended to the end of the executor command.
   *
   * @param executor The command used to run a source code file
   * @return the complete command to run the file, that includes the file name
   */
  private async getFinalCommandToRunCodeFile(executor: string, appendFile: boolean = true): Promise<string> {
    let cmd = executor;

    if (this._codeFile) {
      const codeFileDir = this.getCodeFileDir();
      const pythonPath = cmd.includes('$pythonPath') ? await Utility.getPythonPath(this._document) : Constants.python;
      const placeholders: Array<{ regex: RegExp; replaceValue: string }> = [
        // A placeholder that has to be replaced by the path of the folder opened in VS Code
        // If no folder is opened, replace with the directory of the code file
        { regex: /\$workspaceRoot/g, replaceValue: this.getWorkspaceRoot(codeFileDir) },
        // A placeholder that has to be replaced by the code file name without its extension
        { regex: /\$fileNameWithoutExt/g, replaceValue: this.getCodeFileWithoutDirAndExt() },
        // A placeholder that has to be replaced by the full code file name
        // ! ericchase: remove the quotes
        // ! // { regex: /\$fullFileName/g, replaceValue: this.quoteFileName(this._codeFile) },
        { regex: /\$fullFileName/g, replaceValue: this._codeFile },
        // A placeholder that has to be replaced by the code file name without the directory
        { regex: /\$fileName/g, replaceValue: this.getCodeBaseFile() },
        // A placeholder that has to be replaced by the drive letter of the code file (Windows only)
        { regex: /\$driveLetter/g, replaceValue: this.getDriveLetter() },
        // A placeholder that has to be replaced by the directory of the code file without a trailing slash
        // ! ericchase: remove the quotes
        // ! // { regex: /\$dirWithoutTrailingSlash/g, replaceValue: this.quoteFileName(this.getCodeFileDirWithoutTrailingSlash()) },
        { regex: /\$dirWithoutTrailingSlash/g, replaceValue: this.getCodeFileDirWithoutTrailingSlash() },
        // A placeholder that has to be replaced by the directory of the code file
        // ! ericchase: remove the quotes
        // ! // { regex: /\$dir/g, replaceValue: this.quoteFileName(codeFileDir) },
        { regex: /\$dir/g, replaceValue: codeFileDir },
        // A placeholder that has to be replaced by the path of Python interpreter
        { regex: /\$pythonPath/g, replaceValue: pythonPath },
      ];

      placeholders.forEach((placeholder) => {
        cmd = cmd.replace(placeholder.regex, placeholder.replaceValue);
      });
    }

    return cmd !== executor ? cmd : executor + (appendFile ? ' ' + this.quoteFileName(this._codeFile) : '');
  }

  private changeExecutorFromCmdToPs(executor: string): string {
    if (executor.includes(' && ') && this.isPowershellOnWindows()) {
      let replacement = '; if ($?) {';
      executor = executor.replace('&&', replacement);
      replacement = '} ' + replacement;
      executor = executor.replace(/&&/g, replacement);
      executor = executor.replace(/\$dir\$fileNameWithoutExt/g, '.\\$fileNameWithoutExt');
      return executor + ' }';
    }
    return executor;
  }

  private isPowershellOnWindows(): boolean {
    if (os.platform() === 'win32') {
      const defaultProfile = vscode.workspace.getConfiguration('terminal').get<string>('integrated.defaultProfile.windows');
      if (defaultProfile) {
        if (defaultProfile.toLowerCase().includes('powershell')) {
          return true;
        } else if (defaultProfile === 'Command Prompt') {
          return false;
        }
      }
      const windowsShell = vscode.env.shell;
      return windowsShell && windowsShell.toLowerCase().includes('powershell');
    }
    return false;
  }

  private changeFilePathForBashOnWindows(command: string): string {
    if (os.platform() === 'win32') {
      const windowsShell = vscode.env.shell;
      const terminalRoot = this._config.get<string>('terminalRoot');
      if (windowsShell && terminalRoot) {
        command = command.replace(/([A-Za-z]):\\/g, (match, p1) => `${terminalRoot}${p1.toLowerCase()}/`).replace(/\\/g, '/');
      } else if (windowsShell && windowsShell.toLowerCase().indexOf('bash') > -1 && windowsShell.toLowerCase().indexOf('windows') > -1) {
        command = command.replace(/([A-Za-z]):\\/g, this.replacer).replace(/\\/g, '/');
      }
    }
    return command;
  }

  private replacer(match: string, p1: string): string {
    return `/mnt/${p1.toLowerCase()}/`;
  }

  private async executeCommandInTerminal(executor: string, appendFile: boolean = true) {
    let isNewTerminal = false;
    if (this._terminal === null) {
      this._terminal = vscode.window.createTerminal('Code');
      isNewTerminal = true;
    }
    this._terminal.show(this._config.get<boolean>('preserveFocus'));
    this.sendRunEvent(executor, true);
    executor = this.changeExecutorFromCmdToPs(executor);
    let command = await this.getFinalCommandToRunCodeFile(executor, appendFile);
    command = this.changeFilePathForBashOnWindows(command);
    if (this._config.get<boolean>('clearPreviousOutput') && !isNewTerminal) {
      await vscode.commands.executeCommand('workbench.action.terminal.clear');
    }
    if (this._config.get<boolean>('fileDirectoryAsCwd')) {
      const cwd = this.changeFilePathForBashOnWindows(this._cwd);
      this._terminal.sendText(`cd "${cwd}"`);
    }
    this._terminal.sendText(command);
  }

  private async executeCommandInOutputChannel(executor: string, appendFile: boolean = true) {
    this._isRunning = true;
    vscode.commands.executeCommand('setContext', 'code-runner.codeRunning', true);
    const clearPreviousOutput = this._config.get<boolean>('clearPreviousOutput');
    if (clearPreviousOutput) {
      this._outputChannel.clear();
    }
    const showExecutionMessage = this._config.get<boolean>('showExecutionMessage');
    this._outputChannel.show(this._config.get<boolean>('preserveFocus'));
    const spawn = require('child_process').spawn;
    const command = await this.getFinalCommandToRunCodeFile(executor, appendFile);
    if (showExecutionMessage) {
      this._outputChannel.appendLine('[Running] ' + command);
    }
    this.sendRunEvent(executor, false);
    const startTime = new Date();
    this._process = spawn(command, [], { cwd: this._cwd, shell: true });

    this._process.stdout.on('data', (data) => {
      this._outputChannel.append(data.toString());
    });

    this._process.stderr.on('data', (data) => {
      this._outputChannel.append(data.toString());
    });

    this._process.on('close', (code) => {
      this._isRunning = false;
      vscode.commands.executeCommand('setContext', 'code-runner.codeRunning', false);
      const endTime = new Date();
      const elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
      this._outputChannel.appendLine('');
      if (showExecutionMessage) {
        this._outputChannel.appendLine('[Done] exited with code=' + code + ' in ' + elapsedTime + ' seconds');
        this._outputChannel.appendLine('');
      }
      if (this._isTmpFile) {
        fs.unlinkSync(this._codeFile);
      }
    });
  }

  private sendRunEvent(executor: string, runFromTerminal: boolean) {
    const properties = {
      runFromTerminal: runFromTerminal.toString(),
      runFromExplorer: this._runFromExplorer.toString(),
      isTmpFile: this._isTmpFile.toString(),
    };
    this._appInsightsClient.sendEvent(executor, properties);
  }
}
