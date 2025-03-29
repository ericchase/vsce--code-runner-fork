'use strict';

var node_module = require('node:module');
var vscode3 = require('vscode');
var fs = require('fs');
var os = require('os');
var path = require('path');

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
var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var os__namespace = /*#__PURE__*/_interopNamespaceDefault(os);

var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = __defProp(target, "default", { value: mod, enumerable: true }) ;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = /* @__PURE__ */ node_module.createRequire((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('-.js', document.baseURI).href)));

// node_modules/braces/lib/utils.js
var require_utils = __commonJS((exports) => {
  exports.isInteger = (num) => {
    if (typeof num === "number") {
      return Number.isInteger(num);
    }
    if (typeof num === "string" && num.trim() !== "") {
      return Number.isInteger(Number(num));
    }
    return false;
  };
  exports.find = (node, type) => node.nodes.find((node2) => node2.type === type);
  exports.exceedsLimit = (min, max, step = 1, limit) => {
    if (limit === false)
      return false;
    if (!exports.isInteger(min) || !exports.isInteger(max))
      return false;
    return (Number(max) - Number(min)) / Number(step) >= limit;
  };
  exports.escapeNode = (block, n = 0, type) => {
    let node = block.nodes[n];
    if (!node)
      return;
    if (type && node.type === type || node.type === "open" || node.type === "close") {
      if (node.escaped !== true) {
        node.value = "\\" + node.value;
        node.escaped = true;
      }
    }
  };
  exports.encloseBrace = (node) => {
    if (node.type !== "brace")
      return false;
    if (node.commas >> 0 + node.ranges >> 0 === 0) {
      node.invalid = true;
      return true;
    }
    return false;
  };
  exports.isInvalidBrace = (block) => {
    if (block.type !== "brace")
      return false;
    if (block.invalid === true || block.dollar)
      return true;
    if (block.commas >> 0 + block.ranges >> 0 === 0) {
      block.invalid = true;
      return true;
    }
    if (block.open !== true || block.close !== true) {
      block.invalid = true;
      return true;
    }
    return false;
  };
  exports.isOpenOrClose = (node) => {
    if (node.type === "open" || node.type === "close") {
      return true;
    }
    return node.open === true || node.close === true;
  };
  exports.reduce = (nodes) => nodes.reduce((acc, node) => {
    if (node.type === "text")
      acc.push(node.value);
    if (node.type === "range")
      node.type = "text";
    return acc;
  }, []);
  exports.flatten = (...args) => {
    const result = [];
    const flat = (arr) => {
      for (let i = 0;i < arr.length; i++) {
        let ele = arr[i];
        Array.isArray(ele) ? flat(ele) : ele !== undefined && result.push(ele);
      }
      return result;
    };
    flat(args);
    return result;
  };
});

// node_modules/braces/lib/stringify.js
var require_stringify = __commonJS((exports, module) => {
  var utils = require_utils();
  module.exports = (ast, options = {}) => {
    let stringify = (node, parent = {}) => {
      let invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
      let invalidNode = node.invalid === true && options.escapeInvalid === true;
      let output = "";
      if (node.value) {
        if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
          return "\\" + node.value;
        }
        return node.value;
      }
      if (node.value) {
        return node.value;
      }
      if (node.nodes) {
        for (let child of node.nodes) {
          output += stringify(child);
        }
      }
      return output;
    };
    return stringify(ast);
  };
});

// node_modules/is-number/index.js
var require_is_number = __commonJS((exports, module) => {
  /*!
   * is-number <https://github.com/jonschlinkert/is-number>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Released under the MIT License.
   */
  module.exports = function(num) {
    if (typeof num === "number") {
      return num - num === 0;
    }
    if (typeof num === "string" && num.trim() !== "") {
      return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
    }
    return false;
  };
});

// node_modules/to-regex-range/index.js
var require_to_regex_range = __commonJS((exports, module) => {
  /*!
   * to-regex-range <https://github.com/micromatch/to-regex-range>
   *
   * Copyright (c) 2015-present, Jon Schlinkert.
   * Released under the MIT License.
   */
  var isNumber = require_is_number();
  var toRegexRange = (min, max, options) => {
    if (isNumber(min) === false) {
      throw new TypeError("toRegexRange: expected the first argument to be a number");
    }
    if (max === undefined || min === max) {
      return String(min);
    }
    if (isNumber(max) === false) {
      throw new TypeError("toRegexRange: expected the second argument to be a number.");
    }
    let opts = { relaxZeros: true, ...options };
    if (typeof opts.strictZeros === "boolean") {
      opts.relaxZeros = opts.strictZeros === false;
    }
    let relax = String(opts.relaxZeros);
    let shorthand = String(opts.shorthand);
    let capture = String(opts.capture);
    let wrap = String(opts.wrap);
    let cacheKey = min + ":" + max + "=" + relax + shorthand + capture + wrap;
    if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
      return toRegexRange.cache[cacheKey].result;
    }
    let a = Math.min(min, max);
    let b = Math.max(min, max);
    if (Math.abs(a - b) === 1) {
      let result = min + "|" + max;
      if (opts.capture) {
        return `(${result})`;
      }
      if (opts.wrap === false) {
        return result;
      }
      return `(?:${result})`;
    }
    let isPadded = hasPadding(min) || hasPadding(max);
    let state = { min, max, a, b };
    let positives = [];
    let negatives = [];
    if (isPadded) {
      state.isPadded = isPadded;
      state.maxLen = String(state.max).length;
    }
    if (a < 0) {
      let newMin = b < 0 ? Math.abs(b) : 1;
      negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
      a = state.a = 0;
    }
    if (b >= 0) {
      positives = splitToPatterns(a, b, state, opts);
    }
    state.negatives = negatives;
    state.positives = positives;
    state.result = collatePatterns(negatives, positives);
    if (opts.capture === true) {
      state.result = `(${state.result})`;
    } else if (opts.wrap !== false && positives.length + negatives.length > 1) {
      state.result = `(?:${state.result})`;
    }
    toRegexRange.cache[cacheKey] = state;
    return state.result;
  };
  function collatePatterns(neg, pos, options) {
    let onlyNegative = filterPatterns(neg, pos, "-", false) || [];
    let onlyPositive = filterPatterns(pos, neg, "", false) || [];
    let intersected = filterPatterns(neg, pos, "-?", true) || [];
    let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
    return subpatterns.join("|");
  }
  function splitToRanges(min, max) {
    let nines = 1;
    let zeros = 1;
    let stop = countNines(min, nines);
    let stops = new Set([max]);
    while (min <= stop && stop <= max) {
      stops.add(stop);
      nines += 1;
      stop = countNines(min, nines);
    }
    stop = countZeros(max + 1, zeros) - 1;
    while (min < stop && stop <= max) {
      stops.add(stop);
      zeros += 1;
      stop = countZeros(max + 1, zeros) - 1;
    }
    stops = [...stops];
    stops.sort(compare);
    return stops;
  }
  function rangeToPattern(start, stop, options) {
    if (start === stop) {
      return { pattern: start, count: [], digits: 0 };
    }
    let zipped = zip(start, stop);
    let digits = zipped.length;
    let pattern = "";
    let count = 0;
    for (let i = 0;i < digits; i++) {
      let [startDigit, stopDigit] = zipped[i];
      if (startDigit === stopDigit) {
        pattern += startDigit;
      } else if (startDigit !== "0" || stopDigit !== "9") {
        pattern += toCharacterClass(startDigit, stopDigit);
      } else {
        count++;
      }
    }
    if (count) {
      pattern += options.shorthand === true ? "\\d" : "[0-9]";
    }
    return { pattern, count: [count], digits };
  }
  function splitToPatterns(min, max, tok, options) {
    let ranges = splitToRanges(min, max);
    let tokens = [];
    let start = min;
    let prev;
    for (let i = 0;i < ranges.length; i++) {
      let max2 = ranges[i];
      let obj = rangeToPattern(String(start), String(max2), options);
      let zeros = "";
      if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
        if (prev.count.length > 1) {
          prev.count.pop();
        }
        prev.count.push(obj.count[0]);
        prev.string = prev.pattern + toQuantifier(prev.count);
        start = max2 + 1;
        continue;
      }
      if (tok.isPadded) {
        zeros = padZeros(max2, tok, options);
      }
      obj.string = zeros + obj.pattern + toQuantifier(obj.count);
      tokens.push(obj);
      start = max2 + 1;
      prev = obj;
    }
    return tokens;
  }
  function filterPatterns(arr, comparison, prefix, intersection, options) {
    let result = [];
    for (let ele of arr) {
      let { string } = ele;
      if (!intersection && !contains(comparison, "string", string)) {
        result.push(prefix + string);
      }
      if (intersection && contains(comparison, "string", string)) {
        result.push(prefix + string);
      }
    }
    return result;
  }
  function zip(a, b) {
    let arr = [];
    for (let i = 0;i < a.length; i++)
      arr.push([a[i], b[i]]);
    return arr;
  }
  function compare(a, b) {
    return a > b ? 1 : b > a ? -1 : 0;
  }
  function contains(arr, key, val) {
    return arr.some((ele) => ele[key] === val);
  }
  function countNines(min, len) {
    return Number(String(min).slice(0, -len) + "9".repeat(len));
  }
  function countZeros(integer, zeros) {
    return integer - integer % Math.pow(10, zeros);
  }
  function toQuantifier(digits) {
    let [start = 0, stop = ""] = digits;
    if (stop || start > 1) {
      return `{${start + (stop ? "," + stop : "")}}`;
    }
    return "";
  }
  function toCharacterClass(a, b, options) {
    return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
  }
  function hasPadding(str) {
    return /^-?(0+)\d/.test(str);
  }
  function padZeros(value, tok, options) {
    if (!tok.isPadded) {
      return value;
    }
    let diff = Math.abs(tok.maxLen - String(value).length);
    let relax = options.relaxZeros !== false;
    switch (diff) {
      case 0:
        return "";
      case 1:
        return relax ? "0?" : "0";
      case 2:
        return relax ? "0{0,2}" : "00";
      default: {
        return relax ? `0{0,${diff}}` : `0{${diff}}`;
      }
    }
  }
  toRegexRange.cache = {};
  toRegexRange.clearCache = () => toRegexRange.cache = {};
  module.exports = toRegexRange;
});

// node_modules/fill-range/index.js
var require_fill_range = __commonJS((exports, module) => {
  /*!
   * fill-range <https://github.com/jonschlinkert/fill-range>
   *
   * Copyright (c) 2014-present, Jon Schlinkert.
   * Licensed under the MIT License.
   */
  var util = __require("util");
  var toRegexRange = require_to_regex_range();
  var isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  var transform = (toNumber) => {
    return (value) => toNumber === true ? Number(value) : String(value);
  };
  var isValidValue = (value) => {
    return typeof value === "number" || typeof value === "string" && value !== "";
  };
  var isNumber = (num) => Number.isInteger(+num);
  var zeros = (input) => {
    let value = `${input}`;
    let index = -1;
    if (value[0] === "-")
      value = value.slice(1);
    if (value === "0")
      return false;
    while (value[++index] === "0")
      ;
    return index > 0;
  };
  var stringify = (start, end, options) => {
    if (typeof start === "string" || typeof end === "string") {
      return true;
    }
    return options.stringify === true;
  };
  var pad = (input, maxLength, toNumber) => {
    if (maxLength > 0) {
      let dash = input[0] === "-" ? "-" : "";
      if (dash)
        input = input.slice(1);
      input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
    }
    if (toNumber === false) {
      return String(input);
    }
    return input;
  };
  var toMaxLen = (input, maxLength) => {
    let negative = input[0] === "-" ? "-" : "";
    if (negative) {
      input = input.slice(1);
      maxLength--;
    }
    while (input.length < maxLength)
      input = "0" + input;
    return negative ? "-" + input : input;
  };
  var toSequence = (parts, options) => {
    parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    let prefix = options.capture ? "" : "?:";
    let positives = "";
    let negatives = "";
    let result;
    if (parts.positives.length) {
      positives = parts.positives.join("|");
    }
    if (parts.negatives.length) {
      negatives = `-(${prefix}${parts.negatives.join("|")})`;
    }
    if (positives && negatives) {
      result = `${positives}|${negatives}`;
    } else {
      result = positives || negatives;
    }
    if (options.wrap) {
      return `(${prefix}${result})`;
    }
    return result;
  };
  var toRange = (a, b, isNumbers, options) => {
    if (isNumbers) {
      return toRegexRange(a, b, { wrap: false, ...options });
    }
    let start = String.fromCharCode(a);
    if (a === b)
      return start;
    let stop = String.fromCharCode(b);
    return `[${start}-${stop}]`;
  };
  var toRegex = (start, end, options) => {
    if (Array.isArray(start)) {
      let wrap = options.wrap === true;
      let prefix = options.capture ? "" : "?:";
      return wrap ? `(${prefix}${start.join("|")})` : start.join("|");
    }
    return toRegexRange(start, end, options);
  };
  var rangeError = (...args) => {
    return new RangeError("Invalid range arguments: " + util.inspect(...args));
  };
  var invalidRange = (start, end, options) => {
    if (options.strictRanges === true)
      throw rangeError([start, end]);
    return [];
  };
  var invalidStep = (step, options) => {
    if (options.strictRanges === true) {
      throw new TypeError(`Expected step "${step}" to be a number`);
    }
    return [];
  };
  var fillNumbers = (start, end, step = 1, options = {}) => {
    let a = Number(start);
    let b = Number(end);
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      if (options.strictRanges === true)
        throw rangeError([start, end]);
      return [];
    }
    if (a === 0)
      a = 0;
    if (b === 0)
      b = 0;
    let descending = a > b;
    let startString = String(start);
    let endString = String(end);
    let stepString = String(step);
    step = Math.max(Math.abs(step), 1);
    let padded = zeros(startString) || zeros(endString) || zeros(stepString);
    let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
    let toNumber = padded === false && stringify(start, end, options) === false;
    let format = options.transform || transform(toNumber);
    if (options.toRegex && step === 1) {
      return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
    }
    let parts = { negatives: [], positives: [] };
    let push = (num) => parts[num < 0 ? "negatives" : "positives"].push(Math.abs(num));
    let range = [];
    let index = 0;
    while (descending ? a >= b : a <= b) {
      if (options.toRegex === true && step > 1) {
        push(a);
      } else {
        range.push(pad(format(a, index), maxLen, toNumber));
      }
      a = descending ? a - step : a + step;
      index++;
    }
    if (options.toRegex === true) {
      return step > 1 ? toSequence(parts, options) : toRegex(range, null, { wrap: false, ...options });
    }
    return range;
  };
  var fillLetters = (start, end, step = 1, options = {}) => {
    if (!isNumber(start) && start.length > 1 || !isNumber(end) && end.length > 1) {
      return invalidRange(start, end, options);
    }
    let format = options.transform || ((val) => String.fromCharCode(val));
    let a = `${start}`.charCodeAt(0);
    let b = `${end}`.charCodeAt(0);
    let descending = a > b;
    let min = Math.min(a, b);
    let max = Math.max(a, b);
    if (options.toRegex && step === 1) {
      return toRange(min, max, false, options);
    }
    let range = [];
    let index = 0;
    while (descending ? a >= b : a <= b) {
      range.push(format(a, index));
      a = descending ? a - step : a + step;
      index++;
    }
    if (options.toRegex === true) {
      return toRegex(range, null, { wrap: false, options });
    }
    return range;
  };
  var fill = (start, end, step, options = {}) => {
    if (end == null && isValidValue(start)) {
      return [start];
    }
    if (!isValidValue(start) || !isValidValue(end)) {
      return invalidRange(start, end, options);
    }
    if (typeof step === "function") {
      return fill(start, end, 1, { transform: step });
    }
    if (isObject(step)) {
      return fill(start, end, 0, step);
    }
    let opts = { ...options };
    if (opts.capture === true)
      opts.wrap = true;
    step = step || opts.step || 1;
    if (!isNumber(step)) {
      if (step != null && !isObject(step))
        return invalidStep(step, opts);
      return fill(start, end, 1, step);
    }
    if (isNumber(start) && isNumber(end)) {
      return fillNumbers(start, end, step, opts);
    }
    return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
  };
  module.exports = fill;
});

// node_modules/braces/lib/compile.js
var require_compile = __commonJS((exports, module) => {
  var fill = require_fill_range();
  var utils = require_utils();
  var compile = (ast, options = {}) => {
    let walk = (node, parent = {}) => {
      let invalidBlock = utils.isInvalidBrace(parent);
      let invalidNode = node.invalid === true && options.escapeInvalid === true;
      let invalid = invalidBlock === true || invalidNode === true;
      let prefix = options.escapeInvalid === true ? "\\" : "";
      let output = "";
      if (node.isOpen === true) {
        return prefix + node.value;
      }
      if (node.isClose === true) {
        return prefix + node.value;
      }
      if (node.type === "open") {
        return invalid ? prefix + node.value : "(";
      }
      if (node.type === "close") {
        return invalid ? prefix + node.value : ")";
      }
      if (node.type === "comma") {
        return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
      }
      if (node.value) {
        return node.value;
      }
      if (node.nodes && node.ranges > 0) {
        let args = utils.reduce(node.nodes);
        let range = fill(...args, { ...options, wrap: false, toRegex: true });
        if (range.length !== 0) {
          return args.length > 1 && range.length > 1 ? `(${range})` : range;
        }
      }
      if (node.nodes) {
        for (let child of node.nodes) {
          output += walk(child, node);
        }
      }
      return output;
    };
    return walk(ast);
  };
  module.exports = compile;
});

// node_modules/braces/lib/expand.js
var require_expand = __commonJS((exports, module) => {
  var fill = require_fill_range();
  var stringify = require_stringify();
  var utils = require_utils();
  var append = (queue = "", stash = "", enclose = false) => {
    let result = [];
    queue = [].concat(queue);
    stash = [].concat(stash);
    if (!stash.length)
      return queue;
    if (!queue.length) {
      return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
    }
    for (let item of queue) {
      if (Array.isArray(item)) {
        for (let value of item) {
          result.push(append(value, stash, enclose));
        }
      } else {
        for (let ele of stash) {
          if (enclose === true && typeof ele === "string")
            ele = `{${ele}}`;
          result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
        }
      }
    }
    return utils.flatten(result);
  };
  var expand = (ast, options = {}) => {
    let rangeLimit = options.rangeLimit === undefined ? 1000 : options.rangeLimit;
    let walk = (node, parent = {}) => {
      node.queue = [];
      let p = parent;
      let q = parent.queue;
      while (p.type !== "brace" && p.type !== "root" && p.parent) {
        p = p.parent;
        q = p.queue;
      }
      if (node.invalid || node.dollar) {
        q.push(append(q.pop(), stringify(node, options)));
        return;
      }
      if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
        q.push(append(q.pop(), ["{}"]));
        return;
      }
      if (node.nodes && node.ranges > 0) {
        let args = utils.reduce(node.nodes);
        if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
          throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
        }
        let range = fill(...args, options);
        if (range.length === 0) {
          range = stringify(node, options);
        }
        q.push(append(q.pop(), range));
        node.nodes = [];
        return;
      }
      let enclose = utils.encloseBrace(node);
      let queue = node.queue;
      let block = node;
      while (block.type !== "brace" && block.type !== "root" && block.parent) {
        block = block.parent;
        queue = block.queue;
      }
      for (let i = 0;i < node.nodes.length; i++) {
        let child = node.nodes[i];
        if (child.type === "comma" && node.type === "brace") {
          if (i === 1)
            queue.push("");
          queue.push("");
          continue;
        }
        if (child.type === "close") {
          q.push(append(q.pop(), queue, enclose));
          continue;
        }
        if (child.value && child.type !== "open") {
          queue.push(append(queue.pop(), child.value));
          continue;
        }
        if (child.nodes) {
          walk(child, node);
        }
      }
      return queue;
    };
    return utils.flatten(walk(ast));
  };
  module.exports = expand;
});

// node_modules/braces/lib/constants.js
var require_constants = __commonJS((exports, module) => {
  module.exports = {
    MAX_LENGTH: 1024 * 64,
    CHAR_0: "0",
    CHAR_9: "9",
    CHAR_UPPERCASE_A: "A",
    CHAR_LOWERCASE_A: "a",
    CHAR_UPPERCASE_Z: "Z",
    CHAR_LOWERCASE_Z: "z",
    CHAR_LEFT_PARENTHESES: "(",
    CHAR_RIGHT_PARENTHESES: ")",
    CHAR_ASTERISK: "*",
    CHAR_AMPERSAND: "&",
    CHAR_AT: "@",
    CHAR_BACKSLASH: "\\",
    CHAR_BACKTICK: "`",
    CHAR_CARRIAGE_RETURN: "\r",
    CHAR_CIRCUMFLEX_ACCENT: "^",
    CHAR_COLON: ":",
    CHAR_COMMA: ",",
    CHAR_DOLLAR: "$",
    CHAR_DOT: ".",
    CHAR_DOUBLE_QUOTE: '"',
    CHAR_EQUAL: "=",
    CHAR_EXCLAMATION_MARK: "!",
    CHAR_FORM_FEED: "\f",
    CHAR_FORWARD_SLASH: "/",
    CHAR_HASH: "#",
    CHAR_HYPHEN_MINUS: "-",
    CHAR_LEFT_ANGLE_BRACKET: "<",
    CHAR_LEFT_CURLY_BRACE: "{",
    CHAR_LEFT_SQUARE_BRACKET: "[",
    CHAR_LINE_FEED: `
`,
    CHAR_NO_BREAK_SPACE: " ",
    CHAR_PERCENT: "%",
    CHAR_PLUS: "+",
    CHAR_QUESTION_MARK: "?",
    CHAR_RIGHT_ANGLE_BRACKET: ">",
    CHAR_RIGHT_CURLY_BRACE: "}",
    CHAR_RIGHT_SQUARE_BRACKET: "]",
    CHAR_SEMICOLON: ";",
    CHAR_SINGLE_QUOTE: "'",
    CHAR_SPACE: " ",
    CHAR_TAB: "\t",
    CHAR_UNDERSCORE: "_",
    CHAR_VERTICAL_LINE: "|",
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\uFEFF"
  };
});

// node_modules/braces/lib/parse.js
var require_parse = __commonJS((exports, module) => {
  var stringify = require_stringify();
  var {
    MAX_LENGTH,
    CHAR_BACKSLASH,
    CHAR_BACKTICK,
    CHAR_COMMA,
    CHAR_DOT,
    CHAR_LEFT_PARENTHESES,
    CHAR_RIGHT_PARENTHESES,
    CHAR_LEFT_CURLY_BRACE,
    CHAR_RIGHT_CURLY_BRACE,
    CHAR_LEFT_SQUARE_BRACKET,
    CHAR_RIGHT_SQUARE_BRACKET,
    CHAR_DOUBLE_QUOTE,
    CHAR_SINGLE_QUOTE,
    CHAR_NO_BREAK_SPACE,
    CHAR_ZERO_WIDTH_NOBREAK_SPACE
  } = require_constants();
  var parse = (input, options = {}) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected a string");
    }
    let opts = options || {};
    let max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    if (input.length > max) {
      throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
    }
    let ast = { type: "root", input, nodes: [] };
    let stack = [ast];
    let block = ast;
    let prev = ast;
    let brackets = 0;
    let length = input.length;
    let index = 0;
    let depth = 0;
    let value;
    const advance = () => input[index++];
    const push = (node) => {
      if (node.type === "text" && prev.type === "dot") {
        prev.type = "text";
      }
      if (prev && prev.type === "text" && node.type === "text") {
        prev.value += node.value;
        return;
      }
      block.nodes.push(node);
      node.parent = block;
      node.prev = prev;
      prev = node;
      return node;
    };
    push({ type: "bos" });
    while (index < length) {
      block = stack[stack.length - 1];
      value = advance();
      if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
        continue;
      }
      if (value === CHAR_BACKSLASH) {
        push({ type: "text", value: (options.keepEscaping ? value : "") + advance() });
        continue;
      }
      if (value === CHAR_RIGHT_SQUARE_BRACKET) {
        push({ type: "text", value: "\\" + value });
        continue;
      }
      if (value === CHAR_LEFT_SQUARE_BRACKET) {
        brackets++;
        let next;
        while (index < length && (next = advance())) {
          value += next;
          if (next === CHAR_LEFT_SQUARE_BRACKET) {
            brackets++;
            continue;
          }
          if (next === CHAR_BACKSLASH) {
            value += advance();
            continue;
          }
          if (next === CHAR_RIGHT_SQUARE_BRACKET) {
            brackets--;
            if (brackets === 0) {
              break;
            }
          }
        }
        push({ type: "text", value });
        continue;
      }
      if (value === CHAR_LEFT_PARENTHESES) {
        block = push({ type: "paren", nodes: [] });
        stack.push(block);
        push({ type: "text", value });
        continue;
      }
      if (value === CHAR_RIGHT_PARENTHESES) {
        if (block.type !== "paren") {
          push({ type: "text", value });
          continue;
        }
        block = stack.pop();
        push({ type: "text", value });
        block = stack[stack.length - 1];
        continue;
      }
      if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
        let open = value;
        let next;
        if (options.keepQuotes !== true) {
          value = "";
        }
        while (index < length && (next = advance())) {
          if (next === CHAR_BACKSLASH) {
            value += next + advance();
            continue;
          }
          if (next === open) {
            if (options.keepQuotes === true)
              value += next;
            break;
          }
          value += next;
        }
        push({ type: "text", value });
        continue;
      }
      if (value === CHAR_LEFT_CURLY_BRACE) {
        depth++;
        let dollar = prev.value && prev.value.slice(-1) === "$" || block.dollar === true;
        let brace = {
          type: "brace",
          open: true,
          close: false,
          dollar,
          depth,
          commas: 0,
          ranges: 0,
          nodes: []
        };
        block = push(brace);
        stack.push(block);
        push({ type: "open", value });
        continue;
      }
      if (value === CHAR_RIGHT_CURLY_BRACE) {
        if (block.type !== "brace") {
          push({ type: "text", value });
          continue;
        }
        let type = "close";
        block = stack.pop();
        block.close = true;
        push({ type, value });
        depth--;
        block = stack[stack.length - 1];
        continue;
      }
      if (value === CHAR_COMMA && depth > 0) {
        if (block.ranges > 0) {
          block.ranges = 0;
          let open = block.nodes.shift();
          block.nodes = [open, { type: "text", value: stringify(block) }];
        }
        push({ type: "comma", value });
        block.commas++;
        continue;
      }
      if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
        let siblings = block.nodes;
        if (depth === 0 || siblings.length === 0) {
          push({ type: "text", value });
          continue;
        }
        if (prev.type === "dot") {
          block.range = [];
          prev.value += value;
          prev.type = "range";
          if (block.nodes.length !== 3 && block.nodes.length !== 5) {
            block.invalid = true;
            block.ranges = 0;
            prev.type = "text";
            continue;
          }
          block.ranges++;
          block.args = [];
          continue;
        }
        if (prev.type === "range") {
          siblings.pop();
          let before = siblings[siblings.length - 1];
          before.value += prev.value + value;
          prev = before;
          block.ranges--;
          continue;
        }
        push({ type: "dot", value });
        continue;
      }
      push({ type: "text", value });
    }
    do {
      block = stack.pop();
      if (block.type !== "root") {
        block.nodes.forEach((node) => {
          if (!node.nodes) {
            if (node.type === "open")
              node.isOpen = true;
            if (node.type === "close")
              node.isClose = true;
            if (!node.nodes)
              node.type = "text";
            node.invalid = true;
          }
        });
        let parent = stack[stack.length - 1];
        let index2 = parent.nodes.indexOf(block);
        parent.nodes.splice(index2, 1, ...block.nodes);
      }
    } while (stack.length > 0);
    push({ type: "eos" });
    return ast;
  };
  module.exports = parse;
});

// node_modules/braces/index.js
var require_braces = __commonJS((exports, module) => {
  var stringify = require_stringify();
  var compile = require_compile();
  var expand = require_expand();
  var parse = require_parse();
  var braces = (input, options = {}) => {
    let output = [];
    if (Array.isArray(input)) {
      for (let pattern of input) {
        let result = braces.create(pattern, options);
        if (Array.isArray(result)) {
          output.push(...result);
        } else {
          output.push(result);
        }
      }
    } else {
      output = [].concat(braces.create(input, options));
    }
    if (options && options.expand === true && options.nodupes === true) {
      output = [...new Set(output)];
    }
    return output;
  };
  braces.parse = (input, options = {}) => parse(input, options);
  braces.stringify = (input, options = {}) => {
    if (typeof input === "string") {
      return stringify(braces.parse(input, options), options);
    }
    return stringify(input, options);
  };
  braces.compile = (input, options = {}) => {
    if (typeof input === "string") {
      input = braces.parse(input, options);
    }
    return compile(input, options);
  };
  braces.expand = (input, options = {}) => {
    if (typeof input === "string") {
      input = braces.parse(input, options);
    }
    let result = expand(input, options);
    if (options.noempty === true) {
      result = result.filter(Boolean);
    }
    if (options.nodupes === true) {
      result = [...new Set(result)];
    }
    return result;
  };
  braces.create = (input, options = {}) => {
    if (input === "" || input.length < 3) {
      return [input];
    }
    return options.expand !== true ? braces.compile(input, options) : braces.expand(input, options);
  };
  module.exports = braces;
});

// node_modules/picomatch/lib/constants.js
var require_constants2 = __commonJS((exports, module) => {
  var path = __require("path");
  var WIN_SLASH = "\\\\/";
  var WIN_NO_SLASH = `[^${WIN_SLASH}]`;
  var DOT_LITERAL = "\\.";
  var PLUS_LITERAL = "\\+";
  var QMARK_LITERAL = "\\?";
  var SLASH_LITERAL = "\\/";
  var ONE_CHAR = "(?=.)";
  var QMARK = "[^/]";
  var END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
  var START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
  var DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
  var NO_DOT = `(?!${DOT_LITERAL})`;
  var NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
  var NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
  var NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
  var QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
  var STAR = `${QMARK}*?`;
  var POSIX_CHARS = {
    DOT_LITERAL,
    PLUS_LITERAL,
    QMARK_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    QMARK,
    END_ANCHOR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  };
  var WINDOWS_CHARS = {
    ...POSIX_CHARS,
    SLASH_LITERAL: `[${WIN_SLASH}]`,
    QMARK: WIN_NO_SLASH,
    STAR: `${WIN_NO_SLASH}*?`,
    DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
    NO_DOT: `(?!${DOT_LITERAL})`,
    NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
    NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
    NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
    QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
    START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
    END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
  };
  var POSIX_REGEX_SOURCE = {
    alnum: "a-zA-Z0-9",
    alpha: "a-zA-Z",
    ascii: "\\x00-\\x7F",
    blank: " \\t",
    cntrl: "\\x00-\\x1F\\x7F",
    digit: "0-9",
    graph: "\\x21-\\x7E",
    lower: "a-z",
    print: "\\x20-\\x7E ",
    punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
    space: " \\t\\r\\n\\v\\f",
    upper: "A-Z",
    word: "A-Za-z0-9_",
    xdigit: "A-Fa-f0-9"
  };
  module.exports = {
    MAX_LENGTH: 1024 * 64,
    POSIX_REGEX_SOURCE,
    REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
    REGEX_NON_SPECIAL_CHAR: /^[^@![\].,$*+?^{}()|\\/]+/,
    REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
    REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
    REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
    REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
    REPLACEMENTS: {
      "***": "*",
      "**/**": "**",
      "**/**/**": "**"
    },
    CHAR_0: 48,
    CHAR_9: 57,
    CHAR_UPPERCASE_A: 65,
    CHAR_LOWERCASE_A: 97,
    CHAR_UPPERCASE_Z: 90,
    CHAR_LOWERCASE_Z: 122,
    CHAR_LEFT_PARENTHESES: 40,
    CHAR_RIGHT_PARENTHESES: 41,
    CHAR_ASTERISK: 42,
    CHAR_AMPERSAND: 38,
    CHAR_AT: 64,
    CHAR_BACKWARD_SLASH: 92,
    CHAR_CARRIAGE_RETURN: 13,
    CHAR_CIRCUMFLEX_ACCENT: 94,
    CHAR_COLON: 58,
    CHAR_COMMA: 44,
    CHAR_DOT: 46,
    CHAR_DOUBLE_QUOTE: 34,
    CHAR_EQUAL: 61,
    CHAR_EXCLAMATION_MARK: 33,
    CHAR_FORM_FEED: 12,
    CHAR_FORWARD_SLASH: 47,
    CHAR_GRAVE_ACCENT: 96,
    CHAR_HASH: 35,
    CHAR_HYPHEN_MINUS: 45,
    CHAR_LEFT_ANGLE_BRACKET: 60,
    CHAR_LEFT_CURLY_BRACE: 123,
    CHAR_LEFT_SQUARE_BRACKET: 91,
    CHAR_LINE_FEED: 10,
    CHAR_NO_BREAK_SPACE: 160,
    CHAR_PERCENT: 37,
    CHAR_PLUS: 43,
    CHAR_QUESTION_MARK: 63,
    CHAR_RIGHT_ANGLE_BRACKET: 62,
    CHAR_RIGHT_CURLY_BRACE: 125,
    CHAR_RIGHT_SQUARE_BRACKET: 93,
    CHAR_SEMICOLON: 59,
    CHAR_SINGLE_QUOTE: 39,
    CHAR_SPACE: 32,
    CHAR_TAB: 9,
    CHAR_UNDERSCORE: 95,
    CHAR_VERTICAL_LINE: 124,
    CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
    SEP: path.sep,
    extglobChars(chars) {
      return {
        "!": { type: "negate", open: "(?:(?!(?:", close: `))${chars.STAR})` },
        "?": { type: "qmark", open: "(?:", close: ")?" },
        "+": { type: "plus", open: "(?:", close: ")+" },
        "*": { type: "star", open: "(?:", close: ")*" },
        "@": { type: "at", open: "(?:", close: ")" }
      };
    },
    globChars(win32) {
      return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
    }
  };
});

// node_modules/picomatch/lib/utils.js
var require_utils2 = __commonJS((exports) => {
  var path = __require("path");
  var win32 = process.platform === "win32";
  var {
    REGEX_SPECIAL_CHARS,
    REGEX_SPECIAL_CHARS_GLOBAL,
    REGEX_REMOVE_BACKSLASH
  } = require_constants2();
  exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
  exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
  exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
  exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
  exports.toPosixSlashes = (str) => str.replace(/\\/g, "/");
  exports.removeBackslashes = (str) => {
    return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
      return match === "\\" ? "" : match;
    });
  };
  exports.supportsLookbehinds = () => {
    let segs = process.version.slice(1).split(".");
    if (segs.length === 3 && +segs[0] >= 9 || +segs[0] === 8 && +segs[1] >= 10) {
      return true;
    }
    return false;
  };
  exports.isWindows = (options) => {
    if (options && typeof options.windows === "boolean") {
      return options.windows;
    }
    return win32 === true || path.sep === "\\";
  };
  exports.escapeLast = (input, char, lastIdx) => {
    let idx = input.lastIndexOf(char, lastIdx);
    if (idx === -1)
      return input;
    if (input[idx - 1] === "\\")
      return exports.escapeLast(input, char, idx - 1);
    return input.slice(0, idx) + "\\" + input.slice(idx);
  };
});

// node_modules/picomatch/lib/scan.js
var require_scan = __commonJS((exports, module) => {
  var utils = require_utils2();
  var {
    CHAR_ASTERISK,
    CHAR_AT,
    CHAR_BACKWARD_SLASH,
    CHAR_COMMA,
    CHAR_DOT,
    CHAR_EXCLAMATION_MARK,
    CHAR_FORWARD_SLASH,
    CHAR_LEFT_CURLY_BRACE,
    CHAR_LEFT_PARENTHESES,
    CHAR_LEFT_SQUARE_BRACKET,
    CHAR_PLUS,
    CHAR_QUESTION_MARK,
    CHAR_RIGHT_CURLY_BRACE,
    CHAR_RIGHT_PARENTHESES,
    CHAR_RIGHT_SQUARE_BRACKET
  } = require_constants2();
  var isPathSeparator = (code) => {
    return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
  };
  module.exports = (input, options) => {
    let opts = options || {};
    let length = input.length - 1;
    let index = -1;
    let start = 0;
    let lastIndex = 0;
    let isGlob = false;
    let backslashes = false;
    let negated = false;
    let braces = 0;
    let prev;
    let code;
    let braceEscaped = false;
    let eos = () => index >= length;
    let advance = () => {
      prev = code;
      return input.charCodeAt(++index);
    };
    while (index < length) {
      code = advance();
      let next;
      if (code === CHAR_BACKWARD_SLASH) {
        backslashes = true;
        next = advance();
        if (next === CHAR_LEFT_CURLY_BRACE) {
          braceEscaped = true;
        }
        continue;
      }
      if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
        braces++;
        while (!eos() && (next = advance())) {
          if (next === CHAR_BACKWARD_SLASH) {
            backslashes = true;
            next = advance();
            continue;
          }
          if (next === CHAR_LEFT_CURLY_BRACE) {
            braces++;
            continue;
          }
          if (!braceEscaped && next === CHAR_DOT && (next = advance()) === CHAR_DOT) {
            isGlob = true;
            break;
          }
          if (!braceEscaped && next === CHAR_COMMA) {
            isGlob = true;
            break;
          }
          if (next === CHAR_RIGHT_CURLY_BRACE) {
            braces--;
            if (braces === 0) {
              braceEscaped = false;
              break;
            }
          }
        }
      }
      if (code === CHAR_FORWARD_SLASH) {
        if (prev === CHAR_DOT && index === start + 1) {
          start += 2;
          continue;
        }
        lastIndex = index + 1;
        continue;
      }
      if (code === CHAR_ASTERISK) {
        isGlob = true;
        break;
      }
      if (code === CHAR_ASTERISK || code === CHAR_QUESTION_MARK) {
        isGlob = true;
        break;
      }
      if (code === CHAR_LEFT_SQUARE_BRACKET) {
        while (!eos() && (next = advance())) {
          if (next === CHAR_BACKWARD_SLASH) {
            backslashes = true;
            next = advance();
            continue;
          }
          if (next === CHAR_RIGHT_SQUARE_BRACKET) {
            isGlob = true;
            break;
          }
        }
      }
      let isExtglobChar = code === CHAR_PLUS || code === CHAR_AT || code === CHAR_EXCLAMATION_MARK;
      if (isExtglobChar && input.charCodeAt(index + 1) === CHAR_LEFT_PARENTHESES) {
        isGlob = true;
        break;
      }
      if (code === CHAR_EXCLAMATION_MARK && index === start) {
        negated = true;
        start++;
        continue;
      }
      if (code === CHAR_LEFT_PARENTHESES) {
        while (!eos() && (next = advance())) {
          if (next === CHAR_BACKWARD_SLASH) {
            backslashes = true;
            next = advance();
            continue;
          }
          if (next === CHAR_RIGHT_PARENTHESES) {
            isGlob = true;
            break;
          }
        }
      }
      if (isGlob) {
        break;
      }
    }
    let prefix = "";
    let orig = input;
    let base = input;
    let glob = "";
    if (start > 0) {
      prefix = input.slice(0, start);
      input = input.slice(start);
      lastIndex -= start;
    }
    if (base && isGlob === true && lastIndex > 0) {
      base = input.slice(0, lastIndex);
      glob = input.slice(lastIndex);
    } else if (isGlob === true) {
      base = "";
      glob = input;
    } else {
      base = input;
    }
    if (base && base !== "" && base !== "/" && base !== input) {
      if (isPathSeparator(base.charCodeAt(base.length - 1))) {
        base = base.slice(0, -1);
      }
    }
    if (opts.unescape === true) {
      if (glob)
        glob = utils.removeBackslashes(glob);
      if (base && backslashes === true) {
        base = utils.removeBackslashes(base);
      }
    }
    return { prefix, input: orig, base, glob, negated, isGlob };
  };
});

// node_modules/picomatch/lib/parse.js
var require_parse2 = __commonJS((exports, module) => {
  var utils = require_utils2();
  var constants = require_constants2();
  var {
    MAX_LENGTH,
    POSIX_REGEX_SOURCE,
    REGEX_NON_SPECIAL_CHAR,
    REGEX_SPECIAL_CHARS_BACKREF,
    REPLACEMENTS
  } = constants;
  var expandRange = (args, options) => {
    if (typeof options.expandRange === "function") {
      return options.expandRange(...args, options);
    }
    args.sort();
    let value = `[${args.join("-")}]`;
    try {
      new RegExp(value);
    } catch (ex) {
      return args.map((v) => utils.escapeRegex(v)).join("..");
    }
    return value;
  };
  var negate = (state) => {
    let count = 1;
    while (state.peek() === "!" && (state.peek(2) !== "(" || state.peek(3) === "?")) {
      state.advance();
      state.start++;
      count++;
    }
    if (count % 2 === 0) {
      return false;
    }
    state.negated = true;
    state.start++;
    return true;
  };
  var syntaxError = (type, char) => {
    return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
  };
  var parse = (input, options) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected a string");
    }
    input = REPLACEMENTS[input] || input;
    let opts = { ...options };
    let max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    let len = input.length;
    if (len > max) {
      throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    }
    let bos = { type: "bos", value: "", output: opts.prepend || "" };
    let tokens = [bos];
    let capture = opts.capture ? "" : "?:";
    let win32 = utils.isWindows(options);
    const PLATFORM_CHARS = constants.globChars(win32);
    const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);
    const {
      DOT_LITERAL,
      PLUS_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR
    } = PLATFORM_CHARS;
    const globstar = (opts2) => {
      return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    };
    let nodot = opts.dot ? "" : NO_DOT;
    let star = opts.bash === true ? globstar(opts) : STAR;
    let qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
    if (opts.capture) {
      star = `(${star})`;
    }
    if (typeof opts.noext === "boolean") {
      opts.noextglob = opts.noext;
    }
    let state = {
      index: -1,
      start: 0,
      consumed: "",
      output: "",
      backtrack: false,
      brackets: 0,
      braces: 0,
      parens: 0,
      quotes: 0,
      tokens
    };
    let extglobs = [];
    let stack = [];
    let prev = bos;
    let value;
    const eos = () => state.index === len - 1;
    const peek = state.peek = (n = 1) => input[state.index + n];
    const advance = state.advance = () => input[++state.index];
    const append = (token) => {
      state.output += token.output != null ? token.output : token.value;
      state.consumed += token.value || "";
    };
    const increment = (type) => {
      state[type]++;
      stack.push(type);
    };
    const decrement = (type) => {
      state[type]--;
      stack.pop();
    };
    const push = (tok) => {
      if (prev.type === "globstar") {
        let isBrace = state.braces > 0 && (tok.type === "comma" || tok.type === "brace");
        let isExtglob = extglobs.length && (tok.type === "pipe" || tok.type === "paren");
        if (tok.type !== "slash" && tok.type !== "paren" && !isBrace && !isExtglob) {
          state.output = state.output.slice(0, -prev.output.length);
          prev.type = "star";
          prev.value = "*";
          prev.output = star;
          state.output += prev.output;
        }
      }
      if (extglobs.length && tok.type !== "paren" && !EXTGLOB_CHARS[tok.value]) {
        extglobs[extglobs.length - 1].inner += tok.value;
      }
      if (tok.value || tok.output)
        append(tok);
      if (prev && prev.type === "text" && tok.type === "text") {
        prev.value += tok.value;
        return;
      }
      tok.prev = prev;
      tokens.push(tok);
      prev = tok;
    };
    const extglobOpen = (type, value2) => {
      let token = { ...EXTGLOB_CHARS[value2], conditions: 1, inner: "" };
      token.prev = prev;
      token.parens = state.parens;
      token.output = state.output;
      let output = (opts.capture ? "(" : "") + token.open;
      push({ type, value: value2, output: state.output ? "" : ONE_CHAR });
      push({ type: "paren", extglob: true, value: advance(), output });
      increment("parens");
      extglobs.push(token);
    };
    const extglobClose = (token) => {
      let output = token.close + (opts.capture ? ")" : "");
      if (token.type === "negate") {
        let extglobStar = star;
        if (token.inner && token.inner.length > 1 && token.inner.includes("/")) {
          extglobStar = globstar(opts);
        }
        if (extglobStar !== star || eos() || /^\)+$/.test(input.slice(state.index + 1))) {
          output = token.close = ")$))" + extglobStar;
        }
        if (token.prev.type === "bos" && eos()) {
          state.negatedExtglob = true;
        }
      }
      push({ type: "paren", extglob: true, value, output });
      decrement("parens");
    };
    if (opts.fastpaths !== false && !/(^[*!]|[/{[()\]}"])/.test(input)) {
      let backslashes = false;
      let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
        if (first === "\\") {
          backslashes = true;
          return m;
        }
        if (first === "?") {
          if (esc) {
            return esc + first + (rest ? QMARK.repeat(rest.length) : "");
          }
          if (index === 0) {
            return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : "");
          }
          return QMARK.repeat(chars.length);
        }
        if (first === ".") {
          return DOT_LITERAL.repeat(chars.length);
        }
        if (first === "*") {
          if (esc) {
            return esc + first + (rest ? star : "");
          }
          return star;
        }
        return esc ? m : "\\" + m;
      });
      if (backslashes === true) {
        if (opts.unescape === true) {
          output = output.replace(/\\/g, "");
        } else {
          output = output.replace(/\\+/g, (m) => {
            return m.length % 2 === 0 ? "\\\\" : m ? "\\" : "";
          });
        }
      }
      state.output = output;
      return state;
    }
    while (!eos()) {
      value = advance();
      if (value === "\x00") {
        continue;
      }
      if (value === "\\") {
        let next = peek();
        if (next === "/" && opts.bash !== true) {
          continue;
        }
        if (next === "." || next === ";") {
          continue;
        }
        if (!next) {
          value += "\\";
          push({ type: "text", value });
          continue;
        }
        let match = /^\\+/.exec(input.slice(state.index + 1));
        let slashes = 0;
        if (match && match[0].length > 2) {
          slashes = match[0].length;
          state.index += slashes;
          if (slashes % 2 !== 0) {
            value += "\\";
          }
        }
        if (opts.unescape === true) {
          value = advance() || "";
        } else {
          value += advance() || "";
        }
        if (state.brackets === 0) {
          push({ type: "text", value });
          continue;
        }
      }
      if (state.brackets > 0 && (value !== "]" || prev.value === "[" || prev.value === "[^")) {
        if (opts.posix !== false && value === ":") {
          let inner = prev.value.slice(1);
          if (inner.includes("[")) {
            prev.posix = true;
            if (inner.includes(":")) {
              let idx = prev.value.lastIndexOf("[");
              let pre = prev.value.slice(0, idx);
              let rest = prev.value.slice(idx + 2);
              let posix = POSIX_REGEX_SOURCE[rest];
              if (posix) {
                prev.value = pre + posix;
                state.backtrack = true;
                advance();
                if (!bos.output && tokens.indexOf(prev) === 1) {
                  bos.output = ONE_CHAR;
                }
                continue;
              }
            }
          }
        }
        if (value === "[" && peek() !== ":" || value === "-" && peek() === "]") {
          value = "\\" + value;
        }
        if (value === "]" && (prev.value === "[" || prev.value === "[^")) {
          value = "\\" + value;
        }
        if (opts.posix === true && value === "!" && prev.value === "[") {
          value = "^";
        }
        prev.value += value;
        append({ value });
        continue;
      }
      if (state.quotes === 1 && value !== '"') {
        value = utils.escapeRegex(value);
        prev.value += value;
        append({ value });
        continue;
      }
      if (value === '"') {
        state.quotes = state.quotes === 1 ? 0 : 1;
        if (opts.keepQuotes === true) {
          push({ type: "text", value });
        }
        continue;
      }
      if (value === "(") {
        push({ type: "paren", value });
        increment("parens");
        continue;
      }
      if (value === ")") {
        if (state.parens === 0 && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError("opening", "("));
        }
        let extglob = extglobs[extglobs.length - 1];
        if (extglob && state.parens === extglob.parens + 1) {
          extglobClose(extglobs.pop());
          continue;
        }
        push({ type: "paren", value, output: state.parens ? ")" : "\\)" });
        decrement("parens");
        continue;
      }
      if (value === "[") {
        if (opts.nobracket === true || !input.slice(state.index + 1).includes("]")) {
          if (opts.nobracket !== true && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("closing", "]"));
          }
          value = "\\" + value;
        } else {
          increment("brackets");
        }
        push({ type: "bracket", value });
        continue;
      }
      if (value === "]") {
        if (opts.nobracket === true || prev && prev.type === "bracket" && prev.value.length === 1) {
          push({ type: "text", value, output: "\\" + value });
          continue;
        }
        if (state.brackets === 0) {
          if (opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError("opening", "["));
          }
          push({ type: "text", value, output: "\\" + value });
          continue;
        }
        decrement("brackets");
        let prevValue = prev.value.slice(1);
        if (prev.posix !== true && prevValue[0] === "^" && !prevValue.includes("/")) {
          value = "/" + value;
        }
        prev.value += value;
        append({ value });
        if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
          continue;
        }
        let escaped = utils.escapeRegex(prev.value);
        state.output = state.output.slice(0, -prev.value.length);
        if (opts.literalBrackets === true) {
          state.output += escaped;
          prev.value = escaped;
          continue;
        }
        prev.value = `(${capture}${escaped}|${prev.value})`;
        state.output += prev.value;
        continue;
      }
      if (value === "{" && opts.nobrace !== true) {
        push({ type: "brace", value, output: "(" });
        increment("braces");
        continue;
      }
      if (value === "}") {
        if (opts.nobrace === true || state.braces === 0) {
          push({ type: "text", value, output: "\\" + value });
          continue;
        }
        let output = ")";
        if (state.dots === true) {
          let arr = tokens.slice();
          let range = [];
          for (let i = arr.length - 1;i >= 0; i--) {
            tokens.pop();
            if (arr[i].type === "brace") {
              break;
            }
            if (arr[i].type !== "dots") {
              range.unshift(arr[i].value);
            }
          }
          output = expandRange(range, opts);
          state.backtrack = true;
        }
        push({ type: "brace", value, output });
        decrement("braces");
        continue;
      }
      if (value === "|") {
        if (extglobs.length > 0) {
          extglobs[extglobs.length - 1].conditions++;
        }
        push({ type: "text", value });
        continue;
      }
      if (value === ",") {
        let output = value;
        if (state.braces > 0 && stack[stack.length - 1] === "braces") {
          output = "|";
        }
        push({ type: "comma", value, output });
        continue;
      }
      if (value === "/") {
        if (prev.type === "dot" && state.index === 1) {
          state.start = state.index + 1;
          state.consumed = "";
          state.output = "";
          tokens.pop();
          prev = bos;
          continue;
        }
        push({ type: "slash", value, output: SLASH_LITERAL });
        continue;
      }
      if (value === ".") {
        if (state.braces > 0 && prev.type === "dot") {
          if (prev.value === ".")
            prev.output = DOT_LITERAL;
          prev.type = "dots";
          prev.output += value;
          prev.value += value;
          state.dots = true;
          continue;
        }
        push({ type: "dot", value, output: DOT_LITERAL });
        continue;
      }
      if (value === "?") {
        if (prev && prev.type === "paren") {
          let next = peek();
          let output = value;
          if (next === "<" && !utils.supportsLookbehinds()) {
            throw new Error("Node.js v10 or higher is required for regex lookbehinds");
          }
          if (prev.value === "(" && !/[!=<:]/.test(next) || next === "<" && !/[!=]/.test(peek(2))) {
            output = "\\" + value;
          }
          push({ type: "text", value, output });
          continue;
        }
        if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          extglobOpen("qmark", value);
          continue;
        }
        if (opts.dot !== true && (prev.type === "slash" || prev.type === "bos")) {
          push({ type: "qmark", value, output: QMARK_NO_DOT });
          continue;
        }
        push({ type: "qmark", value, output: QMARK });
        continue;
      }
      if (value === "!") {
        if (opts.noextglob !== true && peek() === "(") {
          if (peek(2) !== "?" || !/[!=<:]/.test(peek(3))) {
            extglobOpen("negate", value);
            continue;
          }
        }
        if (opts.nonegate !== true && state.index === 0) {
          negate(state);
          continue;
        }
      }
      if (value === "+") {
        if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          extglobOpen("plus", value);
          continue;
        }
        if (prev && (prev.type === "bracket" || prev.type === "paren" || prev.type === "brace")) {
          let output = prev.extglob === true ? "\\" + value : value;
          push({ type: "plus", value, output });
          continue;
        }
        if (state.parens > 0 && opts.regex !== false) {
          push({ type: "plus", value });
          continue;
        }
        push({ type: "plus", value: PLUS_LITERAL });
        continue;
      }
      if (value === "@") {
        if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
          push({ type: "at", value, output: "" });
          continue;
        }
        push({ type: "text", value });
        continue;
      }
      if (value !== "*") {
        if (value === "$" || value === "^") {
          value = "\\" + value;
        }
        let match = REGEX_NON_SPECIAL_CHAR.exec(input.slice(state.index + 1));
        if (match) {
          value += match[0];
          state.index += match[0].length;
        }
        push({ type: "text", value });
        continue;
      }
      if (prev && (prev.type === "globstar" || prev.star === true)) {
        prev.type = "star";
        prev.star = true;
        prev.value += value;
        prev.output = star;
        state.backtrack = true;
        state.consumed += value;
        continue;
      }
      if (opts.noextglob !== true && peek() === "(" && peek(2) !== "?") {
        extglobOpen("star", value);
        continue;
      }
      if (prev.type === "star") {
        if (opts.noglobstar === true) {
          state.consumed += value;
          continue;
        }
        let prior = prev.prev;
        let before = prior.prev;
        let isStart = prior.type === "slash" || prior.type === "bos";
        let afterStar = before && (before.type === "star" || before.type === "globstar");
        if (opts.bash === true && (!isStart || !eos() && peek() !== "/")) {
          push({ type: "star", value, output: "" });
          continue;
        }
        let isBrace = state.braces > 0 && (prior.type === "comma" || prior.type === "brace");
        let isExtglob = extglobs.length && (prior.type === "pipe" || prior.type === "paren");
        if (!isStart && prior.type !== "paren" && !isBrace && !isExtglob) {
          push({ type: "star", value, output: "" });
          continue;
        }
        while (input.slice(state.index + 1, state.index + 4) === "/**") {
          let after = input[state.index + 4];
          if (after && after !== "/") {
            break;
          }
          state.consumed += "/**";
          state.index += 3;
        }
        if (prior.type === "bos" && eos()) {
          prev.type = "globstar";
          prev.value += value;
          prev.output = globstar(opts);
          state.output = prev.output;
          state.consumed += value;
          continue;
        }
        if (prior.type === "slash" && prior.prev.type !== "bos" && !afterStar && eos()) {
          state.output = state.output.slice(0, -(prior.output + prev.output).length);
          prior.output = "(?:" + prior.output;
          prev.type = "globstar";
          prev.output = globstar(opts) + "|$)";
          prev.value += value;
          state.output += prior.output + prev.output;
          state.consumed += value;
          continue;
        }
        let next = peek();
        if (prior.type === "slash" && prior.prev.type !== "bos" && next === "/") {
          let end = peek(2) !== undefined ? "|$" : "";
          state.output = state.output.slice(0, -(prior.output + prev.output).length);
          prior.output = "(?:" + prior.output;
          prev.type = "globstar";
          prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
          prev.value += value;
          state.output += prior.output + prev.output;
          state.consumed += value + advance();
          push({ type: "slash", value, output: "" });
          continue;
        }
        if (prior.type === "bos" && next === "/") {
          prev.type = "globstar";
          prev.value += value;
          prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
          state.output = prev.output;
          state.consumed += value + advance();
          push({ type: "slash", value, output: "" });
          continue;
        }
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = "globstar";
        prev.output = globstar(opts);
        prev.value += value;
        state.output += prev.output;
        state.consumed += value;
        continue;
      }
      let token = { type: "star", value, output: star };
      if (opts.bash === true) {
        token.output = ".*?";
        if (prev.type === "bos" || prev.type === "slash") {
          token.output = nodot + token.output;
        }
        push(token);
        continue;
      }
      if (prev && (prev.type === "bracket" || prev.type === "paren") && opts.regex === true) {
        token.output = value;
        push(token);
        continue;
      }
      if (state.index === state.start || prev.type === "slash" || prev.type === "dot") {
        if (prev.type === "dot") {
          state.output += NO_DOT_SLASH;
          prev.output += NO_DOT_SLASH;
        } else if (opts.dot === true) {
          state.output += NO_DOTS_SLASH;
          prev.output += NO_DOTS_SLASH;
        } else {
          state.output += nodot;
          prev.output += nodot;
        }
        if (peek() !== "*") {
          state.output += ONE_CHAR;
          prev.output += ONE_CHAR;
        }
      }
      push(token);
    }
    while (state.brackets > 0) {
      if (opts.strictBrackets === true)
        throw new SyntaxError(syntaxError("closing", "]"));
      state.output = utils.escapeLast(state.output, "[");
      decrement("brackets");
    }
    while (state.parens > 0) {
      if (opts.strictBrackets === true)
        throw new SyntaxError(syntaxError("closing", ")"));
      state.output = utils.escapeLast(state.output, "(");
      decrement("parens");
    }
    while (state.braces > 0) {
      if (opts.strictBrackets === true)
        throw new SyntaxError(syntaxError("closing", "}"));
      state.output = utils.escapeLast(state.output, "{");
      decrement("braces");
    }
    if (opts.strictSlashes !== true && (prev.type === "star" || prev.type === "bracket")) {
      push({ type: "maybe_slash", value: "", output: `${SLASH_LITERAL}?` });
    }
    if (state.backtrack === true) {
      state.output = "";
      for (let token of state.tokens) {
        state.output += token.output != null ? token.output : token.value;
        if (token.suffix) {
          state.output += token.suffix;
        }
      }
    }
    return state;
  };
  parse.fastpaths = (input, options) => {
    let opts = { ...options };
    let max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
    let len = input.length;
    if (len > max) {
      throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
    }
    input = REPLACEMENTS[input] || input;
    let win32 = utils.isWindows(options);
    const {
      DOT_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOTS_SLASH,
      STAR,
      START_ANCHOR
    } = constants.globChars(win32);
    let capture = opts.capture ? "" : "?:";
    let star = opts.bash === true ? ".*?" : STAR;
    let nodot = opts.dot ? NO_DOTS : NO_DOT;
    let slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
    if (opts.capture) {
      star = `(${star})`;
    }
    const globstar = (opts2) => {
      return `(${capture}(?:(?!${START_ANCHOR}${opts2.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
    };
    const create = (str) => {
      switch (str) {
        case "*":
          return `${nodot}${ONE_CHAR}${star}`;
        case ".*":
          return `${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "*.*":
          return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "*/*":
          return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
        case "**":
          return nodot + globstar(opts);
        case "**/*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
        case "**/*.*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
        case "**/.*":
          return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
        default: {
          let match = /^(.*?)\.(\w+)$/.exec(str);
          if (!match)
            return;
          let source = create(match[1]);
          if (!source)
            return;
          return source + DOT_LITERAL + match[2];
        }
      }
    };
    let output = create(input);
    if (output && opts.strictSlashes !== true) {
      output += `${SLASH_LITERAL}?`;
    }
    return output;
  };
  module.exports = parse;
});

// node_modules/picomatch/lib/picomatch.js
var require_picomatch = __commonJS((exports, module) => {
  var path = __require("path");
  var scan = require_scan();
  var parse = require_parse2();
  var utils = require_utils2();
  var picomatch = (glob, options, returnState = false) => {
    if (Array.isArray(glob)) {
      let fns = glob.map((input) => picomatch(input, options, returnState));
      return (str) => {
        for (let isMatch of fns) {
          let state2 = isMatch(str);
          if (state2)
            return state2;
        }
        return false;
      };
    }
    if (typeof glob !== "string" || glob === "") {
      throw new TypeError("Expected pattern to be a non-empty string");
    }
    let opts = options || {};
    let posix = utils.isWindows(options);
    let regex = picomatch.makeRe(glob, options, false, true);
    let state = regex.state;
    delete regex.state;
    let isIgnored = () => false;
    if (opts.ignore) {
      let ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
      isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
    }
    const matcher = (input, returnObject = false) => {
      let { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
      let result = { glob, state, regex, posix, input, output, match, isMatch };
      if (typeof opts.onResult === "function") {
        opts.onResult(result);
      }
      if (isMatch === false) {
        result.isMatch = false;
        return returnObject ? result : false;
      }
      if (isIgnored(input)) {
        if (typeof opts.onIgnore === "function") {
          opts.onIgnore(result);
        }
        result.isMatch = false;
        return returnObject ? result : false;
      }
      if (typeof opts.onMatch === "function") {
        opts.onMatch(result);
      }
      return returnObject ? result : true;
    };
    if (returnState) {
      matcher.state = state;
    }
    return matcher;
  };
  picomatch.test = (input, regex, options, { glob, posix } = {}) => {
    if (typeof input !== "string") {
      throw new TypeError("Expected input to be a string");
    }
    if (input === "") {
      return { isMatch: false, output: "" };
    }
    let opts = options || {};
    let format = opts.format || (posix ? utils.toPosixSlashes : null);
    let match = input === glob;
    let output = match && format ? format(input) : input;
    if (match === false) {
      output = format ? format(input) : input;
      match = output === glob;
    }
    if (match === false || opts.capture === true) {
      if (opts.matchBase === true || opts.basename === true) {
        match = picomatch.matchBase(input, regex, options, posix);
      } else {
        match = regex.exec(output);
      }
    }
    return { isMatch: !!match, match, output };
  };
  picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
    let regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
    return regex.test(path.basename(input));
  };
  picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
  picomatch.parse = (glob, options) => parse(glob, options);
  picomatch.scan = (input, options) => scan(input, options);
  picomatch.makeRe = (input, options, returnOutput = false, returnState = false) => {
    if (!input || typeof input !== "string") {
      throw new TypeError("Expected a non-empty string");
    }
    let opts = options || {};
    let prepend = opts.contains ? "" : "^";
    let append = opts.contains ? "" : "$";
    let state = { negated: false, fastpaths: true };
    let prefix = "";
    let output;
    if (input.startsWith("./")) {
      input = input.slice(2);
      prefix = state.prefix = "./";
    }
    if (opts.fastpaths !== false && (input[0] === "." || input[0] === "*")) {
      output = parse.fastpaths(input, options);
    }
    if (output === undefined) {
      state = picomatch.parse(input, options);
      state.prefix = prefix + (state.prefix || "");
      output = state.output;
    }
    if (returnOutput === true) {
      return output;
    }
    let source = `${prepend}(?:${output})${append}`;
    if (state && state.negated === true) {
      source = `^(?!${source}).*$`;
    }
    let regex = picomatch.toRegex(source, options);
    if (returnState === true) {
      regex.state = state;
    }
    return regex;
  };
  picomatch.toRegex = (source, options) => {
    try {
      let opts = options || {};
      return new RegExp(source, opts.flags || (opts.nocase ? "i" : ""));
    } catch (err) {
      if (options && options.debug === true)
        throw err;
      return /$^/;
    }
  };
  picomatch.constants = require_constants2();
  module.exports = picomatch;
});

// node_modules/micromatch/index.js
var require_micromatch = __commonJS((exports, module) => {
  var util = __require("util");
  var braces = require_braces();
  var picomatch = require_picomatch();
  var utils = require_utils2();
  var isEmptyString = (val) => typeof val === "string" && (val === "" || val === "./");
  var micromatch = (list, patterns, options) => {
    patterns = [].concat(patterns);
    list = [].concat(list);
    let omit = new Set;
    let keep = new Set;
    let items = new Set;
    let negatives = 0;
    let onResult = (state) => {
      items.add(state.output);
      if (options && options.onResult) {
        options.onResult(state);
      }
    };
    for (let i = 0;i < patterns.length; i++) {
      let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
      let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
      if (negated)
        negatives++;
      for (let item of list) {
        let matched = isMatch(item, true);
        let match = negated ? !matched.isMatch : matched.isMatch;
        if (!match)
          continue;
        if (negated) {
          omit.add(matched.output);
        } else {
          omit.delete(matched.output);
          keep.add(matched.output);
        }
      }
    }
    let result = negatives === patterns.length ? [...items] : [...keep];
    let matches = result.filter((item) => !omit.has(item));
    if (options && matches.length === 0) {
      if (options.failglob === true) {
        throw new Error(`No matches found for "${patterns.join(", ")}"`);
      }
      if (options.nonull === true || options.nullglob === true) {
        return options.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
      }
    }
    return matches;
  };
  micromatch.match = micromatch;
  micromatch.matcher = (pattern, options) => picomatch(pattern, options);
  micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);
  micromatch.any = micromatch.isMatch;
  micromatch.not = (list, patterns, options = {}) => {
    patterns = [].concat(patterns).map(String);
    let result = new Set;
    let items = [];
    let onResult = (state) => {
      if (options.onResult)
        options.onResult(state);
      items.push(state.output);
    };
    let matches = micromatch(list, patterns, { ...options, onResult });
    for (let item of items) {
      if (!matches.includes(item)) {
        result.add(item);
      }
    }
    return [...result];
  };
  micromatch.contains = (str, pattern, options) => {
    if (typeof str !== "string") {
      throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
    }
    if (Array.isArray(pattern)) {
      return pattern.some((p) => micromatch.contains(str, p, options));
    }
    if (typeof pattern === "string") {
      if (isEmptyString(str) || isEmptyString(pattern)) {
        return false;
      }
      if (str.includes(pattern) || str.startsWith("./") && str.slice(2).includes(pattern)) {
        return true;
      }
    }
    return micromatch.isMatch(str, pattern, { ...options, contains: true });
  };
  micromatch.matchKeys = (obj, patterns, options) => {
    if (!utils.isObject(obj)) {
      throw new TypeError("Expected the first argument to be an object");
    }
    let keys = micromatch(Object.keys(obj), patterns, options);
    let res = {};
    for (let key of keys)
      res[key] = obj[key];
    return res;
  };
  micromatch.some = (list, patterns, options) => {
    let items = [].concat(list);
    for (let pattern of [].concat(patterns)) {
      let isMatch = picomatch(String(pattern), options);
      if (items.some((item) => isMatch(item))) {
        return true;
      }
    }
    return false;
  };
  micromatch.every = (list, patterns, options) => {
    let items = [].concat(list);
    for (let pattern of [].concat(patterns)) {
      let isMatch = picomatch(String(pattern), options);
      if (!items.every((item) => isMatch(item))) {
        return false;
      }
    }
    return true;
  };
  micromatch.all = (str, patterns, options) => {
    if (typeof str !== "string") {
      throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
    }
    return [].concat(patterns).every((p) => picomatch(p, options)(str));
  };
  micromatch.capture = (glob, input, options) => {
    let posix = utils.isWindows(options);
    let regex = picomatch.makeRe(String(glob), { ...options, capture: true });
    let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);
    if (match) {
      return match.slice(1).map((v) => v === undefined ? "" : v);
    }
  };
  micromatch.makeRe = (...args) => picomatch.makeRe(...args);
  micromatch.scan = (...args) => picomatch.scan(...args);
  micromatch.parse = (patterns, options) => {
    let res = [];
    for (let pattern of [].concat(patterns || [])) {
      for (let str of braces(String(pattern), options)) {
        res.push(picomatch.parse(str, options));
      }
    }
    return res;
  };
  micromatch.braces = (pattern, options) => {
    if (typeof pattern !== "string")
      throw new TypeError("Expected a string");
    if (options && options.nobrace === true || !/\{.*\}/.test(pattern)) {
      return [pattern];
    }
    return braces(pattern, options);
  };
  micromatch.braceExpand = (pattern, options) => {
    if (typeof pattern !== "string")
      throw new TypeError("Expected a string");
    return micromatch.braces(pattern, { ...options, expand: true });
  };
  module.exports = micromatch;
});

// node_modules/applicationinsights/Library/Logging.js
var require_Logging = __commonJS((exports, module) => {
  var Logging = function() {
    function Logging2() {}
    Logging2.info = function(message) {
      var optionalParams = [];
      for (var _i = 1;_i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
      }
      if (Logging2.enableDebug) {
        console.info(Logging2.TAG + message, optionalParams);
      }
    };
    Logging2.warn = function(message) {
      var optionalParams = [];
      for (var _i = 1;_i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
      }
      if (!Logging2.disableWarnings) {
        console.warn(Logging2.TAG + message, optionalParams);
      }
    };
    Logging2.enableDebug = false;
    Logging2.disableWarnings = false;
    Logging2.TAG = "ApplicationInsights:";
    return Logging2;
  }();
  module.exports = Logging;
});

// node_modules/applicationinsights/Library/Util.js
var require_Util = __commonJS((exports, module) => {
  var url = __require("url");
  var Logging = require_Logging();
  var Util = function() {
    function Util2() {}
    Util2.getCookie = function(name, cookie) {
      var value = "";
      if (name && name.length && typeof cookie === "string") {
        var cookieName = name + "=";
        var cookies = cookie.split(";");
        for (var i = 0;i < cookies.length; i++) {
          var cookie = cookies[i];
          cookie = Util2.trim(cookie);
          if (cookie && cookie.indexOf(cookieName) === 0) {
            value = cookie.substring(cookieName.length, cookies[i].length);
            break;
          }
        }
      }
      return value;
    };
    Util2.trim = function(str) {
      if (typeof str === "string") {
        return str.replace(/^\s+|\s+$/g, "");
      } else {
        return "";
      }
    };
    Util2.int32ArrayToBase64 = function(array) {
      var toChar = function(v, i) {
        return String.fromCharCode(v >> i & 255);
      };
      var int32AsString = function(v) {
        return toChar(v, 24) + toChar(v, 16) + toChar(v, 8) + toChar(v, 0);
      };
      var x = array.map(int32AsString).join("");
      var s = new Buffer(x, "binary").toString("base64");
      return s.substr(0, s.indexOf("="));
    };
    Util2.random32 = function() {
      return 4294967296 * Math.random() | 0;
    };
    Util2.newGuid = function() {
      var hexValues = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
      var oct = "", tmp;
      for (var a = 0;a < 4; a++) {
        tmp = Util2.random32();
        oct += hexValues[tmp & 15] + hexValues[tmp >> 4 & 15] + hexValues[tmp >> 8 & 15] + hexValues[tmp >> 12 & 15] + hexValues[tmp >> 16 & 15] + hexValues[tmp >> 20 & 15] + hexValues[tmp >> 24 & 15] + hexValues[tmp >> 28 & 15];
      }
      var clockSequenceHi = hexValues[8 + Math.random() * 4 | 0];
      return oct.substr(0, 8) + "-" + oct.substr(9, 4) + "-4" + oct.substr(13, 3) + "-" + clockSequenceHi + oct.substr(16, 3) + "-" + oct.substr(19, 12);
    };
    Util2.isArray = function(obj) {
      return Object.prototype.toString.call(obj) === "[object Array]";
    };
    Util2.isError = function(obj) {
      return obj instanceof Error;
    };
    Util2.isDate = function(obj) {
      return Object.prototype.toString.call(obj) === "[object Date]";
    };
    Util2.msToTimeSpan = function(totalms) {
      if (isNaN(totalms) || totalms < 0) {
        totalms = 0;
      }
      var ms = "" + totalms % 1000;
      var sec = "" + Math.floor(totalms / 1000) % 60;
      var min = "" + Math.floor(totalms / (1000 * 60)) % 60;
      var hour = "" + Math.floor(totalms / (1000 * 60 * 60)) % 24;
      var days = Math.floor(totalms / (1000 * 60 * 60 * 24));
      ms = ms.length === 1 ? "00" + ms : ms.length === 2 ? "0" + ms : ms;
      sec = sec.length < 2 ? "0" + sec : sec;
      min = min.length < 2 ? "0" + min : min;
      hour = hour.length < 2 ? "0" + hour : hour;
      var daysText = days > 0 ? days + "." : "";
      return daysText + hour + ":" + min + ":" + sec + "." + ms;
    };
    Util2.validateStringMap = function(obj) {
      var map;
      if (typeof obj === "object") {
        map = {};
        for (var field in obj) {
          var property = obj[field];
          var propertyType = typeof property;
          if (propertyType !== "string") {
            if (property != null && typeof property.toString === "function") {
              property = property.toString();
            } else {
              Logging.info("key: " + field + ", invalid property type: " + propertyType);
              continue;
            }
          }
          map[field] = property.trim(0, Util2.MAX_PROPERTY_LENGTH);
        }
      } else {
        Logging.info("Invalid properties dropped from payload");
      }
      return map;
    };
    Util2.canIncludeCorrelationHeader = function(client, requestUrl) {
      var excludedDomains = client && client.config && client.config.correlationHeaderExcludedDomains;
      if (!excludedDomains || excludedDomains.length == 0 || !requestUrl) {
        return true;
      }
      for (var i = 0;i < excludedDomains.length; i++) {
        var regex = new RegExp(excludedDomains[i].replace(/\./g, ".").replace(/\*/g, ".*"));
        if (regex.test(url.parse(requestUrl).hostname)) {
          return false;
        }
      }
      return true;
    };
    Util2.MAX_PROPERTY_LENGTH = 1024;
    Util2.document = typeof document !== "undefined" ? document : {};
    return Util2;
  }();
  module.exports = Util;
});

// node_modules/zone.js/dist/zone-node.js
var require_zone_node = __commonJS((exports, module) => {
  (function(global2, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? factory() : typeof define === "function" && define.amd ? define(factory) : factory();
  })(exports, function() {
    (function(global2) {
      if (global2["Zone"]) {
        throw new Error("Zone already loaded.");
      }
      var Zone2 = function() {
        function Zone3(parent, zoneSpec) {
          this._properties = null;
          this._parent = parent;
          this._name = zoneSpec ? zoneSpec.name || "unnamed" : "<root>";
          this._properties = zoneSpec && zoneSpec.properties || {};
          this._zoneDelegate = new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
        }
        Zone3.assertZonePatched = function() {
          if (global2.Promise !== ZoneAwarePromise) {
            throw new Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` " + `has been overwritten.
` + "Most likely cause is that a Promise polyfill has been loaded " + "after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. " + "If you must load one, do so before loading zone.js.)");
          }
        };
        Object.defineProperty(Zone3, "current", {
          get: function() {
            return _currentZoneFrame.zone;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Zone3, "currentTask", {
          get: function() {
            return _currentTask;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Zone3.prototype, "parent", {
          get: function() {
            return this._parent;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Zone3.prototype, "name", {
          get: function() {
            return this._name;
          },
          enumerable: true,
          configurable: true
        });
        Zone3.prototype.get = function(key) {
          var zone = this.getZoneWith(key);
          if (zone)
            return zone._properties[key];
        };
        Zone3.prototype.getZoneWith = function(key) {
          var current = this;
          while (current) {
            if (current._properties.hasOwnProperty(key)) {
              return current;
            }
            current = current._parent;
          }
          return null;
        };
        Zone3.prototype.fork = function(zoneSpec) {
          if (!zoneSpec)
            throw new Error("ZoneSpec required!");
          return this._zoneDelegate.fork(this, zoneSpec);
        };
        Zone3.prototype.wrap = function(callback, source2) {
          if (typeof callback !== "function") {
            throw new Error("Expecting function got: " + callback);
          }
          var _callback = this._zoneDelegate.intercept(this, callback, source2);
          var zone = this;
          return function() {
            return zone.runGuarded(_callback, this, arguments, source2);
          };
        };
        Zone3.prototype.run = function(callback, applyThis, applyArgs, source2) {
          if (applyThis === undefined) {
            applyThis = null;
          }
          if (applyArgs === undefined) {
            applyArgs = null;
          }
          if (source2 === undefined) {
            source2 = null;
          }
          _currentZoneFrame = new ZoneFrame(_currentZoneFrame, this);
          try {
            return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source2);
          } finally {
            _currentZoneFrame = _currentZoneFrame.parent;
          }
        };
        Zone3.prototype.runGuarded = function(callback, applyThis, applyArgs, source2) {
          if (applyThis === undefined) {
            applyThis = null;
          }
          if (applyArgs === undefined) {
            applyArgs = null;
          }
          if (source2 === undefined) {
            source2 = null;
          }
          _currentZoneFrame = new ZoneFrame(_currentZoneFrame, this);
          try {
            try {
              return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source2);
            } catch (error) {
              if (this._zoneDelegate.handleError(this, error)) {
                throw error;
              }
            }
          } finally {
            _currentZoneFrame = _currentZoneFrame.parent;
          }
        };
        Zone3.prototype.runTask = function(task, applyThis, applyArgs) {
          task.runCount++;
          if (task.zone != this)
            throw new Error("A task can only be run in the zone which created it! (Creation: " + task.zone.name + "; Execution: " + this.name + ")");
          var previousTask = _currentTask;
          _currentTask = task;
          _currentZoneFrame = new ZoneFrame(_currentZoneFrame, this);
          try {
            if (task.type == "macroTask" && task.data && !task.data.isPeriodic) {
              task.cancelFn = null;
            }
            try {
              return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
            } catch (error) {
              if (this._zoneDelegate.handleError(this, error)) {
                throw error;
              }
            }
          } finally {
            _currentZoneFrame = _currentZoneFrame.parent;
            _currentTask = previousTask;
          }
        };
        Zone3.prototype.scheduleMicroTask = function(source2, callback, data, customSchedule) {
          return this._zoneDelegate.scheduleTask(this, new ZoneTask("microTask", this, source2, callback, data, customSchedule, null));
        };
        Zone3.prototype.scheduleMacroTask = function(source2, callback, data, customSchedule, customCancel) {
          return this._zoneDelegate.scheduleTask(this, new ZoneTask("macroTask", this, source2, callback, data, customSchedule, customCancel));
        };
        Zone3.prototype.scheduleEventTask = function(source2, callback, data, customSchedule, customCancel) {
          return this._zoneDelegate.scheduleTask(this, new ZoneTask("eventTask", this, source2, callback, data, customSchedule, customCancel));
        };
        Zone3.prototype.cancelTask = function(task) {
          var value = this._zoneDelegate.cancelTask(this, task);
          task.runCount = -1;
          task.cancelFn = null;
          return value;
        };
        return Zone3;
      }();
      Zone2.__symbol__ = __symbol__;
      var ZoneDelegate = function() {
        function ZoneDelegate2(zone, parentDelegate, zoneSpec) {
          this._taskCounts = { microTask: 0, macroTask: 0, eventTask: 0 };
          this.zone = zone;
          this._parentDelegate = parentDelegate;
          this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
          this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
          this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);
          this._interceptZS = zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
          this._interceptDlgt = zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
          this._interceptCurrZone = zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);
          this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
          this._invokeDlgt = zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
          this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);
          this._handleErrorZS = zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
          this._handleErrorDlgt = zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
          this._handleErrorCurrZone = zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);
          this._scheduleTaskZS = zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
          this._scheduleTaskDlgt = zoneSpec && (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
          this._scheduleTaskCurrZone = zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);
          this._invokeTaskZS = zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
          this._invokeTaskDlgt = zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
          this._invokeTaskCurrZone = zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);
          this._cancelTaskZS = zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
          this._cancelTaskDlgt = zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
          this._cancelTaskCurrZone = zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);
          this._hasTaskZS = zoneSpec && (zoneSpec.onHasTask ? zoneSpec : parentDelegate._hasTaskZS);
          this._hasTaskDlgt = zoneSpec && (zoneSpec.onHasTask ? parentDelegate : parentDelegate._hasTaskDlgt);
          this._hasTaskCurrZone = zoneSpec && (zoneSpec.onHasTask ? this.zone : parentDelegate.zone);
        }
        ZoneDelegate2.prototype.fork = function(targetZone, zoneSpec) {
          return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) : new Zone2(targetZone, zoneSpec);
        };
        ZoneDelegate2.prototype.intercept = function(targetZone, callback, source2) {
          return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source2) : callback;
        };
        ZoneDelegate2.prototype.invoke = function(targetZone, callback, applyThis, applyArgs, source2) {
          return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source2) : callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate2.prototype.handleError = function(targetZone, error) {
          return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) : true;
        };
        ZoneDelegate2.prototype.scheduleTask = function(targetZone, task) {
          try {
            if (this._scheduleTaskZS) {
              return this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
            } else if (task.scheduleFn) {
              task.scheduleFn(task);
            } else if (task.type == "microTask") {
              scheduleMicroTask(task);
            } else {
              throw new Error("Task is missing scheduleFn.");
            }
            return task;
          } finally {
            if (targetZone == this.zone) {
              this._updateTaskCount(task.type, 1);
            }
          }
        };
        ZoneDelegate2.prototype.invokeTask = function(targetZone, task, applyThis, applyArgs) {
          try {
            return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) : task.callback.apply(applyThis, applyArgs);
          } finally {
            if (targetZone == this.zone && task.type != "eventTask" && !(task.data && task.data.isPeriodic)) {
              this._updateTaskCount(task.type, -1);
            }
          }
        };
        ZoneDelegate2.prototype.cancelTask = function(targetZone, task) {
          var value;
          if (this._cancelTaskZS) {
            value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
          } else if (!task.cancelFn) {
            throw new Error("Task does not support cancellation, or is already canceled.");
          } else {
            value = task.cancelFn(task);
          }
          if (targetZone == this.zone) {
            this._updateTaskCount(task.type, -1);
          }
          return value;
        };
        ZoneDelegate2.prototype.hasTask = function(targetZone, isEmpty) {
          return this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
        };
        ZoneDelegate2.prototype._updateTaskCount = function(type, count) {
          var counts = this._taskCounts;
          var prev = counts[type];
          var next = counts[type] = prev + count;
          if (next < 0) {
            throw new Error("More tasks executed then were scheduled.");
          }
          if (prev == 0 || next == 0) {
            var isEmpty = {
              microTask: counts.microTask > 0,
              macroTask: counts.macroTask > 0,
              eventTask: counts.eventTask > 0,
              change: type
            };
            try {
              this.hasTask(this.zone, isEmpty);
            } finally {
              if (this._parentDelegate) {
                this._parentDelegate._updateTaskCount(type, count);
              }
            }
          }
        };
        return ZoneDelegate2;
      }();
      var ZoneTask = function() {
        function ZoneTask2(type, zone, source2, callback, options, scheduleFn, cancelFn) {
          this.runCount = 0;
          this.type = type;
          this.zone = zone;
          this.source = source2;
          this.data = options;
          this.scheduleFn = scheduleFn;
          this.cancelFn = cancelFn;
          this.callback = callback;
          var self2 = this;
          this.invoke = function() {
            _numberOfNestedTaskFrames++;
            try {
              return zone.runTask(self2, this, arguments);
            } finally {
              if (_numberOfNestedTaskFrames == 1) {
                drainMicroTaskQueue();
              }
              _numberOfNestedTaskFrames--;
            }
          };
        }
        ZoneTask2.prototype.toString = function() {
          if (this.data && typeof this.data.handleId !== "undefined") {
            return this.data.handleId;
          } else {
            return Object.prototype.toString.call(this);
          }
        };
        ZoneTask2.prototype.toJSON = function() {
          return {
            type: this.type,
            source: this.source,
            data: this.data,
            zone: this.zone.name,
            invoke: this.invoke,
            scheduleFn: this.scheduleFn,
            cancelFn: this.cancelFn,
            runCount: this.runCount,
            callback: this.callback
          };
        };
        return ZoneTask2;
      }();
      var ZoneFrame = function() {
        function ZoneFrame2(parent, zone) {
          this.parent = parent;
          this.zone = zone;
        }
        return ZoneFrame2;
      }();
      function __symbol__(name) {
        return "__zone_symbol__" + name;
      }
      var symbolSetTimeout = __symbol__("setTimeout");
      var symbolPromise = __symbol__("Promise");
      var symbolThen = __symbol__("then");
      var _currentZoneFrame = new ZoneFrame(null, new Zone2(null, null));
      var _currentTask = null;
      var _microTaskQueue = [];
      var _isDrainingMicrotaskQueue = false;
      var _uncaughtPromiseErrors = [];
      var _numberOfNestedTaskFrames = 0;
      function scheduleQueueDrain() {
        if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
          if (global2[symbolPromise]) {
            global2[symbolPromise].resolve(0)[symbolThen](drainMicroTaskQueue);
          } else {
            global2[symbolSetTimeout](drainMicroTaskQueue, 0);
          }
        }
      }
      function scheduleMicroTask(task) {
        scheduleQueueDrain();
        _microTaskQueue.push(task);
      }
      function consoleError(e) {
        var rejection = e && e.rejection;
        if (rejection) {
          console.error("Unhandled Promise rejection:", rejection instanceof Error ? rejection.message : rejection, "; Zone:", e.zone.name, "; Task:", e.task && e.task.source, "; Value:", rejection, rejection instanceof Error ? rejection.stack : undefined);
        }
        console.error(e);
      }
      function drainMicroTaskQueue() {
        if (!_isDrainingMicrotaskQueue) {
          _isDrainingMicrotaskQueue = true;
          while (_microTaskQueue.length) {
            var queue = _microTaskQueue;
            _microTaskQueue = [];
            for (var i = 0;i < queue.length; i++) {
              var task = queue[i];
              try {
                task.zone.runTask(task, null, null);
              } catch (e) {
                consoleError(e);
              }
            }
          }
          while (_uncaughtPromiseErrors.length) {
            var _loop_1 = function() {
              var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
              try {
                uncaughtPromiseError.zone.runGuarded(function() {
                  throw uncaughtPromiseError;
                });
              } catch (e) {
                consoleError(e);
              }
            };
            while (_uncaughtPromiseErrors.length) {
              _loop_1();
            }
          }
          _isDrainingMicrotaskQueue = false;
        }
      }
      function isThenable(value) {
        return value && value.then;
      }
      function forwardResolution(value) {
        return value;
      }
      function forwardRejection(rejection) {
        return ZoneAwarePromise.reject(rejection);
      }
      var symbolState = __symbol__("state");
      var symbolValue = __symbol__("value");
      var source = "Promise.then";
      var UNRESOLVED = null;
      var RESOLVED = true;
      var REJECTED = false;
      var REJECTED_NO_CATCH = 0;
      function makeResolver(promise, state) {
        return function(v) {
          resolvePromise(promise, state, v);
        };
      }
      function resolvePromise(promise, state, value) {
        if (promise[symbolState] === UNRESOLVED) {
          if (value instanceof ZoneAwarePromise && value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) && value[symbolState] !== UNRESOLVED) {
            clearRejectedNoCatch(value);
            resolvePromise(promise, value[symbolState], value[symbolValue]);
          } else if (isThenable(value)) {
            value.then(makeResolver(promise, state), makeResolver(promise, false));
          } else {
            promise[symbolState] = state;
            var queue = promise[symbolValue];
            promise[symbolValue] = value;
            for (var i = 0;i < queue.length; ) {
              scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
            }
            if (queue.length == 0 && state == REJECTED) {
              promise[symbolState] = REJECTED_NO_CATCH;
              try {
                throw new Error("Uncaught (in promise): " + value + (value && value.stack ? `
` + value.stack : ""));
              } catch (e) {
                var error_1 = e;
                error_1.rejection = value;
                error_1.promise = promise;
                error_1.zone = Zone2.current;
                error_1.task = Zone2.currentTask;
                _uncaughtPromiseErrors.push(error_1);
                scheduleQueueDrain();
              }
            }
          }
        }
        return promise;
      }
      function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
          promise[symbolState] = REJECTED;
          for (var i = 0;i < _uncaughtPromiseErrors.length; i++) {
            if (promise === _uncaughtPromiseErrors[i].promise) {
              _uncaughtPromiseErrors.splice(i, 1);
              break;
            }
          }
        }
      }
      function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        var delegate = promise[symbolState] ? onFulfilled || forwardResolution : onRejected || forwardRejection;
        zone.scheduleMicroTask(source, function() {
          try {
            resolvePromise(chainPromise, true, zone.run(delegate, null, [promise[symbolValue]]));
          } catch (error) {
            resolvePromise(chainPromise, false, error);
          }
        });
      }
      var ZoneAwarePromise = function() {
        function ZoneAwarePromise2(executor) {
          var promise = this;
          if (!(promise instanceof ZoneAwarePromise2)) {
            throw new Error("Must be an instanceof Promise.");
          }
          promise[symbolState] = UNRESOLVED;
          promise[symbolValue] = [];
          try {
            executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
          } catch (e) {
            resolvePromise(promise, false, e);
          }
        }
        ZoneAwarePromise2.toString = function() {
          return "function ZoneAwarePromise() { [native code] }";
        };
        ZoneAwarePromise2.resolve = function(value) {
          return resolvePromise(new this(null), RESOLVED, value);
        };
        ZoneAwarePromise2.reject = function(error) {
          return resolvePromise(new this(null), REJECTED, error);
        };
        ZoneAwarePromise2.race = function(values) {
          var resolve;
          var reject;
          var promise = new this(function(res, rej) {
            _a = [res, rej], resolve = _a[0], reject = _a[1];
            var _a;
          });
          function onResolve(value2) {
            promise && (promise = resolve(value2));
          }
          function onReject(error) {
            promise && (promise = reject(error));
          }
          for (var _i = 0, values_1 = values;_i < values_1.length; _i++) {
            var value = values_1[_i];
            if (!isThenable(value)) {
              value = this.resolve(value);
            }
            value.then(onResolve, onReject);
          }
          return promise;
        };
        ZoneAwarePromise2.all = function(values) {
          var resolve;
          var reject;
          var promise = new this(function(res, rej) {
            resolve = res;
            reject = rej;
          });
          var count = 0;
          var resolvedValues = [];
          for (var _i = 0, values_2 = values;_i < values_2.length; _i++) {
            var value = values_2[_i];
            if (!isThenable(value)) {
              value = this.resolve(value);
            }
            value.then(function(index) {
              return function(value2) {
                resolvedValues[index] = value2;
                count--;
                if (!count) {
                  resolve(resolvedValues);
                }
              };
            }(count), reject);
            count++;
          }
          if (!count)
            resolve(resolvedValues);
          return promise;
        };
        ZoneAwarePromise2.prototype.then = function(onFulfilled, onRejected) {
          var chainPromise = new this.constructor(null);
          var zone = Zone2.current;
          if (this[symbolState] == UNRESOLVED) {
            this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
          } else {
            scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
          }
          return chainPromise;
        };
        ZoneAwarePromise2.prototype.catch = function(onRejected) {
          return this.then(null, onRejected);
        };
        return ZoneAwarePromise2;
      }();
      ZoneAwarePromise["resolve"] = ZoneAwarePromise.resolve;
      ZoneAwarePromise["reject"] = ZoneAwarePromise.reject;
      ZoneAwarePromise["race"] = ZoneAwarePromise.race;
      ZoneAwarePromise["all"] = ZoneAwarePromise.all;
      var NativePromise = global2[__symbol__("Promise")] = global2["Promise"];
      global2["Promise"] = ZoneAwarePromise;
      function patchThen(NativePromise2) {
        var NativePromiseProtototype = NativePromise2.prototype;
        var NativePromiseThen = NativePromiseProtototype[__symbol__("then")] = NativePromiseProtototype.then;
        NativePromiseProtototype.then = function(onResolve, onReject) {
          var nativePromise = this;
          return new ZoneAwarePromise(function(resolve, reject) {
            NativePromiseThen.call(nativePromise, resolve, reject);
          }).then(onResolve, onReject);
        };
      }
      if (NativePromise) {
        patchThen(NativePromise);
        if (typeof global2["fetch"] !== "undefined") {
          var fetchPromise = undefined;
          try {
            fetchPromise = global2["fetch"]();
          } catch (e) {
            fetchPromise = global2["fetch"]("about:blank");
          }
          fetchPromise.then(function() {
            return null;
          }, function() {
            return null;
          });
          if (fetchPromise.constructor != NativePromise && fetchPromise.constructor != ZoneAwarePromise) {
            patchThen(fetchPromise.constructor);
          }
        }
      }
      Promise[Zone2.__symbol__("uncaughtPromiseErrors")] = _uncaughtPromiseErrors;
      var FrameType;
      (function(FrameType2) {
        FrameType2[FrameType2["blackList"] = 0] = "blackList";
        FrameType2[FrameType2["transition"] = 1] = "transition";
      })(FrameType || (FrameType = {}));
      var NativeError = global2[__symbol__("Error")] = global2.Error;
      var blackListedStackFrames = {};
      var zoneAwareFrame;
      global2.Error = ZoneAwareError;
      var stackRewrite = "stackRewrite";
      var createProperty = function(props, key) {
        if (props[key]) {
          return;
        }
        var name = __symbol__(key);
        props[key] = {
          configurable: true,
          enumerable: true,
          get: function() {
            if (!this[name]) {
              var error_2 = this[__symbol__("error")];
              if (error_2) {
                this[name] = error_2[key];
              }
            }
            return this[name];
          },
          set: function(value) {
            this[name] = value;
          }
        };
      };
      var createMethodProperty = function(props, key) {
        if (props[key]) {
          return;
        }
        props[key] = {
          configurable: true,
          enumerable: true,
          writable: true,
          value: function() {
            var error = this[__symbol__("error")];
            var errorMethod = error && error[key] || this[key];
            if (errorMethod) {
              return errorMethod.apply(error, arguments);
            }
          }
        };
      };
      var createErrorProperties = function() {
        var props = Object.create(null);
        var error = new NativeError;
        var keys = Object.getOwnPropertyNames(error);
        for (var i = 0;i < keys.length; i++) {
          var key = keys[i];
          if (Object.prototype.hasOwnProperty.call(error, key)) {
            createProperty(props, key);
          }
        }
        var proto = NativeError.prototype;
        if (proto) {
          var pKeys = Object.getOwnPropertyNames(proto);
          for (var i = 0;i < pKeys.length; i++) {
            var key = pKeys[i];
            if (key !== "constructor" && key !== "toString" && key !== "toSource") {
              createProperty(props, key);
            }
          }
        }
        createProperty(props, "originalStack");
        createProperty(props, "zoneAwareStack");
        createMethodProperty(props, "toString");
        createMethodProperty(props, "toSource");
        return props;
      };
      var errorProperties = createErrorProperties();
      var getErrorPropertiesForPrototype = function(prototype) {
        if (prototype === ZoneAwareError.prototype) {
          return errorProperties;
        }
        var newProps = Object.create(null);
        var cKeys = Object.getOwnPropertyNames(errorProperties);
        var keys = Object.getOwnPropertyNames(prototype);
        cKeys.forEach(function(cKey) {
          if (keys.filter(function(key) {
            return key === cKey;
          }).length === 0) {
            newProps[cKey] = errorProperties[cKey];
          }
        });
        return newProps;
      };
      function ZoneAwareError() {
        if (!(this instanceof ZoneAwareError)) {
          return ZoneAwareError.apply(Object.create(ZoneAwareError.prototype), arguments);
        }
        var error = NativeError.apply(this, arguments);
        this[__symbol__("error")] = error;
        error.originalStack = error.stack;
        if (ZoneAwareError[stackRewrite] && error.originalStack) {
          var frames_1 = error.originalStack.split(`
`);
          var zoneFrame = _currentZoneFrame;
          var i = 0;
          while (frames_1[i] !== zoneAwareFrame && i < frames_1.length) {
            i++;
          }
          for (;i < frames_1.length && zoneFrame; i++) {
            var frame = frames_1[i];
            if (frame.trim()) {
              var frameType = blackListedStackFrames.hasOwnProperty(frame) && blackListedStackFrames[frame];
              if (frameType === FrameType.blackList) {
                frames_1.splice(i, 1);
                i--;
              } else if (frameType === FrameType.transition) {
                if (zoneFrame.parent) {
                  frames_1[i] += " [" + zoneFrame.parent.zone.name + " => " + zoneFrame.zone.name + "]";
                  zoneFrame = zoneFrame.parent;
                } else {
                  zoneFrame = null;
                }
              } else {
                frames_1[i] += " [" + zoneFrame.zone.name + "]";
              }
            }
          }
          error.stack = error.zoneAwareStack = frames_1.join(`
`);
        }
        Object.defineProperties(this, getErrorPropertiesForPrototype(Object.getPrototypeOf(this)));
        return this;
      }
      ZoneAwareError.prototype = NativeError.prototype;
      ZoneAwareError[Zone2.__symbol__("blacklistedStackFrames")] = blackListedStackFrames;
      ZoneAwareError[stackRewrite] = false;
      if (NativeError.hasOwnProperty("stackTraceLimit")) {
        NativeError.stackTraceLimit = Math.max(NativeError.stackTraceLimit, 15);
        Object.defineProperty(ZoneAwareError, "stackTraceLimit", {
          get: function() {
            return NativeError.stackTraceLimit;
          },
          set: function(value) {
            return NativeError.stackTraceLimit = value;
          }
        });
      }
      if (NativeError.hasOwnProperty("captureStackTrace")) {
        Object.defineProperty(ZoneAwareError, "captureStackTrace", {
          value: function zoneCaptureStackTrace(targetObject, constructorOpt) {
            NativeError.captureStackTrace(targetObject, constructorOpt);
          }
        });
      }
      Object.defineProperty(ZoneAwareError, "prepareStackTrace", {
        get: function() {
          return NativeError.prepareStackTrace;
        },
        set: function(value) {
          if (!value || typeof value !== "function") {
            return NativeError.prepareStackTrace = value;
          }
          return NativeError.prepareStackTrace = function(error, structuredStackTrace) {
            if (structuredStackTrace) {
              for (var i = 0;i < structuredStackTrace.length; i++) {
                var st = structuredStackTrace[i];
                if (st.getFunctionName() === "zoneCaptureStackTrace") {
                  structuredStackTrace.splice(i, 1);
                  break;
                }
              }
            }
            return value.apply(this, [error, structuredStackTrace]);
          };
        }
      });
      var detectZone = Zone2.current.fork({
        name: "detect",
        onInvoke: function(parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source2) {
          return parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs, source2);
        },
        onHandleError: function(parentZD, current, target, error) {
          if (error.originalStack && Error === ZoneAwareError) {
            var frames_2 = error.originalStack.split(/\n/);
            var runFrame = false, runGuardedFrame = false, runTaskFrame = false;
            while (frames_2.length) {
              var frame = frames_2.shift();
              if (/:\d+:\d+/.test(frame)) {
                var fnName = frame.split("(")[0].split("@")[0];
                var frameType = FrameType.transition;
                if (fnName.indexOf("ZoneAwareError") !== -1) {
                  zoneAwareFrame = frame;
                }
                if (fnName.indexOf("runGuarded") !== -1) {
                  runGuardedFrame = true;
                } else if (fnName.indexOf("runTask") !== -1) {
                  runTaskFrame = true;
                } else if (fnName.indexOf("run") !== -1) {
                  runFrame = true;
                } else {
                  frameType = FrameType.blackList;
                }
                blackListedStackFrames[frame] = frameType;
                if (runFrame && runGuardedFrame && runTaskFrame) {
                  ZoneAwareError[stackRewrite] = true;
                  break;
                }
              }
            }
          }
          return false;
        }
      });
      var detectRunFn = function() {
        detectZone.run(function() {
          detectZone.runGuarded(function() {
            throw new Error("blacklistStackFrames");
          });
        });
      };
      detectZone.runTask(detectZone.scheduleMacroTask("detect", detectRunFn, null, function() {
        return null;
      }, null));
      return global2["Zone"] = Zone2;
    })(typeof window === "object" && window || typeof self === "object" && self || global);
    var zoneSymbol = function(n) {
      return "__zone_symbol__" + n;
    };
    var _global$1 = typeof window === "object" && window || typeof self === "object" && self || global;
    !("nw" in _global$1) && typeof process !== "undefined" && {}.toString.call(process) === "[object process]";
    var EVENT_TASKS = zoneSymbol("eventTasks");
    var ADD_EVENT_LISTENER = "addEventListener";
    var REMOVE_EVENT_LISTENER = "removeEventListener";
    function findExistingRegisteredTask(target, handler, name, capture, remove) {
      var eventTasks = target[EVENT_TASKS];
      if (eventTasks) {
        for (var i = 0;i < eventTasks.length; i++) {
          var eventTask = eventTasks[i];
          var data = eventTask.data;
          var listener = data.handler;
          if ((data.handler === handler || listener.listener === handler) && data.useCapturing === capture && data.eventName === name) {
            if (remove) {
              eventTasks.splice(i, 1);
            }
            return eventTask;
          }
        }
      }
      return null;
    }
    function findAllExistingRegisteredTasks(target, name, capture, remove) {
      var eventTasks = target[EVENT_TASKS];
      if (eventTasks) {
        var result = [];
        for (var i = eventTasks.length - 1;i >= 0; i--) {
          var eventTask = eventTasks[i];
          var data = eventTask.data;
          if (data.eventName === name && data.useCapturing === capture) {
            result.push(eventTask);
            {
              eventTasks.splice(i, 1);
            }
          }
        }
        return result;
      }
      return null;
    }
    function attachRegisteredEvent(target, eventTask, isPrepend) {
      var eventTasks = target[EVENT_TASKS];
      if (!eventTasks) {
        eventTasks = target[EVENT_TASKS] = [];
      }
      if (isPrepend) {
        eventTasks.unshift(eventTask);
      } else {
        eventTasks.push(eventTask);
      }
    }
    var defaultListenerMetaCreator = function(self2, args) {
      return {
        useCapturing: args[2],
        eventName: args[0],
        handler: args[1],
        target: self2 || _global$1,
        name: args[0],
        invokeAddFunc: function(addFnSymbol, delegate) {
          if (delegate && delegate.invoke) {
            return this.target[addFnSymbol](this.eventName, delegate.invoke, this.useCapturing);
          } else {
            return this.target[addFnSymbol](this.eventName, delegate, this.useCapturing);
          }
        },
        invokeRemoveFunc: function(removeFnSymbol, delegate) {
          if (delegate && delegate.invoke) {
            return this.target[removeFnSymbol](this.eventName, delegate.invoke, this.useCapturing);
          } else {
            return this.target[removeFnSymbol](this.eventName, delegate, this.useCapturing);
          }
        }
      };
    };
    function makeZoneAwareAddListener(addFnName, removeFnName, useCapturingParam, allowDuplicates, isPrepend, metaCreator) {
      if (useCapturingParam === undefined) {
        useCapturingParam = true;
      }
      if (allowDuplicates === undefined) {
        allowDuplicates = false;
      }
      if (isPrepend === undefined) {
        isPrepend = false;
      }
      if (metaCreator === undefined) {
        metaCreator = defaultListenerMetaCreator;
      }
      var addFnSymbol = zoneSymbol(addFnName);
      var removeFnSymbol = zoneSymbol(removeFnName);
      var defaultUseCapturing = useCapturingParam ? false : undefined;
      function scheduleEventListener(eventTask) {
        var meta = eventTask.data;
        attachRegisteredEvent(meta.target, eventTask, isPrepend);
        return meta.invokeAddFunc(addFnSymbol, eventTask);
      }
      function cancelEventListener(eventTask) {
        var meta = eventTask.data;
        findExistingRegisteredTask(meta.target, eventTask.invoke, meta.eventName, meta.useCapturing, true);
        return meta.invokeRemoveFunc(removeFnSymbol, eventTask);
      }
      return function zoneAwareAddListener(self2, args) {
        var data = metaCreator(self2, args);
        data.useCapturing = data.useCapturing || defaultUseCapturing;
        var delegate = null;
        if (typeof data.handler == "function") {
          delegate = data.handler;
        } else if (data.handler && data.handler.handleEvent) {
          delegate = function(event) {
            return data.handler.handleEvent(event);
          };
        }
        var validZoneHandler = false;
        try {
          validZoneHandler = data.handler && data.handler.toString() === "[object FunctionWrapper]";
        } catch (e) {
          return;
        }
        if (!delegate || validZoneHandler) {
          return data.invokeAddFunc(addFnSymbol, data.handler);
        }
        if (!allowDuplicates) {
          var eventTask = findExistingRegisteredTask(data.target, data.handler, data.eventName, data.useCapturing, false);
          if (eventTask) {
            return data.invokeAddFunc(addFnSymbol, eventTask);
          }
        }
        var zone = Zone.current;
        var source = data.target.constructor["name"] + "." + addFnName + ":" + data.eventName;
        zone.scheduleEventTask(source, delegate, data, scheduleEventListener, cancelEventListener);
      };
    }
    function makeZoneAwareRemoveListener(fnName, useCapturingParam, metaCreator) {
      if (useCapturingParam === undefined) {
        useCapturingParam = true;
      }
      if (metaCreator === undefined) {
        metaCreator = defaultListenerMetaCreator;
      }
      var symbol = zoneSymbol(fnName);
      var defaultUseCapturing = useCapturingParam ? false : undefined;
      return function zoneAwareRemoveListener(self2, args) {
        var data = metaCreator(self2, args);
        data.useCapturing = data.useCapturing || defaultUseCapturing;
        var eventTask = findExistingRegisteredTask(data.target, data.handler, data.eventName, data.useCapturing, true);
        if (eventTask) {
          eventTask.zone.cancelTask(eventTask);
        } else {
          data.invokeRemoveFunc(symbol, data.handler);
        }
      };
    }
    function makeZoneAwareRemoveAllListeners(fnName, useCapturingParam) {
      var symbol = zoneSymbol(fnName);
      var defaultUseCapturing = undefined;
      return function zoneAwareRemoveAllListener(self2, args) {
        var target = self2 || _global$1;
        if (args.length === 0) {
          target[EVENT_TASKS] = [];
          target[symbol]();
          return;
        }
        var eventName = args[0];
        var useCapturing = args[1] || defaultUseCapturing;
        findAllExistingRegisteredTasks(target, eventName, useCapturing);
        target[symbol](eventName);
      };
    }
    function makeZoneAwareListeners(fnName) {
      return function zoneAwareEventListeners(self2, args) {
        var eventName = args[0];
        var target = self2 || _global$1;
        if (!target[EVENT_TASKS]) {
          return [];
        }
        return target[EVENT_TASKS].filter(function(task) {
          return task.data.eventName === eventName;
        }).map(function(task) {
          return task.data.handler;
        });
      };
    }
    makeZoneAwareAddListener(ADD_EVENT_LISTENER, REMOVE_EVENT_LISTENER);
    makeZoneAwareRemoveListener(REMOVE_EVENT_LISTENER);
    function createNamedFn(name, delegate) {
      try {
        return Function("f", "return function " + name + "(){return f(this, arguments)}")(delegate);
      } catch (e) {
        return function() {
          return delegate(this, arguments);
        };
      }
    }
    function patchMethod(target, name, patchFn) {
      var proto = target;
      while (proto && Object.getOwnPropertyNames(proto).indexOf(name) === -1) {
        proto = Object.getPrototypeOf(proto);
      }
      if (!proto && target[name]) {
        proto = target;
      }
      var delegateName = zoneSymbol(name);
      var delegate;
      if (proto && !(delegate = proto[delegateName])) {
        delegate = proto[delegateName] = proto[name];
        proto[name] = createNamedFn(name, patchFn(delegate, delegateName, name));
      }
      return delegate;
    }
    function patchMacroTask(obj, funcName, metaCreator) {
      var setNative = null;
      function scheduleTask(task) {
        var data = task.data;
        data.args[data.callbackIndex] = function() {
          task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
      }
      setNative = patchMethod(obj, funcName, function(delegate) {
        return function(self2, args) {
          var meta = metaCreator(self2, args);
          if (meta.callbackIndex >= 0 && typeof args[meta.callbackIndex] === "function") {
            var task = Zone.current.scheduleMacroTask(meta.name, args[meta.callbackIndex], meta, scheduleTask, null);
            return task;
          } else {
            return delegate.apply(self2, args);
          }
        };
      });
    }
    var callAndReturnFirstParam = function(fn) {
      return function(self2, args) {
        fn(self2, args);
        return self2;
      };
    };
    var EE_ADD_LISTENER = "addListener";
    var EE_PREPEND_LISTENER = "prependListener";
    var EE_REMOVE_LISTENER = "removeListener";
    var EE_REMOVE_ALL_LISTENER = "removeAllListeners";
    var EE_LISTENERS = "listeners";
    var EE_ON = "on";
    var zoneAwareAddListener$1 = callAndReturnFirstParam(makeZoneAwareAddListener(EE_ADD_LISTENER, EE_REMOVE_LISTENER, false, true, false));
    var zoneAwarePrependListener = callAndReturnFirstParam(makeZoneAwareAddListener(EE_PREPEND_LISTENER, EE_REMOVE_LISTENER, false, true, true));
    var zoneAwareRemoveListener$1 = callAndReturnFirstParam(makeZoneAwareRemoveListener(EE_REMOVE_LISTENER, false));
    var zoneAwareRemoveAllListeners = callAndReturnFirstParam(makeZoneAwareRemoveAllListeners(EE_REMOVE_ALL_LISTENER));
    var zoneAwareListeners = makeZoneAwareListeners();
    function patchEventEmitterMethods(obj) {
      if (obj && obj.addListener) {
        patchMethod(obj, EE_ADD_LISTENER, function() {
          return zoneAwareAddListener$1;
        });
        patchMethod(obj, EE_PREPEND_LISTENER, function() {
          return zoneAwarePrependListener;
        });
        patchMethod(obj, EE_REMOVE_LISTENER, function() {
          return zoneAwareRemoveListener$1;
        });
        patchMethod(obj, EE_REMOVE_ALL_LISTENER, function() {
          return zoneAwareRemoveAllListeners;
        });
        patchMethod(obj, EE_LISTENERS, function() {
          return zoneAwareListeners;
        });
        obj[EE_ON] = obj[EE_ADD_LISTENER];
        return true;
      } else {
        return false;
      }
    }
    var events;
    try {
      events = __require("events");
    } catch (err) {}
    if (events && events.EventEmitter) {
      patchEventEmitterMethods(events.EventEmitter.prototype);
    }
    var fs;
    try {
      fs = __require("fs");
    } catch (err) {}
    var TO_PATCH_MACROTASK_METHODS = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "exists",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "read",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "write",
      "writeFile"
    ];
    if (fs) {
      TO_PATCH_MACROTASK_METHODS.filter(function(name) {
        return !!fs[name] && typeof fs[name] === "function";
      }).forEach(function(name) {
        patchMacroTask(fs, name, function(self2, args) {
          return {
            name: "fs." + name,
            args,
            callbackIndex: args.length > 0 ? args.length - 1 : -1,
            target: self2
          };
        });
      });
    }
    function patchTimer(window2, setName, cancelName, nameSuffix) {
      var setNative = null;
      var clearNative = null;
      setName += nameSuffix;
      cancelName += nameSuffix;
      var tasksByHandleId = {};
      function scheduleTask(task) {
        var data = task.data;
        data.args[0] = function() {
          task.invoke.apply(this, arguments);
          delete tasksByHandleId[data.handleId];
        };
        data.handleId = setNative.apply(window2, data.args);
        tasksByHandleId[data.handleId] = task;
        return task;
      }
      function clearTask(task) {
        delete tasksByHandleId[task.data.handleId];
        return clearNative(task.data.handleId);
      }
      setNative = patchMethod(window2, setName, function(delegate) {
        return function(self2, args) {
          if (typeof args[0] === "function") {
            var zone = Zone.current;
            var options = {
              handleId: null,
              isPeriodic: nameSuffix === "Interval",
              delay: nameSuffix === "Timeout" || nameSuffix === "Interval" ? args[1] || 0 : null,
              args
            };
            var task = zone.scheduleMacroTask(setName, args[0], options, scheduleTask, clearTask);
            if (!task) {
              return task;
            }
            var handle = task.data.handleId;
            if (handle.ref && handle.unref) {
              task.ref = handle.ref.bind(handle);
              task.unref = handle.unref.bind(handle);
            }
            return task;
          } else {
            return delegate.apply(window2, args);
          }
        };
      });
      clearNative = patchMethod(window2, cancelName, function(delegate) {
        return function(self2, args) {
          var task = typeof args[0] === "number" ? tasksByHandleId[args[0]] : args[0];
          if (task && typeof task.type === "string") {
            if (task.cancelFn && task.data.isPeriodic || task.runCount === 0) {
              task.zone.cancelTask(task);
            }
          } else {
            delegate.apply(window2, args);
          }
        };
      });
    }
    var set = "set";
    var clear = "clear";
    var _global = typeof window === "object" && window || typeof self === "object" && self || global;
    var timers = __require("timers");
    patchTimer(timers, set, clear, "Timeout");
    patchTimer(timers, set, clear, "Interval");
    patchTimer(timers, set, clear, "Immediate");
    var shouldPatchGlobalTimers = global.setTimeout !== timers.setTimeout;
    if (shouldPatchGlobalTimers) {
      patchTimer(_global, set, clear, "Timeout");
      patchTimer(_global, set, clear, "Interval");
      patchTimer(_global, set, clear, "Immediate");
    }
    patchNextTick();
    var crypto;
    try {
      crypto = __require("crypto");
    } catch (err) {}
    if (crypto) {
      var nativeRandomBytes_1 = crypto.randomBytes;
      crypto.randomBytes = function randomBytesZone(size, callback) {
        if (!callback) {
          return nativeRandomBytes_1(size);
        } else {
          var zone = Zone.current;
          var source = crypto.constructor.name + ".randomBytes";
          return nativeRandomBytes_1(size, zone.wrap(callback, source));
        }
      }.bind(crypto);
      var nativePbkdf2_1 = crypto.pbkdf2;
      crypto.pbkdf2 = function pbkdf2Zone() {
        var args = [];
        for (var _i = 0;_i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var fn = args[args.length - 1];
        if (typeof fn === "function") {
          var zone = Zone.current;
          var source = crypto.constructor.name + ".pbkdf2";
          args[args.length - 1] = zone.wrap(fn, source);
          return nativePbkdf2_1.apply(undefined, args);
        } else {
          return nativePbkdf2_1.apply(undefined, args);
        }
      }.bind(crypto);
    }
    var httpClient;
    try {
      httpClient = __require("_http_client");
    } catch (err) {}
    if (httpClient && httpClient.ClientRequest) {
      var ClientRequest_1 = httpClient.ClientRequest.bind(httpClient);
      httpClient.ClientRequest = function(options, callback) {
        if (!callback) {
          return new ClientRequest_1(options);
        } else {
          var zone = Zone.current;
          return new ClientRequest_1(options, zone.wrap(callback, "http.ClientRequest"));
        }
      };
    }
    function patchNextTick() {
      var setNative = null;
      function scheduleTask(task) {
        var args = task.data;
        args[0] = function() {
          task.invoke.apply(this, arguments);
        };
        setNative.apply(process, args);
        return task;
      }
      setNative = patchMethod(process, "nextTick", function(delegate) {
        return function(self2, args) {
          if (typeof args[0] === "function") {
            var zone = Zone.current;
            var task = zone.scheduleMicroTask("nextTick", args[0], args, scheduleTask);
            return task;
          } else {
            return delegate.apply(process, args);
          }
        };
      });
    }
  });
});

// node_modules/applicationinsights/AutoCollection/CorrelationContextManager.js
var require_CorrelationContextManager = __commonJS((exports) => {
  var Util = require_Util();
  var CorrelationContextManager = function() {
    function CorrelationContextManager2() {}
    CorrelationContextManager2.getCurrentContext = function() {
      if (!CorrelationContextManager2.enabled) {
        return null;
      }
      return Zone.current.get("context");
    };
    CorrelationContextManager2.generateContextObject = function(parentId, operationName, operationId) {
      operationId = operationId || Util.newGuid();
      parentId = parentId || operationId;
      if (this.enabled) {
        return {
          operation: {
            name: operationName,
            id: operationId,
            parentId
          },
          customProperties: {}
        };
      }
      return null;
    };
    CorrelationContextManager2.runWithContext = function(context, fn) {
      if (CorrelationContextManager2.enabled) {
        var newZone = Zone.current.fork({
          name: "AI-" + (context && context.operation.parentId || "Unknown"),
          properties: { context }
        });
        newZone.run(fn);
      } else {
        fn();
      }
    };
    CorrelationContextManager2.wrapCallback = function(fn) {
      if (CorrelationContextManager2.enabled) {
        return Zone.current.wrap(fn, "User-wrapped method");
      }
      return fn;
    };
    CorrelationContextManager2.enable = function() {
      if (!this.isNodeVersionCompatible()) {
        this.enabled = false;
        return;
      }
      require_zone_node();
      if (!this.hasEverEnabled) {
        this.hasEverEnabled = true;
        this.patchError();
        this.patchTimers(["setTimeout", "setInterval"]);
        this.patchRedis();
      }
      this.enabled = true;
    };
    CorrelationContextManager2.disable = function() {
      this.enabled = false;
    };
    CorrelationContextManager2.isNodeVersionCompatible = function() {
      var nodeVer = process.versions.node.split(".");
      return parseInt(nodeVer[0]) > 3 || parseInt(nodeVer[0]) > 2 && parseInt(nodeVer[1]) > 2;
    };
    CorrelationContextManager2.requireForPatch = function(module2) {
      var req = null;
      try {
        req = __require(module2);
      } catch (e) {
        return null;
      }
      return req;
    };
    CorrelationContextManager2.patchRedis = function() {
      var redis = this.requireForPatch("redis");
      if (redis && redis.RedisClient) {
        var orig = redis.RedisClient.prototype.send_command;
        redis.RedisClient.prototype.send_command = function() {
          var args = Array.prototype.slice.call(arguments);
          var lastArg = args[args.length - 1];
          if (typeof lastArg === "function") {
            args[args.length - 1] = Zone.current.wrap(lastArg, "AI.CCM.patchRedis");
          } else if (lastArg instanceof Array && typeof lastArg[lastArg.length - 1] === "function") {
            var lastIndexLastArg = lastArg[lastArg.length - 1];
            lastArg[lastArg.length - 1] = Zone.current.wrap(lastIndexLastArg, "AI.CCM.patchRedis");
          }
          return orig.apply(this, args);
        };
      }
    };
    CorrelationContextManager2.patchTimers = function(methodNames) {
      methodNames.forEach(function(methodName) {
        var orig = global[methodName];
        global[methodName] = function() {
          var ret = orig.apply(this, arguments);
          ret.toString = function() {
            if (this.data && typeof this.data.handleId !== "undefined") {
              return this.data.handleId.toString();
            } else {
              return Object.prototype.toString.call(this);
            }
          };
          return ret;
        };
      });
    };
    CorrelationContextManager2.patchError = function() {
      var orig = global.Error;
      function AppInsightsAsyncCorrelatedErrorWrapper() {
        if (!(this instanceof AppInsightsAsyncCorrelatedErrorWrapper)) {
          return AppInsightsAsyncCorrelatedErrorWrapper.apply(Object.create(AppInsightsAsyncCorrelatedErrorWrapper.prototype), arguments);
        }
        orig.apply(this, arguments);
        var props2 = Object.getOwnPropertyNames(this).concat(Object.keys(this));
        for (var i2 = 0;i2 < props2.length; i2++) {
          var propertyName2 = props2[i2];
          var hiddenPropertyName = Zone["__symbol__"](propertyName2);
          Object.defineProperty(this, propertyName2, { enumerable: false });
          Object.defineProperty(this, hiddenPropertyName, { enumerable: false, writable: true });
        }
        return this;
      }
      AppInsightsAsyncCorrelatedErrorWrapper.prototype = orig.prototype;
      var props = Object.getOwnPropertyNames(orig);
      for (var i = 0;i < props.length; i++) {
        var propertyName = props[i];
        if (!AppInsightsAsyncCorrelatedErrorWrapper[propertyName]) {
          Object.defineProperty(AppInsightsAsyncCorrelatedErrorWrapper, propertyName, Object.getOwnPropertyDescriptor(orig, propertyName));
        }
      }
      global.Error = AppInsightsAsyncCorrelatedErrorWrapper;
    };
    CorrelationContextManager2.enabled = false;
    CorrelationContextManager2.hasEverEnabled = false;
    return CorrelationContextManager2;
  }();
  exports.CorrelationContextManager = CorrelationContextManager;
});

// node_modules/applicationinsights/AutoCollection/Console.js
var require_Console = __commonJS((exports, module) => {
  var AutoCollectConsole = function() {
    function AutoCollectConsole2(client) {
      if (!!AutoCollectConsole2.INSTANCE) {
        throw new Error("Console logging adapter tracking should be configured from the applicationInsights object");
      }
      this._client = client;
      AutoCollectConsole2.INSTANCE = this;
    }
    AutoCollectConsole2.prototype.enable = function(isEnabled) {};
    AutoCollectConsole2.prototype.isInitialized = function() {
      return this._isInitialized;
    };
    AutoCollectConsole2.prototype.dispose = function() {
      AutoCollectConsole2.INSTANCE = null;
    };
    AutoCollectConsole2._methodNames = ["debug", "info", "log", "warn", "error"];
    return AutoCollectConsole2;
  }();
  module.exports = AutoCollectConsole;
});

// node_modules/applicationinsights/Library/Contracts.js
var require_Contracts = __commonJS((exports) => {
  var __extends = exports && exports.__extends || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __);
  };
  (function(Contracts2) {
    (function(DataPointType2) {
      DataPointType2[DataPointType2["Measurement"] = 0] = "Measurement";
      DataPointType2[DataPointType2["Aggregation"] = 1] = "Aggregation";
    })(Contracts2.DataPointType || (Contracts2.DataPointType = {}));
    var DataPointType = Contracts2.DataPointType;
    (function(SeverityLevel2) {
      SeverityLevel2[SeverityLevel2["Verbose"] = 0] = "Verbose";
      SeverityLevel2[SeverityLevel2["Information"] = 1] = "Information";
      SeverityLevel2[SeverityLevel2["Warning"] = 2] = "Warning";
      SeverityLevel2[SeverityLevel2["Error"] = 3] = "Error";
      SeverityLevel2[SeverityLevel2["Critical"] = 4] = "Critical";
    })(Contracts2.SeverityLevel || (Contracts2.SeverityLevel = {}));
    Contracts2.SeverityLevel;
    var ContextTagKeys = function() {
      function ContextTagKeys2() {
        this.applicationVersion = "ai.application.ver";
        this.deviceId = "ai.device.id";
        this.deviceLocale = "ai.device.locale";
        this.deviceModel = "ai.device.model";
        this.deviceOEMName = "ai.device.oemName";
        this.deviceOSVersion = "ai.device.osVersion";
        this.deviceType = "ai.device.type";
        this.locationIp = "ai.location.ip";
        this.operationId = "ai.operation.id";
        this.operationName = "ai.operation.name";
        this.operationParentId = "ai.operation.parentId";
        this.operationSyntheticSource = "ai.operation.syntheticSource";
        this.operationCorrelationVector = "ai.operation.correlationVector";
        this.sessionId = "ai.session.id";
        this.sessionIsFirst = "ai.session.isFirst";
        this.userAccountId = "ai.user.accountId";
        this.userAgent = "ai.user.userAgent";
        this.userId = "ai.user.id";
        this.userAuthUserId = "ai.user.authUserId";
        this.cloudRole = "ai.cloud.role";
        this.cloudRoleInstance = "ai.cloud.roleInstance";
        this.internalSdkVersion = "ai.internal.sdkVersion";
        this.internalAgentVersion = "ai.internal.agentVersion";
        this.internalNodeName = "ai.internal.nodeName";
      }
      return ContextTagKeys2;
    }();
    Contracts2.ContextTagKeys = ContextTagKeys;
    var Domain = function() {
      function Domain2() {}
      return Domain2;
    }();
    Contracts2.Domain = Domain;
    var Data = function() {
      function Data2() {}
      return Data2;
    }();
    Contracts2.Data = Data;
    var Envelope = function() {
      function Envelope2() {
        this.ver = 1;
        this.name = "";
        this.time = "";
        this.sampleRate = 100;
        this.tags = {};
      }
      return Envelope2;
    }();
    Contracts2.Envelope = Envelope;
    var EventData = function(_super) {
      __extends(EventData2, _super);
      function EventData2() {
        _super.call(this);
        this.ver = 2;
        this.properties = {};
        this.measurements = {};
        _super.call(this);
      }
      return EventData2;
    }(Contracts2.Domain);
    Contracts2.EventData = EventData;
    var MessageData = function(_super) {
      __extends(MessageData2, _super);
      function MessageData2() {
        _super.call(this);
        this.ver = 2;
        this.properties = {};
        _super.call(this);
      }
      return MessageData2;
    }(Contracts2.Domain);
    Contracts2.MessageData = MessageData;
    var ExceptionData = function(_super) {
      __extends(ExceptionData2, _super);
      function ExceptionData2() {
        _super.call(this);
        this.ver = 2;
        this.exceptions = [];
        this.properties = {};
        this.measurements = {};
      }
      return ExceptionData2;
    }(Contracts2.Domain);
    Contracts2.ExceptionData = ExceptionData;
    var StackFrame = function() {
      function StackFrame2() {}
      return StackFrame2;
    }();
    Contracts2.StackFrame = StackFrame;
    var ExceptionDetails = function() {
      function ExceptionDetails2() {
        this.hasFullStack = true;
        this.parsedStack = [];
      }
      return ExceptionDetails2;
    }();
    Contracts2.ExceptionDetails = ExceptionDetails;
    var DataPoint = function() {
      function DataPoint2() {
        this.kind = Contracts2.DataPointType.Measurement;
      }
      return DataPoint2;
    }();
    Contracts2.DataPoint = DataPoint;
    var MetricData = function(_super) {
      __extends(MetricData2, _super);
      function MetricData2() {
        _super.call(this);
        this.ver = 2;
        this.metrics = [];
        this.properties = {};
        _super.call(this);
      }
      return MetricData2;
    }(Contracts2.Domain);
    Contracts2.MetricData = MetricData;
    var PageViewData = function(_super) {
      __extends(PageViewData2, _super);
      function PageViewData2() {
        _super.call(this);
        this.ver = 2;
        this.properties = {};
        this.measurements = {};
        _super.call(this);
      }
      return PageViewData2;
    }(Contracts2.EventData);
    Contracts2.PageViewData = PageViewData;
    var PageViewPerfData = function(_super) {
      __extends(PageViewPerfData2, _super);
      function PageViewPerfData2() {
        _super.call(this);
        this.ver = 2;
        this.properties = {};
        this.measurements = {};
      }
      return PageViewPerfData2;
    }(Contracts2.PageViewData);
    Contracts2.PageViewPerfData = PageViewPerfData;
    var RemoteDependencyDataConstants = function() {
      function RemoteDependencyDataConstants2() {}
      RemoteDependencyDataConstants2.TYPE_HTTP = "Http";
      return RemoteDependencyDataConstants2;
    }();
    Contracts2.RemoteDependencyDataConstants = RemoteDependencyDataConstants;
    var RemoteDependencyData = function(_super) {
      __extends(RemoteDependencyData2, _super);
      function RemoteDependencyData2() {
        _super.call(this);
        this.ver = 2;
        this.success = true;
        this.properties = {};
        this.measurements = {};
      }
      return RemoteDependencyData2;
    }(Contracts2.Domain);
    Contracts2.RemoteDependencyData = RemoteDependencyData;
    var AjaxCallData = function(_super) {
      __extends(AjaxCallData2, _super);
      function AjaxCallData2() {
        _super.call(this);
        this.ver = 2;
        this.properties = {};
        this.measurements = {};
        _super.call(this);
      }
      return AjaxCallData2;
    }(Contracts2.PageViewData);
    Contracts2.AjaxCallData = AjaxCallData;
    var RequestData = function(_super) {
      __extends(RequestData2, _super);
      function RequestData2() {
        _super.call(this);
        this.ver = 2;
        this.properties = {};
        this.measurements = {};
      }
      return RequestData2;
    }(Contracts2.Domain);
    Contracts2.RequestData = RequestData;
    var PerformanceCounterData = function(_super) {
      __extends(PerformanceCounterData2, _super);
      function PerformanceCounterData2() {
        _super.call(this);
        this.ver = 2;
        this.kind = DataPointType.Aggregation;
        this.properties = {};
        _super.call(this);
      }
      return PerformanceCounterData2;
    }(Contracts2.Domain);
    Contracts2.PerformanceCounterData = PerformanceCounterData;
  })(exports.Contracts || (exports.Contracts = {}));
});

// node_modules/applicationinsights/AutoCollection/Exceptions.js
var require_Exceptions = __commonJS((exports, module) => {
  var ContractsModule = require_Contracts();
  var Util = require_Util();
  var AutoCollectExceptions = function() {
    function AutoCollectExceptions2(client) {
      if (!!AutoCollectExceptions2.INSTANCE) {
        throw new Error("Exception tracking should be configured from the applicationInsights object");
      }
      AutoCollectExceptions2.INSTANCE = this;
      this._client = client;
    }
    AutoCollectExceptions2.prototype.isInitialized = function() {
      return this._isInitialized;
    };
    AutoCollectExceptions2.prototype.enable = function(isEnabled) {
      var _this = this;
      if (isEnabled) {
        this._isInitialized = true;
        if (!this._exceptionListenerHandle) {
          var handle = function(reThrow, error) {
            var data = AutoCollectExceptions2.getExceptionData(error, false);
            var envelope = _this._client.getEnvelope(data);
            _this._client.channel.handleCrash(envelope);
            if (reThrow) {
              throw error;
            }
          };
          this._exceptionListenerHandle = handle.bind(this, true);
          this._rejectionListenerHandle = handle.bind(this, false);
          process.on("uncaughtException", this._exceptionListenerHandle);
          process.on("unhandledRejection", this._rejectionListenerHandle);
        }
      } else {
        if (this._exceptionListenerHandle) {
          process.removeListener("uncaughtException", this._exceptionListenerHandle);
          process.removeListener("unhandledRejection", this._rejectionListenerHandle);
          this._exceptionListenerHandle = undefined;
          this._rejectionListenerHandle = undefined;
          delete this._exceptionListenerHandle;
          delete this._rejectionListenerHandle;
        }
      }
    };
    AutoCollectExceptions2.getExceptionData = function(error, isHandled, properties, measurements) {
      var exception = new ContractsModule.Contracts.ExceptionData;
      exception.properties = properties;
      exception.severityLevel = ContractsModule.Contracts.SeverityLevel.Error;
      exception.measurements = measurements;
      exception.exceptions = [];
      var stack = error["stack"];
      var exceptionDetails = new ContractsModule.Contracts.ExceptionDetails;
      exceptionDetails.message = error.message;
      exceptionDetails.typeName = error.name;
      exceptionDetails.parsedStack = this.parseStack(stack);
      exceptionDetails.hasFullStack = Util.isArray(exceptionDetails.parsedStack) && exceptionDetails.parsedStack.length > 0;
      exception.exceptions.push(exceptionDetails);
      var data = new ContractsModule.Contracts.Data;
      data.baseType = "Microsoft.ApplicationInsights.ExceptionData";
      data.baseData = exception;
      return data;
    };
    AutoCollectExceptions2.parseStack = function(stack) {
      var parsedStack = undefined;
      if (typeof stack === "string") {
        var frames = stack.split(`
`);
        parsedStack = [];
        var level = 0;
        var totalSizeInBytes = 0;
        for (var i = 0;i <= frames.length; i++) {
          var frame = frames[i];
          if (_StackFrame.regex.test(frame)) {
            var parsedFrame = new _StackFrame(frames[i], level++);
            totalSizeInBytes += parsedFrame.sizeInBytes;
            parsedStack.push(parsedFrame);
          }
        }
        var exceptionParsedStackThreshold = 32 * 1024;
        if (totalSizeInBytes > exceptionParsedStackThreshold) {
          var left = 0;
          var right = parsedStack.length - 1;
          var size = 0;
          var acceptedLeft = left;
          var acceptedRight = right;
          while (left < right) {
            var lSize = parsedStack[left].sizeInBytes;
            var rSize = parsedStack[right].sizeInBytes;
            size += lSize + rSize;
            if (size > exceptionParsedStackThreshold) {
              var howMany = acceptedRight - acceptedLeft + 1;
              parsedStack.splice(acceptedLeft, howMany);
              break;
            }
            acceptedLeft = left;
            acceptedRight = right;
            left++;
            right--;
          }
        }
      }
      return parsedStack;
    };
    AutoCollectExceptions2.prototype.dispose = function() {
      AutoCollectExceptions2.INSTANCE = null;
      this._isInitialized = false;
    };
    AutoCollectExceptions2.INSTANCE = null;
    return AutoCollectExceptions2;
  }();
  var _StackFrame = function() {
    function _StackFrame2(frame, level) {
      this.sizeInBytes = 0;
      this.level = level;
      this.method = "<no_method>";
      this.assembly = Util.trim(frame);
      var matches = frame.match(_StackFrame2.regex);
      if (matches && matches.length >= 5) {
        this.method = Util.trim(matches[2]) || this.method;
        this.fileName = Util.trim(matches[4]) || "<no_filename>";
        this.line = parseInt(matches[5]) || 0;
      }
      this.sizeInBytes += this.method.length;
      this.sizeInBytes += this.fileName.length;
      this.sizeInBytes += this.assembly.length;
      this.sizeInBytes += _StackFrame2.baseSize;
      this.sizeInBytes += this.level.toString().length;
      this.sizeInBytes += this.line.toString().length;
    }
    _StackFrame2.regex = /^([\s]+at)?(.*?)(\@|\s\(|\s)([^\(\@\n]+):([0-9]+):([0-9]+)(\)?)$/;
    _StackFrame2.baseSize = 58;
    return _StackFrame2;
  }();
  module.exports = AutoCollectExceptions;
});

// node_modules/applicationinsights/AutoCollection/Performance.js
var require_Performance = __commonJS((exports, module) => {
  var http = __require("http");
  var os = __require("os");
  var ContractsModule = require_Contracts();
  var Logging = require_Logging();
  var PerfCounterType;
  (function(PerfCounterType2) {
    PerfCounterType2[PerfCounterType2["ProcessorTime"] = 0] = "ProcessorTime";
    PerfCounterType2[PerfCounterType2["AvailableMemory"] = 1] = "AvailableMemory";
    PerfCounterType2[PerfCounterType2["RequestsPerSec"] = 2] = "RequestsPerSec";
    PerfCounterType2[PerfCounterType2["PrivateBytes"] = 3] = "PrivateBytes";
    PerfCounterType2[PerfCounterType2["RequestExecutionTime"] = 4] = "RequestExecutionTime";
    PerfCounterType2[PerfCounterType2["PercentProcessorTime"] = 5] = "PercentProcessorTime";
  })(PerfCounterType || (PerfCounterType = {}));
  var AutoCollectPerformance = function() {
    function AutoCollectPerformance2(client) {
      if (!!AutoCollectPerformance2.INSTANCE) {
        throw new Error("Performance tracking should be configured from the applicationInsights object");
      }
      AutoCollectPerformance2.INSTANCE = this;
      this._isInitialized = false;
      this._client = client;
    }
    AutoCollectPerformance2.prototype.enable = function(isEnabled) {
      var _this = this;
      this._isEnabled = isEnabled;
      if (this._isEnabled && !this._isInitialized) {
        this._initialize();
      }
      if (isEnabled) {
        if (!this._handle) {
          this._lastCpus = os.cpus();
          this._lastRequests = {
            totalRequestCount: AutoCollectPerformance2._totalRequestCount,
            totalFailedRequestCount: AutoCollectPerformance2._totalFailedRequestCount,
            time: +new Date
          };
          this._handle = setInterval(function() {
            return _this.trackPerformance();
          }, 1e4);
        }
      } else {
        if (this._handle) {
          clearInterval(this._handle);
          this._handle = undefined;
        }
      }
    };
    AutoCollectPerformance2.prototype.isInitialized = function() {
      return this._isInitialized;
    };
    AutoCollectPerformance2.prototype._initialize = function() {
      var _this = this;
      this._isInitialized = true;
      var originalServer = http.createServer;
      http.createServer = function(onRequest) {
        return originalServer(function(request, response) {
          if (_this._isEnabled) {
            AutoCollectPerformance2.countRequest(request, response);
          }
          if (typeof onRequest === "function") {
            onRequest(request, response);
          }
        });
      };
    };
    AutoCollectPerformance2.countRequest = function(request, response) {
      var _this = this;
      var start = +new Date;
      if (!request || !response) {
        Logging.warn("AutoCollectPerformance.countRequest was called with invalid parameters: ", !!request, !!response);
        return;
      }
      if (typeof response.once === "function") {
        response.once("finish", function() {
          var end = +new Date;
          _this._lastRequestExecutionTime = end - start;
          AutoCollectPerformance2._totalRequestCount++;
          if (response.statusCode >= 400) {
            AutoCollectPerformance2._totalFailedRequestCount++;
          }
        });
      }
    };
    AutoCollectPerformance2.prototype.trackPerformance = function() {
      this._trackCpu();
      this._trackMemory();
      this._trackNetwork();
    };
    AutoCollectPerformance2.prototype._trackLegacyPerformance = function(counterType, value) {
      var perfmetric = new ContractsModule.Contracts.PerformanceCounterData;
      switch (counterType) {
        case PerfCounterType.ProcessorTime:
          perfmetric.categoryName = "Process";
          perfmetric.counterName = "% Processor Time";
          break;
        case PerfCounterType.AvailableMemory:
          perfmetric.categoryName = "Memory";
          perfmetric.counterName = "Available Bytes";
          break;
        case PerfCounterType.RequestsPerSec:
          perfmetric.categoryName = "ASP.NET Applications";
          perfmetric.counterName = "Requests/Sec";
          break;
        case PerfCounterType.PrivateBytes:
          perfmetric.categoryName = "Process";
          perfmetric.counterName = "Private Bytes";
          break;
        case PerfCounterType.RequestExecutionTime:
          perfmetric.categoryName = "ASP.NET Applications";
          perfmetric.counterName = "Request Execution Time";
          break;
        case PerfCounterType.PercentProcessorTime:
          perfmetric.categoryName = "Processor";
          perfmetric.counterName = "% Processor Time";
          break;
      }
      perfmetric.count = 1;
      perfmetric.kind = ContractsModule.Contracts.DataPointType.Aggregation;
      perfmetric.max = value;
      perfmetric.min = value;
      perfmetric.stdDev = 0;
      perfmetric.value = value;
      var data = new ContractsModule.Contracts.Data;
      data.baseType = "Microsoft.ApplicationInsights.PerformanceCounterData";
      data.baseData = perfmetric;
      this._client.track(data);
    };
    AutoCollectPerformance2.prototype._trackCpu = function() {
      var cpus = os.cpus();
      if (cpus && cpus.length && this._lastCpus && cpus.length === this._lastCpus.length) {
        var totalUser = 0;
        var totalSys = 0;
        var totalNice = 0;
        var totalIdle = 0;
        var totalIrq = 0;
        for (var i = 0;!!cpus && i < cpus.length; i++) {
          var cpu = cpus[i];
          var lastCpu = this._lastCpus[i];
          var name = "% cpu(" + i + ") ";
          cpu.model;
          cpu.speed;
          var times = cpu.times;
          var lastTimes = lastCpu.times;
          var user = times.user - lastTimes.user || 0;
          totalUser += user;
          var sys = times.sys - lastTimes.sys || 0;
          totalSys += sys;
          var nice = times.nice - lastTimes.nice || 0;
          totalNice += nice;
          var idle = times.idle - lastTimes.idle || 0;
          totalIdle += idle;
          var irq = times.irq - lastTimes.irq || 0;
          totalIrq += irq;
          var total = user + sys + nice + idle + irq || 1;
          this._client.trackMetric(name + "user", user / total);
        }
        var combinedName = "% total cpu ";
        var combinedTotal = totalUser + totalSys + totalNice + totalIdle + totalIrq || 1;
        this._client.trackMetric(combinedName + "user", totalUser / combinedTotal);
        this._client.trackMetric(combinedName + "sys", totalSys / combinedTotal);
        this._client.trackMetric(combinedName + "nice", totalNice / combinedTotal);
        this._client.trackMetric(combinedName + "idle", totalIdle / combinedTotal);
        this._client.trackMetric(combinedName + "irq", totalIrq / combinedTotal);
        this._trackLegacyPerformance(PerfCounterType.ProcessorTime, totalUser / combinedTotal);
        this._trackLegacyPerformance(PerfCounterType.PercentProcessorTime, (combinedTotal - totalIdle) / combinedTotal);
      }
      this._lastCpus = cpus;
    };
    AutoCollectPerformance2.prototype._trackMemory = function() {
      var totalMem = os.totalmem();
      var freeMem = os.freemem();
      var usedMem = totalMem - freeMem;
      var percentUsedMem = usedMem / (totalMem || 1);
      var percentAvailableMem = freeMem / (totalMem || 1);
      this._client.trackMetric("Memory Used", usedMem);
      this._client.trackMetric("Memory Free", freeMem);
      this._client.trackMetric("Memory Total", totalMem);
      this._client.trackMetric("% Memory Used", percentUsedMem);
      this._client.trackMetric("% Memory Free", percentAvailableMem);
      this._trackLegacyPerformance(PerfCounterType.AvailableMemory, freeMem);
      this._trackLegacyPerformance(PerfCounterType.PrivateBytes, usedMem);
    };
    AutoCollectPerformance2.prototype._trackNetwork = function() {
      var lastRequests = this._lastRequests;
      var requests = {
        totalRequestCount: AutoCollectPerformance2._totalRequestCount,
        totalFailedRequestCount: AutoCollectPerformance2._totalFailedRequestCount,
        time: +new Date
      };
      var intervalRequests = requests.totalRequestCount - lastRequests.totalRequestCount || 0;
      var intervalFailedRequests = requests.totalFailedRequestCount - lastRequests.totalFailedRequestCount || 0;
      var elapsedMs = requests.time - lastRequests.time;
      var elapsedSeconds = elapsedMs / 1000;
      if (elapsedMs > 0) {
        var requestsPerSec = intervalRequests / elapsedSeconds;
        var failedRequestsPerSec = intervalFailedRequests / elapsedSeconds;
        this._client.trackMetric("Total Requests", requests.totalRequestCount);
        this._client.trackMetric("Total Failed Requests", requests.totalFailedRequestCount);
        this._client.trackMetric("Requests per Second", requestsPerSec);
        this._client.trackMetric("Failed Requests per Second", failedRequestsPerSec);
        this._client.trackMetric("Last Request Execution Time", AutoCollectPerformance2._lastRequestExecutionTime);
        this._trackLegacyPerformance(PerfCounterType.RequestsPerSec, requestsPerSec);
        this._trackLegacyPerformance(PerfCounterType.RequestExecutionTime, AutoCollectPerformance2._lastRequestExecutionTime);
      }
      this._lastRequests = requests;
    };
    AutoCollectPerformance2.prototype.dispose = function() {
      AutoCollectPerformance2.INSTANCE = null;
      this._isInitialized = false;
    };
    AutoCollectPerformance2._totalRequestCount = 0;
    AutoCollectPerformance2._totalFailedRequestCount = 0;
    AutoCollectPerformance2._lastRequestExecutionTime = 0;
    return AutoCollectPerformance2;
  }();
  module.exports = AutoCollectPerformance;
});

// node_modules/applicationinsights/Library/RequestResponseHeaders.js
var require_RequestResponseHeaders = __commonJS((exports, module) => {
  module.exports = {
    sourceInstrumentationKeyHeader: "x-ms-request-source-ikey",
    targetInstrumentationKeyHeader: "x-ms-request-target-ikey",
    parentIdHeader: "x-ms-request-id",
    rootIdHeader: "x-ms-request-root-id"
  };
});

// node_modules/applicationinsights/AutoCollection/RequestParser.js
var require_RequestParser = __commonJS((exports, module) => {
  var RequestParser = function() {
    function RequestParser2() {}
    RequestParser2.prototype.getUrl = function() {
      return this.url;
    };
    RequestParser2.prototype.RequestParser = function() {
      this.startTime = +new Date;
    };
    RequestParser2.prototype._setStatus = function(status, error, properties) {
      var endTime = +new Date;
      this.duration = endTime - this.startTime;
      this.statusCode = status;
      if (error) {
        if (!properties) {
          properties = {};
        }
        if (typeof error === "string") {
          properties["error"] = error;
        } else if (error instanceof Error) {
          properties["error"] = error.message;
        } else if (typeof error === "object") {
          for (var key in error) {
            properties[key] = error[key] && error[key].toString && error[key].toString();
          }
        }
      }
      this.properties = properties;
    };
    RequestParser2.prototype._isSuccess = function() {
      return 0 < this.statusCode && this.statusCode < 400;
    };
    return RequestParser2;
  }();
  module.exports = RequestParser;
});

// node_modules/applicationinsights/AutoCollection/ClientRequestParser.js
var require_ClientRequestParser = __commonJS((exports, module) => {
  var __extends = exports && exports.__extends || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __);
  };
  var url = __require("url");
  var ContractsModule = require_Contracts();
  var Util = require_Util();
  var RequestResponseHeaders = require_RequestResponseHeaders();
  var RequestParser = require_RequestParser();
  var ClientRequestParser = function(_super) {
    __extends(ClientRequestParser2, _super);
    function ClientRequestParser2(requestOptions, request) {
      _super.call(this);
      if (request && request.method && requestOptions) {
        this.method = request.method;
        this.url = ClientRequestParser2._getUrlFromRequestOptions(requestOptions, request);
        this.startTime = +new Date;
      }
    }
    ClientRequestParser2.prototype.onError = function(error, properties) {
      this._setStatus(undefined, error, properties);
    };
    ClientRequestParser2.prototype.onResponse = function(response, properties) {
      this._setStatus(response.statusCode, undefined, properties);
      this.targetIKeyHash = response.headers && response.headers[RequestResponseHeaders.targetInstrumentationKeyHeader];
    };
    ClientRequestParser2.prototype.getDependencyData = function() {
      var urlObject = url.parse(this.url);
      urlObject.search = undefined;
      urlObject.hash = undefined;
      var dependencyName = this.method.toUpperCase() + " " + urlObject.pathname;
      var remoteDependency = new ContractsModule.Contracts.RemoteDependencyData;
      remoteDependency.type = ContractsModule.Contracts.RemoteDependencyDataConstants.TYPE_HTTP;
      if (this.targetIKeyHash) {
        remoteDependency.type = "ApplicationInsights";
        remoteDependency.target = urlObject.hostname + " | " + this.targetIKeyHash;
      } else {
        remoteDependency.type = ContractsModule.Contracts.RemoteDependencyDataConstants.TYPE_HTTP;
        remoteDependency.target = urlObject.hostname;
      }
      remoteDependency.name = dependencyName;
      remoteDependency.data = this.url;
      remoteDependency.duration = Util.msToTimeSpan(this.duration);
      remoteDependency.success = this._isSuccess();
      remoteDependency.resultCode = this.statusCode ? this.statusCode.toString() : null;
      remoteDependency.properties = this.properties || {};
      var data = new ContractsModule.Contracts.Data;
      data.baseType = "Microsoft.ApplicationInsights.RemoteDependencyData";
      data.baseData = remoteDependency;
      return data;
    };
    ClientRequestParser2._getUrlFromRequestOptions = function(options, request) {
      if (typeof options === "string") {
        options = url.parse(options);
      } else {
        var originalOptions_1 = options;
        options = {};
        if (originalOptions_1) {
          Object.keys(originalOptions_1).forEach(function(key) {
            options[key] = originalOptions_1[key];
          });
        }
      }
      if (options.path) {
        var parsedQuery = url.parse(options.path);
        options.pathname = parsedQuery.pathname;
        options.search = parsedQuery.search;
      }
      if (options.host && options.port) {
        var parsedHost = url.parse("http://" + options.host);
        if (!parsedHost.port && options.port) {
          options.hostname = options.host;
          delete options.host;
        }
      }
      options.protocol = options.protocol || request.agent.protocol;
      options.hostname = options.hostname || "localhost";
      return url.format(options);
    };
    return ClientRequestParser2;
  }(RequestParser);
  module.exports = ClientRequestParser;
});

// node_modules/applicationinsights/AutoCollection/ClientRequests.js
var require_ClientRequests = __commonJS((exports, module) => {
  var http = __require("http");
  var https = __require("https");
  var Logging = require_Logging();
  var Util = require_Util();
  var RequestResponseHeaders = require_RequestResponseHeaders();
  var ClientRequestParser = require_ClientRequestParser();
  var AutoCollectClientRequests = function() {
    function AutoCollectClientRequests2(client) {
      if (!!AutoCollectClientRequests2.INSTANCE) {
        throw new Error("Client request tracking should be configured from the applicationInsights object");
      }
      AutoCollectClientRequests2.INSTANCE = this;
      this._client = client;
    }
    AutoCollectClientRequests2.prototype.enable = function(isEnabled) {
      this._isEnabled = isEnabled;
      if (this._isEnabled && !this._isInitialized) {
        this._initialize();
      }
    };
    AutoCollectClientRequests2.prototype.isInitialized = function() {
      return this._isInitialized;
    };
    AutoCollectClientRequests2.prototype._initialize = function() {
      var _this = this;
      this._isInitialized = true;
      var originalRequest = http.request;
      http.request = function(options) {
        var requestArgs = [];
        for (var _i = 1;_i < arguments.length; _i++) {
          requestArgs[_i - 1] = arguments[_i];
        }
        var request = originalRequest.call.apply(originalRequest, [http, options].concat(requestArgs));
        if (request && options && !options[AutoCollectClientRequests2.disableCollectionRequestOption]) {
          AutoCollectClientRequests2.trackRequest(_this._client, options, request);
        }
        return request;
      };
      if (/^0\.([0-9]\.)|(10\.)|(11\.([0-9]|10|11)$)/.test(process.versions.node)) {
        var originalHttpsRequest_1 = https.request;
        https.request = function(options) {
          var requestArgs = [];
          for (var _i = 1;_i < arguments.length; _i++) {
            requestArgs[_i - 1] = arguments[_i];
          }
          var request = originalHttpsRequest_1.call.apply(originalHttpsRequest_1, [https, options].concat(requestArgs));
          if (request && options && !options[AutoCollectClientRequests2.disableCollectionRequestOption]) {
            AutoCollectClientRequests2.trackRequest(_this._client, options, request);
          }
          return request;
        };
      }
    };
    AutoCollectClientRequests2.trackRequest = function(client, requestOptions, request, properties) {
      if (!requestOptions || !request || !client) {
        Logging.info("AutoCollectClientRequests.trackRequest was called with invalid parameters: ", !requestOptions, !request, !client);
        return;
      }
      var requestParser = new ClientRequestParser(requestOptions, request);
      if (client.config && client.config.instrumentationKeyHash && Util.canIncludeCorrelationHeader(client, requestParser.getUrl()) && request["getHeader"] && request["setHeader"] && !request["getHeader"](RequestResponseHeaders.sourceInstrumentationKeyHeader)) {
        request["setHeader"](RequestResponseHeaders.sourceInstrumentationKeyHeader, client.config.instrumentationKeyHash);
      }
      if (request.on) {
        request.on("response", function(response) {
          requestParser.onResponse(response, properties);
          var context = { "http.RequestOptions": requestOptions, "http.ClientRequest": request, "http.ClientResponse": response };
          client.track(requestParser.getDependencyData(), null, context);
        });
        request.on("error", function(e) {
          requestParser.onError(e, properties);
          var context = { "http.RequestOptions": requestOptions, "http.ClientRequest": request, Error: e };
          client.track(requestParser.getDependencyData(), null, context);
        });
      }
    };
    AutoCollectClientRequests2.prototype.dispose = function() {
      AutoCollectClientRequests2.INSTANCE = null;
      this._isInitialized = false;
    };
    AutoCollectClientRequests2.disableCollectionRequestOption = "disableAppInsightsAutoCollection";
    return AutoCollectClientRequests2;
  }();
  module.exports = AutoCollectClientRequests;
});

// node_modules/applicationinsights/AutoCollection/ServerRequestParser.js
var require_ServerRequestParser = __commonJS((exports, module) => {
  var __extends = exports && exports.__extends || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __);
  };
  var url = __require("url");
  var ContractsModule = require_Contracts();
  var Util = require_Util();
  var RequestResponseHeaders = require_RequestResponseHeaders();
  var RequestParser = require_RequestParser();
  var ServerRequestParser = function(_super) {
    __extends(ServerRequestParser2, _super);
    function ServerRequestParser2(request, requestId) {
      _super.call(this);
      if (request) {
        this.requestId = requestId || Util.newGuid();
        this.method = request.method;
        this.url = this._getAbsoluteUrl(request);
        this.startTime = +new Date;
        this.rawHeaders = request.headers || request.rawHeaders;
        this.socketRemoteAddress = request.socket && request.socket.remoteAddress;
        this.userAgent = request.headers && request.headers["user-agent"];
        this.sourceIKeyHash = request.headers && request.headers[RequestResponseHeaders.sourceInstrumentationKeyHeader];
        this.parentId = request.headers && request.headers[RequestResponseHeaders.parentIdHeader];
        this.operationId = request.headers && request.headers[RequestResponseHeaders.rootIdHeader];
        if (request.connection) {
          this.connectionRemoteAddress = request.connection.remoteAddress;
          this.legacySocketRemoteAddress = request.connection["socket"] && request.connection["socket"].remoteAddress;
        }
      }
    }
    ServerRequestParser2.prototype.onError = function(error, properties, ellapsedMilliseconds) {
      this._setStatus(undefined, error, properties);
    };
    ServerRequestParser2.prototype.onResponse = function(response, properties, ellapsedMilliseconds) {
      this._setStatus(response.statusCode, undefined, properties);
      if (ellapsedMilliseconds) {
        this.duration = ellapsedMilliseconds;
      }
    };
    ServerRequestParser2.prototype.getRequestData = function() {
      var requestData = new ContractsModule.Contracts.RequestData;
      requestData.id = this.requestId;
      requestData.name = this.method + " " + url.parse(this.url).pathname;
      requestData.url = this.url;
      requestData.source = this.sourceIKeyHash;
      requestData.duration = Util.msToTimeSpan(this.duration);
      requestData.responseCode = this.statusCode ? this.statusCode.toString() : null;
      requestData.success = this._isSuccess();
      requestData.properties = this.properties;
      var data = new ContractsModule.Contracts.Data;
      data.baseType = "Microsoft.ApplicationInsights.RequestData";
      data.baseData = requestData;
      return data;
    };
    ServerRequestParser2.prototype.getRequestTags = function(tags) {
      var newTags = {};
      for (var key in tags) {
        newTags[key] = tags[key];
      }
      newTags[ServerRequestParser2.keys.locationIp] = tags[ServerRequestParser2.keys.locationIp] || this._getIp();
      newTags[ServerRequestParser2.keys.sessionId] = tags[ServerRequestParser2.keys.sessionId] || this._getId("ai_session");
      newTags[ServerRequestParser2.keys.userId] = tags[ServerRequestParser2.keys.userId] || this._getId("ai_user");
      newTags[ServerRequestParser2.keys.userAgent] = tags[ServerRequestParser2.keys.userAgent] || this.userAgent;
      newTags[ServerRequestParser2.keys.operationName] = this.getOperationName(tags);
      newTags[ServerRequestParser2.keys.operationParentId] = this.getOperationParentId(tags);
      newTags[ServerRequestParser2.keys.operationId] = this.getOperationId(tags);
      return newTags;
    };
    ServerRequestParser2.prototype.getOperationId = function(tags) {
      return tags[ServerRequestParser2.keys.operationId] || this.operationId;
    };
    ServerRequestParser2.prototype.getOperationParentId = function(tags) {
      return tags[ServerRequestParser2.keys.operationParentId] || this.parentId || this.getOperationId(tags);
    };
    ServerRequestParser2.prototype.getOperationName = function(tags) {
      return tags[ServerRequestParser2.keys.operationName] || this.method + " " + url.parse(this.url).pathname;
    };
    ServerRequestParser2.prototype.getRequestId = function() {
      return this.requestId;
    };
    ServerRequestParser2.prototype._getAbsoluteUrl = function(request) {
      if (!request.headers) {
        return request.url;
      }
      var encrypted = request.connection ? request.connection.encrypted : null;
      var requestUrl = url.parse(request.url);
      var pathName = requestUrl.pathname;
      var search = requestUrl.search;
      var absoluteUrl = url.format({
        protocol: encrypted ? "https" : "http",
        host: request.headers.host,
        pathname: pathName,
        search
      });
      return absoluteUrl;
    };
    ServerRequestParser2.prototype._getIp = function() {
      var ipMatch = /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/;
      var check = function(str) {
        var results = ipMatch.exec(str);
        if (results) {
          return results[0];
        }
      };
      var ip = check(this.rawHeaders["x-forwarded-for"]) || check(this.rawHeaders["x-client-ip"]) || check(this.rawHeaders["x-real-ip"]) || check(this.connectionRemoteAddress) || check(this.socketRemoteAddress) || check(this.legacySocketRemoteAddress);
      if (!ip && this.connectionRemoteAddress && this.connectionRemoteAddress.substr && this.connectionRemoteAddress.substr(0, 2) === "::") {
        ip = "127.0.0.1";
      }
      return ip;
    };
    ServerRequestParser2.prototype._getId = function(name) {
      var cookie = this.rawHeaders && this.rawHeaders["cookie"] && typeof this.rawHeaders["cookie"] === "string" && this.rawHeaders["cookie"] || "";
      var value = ServerRequestParser2.parseId(Util.getCookie(name, cookie));
      return value;
    };
    ServerRequestParser2.parseId = function(cookieValue) {
      return cookieValue.substr(0, cookieValue.indexOf("|"));
    };
    ServerRequestParser2.keys = new ContractsModule.Contracts.ContextTagKeys;
    return ServerRequestParser2;
  }(RequestParser);
  module.exports = ServerRequestParser;
});

// node_modules/applicationinsights/AutoCollection/ServerRequests.js
var require_ServerRequests = __commonJS((exports, module) => {
  var http = __require("http");
  var https = __require("https");
  var Logging = require_Logging();
  var Util = require_Util();
  var RequestResponseHeaders = require_RequestResponseHeaders();
  var ServerRequestParser = require_ServerRequestParser();
  var CorrelationContextManager_1 = require_CorrelationContextManager();
  var AutoCollectServerRequests = function() {
    function AutoCollectServerRequests2(client) {
      if (!!AutoCollectServerRequests2.INSTANCE) {
        throw new Error("Server request tracking should be configured from the applicationInsights object");
      }
      AutoCollectServerRequests2.INSTANCE = this;
      this._client = client;
    }
    AutoCollectServerRequests2.prototype.enable = function(isEnabled) {
      this._isEnabled = isEnabled;
      if ((this._isAutoCorrelating || this._isEnabled) && !this._isInitialized) {
        this.useAutoCorrelation(this._isAutoCorrelating);
        this._initialize();
      }
    };
    AutoCollectServerRequests2.prototype.useAutoCorrelation = function(isEnabled) {
      if (isEnabled && !this._isAutoCorrelating) {
        CorrelationContextManager_1.CorrelationContextManager.enable();
      } else if (!isEnabled && this._isAutoCorrelating) {
        CorrelationContextManager_1.CorrelationContextManager.disable();
      }
      this._isAutoCorrelating = isEnabled;
    };
    AutoCollectServerRequests2.prototype.isInitialized = function() {
      return this._isInitialized;
    };
    AutoCollectServerRequests2.prototype.isAutoCorrelating = function() {
      return this._isAutoCorrelating;
    };
    AutoCollectServerRequests2.prototype._generateCorrelationContext = function(requestParser) {
      if (!this._isAutoCorrelating) {
        return;
      }
      return CorrelationContextManager_1.CorrelationContextManager.generateContextObject(requestParser.getRequestId(), requestParser.getOperationName(this._client.context.tags), requestParser.getOperationId(this._client.context.tags));
    };
    AutoCollectServerRequests2.prototype._initialize = function() {
      var _this = this;
      this._isInitialized = true;
      var originalHttpServer = http.createServer;
      http.createServer = function(onRequest) {
        return originalHttpServer(function(request, response) {
          var requestParser = new ServerRequestParser(request);
          var correlationContext = _this._generateCorrelationContext(requestParser);
          CorrelationContextManager_1.CorrelationContextManager.runWithContext(correlationContext, function() {
            if (_this._isEnabled) {
              AutoCollectServerRequests2.trackRequest(_this._client, request, response, null, requestParser);
            }
            if (typeof onRequest === "function") {
              onRequest(request, response);
            }
          });
        });
      };
      var originalHttpsServer = https.createServer;
      https.createServer = function(options, onRequest) {
        return originalHttpsServer(options, function(request, response) {
          var requestParser = new ServerRequestParser(request);
          var correlationContext = _this._generateCorrelationContext(requestParser);
          CorrelationContextManager_1.CorrelationContextManager.runWithContext(correlationContext, function() {
            if (_this._isEnabled) {
              AutoCollectServerRequests2.trackRequest(_this._client, request, response, null, requestParser);
            }
            if (typeof onRequest === "function") {
              onRequest(request, response);
            }
          });
        });
      };
    };
    AutoCollectServerRequests2.trackRequestSync = function(client, request, response, ellapsedMilliseconds, properties, error) {
      if (!request || !response || !client) {
        Logging.info("AutoCollectServerRequests.trackRequestSync was called with invalid parameters: ", !request, !response, !client);
        return;
      }
      AutoCollectServerRequests2.addResponseIKeyHeader(client, response);
      var correlationContext = CorrelationContextManager_1.CorrelationContextManager.getCurrentContext();
      var requestParser = new ServerRequestParser(request, correlationContext && correlationContext.operation.parentId || Util.newGuid());
      if (correlationContext) {
        correlationContext.operation.id = requestParser.getOperationId(client.context.tags) || correlationContext.operation.id;
        correlationContext.operation.name = requestParser.getOperationName(client.context.tags) || correlationContext.operation.name;
        correlationContext.operation.parentId = requestParser.getRequestId() || correlationContext.operation.parentId;
      }
      AutoCollectServerRequests2.endRequest(client, requestParser, request, response, ellapsedMilliseconds, properties, error);
    };
    AutoCollectServerRequests2.trackRequest = function(client, request, response, properties, _requestParser) {
      if (!request || !response || !client) {
        Logging.info("AutoCollectServerRequests.trackRequest was called with invalid parameters: ", !request, !response, !client);
        return;
      }
      var correlationContext = CorrelationContextManager_1.CorrelationContextManager.getCurrentContext();
      var requestParser = _requestParser || new ServerRequestParser(request, correlationContext && correlationContext.operation.parentId || Util.newGuid());
      if (Util.canIncludeCorrelationHeader(client, requestParser.getUrl())) {
        AutoCollectServerRequests2.addResponseIKeyHeader(client, response);
      }
      if (correlationContext && !_requestParser) {
        correlationContext.operation.id = requestParser.getOperationId(client.context.tags) || correlationContext.operation.id;
        correlationContext.operation.name = requestParser.getOperationName(client.context.tags) || correlationContext.operation.name;
        correlationContext.operation.parentId = requestParser.getOperationParentId(client.context.tags) || correlationContext.operation.parentId;
      }
      if (response.once) {
        response.once("finish", function() {
          AutoCollectServerRequests2.endRequest(client, requestParser, request, response, null, properties, null);
        });
      }
      if (request.on) {
        request.on("error", function(error) {
          AutoCollectServerRequests2.endRequest(client, requestParser, request, response, null, properties, error);
        });
      }
    };
    AutoCollectServerRequests2.addResponseIKeyHeader = function(client, response) {
      if (client.config && client.config.instrumentationKeyHash && response.getHeader && response.setHeader && !response.getHeader(RequestResponseHeaders.targetInstrumentationKeyHeader) && !response.headersSent) {
        response.setHeader(RequestResponseHeaders.targetInstrumentationKeyHeader, client.config.instrumentationKeyHash);
      }
    };
    AutoCollectServerRequests2.endRequest = function(client, requestParser, request, response, ellapsedMilliseconds, properties, error) {
      if (error) {
        requestParser.onError(error, properties, ellapsedMilliseconds);
      } else {
        requestParser.onResponse(response, properties, ellapsedMilliseconds);
      }
      var context = { "http.ServerRequest": request, "http.ServerResponse": response };
      var data = requestParser.getRequestData();
      var tags = requestParser.getRequestTags(client.context.tags);
      client.track(data, tags, context);
    };
    AutoCollectServerRequests2.prototype.dispose = function() {
      AutoCollectServerRequests2.INSTANCE = null;
      this._isInitialized = false;
    };
    return AutoCollectServerRequests2;
  }();
  module.exports = AutoCollectServerRequests;
});

// node_modules/applicationinsights/Library/Config.js
var require_Config = __commonJS((exports, module) => {
  var crypto = __require("crypto");
  var Config = function() {
    function Config2(instrumentationKey) {
      this.instrumentationKey = instrumentationKey || Config2._getInstrumentationKey();
      this.instrumentationKeyHash = Config2._getStringHashBase64(this.instrumentationKey);
      this.endpointUrl = "https://dc.services.visualstudio.com/v2/track";
      this.sessionRenewalMs = 30 * 60 * 1000;
      this.sessionExpirationMs = 24 * 60 * 60 * 1000;
      this.maxBatchSize = 250;
      this.maxBatchIntervalMs = 15000;
      this.disableAppInsights = false;
      this.correlationHeaderExcludedDomains = [
        "*.blob.core.windows.net",
        "*.blob.core.chinacloudapi.cn",
        "*.blob.core.cloudapi.de",
        "*.blob.core.usgovcloudapi.net"
      ];
    }
    Config2._getInstrumentationKey = function() {
      var iKey = process.env[Config2.ENV_iKey] || process.env[Config2.ENV_azurePrefix + Config2.ENV_iKey] || process.env[Config2.legacy_ENV_iKey] || process.env[Config2.ENV_azurePrefix + Config2.legacy_ENV_iKey];
      if (!iKey || iKey == "") {
        throw new Error("Instrumentation key not found, pass the key in the config to this method or set the key in the environment variable APPINSIGHTS_INSTRUMENTATIONKEY before starting the server");
      }
      return iKey;
    };
    Config2._getStringHashBase64 = function(value) {
      var hash = crypto.createHash("sha256");
      hash.update(value);
      var result = hash.digest("base64");
      return result;
    };
    Config2.ENV_azurePrefix = "APPSETTING_";
    Config2.ENV_iKey = "APPINSIGHTS_INSTRUMENTATIONKEY";
    Config2.legacy_ENV_iKey = "APPINSIGHTS_INSTRUMENTATION_KEY";
    return Config2;
  }();
  module.exports = Config;
});

// node_modules/applicationinsights/package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "applicationinsights",
    license: "MIT",
    bugs: "https://github.com/Microsoft/ApplicationInsights-node.js/issues",
    version: "0.19.0",
    description: "Microsoft Application Insights module for Node.JS",
    repository: {
      type: "git",
      url: "https://github.com/Microsoft/ApplicationInsights-node.js"
    },
    main: "applicationinsights",
    keywords: [
      "exception monitoring",
      "request monitoring",
      "performance monitoring",
      "application insights",
      "microsoft",
      "azure"
    ],
    contributors: [
      {
        name: "Application Insights Developer Support",
        email: "aidevsupport@microsoft.com"
      },
      {
        name: "kszostak",
        email: "kszostak@microsoft.com"
      },
      {
        name: "southwood",
        url: "https://github.com/southwood"
      },
      {
        name: "bogdanbe",
        email: "bogdanbe@microsoft.com"
      },
      {
        name: "lukim",
        email: "lukim@microsoft.com"
      }
    ],
    scripts: {
      prepublish: "tsc --module commonjs --declaration applicationinsights.ts",
      pretest: 'find Tests -type f -name "*.ts" | xargs tsc --module commonjs',
      test: "./node_modules/mocha/bin/mocha ./Tests --recursive"
    },
    devDependencies: {
      mocha: "3.1.2",
      "node-mocks-http": "1.2.3",
      sinon: "1.17.6",
      typescript: "2.0.10",
      typings: "2.0.0"
    },
    dependencies: {
      "zone.js": "0.7.6"
    }
  };
});

// node_modules/applicationinsights/Library/Context.js
var require_Context = __commonJS((exports, module) => {
  var os = __require("os");
  var ContractsModule = require_Contracts();
  var Logging = require_Logging();
  var Context = function() {
    function Context2(packageJsonPath) {
      this.keys = new ContractsModule.Contracts.ContextTagKeys;
      this.tags = {};
      this._loadApplicationContext();
      this._loadDeviceContext();
      this._loadInternalContext();
    }
    Context2.prototype._loadApplicationContext = function(packageJsonPath) {
      var version = "unknown";
      var description = undefined;
      try {
        var packageJson = __require(packageJsonPath || "../../../package.json");
        if (packageJson) {
          if (typeof packageJson.version === "string") {
            version = packageJson.version;
          }
          if (typeof packageJson.description === "string") {
            description = packageJson.description;
          }
        }
      } catch (exception) {
        Logging.info("unable to read app version: ", exception);
      }
      this.tags[this.keys.applicationVersion] = version;
    };
    Context2.prototype._loadDeviceContext = function() {
      this.tags[this.keys.deviceId] = "";
      this.tags[this.keys.cloudRoleInstance] = os && os.hostname();
      this.tags[this.keys.deviceOSVersion] = os && os.type() + " " + os && os.release();
      this.tags["ai.device.osArchitecture"] = os && os.arch();
      this.tags["ai.device.osPlatform"] = os && os.platform();
    };
    Context2.prototype._loadInternalContext = function() {
      var version = "unknown";
      try {
        var packageJson = require_package();
        if (packageJson && typeof packageJson.version === "string") {
          version = packageJson.version;
        }
      } catch (exception) {
        Logging.info("unable to read SDK version: " + exception);
      }
      this.tags[this.keys.internalSdkVersion] = "node:" + version || "unknown";
    };
    return Context2;
  }();
  module.exports = Context;
});

// node_modules/applicationinsights/Library/Channel.js
var require_Channel = __commonJS((exports, module) => {
  var Logging = require_Logging();
  var Channel = function() {
    function Channel2(isDisabled, getBatchSize, getBatchIntervalMs, sender) {
      this._buffer = [];
      this._lastSend = 0;
      this._isDisabled = isDisabled;
      this._getBatchSize = getBatchSize;
      this._getBatchIntervalMs = getBatchIntervalMs;
      this._sender = sender;
    }
    Channel2.prototype.setOfflineMode = function(value, resendInterval) {
      this._sender.setOfflineMode(value, resendInterval);
    };
    Channel2.prototype.send = function(envelope) {
      var _this = this;
      if (this._isDisabled()) {
        return;
      }
      if (!envelope) {
        Logging.warn("Cannot send null/undefined telemetry");
        return;
      }
      var payload = this._stringify(envelope);
      if (typeof payload !== "string") {
        return;
      }
      this._buffer.push(payload);
      if (this._buffer.length >= this._getBatchSize()) {
        this.triggerSend(false);
        return;
      }
      if (!this._timeoutHandle && this._buffer.length > 0) {
        this._timeoutHandle = setTimeout(function() {
          _this._timeoutHandle = null;
          _this.triggerSend(false);
        }, this._getBatchIntervalMs());
      }
    };
    Channel2.prototype.handleCrash = function(envelope) {
      if (envelope) {
        var payload = this._stringify(envelope);
        if (typeof payload === "string") {
          this._buffer.push(payload);
          this.triggerSend(true);
        } else {
          Logging.warn("Could not send crash", envelope);
        }
      } else {
        Logging.warn("handleCrash was called with empty payload", envelope);
      }
    };
    Channel2.prototype.triggerSend = function(isNodeCrashing, callback) {
      var bufferIsEmpty = this._buffer.length < 1;
      if (!bufferIsEmpty) {
        var batch = this._buffer.join(`
`);
        if (isNodeCrashing) {
          this._sender.saveOnCrash(batch);
          if (typeof callback === "function") {
            callback("data saved on crash");
          }
        } else {
          this._sender.send(new Buffer(batch), callback);
        }
      }
      this._lastSend = +new Date;
      this._buffer.length = 0;
      clearTimeout(this._timeoutHandle);
      this._timeoutHandle = null;
      if (bufferIsEmpty && typeof callback === "function") {
        callback("no data to send");
      }
    };
    Channel2.prototype._stringify = function(envelope) {
      try {
        return JSON.stringify(envelope);
      } catch (error) {
        Logging.warn("Failed to serialize payload", error, envelope);
      }
    };
    return Channel2;
  }();
  module.exports = Channel;
});

// node_modules/applicationinsights/Library/Sender.js
var require_Sender = __commonJS((exports, module) => {
  var fs = __require("fs");
  var http = __require("http");
  var https = __require("https");
  var os = __require("os");
  var path = __require("path");
  var url = __require("url");
  var zlib = __require("zlib");
  var Logging = require_Logging();
  var AutoCollectClientRequests = require_ClientRequests();
  var Sender = function() {
    function Sender2(getUrl, onSuccess, onError) {
      this._getUrl = getUrl;
      this._onSuccess = onSuccess;
      this._onError = onError;
      this._enableOfflineMode = false;
      this._resendInterval = Sender2.WAIT_BETWEEN_RESEND;
    }
    Sender2.prototype.setOfflineMode = function(value, resendInterval) {
      this._enableOfflineMode = value;
      if (typeof resendInterval === "number" && resendInterval >= 0) {
        this._resendInterval = Math.floor(resendInterval);
      }
    };
    Sender2.prototype.send = function(payload, callback) {
      var _this = this;
      var endpointUrl = this._getUrl();
      if (endpointUrl && endpointUrl.indexOf("//") === 0) {
        endpointUrl = "https:" + endpointUrl;
      }
      var parsedUrl = url.parse(endpointUrl);
      var options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/x-json-stream"
        }
      };
      zlib.gzip(payload, function(err, buffer) {
        var dataToSend = buffer;
        if (err) {
          Logging.warn(err);
          dataToSend = payload;
          options.headers["Content-Length"] = payload.length;
        } else {
          options.headers["Content-Encoding"] = "gzip";
          options.headers["Content-Length"] = buffer.length;
        }
        Logging.info(Sender2.TAG, options);
        options[AutoCollectClientRequests.disableCollectionRequestOption] = true;
        var requestCallback = function(res) {
          res.setEncoding("utf-8");
          var responseString = "";
          res.on("data", function(data) {
            responseString += data;
          });
          res.on("end", function() {
            Logging.info(Sender2.TAG, responseString);
            if (typeof _this._onSuccess === "function") {
              _this._onSuccess(responseString);
            }
            if (typeof callback === "function") {
              callback(responseString);
            }
            if (_this._enableOfflineMode) {
              if (res.statusCode === 200) {
                setTimeout(function() {
                  return _this._sendFirstFileOnDisk();
                }, _this._resendInterval);
              } else if (res.statusCode === 206 || res.statusCode === 429 || res.statusCode === 439) {
                _this._storeToDisk(payload);
              }
            }
          });
        };
        var req = parsedUrl.protocol == "https:" ? https.request(options, requestCallback) : http.request(options, requestCallback);
        req.on("error", function(error) {
          Logging.warn(Sender2.TAG, error);
          _this._onErrorHelper(error);
          if (typeof callback === "function") {
            var errorMessage = "error sending telemetry";
            if (error && typeof error.toString === "function") {
              errorMessage = error.toString();
            }
            callback(errorMessage);
          }
          if (_this._enableOfflineMode) {
            _this._storeToDisk(payload);
          }
        });
        req.write(dataToSend);
        req.end();
      });
    };
    Sender2.prototype.saveOnCrash = function(payload) {
      this._storeToDiskSync(payload);
    };
    Sender2.prototype._confirmDirExists = function(direcotry, callback) {
      fs.exists(direcotry, function(exists) {
        if (!exists) {
          fs.mkdir(direcotry, function(err) {
            callback(err);
          });
        } else {
          callback(null);
        }
      });
    };
    Sender2.prototype._storeToDisk = function(payload) {
      var _this = this;
      var direcotry = path.join(os.tmpdir(), Sender2.TEMPDIR);
      this._confirmDirExists(direcotry, function(error) {
        if (error) {
          _this._onErrorHelper(error);
          return;
        }
        var fileName = new Date().getTime() + ".ai.json";
        var fileFullPath = path.join(direcotry, fileName);
        Logging.info(Sender2.TAG, "saving data to disk at: " + fileFullPath);
        fs.writeFile(fileFullPath, payload, function(error2) {
          return _this._onErrorHelper(error2);
        });
      });
    };
    Sender2.prototype._storeToDiskSync = function(payload) {
      var direcotry = path.join(os.tmpdir(), Sender2.TEMPDIR);
      try {
        if (!fs.existsSync(direcotry)) {
          fs.mkdirSync(direcotry);
        }
        var fileName = new Date().getTime() + ".ai.json";
        var fileFullPath = path.join(direcotry, fileName);
        Logging.info(Sender2.TAG, "saving data before crash to disk at: " + fileFullPath);
        fs.writeFileSync(fileFullPath, payload);
      } catch (error) {
        this._onErrorHelper(error);
      }
    };
    Sender2.prototype._sendFirstFileOnDisk = function() {
      var _this = this;
      var tempDir = path.join(os.tmpdir(), Sender2.TEMPDIR);
      fs.exists(tempDir, function(exists) {
        if (exists) {
          fs.readdir(tempDir, function(error, files) {
            if (!error) {
              files = files.filter(function(f) {
                return path.basename(f).indexOf(".ai.json") > -1;
              });
              if (files.length > 0) {
                var firstFile = files[0];
                var filePath = path.join(tempDir, firstFile);
                fs.readFile(filePath, function(error2, payload) {
                  if (!error2) {
                    fs.unlink(filePath, function(error3) {
                      if (!error3) {
                        _this.send(payload);
                      } else {
                        _this._onErrorHelper(error3);
                      }
                    });
                  } else {
                    _this._onErrorHelper(error2);
                  }
                });
              }
            } else {
              _this._onErrorHelper(error);
            }
          });
        }
      });
    };
    Sender2.prototype._onErrorHelper = function(error) {
      if (typeof this._onError === "function") {
        this._onError(error);
      }
    };
    Sender2.TAG = "Sender";
    Sender2.WAIT_BETWEEN_RESEND = 60 * 1000;
    Sender2.TEMPDIR = "appInsights-node";
    return Sender2;
  }();
  module.exports = Sender;
});

// node_modules/applicationinsights/Library/Client.js
var require_Client = __commonJS((exports, module) => {
  var url = __require("url");
  var Config = require_Config();
  var Context = require_Context();
  var ExceptionTracking = require_Exceptions();
  var ContractsModule = require_Contracts();
  var Channel = require_Channel();
  var ServerRequestTracking = require_ServerRequests();
  var ClientRequestTracking = require_ClientRequests();
  var CorrelationContextManager_1 = require_CorrelationContextManager();
  var Sender = require_Sender();
  var Util = require_Util();
  var Logging = require_Logging();
  var Client = function() {
    function Client2(iKey) {
      this._telemetryProcessors = [];
      var config = new Config(iKey);
      this.config = config;
      this.context = new Context;
      this.commonProperties = {};
      var sender = new Sender(function() {
        return config.endpointUrl;
      });
      this.channel = new Channel(function() {
        return config.disableAppInsights;
      }, function() {
        return config.maxBatchSize;
      }, function() {
        return config.maxBatchIntervalMs;
      }, sender);
    }
    Client2.prototype.trackEvent = function(name, properties, measurements) {
      var event = new ContractsModule.Contracts.EventData;
      event.name = name;
      event.properties = properties;
      event.measurements = measurements;
      var data = new ContractsModule.Contracts.Data;
      data.baseType = "EventData";
      data.baseData = event;
      this.track(data);
    };
    Client2.prototype.trackTrace = function(message, severityLevel, properties) {
      var trace = new ContractsModule.Contracts.MessageData;
      trace.message = message;
      trace.properties = properties;
      if (!isNaN(severityLevel)) {
        trace.severityLevel = severityLevel;
      } else {
        trace.severityLevel = ContractsModule.Contracts.SeverityLevel.Information;
      }
      var data = new ContractsModule.Contracts.Data;
      data.baseType = "MessageData";
      data.baseData = trace;
      this.track(data);
    };
    Client2.prototype.trackException = function(exception, properties, measurements) {
      if (!Util.isError(exception)) {
        exception = new Error(exception);
      }
      var data = ExceptionTracking.getExceptionData(exception, true, properties, measurements);
      this.track(data);
    };
    Client2.prototype.trackMetric = function(name, value, count, min, max, stdDev, properties) {
      var metrics = new ContractsModule.Contracts.MetricData;
      metrics.metrics = [];
      var metric = new ContractsModule.Contracts.DataPoint;
      metric.count = !isNaN(count) ? count : 1;
      metric.kind = ContractsModule.Contracts.DataPointType.Aggregation;
      metric.max = !isNaN(max) ? max : value;
      metric.min = !isNaN(min) ? min : value;
      metric.name = name;
      metric.stdDev = !isNaN(stdDev) ? stdDev : 0;
      metric.value = value;
      metrics.metrics.push(metric);
      metrics.properties = properties;
      var data = new ContractsModule.Contracts.Data;
      data.baseType = "MetricData";
      data.baseData = metrics;
      this.track(data);
    };
    Client2.prototype.trackRequestSync = function(request, response, ellapsedMilliseconds, properties, error) {
      ServerRequestTracking.trackRequestSync(this, request, response, ellapsedMilliseconds, properties, error);
    };
    Client2.prototype.trackRequest = function(request, response, properties) {
      ServerRequestTracking.trackRequest(this, request, response, properties);
    };
    Client2.prototype.trackDependencyRequest = function(requestOptions, request, properties) {
      ClientRequestTracking.trackRequest(this, requestOptions, request, properties);
    };
    Client2.prototype.trackDependency = function(name, commandName, elapsedTimeMs, success, dependencyTypeName, properties, async, target) {
      if (properties === undefined) {
        properties = {};
      }
      if (target === undefined) {
        target = null;
      }
      if (!target && commandName) {
        target = url.parse(commandName).host;
      }
      var remoteDependency = new ContractsModule.Contracts.RemoteDependencyData;
      remoteDependency.name = name;
      remoteDependency.data = commandName;
      remoteDependency.target = target;
      remoteDependency.duration = Util.msToTimeSpan(elapsedTimeMs);
      remoteDependency.success = success;
      remoteDependency.type = dependencyTypeName;
      remoteDependency.properties = properties;
      var data = new ContractsModule.Contracts.Data;
      data.baseType = "RemoteDependencyData";
      data.baseData = remoteDependency;
      this.track(data);
    };
    Client2.prototype.sendPendingData = function(callback) {
      this.channel.triggerSend(false, callback);
    };
    Client2.prototype.getEnvelope = function(data, tagOverrides) {
      if (data && data.baseData) {
        data.baseData.ver = 2;
        if (!data.baseData.properties) {
          data.baseData.properties = this.commonProperties;
        } else {
          for (var name in this.commonProperties) {
            if (!data.baseData.properties[name]) {
              data.baseData.properties[name] = this.commonProperties[name];
            }
          }
        }
      }
      data.baseData.properties = Util.validateStringMap(data.baseData.properties);
      var iKey = this.config.instrumentationKey;
      var envelope = new ContractsModule.Contracts.Envelope;
      envelope.data = data;
      envelope.iKey = iKey;
      envelope.name = "Microsoft.ApplicationInsights." + iKey.replace(/-/g, "") + "." + data.baseType.substr(0, data.baseType.length - 4);
      envelope.tags = this.getTags(tagOverrides);
      envelope.time = new Date().toISOString();
      envelope.ver = 1;
      return envelope;
    };
    Client2.prototype.track = function(data, tagOverrides, contextObjects) {
      var envelope = this.getEnvelope(data, tagOverrides);
      var accepted = this.runTelemetryProcessors(envelope, contextObjects);
      if (accepted) {
        this.channel.send(envelope);
      }
    };
    Client2.prototype.addTelemetryProcessor = function(telemetryProcessor) {
      this._telemetryProcessors.push(telemetryProcessor);
    };
    Client2.prototype.clearTelemetryProcessors = function() {
      this._telemetryProcessors = [];
    };
    Client2.prototype.runTelemetryProcessors = function(envelope, contextObjects) {
      var accepted = true;
      var telemetryProcessorsCount = this._telemetryProcessors.length;
      if (telemetryProcessorsCount === 0) {
        return accepted;
      }
      contextObjects = contextObjects || {};
      contextObjects["correlationContext"] = CorrelationContextManager_1.CorrelationContextManager.getCurrentContext();
      for (var i = 0;i < telemetryProcessorsCount; ++i) {
        try {
          var processor = this._telemetryProcessors[i];
          if (processor) {
            if (processor.apply(null, [envelope, contextObjects]) === false) {
              accepted = false;
              break;
            }
          }
        } catch (error) {
          accepted = false;
          Logging.warn("One of telemetry processors failed, telemetry item will not be sent.", error, envelope);
        }
      }
      return accepted;
    };
    Client2.prototype.getTags = function(tagOverrides) {
      var correlationContext = CorrelationContextManager_1.CorrelationContextManager.getCurrentContext();
      var newTags = {};
      for (var key in this.context.tags) {
        newTags[key] = this.context.tags[key];
      }
      for (var key in tagOverrides) {
        newTags[key] = tagOverrides[key];
      }
      if (!correlationContext) {
        return newTags;
      }
      if (correlationContext) {
        newTags[this.context.keys.operationId] = newTags[this.context.keys.operationId] || correlationContext.operation.id;
        newTags[this.context.keys.operationName] = newTags[this.context.keys.operationName] || correlationContext.operation.name;
        newTags[this.context.keys.operationParentId] = newTags[this.context.keys.operationParentId] || correlationContext.operation.parentId;
      }
      return newTags;
    };
    return Client2;
  }();
  module.exports = Client;
});

// node_modules/applicationinsights/applicationinsights.js
var require_applicationinsights = __commonJS((exports, module) => {
  var CorrelationContextManager = require_CorrelationContextManager();
  var AutoCollectConsole = require_Console();
  var AutoCollectExceptions = require_Exceptions();
  var AutoCollectPerformance = require_Performance();
  var AutoCollectClientRequests = require_ClientRequests();
  var AutoCollectServerRequests = require_ServerRequests();
  var Client = require_Client();
  var Logging = require_Logging();
  var ApplicationInsights = function() {
    function ApplicationInsights2() {}
    ApplicationInsights2.getClient = function(instrumentationKey) {
      return new Client(instrumentationKey);
    };
    ApplicationInsights2.setup = function(instrumentationKey) {
      if (!ApplicationInsights2.client) {
        ApplicationInsights2.client = ApplicationInsights2.getClient(instrumentationKey);
        ApplicationInsights2._console = new AutoCollectConsole(ApplicationInsights2.client);
        ApplicationInsights2._exceptions = new AutoCollectExceptions(ApplicationInsights2.client);
        ApplicationInsights2._performance = new AutoCollectPerformance(ApplicationInsights2.client);
        ApplicationInsights2._serverRequests = new AutoCollectServerRequests(ApplicationInsights2.client);
        ApplicationInsights2._clientRequests = new AutoCollectClientRequests(ApplicationInsights2.client);
      } else {
        Logging.info("The default client is already setup");
      }
      if (ApplicationInsights2.client && ApplicationInsights2.client.channel) {
        ApplicationInsights2.client.channel.setOfflineMode(ApplicationInsights2._isOfflineMode);
      }
      return ApplicationInsights2;
    };
    ApplicationInsights2.start = function() {
      if (!!this.client) {
        ApplicationInsights2._isStarted = true;
        ApplicationInsights2._console.enable(ApplicationInsights2._isConsole);
        ApplicationInsights2._exceptions.enable(ApplicationInsights2._isExceptions);
        ApplicationInsights2._performance.enable(ApplicationInsights2._isPerformance);
        ApplicationInsights2._serverRequests.useAutoCorrelation(ApplicationInsights2._isCorrelating);
        ApplicationInsights2._serverRequests.enable(ApplicationInsights2._isRequests);
        ApplicationInsights2._clientRequests.enable(ApplicationInsights2._isDependencies);
      } else {
        Logging.warn("Start cannot be called before setup");
      }
      return ApplicationInsights2;
    };
    ApplicationInsights2.getCorrelationContext = function() {
      if (this._isCorrelating) {
        return CorrelationContextManager.CorrelationContextManager.getCurrentContext();
      }
      return null;
    };
    ApplicationInsights2.wrapWithCorrelationContext = function(fn) {
      return CorrelationContextManager.CorrelationContextManager.wrapCallback(fn);
    };
    ApplicationInsights2.setAutoCollectConsole = function(value) {
      ApplicationInsights2._isConsole = value;
      if (ApplicationInsights2._isStarted) {
        ApplicationInsights2._console.enable(value);
      }
      return ApplicationInsights2;
    };
    ApplicationInsights2.setAutoCollectExceptions = function(value) {
      ApplicationInsights2._isExceptions = value;
      if (ApplicationInsights2._isStarted) {
        ApplicationInsights2._exceptions.enable(value);
      }
      return ApplicationInsights2;
    };
    ApplicationInsights2.setAutoCollectPerformance = function(value) {
      ApplicationInsights2._isPerformance = value;
      if (ApplicationInsights2._isStarted) {
        ApplicationInsights2._performance.enable(value);
      }
      return ApplicationInsights2;
    };
    ApplicationInsights2.setAutoCollectRequests = function(value) {
      ApplicationInsights2._isRequests = value;
      if (ApplicationInsights2._isStarted) {
        ApplicationInsights2._serverRequests.enable(value);
      }
      return ApplicationInsights2;
    };
    ApplicationInsights2.setAutoCollectDependencies = function(value) {
      ApplicationInsights2._isDependencies = value;
      if (ApplicationInsights2._isStarted) {
        ApplicationInsights2._clientRequests.enable(value);
      }
      return ApplicationInsights2;
    };
    ApplicationInsights2.setAutoDependencyCorrelation = function(value) {
      ApplicationInsights2._isCorrelating = value;
      if (ApplicationInsights2._isStarted) {
        ApplicationInsights2._serverRequests.useAutoCorrelation(value);
      }
      return ApplicationInsights2;
    };
    ApplicationInsights2.setOfflineMode = function(value, resendInterval) {
      ApplicationInsights2._isOfflineMode = value;
      if (ApplicationInsights2.client && ApplicationInsights2.client.channel) {
        ApplicationInsights2.client.channel.setOfflineMode(value, resendInterval);
      }
      return ApplicationInsights2;
    };
    ApplicationInsights2.enableVerboseLogging = function(enableWarningLogging) {
      if (enableWarningLogging === undefined) {
        enableWarningLogging = true;
      }
      Logging.enableDebug = true;
      Logging.disableWarnings = !enableWarningLogging;
      return ApplicationInsights2;
    };
    ApplicationInsights2.disableConsoleLogging = function() {
      Logging.enableDebug = false;
      Logging.disableWarnings = true;
      return ApplicationInsights2;
    };
    ApplicationInsights2.dispose = function() {
      ApplicationInsights2.client = null;
      ApplicationInsights2._isStarted = false;
      if (ApplicationInsights2._console) {
        ApplicationInsights2._console.dispose();
      }
      if (ApplicationInsights2._exceptions) {
        ApplicationInsights2._exceptions.dispose();
      }
      if (ApplicationInsights2._performance) {
        ApplicationInsights2._performance.dispose();
      }
      if (ApplicationInsights2._serverRequests) {
        ApplicationInsights2._serverRequests.dispose();
      }
      if (ApplicationInsights2._clientRequests) {
        ApplicationInsights2._clientRequests.dispose();
      }
    };
    ApplicationInsights2._isConsole = true;
    ApplicationInsights2._isExceptions = true;
    ApplicationInsights2._isPerformance = true;
    ApplicationInsights2._isRequests = true;
    ApplicationInsights2._isDependencies = true;
    ApplicationInsights2._isOfflineMode = false;
    ApplicationInsights2._isCorrelating = false;
    ApplicationInsights2._isStarted = false;
    return ApplicationInsights2;
  }();
  module.exports = ApplicationInsights;
});

// node_modules/tree-kill/index.js
var require_tree_kill = __commonJS((exports, module) => {
  var childProcess = __require("child_process");
  var spawn = childProcess.spawn;
  var exec = childProcess.exec;
  module.exports = function(pid, signal, callback) {
    if (typeof signal === "function" && callback === undefined) {
      callback = signal;
      signal = undefined;
    }
    pid = parseInt(pid);
    if (Number.isNaN(pid)) {
      if (callback) {
        return callback(new Error("pid must be a number"));
      } else {
        throw new Error("pid must be a number");
      }
    }
    var tree = {};
    var pidsToProcess = {};
    tree[pid] = [];
    pidsToProcess[pid] = 1;
    switch (process.platform) {
      case "win32":
        exec("taskkill /pid " + pid + " /T /F", callback);
        break;
      case "darwin":
        buildProcessTree(pid, tree, pidsToProcess, function(parentPid) {
          return spawn("pgrep", ["-P", parentPid]);
        }, function() {
          killAll(tree, signal, callback);
        });
        break;
      default:
        buildProcessTree(pid, tree, pidsToProcess, function(parentPid) {
          return spawn("ps", ["-o", "pid", "--no-headers", "--ppid", parentPid]);
        }, function() {
          killAll(tree, signal, callback);
        });
        break;
    }
  };
  function killAll(tree, signal, callback) {
    var killed = {};
    try {
      Object.keys(tree).forEach(function(pid) {
        tree[pid].forEach(function(pidpid) {
          if (!killed[pidpid]) {
            killPid(pidpid, signal);
            killed[pidpid] = 1;
          }
        });
        if (!killed[pid]) {
          killPid(pid, signal);
          killed[pid] = 1;
        }
      });
    } catch (err) {
      if (callback) {
        return callback(err);
      } else {
        throw err;
      }
    }
    if (callback) {
      return callback();
    }
  }
  function killPid(pid, signal) {
    try {
      process.kill(parseInt(pid, 10), signal);
    } catch (err) {
      if (err.code !== "ESRCH")
        throw err;
    }
  }
  function buildProcessTree(parentPid, tree, pidsToProcess, spawnChildProcessesList, cb) {
    var ps = spawnChildProcessesList(parentPid);
    var allData = "";
    ps.stdout.on("data", function(data) {
      var data = data.toString("ascii");
      allData += data;
    });
    var onClose = function(code) {
      delete pidsToProcess[parentPid];
      if (code != 0) {
        if (Object.keys(pidsToProcess).length == 0) {
          cb();
        }
        return;
      }
      allData.match(/\d+/g).forEach(function(pid) {
        pid = parseInt(pid, 10);
        tree[parentPid].push(pid);
        tree[pid] = [];
        pidsToProcess[pid] = 1;
        buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
      });
    };
    ps.on("close", onClose);
  }
});

// src/src/codeManager.ts
var micromatch = __toESM(require_micromatch());
var appInsights = require_applicationinsights();

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

// src/src/constants.ts
class Constants {
  static python = "python";
}
class Utility {
  static async getPythonPath(document2) {
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
        const execCommand = extension.exports.settings.getExecutionDetails ? extension.exports.settings.getExecutionDetails(document2?.uri).execCommand : extension.exports.settings.getExecutionCommand(document2?.uri);
        return execCommand ? execCommand.join(" ") : Constants.python;
      } else {
        return this.getConfiguration("python", document2).get("pythonPath");
      }
    } catch (error) {
      return Constants.python;
    }
  }
  static getConfiguration(section, document2) {
    if (document2) {
      return vscode3__namespace.workspace.getConfiguration(section, document2.uri);
    } else {
      return vscode3__namespace.workspace.getConfiguration(section);
    }
  }
}

// src/src/codeManager.ts
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
    const fileExtension = path.extname(this._document.fileName);
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
      const fileExtension = path.extname(this._document.fileName);
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
      const kill = require_tree_kill();
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
      this._cwd = path.dirname(this._document.fileName);
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
      const folder = this._document.isUntitled ? this._cwd : path.dirname(this._document.fileName);
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
    this._codeFile = path.isAbsolute(tmpFileName) ? tmpFileName : path.resolve(folder, tmpFileName);
    try {
      fs__namespace.mkdirSync(path.dirname(this._codeFile), { recursive: true });
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
        const fileBasename = path.basename(this._document.fileName);
        for (const glob of Object.keys(executorMapByGlob)) {
          if (micromatch.isMatch(fileBasename, glob)) {
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
    codeManager.run(null, fileUri);
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
