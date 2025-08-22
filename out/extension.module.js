'use strict';

var node_module = require('node:module');
var vscode3 = require('vscode');
var micromatch = require('micromatch');
var fs = require('node:fs');
var os = require('node:os');
var node_path = require('node:path');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var vscode3__namespace = /*#__PURE__*/_interopNamespaceDefault(vscode3);
var micromatch__namespace = /*#__PURE__*/_interopNamespaceDefault(micromatch);
var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var os__namespace = /*#__PURE__*/_interopNamespaceDefault(os);

var __require = /* @__PURE__ */ node_module.createRequire((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('-.js', document.baseURI).href)));
var appInsights = __require("applicationinsights");

class AppInsightsClient {
  _client;
  _enableAppInsights;
  constructor() {
    this._client = appInsights.getClient("a25ddf11-20fc-45c6-96ae-524f47754f28");
    const config = vscode3__namespace.workspace.getConfiguration("code-runner");
    this._enableAppInsights = config.get("enableAppInsights");
  }
  sendEvent(eventName, properties) {
    if (this._enableAppInsights) {
      this._client.trackEvent(eventName === "" ? "bat" : eventName, properties);
    }
  }
}

// src/modified-src/constants.ts
class Constants {
  static python = "python";
}
class Utility {
  static async getPythonPath(document) {
    try {
      const extension = vscode3__namespace.extensions.getExtension("ms-python.python");
      if (!extension) {
        return Constants.python;
      }
      const usingNewInterpreterStorage = extension.packageJSON?.featureFlags?.usingNewInterpreterStorage;
      if (usingNewInterpreterStorage) {
        if (!extension.isActive) {
          await extension.activate();
        }
        const execCommand = extension.exports.settings.getExecutionDetails ? extension.exports.settings.getExecutionDetails(document?.uri).execCommand : extension.exports.settings.getExecutionCommand(document?.uri);
        return execCommand ? execCommand.join(" ") : Constants.python;
      } else {
        return this.getConfiguration("python", document).get("pythonPath");
      }
    } catch (error) {
      return Constants.python;
    }
  }
  static getConfiguration(section, document) {
    if (document) {
      return vscode3__namespace.workspace.getConfiguration(section, document.uri);
    } else {
      return vscode3__namespace.workspace.getConfiguration(section);
    }
  }
}

// src/modified-src/codeManager.ts
var TmpDir = os__namespace.tmpdir();

class CodeManager {
  _outputChannel;
  _terminal;
  _isRunning;
  _process;
  _codeFile;
  _isTmpFile;
  _languageId;
  _cwd;
  _runFromExplorer;
  _document;
  _workspaceFolder;
  _config;
  _appInsightsClient;
  _TERMINAL_DEFAULT_SHELL_WINDOWS = null;
  constructor() {
    this._outputChannel = vscode3__namespace.window.createOutputChannel("Code");
    this._terminal = null;
    this._appInsightsClient = new AppInsightsClient;
  }
  onDidCloseTerminal() {
    this._terminal = null;
  }
  async run(languageId = null, fileUri = null) {
    if (this._isRunning) {
      vscode3__namespace.window.showInformationMessage("Code is already running!");
      return;
    }
    this._runFromExplorer = this.checkIsRunFromExplorer(fileUri);
    if (this._runFromExplorer) {
      this._document = await vscode3__namespace.workspace.openTextDocument(fileUri);
    } else {
      const editor = vscode3__namespace.window.activeTextEditor;
      if (editor) {
        this._document = editor.document;
      } else {
        vscode3__namespace.window.showInformationMessage("No code found or selected.");
        return;
      }
    }
    this.initialize();
    const fileExtension = node_path.extname(this._document.fileName);
    const executor = this.getExecutor(languageId, fileExtension);
    if (executor == null) {
      vscode3__namespace.window.showInformationMessage("Code language not supported or defined.");
      return;
    }
    this.getCodeFileAndExecute(fileExtension, executor);
  }
  runCustomCommand() {
    if (this._isRunning) {
      vscode3__namespace.window.showInformationMessage("Code is already running!");
      return;
    }
    this._runFromExplorer = false;
    const editor = vscode3__namespace.window.activeTextEditor;
    if (editor) {
      this._document = editor.document;
    }
    this.initialize();
    const executor = this._config.get("customCommand");
    if (this._document) {
      const fileExtension = node_path.extname(this._document.fileName);
      this.getCodeFileAndExecute(fileExtension, executor, false);
    } else {
      this.executeCommand(executor, false);
    }
  }
  runByLanguage() {
    this._appInsightsClient.sendEvent("runByLanguage");
    const config = this.getConfiguration("code-runner");
    const executorMap = config.get("executorMap");
    vscode3__namespace.window.showQuickPick(Object.keys(executorMap), { placeHolder: "Type or select language to run" }).then((languageId) => {
      if (languageId !== undefined) {
        this.run(languageId);
      }
    });
  }
  stop() {
    this._appInsightsClient.sendEvent("stop");
    this.stopRunning();
  }
  dispose() {
    this.stopRunning();
  }
  checkIsRunFromExplorer(fileUri) {
    const editor = vscode3__namespace.window.activeTextEditor;
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
  stopRunning() {
    if (this._isRunning) {
      this._isRunning = false;
      vscode3__namespace.commands.executeCommand("setContext", "code-runner.codeRunning", false);
      const kill = __require("tree-kill");
      kill(this._process.pid);
    }
  }
  initialize() {
    this._config = this.getConfiguration("code-runner");
    this._cwd = this._config.get("cwd");
    if (this._cwd) {
      return;
    }
    this._workspaceFolder = this.getWorkspaceFolder();
    if ((this._config.get("fileDirectoryAsCwd") || !this._workspaceFolder) && this._document && !this._document.isUntitled) {
      this._cwd = node_path.dirname(this._document.fileName);
    } else {
      this._cwd = this._workspaceFolder;
    }
    if (this._cwd) {
      return;
    }
    this._cwd = TmpDir;
  }
  getConfiguration(section) {
    return Utility.getConfiguration(section, this._document);
  }
  getWorkspaceFolder() {
    if (vscode3__namespace.workspace.workspaceFolders) {
      if (this._document) {
        const workspaceFolder = vscode3__namespace.workspace.getWorkspaceFolder(this._document.uri);
        if (workspaceFolder) {
          return workspaceFolder.uri.fsPath;
        }
      }
      return vscode3__namespace.workspace.workspaceFolders[0].uri.fsPath;
    } else {
      return;
    }
  }
  getCodeFileAndExecute(fileExtension, executor, appendFile = true) {
    let selection;
    const activeTextEditor = vscode3__namespace.window.activeTextEditor;
    if (activeTextEditor) {
      selection = activeTextEditor.selection;
    }
    const ignoreSelection = this._config.get("ignoreSelection");
    if ((this._runFromExplorer || !selection || selection.isEmpty || ignoreSelection) && !this._document.isUntitled) {
      this._isTmpFile = false;
      this._codeFile = this._document.fileName;
      if (this._config.get("saveAllFilesBeforeRun")) {
        return vscode3__namespace.workspace.saveAll().then(() => {
          this.executeCommand(executor, appendFile);
        });
      }
      if (this._config.get("saveFileBeforeRun")) {
        return this._document.save().then(() => {
          this.executeCommand(executor, appendFile);
        });
      }
    } else {
      let text = this._runFromExplorer || !selection || selection.isEmpty || ignoreSelection ? this._document.getText() : this._document.getText(selection);
      if (this._languageId === "php") {
        text = text.trim();
        if (!text.startsWith("<?php")) {
          text = `<?php\r
` + text;
        }
      }
      this._isTmpFile = true;
      const folder = this._document.isUntitled ? this._cwd : node_path.dirname(this._document.fileName);
      this.createRandomFile(text, folder, fileExtension);
    }
    this.executeCommand(executor, appendFile);
  }
  rndName() {
    return Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 10);
  }
  createRandomFile(content, folder, fileExtension) {
    let fileType = "";
    const languageIdToFileExtensionMap = this._config.get("languageIdToFileExtensionMap");
    if (this._languageId && languageIdToFileExtensionMap[this._languageId]) {
      fileType = languageIdToFileExtensionMap[this._languageId];
    } else {
      if (fileExtension) {
        fileType = fileExtension;
      } else {
        fileType = "." + this._languageId;
      }
    }
    const temporaryFileName = this._config.get("temporaryFileName");
    const tmpFileNameWithoutExt = temporaryFileName ? temporaryFileName : "temp" + this.rndName();
    const tmpFileName = tmpFileNameWithoutExt + fileType;
    this._codeFile = node_path.isAbsolute(tmpFileName) ? tmpFileName : node_path.resolve(folder, tmpFileName);
    try {
      fs__namespace.mkdirSync(node_path.dirname(this._codeFile), { recursive: true });
      fs__namespace.writeFileSync(this._codeFile, content);
    } catch (err) {
      const logger = vscode3__namespace.window.createOutputChannel("code-runner-fork");
      logger.appendLine(`Could not create file: ${this._codeFile}`);
      logger.appendLine("Please check that you have permissions to create the file path.");
      logger.appendLine("If all else fails, please use a different path for code-runner.temporaryFileName in settings.");
      logger.show();
    }
    if (fs__namespace.existsSync(this._codeFile) !== true) {
      const logger = vscode3__namespace.window.createOutputChannel("code-runner-fork");
      logger.appendLine(`Could not create file: ${this._codeFile}`);
      logger.appendLine("Please check that you have permissions to create the file path.");
      logger.appendLine("If all else fails, please use a different path for code-runner.temporaryFileName in settings.");
      logger.show();
    }
  }
  getExecutor(languageId, fileExtension) {
    this._languageId = languageId === null ? this._document.languageId : languageId;
    let executor = null;
    if (languageId == null && this._config.get("respectShebang")) {
      const firstLineInFile = this._document.lineAt(0).text;
      if (/^#!(?!\[)/.test(firstLineInFile)) {
        executor = firstLineInFile.slice(2);
      }
    }
    if (executor == null) {
      const executorMapByGlob = this._config.get("executorMapByGlob");
      if (executorMapByGlob) {
        const fileBasename = node_path.basename(this._document.fileName);
        for (const glob of Object.keys(executorMapByGlob)) {
          if (micromatch__namespace.isMatch(fileBasename, glob)) {
            executor = executorMapByGlob[glob];
            break;
          }
        }
      }
    }
    const executorMap = this._config.get("executorMap");
    if (executor == null) {
      executor = executorMap[this._languageId];
    }
    if (executor == null && fileExtension) {
      const executorMapByFileExtension = this._config.get("executorMapByFileExtension");
      executor = executorMapByFileExtension[fileExtension];
      if (executor != null) {
        this._languageId = fileExtension;
      }
    }
    if (executor == null) {
      this._languageId = this._config.get("defaultLanguage");
      executor = executorMap[this._languageId];
    }
    return executor;
  }
  executeCommand(executor, appendFile = true) {
    if (this._config.get("runInTerminal")) {
      this.executeCommandInTerminal(executor, appendFile);
    } else {
      this.executeCommandInOutputChannel(executor, appendFile);
    }
  }
  getWorkspaceRoot(codeFileDir) {
    return this._workspaceFolder ? this._workspaceFolder : codeFileDir;
  }
  getCodeBaseFile() {
    const regexMatch = this._codeFile.match(/.*[\/\\](.*)/);
    return regexMatch ? regexMatch[1] : this._codeFile;
  }
  getCodeFileWithoutDirAndExt() {
    const regexMatch = this._codeFile.match(/.*[\/\\](.*(?=\..*))/);
    return regexMatch ? regexMatch[1] : this._codeFile;
  }
  getCodeFileDir() {
    const regexMatch = this._codeFile.match(/(.*[\/\\]).*/);
    return regexMatch ? regexMatch[1] : this._codeFile;
  }
  getDriveLetter() {
    const regexMatch = this._codeFile.match(/^([A-Za-z]:).*/);
    return regexMatch ? regexMatch[1] : "$driveLetter";
  }
  getCodeFileDirWithoutTrailingSlash() {
    return this.getCodeFileDir().replace(/[\/\\]$/, "");
  }
  quoteFileName(fileName) {
    return '"' + fileName + '"';
  }
  async getFinalCommandToRunCodeFile(executor, appendFile = true) {
    let cmd = executor;
    if (this._codeFile) {
      const codeFileDir = this.getCodeFileDir();
      const pythonPath = cmd.includes("$pythonPath") ? await Utility.getPythonPath(this._document) : Constants.python;
      const placeholders = [
        { regex: /\$workspaceRoot/g, replaceValue: this.getWorkspaceRoot(codeFileDir) },
        { regex: /\$fileNameWithoutExt/g, replaceValue: this.getCodeFileWithoutDirAndExt() },
        { regex: /\$fullFileName/g, replaceValue: this._codeFile },
        { regex: /\$fileName/g, replaceValue: this.getCodeBaseFile() },
        { regex: /\$driveLetter/g, replaceValue: this.getDriveLetter() },
        { regex: /\$dirWithoutTrailingSlash/g, replaceValue: this.getCodeFileDirWithoutTrailingSlash() },
        { regex: /\$dir/g, replaceValue: codeFileDir },
        { regex: /\$pythonPath/g, replaceValue: pythonPath }
      ];
      placeholders.forEach((placeholder) => {
        cmd = cmd.replace(placeholder.regex, placeholder.replaceValue);
      });
    }
    return cmd !== executor ? cmd : executor + (appendFile ? " " + this.quoteFileName(this._codeFile) : "");
  }
  changeExecutorFromCmdToPs(executor) {
    if (executor.includes(" && ") && this.isPowershellOnWindows()) {
      let replacement = "; if ($?) {";
      executor = executor.replace("&&", replacement);
      replacement = "} " + replacement;
      executor = executor.replace(/&&/g, replacement);
      executor = executor.replace(/\$dir\$fileNameWithoutExt/g, ".\\$fileNameWithoutExt");
      return executor + " }";
    }
    return executor;
  }
  isPowershellOnWindows() {
    if (os__namespace.platform() === "win32") {
      const defaultProfile = vscode3__namespace.workspace.getConfiguration("terminal").get("integrated.defaultProfile.windows");
      if (defaultProfile) {
        if (defaultProfile.toLowerCase().includes("powershell")) {
          return true;
        } else if (defaultProfile === "Command Prompt") {
          return false;
        }
      }
      const windowsShell = vscode3__namespace.env.shell;
      return windowsShell && windowsShell.toLowerCase().includes("powershell");
    }
    return false;
  }
  changeFilePathForBashOnWindows(command) {
    if (os__namespace.platform() === "win32") {
      const windowsShell = vscode3__namespace.env.shell;
      const terminalRoot = this._config.get("terminalRoot");
      if (windowsShell && terminalRoot) {
        command = command.replace(/([A-Za-z]):\\/g, (match, p1) => `${terminalRoot}${p1.toLowerCase()}/`).replace(/\\/g, "/");
      } else if (windowsShell && windowsShell.toLowerCase().indexOf("bash") > -1 && windowsShell.toLowerCase().indexOf("windows") > -1) {
        command = command.replace(/([A-Za-z]):\\/g, this.replacer).replace(/\\/g, "/");
      }
    }
    return command;
  }
  replacer(match, p1) {
    return `/mnt/${p1.toLowerCase()}/`;
  }
  async executeCommandInTerminal(executor, appendFile = true) {
    let isNewTerminal = false;
    if (this._terminal === null) {
      this._terminal = vscode3__namespace.window.createTerminal("Code");
      isNewTerminal = true;
    }
    this._terminal.show(this._config.get("preserveFocus"));
    this.sendRunEvent(executor, true);
    executor = this.changeExecutorFromCmdToPs(executor);
    let command = await this.getFinalCommandToRunCodeFile(executor, appendFile);
    command = this.changeFilePathForBashOnWindows(command);
    if (this._config.get("clearPreviousOutput") && !isNewTerminal) {
      await vscode3__namespace.commands.executeCommand("workbench.action.terminal.clear");
    }
    if (this._config.get("fileDirectoryAsCwd")) {
      const cwd = this.changeFilePathForBashOnWindows(this._cwd);
      this._terminal.sendText(`cd "${cwd}"`);
    }
    this._terminal.sendText(command);
  }
  async executeCommandInOutputChannel(executor, appendFile = true) {
    this._isRunning = true;
    vscode3__namespace.commands.executeCommand("setContext", "code-runner.codeRunning", true);
    const clearPreviousOutput = this._config.get("clearPreviousOutput");
    if (clearPreviousOutput) {
      this._outputChannel.clear();
    }
    const showExecutionMessage = this._config.get("showExecutionMessage");
    this._outputChannel.show(this._config.get("preserveFocus"));
    const spawn = __require("child_process").spawn;
    const command = await this.getFinalCommandToRunCodeFile(executor, appendFile);
    if (showExecutionMessage) {
      this._outputChannel.appendLine("[Running] " + command);
    }
    this.sendRunEvent(executor, false);
    const startTime = new Date;
    this._process = spawn(command, [], { cwd: this._cwd, shell: true });
    this._process.stdout.on("data", (data) => {
      this._outputChannel.append(data.toString());
    });
    this._process.stderr.on("data", (data) => {
      this._outputChannel.append(data.toString());
    });
    this._process.on("close", (code) => {
      this._isRunning = false;
      vscode3__namespace.commands.executeCommand("setContext", "code-runner.codeRunning", false);
      const endTime = new Date;
      const elapsedTime = (endTime.getTime() - startTime.getTime()) / 1000;
      this._outputChannel.appendLine("");
      if (showExecutionMessage) {
        this._outputChannel.appendLine("[Done] exited with code=" + code + " in " + elapsedTime + " seconds");
        this._outputChannel.appendLine("");
      }
      if (this._isTmpFile) {
        fs__namespace.unlinkSync(this._codeFile);
      }
    });
  }
  sendRunEvent(executor, runFromTerminal) {
    const properties = {
      runFromTerminal: runFromTerminal.toString(),
      runFromExplorer: this._runFromExplorer.toString(),
      isTmpFile: this._isTmpFile.toString()
    };
    this._appInsightsClient.sendEvent(executor, properties);
  }
}

// src/extension.module.ts
function activate(context) {
  const codeManager = new CodeManager;
  vscode3__namespace.window.onDidCloseTerminal(() => {
    codeManager.onDidCloseTerminal();
  });
  const run = vscode3__namespace.commands.registerCommand("code-runner.run", (fileUri) => {
    codeManager.run(undefined, fileUri);
  });
  const runCustomCommand = vscode3__namespace.commands.registerCommand("code-runner.runCustomCommand", () => {
    codeManager.runCustomCommand();
  });
  const runByLanguage = vscode3__namespace.commands.registerCommand("code-runner.runByLanguage", () => {
    codeManager.runByLanguage();
  });
  const stop = vscode3__namespace.commands.registerCommand("code-runner.stop", () => {
    codeManager.stop();
  });
  context.subscriptions.push(run);
  context.subscriptions.push(runCustomCommand);
  context.subscriptions.push(runByLanguage);
  context.subscriptions.push(stop);
  context.subscriptions.push(codeManager);
}
function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
