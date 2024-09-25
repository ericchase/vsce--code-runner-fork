"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const EMPTY_UI8A = new Uint8Array();
class U8StreamReader {
    constructor(reader) {
        this.reader = reader;
        this.done = false;
        this.i = 0;
        this.length = 0;
        this.value = EMPTY_UI8A;
    }
    next() {
        return __awaiter(this, void 0, void 0, function* () {
            const { done, value = EMPTY_UI8A } = yield this.reader.read();
            if (this.done === done && this.value === value) {
                return { changed: false };
            }
            this.done = done;
            this.i = 0;
            this.length = value.length;
            this.value = value;
            return { changed: true };
        });
    }
    releaseLock() {
        this.reader.releaseLock();
    }
}
function U8StreamCompare(stream1, stream2) {
    return __awaiter(this, void 0, void 0, function* () {
        const one = new U8StreamReader(stream1.getReader());
        const two = new U8StreamReader(stream2.getReader());
        try {
            while (true) {
                let changed = false;
                if (one.done === false && one.i >= one.length) {
                    if ((yield one.next()).changed === true) {
                        changed = true;
                    }
                }
                if (two.done === false && two.i >= two.length) {
                    if ((yield two.next()).changed === true) {
                        changed = true;
                    }
                }
                if (one.done && two.done) {
                    return true;
                }
                if (one.done !== two.done || changed === false) {
                    return false;
                }
                while (one.i < one.length && two.i < two.length) {
                    if (one.value[one.i] !== two.value[two.i]) {
                        return false;
                    }
                    one.i++;
                    two.i++;
                }
            }
        }
        finally {
            one.releaseLock();
            two.releaseLock();
        }
    });
}
function CompareFiles(a, b) {
    return U8StreamCompare(a.stream(), b.stream());
}
exports.CompareFiles = CompareFiles;
function CopyFile({ from, to, verify = true }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (from === to) {
            return false;
        }
        const fromFile = Bun.file(from);
        const toFile = Bun.file(to);
        yield Bun.write(toFile, fromFile);
        if (verify === true) {
            return CompareFiles(fromFile, toFile);
        }
        return true;
    });
}
// source files
await CopyFile({ from: './out/src/appInsightsClient.js', to: './build/appInsightsClient.js' });
await CopyFile({ from: './out/src/codeManager.js', to: './build/codeManager.js' });
await CopyFile({ from: './out/src/constants.js', to: './build/constants.js' });
await CopyFile({ from: './out/src/extension.js', to: './build/extension.js' });
await CopyFile({ from: './out/src/utility.js', to: './build/utility.js' });
// supplementary files
await CopyFile({ from: 'LICENSE', to: './build/LICENSE' });
await CopyFile({ from: 'BACKERS.md', to: './build/BACKERS.md' });
await CopyFile({ from: 'CHANGELOG.md', to: './build/CHANGELOG.md' });
await CopyFile({ from: 'README.md', to: './build/README.md' });
//# sourceMappingURL=build.js.map