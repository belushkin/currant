(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/chance/chance.js
  var require_chance = __commonJS({
    "node_modules/chance/chance.js"(exports, module) {
      (function() {
        var MAX_INT = 9007199254740992;
        var MIN_INT = -MAX_INT;
        var NUMBERS = "0123456789";
        var CHARS_LOWER = "abcdefghijklmnopqrstuvwxyz";
        var CHARS_UPPER = CHARS_LOWER.toUpperCase();
        var HEX_POOL = NUMBERS + "abcdef";
        function UnsupportedError(message) {
          this.name = "UnsupportedError";
          this.message = message || "This feature is not supported on this platform";
        }
        __name(UnsupportedError, "UnsupportedError");
        UnsupportedError.prototype = new Error();
        UnsupportedError.prototype.constructor = UnsupportedError;
        var slice = Array.prototype.slice;
        function Chance2(seed) {
          if (!(this instanceof Chance2)) {
            if (!seed) {
              seed = null;
            }
            return seed === null ? new Chance2() : new Chance2(seed);
          }
          if (typeof seed === "function") {
            this.random = seed;
            return this;
          }
          if (arguments.length) {
            this.seed = 0;
          }
          for (var i = 0; i < arguments.length; i++) {
            var seedling = 0;
            if (Object.prototype.toString.call(arguments[i]) === "[object String]") {
              for (var j = 0; j < arguments[i].length; j++) {
                var hash = 0;
                for (var k2 = 0; k2 < arguments[i].length; k2++) {
                  hash = arguments[i].charCodeAt(k2) + (hash << 6) + (hash << 16) - hash;
                }
                seedling += hash;
              }
            } else {
              seedling = arguments[i];
            }
            this.seed += (arguments.length - i) * seedling;
          }
          this.mt = this.mersenne_twister(this.seed);
          this.bimd5 = this.blueimp_md5();
          this.random = function() {
            return this.mt.random(this.seed);
          };
          return this;
        }
        __name(Chance2, "Chance");
        Chance2.prototype.VERSION = "1.1.8";
        function initOptions(options, defaults) {
          options = options || {};
          if (defaults) {
            for (var i in defaults) {
              if (typeof options[i] === "undefined") {
                options[i] = defaults[i];
              }
            }
          }
          return options;
        }
        __name(initOptions, "initOptions");
        function range(size) {
          return Array.apply(null, Array(size)).map(function(_, i) {
            return i;
          });
        }
        __name(range, "range");
        function testRange(test, errorMessage) {
          if (test) {
            throw new RangeError(errorMessage);
          }
        }
        __name(testRange, "testRange");
        var base64 = /* @__PURE__ */ __name(function() {
          throw new Error("No Base64 encoder available.");
        }, "base64");
        (/* @__PURE__ */ __name(function determineBase64Encoder() {
          if (typeof btoa === "function") {
            base64 = btoa;
          } else if (typeof Buffer === "function") {
            base64 = /* @__PURE__ */ __name(function(input) {
              return new Buffer(input).toString("base64");
            }, "base64");
          }
        }, "determineBase64Encoder"))();
        Chance2.prototype.bool = function(options) {
          options = initOptions(options, { likelihood: 50 });
          testRange(options.likelihood < 0 || options.likelihood > 100, "Chance: Likelihood accepts values from 0 to 100.");
          return this.random() * 100 < options.likelihood;
        };
        Chance2.prototype.falsy = function(options) {
          options = initOptions(options, { pool: [false, null, 0, NaN, ""] });
          var pool = options.pool, index = this.integer({ min: 0, max: pool.length }), value = pool[index];
          return value;
        };
        Chance2.prototype.animal = function(options) {
          options = initOptions(options);
          if (typeof options.type !== "undefined") {
            testRange(!this.get("animals")[options.type.toLowerCase()], "Please pick from desert, ocean, grassland, forest, zoo, pets, farm.");
            return this.pick(this.get("animals")[options.type.toLowerCase()]);
          }
          var animalTypeArray = ["desert", "forest", "ocean", "zoo", "farm", "pet", "grassland"];
          return this.pick(this.get("animals")[this.pick(animalTypeArray)]);
        };
        Chance2.prototype.character = function(options) {
          options = initOptions(options);
          var symbols = "!@#$%^&*()[]", letters, pool;
          if (options.casing === "lower") {
            letters = CHARS_LOWER;
          } else if (options.casing === "upper") {
            letters = CHARS_UPPER;
          } else {
            letters = CHARS_LOWER + CHARS_UPPER;
          }
          if (options.pool) {
            pool = options.pool;
          } else {
            pool = "";
            if (options.alpha) {
              pool += letters;
            }
            if (options.numeric) {
              pool += NUMBERS;
            }
            if (options.symbols) {
              pool += symbols;
            }
            if (!pool) {
              pool = letters + NUMBERS + symbols;
            }
          }
          return pool.charAt(this.natural({ max: pool.length - 1 }));
        };
        Chance2.prototype.floating = function(options) {
          options = initOptions(options, { fixed: 4 });
          testRange(options.fixed && options.precision, "Chance: Cannot specify both fixed and precision.");
          var num;
          var fixed2 = Math.pow(10, options.fixed);
          var max = MAX_INT / fixed2;
          var min = -max;
          testRange(options.min && options.fixed && options.min < min, "Chance: Min specified is out of range with fixed. Min should be, at least, " + min);
          testRange(options.max && options.fixed && options.max > max, "Chance: Max specified is out of range with fixed. Max should be, at most, " + max);
          options = initOptions(options, { min, max });
          num = this.integer({ min: options.min * fixed2, max: options.max * fixed2 });
          var num_fixed = (num / fixed2).toFixed(options.fixed);
          return parseFloat(num_fixed);
        };
        Chance2.prototype.integer = function(options) {
          options = initOptions(options, { min: MIN_INT, max: MAX_INT });
          testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
          return Math.floor(this.random() * (options.max - options.min + 1) + options.min);
        };
        Chance2.prototype.natural = function(options) {
          options = initOptions(options, { min: 0, max: MAX_INT });
          if (typeof options.numerals === "number") {
            testRange(options.numerals < 1, "Chance: Numerals cannot be less than one.");
            options.min = Math.pow(10, options.numerals - 1);
            options.max = Math.pow(10, options.numerals) - 1;
          }
          testRange(options.min < 0, "Chance: Min cannot be less than zero.");
          if (options.exclude) {
            testRange(!Array.isArray(options.exclude), "Chance: exclude must be an array.");
            for (var exclusionIndex in options.exclude) {
              testRange(!Number.isInteger(options.exclude[exclusionIndex]), "Chance: exclude must be numbers.");
            }
            var random = options.min + this.natural({ max: options.max - options.min - options.exclude.length });
            var sortedExclusions = options.exclude.sort();
            for (var sortedExclusionIndex in sortedExclusions) {
              if (random < sortedExclusions[sortedExclusionIndex]) {
                break;
              }
              random++;
            }
            return random;
          }
          return this.integer(options);
        };
        Chance2.prototype.prime = function(options) {
          options = initOptions(options, { min: 0, max: 1e4 });
          testRange(options.min < 0, "Chance: Min cannot be less than zero.");
          testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
          var lastPrime = data.primes[data.primes.length - 1];
          if (options.max > lastPrime) {
            for (var i = lastPrime + 2; i <= options.max; ++i) {
              if (this.is_prime(i)) {
                data.primes.push(i);
              }
            }
          }
          var targetPrimes = data.primes.filter(function(prime) {
            return prime >= options.min && prime <= options.max;
          });
          return this.pick(targetPrimes);
        };
        Chance2.prototype.is_prime = function(n) {
          if (n % 1 || n < 2) {
            return false;
          }
          if (n % 2 === 0) {
            return n === 2;
          }
          if (n % 3 === 0) {
            return n === 3;
          }
          var m = Math.sqrt(n);
          for (var i = 5; i <= m; i += 6) {
            if (n % i === 0 || n % (i + 2) === 0) {
              return false;
            }
          }
          return true;
        };
        Chance2.prototype.hex = function(options) {
          options = initOptions(options, { min: 0, max: MAX_INT, casing: "lower" });
          testRange(options.min < 0, "Chance: Min cannot be less than zero.");
          var integer = this.natural({ min: options.min, max: options.max });
          if (options.casing === "upper") {
            return integer.toString(16).toUpperCase();
          }
          return integer.toString(16);
        };
        Chance2.prototype.letter = function(options) {
          options = initOptions(options, { casing: "lower" });
          var pool = "abcdefghijklmnopqrstuvwxyz";
          var letter = this.character({ pool });
          if (options.casing === "upper") {
            letter = letter.toUpperCase();
          }
          return letter;
        };
        Chance2.prototype.string = function(options) {
          options = initOptions(options, { min: 5, max: 20 });
          if (!options.length) {
            options.length = this.natural({ min: options.min, max: options.max });
          }
          testRange(options.length < 0, "Chance: Length cannot be less than zero.");
          var length = options.length, text2 = this.n(this.character, length, options);
          return text2.join("");
        };
        function CopyToken(c) {
          this.c = c;
        }
        __name(CopyToken, "CopyToken");
        CopyToken.prototype = {
          substitute: function() {
            return this.c;
          }
        };
        function EscapeToken(c) {
          this.c = c;
        }
        __name(EscapeToken, "EscapeToken");
        EscapeToken.prototype = {
          substitute: function() {
            if (!/[{}\\]/.test(this.c)) {
              throw new Error('Invalid escape sequence: "\\' + this.c + '".');
            }
            return this.c;
          }
        };
        function ReplaceToken(c) {
          this.c = c;
        }
        __name(ReplaceToken, "ReplaceToken");
        ReplaceToken.prototype = {
          replacers: {
            "#": function(chance2) {
              return chance2.character({ pool: NUMBERS });
            },
            "A": function(chance2) {
              return chance2.character({ pool: CHARS_UPPER });
            },
            "a": function(chance2) {
              return chance2.character({ pool: CHARS_LOWER });
            }
          },
          substitute: function(chance2) {
            var replacer = this.replacers[this.c];
            if (!replacer) {
              throw new Error('Invalid replacement character: "' + this.c + '".');
            }
            return replacer(chance2);
          }
        };
        function parseTemplate(template) {
          var tokens = [];
          var mode = "identity";
          for (var i = 0; i < template.length; i++) {
            var c = template[i];
            switch (mode) {
              case "escape":
                tokens.push(new EscapeToken(c));
                mode = "identity";
                break;
              case "identity":
                if (c === "{") {
                  mode = "replace";
                } else if (c === "\\") {
                  mode = "escape";
                } else {
                  tokens.push(new CopyToken(c));
                }
                break;
              case "replace":
                if (c === "}") {
                  mode = "identity";
                } else {
                  tokens.push(new ReplaceToken(c));
                }
                break;
            }
          }
          return tokens;
        }
        __name(parseTemplate, "parseTemplate");
        Chance2.prototype.template = function(template) {
          if (!template) {
            throw new Error("Template string is required");
          }
          var self2 = this;
          return parseTemplate(template).map(function(token) {
            return token.substitute(self2);
          }).join("");
        };
        Chance2.prototype.buffer = function(options) {
          if (typeof Buffer === "undefined") {
            throw new UnsupportedError("Sorry, the buffer() function is not supported on your platform");
          }
          options = initOptions(options, { length: this.natural({ min: 5, max: 20 }) });
          testRange(options.length < 0, "Chance: Length cannot be less than zero.");
          var length = options.length;
          var content = this.n(this.character, length, options);
          return Buffer.from(content);
        };
        Chance2.prototype.capitalize = function(word) {
          return word.charAt(0).toUpperCase() + word.substr(1);
        };
        Chance2.prototype.mixin = function(obj) {
          for (var func_name in obj) {
            Chance2.prototype[func_name] = obj[func_name];
          }
          return this;
        };
        Chance2.prototype.unique = function(fn, num, options) {
          testRange(typeof fn !== "function", "Chance: The first argument must be a function.");
          var comparator = /* @__PURE__ */ __name(function(arr2, val) {
            return arr2.indexOf(val) !== -1;
          }, "comparator");
          if (options) {
            comparator = options.comparator || comparator;
          }
          var arr = [], count = 0, result, MAX_DUPLICATES = num * 50, params = slice.call(arguments, 2);
          while (arr.length < num) {
            var clonedParams = JSON.parse(JSON.stringify(params));
            result = fn.apply(this, clonedParams);
            if (!comparator(arr, result)) {
              arr.push(result);
              count = 0;
            }
            if (++count > MAX_DUPLICATES) {
              throw new RangeError("Chance: num is likely too large for sample set");
            }
          }
          return arr;
        };
        Chance2.prototype.n = function(fn, n) {
          testRange(typeof fn !== "function", "Chance: The first argument must be a function.");
          if (typeof n === "undefined") {
            n = 1;
          }
          var i = n, arr = [], params = slice.call(arguments, 2);
          i = Math.max(0, i);
          for (null; i--; null) {
            arr.push(fn.apply(this, params));
          }
          return arr;
        };
        Chance2.prototype.pad = function(number, width2, pad) {
          pad = pad || "0";
          number = number + "";
          return number.length >= width2 ? number : new Array(width2 - number.length + 1).join(pad) + number;
        };
        Chance2.prototype.pick = function(arr, count) {
          if (arr.length === 0) {
            throw new RangeError("Chance: Cannot pick() from an empty array");
          }
          if (!count || count === 1) {
            return arr[this.natural({ max: arr.length - 1 })];
          } else {
            return this.shuffle(arr).slice(0, count);
          }
        };
        Chance2.prototype.pickone = function(arr) {
          if (arr.length === 0) {
            throw new RangeError("Chance: Cannot pickone() from an empty array");
          }
          return arr[this.natural({ max: arr.length - 1 })];
        };
        Chance2.prototype.pickset = function(arr, count) {
          if (count === 0) {
            return [];
          }
          if (arr.length === 0) {
            throw new RangeError("Chance: Cannot pickset() from an empty array");
          }
          if (count < 0) {
            throw new RangeError("Chance: Count must be a positive number");
          }
          if (!count || count === 1) {
            return [this.pickone(arr)];
          } else {
            var array = arr.slice(0);
            var end = array.length;
            return this.n(function() {
              var index = this.natural({ max: --end });
              var value = array[index];
              array[index] = array[end];
              return value;
            }, Math.min(end, count));
          }
        };
        Chance2.prototype.shuffle = function(arr) {
          var new_array = [], j = 0, length = Number(arr.length), source_indexes = range(length), last_source_index = length - 1, selected_source_index;
          for (var i = 0; i < length; i++) {
            selected_source_index = this.natural({ max: last_source_index });
            j = source_indexes[selected_source_index];
            new_array[i] = arr[j];
            source_indexes[selected_source_index] = source_indexes[last_source_index];
            last_source_index -= 1;
          }
          return new_array;
        };
        Chance2.prototype.weighted = function(arr, weights, trim) {
          if (arr.length !== weights.length) {
            throw new RangeError("Chance: Length of array and weights must match");
          }
          var sum = 0;
          var val;
          for (var weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
            val = weights[weightIndex];
            if (isNaN(val)) {
              throw new RangeError("Chance: All weights must be numbers");
            }
            if (val > 0) {
              sum += val;
            }
          }
          if (sum === 0) {
            throw new RangeError("Chance: No valid entries in array weights");
          }
          var selected = this.random() * sum;
          var total = 0;
          var lastGoodIdx = -1;
          var chosenIdx;
          for (weightIndex = 0; weightIndex < weights.length; ++weightIndex) {
            val = weights[weightIndex];
            total += val;
            if (val > 0) {
              if (selected <= total) {
                chosenIdx = weightIndex;
                break;
              }
              lastGoodIdx = weightIndex;
            }
            if (weightIndex === weights.length - 1) {
              chosenIdx = lastGoodIdx;
            }
          }
          var chosen = arr[chosenIdx];
          trim = typeof trim === "undefined" ? false : trim;
          if (trim) {
            arr.splice(chosenIdx, 1);
            weights.splice(chosenIdx, 1);
          }
          return chosen;
        };
        Chance2.prototype.paragraph = function(options) {
          options = initOptions(options);
          var sentences = options.sentences || this.natural({ min: 3, max: 7 }), sentence_array = this.n(this.sentence, sentences), separator = options.linebreak === true ? "\n" : " ";
          return sentence_array.join(separator);
        };
        Chance2.prototype.sentence = function(options) {
          options = initOptions(options);
          var words = options.words || this.natural({ min: 12, max: 18 }), punctuation = options.punctuation, text2, word_array = this.n(this.word, words);
          text2 = word_array.join(" ");
          text2 = this.capitalize(text2);
          if (punctuation !== false && !/^[.?;!:]$/.test(punctuation)) {
            punctuation = ".";
          }
          if (punctuation) {
            text2 += punctuation;
          }
          return text2;
        };
        Chance2.prototype.syllable = function(options) {
          options = initOptions(options);
          var length = options.length || this.natural({ min: 2, max: 3 }), consonants = "bcdfghjklmnprstvwz", vowels = "aeiou", all = consonants + vowels, text2 = "", chr;
          for (var i = 0; i < length; i++) {
            if (i === 0) {
              chr = this.character({ pool: all });
            } else if (consonants.indexOf(chr) === -1) {
              chr = this.character({ pool: consonants });
            } else {
              chr = this.character({ pool: vowels });
            }
            text2 += chr;
          }
          if (options.capitalize) {
            text2 = this.capitalize(text2);
          }
          return text2;
        };
        Chance2.prototype.word = function(options) {
          options = initOptions(options);
          testRange(options.syllables && options.length, "Chance: Cannot specify both syllables AND length.");
          var syllables = options.syllables || this.natural({ min: 1, max: 3 }), text2 = "";
          if (options.length) {
            do {
              text2 += this.syllable();
            } while (text2.length < options.length);
            text2 = text2.substring(0, options.length);
          } else {
            for (var i = 0; i < syllables; i++) {
              text2 += this.syllable();
            }
          }
          if (options.capitalize) {
            text2 = this.capitalize(text2);
          }
          return text2;
        };
        Chance2.prototype.age = function(options) {
          options = initOptions(options);
          var ageRange;
          switch (options.type) {
            case "child":
              ageRange = { min: 0, max: 12 };
              break;
            case "teen":
              ageRange = { min: 13, max: 19 };
              break;
            case "adult":
              ageRange = { min: 18, max: 65 };
              break;
            case "senior":
              ageRange = { min: 65, max: 100 };
              break;
            case "all":
              ageRange = { min: 0, max: 100 };
              break;
            default:
              ageRange = { min: 18, max: 65 };
              break;
          }
          return this.natural(ageRange);
        };
        Chance2.prototype.birthday = function(options) {
          var age = this.age(options);
          var currentYear = new Date().getFullYear();
          if (options && options.type) {
            var min = new Date();
            var max = new Date();
            min.setFullYear(currentYear - age - 1);
            max.setFullYear(currentYear - age);
            options = initOptions(options, {
              min,
              max
            });
          } else {
            options = initOptions(options, {
              year: currentYear - age
            });
          }
          return this.date(options);
        };
        Chance2.prototype.cpf = function(options) {
          options = initOptions(options, {
            formatted: true
          });
          var n = this.n(this.natural, 9, { max: 9 });
          var d1 = n[8] * 2 + n[7] * 3 + n[6] * 4 + n[5] * 5 + n[4] * 6 + n[3] * 7 + n[2] * 8 + n[1] * 9 + n[0] * 10;
          d1 = 11 - d1 % 11;
          if (d1 >= 10) {
            d1 = 0;
          }
          var d2 = d1 * 2 + n[8] * 3 + n[7] * 4 + n[6] * 5 + n[5] * 6 + n[4] * 7 + n[3] * 8 + n[2] * 9 + n[1] * 10 + n[0] * 11;
          d2 = 11 - d2 % 11;
          if (d2 >= 10) {
            d2 = 0;
          }
          var cpf = "" + n[0] + n[1] + n[2] + "." + n[3] + n[4] + n[5] + "." + n[6] + n[7] + n[8] + "-" + d1 + d2;
          return options.formatted ? cpf : cpf.replace(/\D/g, "");
        };
        Chance2.prototype.cnpj = function(options) {
          options = initOptions(options, {
            formatted: true
          });
          var n = this.n(this.natural, 12, { max: 12 });
          var d1 = n[11] * 2 + n[10] * 3 + n[9] * 4 + n[8] * 5 + n[7] * 6 + n[6] * 7 + n[5] * 8 + n[4] * 9 + n[3] * 2 + n[2] * 3 + n[1] * 4 + n[0] * 5;
          d1 = 11 - d1 % 11;
          if (d1 < 2) {
            d1 = 0;
          }
          var d2 = d1 * 2 + n[11] * 3 + n[10] * 4 + n[9] * 5 + n[8] * 6 + n[7] * 7 + n[6] * 8 + n[5] * 9 + n[4] * 2 + n[3] * 3 + n[2] * 4 + n[1] * 5 + n[0] * 6;
          d2 = 11 - d2 % 11;
          if (d2 < 2) {
            d2 = 0;
          }
          var cnpj = "" + n[0] + n[1] + "." + n[2] + n[3] + n[4] + "." + n[5] + n[6] + n[7] + "/" + n[8] + n[9] + n[10] + n[11] + "-" + d1 + d2;
          return options.formatted ? cnpj : cnpj.replace(/\D/g, "");
        };
        Chance2.prototype.first = function(options) {
          options = initOptions(options, { gender: this.gender(), nationality: "en" });
          return this.pick(this.get("firstNames")[options.gender.toLowerCase()][options.nationality.toLowerCase()]);
        };
        Chance2.prototype.profession = function(options) {
          options = initOptions(options);
          if (options.rank) {
            return this.pick(["Apprentice ", "Junior ", "Senior ", "Lead "]) + this.pick(this.get("profession"));
          } else {
            return this.pick(this.get("profession"));
          }
        };
        Chance2.prototype.company = function() {
          return this.pick(this.get("company"));
        };
        Chance2.prototype.gender = function(options) {
          options = initOptions(options, { extraGenders: [] });
          return this.pick(["Male", "Female"].concat(options.extraGenders));
        };
        Chance2.prototype.last = function(options) {
          options = initOptions(options, { nationality: "*" });
          if (options.nationality === "*") {
            var allLastNames = [];
            var lastNames = this.get("lastNames");
            Object.keys(lastNames).forEach(function(key) {
              allLastNames = allLastNames.concat(lastNames[key]);
            });
            return this.pick(allLastNames);
          } else {
            return this.pick(this.get("lastNames")[options.nationality.toLowerCase()]);
          }
        };
        Chance2.prototype.israelId = function() {
          var x = this.string({ pool: "0123456789", length: 8 });
          var y = 0;
          for (var i = 0; i < x.length; i++) {
            var thisDigit = x[i] * (i / 2 === parseInt(i / 2) ? 1 : 2);
            thisDigit = this.pad(thisDigit, 2).toString();
            thisDigit = parseInt(thisDigit[0]) + parseInt(thisDigit[1]);
            y = y + thisDigit;
          }
          x = x + (10 - parseInt(y.toString().slice(-1))).toString().slice(-1);
          return x;
        };
        Chance2.prototype.mrz = function(options) {
          var checkDigit = /* @__PURE__ */ __name(function(input) {
            var alpha = "<ABCDEFGHIJKLMNOPQRSTUVWXYXZ".split(""), multipliers = [7, 3, 1], runningTotal = 0;
            if (typeof input !== "string") {
              input = input.toString();
            }
            input.split("").forEach(function(character, idx) {
              var pos2 = alpha.indexOf(character);
              if (pos2 !== -1) {
                character = pos2 === 0 ? 0 : pos2 + 9;
              } else {
                character = parseInt(character, 10);
              }
              character *= multipliers[idx % multipliers.length];
              runningTotal += character;
            });
            return runningTotal % 10;
          }, "checkDigit");
          var generate = /* @__PURE__ */ __name(function(opts) {
            var pad = /* @__PURE__ */ __name(function(length) {
              return new Array(length + 1).join("<");
            }, "pad");
            var number = [
              "P<",
              opts.issuer,
              opts.last.toUpperCase(),
              "<<",
              opts.first.toUpperCase(),
              pad(39 - (opts.last.length + opts.first.length + 2)),
              opts.passportNumber,
              checkDigit(opts.passportNumber),
              opts.nationality,
              opts.dob,
              checkDigit(opts.dob),
              opts.gender,
              opts.expiry,
              checkDigit(opts.expiry),
              pad(14),
              checkDigit(pad(14))
            ].join("");
            return number + checkDigit(number.substr(44, 10) + number.substr(57, 7) + number.substr(65, 7));
          }, "generate");
          var that = this;
          options = initOptions(options, {
            first: this.first(),
            last: this.last(),
            passportNumber: this.integer({ min: 1e8, max: 999999999 }),
            dob: function() {
              var date = that.birthday({ type: "adult" });
              return [
                date.getFullYear().toString().substr(2),
                that.pad(date.getMonth() + 1, 2),
                that.pad(date.getDate(), 2)
              ].join("");
            }(),
            expiry: function() {
              var date = new Date();
              return [
                (date.getFullYear() + 5).toString().substr(2),
                that.pad(date.getMonth() + 1, 2),
                that.pad(date.getDate(), 2)
              ].join("");
            }(),
            gender: this.gender() === "Female" ? "F" : "M",
            issuer: "GBR",
            nationality: "GBR"
          });
          return generate(options);
        };
        Chance2.prototype.name = function(options) {
          options = initOptions(options);
          var first = this.first(options), last = this.last(options), name;
          if (options.middle) {
            name = first + " " + this.first(options) + " " + last;
          } else if (options.middle_initial) {
            name = first + " " + this.character({ alpha: true, casing: "upper" }) + ". " + last;
          } else {
            name = first + " " + last;
          }
          if (options.prefix) {
            name = this.prefix(options) + " " + name;
          }
          if (options.suffix) {
            name = name + " " + this.suffix(options);
          }
          return name;
        };
        Chance2.prototype.name_prefixes = function(gender) {
          gender = gender || "all";
          gender = gender.toLowerCase();
          var prefixes = [
            { name: "Doctor", abbreviation: "Dr." }
          ];
          if (gender === "male" || gender === "all") {
            prefixes.push({ name: "Mister", abbreviation: "Mr." });
          }
          if (gender === "female" || gender === "all") {
            prefixes.push({ name: "Miss", abbreviation: "Miss" });
            prefixes.push({ name: "Misses", abbreviation: "Mrs." });
          }
          return prefixes;
        };
        Chance2.prototype.prefix = function(options) {
          return this.name_prefix(options);
        };
        Chance2.prototype.name_prefix = function(options) {
          options = initOptions(options, { gender: "all" });
          return options.full ? this.pick(this.name_prefixes(options.gender)).name : this.pick(this.name_prefixes(options.gender)).abbreviation;
        };
        Chance2.prototype.HIDN = function() {
          var idn_pool = "0123456789";
          var idn_chrs = "ABCDEFGHIJKLMNOPQRSTUVWXYXZ";
          var idn = "";
          idn += this.string({ pool: idn_pool, length: 6 });
          idn += this.string({ pool: idn_chrs, length: 2 });
          return idn;
        };
        Chance2.prototype.ssn = function(options) {
          options = initOptions(options, { ssnFour: false, dashes: true });
          var ssn_pool = "1234567890", ssn, dash = options.dashes ? "-" : "";
          if (!options.ssnFour) {
            ssn = this.string({ pool: ssn_pool, length: 3 }) + dash + this.string({ pool: ssn_pool, length: 2 }) + dash + this.string({ pool: ssn_pool, length: 4 });
          } else {
            ssn = this.string({ pool: ssn_pool, length: 4 });
          }
          return ssn;
        };
        Chance2.prototype.aadhar = function(options) {
          options = initOptions(options, { onlyLastFour: false, separatedByWhiteSpace: true });
          var aadhar_pool = "1234567890", aadhar, whiteSpace = options.separatedByWhiteSpace ? " " : "";
          if (!options.onlyLastFour) {
            aadhar = this.string({ pool: aadhar_pool, length: 4 }) + whiteSpace + this.string({ pool: aadhar_pool, length: 4 }) + whiteSpace + this.string({ pool: aadhar_pool, length: 4 });
          } else {
            aadhar = this.string({ pool: aadhar_pool, length: 4 });
          }
          return aadhar;
        };
        Chance2.prototype.name_suffixes = function() {
          var suffixes = [
            { name: "Doctor of Osteopathic Medicine", abbreviation: "D.O." },
            { name: "Doctor of Philosophy", abbreviation: "Ph.D." },
            { name: "Esquire", abbreviation: "Esq." },
            { name: "Junior", abbreviation: "Jr." },
            { name: "Juris Doctor", abbreviation: "J.D." },
            { name: "Master of Arts", abbreviation: "M.A." },
            { name: "Master of Business Administration", abbreviation: "M.B.A." },
            { name: "Master of Science", abbreviation: "M.S." },
            { name: "Medical Doctor", abbreviation: "M.D." },
            { name: "Senior", abbreviation: "Sr." },
            { name: "The Third", abbreviation: "III" },
            { name: "The Fourth", abbreviation: "IV" },
            { name: "Bachelor of Engineering", abbreviation: "B.E" },
            { name: "Bachelor of Technology", abbreviation: "B.TECH" }
          ];
          return suffixes;
        };
        Chance2.prototype.suffix = function(options) {
          return this.name_suffix(options);
        };
        Chance2.prototype.name_suffix = function(options) {
          options = initOptions(options);
          return options.full ? this.pick(this.name_suffixes()).name : this.pick(this.name_suffixes()).abbreviation;
        };
        Chance2.prototype.nationalities = function() {
          return this.get("nationalities");
        };
        Chance2.prototype.nationality = function() {
          var nationality = this.pick(this.nationalities());
          return nationality.name;
        };
        Chance2.prototype.android_id = function() {
          return "APA91" + this.string({ pool: "0123456789abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_", length: 178 });
        };
        Chance2.prototype.apple_token = function() {
          return this.string({ pool: "abcdef1234567890", length: 64 });
        };
        Chance2.prototype.wp8_anid2 = function() {
          return base64(this.hash({ length: 32 }));
        };
        Chance2.prototype.wp7_anid = function() {
          return "A=" + this.guid().replace(/-/g, "").toUpperCase() + "&E=" + this.hash({ length: 3 }) + "&W=" + this.integer({ min: 0, max: 9 });
        };
        Chance2.prototype.bb_pin = function() {
          return this.hash({ length: 8 });
        };
        Chance2.prototype.avatar = function(options) {
          var url = null;
          var URL_BASE = "//www.gravatar.com/avatar/";
          var PROTOCOLS = {
            http: "http",
            https: "https"
          };
          var FILE_TYPES = {
            bmp: "bmp",
            gif: "gif",
            jpg: "jpg",
            png: "png"
          };
          var FALLBACKS = {
            "404": "404",
            mm: "mm",
            identicon: "identicon",
            monsterid: "monsterid",
            wavatar: "wavatar",
            retro: "retro",
            blank: "blank"
          };
          var RATINGS = {
            g: "g",
            pg: "pg",
            r: "r",
            x: "x"
          };
          var opts = {
            protocol: null,
            email: null,
            fileExtension: null,
            size: null,
            fallback: null,
            rating: null
          };
          if (!options) {
            opts.email = this.email();
            options = {};
          } else if (typeof options === "string") {
            opts.email = options;
            options = {};
          } else if (typeof options !== "object") {
            return null;
          } else if (options.constructor === "Array") {
            return null;
          }
          opts = initOptions(options, opts);
          if (!opts.email) {
            opts.email = this.email();
          }
          opts.protocol = PROTOCOLS[opts.protocol] ? opts.protocol + ":" : "";
          opts.size = parseInt(opts.size, 0) ? opts.size : "";
          opts.rating = RATINGS[opts.rating] ? opts.rating : "";
          opts.fallback = FALLBACKS[opts.fallback] ? opts.fallback : "";
          opts.fileExtension = FILE_TYPES[opts.fileExtension] ? opts.fileExtension : "";
          url = opts.protocol + URL_BASE + this.bimd5.md5(opts.email) + (opts.fileExtension ? "." + opts.fileExtension : "") + (opts.size || opts.rating || opts.fallback ? "?" : "") + (opts.size ? "&s=" + opts.size.toString() : "") + (opts.rating ? "&r=" + opts.rating : "") + (opts.fallback ? "&d=" + opts.fallback : "");
          return url;
        };
        Chance2.prototype.color = function(options) {
          function gray(value, delimiter) {
            return [value, value, value].join(delimiter || "");
          }
          __name(gray, "gray");
          function rgb2(hasAlpha) {
            var rgbValue = hasAlpha ? "rgba" : "rgb";
            var alphaChannel = hasAlpha ? "," + this.floating({ min: min_alpha, max: max_alpha }) : "";
            var colorValue2 = isGrayscale ? gray(this.natural({ min: min_rgb, max: max_rgb }), ",") : this.natural({ min: min_green, max: max_green }) + "," + this.natural({ min: min_blue, max: max_blue }) + "," + this.natural({ max: 255 });
            return rgbValue + "(" + colorValue2 + alphaChannel + ")";
          }
          __name(rgb2, "rgb");
          function hex(start, end, withHash) {
            var symbol = withHash ? "#" : "";
            var hexstring = "";
            if (isGrayscale) {
              hexstring = gray(this.pad(this.hex({ min: min_rgb, max: max_rgb }), 2));
              if (options.format === "shorthex") {
                hexstring = gray(this.hex({ min: 0, max: 15 }));
              }
            } else {
              if (options.format === "shorthex") {
                hexstring = this.pad(this.hex({ min: Math.floor(min_red / 16), max: Math.floor(max_red / 16) }), 1) + this.pad(this.hex({ min: Math.floor(min_green / 16), max: Math.floor(max_green / 16) }), 1) + this.pad(this.hex({ min: Math.floor(min_blue / 16), max: Math.floor(max_blue / 16) }), 1);
              } else if (min_red !== void 0 || max_red !== void 0 || min_green !== void 0 || max_green !== void 0 || min_blue !== void 0 || max_blue !== void 0) {
                hexstring = this.pad(this.hex({ min: min_red, max: max_red }), 2) + this.pad(this.hex({ min: min_green, max: max_green }), 2) + this.pad(this.hex({ min: min_blue, max: max_blue }), 2);
              } else {
                hexstring = this.pad(this.hex({ min: min_rgb, max: max_rgb }), 2) + this.pad(this.hex({ min: min_rgb, max: max_rgb }), 2) + this.pad(this.hex({ min: min_rgb, max: max_rgb }), 2);
              }
            }
            return symbol + hexstring;
          }
          __name(hex, "hex");
          options = initOptions(options, {
            format: this.pick(["hex", "shorthex", "rgb", "rgba", "0x", "name"]),
            grayscale: false,
            casing: "lower",
            min: 0,
            max: 255,
            min_red: void 0,
            max_red: void 0,
            min_green: void 0,
            max_green: void 0,
            min_blue: void 0,
            max_blue: void 0,
            min_alpha: 0,
            max_alpha: 1
          });
          var isGrayscale = options.grayscale;
          var min_rgb = options.min;
          var max_rgb = options.max;
          var min_red = options.min_red;
          var max_red = options.max_red;
          var min_green = options.min_green;
          var max_green = options.max_green;
          var min_blue = options.min_blue;
          var max_blue = options.max_blue;
          var min_alpha = options.min_alpha;
          var max_alpha = options.max_alpha;
          if (options.min_red === void 0) {
            min_red = min_rgb;
          }
          if (options.max_red === void 0) {
            max_red = max_rgb;
          }
          if (options.min_green === void 0) {
            min_green = min_rgb;
          }
          if (options.max_green === void 0) {
            max_green = max_rgb;
          }
          if (options.min_blue === void 0) {
            min_blue = min_rgb;
          }
          if (options.max_blue === void 0) {
            max_blue = max_rgb;
          }
          if (options.min_alpha === void 0) {
            min_alpha = 0;
          }
          if (options.max_alpha === void 0) {
            max_alpha = 1;
          }
          if (isGrayscale && min_rgb === 0 && max_rgb === 255 && min_red !== void 0 && max_red !== void 0) {
            min_rgb = (min_red + min_green + min_blue) / 3;
            max_rgb = (max_red + max_green + max_blue) / 3;
          }
          var colorValue;
          if (options.format === "hex") {
            colorValue = hex.call(this, 2, 6, true);
          } else if (options.format === "shorthex") {
            colorValue = hex.call(this, 1, 3, true);
          } else if (options.format === "rgb") {
            colorValue = rgb2.call(this, false);
          } else if (options.format === "rgba") {
            colorValue = rgb2.call(this, true);
          } else if (options.format === "0x") {
            colorValue = "0x" + hex.call(this, 2, 6);
          } else if (options.format === "name") {
            return this.pick(this.get("colorNames"));
          } else {
            throw new RangeError('Invalid format provided. Please provide one of "hex", "shorthex", "rgb", "rgba", "0x" or "name".');
          }
          if (options.casing === "upper") {
            colorValue = colorValue.toUpperCase();
          }
          return colorValue;
        };
        Chance2.prototype.domain = function(options) {
          options = initOptions(options);
          return this.word() + "." + (options.tld || this.tld());
        };
        Chance2.prototype.email = function(options) {
          options = initOptions(options);
          return this.word({ length: options.length }) + "@" + (options.domain || this.domain());
        };
        Chance2.prototype.fbid = function() {
          return "10000" + this.string({ pool: "1234567890", length: 11 });
        };
        Chance2.prototype.google_analytics = function() {
          var account = this.pad(this.natural({ max: 999999 }), 6);
          var property = this.pad(this.natural({ max: 99 }), 2);
          return "UA-" + account + "-" + property;
        };
        Chance2.prototype.hashtag = function() {
          return "#" + this.word();
        };
        Chance2.prototype.ip = function() {
          return this.natural({ min: 1, max: 254 }) + "." + this.natural({ max: 255 }) + "." + this.natural({ max: 255 }) + "." + this.natural({ min: 1, max: 254 });
        };
        Chance2.prototype.ipv6 = function() {
          var ip_addr = this.n(this.hash, 8, { length: 4 });
          return ip_addr.join(":");
        };
        Chance2.prototype.klout = function() {
          return this.natural({ min: 1, max: 99 });
        };
        Chance2.prototype.mac = function(options) {
          options = initOptions(options, { delimiter: ":" });
          return this.pad(this.natural({ max: 255 }).toString(16), 2) + options.delimiter + this.pad(this.natural({ max: 255 }).toString(16), 2) + options.delimiter + this.pad(this.natural({ max: 255 }).toString(16), 2) + options.delimiter + this.pad(this.natural({ max: 255 }).toString(16), 2) + options.delimiter + this.pad(this.natural({ max: 255 }).toString(16), 2) + options.delimiter + this.pad(this.natural({ max: 255 }).toString(16), 2);
        };
        Chance2.prototype.semver = function(options) {
          options = initOptions(options, { include_prerelease: true });
          var range2 = this.pickone(["^", "~", "<", ">", "<=", ">=", "="]);
          if (options.range) {
            range2 = options.range;
          }
          var prerelease = "";
          if (options.include_prerelease) {
            prerelease = this.weighted(["", "-dev", "-beta", "-alpha"], [50, 10, 5, 1]);
          }
          return range2 + this.rpg("3d10").join(".") + prerelease;
        };
        Chance2.prototype.tlds = function() {
          return ["com", "org", "edu", "gov", "co.uk", "net", "io", "ac", "ad", "ae", "af", "ag", "ai", "al", "am", "ao", "aq", "ar", "as", "at", "au", "aw", "ax", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bm", "bn", "bo", "br", "bs", "bt", "bv", "bw", "by", "bz", "ca", "cc", "cd", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "co", "cr", "cu", "cv", "cw", "cx", "cy", "cz", "de", "dj", "dk", "dm", "do", "dz", "ec", "ee", "eg", "eh", "er", "es", "et", "eu", "fi", "fj", "fk", "fm", "fo", "fr", "ga", "gb", "gd", "ge", "gf", "gg", "gh", "gi", "gl", "gm", "gn", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr", "ht", "hu", "id", "ie", "il", "im", "in", "io", "iq", "ir", "is", "it", "je", "jm", "jo", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz", "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md", "me", "mg", "mh", "mk", "ml", "mm", "mn", "mo", "mp", "mq", "mr", "ms", "mt", "mu", "mv", "mw", "mx", "my", "mz", "na", "nc", "ne", "nf", "ng", "ni", "nl", "no", "np", "nr", "nu", "nz", "om", "pa", "pe", "pf", "pg", "ph", "pk", "pl", "pm", "pn", "pr", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa", "sb", "sc", "sd", "se", "sg", "sh", "si", "sj", "sk", "sl", "sm", "sn", "so", "sr", "ss", "st", "su", "sv", "sx", "sy", "sz", "tc", "td", "tf", "tg", "th", "tj", "tk", "tl", "tm", "tn", "to", "tp", "tr", "tt", "tv", "tw", "tz", "ua", "ug", "uk", "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "wf", "ws", "ye", "yt", "za", "zm", "zw"];
        };
        Chance2.prototype.tld = function() {
          return this.pick(this.tlds());
        };
        Chance2.prototype.twitter = function() {
          return "@" + this.word();
        };
        Chance2.prototype.url = function(options) {
          options = initOptions(options, { protocol: "http", domain: this.domain(options), domain_prefix: "", path: this.word(), extensions: [] });
          var extension = options.extensions.length > 0 ? "." + this.pick(options.extensions) : "";
          var domain = options.domain_prefix ? options.domain_prefix + "." + options.domain : options.domain;
          return options.protocol + "://" + domain + "/" + options.path + extension;
        };
        Chance2.prototype.port = function() {
          return this.integer({ min: 0, max: 65535 });
        };
        Chance2.prototype.locale = function(options) {
          options = initOptions(options);
          if (options.region) {
            return this.pick(this.get("locale_regions"));
          } else {
            return this.pick(this.get("locale_languages"));
          }
        };
        Chance2.prototype.locales = function(options) {
          options = initOptions(options);
          if (options.region) {
            return this.get("locale_regions");
          } else {
            return this.get("locale_languages");
          }
        };
        Chance2.prototype.loremPicsum = function(options) {
          options = initOptions(options, { width: 500, height: 500, greyscale: false, blurred: false });
          var greyscale = options.greyscale ? "g/" : "";
          var query = options.blurred ? "/?blur" : "/?random";
          return "https://picsum.photos/" + greyscale + options.width + "/" + options.height + query;
        };
        Chance2.prototype.address = function(options) {
          options = initOptions(options);
          return this.natural({ min: 5, max: 2e3 }) + " " + this.street(options);
        };
        Chance2.prototype.altitude = function(options) {
          options = initOptions(options, { fixed: 5, min: 0, max: 8848 });
          return this.floating({
            min: options.min,
            max: options.max,
            fixed: options.fixed
          });
        };
        Chance2.prototype.areacode = function(options) {
          options = initOptions(options, { parens: true });
          var areacode = options.exampleNumber ? "555" : this.natural({ min: 2, max: 9 }).toString() + this.natural({ min: 0, max: 8 }).toString() + this.natural({ min: 0, max: 9 }).toString();
          return options.parens ? "(" + areacode + ")" : areacode;
        };
        Chance2.prototype.city = function() {
          return this.capitalize(this.word({ syllables: 3 }));
        };
        Chance2.prototype.coordinates = function(options) {
          return this.latitude(options) + ", " + this.longitude(options);
        };
        Chance2.prototype.countries = function() {
          return this.get("countries");
        };
        Chance2.prototype.country = function(options) {
          options = initOptions(options);
          var country = this.pick(this.countries());
          return options.raw ? country : options.full ? country.name : country.abbreviation;
        };
        Chance2.prototype.depth = function(options) {
          options = initOptions(options, { fixed: 5, min: -10994, max: 0 });
          return this.floating({
            min: options.min,
            max: options.max,
            fixed: options.fixed
          });
        };
        Chance2.prototype.geohash = function(options) {
          options = initOptions(options, { length: 7 });
          return this.string({ length: options.length, pool: "0123456789bcdefghjkmnpqrstuvwxyz" });
        };
        Chance2.prototype.geojson = function(options) {
          return this.latitude(options) + ", " + this.longitude(options) + ", " + this.altitude(options);
        };
        Chance2.prototype.latitude = function(options) {
          var [DDM, DMS, DD] = ["ddm", "dms", "dd"];
          options = initOptions(options, options && options.format && [DDM, DMS].includes(options.format.toLowerCase()) ? { min: 0, max: 89, fixed: 4 } : { fixed: 5, min: -90, max: 90, format: DD });
          var format = options.format.toLowerCase();
          if (format === DDM || format === DMS) {
            testRange(options.min < 0 || options.min > 89, "Chance: Min specified is out of range. Should be between 0 - 89");
            testRange(options.max < 0 || options.max > 89, "Chance: Max specified is out of range. Should be between 0 - 89");
            testRange(options.fixed > 4, "Chance: Fixed specified should be below or equal to 4");
          }
          switch (format) {
            case DDM: {
              return this.integer({ min: options.min, max: options.max }) + "\xB0" + this.floating({ min: 0, max: 59, fixed: options.fixed });
            }
            case DMS: {
              return this.integer({ min: options.min, max: options.max }) + "\xB0" + this.integer({ min: 0, max: 59 }) + "\u2019" + this.floating({ min: 0, max: 59, fixed: options.fixed }) + "\u201D";
            }
            case DD:
            default: {
              return this.floating({ min: options.min, max: options.max, fixed: options.fixed });
            }
          }
        };
        Chance2.prototype.longitude = function(options) {
          var [DDM, DMS, DD] = ["ddm", "dms", "dd"];
          options = initOptions(options, options && options.format && [DDM, DMS].includes(options.format.toLowerCase()) ? { min: 0, max: 179, fixed: 4 } : { fixed: 5, min: -180, max: 180, format: DD });
          var format = options.format.toLowerCase();
          if (format === DDM || format === DMS) {
            testRange(options.min < 0 || options.min > 179, "Chance: Min specified is out of range. Should be between 0 - 179");
            testRange(options.max < 0 || options.max > 179, "Chance: Max specified is out of range. Should be between 0 - 179");
            testRange(options.fixed > 4, "Chance: Fixed specified should be below or equal to 4");
          }
          switch (format) {
            case DDM: {
              return this.integer({ min: options.min, max: options.max }) + "\xB0" + this.floating({ min: 0, max: 59.9999, fixed: options.fixed });
            }
            case DMS: {
              return this.integer({ min: options.min, max: options.max }) + "\xB0" + this.integer({ min: 0, max: 59 }) + "\u2019" + this.floating({ min: 0, max: 59.9999, fixed: options.fixed }) + "\u201D";
            }
            case DD:
            default: {
              return this.floating({ min: options.min, max: options.max, fixed: options.fixed });
            }
          }
        };
        Chance2.prototype.phone = function(options) {
          var self2 = this, numPick, ukNum = /* @__PURE__ */ __name(function(parts) {
            var section = [];
            parts.sections.forEach(function(n) {
              section.push(self2.string({ pool: "0123456789", length: n }));
            });
            return parts.area + section.join(" ");
          }, "ukNum");
          options = initOptions(options, {
            formatted: true,
            country: "us",
            mobile: false,
            exampleNumber: false
          });
          if (!options.formatted) {
            options.parens = false;
          }
          var phone;
          switch (options.country) {
            case "fr":
              if (!options.mobile) {
                numPick = this.pick([
                  "01" + this.pick(["30", "34", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "53", "55", "56", "58", "60", "64", "69", "70", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "02" + this.pick(["14", "18", "22", "23", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "40", "41", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "56", "57", "61", "62", "69", "72", "76", "77", "78", "85", "90", "96", "97", "98", "99"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "03" + this.pick(["10", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "39", "44", "45", "51", "52", "54", "55", "57", "58", "59", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "04" + this.pick(["11", "13", "15", "20", "22", "26", "27", "30", "32", "34", "37", "42", "43", "44", "50", "56", "57", "63", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "88", "89", "90", "91", "92", "93", "94", "95", "97", "98"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "05" + this.pick(["08", "16", "17", "19", "24", "31", "32", "33", "34", "35", "40", "45", "46", "47", "49", "53", "55", "56", "57", "58", "59", "61", "62", "63", "64", "65", "67", "79", "81", "82", "86", "87", "90", "94"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "09" + self2.string({ pool: "0123456789", length: 8 })
                ]);
                phone = options.formatted ? numPick.match(/../g).join(" ") : numPick;
              } else {
                numPick = this.pick(["06", "07"]) + self2.string({ pool: "0123456789", length: 8 });
                phone = options.formatted ? numPick.match(/../g).join(" ") : numPick;
              }
              break;
            case "uk":
              if (!options.mobile) {
                numPick = this.pick([
                  { area: "01" + this.character({ pool: "234569" }) + "1 ", sections: [3, 4] },
                  { area: "020 " + this.character({ pool: "378" }), sections: [3, 4] },
                  { area: "023 " + this.character({ pool: "89" }), sections: [3, 4] },
                  { area: "024 7", sections: [3, 4] },
                  { area: "028 " + this.pick(["25", "28", "37", "71", "82", "90", "92", "95"]), sections: [2, 4] },
                  { area: "012" + this.pick(["04", "08", "54", "76", "97", "98"]) + " ", sections: [6] },
                  { area: "013" + this.pick(["63", "64", "84", "86"]) + " ", sections: [6] },
                  { area: "014" + this.pick(["04", "20", "60", "61", "80", "88"]) + " ", sections: [6] },
                  { area: "015" + this.pick(["24", "27", "62", "66"]) + " ", sections: [6] },
                  { area: "016" + this.pick(["06", "29", "35", "47", "59", "95"]) + " ", sections: [6] },
                  { area: "017" + this.pick(["26", "44", "50", "68"]) + " ", sections: [6] },
                  { area: "018" + this.pick(["27", "37", "84", "97"]) + " ", sections: [6] },
                  { area: "019" + this.pick(["00", "05", "35", "46", "49", "63", "95"]) + " ", sections: [6] }
                ]);
                phone = options.formatted ? ukNum(numPick) : ukNum(numPick).replace(" ", "", "g");
              } else {
                numPick = this.pick([
                  { area: "07" + this.pick(["4", "5", "7", "8", "9"]), sections: [2, 6] },
                  { area: "07624 ", sections: [6] }
                ]);
                phone = options.formatted ? ukNum(numPick) : ukNum(numPick).replace(" ", "");
              }
              break;
            case "za":
              if (!options.mobile) {
                numPick = this.pick([
                  "01" + this.pick(["0", "1", "2", "3", "4", "5", "6", "7", "8"]) + self2.string({ pool: "0123456789", length: 7 }),
                  "02" + this.pick(["1", "2", "3", "4", "7", "8"]) + self2.string({ pool: "0123456789", length: 7 }),
                  "03" + this.pick(["1", "2", "3", "5", "6", "9"]) + self2.string({ pool: "0123456789", length: 7 }),
                  "04" + this.pick(["1", "2", "3", "4", "5", "6", "7", "8", "9"]) + self2.string({ pool: "0123456789", length: 7 }),
                  "05" + this.pick(["1", "3", "4", "6", "7", "8"]) + self2.string({ pool: "0123456789", length: 7 })
                ]);
                phone = options.formatted || numPick;
              } else {
                numPick = this.pick([
                  "060" + this.pick(["3", "4", "5", "6", "7", "8", "9"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "061" + this.pick(["0", "1", "2", "3", "4", "5", "8"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "06" + self2.string({ pool: "0123456789", length: 7 }),
                  "071" + this.pick(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]) + self2.string({ pool: "0123456789", length: 6 }),
                  "07" + this.pick(["2", "3", "4", "6", "7", "8", "9"]) + self2.string({ pool: "0123456789", length: 7 }),
                  "08" + this.pick(["0", "1", "2", "3", "4", "5"]) + self2.string({ pool: "0123456789", length: 7 })
                ]);
                phone = options.formatted || numPick;
              }
              break;
            case "us":
              var areacode = this.areacode(options).toString();
              var exchange = this.natural({ min: 2, max: 9 }).toString() + this.natural({ min: 0, max: 9 }).toString() + this.natural({ min: 0, max: 9 }).toString();
              var subscriber = this.natural({ min: 1e3, max: 9999 }).toString();
              phone = options.formatted ? areacode + " " + exchange + "-" + subscriber : areacode + exchange + subscriber;
              break;
            case "br":
              var areaCode = this.pick(["11", "12", "13", "14", "15", "16", "17", "18", "19", "21", "22", "24", "27", "28", "31", "32", "33", "34", "35", "37", "38", "41", "42", "43", "44", "45", "46", "47", "48", "49", "51", "53", "54", "55", "61", "62", "63", "64", "65", "66", "67", "68", "69", "71", "73", "74", "75", "77", "79", "81", "82", "83", "84", "85", "86", "87", "88", "89", "91", "92", "93", "94", "95", "96", "97", "98", "99"]);
              var prefix;
              if (options.mobile) {
                prefix = "9" + self2.string({ pool: "0123456789", length: 4 });
              } else {
                prefix = this.natural({ min: 2e3, max: 5999 }).toString();
              }
              var mcdu = self2.string({ pool: "0123456789", length: 4 });
              phone = options.formatted ? "(" + areaCode + ") " + prefix + "-" + mcdu : areaCode + prefix + mcdu;
              break;
          }
          return phone;
        };
        Chance2.prototype.postal = function() {
          var pd = this.character({ pool: "XVTSRPNKLMHJGECBA" });
          var fsa = pd + this.natural({ max: 9 }) + this.character({ alpha: true, casing: "upper" });
          var ldu = this.natural({ max: 9 }) + this.character({ alpha: true, casing: "upper" }) + this.natural({ max: 9 });
          return fsa + " " + ldu;
        };
        Chance2.prototype.postcode = function() {
          var area2 = this.pick(this.get("postcodeAreas")).code;
          var district = this.natural({ max: 9 });
          var subDistrict = this.bool() ? this.character({ alpha: true, casing: "upper" }) : "";
          var outward = area2 + district + subDistrict;
          var sector = this.natural({ max: 9 });
          var unit = this.character({ alpha: true, casing: "upper" }) + this.character({ alpha: true, casing: "upper" });
          var inward = sector + unit;
          return outward + " " + inward;
        };
        Chance2.prototype.counties = function(options) {
          options = initOptions(options, { country: "uk" });
          return this.get("counties")[options.country.toLowerCase()];
        };
        Chance2.prototype.county = function(options) {
          return this.pick(this.counties(options)).name;
        };
        Chance2.prototype.provinces = function(options) {
          options = initOptions(options, { country: "ca" });
          return this.get("provinces")[options.country.toLowerCase()];
        };
        Chance2.prototype.province = function(options) {
          return options && options.full ? this.pick(this.provinces(options)).name : this.pick(this.provinces(options)).abbreviation;
        };
        Chance2.prototype.state = function(options) {
          return options && options.full ? this.pick(this.states(options)).name : this.pick(this.states(options)).abbreviation;
        };
        Chance2.prototype.states = function(options) {
          options = initOptions(options, { country: "us", us_states_and_dc: true });
          var states;
          switch (options.country.toLowerCase()) {
            case "us":
              var us_states_and_dc = this.get("us_states_and_dc"), territories = this.get("territories"), armed_forces = this.get("armed_forces");
              states = [];
              if (options.us_states_and_dc) {
                states = states.concat(us_states_and_dc);
              }
              if (options.territories) {
                states = states.concat(territories);
              }
              if (options.armed_forces) {
                states = states.concat(armed_forces);
              }
              break;
            case "it":
            case "mx":
              states = this.get("country_regions")[options.country.toLowerCase()];
              break;
            case "uk":
              states = this.get("counties")[options.country.toLowerCase()];
              break;
          }
          return states;
        };
        Chance2.prototype.street = function(options) {
          options = initOptions(options, { country: "us", syllables: 2 });
          var street;
          switch (options.country.toLowerCase()) {
            case "us":
              street = this.word({ syllables: options.syllables });
              street = this.capitalize(street);
              street += " ";
              street += options.short_suffix ? this.street_suffix(options).abbreviation : this.street_suffix(options).name;
              break;
            case "it":
              street = this.word({ syllables: options.syllables });
              street = this.capitalize(street);
              street = (options.short_suffix ? this.street_suffix(options).abbreviation : this.street_suffix(options).name) + " " + street;
              break;
          }
          return street;
        };
        Chance2.prototype.street_suffix = function(options) {
          options = initOptions(options, { country: "us" });
          return this.pick(this.street_suffixes(options));
        };
        Chance2.prototype.street_suffixes = function(options) {
          options = initOptions(options, { country: "us" });
          return this.get("street_suffixes")[options.country.toLowerCase()];
        };
        Chance2.prototype.zip = function(options) {
          var zip = this.n(this.natural, 5, { max: 9 });
          if (options && options.plusfour === true) {
            zip.push("-");
            zip = zip.concat(this.n(this.natural, 4, { max: 9 }));
          }
          return zip.join("");
        };
        Chance2.prototype.ampm = function() {
          return this.bool() ? "am" : "pm";
        };
        Chance2.prototype.date = function(options) {
          var date_string, date;
          if (options && (options.min || options.max)) {
            options = initOptions(options, {
              american: true,
              string: false
            });
            var min = typeof options.min !== "undefined" ? options.min.getTime() : 1;
            var max = typeof options.max !== "undefined" ? options.max.getTime() : 864e13;
            date = new Date(this.integer({ min, max }));
          } else {
            var m = this.month({ raw: true });
            var daysInMonth = m.days;
            if (options && options.month) {
              daysInMonth = this.get("months")[(options.month % 12 + 12) % 12].days;
            }
            options = initOptions(options, {
              year: parseInt(this.year(), 10),
              month: m.numeric - 1,
              day: this.natural({ min: 1, max: daysInMonth }),
              hour: this.hour({ twentyfour: true }),
              minute: this.minute(),
              second: this.second(),
              millisecond: this.millisecond(),
              american: true,
              string: false
            });
            date = new Date(options.year, options.month, options.day, options.hour, options.minute, options.second, options.millisecond);
          }
          if (options.american) {
            date_string = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
          } else {
            date_string = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
          }
          return options.string ? date_string : date;
        };
        Chance2.prototype.hammertime = function(options) {
          return this.date(options).getTime();
        };
        Chance2.prototype.hour = function(options) {
          options = initOptions(options, {
            min: options && options.twentyfour ? 0 : 1,
            max: options && options.twentyfour ? 23 : 12
          });
          testRange(options.min < 0, "Chance: Min cannot be less than 0.");
          testRange(options.twentyfour && options.max > 23, "Chance: Max cannot be greater than 23 for twentyfour option.");
          testRange(!options.twentyfour && options.max > 12, "Chance: Max cannot be greater than 12.");
          testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
          return this.natural({ min: options.min, max: options.max });
        };
        Chance2.prototype.millisecond = function() {
          return this.natural({ max: 999 });
        };
        Chance2.prototype.minute = Chance2.prototype.second = function(options) {
          options = initOptions(options, { min: 0, max: 59 });
          testRange(options.min < 0, "Chance: Min cannot be less than 0.");
          testRange(options.max > 59, "Chance: Max cannot be greater than 59.");
          testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
          return this.natural({ min: options.min, max: options.max });
        };
        Chance2.prototype.month = function(options) {
          options = initOptions(options, { min: 1, max: 12 });
          testRange(options.min < 1, "Chance: Min cannot be less than 1.");
          testRange(options.max > 12, "Chance: Max cannot be greater than 12.");
          testRange(options.min > options.max, "Chance: Min cannot be greater than Max.");
          var month = this.pick(this.months().slice(options.min - 1, options.max));
          return options.raw ? month : month.name;
        };
        Chance2.prototype.months = function() {
          return this.get("months");
        };
        Chance2.prototype.second = function() {
          return this.natural({ max: 59 });
        };
        Chance2.prototype.timestamp = function() {
          return this.natural({ min: 1, max: parseInt(new Date().getTime() / 1e3, 10) });
        };
        Chance2.prototype.weekday = function(options) {
          options = initOptions(options, { weekday_only: false });
          var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
          if (!options.weekday_only) {
            weekdays.push("Saturday");
            weekdays.push("Sunday");
          }
          return this.pickone(weekdays);
        };
        Chance2.prototype.year = function(options) {
          options = initOptions(options, { min: new Date().getFullYear() });
          options.max = typeof options.max !== "undefined" ? options.max : options.min + 100;
          return this.natural(options).toString();
        };
        Chance2.prototype.cc = function(options) {
          options = initOptions(options);
          var type, number, to_generate;
          type = options.type ? this.cc_type({ name: options.type, raw: true }) : this.cc_type({ raw: true });
          number = type.prefix.split("");
          to_generate = type.length - type.prefix.length - 1;
          number = number.concat(this.n(this.integer, to_generate, { min: 0, max: 9 }));
          number.push(this.luhn_calculate(number.join("")));
          return number.join("");
        };
        Chance2.prototype.cc_types = function() {
          return this.get("cc_types");
        };
        Chance2.prototype.cc_type = function(options) {
          options = initOptions(options);
          var types = this.cc_types(), type = null;
          if (options.name) {
            for (var i = 0; i < types.length; i++) {
              if (types[i].name === options.name || types[i].short_name === options.name) {
                type = types[i];
                break;
              }
            }
            if (type === null) {
              throw new RangeError("Chance: Credit card type '" + options.name + "' is not supported");
            }
          } else {
            type = this.pick(types);
          }
          return options.raw ? type : type.name;
        };
        Chance2.prototype.currency_types = function() {
          return this.get("currency_types");
        };
        Chance2.prototype.currency = function() {
          return this.pick(this.currency_types());
        };
        Chance2.prototype.timezones = function() {
          return this.get("timezones");
        };
        Chance2.prototype.timezone = function() {
          return this.pick(this.timezones());
        };
        Chance2.prototype.currency_pair = function(returnAsString) {
          var currencies = this.unique(this.currency, 2, {
            comparator: function(arr, val) {
              return arr.reduce(function(acc, item) {
                return acc || item.code === val.code;
              }, false);
            }
          });
          if (returnAsString) {
            return currencies[0].code + "/" + currencies[1].code;
          } else {
            return currencies;
          }
        };
        Chance2.prototype.dollar = function(options) {
          options = initOptions(options, { max: 1e4, min: 0 });
          var dollar = this.floating({ min: options.min, max: options.max, fixed: 2 }).toString(), cents = dollar.split(".")[1];
          if (cents === void 0) {
            dollar += ".00";
          } else if (cents.length < 2) {
            dollar = dollar + "0";
          }
          if (dollar < 0) {
            return "-$" + dollar.replace("-", "");
          } else {
            return "$" + dollar;
          }
        };
        Chance2.prototype.euro = function(options) {
          return Number(this.dollar(options).replace("$", "")).toLocaleString() + "\u20AC";
        };
        Chance2.prototype.exp = function(options) {
          options = initOptions(options);
          var exp = {};
          exp.year = this.exp_year();
          if (exp.year === new Date().getFullYear().toString()) {
            exp.month = this.exp_month({ future: true });
          } else {
            exp.month = this.exp_month();
          }
          return options.raw ? exp : exp.month + "/" + exp.year;
        };
        Chance2.prototype.exp_month = function(options) {
          options = initOptions(options);
          var month, month_int, curMonth = new Date().getMonth() + 1;
          if (options.future && curMonth !== 12) {
            do {
              month = this.month({ raw: true }).numeric;
              month_int = parseInt(month, 10);
            } while (month_int <= curMonth);
          } else {
            month = this.month({ raw: true }).numeric;
          }
          return month;
        };
        Chance2.prototype.exp_year = function() {
          var curMonth = new Date().getMonth() + 1, curYear = new Date().getFullYear();
          return this.year({ min: curMonth === 12 ? curYear + 1 : curYear, max: curYear + 10 });
        };
        Chance2.prototype.vat = function(options) {
          options = initOptions(options, { country: "it" });
          switch (options.country.toLowerCase()) {
            case "it":
              return this.it_vat();
          }
        };
        Chance2.prototype.iban = function() {
          var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          var alphanum = alpha + "0123456789";
          var iban = this.string({ length: 2, pool: alpha }) + this.pad(this.integer({ min: 0, max: 99 }), 2) + this.string({ length: 4, pool: alphanum }) + this.pad(this.natural(), this.natural({ min: 6, max: 26 }));
          return iban;
        };
        Chance2.prototype.it_vat = function() {
          var it_vat = this.natural({ min: 1, max: 18e5 });
          it_vat = this.pad(it_vat, 7) + this.pad(this.pick(this.provinces({ country: "it" })).code, 3);
          return it_vat + this.luhn_calculate(it_vat);
        };
        Chance2.prototype.cf = function(options) {
          options = options || {};
          var gender = !!options.gender ? options.gender : this.gender(), first = !!options.first ? options.first : this.first({ gender, nationality: "it" }), last = !!options.last ? options.last : this.last({ nationality: "it" }), birthday = !!options.birthday ? options.birthday : this.birthday(), city = !!options.city ? options.city : this.pickone(["A", "B", "C", "D", "E", "F", "G", "H", "I", "L", "M", "Z"]) + this.pad(this.natural({ max: 999 }), 3), cf = [], name_generator = /* @__PURE__ */ __name(function(name, isLast) {
            var temp, return_value = [];
            if (name.length < 3) {
              return_value = name.split("").concat("XXX".split("")).splice(0, 3);
            } else {
              temp = name.toUpperCase().split("").map(function(c) {
                return "BCDFGHJKLMNPRSTVWZ".indexOf(c) !== -1 ? c : void 0;
              }).join("");
              if (temp.length > 3) {
                if (isLast) {
                  temp = temp.substr(0, 3);
                } else {
                  temp = temp[0] + temp.substr(2, 2);
                }
              }
              if (temp.length < 3) {
                return_value = temp;
                temp = name.toUpperCase().split("").map(function(c) {
                  return "AEIOU".indexOf(c) !== -1 ? c : void 0;
                }).join("").substr(0, 3 - return_value.length);
              }
              return_value = return_value + temp;
            }
            return return_value;
          }, "name_generator"), date_generator = /* @__PURE__ */ __name(function(birthday2, gender2, that) {
            var lettermonths = ["A", "B", "C", "D", "E", "H", "L", "M", "P", "R", "S", "T"];
            return birthday2.getFullYear().toString().substr(2) + lettermonths[birthday2.getMonth()] + that.pad(birthday2.getDate() + (gender2.toLowerCase() === "female" ? 40 : 0), 2);
          }, "date_generator"), checkdigit_generator = /* @__PURE__ */ __name(function(cf2) {
            var range1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", range2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ", evens = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", odds = "BAKPLCQDREVOSFTGUHMINJWZYX", digit = 0;
            for (var i = 0; i < 15; i++) {
              if (i % 2 !== 0) {
                digit += evens.indexOf(range2[range1.indexOf(cf2[i])]);
              } else {
                digit += odds.indexOf(range2[range1.indexOf(cf2[i])]);
              }
            }
            return evens[digit % 26];
          }, "checkdigit_generator");
          cf = cf.concat(name_generator(last, true), name_generator(first), date_generator(birthday, gender, this), city.toUpperCase().split("")).join("");
          cf += checkdigit_generator(cf.toUpperCase(), this);
          return cf.toUpperCase();
        };
        Chance2.prototype.pl_pesel = function() {
          var number = this.natural({ min: 1, max: 9999999999 });
          var arr = this.pad(number, 10).split("");
          for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i]);
          }
          var controlNumber = (1 * arr[0] + 3 * arr[1] + 7 * arr[2] + 9 * arr[3] + 1 * arr[4] + 3 * arr[5] + 7 * arr[6] + 9 * arr[7] + 1 * arr[8] + 3 * arr[9]) % 10;
          if (controlNumber !== 0) {
            controlNumber = 10 - controlNumber;
          }
          return arr.join("") + controlNumber;
        };
        Chance2.prototype.pl_nip = function() {
          var number = this.natural({ min: 1, max: 999999999 });
          var arr = this.pad(number, 9).split("");
          for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i]);
          }
          var controlNumber = (6 * arr[0] + 5 * arr[1] + 7 * arr[2] + 2 * arr[3] + 3 * arr[4] + 4 * arr[5] + 5 * arr[6] + 6 * arr[7] + 7 * arr[8]) % 11;
          if (controlNumber === 10) {
            return this.pl_nip();
          }
          return arr.join("") + controlNumber;
        };
        Chance2.prototype.pl_regon = function() {
          var number = this.natural({ min: 1, max: 99999999 });
          var arr = this.pad(number, 8).split("");
          for (var i = 0; i < arr.length; i++) {
            arr[i] = parseInt(arr[i]);
          }
          var controlNumber = (8 * arr[0] + 9 * arr[1] + 2 * arr[2] + 3 * arr[3] + 4 * arr[4] + 5 * arr[5] + 6 * arr[6] + 7 * arr[7]) % 11;
          if (controlNumber === 10) {
            controlNumber = 0;
          }
          return arr.join("") + controlNumber;
        };
        Chance2.prototype.note = function(options) {
          options = initOptions(options, { notes: "flatKey" });
          var scales = {
            naturals: ["C", "D", "E", "F", "G", "A", "B"],
            flats: ["D\u266D", "E\u266D", "G\u266D", "A\u266D", "B\u266D"],
            sharps: ["C\u266F", "D\u266F", "F\u266F", "G\u266F", "A\u266F"]
          };
          scales.all = scales.naturals.concat(scales.flats.concat(scales.sharps));
          scales.flatKey = scales.naturals.concat(scales.flats);
          scales.sharpKey = scales.naturals.concat(scales.sharps);
          return this.pickone(scales[options.notes]);
        };
        Chance2.prototype.midi_note = function(options) {
          var min = 0;
          var max = 127;
          options = initOptions(options, { min, max });
          return this.integer({ min: options.min, max: options.max });
        };
        Chance2.prototype.chord_quality = function(options) {
          options = initOptions(options, { jazz: true });
          var chord_qualities = ["maj", "min", "aug", "dim"];
          if (options.jazz) {
            chord_qualities = [
              "maj7",
              "min7",
              "7",
              "sus",
              "dim",
              "\xF8"
            ];
          }
          return this.pickone(chord_qualities);
        };
        Chance2.prototype.chord = function(options) {
          options = initOptions(options);
          return this.note(options) + this.chord_quality(options);
        };
        Chance2.prototype.tempo = function(options) {
          var min = 40;
          var max = 320;
          options = initOptions(options, { min, max });
          return this.integer({ min: options.min, max: options.max });
        };
        Chance2.prototype.coin = function() {
          return this.bool() ? "heads" : "tails";
        };
        function diceFn(range2) {
          return function() {
            return this.natural(range2);
          };
        }
        __name(diceFn, "diceFn");
        Chance2.prototype.d4 = diceFn({ min: 1, max: 4 });
        Chance2.prototype.d6 = diceFn({ min: 1, max: 6 });
        Chance2.prototype.d8 = diceFn({ min: 1, max: 8 });
        Chance2.prototype.d10 = diceFn({ min: 1, max: 10 });
        Chance2.prototype.d12 = diceFn({ min: 1, max: 12 });
        Chance2.prototype.d20 = diceFn({ min: 1, max: 20 });
        Chance2.prototype.d30 = diceFn({ min: 1, max: 30 });
        Chance2.prototype.d100 = diceFn({ min: 1, max: 100 });
        Chance2.prototype.rpg = function(thrown, options) {
          options = initOptions(options);
          if (!thrown) {
            throw new RangeError("Chance: A type of die roll must be included");
          } else {
            var bits = thrown.toLowerCase().split("d"), rolls = [];
            if (bits.length !== 2 || !parseInt(bits[0], 10) || !parseInt(bits[1], 10)) {
              throw new Error("Chance: Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die");
            }
            for (var i = bits[0]; i > 0; i--) {
              rolls[i - 1] = this.natural({ min: 1, max: bits[1] });
            }
            return typeof options.sum !== "undefined" && options.sum ? rolls.reduce(function(p, c) {
              return p + c;
            }) : rolls;
          }
        };
        Chance2.prototype.guid = function(options) {
          options = initOptions(options, { version: 5 });
          var guid_pool = "abcdef1234567890", variant_pool = "ab89", guid = this.string({ pool: guid_pool, length: 8 }) + "-" + this.string({ pool: guid_pool, length: 4 }) + "-" + options.version + this.string({ pool: guid_pool, length: 3 }) + "-" + this.string({ pool: variant_pool, length: 1 }) + this.string({ pool: guid_pool, length: 3 }) + "-" + this.string({ pool: guid_pool, length: 12 });
          return guid;
        };
        Chance2.prototype.hash = function(options) {
          options = initOptions(options, { length: 40, casing: "lower" });
          var pool = options.casing === "upper" ? HEX_POOL.toUpperCase() : HEX_POOL;
          return this.string({ pool, length: options.length });
        };
        Chance2.prototype.luhn_check = function(num) {
          var str = num.toString();
          var checkDigit = +str.substring(str.length - 1);
          return checkDigit === this.luhn_calculate(+str.substring(0, str.length - 1));
        };
        Chance2.prototype.luhn_calculate = function(num) {
          var digits = num.toString().split("").reverse();
          var sum = 0;
          var digit;
          for (var i = 0, l = digits.length; l > i; ++i) {
            digit = +digits[i];
            if (i % 2 === 0) {
              digit *= 2;
              if (digit > 9) {
                digit -= 9;
              }
            }
            sum += digit;
          }
          return sum * 9 % 10;
        };
        Chance2.prototype.md5 = function(options) {
          var opts = { str: "", key: null, raw: false };
          if (!options) {
            opts.str = this.string();
            options = {};
          } else if (typeof options === "string") {
            opts.str = options;
            options = {};
          } else if (typeof options !== "object") {
            return null;
          } else if (options.constructor === "Array") {
            return null;
          }
          opts = initOptions(options, opts);
          if (!opts.str) {
            throw new Error("A parameter is required to return an md5 hash.");
          }
          return this.bimd5.md5(opts.str, opts.key, opts.raw);
        };
        Chance2.prototype.file = function(options) {
          var fileOptions = options || {};
          var poolCollectionKey = "fileExtension";
          var typeRange = Object.keys(this.get("fileExtension"));
          var fileName;
          var fileExtension;
          fileName = this.word({ length: fileOptions.length });
          if (fileOptions.extension) {
            fileExtension = fileOptions.extension;
            return fileName + "." + fileExtension;
          }
          if (fileOptions.extensions) {
            if (Array.isArray(fileOptions.extensions)) {
              fileExtension = this.pickone(fileOptions.extensions);
              return fileName + "." + fileExtension;
            } else if (fileOptions.extensions.constructor === Object) {
              var extensionObjectCollection = fileOptions.extensions;
              var keys = Object.keys(extensionObjectCollection);
              fileExtension = this.pickone(extensionObjectCollection[this.pickone(keys)]);
              return fileName + "." + fileExtension;
            }
            throw new Error("Chance: Extensions must be an Array or Object");
          }
          if (fileOptions.fileType) {
            var fileType = fileOptions.fileType;
            if (typeRange.indexOf(fileType) !== -1) {
              fileExtension = this.pickone(this.get(poolCollectionKey)[fileType]);
              return fileName + "." + fileExtension;
            }
            throw new RangeError("Chance: Expect file type value to be 'raster', 'vector', '3d' or 'document'");
          }
          fileExtension = this.pickone(this.get(poolCollectionKey)[this.pickone(typeRange)]);
          return fileName + "." + fileExtension;
        };
        var data = {
          firstNames: {
            "male": {
              "en": ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Charles", "Thomas", "Christopher", "Daniel", "Matthew", "George", "Donald", "Anthony", "Paul", "Mark", "Edward", "Steven", "Kenneth", "Andrew", "Brian", "Joshua", "Kevin", "Ronald", "Timothy", "Jason", "Jeffrey", "Frank", "Gary", "Ryan", "Nicholas", "Eric", "Stephen", "Jacob", "Larry", "Jonathan", "Scott", "Raymond", "Justin", "Brandon", "Gregory", "Samuel", "Benjamin", "Patrick", "Jack", "Henry", "Walter", "Dennis", "Jerry", "Alexander", "Peter", "Tyler", "Douglas", "Harold", "Aaron", "Jose", "Adam", "Arthur", "Zachary", "Carl", "Nathan", "Albert", "Kyle", "Lawrence", "Joe", "Willie", "Gerald", "Roger", "Keith", "Jeremy", "Terry", "Harry", "Ralph", "Sean", "Jesse", "Roy", "Louis", "Billy", "Austin", "Bruce", "Eugene", "Christian", "Bryan", "Wayne", "Russell", "Howard", "Fred", "Ethan", "Jordan", "Philip", "Alan", "Juan", "Randy", "Vincent", "Bobby", "Dylan", "Johnny", "Phillip", "Victor", "Clarence", "Ernest", "Martin", "Craig", "Stanley", "Shawn", "Travis", "Bradley", "Leonard", "Earl", "Gabriel", "Jimmy", "Francis", "Todd", "Noah", "Danny", "Dale", "Cody", "Carlos", "Allen", "Frederick", "Logan", "Curtis", "Alex", "Joel", "Luis", "Norman", "Marvin", "Glenn", "Tony", "Nathaniel", "Rodney", "Melvin", "Alfred", "Steve", "Cameron", "Chad", "Edwin", "Caleb", "Evan", "Antonio", "Lee", "Herbert", "Jeffery", "Isaac", "Derek", "Ricky", "Marcus", "Theodore", "Elijah", "Luke", "Jesus", "Eddie", "Troy", "Mike", "Dustin", "Ray", "Adrian", "Bernard", "Leroy", "Angel", "Randall", "Wesley", "Ian", "Jared", "Mason", "Hunter", "Calvin", "Oscar", "Clifford", "Jay", "Shane", "Ronnie", "Barry", "Lucas", "Corey", "Manuel", "Leo", "Tommy", "Warren", "Jackson", "Isaiah", "Connor", "Don", "Dean", "Jon", "Julian", "Miguel", "Bill", "Lloyd", "Charlie", "Mitchell", "Leon", "Jerome", "Darrell", "Jeremiah", "Alvin", "Brett", "Seth", "Floyd", "Jim", "Blake", "Micheal", "Gordon", "Trevor", "Lewis", "Erik", "Edgar", "Vernon", "Devin", "Gavin", "Jayden", "Chris", "Clyde", "Tom", "Derrick", "Mario", "Brent", "Marc", "Herman", "Chase", "Dominic", "Ricardo", "Franklin", "Maurice", "Max", "Aiden", "Owen", "Lester", "Gilbert", "Elmer", "Gene", "Francisco", "Glen", "Cory", "Garrett", "Clayton", "Sam", "Jorge", "Chester", "Alejandro", "Jeff", "Harvey", "Milton", "Cole", "Ivan", "Andre", "Duane", "Landon"],
              "it": ["Adolfo", "Alberto", "Aldo", "Alessandro", "Alessio", "Alfredo", "Alvaro", "Andrea", "Angelo", "Angiolo", "Antonino", "Antonio", "Attilio", "Benito", "Bernardo", "Bruno", "Carlo", "Cesare", "Christian", "Claudio", "Corrado", "Cosimo", "Cristian", "Cristiano", "Daniele", "Dario", "David", "Davide", "Diego", "Dino", "Domenico", "Duccio", "Edoardo", "Elia", "Elio", "Emanuele", "Emiliano", "Emilio", "Enrico", "Enzo", "Ettore", "Fabio", "Fabrizio", "Federico", "Ferdinando", "Fernando", "Filippo", "Francesco", "Franco", "Gabriele", "Giacomo", "Giampaolo", "Giampiero", "Giancarlo", "Gianfranco", "Gianluca", "Gianmarco", "Gianni", "Gino", "Giorgio", "Giovanni", "Giuliano", "Giulio", "Giuseppe", "Graziano", "Gregorio", "Guido", "Iacopo", "Jacopo", "Lapo", "Leonardo", "Lorenzo", "Luca", "Luciano", "Luigi", "Manuel", "Marcello", "Marco", "Marino", "Mario", "Massimiliano", "Massimo", "Matteo", "Mattia", "Maurizio", "Mauro", "Michele", "Mirko", "Mohamed", "Nello", "Neri", "Niccol\xF2", "Nicola", "Osvaldo", "Otello", "Paolo", "Pier Luigi", "Piero", "Pietro", "Raffaele", "Remo", "Renato", "Renzo", "Riccardo", "Roberto", "Rolando", "Romano", "Salvatore", "Samuele", "Sandro", "Sergio", "Silvano", "Simone", "Stefano", "Thomas", "Tommaso", "Ubaldo", "Ugo", "Umberto", "Valerio", "Valter", "Vasco", "Vincenzo", "Vittorio"],
              "nl": ["Aaron", "Abel", "Adam", "Adriaan", "Albert", "Alexander", "Ali", "Arjen", "Arno", "Bart", "Bas", "Bastiaan", "Benjamin", "Bob", "Boris", "Bram", "Brent", "Cas", "Casper", "Chris", "Christiaan", "Cornelis", "Daan", "Daley", "Damian", "Dani", "Daniel", "Dani\xEBl", "David", "Dean", "Dirk", "Dylan", "Egbert", "Elijah", "Erik", "Erwin", "Evert", "Ezra", "Fabian", "Fedde", "Finn", "Florian", "Floris", "Frank", "Frans", "Frederik", "Freek", "Geert", "Gerard", "Gerben", "Gerrit", "Gijs", "Guus", "Hans", "Hendrik", "Henk", "Herman", "Hidde", "Hugo", "Jaap", "Jan Jaap", "Jan-Willem", "Jack", "Jacob", "Jan", "Jason", "Jasper", "Jayden", "Jelle", "Jelte", "Jens", "Jeroen", "Jesse", "Jim", "Job", "Joep", "Johannes", "John", "Jonathan", "Joris", "Joshua", "Jo\xEBl", "Julian", "Kees", "Kevin", "Koen", "Lars", "Laurens", "Leendert", "Lennard", "Lodewijk", "Luc", "Luca", "Lucas", "Lukas", "Luuk", "Maarten", "Marcus", "Martijn", "Martin", "Matthijs", "Maurits", "Max", "Mees", "Melle", "Mick", "Mika", "Milan", "Mohamed", "Mohammed", "Morris", "Muhammed", "Nathan", "Nick", "Nico", "Niek", "Niels", "Noah", "Noud", "Olivier", "Oscar", "Owen", "Paul", "Pepijn", "Peter", "Pieter", "Pim", "Quinten", "Reinier", "Rens", "Robin", "Ruben", "Sam", "Samuel", "Sander", "Sebastiaan", "Sem", "Sep", "Sepp", "Siem", "Simon", "Stan", "Stef", "Steven", "Stijn", "Sven", "Teun", "Thijmen", "Thijs", "Thomas", "Tijn", "Tim", "Timo", "Tobias", "Tom", "Victor", "Vince", "Willem", "Wim", "Wouter", "Yusuf"],
              "fr": ["Aaron", "Abdon", "Abel", "Ab\xE9lard", "Abelin", "Abondance", "Abraham", "Absalon", "Acace", "Achaire", "Achille", "Adalard", "Adalbald", "Adalb\xE9ron", "Adalbert", "Adalric", "Adam", "Adegrin", "Adel", "Adelin", "Andelin", "Adelphe", "Adam", "Ad\xE9odat", "Adh\xE9mar", "Adjutor", "Adolphe", "Adonis", "Adon", "Adrien", "Agapet", "Agathange", "Agathon", "Agilbert", "Ag\xE9nor", "Agnan", "Aignan", "Agrippin", "Aimable", "Aim\xE9", "Alain", "Alban", "Albin", "Aubin", "Alb\xE9ric", "Albert", "Albertet", "Alcibiade", "Alcide", "Alc\xE9e", "Alcime", "Aldonce", "Aldric", "Ald\xE9ric", "Aleaume", "Alexandre", "Alexis", "Alix", "Alliaume", "Aleaume", "Almine", "Almire", "Alo\xEFs", "Alph\xE9e", "Alphonse", "Alpinien", "Alver\xE8de", "Amalric", "Amaury", "Amandin", "Amant", "Ambroise", "Am\xE9d\xE9e", "Am\xE9lien", "Amiel", "Amour", "Ana\xEBl", "Anastase", "Anatole", "Ancelin", "And\xE9ol", "Andoche", "Andr\xE9", "Andoche", "Ange", "Angelin", "Angilbe", "Anglebert", "Angoustan", "Anicet", "Anne", "Annibal", "Ansbert", "Anselme", "Anthelme", "Antheaume", "Anthime", "Antide", "Antoine", "Antonius", "Antonin", "Apollinaire", "Apollon", "Aquilin", "Arcade", "Archambaud", "Archambeau", "Archange", "Archibald", "Arian", "Ariel", "Ariste", "Aristide", "Armand", "Armel", "Armin", "Arnould", "Arnaud", "Arolde", "Ars\xE8ne", "Arsino\xE9", "Arthaud", "Arth\xE8me", "Arthur", "Ascelin", "Athanase", "Aubry", "Audebert", "Audouin", "Audran", "Audric", "Auguste", "Augustin", "Aur\xE8le", "Aur\xE9lien", "Aurian", "Auxence", "Axel", "Aymard", "Aymeric", "Aymon", "Aymond", "Balthazar", "Baptiste", "Barnab\xE9", "Barth\xE9lemy", "Bartim\xE9e", "Basile", "Bastien", "Baudouin", "B\xE9nigne", "Benjamin", "Beno\xEEt", "B\xE9renger", "B\xE9rard", "Bernard", "Bertrand", "Blaise", "Bon", "Boniface", "Bouchard", "Brice", "Brieuc", "Bruno", "Brunon", "Calixte", "Calliste", "Cam\xE9lien", "Camille", "Camillien", "Candide", "Caribert", "Carloman", "Cassandre", "Cassien", "C\xE9dric", "C\xE9leste", "C\xE9lestin", "C\xE9lien", "C\xE9saire", "C\xE9sar", "Charles", "Charlemagne", "Childebert", "Chilp\xE9ric", "Chr\xE9tien", "Christian", "Christodule", "Christophe", "Chrysostome", "Clarence", "Claude", "Claudien", "Cl\xE9andre", "Cl\xE9ment", "Clotaire", "C\xF4me", "Constance", "Constant", "Constantin", "Corentin", "Cyprien", "Cyriaque", "Cyrille", "Cyril", "Damien", "Daniel", "David", "Delphin", "Denis", "D\xE9sir\xE9", "Didier", "Dieudonn\xE9", "Dimitri", "Dominique", "Dorian", "Doroth\xE9e", "Edgard", "Edmond", "\xC9douard", "\xC9leuth\xE8re", "\xC9lie", "\xC9lis\xE9e", "\xC9meric", "\xC9mile", "\xC9milien", "Emmanuel", "Enguerrand", "\xC9piphane", "\xC9ric", "Esprit", "Ernest", "\xC9tienne", "Eubert", "Eudes", "Eudoxe", "Eug\xE8ne", "Eus\xE8be", "Eustache", "\xC9variste", "\xC9vrard", "Fabien", "Fabrice", "Falba", "F\xE9licit\xE9", "F\xE9lix", "Ferdinand", "Fiacre", "Fid\xE8le", "Firmin", "Flavien", "Flodoard", "Florent", "Florentin", "Florestan", "Florian", "Fortun\xE9", "Foulques", "Francisque", "Fran\xE7ois", "Fran\xE7ais", "Franciscus", "Francs", "Fr\xE9d\xE9ric", "Fulbert", "Fulcran", "Fulgence", "Gabin", "Gabriel", "Ga\xEBl", "Garnier", "Gaston", "Gaspard", "Gatien", "Gaud", "Gautier", "G\xE9d\xE9on", "Geoffroy", "Georges", "G\xE9raud", "G\xE9rard", "Gerbert", "Germain", "Gervais", "Ghislain", "Gilbert", "Gilles", "Girart", "Gislebert", "Gondebaud", "Gonthier", "Gontran", "Gonzague", "Gr\xE9goire", "Gu\xE9rin", "Gui", "Guillaume", "Gustave", "Guy", "Guyot", "Hardouin", "Hector", "H\xE9delin", "H\xE9lier", "Henri", "Herbert", "Herluin", "Herv\xE9", "Hilaire", "Hildebert", "Hincmar", "Hippolyte", "Honor\xE9", "Hubert", "Hugues", "Innocent", "Isabeau", "Isidore", "Jacques", "Japhet", "Jason", "Jean", "Jeannel", "Jeannot", "J\xE9r\xE9mie", "J\xE9r\xF4me", "Joachim", "Joanny", "Job", "Jocelyn", "Jo\xEBl", "Johan", "Jonas", "Jonathan", "Joseph", "Josse", "Josselin", "Jourdain", "Jude", "Judica\xEBl", "Jules", "Julien", "Juste", "Justin", "Lambert", "Landry", "Laurent", "Lazare", "L\xE9andre", "L\xE9on", "L\xE9onard", "L\xE9opold", "Leu", "Loup", "Leufroy", "Lib\xE8re", "Li\xE9tald", "Lionel", "Lo\xEFc", "Longin", "Lorrain", "Lorraine", "Lothaire", "Louis", "Loup", "Luc", "Lucas", "Lucien", "Ludolphe", "Ludovic", "Macaire", "Malo", "Mamert", "Manass\xE9", "Marc", "Marceau", "Marcel", "Marcelin", "Marius", "Marseille", "Martial", "Martin", "Mathurin", "Matthias", "Mathias", "Matthieu", "Maugis", "Maurice", "Mauricet", "Maxence", "Maxime", "Maximilien", "Mayeul", "M\xE9d\xE9ric", "Melchior", "Mence", "Merlin", "M\xE9rov\xE9e", "Micha\xEBl", "Michel", "Mo\xEFse", "Morgan", "Nathan", "Nathana\xEBl", "Narcisse", "N\xE9h\xE9mie", "Nestor", "Nestor", "Nic\xE9phore", "Nicolas", "No\xE9", "No\xEBl", "Norbert", "Normand", "Normands", "Octave", "Odilon", "Odon", "Oger", "Olivier", "Oury", "Pac\xF4me", "Pal\xE9mon", "Parfait", "Pascal", "Paterne", "Patrice", "Paul", "P\xE9pin", "Perceval", "Phil\xE9mon", "Philibert", "Philippe", "Philoth\xE9e", "Pie", "Pierre", "Pierrick", "Prosper", "Quentin", "Raoul", "Rapha\xEBl", "Raymond", "R\xE9gis", "R\xE9jean", "R\xE9mi", "Renaud", "Ren\xE9", "Reybaud", "Richard", "Robert", "Roch", "Rodolphe", "Rodrigue", "Roger", "Roland", "Romain", "Romuald", "Rom\xE9o", "Rome", "Ronan", "Roselin", "Salomon", "Samuel", "Savin", "Savinien", "Scholastique", "S\xE9bastien", "S\xE9raphin", "Serge", "S\xE9verin", "Sidoine", "Sigebert", "Sigismond", "Silv\xE8re", "Simon", "Sim\xE9on", "Sixte", "Stanislas", "St\xE9phane", "Stephan", "Sylvain", "Sylvestre", "Tancr\xE8de", "Tanguy", "Taurin", "Th\xE9odore", "Th\xE9odose", "Th\xE9ophile", "Th\xE9ophraste", "Thibault", "Thibert", "Thierry", "Thomas", "Timol\xE9on", "Timoth\xE9e", "Titien", "Tonnin", "Toussaint", "Trajan", "Tristan", "Turold", "Tim", "Ulysse", "Urbain", "Valentin", "Val\xE8re", "Val\xE9ry", "Venance", "Venant", "Venceslas", "Vianney", "Victor", "Victorien", "Victorin", "Vigile", "Vincent", "Vital", "Vitalien", "Vivien", "Waleran", "Wandrille", "Xavier", "X\xE9nophon", "Yves", "Zacharie", "Zach\xE9", "Z\xE9phirin"]
            },
            "female": {
              "en": ["Mary", "Emma", "Elizabeth", "Minnie", "Margaret", "Ida", "Alice", "Bertha", "Sarah", "Annie", "Clara", "Ella", "Florence", "Cora", "Martha", "Laura", "Nellie", "Grace", "Carrie", "Maude", "Mabel", "Bessie", "Jennie", "Gertrude", "Julia", "Hattie", "Edith", "Mattie", "Rose", "Catherine", "Lillian", "Ada", "Lillie", "Helen", "Jessie", "Louise", "Ethel", "Lula", "Myrtle", "Eva", "Frances", "Lena", "Lucy", "Edna", "Maggie", "Pearl", "Daisy", "Fannie", "Josephine", "Dora", "Rosa", "Katherine", "Agnes", "Marie", "Nora", "May", "Mamie", "Blanche", "Stella", "Ellen", "Nancy", "Effie", "Sallie", "Nettie", "Della", "Lizzie", "Flora", "Susie", "Maud", "Mae", "Etta", "Harriet", "Sadie", "Caroline", "Katie", "Lydia", "Elsie", "Kate", "Susan", "Mollie", "Alma", "Addie", "Georgia", "Eliza", "Lulu", "Nannie", "Lottie", "Amanda", "Belle", "Charlotte", "Rebecca", "Ruth", "Viola", "Olive", "Amelia", "Hannah", "Jane", "Virginia", "Emily", "Matilda", "Irene", "Kathryn", "Esther", "Willie", "Henrietta", "Ollie", "Amy", "Rachel", "Sara", "Estella", "Theresa", "Augusta", "Ora", "Pauline", "Josie", "Lola", "Sophia", "Leona", "Anne", "Mildred", "Ann", "Beulah", "Callie", "Lou", "Delia", "Eleanor", "Barbara", "Iva", "Louisa", "Maria", "Mayme", "Evelyn", "Estelle", "Nina", "Betty", "Marion", "Bettie", "Dorothy", "Luella", "Inez", "Lela", "Rosie", "Allie", "Millie", "Janie", "Cornelia", "Victoria", "Ruby", "Winifred", "Alta", "Celia", "Christine", "Beatrice", "Birdie", "Harriett", "Mable", "Myra", "Sophie", "Tillie", "Isabel", "Sylvia", "Carolyn", "Isabelle", "Leila", "Sally", "Ina", "Essie", "Bertie", "Nell", "Alberta", "Katharine", "Lora", "Rena", "Mina", "Rhoda", "Mathilda", "Abbie", "Eula", "Dollie", "Hettie", "Eunice", "Fanny", "Ola", "Lenora", "Adelaide", "Christina", "Lelia", "Nelle", "Sue", "Johanna", "Lilly", "Lucinda", "Minerva", "Lettie", "Roxie", "Cynthia", "Helena", "Hilda", "Hulda", "Bernice", "Genevieve", "Jean", "Cordelia", "Marian", "Francis", "Jeanette", "Adeline", "Gussie", "Leah", "Lois", "Lura", "Mittie", "Hallie", "Isabella", "Olga", "Phoebe", "Teresa", "Hester", "Lida", "Lina", "Winnie", "Claudia", "Marguerite", "Vera", "Cecelia", "Bess", "Emilie", "Rosetta", "Verna", "Myrtie", "Cecilia", "Elva", "Olivia", "Ophelia", "Georgie", "Elnora", "Violet", "Adele", "Lily", "Linnie", "Loretta", "Madge", "Polly", "Virgie", "Eugenia", "Lucile", "Lucille", "Mabelle", "Rosalie"],
              "it": ["Ada", "Adriana", "Alessandra", "Alessia", "Alice", "Angela", "Anna", "Anna Maria", "Annalisa", "Annita", "Annunziata", "Antonella", "Arianna", "Asia", "Assunta", "Aurora", "Barbara", "Beatrice", "Benedetta", "Bianca", "Bruna", "Camilla", "Carla", "Carlotta", "Carmela", "Carolina", "Caterina", "Catia", "Cecilia", "Chiara", "Cinzia", "Clara", "Claudia", "Costanza", "Cristina", "Daniela", "Debora", "Diletta", "Dina", "Donatella", "Elena", "Eleonora", "Elisa", "Elisabetta", "Emanuela", "Emma", "Eva", "Federica", "Fernanda", "Fiorella", "Fiorenza", "Flora", "Franca", "Francesca", "Gabriella", "Gaia", "Gemma", "Giada", "Gianna", "Gina", "Ginevra", "Giorgia", "Giovanna", "Giulia", "Giuliana", "Giuseppa", "Giuseppina", "Grazia", "Graziella", "Greta", "Ida", "Ilaria", "Ines", "Iolanda", "Irene", "Irma", "Isabella", "Jessica", "Laura", "Lea", "Letizia", "Licia", "Lidia", "Liliana", "Lina", "Linda", "Lisa", "Livia", "Loretta", "Luana", "Lucia", "Luciana", "Lucrezia", "Luisa", "Manuela", "Mara", "Marcella", "Margherita", "Maria", "Maria Cristina", "Maria Grazia", "Maria Luisa", "Maria Pia", "Maria Teresa", "Marina", "Marisa", "Marta", "Martina", "Marzia", "Matilde", "Melissa", "Michela", "Milena", "Mirella", "Monica", "Natalina", "Nella", "Nicoletta", "Noemi", "Olga", "Paola", "Patrizia", "Piera", "Pierina", "Raffaella", "Rebecca", "Renata", "Rina", "Rita", "Roberta", "Rosa", "Rosanna", "Rossana", "Rossella", "Sabrina", "Sandra", "Sara", "Serena", "Silvana", "Silvia", "Simona", "Simonetta", "Sofia", "Sonia", "Stefania", "Susanna", "Teresa", "Tina", "Tiziana", "Tosca", "Valentina", "Valeria", "Vanda", "Vanessa", "Vanna", "Vera", "Veronica", "Vilma", "Viola", "Virginia", "Vittoria"],
              "nl": ["Ada", "Arianne", "Afke", "Amanda", "Amber", "Amy", "Aniek", "Anita", "Anja", "Anna", "Anne", "Annelies", "Annemarie", "Annette", "Anouk", "Astrid", "Aukje", "Barbara", "Bianca", "Carla", "Carlijn", "Carolien", "Chantal", "Charlotte", "Claudia", "Dani\xEBlle", "Debora", "Diane", "Dora", "Eline", "Elise", "Ella", "Ellen", "Emma", "Esmee", "Evelien", "Esther", "Erica", "Eva", "Femke", "Fleur", "Floor", "Froukje", "Gea", "Gerda", "Hanna", "Hanneke", "Heleen", "Hilde", "Ilona", "Ina", "Inge", "Ingrid", "Iris", "Isabel", "Isabelle", "Janneke", "Jasmijn", "Jeanine", "Jennifer", "Jessica", "Johanna", "Joke", "Julia", "Julie", "Karen", "Karin", "Katja", "Kim", "Lara", "Laura", "Lena", "Lianne", "Lieke", "Lilian", "Linda", "Lisa", "Lisanne", "Lotte", "Louise", "Maaike", "Manon", "Marga", "Maria", "Marissa", "Marit", "Marjolein", "Martine", "Marleen", "Melissa", "Merel", "Miranda", "Michelle", "Mirjam", "Mirthe", "Naomi", "Natalie", "Nienke", "Nina", "Noortje", "Olivia", "Patricia", "Paula", "Paulien", "Ramona", "Ria", "Rianne", "Roos", "Rosanne", "Ruth", "Sabrina", "Sandra", "Sanne", "Sara", "Saskia", "Silvia", "Sofia", "Sophie", "Sonja", "Suzanne", "Tamara", "Tess", "Tessa", "Tineke", "Valerie", "Vanessa", "Veerle", "Vera", "Victoria", "Wendy", "Willeke", "Yvonne", "Zo\xEB"],
              "fr": ["Abdon", "Abel", "Abiga\xEBlle", "Abiga\xEFl", "Acacius", "Acanthe", "Adalbert", "Adalsinde", "Adegrine", "Ad\xE9la\xEFde", "Ad\xE8le", "Ad\xE9lie", "Adeline", "Adeltrude", "Adolphe", "Adonis", "Adrast\xE9e", "Adrehilde", "Adrienne", "Agathe", "Agilbert", "Agla\xE9", "Aignan", "Agnefl\xE8te", "Agn\xE8s", "Agrippine", "Aim\xE9", "Alaine", "Ala\xEFs", "Albane", "Alb\xE9rade", "Alberte", "Alcide", "Alcine", "Alcyone", "Aldegonde", "Aleth", "Alexandrine", "Alexine", "Alice", "Ali\xE9nor", "Aliette", "Aline", "Alix", "Aliz\xE9", "Alo\xEFse", "Aloyse", "Alphonsine", "Alth\xE9e", "Amaliane", "Amalth\xE9e", "Amande", "Amandine", "Amant", "Amarande", "Amaranthe", "Amaryllis", "Ambre", "Ambroisie", "Am\xE9lie", "Am\xE9thyste", "Aminte", "Ana\xEBl", "Ana\xEFs", "Anastasie", "Anatole", "Ancelin", "Andr\xE9e", "An\xE9mone", "Angadr\xEAme", "Ang\xE8le", "Angeline", "Ang\xE9lique", "Angilbert", "Anicet", "Annabelle", "Anne", "Annette", "Annick", "Annie", "Annonciade", "Ansbert", "Anstrudie", "Anthelme", "Antigone", "Antoinette", "Antonine", "Aph\xE9lie", "Apolline", "Apollonie", "Aquiline", "Arabelle", "Arcadie", "Archange", "Argine", "Ariane", "Aricie", "Ariel", "Arielle", "Arlette", "Armance", "Armande", "Armandine", "Armelle", "Armide", "Armelle", "Armin", "Arnaud", "Ars\xE8ne", "Arsino\xE9", "Art\xE9mis", "Arthur", "Ascelin", "Ascension", "Assomption", "Astart\xE9", "Ast\xE9rie", "Astr\xE9e", "Astrid", "Athalie", "Athanasie", "Athina", "Aube", "Albert", "Aude", "Audrey", "Augustine", "Aure", "Aur\xE9lie", "Aur\xE9lien", "Aur\xE8le", "Aurore", "Auxence", "Aveline", "Abiga\xEBlle", "Avoye", "Axelle", "Aymard", "Azal\xE9e", "Ad\xE8le", "Adeline", "Barbe", "Basilisse", "Bathilde", "B\xE9atrice", "B\xE9atrix", "B\xE9n\xE9dicte", "B\xE9reng\xE8re", "Bernadette", "Berthe", "Bertille", "Beuve", "Blanche", "Blanc", "Blandine", "Brigitte", "Brune", "Brunehilde", "Callista", "Camille", "Capucine", "Carine", "Caroline", "Cassandre", "Catherine", "C\xE9cile", "C\xE9leste", "C\xE9lestine", "C\xE9line", "Chantal", "Charl\xE8ne", "Charline", "Charlotte", "Chlo\xE9", "Christelle", "Christiane", "Christine", "Claire", "Clara", "Claude", "Claudine", "Clarisse", "Cl\xE9mence", "Cl\xE9mentine", "Cl\xE9o", "Clio", "Clotilde", "Coline", "Conception", "Constance", "Coralie", "Coraline", "Corentine", "Corinne", "Cyrielle", "Daniel", "Daniel", "Daphn\xE9", "D\xE9bora", "Delphine", "Denise", "Diane", "Dieudonn\xE9", "Dominique", "Doriane", "Doroth\xE9e", "Douce", "\xC9dith", "Edm\xE9e", "\xC9l\xE9onore", "\xC9liane", "\xC9lia", "\xC9liette", "\xC9lisabeth", "\xC9lise", "Ella", "\xC9lodie", "\xC9lo\xEFse", "Elsa", "\xC9meline", "\xC9m\xE9rance", "\xC9m\xE9rentienne", "\xC9m\xE9rencie", "\xC9milie", "Emma", "Emmanuelle", "Emmelie", "Ernestine", "Esther", "Estelle", "Eudoxie", "Eug\xE9nie", "Eulalie", "Euphrasie", "Eus\xE9bie", "\xC9vang\xE9line", "Eva", "\xC8ve", "\xC9velyne", "Fanny", "Fantine", "Faustine", "F\xE9licie", "Fernande", "Flavie", "Fleur", "Flore", "Florence", "Florie", "Fortun\xE9", "France", "Francia", "Fran\xE7oise", "Francine", "Gabrielle", "Ga\xEBlle", "Garance", "Genevi\xE8ve", "Georgette", "Gerberge", "Germaine", "Gertrude", "Gis\xE8le", "Gueni\xE8vre", "Guilhemine", "Guillemette", "Gustave", "Gwenael", "H\xE9l\xE8ne", "H\xE9lo\xEFse", "Henriette", "Hermine", "Hermione", "Hippolyte", "Honorine", "Hortense", "Huguette", "Ines", "Ir\xE8ne", "Irina", "Iris", "Isabeau", "Isabelle", "Iseult", "Isolde", "Ism\xE9rie", "Jacinthe", "Jacqueline", "Jade", "Janine", "Jeanne", "Jocelyne", "Jo\xEBlle", "Jos\xE9phine", "Judith", "Julia", "Julie", "Jules", "Juliette", "Justine", "Katy", "Kathy", "Katie", "Laura", "Laure", "Laureline", "Laurence", "Laurene", "Lauriane", "Laurianne", "Laurine", "L\xE9a", "L\xE9na", "L\xE9onie", "L\xE9on", "L\xE9ontine", "Lorraine", "Lucie", "Lucienne", "Lucille", "Ludivine", "Lydie", "Lydie", "Megane", "Madeleine", "Magali", "Maguelone", "Mallaury", "Manon", "Marceline", "Margot", "Marguerite", "Marianne", "Marie", "Myriam", "Marie", "Marine", "Marion", "Marl\xE8ne", "Marthe", "Martine", "Mathilde", "Maud", "Maureen", "Mauricette", "Maxime", "M\xE9lanie", "Melissa", "M\xE9lissandre", "M\xE9lisande", "M\xE9lodie", "Michel", "Micheline", "Mireille", "Miriam", "Mo\xEFse", "Monique", "Morgane", "Muriel", "Myl\xE8ne", "Nad\xE8ge", "Nadine", "Nathalie", "Nicole", "Nicolette", "Nine", "No\xEBl", "No\xE9mie", "Oc\xE9ane", "Odette", "Odile", "Olive", "Olivia", "Olympe", "Ombline", "Ombeline", "Oph\xE9lie", "Oriande", "Oriane", "Ozanne", "Pascale", "Pascaline", "Paule", "Paulette", "Pauline", "Priscille", "Prisca", "Prisque", "P\xE9cine", "P\xE9lagie", "P\xE9n\xE9lope", "Perrine", "P\xE9tronille", "Philippine", "Philom\xE8ne", "Philoth\xE9e", "Primerose", "Prudence", "Pulch\xE9rie", "Quentine", "Qui\xE9ta", "Quintia", "Quintilla", "Rachel", "Rapha\xEBlle", "Raymonde", "Rebecca", "R\xE9gine", "R\xE9jeanne", "Ren\xE9", "Rita", "Rita", "Rolande", "Romane", "Rosalie", "Rose", "Roseline", "Sabine", "Salom\xE9", "Sandra", "Sandrine", "Sarah", "S\xE9gol\xE8ne", "S\xE9verine", "Sibylle", "Simone", "Sixt", "Solange", "Soline", "Sol\xE8ne", "Sophie", "St\xE9phanie", "Suzanne", "Sylvain", "Sylvie", "Tatiana", "Tha\xEFs", "Th\xE9odora", "Th\xE9r\xE8se", "Tiphaine", "Ursule", "Valentine", "Val\xE9rie", "V\xE9ronique", "Victoire", "Victorine", "Vinciane", "Violette", "Virginie", "Viviane", "Xavi\xE8re", "Yolande", "Ysaline", "Yvette", "Yvonne", "Z\xE9lie", "Zita", "Zo\xE9"]
            }
          },
          lastNames: {
            "en": ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly", "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell", "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant", "Alexander", "Russell", "Griffin", "Diaz", "Hayes", "Myers", "Ford", "Hamilton", "Graham", "Sullivan", "Wallace", "Woods", "Cole", "West", "Jordan", "Owens", "Reynolds", "Fisher", "Ellis", "Harrison", "Gibson", "McDonald", "Cruz", "Marshall", "Ortiz", "Gomez", "Murray", "Freeman", "Wells", "Webb", "Simpson", "Stevens", "Tucker", "Porter", "Hunter", "Hicks", "Crawford", "Henry", "Boyd", "Mason", "Morales", "Kennedy", "Warren", "Dixon", "Ramos", "Reyes", "Burns", "Gordon", "Shaw", "Holmes", "Rice", "Robertson", "Hunt", "Black", "Daniels", "Palmer", "Mills", "Nichols", "Grant", "Knight", "Ferguson", "Rose", "Stone", "Hawkins", "Dunn", "Perkins", "Hudson", "Spencer", "Gardner", "Stephens", "Payne", "Pierce", "Berry", "Matthews", "Arnold", "Wagner", "Willis", "Ray", "Watkins", "Olson", "Carroll", "Duncan", "Snyder", "Hart", "Cunningham", "Bradley", "Lane", "Andrews", "Ruiz", "Harper", "Fox", "Riley", "Armstrong", "Carpenter", "Weaver", "Greene", "Lawrence", "Elliott", "Chavez", "Sims", "Austin", "Peters", "Kelley", "Franklin", "Lawson", "Fields", "Gutierrez", "Ryan", "Schmidt", "Carr", "Vasquez", "Castillo", "Wheeler", "Chapman", "Oliver", "Montgomery", "Richards", "Williamson", "Johnston", "Banks", "Meyer", "Bishop", "McCoy", "Howell", "Alvarez", "Morrison", "Hansen", "Fernandez", "Garza", "Harvey", "Little", "Burton", "Stanley", "Nguyen", "George", "Jacobs", "Reid", "Kim", "Fuller", "Lynch", "Dean", "Gilbert", "Garrett", "Romero", "Welch", "Larson", "Frazier", "Burke", "Hanson", "Day", "Mendoza", "Moreno", "Bowman", "Medina", "Fowler", "Brewer", "Hoffman", "Carlson", "Silva", "Pearson", "Holland", "Douglas", "Fleming", "Jensen", "Vargas", "Byrd", "Davidson", "Hopkins", "May", "Terry", "Herrera", "Wade", "Soto", "Walters", "Curtis", "Neal", "Caldwell", "Lowe", "Jennings", "Barnett", "Graves", "Jimenez", "Horton", "Shelton", "Barrett", "Obrien", "Castro", "Sutton", "Gregory", "McKinney", "Lucas", "Miles", "Craig", "Rodriquez", "Chambers", "Holt", "Lambert", "Fletcher", "Watts", "Bates", "Hale", "Rhodes", "Pena", "Beck", "Newman", "Haynes", "McDaniel", "Mendez", "Bush", "Vaughn", "Parks", "Dawson", "Santiago", "Norris", "Hardy", "Love", "Steele", "Curry", "Powers", "Schultz", "Barker", "Guzman", "Page", "Munoz", "Ball", "Keller", "Chandler", "Weber", "Leonard", "Walsh", "Lyons", "Ramsey", "Wolfe", "Schneider", "Mullins", "Benson", "Sharp", "Bowen", "Daniel", "Barber", "Cummings", "Hines", "Baldwin", "Griffith", "Valdez", "Hubbard", "Salazar", "Reeves", "Warner", "Stevenson", "Burgess", "Santos", "Tate", "Cross", "Garner", "Mann", "Mack", "Moss", "Thornton", "Dennis", "McGee", "Farmer", "Delgado", "Aguilar", "Vega", "Glover", "Manning", "Cohen", "Harmon", "Rodgers", "Robbins", "Newton", "Todd", "Blair", "Higgins", "Ingram", "Reese", "Cannon", "Strickland", "Townsend", "Potter", "Goodwin", "Walton", "Rowe", "Hampton", "Ortega", "Patton", "Swanson", "Joseph", "Francis", "Goodman", "Maldonado", "Yates", "Becker", "Erickson", "Hodges", "Rios", "Conner", "Adkins", "Webster", "Norman", "Malone", "Hammond", "Flowers", "Cobb", "Moody", "Quinn", "Blake", "Maxwell", "Pope", "Floyd", "Osborne", "Paul", "McCarthy", "Guerrero", "Lindsey", "Estrada", "Sandoval", "Gibbs", "Tyler", "Gross", "Fitzgerald", "Stokes", "Doyle", "Sherman", "Saunders", "Wise", "Colon", "Gill", "Alvarado", "Greer", "Padilla", "Simon", "Waters", "Nunez", "Ballard", "Schwartz", "McBride", "Houston", "Christensen", "Klein", "Pratt", "Briggs", "Parsons", "McLaughlin", "Zimmerman", "French", "Buchanan", "Moran", "Copeland", "Roy", "Pittman", "Brady", "McCormick", "Holloway", "Brock", "Poole", "Frank", "Logan", "Owen", "Bass", "Marsh", "Drake", "Wong", "Jefferson", "Park", "Morton", "Abbott", "Sparks", "Patrick", "Norton", "Huff", "Clayton", "Massey", "Lloyd", "Figueroa", "Carson", "Bowers", "Roberson", "Barton", "Tran", "Lamb", "Harrington", "Casey", "Boone", "Cortez", "Clarke", "Mathis", "Singleton", "Wilkins", "Cain", "Bryan", "Underwood", "Hogan", "McKenzie", "Collier", "Luna", "Phelps", "McGuire", "Allison", "Bridges", "Wilkerson", "Nash", "Summers", "Atkins"],
            "it": ["Acciai", "Aglietti", "Agostini", "Agresti", "Ahmed", "Aiazzi", "Albanese", "Alberti", "Alessi", "Alfani", "Alinari", "Alterini", "Amato", "Ammannati", "Ancillotti", "Andrei", "Andreini", "Andreoni", "Angeli", "Anichini", "Antonelli", "Antonini", "Arena", "Ariani", "Arnetoli", "Arrighi", "Baccani", "Baccetti", "Bacci", "Bacherini", "Badii", "Baggiani", "Baglioni", "Bagni", "Bagnoli", "Baldassini", "Baldi", "Baldini", "Ballerini", "Balli", "Ballini", "Balloni", "Bambi", "Banchi", "Bandinelli", "Bandini", "Bani", "Barbetti", "Barbieri", "Barchielli", "Bardazzi", "Bardelli", "Bardi", "Barducci", "Bargellini", "Bargiacchi", "Barni", "Baroncelli", "Baroncini", "Barone", "Baroni", "Baronti", "Bartalesi", "Bartoletti", "Bartoli", "Bartolini", "Bartoloni", "Bartolozzi", "Basagni", "Basile", "Bassi", "Batacchi", "Battaglia", "Battaglini", "Bausi", "Becagli", "Becattini", "Becchi", "Becucci", "Bellandi", "Bellesi", "Belli", "Bellini", "Bellucci", "Bencini", "Benedetti", "Benelli", "Beni", "Benini", "Bensi", "Benucci", "Benvenuti", "Berlincioni", "Bernacchioni", "Bernardi", "Bernardini", "Berni", "Bernini", "Bertelli", "Berti", "Bertini", "Bessi", "Betti", "Bettini", "Biagi", "Biagini", "Biagioni", "Biagiotti", "Biancalani", "Bianchi", "Bianchini", "Bianco", "Biffoli", "Bigazzi", "Bigi", "Biliotti", "Billi", "Binazzi", "Bindi", "Bini", "Biondi", "Bizzarri", "Bocci", "Bogani", "Bolognesi", "Bonaiuti", "Bonanni", "Bonciani", "Boncinelli", "Bondi", "Bonechi", "Bongini", "Boni", "Bonini", "Borchi", "Boretti", "Borghi", "Borghini", "Borgioli", "Borri", "Borselli", "Boschi", "Bottai", "Bracci", "Braccini", "Brandi", "Braschi", "Bravi", "Brazzini", "Breschi", "Brilli", "Brizzi", "Brogelli", "Brogi", "Brogioni", "Brunelli", "Brunetti", "Bruni", "Bruno", "Brunori", "Bruschi", "Bucci", "Bucciarelli", "Buccioni", "Bucelli", "Bulli", "Burberi", "Burchi", "Burgassi", "Burroni", "Bussotti", "Buti", "Caciolli", "Caiani", "Calabrese", "Calamai", "Calamandrei", "Caldini", "Calo'", "Calonaci", "Calosi", "Calvelli", "Cambi", "Camiciottoli", "Cammelli", "Cammilli", "Campolmi", "Cantini", "Capanni", "Capecchi", "Caponi", "Cappelletti", "Cappelli", "Cappellini", "Cappugi", "Capretti", "Caputo", "Carbone", "Carboni", "Cardini", "Carlesi", "Carletti", "Carli", "Caroti", "Carotti", "Carrai", "Carraresi", "Carta", "Caruso", "Casalini", "Casati", "Caselli", "Casini", "Castagnoli", "Castellani", "Castelli", "Castellucci", "Catalano", "Catarzi", "Catelani", "Cavaciocchi", "Cavallaro", "Cavallini", "Cavicchi", "Cavini", "Ceccarelli", "Ceccatelli", "Ceccherelli", "Ceccherini", "Cecchi", "Cecchini", "Cecconi", "Cei", "Cellai", "Celli", "Cellini", "Cencetti", "Ceni", "Cenni", "Cerbai", "Cesari", "Ceseri", "Checcacci", "Checchi", "Checcucci", "Cheli", "Chellini", "Chen", "Cheng", "Cherici", "Cherubini", "Chiaramonti", "Chiarantini", "Chiarelli", "Chiari", "Chiarini", "Chiarugi", "Chiavacci", "Chiesi", "Chimenti", "Chini", "Chirici", "Chiti", "Ciabatti", "Ciampi", "Cianchi", "Cianfanelli", "Cianferoni", "Ciani", "Ciapetti", "Ciappi", "Ciardi", "Ciatti", "Cicali", "Ciccone", "Cinelli", "Cini", "Ciobanu", "Ciolli", "Cioni", "Cipriani", "Cirillo", "Cirri", "Ciucchi", "Ciuffi", "Ciulli", "Ciullini", "Clemente", "Cocchi", "Cognome", "Coli", "Collini", "Colombo", "Colzi", "Comparini", "Conforti", "Consigli", "Conte", "Conti", "Contini", "Coppini", "Coppola", "Corsi", "Corsini", "Corti", "Cortini", "Cosi", "Costa", "Costantini", "Costantino", "Cozzi", "Cresci", "Crescioli", "Cresti", "Crini", "Curradi", "D'Agostino", "D'Alessandro", "D'Amico", "D'Angelo", "Daddi", "Dainelli", "Dallai", "Danti", "Davitti", "De Angelis", "De Luca", "De Marco", "De Rosa", "De Santis", "De Simone", "De Vita", "Degl'Innocenti", "Degli Innocenti", "Dei", "Del Lungo", "Del Re", "Di Marco", "Di Stefano", "Dini", "Diop", "Dobre", "Dolfi", "Donati", "Dondoli", "Dong", "Donnini", "Ducci", "Dumitru", "Ermini", "Esposito", "Evangelisti", "Fabbri", "Fabbrini", "Fabbrizzi", "Fabbroni", "Fabbrucci", "Fabiani", "Facchini", "Faggi", "Fagioli", "Failli", "Faini", "Falciani", "Falcini", "Falcone", "Fallani", "Falorni", "Falsini", "Falugiani", "Fancelli", "Fanelli", "Fanetti", "Fanfani", "Fani", "Fantappie'", "Fantechi", "Fanti", "Fantini", "Fantoni", "Farina", "Fattori", "Favilli", "Fedi", "Fei", "Ferrante", "Ferrara", "Ferrari", "Ferraro", "Ferretti", "Ferri", "Ferrini", "Ferroni", "Fiaschi", "Fibbi", "Fiesoli", "Filippi", "Filippini", "Fini", "Fioravanti", "Fiore", "Fiorentini", "Fiorini", "Fissi", "Focardi", "Foggi", "Fontana", "Fontanelli", "Fontani", "Forconi", "Formigli", "Forte", "Forti", "Fortini", "Fossati", "Fossi", "Francalanci", "Franceschi", "Franceschini", "Franchi", "Franchini", "Franci", "Francini", "Francioni", "Franco", "Frassineti", "Frati", "Fratini", "Frilli", "Frizzi", "Frosali", "Frosini", "Frullini", "Fusco", "Fusi", "Gabbrielli", "Gabellini", "Gagliardi", "Galanti", "Galardi", "Galeotti", "Galletti", "Galli", "Gallo", "Gallori", "Gambacciani", "Gargani", "Garofalo", "Garuglieri", "Gashi", "Gasperini", "Gatti", "Gelli", "Gensini", "Gentile", "Gentili", "Geri", "Gerini", "Gheri", "Ghini", "Giachetti", "Giachi", "Giacomelli", "Gianassi", "Giani", "Giannelli", "Giannetti", "Gianni", "Giannini", "Giannoni", "Giannotti", "Giannozzi", "Gigli", "Giordano", "Giorgetti", "Giorgi", "Giovacchini", "Giovannelli", "Giovannetti", "Giovannini", "Giovannoni", "Giuliani", "Giunti", "Giuntini", "Giusti", "Gonnelli", "Goretti", "Gori", "Gradi", "Gramigni", "Grassi", "Grasso", "Graziani", "Grazzini", "Greco", "Grifoni", "Grillo", "Grimaldi", "Grossi", "Gualtieri", "Guarducci", "Guarino", "Guarnieri", "Guasti", "Guerra", "Guerri", "Guerrini", "Guidi", "Guidotti", "He", "Hoxha", "Hu", "Huang", "Iandelli", "Ignesti", "Innocenti", "Jin", "La Rosa", "Lai", "Landi", "Landini", "Lanini", "Lapi", "Lapini", "Lari", "Lascialfari", "Lastrucci", "Latini", "Lazzeri", "Lazzerini", "Lelli", "Lenzi", "Leonardi", "Leoncini", "Leone", "Leoni", "Lepri", "Li", "Liao", "Lin", "Linari", "Lippi", "Lisi", "Livi", "Lombardi", "Lombardini", "Lombardo", "Longo", "Lopez", "Lorenzi", "Lorenzini", "Lorini", "Lotti", "Lu", "Lucchesi", "Lucherini", "Lunghi", "Lupi", "Madiai", "Maestrini", "Maffei", "Maggi", "Maggini", "Magherini", "Magini", "Magnani", "Magnelli", "Magni", "Magnolfi", "Magrini", "Malavolti", "Malevolti", "Manca", "Mancini", "Manetti", "Manfredi", "Mangani", "Mannelli", "Manni", "Mannini", "Mannucci", "Manuelli", "Manzini", "Marcelli", "Marchese", "Marchetti", "Marchi", "Marchiani", "Marchionni", "Marconi", "Marcucci", "Margheri", "Mari", "Mariani", "Marilli", "Marinai", "Marinari", "Marinelli", "Marini", "Marino", "Mariotti", "Marsili", "Martelli", "Martinelli", "Martini", "Martino", "Marzi", "Masi", "Masini", "Masoni", "Massai", "Materassi", "Mattei", "Matteini", "Matteucci", "Matteuzzi", "Mattioli", "Mattolini", "Matucci", "Mauro", "Mazzanti", "Mazzei", "Mazzetti", "Mazzi", "Mazzini", "Mazzocchi", "Mazzoli", "Mazzoni", "Mazzuoli", "Meacci", "Mecocci", "Meini", "Melani", "Mele", "Meli", "Mengoni", "Menichetti", "Meoni", "Merlini", "Messeri", "Messina", "Meucci", "Miccinesi", "Miceli", "Micheli", "Michelini", "Michelozzi", "Migliori", "Migliorini", "Milani", "Miniati", "Misuri", "Monaco", "Montagnani", "Montagni", "Montanari", "Montelatici", "Monti", "Montigiani", "Montini", "Morandi", "Morandini", "Morelli", "Moretti", "Morganti", "Mori", "Morini", "Moroni", "Morozzi", "Mugnai", "Mugnaini", "Mustafa", "Naldi", "Naldini", "Nannelli", "Nanni", "Nannini", "Nannucci", "Nardi", "Nardini", "Nardoni", "Natali", "Ndiaye", "Nencetti", "Nencini", "Nencioni", "Neri", "Nesi", "Nesti", "Niccolai", "Niccoli", "Niccolini", "Nigi", "Nistri", "Nocentini", "Noferini", "Novelli", "Nucci", "Nuti", "Nutini", "Oliva", "Olivieri", "Olmi", "Orlandi", "Orlandini", "Orlando", "Orsini", "Ortolani", "Ottanelli", "Pacciani", "Pace", "Paci", "Pacini", "Pagani", "Pagano", "Paggetti", "Pagliai", "Pagni", "Pagnini", "Paladini", "Palagi", "Palchetti", "Palloni", "Palmieri", "Palumbo", "Pampaloni", "Pancani", "Pandolfi", "Pandolfini", "Panerai", "Panichi", "Paoletti", "Paoli", "Paolini", "Papi", "Papini", "Papucci", "Parenti", "Parigi", "Parisi", "Parri", "Parrini", "Pasquini", "Passeri", "Pecchioli", "Pecorini", "Pellegrini", "Pepi", "Perini", "Perrone", "Peruzzi", "Pesci", "Pestelli", "Petri", "Petrini", "Petrucci", "Pettini", "Pezzati", "Pezzatini", "Piani", "Piazza", "Piazzesi", "Piazzini", "Piccardi", "Picchi", "Piccini", "Piccioli", "Pieraccini", "Pieraccioni", "Pieralli", "Pierattini", "Pieri", "Pierini", "Pieroni", "Pietrini", "Pini", "Pinna", "Pinto", "Pinzani", "Pinzauti", "Piras", "Pisani", "Pistolesi", "Poggesi", "Poggi", "Poggiali", "Poggiolini", "Poli", "Pollastri", "Porciani", "Pozzi", "Pratellesi", "Pratesi", "Prosperi", "Pruneti", "Pucci", "Puccini", "Puccioni", "Pugi", "Pugliese", "Puliti", "Querci", "Quercioli", "Raddi", "Radu", "Raffaelli", "Ragazzini", "Ranfagni", "Ranieri", "Rastrelli", "Raugei", "Raveggi", "Renai", "Renzi", "Rettori", "Ricci", "Ricciardi", "Ridi", "Ridolfi", "Rigacci", "Righi", "Righini", "Rinaldi", "Risaliti", "Ristori", "Rizzo", "Rocchi", "Rocchini", "Rogai", "Romagnoli", "Romanelli", "Romani", "Romano", "Romei", "Romeo", "Romiti", "Romoli", "Romolini", "Rontini", "Rosati", "Roselli", "Rosi", "Rossetti", "Rossi", "Rossini", "Rovai", "Ruggeri", "Ruggiero", "Russo", "Sabatini", "Saccardi", "Sacchetti", "Sacchi", "Sacco", "Salerno", "Salimbeni", "Salucci", "Salvadori", "Salvestrini", "Salvi", "Salvini", "Sanesi", "Sani", "Sanna", "Santi", "Santini", "Santoni", "Santoro", "Santucci", "Sardi", "Sarri", "Sarti", "Sassi", "Sbolci", "Scali", "Scarpelli", "Scarselli", "Scopetani", "Secci", "Selvi", "Senatori", "Senesi", "Serafini", "Sereni", "Serra", "Sestini", "Sguanci", "Sieni", "Signorini", "Silvestri", "Simoncini", "Simonetti", "Simoni", "Singh", "Sodi", "Soldi", "Somigli", "Sorbi", "Sorelli", "Sorrentino", "Sottili", "Spina", "Spinelli", "Staccioli", "Staderini", "Stefanelli", "Stefani", "Stefanini", "Stella", "Susini", "Tacchi", "Tacconi", "Taddei", "Tagliaferri", "Tamburini", "Tanganelli", "Tani", "Tanini", "Tapinassi", "Tarchi", "Tarchiani", "Targioni", "Tassi", "Tassini", "Tempesti", "Terzani", "Tesi", "Testa", "Testi", "Tilli", "Tinti", "Tirinnanzi", "Toccafondi", "Tofanari", "Tofani", "Tognaccini", "Tonelli", "Tonini", "Torelli", "Torrini", "Tosi", "Toti", "Tozzi", "Trambusti", "Trapani", "Tucci", "Turchi", "Ugolini", "Ulivi", "Valente", "Valenti", "Valentini", "Vangelisti", "Vanni", "Vannini", "Vannoni", "Vannozzi", "Vannucchi", "Vannucci", "Ventura", "Venturi", "Venturini", "Vestri", "Vettori", "Vichi", "Viciani", "Vieri", "Vigiani", "Vignoli", "Vignolini", "Vignozzi", "Villani", "Vinci", "Visani", "Vitale", "Vitali", "Viti", "Viviani", "Vivoli", "Volpe", "Volpi", "Wang", "Wu", "Xu", "Yang", "Ye", "Zagli", "Zani", "Zanieri", "Zanobini", "Zecchi", "Zetti", "Zhang", "Zheng", "Zhou", "Zhu", "Zingoni", "Zini", "Zoppi"],
            "nl": ["Albers", "Alblas", "Appelman", "Baars", "Baas", "Bakker", "Blank", "Bleeker", "Blok", "Blom", "Boer", "Boers", "Boldewijn", "Boon", "Boot", "Bos", "Bosch", "Bosma", "Bosman", "Bouma", "Bouman", "Bouwman", "Brands", "Brouwer", "Burger", "Buijs", "Buitenhuis", "Ceder", "Cohen", "Dekker", "Dekkers", "Dijkman", "Dijkstra", "Driessen", "Drost", "Engel", "Evers", "Faber", "Franke", "Gerritsen", "Goedhart", "Goossens", "Groen", "Groenenberg", "Groot", "Haan", "Hart", "Heemskerk", "Hendriks", "Hermans", "Hoekstra", "Hofman", "Hopman", "Huisman", "Jacobs", "Jansen", "Janssen", "Jonker", "Jaspers", "Keijzer", "Klaassen", "Klein", "Koek", "Koenders", "Kok", "Kool", "Koopman", "Koopmans", "Koning", "Koster", "Kramer", "Kroon", "Kuijpers", "Kuiper", "Kuipers", "Kurt", "Koster", "Kwakman", "Los", "Lubbers", "Maas", "Markus", "Martens", "Meijer", "Mol", "Molenaar", "Mulder", "Nieuwenhuis", "Peeters", "Peters", "Pengel", "Pieters", "Pool", "Post", "Postma", "Prins", "Pronk", "Reijnders", "Rietveld", "Roest", "Roos", "Sanders", "Schaap", "Scheffer", "Schenk", "Schilder", "Schipper", "Schmidt", "Scholten", "Schouten", "Schut", "Schutte", "Schuurman", "Simons", "Smeets", "Smit", "Smits", "Snel", "Swinkels", "Tas", "Terpstra", "Timmermans", "Tol", "Tromp", "Troost", "Valk", "Veenstra", "Veldkamp", "Verbeek", "Verheul", "Verhoeven", "Vermeer", "Vermeulen", "Verweij", "Vink", "Visser", "Voorn", "Vos", "Wagenaar", "Wiersema", "Willems", "Willemsen", "Witteveen", "Wolff", "Wolters", "Zijlstra", "Zwart", "de Beer", "de Boer", "de Bruijn", "de Bruin", "de Graaf", "de Groot", "de Haan", "de Haas", "de Jager", "de Jong", "de Jonge", "de Koning", "de Lange", "de Leeuw", "de Ridder", "de Rooij", "de Ruiter", "de Vos", "de Vries", "de Waal", "de Wit", "de Zwart", "van Beek", "van Boven", "van Dam", "van Dijk", "van Dongen", "van Doorn", "van Egmond", "van Eijk", "van Es", "van Gelder", "van Gelderen", "van Houten", "van Hulst", "van Kempen", "van Kesteren", "van Leeuwen", "van Loon", "van Mill", "van Noord", "van Ommen", "van Ommeren", "van Oosten", "van Oostveen", "van Rijn", "van Schaik", "van Veen", "van Vliet", "van Wijk", "van Wijngaarden", "van den Poel", "van de Pol", "van den Ploeg", "van de Ven", "van den Berg", "van den Bosch", "van den Brink", "van den Broek", "van den Heuvel", "van der Heijden", "van der Horst", "van der Hulst", "van der Kroon", "van der Laan", "van der Linden", "van der Meer", "van der Meij", "van der Meulen", "van der Molen", "van der Sluis", "van der Spek", "van der Veen", "van der Velde", "van der Velden", "van der Vliet", "van der Wal"],
            "uk": ["Smith", "Jones", "Williams", "Taylor", "Brown", "Davies", "Evans", "Wilson", "Thomas", "Johnson", "Roberts", "Robinson", "Thompson", "Wright", "Walker", "White", "Edwards", "Hughes", "Green", "Hall", "Lewis", "Harris", "Clarke", "Patel", "Jackson", "Wood", "Turner", "Martin", "Cooper", "Hill", "Ward", "Morris", "Moore", "Clark", "Lee", "King", "Baker", "Harrison", "Morgan", "Allen", "James", "Scott", "Phillips", "Watson", "Davis", "Parker", "Price", "Bennett", "Young", "Griffiths", "Mitchell", "Kelly", "Cook", "Carter", "Richardson", "Bailey", "Collins", "Bell", "Shaw", "Murphy", "Miller", "Cox", "Richards", "Khan", "Marshall", "Anderson", "Simpson", "Ellis", "Adams", "Singh", "Begum", "Wilkinson", "Foster", "Chapman", "Powell", "Webb", "Rogers", "Gray", "Mason", "Ali", "Hunt", "Hussain", "Campbell", "Matthews", "Owen", "Palmer", "Holmes", "Mills", "Barnes", "Knight", "Lloyd", "Butler", "Russell", "Barker", "Fisher", "Stevens", "Jenkins", "Murray", "Dixon", "Harvey", "Graham", "Pearson", "Ahmed", "Fletcher", "Walsh", "Kaur", "Gibson", "Howard", "Andrews", "Stewart", "Elliott", "Reynolds", "Saunders", "Payne", "Fox", "Ford", "Pearce", "Day", "Brooks", "West", "Lawrence", "Cole", "Atkinson", "Bradley", "Spencer", "Gill", "Dawson", "Ball", "Burton", "O'brien", "Watts", "Rose", "Booth", "Perry", "Ryan", "Grant", "Wells", "Armstrong", "Francis", "Rees", "Hayes", "Hart", "Hudson", "Newman", "Barrett", "Webster", "Hunter", "Gregory", "Carr", "Lowe", "Page", "Marsh", "Riley", "Dunn", "Woods", "Parsons", "Berry", "Stone", "Reid", "Holland", "Hawkins", "Harding", "Porter", "Robertson", "Newton", "Oliver", "Reed", "Kennedy", "Williamson", "Bird", "Gardner", "Shah", "Dean", "Lane", "Cooke", "Bates", "Henderson", "Parry", "Burgess", "Bishop", "Walton", "Burns", "Nicholson", "Shepherd", "Ross", "Cross", "Long", "Freeman", "Warren", "Nicholls", "Hamilton", "Byrne", "Sutton", "Mcdonald", "Yates", "Hodgson", "Robson", "Curtis", "Hopkins", "O'connor", "Harper", "Coleman", "Watkins", "Moss", "Mccarthy", "Chambers", "O'neill", "Griffin", "Sharp", "Hardy", "Wheeler", "Potter", "Osborne", "Johnston", "Gordon", "Doyle", "Wallace", "George", "Jordan", "Hutchinson", "Rowe", "Burke", "May", "Pritchard", "Gilbert", "Willis", "Higgins", "Read", "Miles", "Stevenson", "Stephenson", "Hammond", "Arnold", "Buckley", "Walters", "Hewitt", "Barber", "Nelson", "Slater", "Austin", "Sullivan", "Whitehead", "Mann", "Frost", "Lambert", "Stephens", "Blake", "Akhtar", "Lynch", "Goodwin", "Barton", "Woodward", "Thomson", "Cunningham", "Quinn", "Barnett", "Baxter", "Bibi", "Clayton", "Nash", "Greenwood", "Jennings", "Holt", "Kemp", "Poole", "Gallagher", "Bond", "Stokes", "Tucker", "Davidson", "Fowler", "Heath", "Norman", "Middleton", "Lawson", "Banks", "French", "Stanley", "Jarvis", "Gibbs", "Ferguson", "Hayward", "Carroll", "Douglas", "Dickinson", "Todd", "Barlow", "Peters", "Lucas", "Knowles", "Hartley", "Miah", "Simmons", "Morton", "Alexander", "Field", "Morrison", "Norris", "Townsend", "Preston", "Hancock", "Thornton", "Baldwin", "Burrows", "Briggs", "Parkinson", "Reeves", "Macdonald", "Lamb", "Black", "Abbott", "Sanders", "Thorpe", "Holden", "Tomlinson", "Perkins", "Ashton", "Rhodes", "Fuller", "Howe", "Bryant", "Vaughan", "Dale", "Davey", "Weston", "Bartlett", "Whittaker", "Davison", "Kent", "Skinner", "Birch", "Morley", "Daniels", "Glover", "Howell", "Cartwright", "Pugh", "Humphreys", "Goddard", "Brennan", "Wall", "Kirby", "Bowen", "Savage", "Bull", "Wong", "Dobson", "Smart", "Wilkins", "Kirk", "Fraser", "Duffy", "Hicks", "Patterson", "Bradshaw", "Little", "Archer", "Warner", "Waters", "O'sullivan", "Farrell", "Brookes", "Atkins", "Kay", "Dodd", "Bentley", "Flynn", "John", "Schofield", "Short", "Haynes", "Wade", "Butcher", "Henry", "Sanderson", "Crawford", "Sheppard", "Bolton", "Coates", "Giles", "Gould", "Houghton", "Gibbons", "Pratt", "Manning", "Law", "Hooper", "Noble", "Dyer", "Rahman", "Clements", "Moran", "Sykes", "Chan", "Doherty", "Connolly", "Joyce", "Franklin", "Hobbs", "Coles", "Herbert", "Steele", "Kerr", "Leach", "Winter", "Owens", "Duncan", "Naylor", "Fleming", "Horton", "Finch", "Fitzgerald", "Randall", "Carpenter", "Marsden", "Browne", "Garner", "Pickering", "Hale", "Dennis", "Vincent", "Chadwick", "Chandler", "Sharpe", "Nolan", "Lyons", "Hurst", "Collier", "Peacock", "Howarth", "Faulkner", "Rice", "Pollard", "Welch", "Norton", "Gough", "Sinclair", "Blackburn", "Bryan", "Conway", "Power", "Cameron", "Daly", "Allan", "Hanson", "Gardiner", "Boyle", "Myers", "Turnbull", "Wallis", "Mahmood", "Sims", "Swift", "Iqbal", "Pope", "Brady", "Chamberlain", "Rowley", "Tyler", "Farmer", "Metcalfe", "Hilton", "Godfrey", "Holloway", "Parkin", "Bray", "Talbot", "Donnelly", "Nixon", "Charlton", "Benson", "Whitehouse", "Barry", "Hope", "Lord", "North", "Storey", "Connor", "Potts", "Bevan", "Hargreaves", "Mclean", "Mistry", "Bruce", "Howells", "Hyde", "Parkes", "Wyatt", "Fry", "Lees", "O'donnell", "Craig", "Forster", "Mckenzie", "Humphries", "Mellor", "Carey", "Ingram", "Summers", "Leonard"],
            "de": ["M\xFCller", "Schmidt", "Schneider", "Fischer", "Weber", "Meyer", "Wagner", "Becker", "Schulz", "Hoffmann", "Sch\xE4fer", "Koch", "Bauer", "Richter", "Klein", "Wolf", "Schr\xF6der", "Neumann", "Schwarz", "Zimmermann", "Braun", "Kr\xFCger", "Hofmann", "Hartmann", "Lange", "Schmitt", "Werner", "Schmitz", "Krause", "Meier", "Lehmann", "Schmid", "Schulze", "Maier", "K\xF6hler", "Herrmann", "K\xF6nig", "Walter", "Mayer", "Huber", "Kaiser", "Fuchs", "Peters", "Lang", "Scholz", "M\xF6ller", "Wei\xDF", "Jung", "Hahn", "Schubert", "Vogel", "Friedrich", "Keller", "G\xFCnther", "Frank", "Berger", "Winkler", "Roth", "Beck", "Lorenz", "Baumann", "Franke", "Albrecht", "Schuster", "Simon", "Ludwig", "B\xF6hm", "Winter", "Kraus", "Martin", "Schumacher", "Kr\xE4mer", "Vogt", "Stein", "J\xE4ger", "Otto", "Sommer", "Gro\xDF", "Seidel", "Heinrich", "Brandt", "Haas", "Schreiber", "Graf", "Schulte", "Dietrich", "Ziegler", "Kuhn", "K\xFChn", "Pohl", "Engel", "Horn", "Busch", "Bergmann", "Thomas", "Voigt", "Sauer", "Arnold", "Wolff", "Pfeiffer"],
            "jp": ["Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto", "Nakamura", "Kobayashi", "Kato", "Yoshida", "Yamada", "Sasaki", "Yamaguchi", "Saito", "Matsumoto", "Inoue", "Kimura", "Hayashi", "Shimizu", "Yamazaki", "Mori", "Abe", "Ikeda", "Hashimoto", "Yamashita", "Ishikawa", "Nakajima", "Maeda", "Fujita", "Ogawa", "Goto", "Okada", "Hasegawa", "Murakami", "Kondo", "Ishii", "Saito", "Sakamoto", "Endo", "Aoki", "Fujii", "Nishimura", "Fukuda", "Ota", "Miura", "Fujiwara", "Okamoto", "Matsuda", "Nakagawa", "Nakano", "Harada", "Ono", "Tamura", "Takeuchi", "Kaneko", "Wada", "Nakayama", "Ishida", "Ueda", "Morita", "Hara", "Shibata", "Sakai", "Kudo", "Yokoyama", "Miyazaki", "Miyamoto", "Uchida", "Takagi", "Ando", "Taniguchi", "Ohno", "Maruyama", "Imai", "Takada", "Fujimoto", "Takeda", "Murata", "Ueno", "Sugiyama", "Masuda", "Sugawara", "Hirano", "Kojima", "Otsuka", "Chiba", "Kubo", "Matsui", "Iwasaki", "Sakurai", "Kinoshita", "Noguchi", "Matsuo", "Nomura", "Kikuchi", "Sano", "Onishi", "Sugimoto", "Arai"],
            "es": ["Garcia", "Fernandez", "Lopez", "Martinez", "Gonzalez", "Rodriguez", "Sanchez", "Perez", "Martin", "Gomez", "Ruiz", "Diaz", "Hernandez", "Alvarez", "Jimenez", "Moreno", "Munoz", "Alonso", "Romero", "Navarro", "Gutierrez", "Torres", "Dominguez", "Gil", "Vazquez", "Blanco", "Serrano", "Ramos", "Castro", "Suarez", "Sanz", "Rubio", "Ortega", "Molina", "Delgado", "Ortiz", "Morales", "Ramirez", "Marin", "Iglesias", "Santos", "Castillo", "Garrido", "Calvo", "Pena", "Cruz", "Cano", "Nunez", "Prieto", "Diez", "Lozano", "Vidal", "Pascual", "Ferrer", "Medina", "Vega", "Leon", "Herrero", "Vicente", "Mendez", "Guerrero", "Fuentes", "Campos", "Nieto", "Cortes", "Caballero", "Ibanez", "Lorenzo", "Pastor", "Gimenez", "Saez", "Soler", "Marquez", "Carrasco", "Herrera", "Montero", "Arias", "Crespo", "Flores", "Andres", "Aguilar", "Hidalgo", "Cabrera", "Mora", "Duran", "Velasco", "Rey", "Pardo", "Roman", "Vila", "Bravo", "Merino", "Moya", "Soto", "Izquierdo", "Reyes", "Redondo", "Marcos", "Carmona", "Menendez"],
            "fr": ["Martin", "Bernard", "Thomas", "Petit", "Robert", "Richard", "Durand", "Dubois", "Moreau", "Laurent", "Simon", "Michel", "Lef\xE8vre", "Leroy", "Roux", "David", "Bertrand", "Morel", "Fournier", "Girard", "Bonnet", "Dupont", "Lambert", "Fontaine", "Rousseau", "Vincent", "M\xFCller", "Lef\xE8vre", "Faure", "Andr\xE9", "Mercier", "Blanc", "Gu\xE9rin", "Boyer", "Garnier", "Chevalier", "Fran\xE7ois", "Legrand", "Gauthier", "Garcia", "Perrin", "Robin", "Cl\xE9ment", "Morin", "Nicolas", "Henry", "Roussel", "Matthieu", "Gautier", "Masson", "Marchand", "Duval", "Denis", "Dumont", "Marie", "Lemaire", "No\xEBl", "Meyer", "Dufour", "Meunier", "Brun", "Blanchard", "Giraud", "Joly", "Rivi\xE8re", "Lucas", "Brunet", "Gaillard", "Barbier", "Arnaud", "Mart\xEDnez", "G\xE9rard", "Roche", "Renard", "Schmitt", "Roy", "Leroux", "Colin", "Vidal", "Caron", "Picard", "Roger", "Fabre", "Aubert", "Lemoine", "Renaud", "Dumas", "Lacroix", "Olivier", "Philippe", "Bourgeois", "Pierre", "Beno\xEEt", "Rey", "Leclerc", "Payet", "Rolland", "Leclercq", "Guillaume", "Lecomte", "L\xF3pez", "Jean", "Dupuy", "Guillot", "Hubert", "Berger", "Carpentier", "S\xE1nchez", "Dupuis", "Moulin", "Louis", "Deschamps", "Huet", "Vasseur", "Perez", "Boucher", "Fleury", "Royer", "Klein", "Jacquet", "Adam", "Paris", "Poirier", "Marty", "Aubry", "Guyot", "Carr\xE9", "Charles", "Renault", "Charpentier", "M\xE9nard", "Maillard", "Baron", "Bertin", "Bailly", "Herv\xE9", "Schneider", "Fern\xE1ndez", "Le GallGall", "Collet", "L\xE9ger", "Bouvier", "Julien", "Pr\xE9vost", "Millet", "Perrot", "Daniel", "Le RouxRoux", "Cousin", "Germain", "Breton", "Besson", "Langlois", "R\xE9mi", "Le GoffGoff", "Pelletier", "L\xE9v\xEAque", "Perrier", "Leblanc", "Barr\xE9", "Lebrun", "Marchal", "Weber", "Mallet", "Hamon", "Boulanger", "Jacob", "Monnier", "Michaud", "Rodr\xEDguez", "Guichard", "Gillet", "\xC9tienne", "Grondin", "Poulain", "Tessier", "Chevallier", "Collin", "Chauvin", "Da SilvaSilva", "Bouchet", "Gay", "Lema\xEEtre", "B\xE9nard", "Mar\xE9chal", "Humbert", "Reynaud", "Antoine", "Hoarau", "Perret", "Barth\xE9lemy", "Cordier", "Pichon", "Lejeune", "Gilbert", "Lamy", "Delaunay", "Pasquier", "Carlier", "LaporteLaporte"]
          },
          postcodeAreas: [{ code: "AB" }, { code: "AL" }, { code: "B" }, { code: "BA" }, { code: "BB" }, { code: "BD" }, { code: "BH" }, { code: "BL" }, { code: "BN" }, { code: "BR" }, { code: "BS" }, { code: "BT" }, { code: "CA" }, { code: "CB" }, { code: "CF" }, { code: "CH" }, { code: "CM" }, { code: "CO" }, { code: "CR" }, { code: "CT" }, { code: "CV" }, { code: "CW" }, { code: "DA" }, { code: "DD" }, { code: "DE" }, { code: "DG" }, { code: "DH" }, { code: "DL" }, { code: "DN" }, { code: "DT" }, { code: "DY" }, { code: "E" }, { code: "EC" }, { code: "EH" }, { code: "EN" }, { code: "EX" }, { code: "FK" }, { code: "FY" }, { code: "G" }, { code: "GL" }, { code: "GU" }, { code: "GY" }, { code: "HA" }, { code: "HD" }, { code: "HG" }, { code: "HP" }, { code: "HR" }, { code: "HS" }, { code: "HU" }, { code: "HX" }, { code: "IG" }, { code: "IM" }, { code: "IP" }, { code: "IV" }, { code: "JE" }, { code: "KA" }, { code: "KT" }, { code: "KW" }, { code: "KY" }, { code: "L" }, { code: "LA" }, { code: "LD" }, { code: "LE" }, { code: "LL" }, { code: "LN" }, { code: "LS" }, { code: "LU" }, { code: "M" }, { code: "ME" }, { code: "MK" }, { code: "ML" }, { code: "N" }, { code: "NE" }, { code: "NG" }, { code: "NN" }, { code: "NP" }, { code: "NR" }, { code: "NW" }, { code: "OL" }, { code: "OX" }, { code: "PA" }, { code: "PE" }, { code: "PH" }, { code: "PL" }, { code: "PO" }, { code: "PR" }, { code: "RG" }, { code: "RH" }, { code: "RM" }, { code: "S" }, { code: "SA" }, { code: "SE" }, { code: "SG" }, { code: "SK" }, { code: "SL" }, { code: "SM" }, { code: "SN" }, { code: "SO" }, { code: "SP" }, { code: "SR" }, { code: "SS" }, { code: "ST" }, { code: "SW" }, { code: "SY" }, { code: "TA" }, { code: "TD" }, { code: "TF" }, { code: "TN" }, { code: "TQ" }, { code: "TR" }, { code: "TS" }, { code: "TW" }, { code: "UB" }, { code: "W" }, { code: "WA" }, { code: "WC" }, { code: "WD" }, { code: "WF" }, { code: "WN" }, { code: "WR" }, { code: "WS" }, { code: "WV" }, { code: "YO" }, { code: "ZE" }],
          countries: [{ "name": "Afghanistan", "abbreviation": "AF" }, { "name": "\xC5land Islands", "abbreviation": "AX" }, { "name": "Albania", "abbreviation": "AL" }, { "name": "Algeria", "abbreviation": "DZ" }, { "name": "American Samoa", "abbreviation": "AS" }, { "name": "Andorra", "abbreviation": "AD" }, { "name": "Angola", "abbreviation": "AO" }, { "name": "Anguilla", "abbreviation": "AI" }, { "name": "Antarctica", "abbreviation": "AQ" }, { "name": "Antigua & Barbuda", "abbreviation": "AG" }, { "name": "Argentina", "abbreviation": "AR" }, { "name": "Armenia", "abbreviation": "AM" }, { "name": "Aruba", "abbreviation": "AW" }, { "name": "Ascension Island", "abbreviation": "AC" }, { "name": "Australia", "abbreviation": "AU" }, { "name": "Austria", "abbreviation": "AT" }, { "name": "Azerbaijan", "abbreviation": "AZ" }, { "name": "Bahamas", "abbreviation": "BS" }, { "name": "Bahrain", "abbreviation": "BH" }, { "name": "Bangladesh", "abbreviation": "BD" }, { "name": "Barbados", "abbreviation": "BB" }, { "name": "Belarus", "abbreviation": "BY" }, { "name": "Belgium", "abbreviation": "BE" }, { "name": "Belize", "abbreviation": "BZ" }, { "name": "Benin", "abbreviation": "BJ" }, { "name": "Bermuda", "abbreviation": "BM" }, { "name": "Bhutan", "abbreviation": "BT" }, { "name": "Bolivia", "abbreviation": "BO" }, { "name": "Bosnia & Herzegovina", "abbreviation": "BA" }, { "name": "Botswana", "abbreviation": "BW" }, { "name": "Brazil", "abbreviation": "BR" }, { "name": "British Indian Ocean Territory", "abbreviation": "IO" }, { "name": "British Virgin Islands", "abbreviation": "VG" }, { "name": "Brunei", "abbreviation": "BN" }, { "name": "Bulgaria", "abbreviation": "BG" }, { "name": "Burkina Faso", "abbreviation": "BF" }, { "name": "Burundi", "abbreviation": "BI" }, { "name": "Cambodia", "abbreviation": "KH" }, { "name": "Cameroon", "abbreviation": "CM" }, { "name": "Canada", "abbreviation": "CA" }, { "name": "Canary Islands", "abbreviation": "IC" }, { "name": "Cape Verde", "abbreviation": "CV" }, { "name": "Caribbean Netherlands", "abbreviation": "BQ" }, { "name": "Cayman Islands", "abbreviation": "KY" }, { "name": "Central African Republic", "abbreviation": "CF" }, { "name": "Ceuta & Melilla", "abbreviation": "EA" }, { "name": "Chad", "abbreviation": "TD" }, { "name": "Chile", "abbreviation": "CL" }, { "name": "China", "abbreviation": "CN" }, { "name": "Christmas Island", "abbreviation": "CX" }, { "name": "Cocos (Keeling) Islands", "abbreviation": "CC" }, { "name": "Colombia", "abbreviation": "CO" }, { "name": "Comoros", "abbreviation": "KM" }, { "name": "Congo - Brazzaville", "abbreviation": "CG" }, { "name": "Congo - Kinshasa", "abbreviation": "CD" }, { "name": "Cook Islands", "abbreviation": "CK" }, { "name": "Costa Rica", "abbreviation": "CR" }, { "name": "C\xF4te d'Ivoire", "abbreviation": "CI" }, { "name": "Croatia", "abbreviation": "HR" }, { "name": "Cuba", "abbreviation": "CU" }, { "name": "Cura\xE7ao", "abbreviation": "CW" }, { "name": "Cyprus", "abbreviation": "CY" }, { "name": "Czech Republic", "abbreviation": "CZ" }, { "name": "Denmark", "abbreviation": "DK" }, { "name": "Diego Garcia", "abbreviation": "DG" }, { "name": "Djibouti", "abbreviation": "DJ" }, { "name": "Dominica", "abbreviation": "DM" }, { "name": "Dominican Republic", "abbreviation": "DO" }, { "name": "Ecuador", "abbreviation": "EC" }, { "name": "Egypt", "abbreviation": "EG" }, { "name": "El Salvador", "abbreviation": "SV" }, { "name": "Equatorial Guinea", "abbreviation": "GQ" }, { "name": "Eritrea", "abbreviation": "ER" }, { "name": "Estonia", "abbreviation": "EE" }, { "name": "Ethiopia", "abbreviation": "ET" }, { "name": "Falkland Islands", "abbreviation": "FK" }, { "name": "Faroe Islands", "abbreviation": "FO" }, { "name": "Fiji", "abbreviation": "FJ" }, { "name": "Finland", "abbreviation": "FI" }, { "name": "France", "abbreviation": "FR" }, { "name": "French Guiana", "abbreviation": "GF" }, { "name": "French Polynesia", "abbreviation": "PF" }, { "name": "French Southern Territories", "abbreviation": "TF" }, { "name": "Gabon", "abbreviation": "GA" }, { "name": "Gambia", "abbreviation": "GM" }, { "name": "Georgia", "abbreviation": "GE" }, { "name": "Germany", "abbreviation": "DE" }, { "name": "Ghana", "abbreviation": "GH" }, { "name": "Gibraltar", "abbreviation": "GI" }, { "name": "Greece", "abbreviation": "GR" }, { "name": "Greenland", "abbreviation": "GL" }, { "name": "Grenada", "abbreviation": "GD" }, { "name": "Guadeloupe", "abbreviation": "GP" }, { "name": "Guam", "abbreviation": "GU" }, { "name": "Guatemala", "abbreviation": "GT" }, { "name": "Guernsey", "abbreviation": "GG" }, { "name": "Guinea", "abbreviation": "GN" }, { "name": "Guinea-Bissau", "abbreviation": "GW" }, { "name": "Guyana", "abbreviation": "GY" }, { "name": "Haiti", "abbreviation": "HT" }, { "name": "Honduras", "abbreviation": "HN" }, { "name": "Hong Kong SAR China", "abbreviation": "HK" }, { "name": "Hungary", "abbreviation": "HU" }, { "name": "Iceland", "abbreviation": "IS" }, { "name": "India", "abbreviation": "IN" }, { "name": "Indonesia", "abbreviation": "ID" }, { "name": "Iran", "abbreviation": "IR" }, { "name": "Iraq", "abbreviation": "IQ" }, { "name": "Ireland", "abbreviation": "IE" }, { "name": "Isle of Man", "abbreviation": "IM" }, { "name": "Israel", "abbreviation": "IL" }, { "name": "Italy", "abbreviation": "IT" }, { "name": "Jamaica", "abbreviation": "JM" }, { "name": "Japan", "abbreviation": "JP" }, { "name": "Jersey", "abbreviation": "JE" }, { "name": "Jordan", "abbreviation": "JO" }, { "name": "Kazakhstan", "abbreviation": "KZ" }, { "name": "Kenya", "abbreviation": "KE" }, { "name": "Kiribati", "abbreviation": "KI" }, { "name": "Kosovo", "abbreviation": "XK" }, { "name": "Kuwait", "abbreviation": "KW" }, { "name": "Kyrgyzstan", "abbreviation": "KG" }, { "name": "Laos", "abbreviation": "LA" }, { "name": "Latvia", "abbreviation": "LV" }, { "name": "Lebanon", "abbreviation": "LB" }, { "name": "Lesotho", "abbreviation": "LS" }, { "name": "Liberia", "abbreviation": "LR" }, { "name": "Libya", "abbreviation": "LY" }, { "name": "Liechtenstein", "abbreviation": "LI" }, { "name": "Lithuania", "abbreviation": "LT" }, { "name": "Luxembourg", "abbreviation": "LU" }, { "name": "Macau SAR China", "abbreviation": "MO" }, { "name": "Macedonia", "abbreviation": "MK" }, { "name": "Madagascar", "abbreviation": "MG" }, { "name": "Malawi", "abbreviation": "MW" }, { "name": "Malaysia", "abbreviation": "MY" }, { "name": "Maldives", "abbreviation": "MV" }, { "name": "Mali", "abbreviation": "ML" }, { "name": "Malta", "abbreviation": "MT" }, { "name": "Marshall Islands", "abbreviation": "MH" }, { "name": "Martinique", "abbreviation": "MQ" }, { "name": "Mauritania", "abbreviation": "MR" }, { "name": "Mauritius", "abbreviation": "MU" }, { "name": "Mayotte", "abbreviation": "YT" }, { "name": "Mexico", "abbreviation": "MX" }, { "name": "Micronesia", "abbreviation": "FM" }, { "name": "Moldova", "abbreviation": "MD" }, { "name": "Monaco", "abbreviation": "MC" }, { "name": "Mongolia", "abbreviation": "MN" }, { "name": "Montenegro", "abbreviation": "ME" }, { "name": "Montserrat", "abbreviation": "MS" }, { "name": "Morocco", "abbreviation": "MA" }, { "name": "Mozambique", "abbreviation": "MZ" }, { "name": "Myanmar (Burma)", "abbreviation": "MM" }, { "name": "Namibia", "abbreviation": "NA" }, { "name": "Nauru", "abbreviation": "NR" }, { "name": "Nepal", "abbreviation": "NP" }, { "name": "Netherlands", "abbreviation": "NL" }, { "name": "New Caledonia", "abbreviation": "NC" }, { "name": "New Zealand", "abbreviation": "NZ" }, { "name": "Nicaragua", "abbreviation": "NI" }, { "name": "Niger", "abbreviation": "NE" }, { "name": "Nigeria", "abbreviation": "NG" }, { "name": "Niue", "abbreviation": "NU" }, { "name": "Norfolk Island", "abbreviation": "NF" }, { "name": "North Korea", "abbreviation": "KP" }, { "name": "Northern Mariana Islands", "abbreviation": "MP" }, { "name": "Norway", "abbreviation": "NO" }, { "name": "Oman", "abbreviation": "OM" }, { "name": "Pakistan", "abbreviation": "PK" }, { "name": "Palau", "abbreviation": "PW" }, { "name": "Palestinian Territories", "abbreviation": "PS" }, { "name": "Panama", "abbreviation": "PA" }, { "name": "Papua New Guinea", "abbreviation": "PG" }, { "name": "Paraguay", "abbreviation": "PY" }, { "name": "Peru", "abbreviation": "PE" }, { "name": "Philippines", "abbreviation": "PH" }, { "name": "Pitcairn Islands", "abbreviation": "PN" }, { "name": "Poland", "abbreviation": "PL" }, { "name": "Portugal", "abbreviation": "PT" }, { "name": "Puerto Rico", "abbreviation": "PR" }, { "name": "Qatar", "abbreviation": "QA" }, { "name": "R\xE9union", "abbreviation": "RE" }, { "name": "Romania", "abbreviation": "RO" }, { "name": "Russia", "abbreviation": "RU" }, { "name": "Rwanda", "abbreviation": "RW" }, { "name": "Samoa", "abbreviation": "WS" }, { "name": "San Marino", "abbreviation": "SM" }, { "name": "S\xE3o Tom\xE9 and Pr\xEDncipe", "abbreviation": "ST" }, { "name": "Saudi Arabia", "abbreviation": "SA" }, { "name": "Senegal", "abbreviation": "SN" }, { "name": "Serbia", "abbreviation": "RS" }, { "name": "Seychelles", "abbreviation": "SC" }, { "name": "Sierra Leone", "abbreviation": "SL" }, { "name": "Singapore", "abbreviation": "SG" }, { "name": "Sint Maarten", "abbreviation": "SX" }, { "name": "Slovakia", "abbreviation": "SK" }, { "name": "Slovenia", "abbreviation": "SI" }, { "name": "Solomon Islands", "abbreviation": "SB" }, { "name": "Somalia", "abbreviation": "SO" }, { "name": "South Africa", "abbreviation": "ZA" }, { "name": "South Georgia & South Sandwich Islands", "abbreviation": "GS" }, { "name": "South Korea", "abbreviation": "KR" }, { "name": "South Sudan", "abbreviation": "SS" }, { "name": "Spain", "abbreviation": "ES" }, { "name": "Sri Lanka", "abbreviation": "LK" }, { "name": "St. Barth\xE9lemy", "abbreviation": "BL" }, { "name": "St. Helena", "abbreviation": "SH" }, { "name": "St. Kitts & Nevis", "abbreviation": "KN" }, { "name": "St. Lucia", "abbreviation": "LC" }, { "name": "St. Martin", "abbreviation": "MF" }, { "name": "St. Pierre & Miquelon", "abbreviation": "PM" }, { "name": "St. Vincent & Grenadines", "abbreviation": "VC" }, { "name": "Sudan", "abbreviation": "SD" }, { "name": "Suriname", "abbreviation": "SR" }, { "name": "Svalbard & Jan Mayen", "abbreviation": "SJ" }, { "name": "Swaziland", "abbreviation": "SZ" }, { "name": "Sweden", "abbreviation": "SE" }, { "name": "Switzerland", "abbreviation": "CH" }, { "name": "Syria", "abbreviation": "SY" }, { "name": "Taiwan", "abbreviation": "TW" }, { "name": "Tajikistan", "abbreviation": "TJ" }, { "name": "Tanzania", "abbreviation": "TZ" }, { "name": "Thailand", "abbreviation": "TH" }, { "name": "Timor-Leste", "abbreviation": "TL" }, { "name": "Togo", "abbreviation": "TG" }, { "name": "Tokelau", "abbreviation": "TK" }, { "name": "Tonga", "abbreviation": "TO" }, { "name": "Trinidad & Tobago", "abbreviation": "TT" }, { "name": "Tristan da Cunha", "abbreviation": "TA" }, { "name": "Tunisia", "abbreviation": "TN" }, { "name": "Turkey", "abbreviation": "TR" }, { "name": "Turkmenistan", "abbreviation": "TM" }, { "name": "Turks & Caicos Islands", "abbreviation": "TC" }, { "name": "Tuvalu", "abbreviation": "TV" }, { "name": "U.S. Outlying Islands", "abbreviation": "UM" }, { "name": "U.S. Virgin Islands", "abbreviation": "VI" }, { "name": "Uganda", "abbreviation": "UG" }, { "name": "Ukraine", "abbreviation": "UA" }, { "name": "United Arab Emirates", "abbreviation": "AE" }, { "name": "United Kingdom", "abbreviation": "GB" }, { "name": "United States", "abbreviation": "US" }, { "name": "Uruguay", "abbreviation": "UY" }, { "name": "Uzbekistan", "abbreviation": "UZ" }, { "name": "Vanuatu", "abbreviation": "VU" }, { "name": "Vatican City", "abbreviation": "VA" }, { "name": "Venezuela", "abbreviation": "VE" }, { "name": "Vietnam", "abbreviation": "VN" }, { "name": "Wallis & Futuna", "abbreviation": "WF" }, { "name": "Western Sahara", "abbreviation": "EH" }, { "name": "Yemen", "abbreviation": "YE" }, { "name": "Zambia", "abbreviation": "ZM" }, { "name": "Zimbabwe", "abbreviation": "ZW" }],
          counties: {
            "uk": [
              { name: "Bath and North East Somerset" },
              { name: "Aberdeenshire" },
              { name: "Anglesey" },
              { name: "Angus" },
              { name: "Bedford" },
              { name: "Blackburn with Darwen" },
              { name: "Blackpool" },
              { name: "Bournemouth" },
              { name: "Bracknell Forest" },
              { name: "Brighton & Hove" },
              { name: "Bristol" },
              { name: "Buckinghamshire" },
              { name: "Cambridgeshire" },
              { name: "Carmarthenshire" },
              { name: "Central Bedfordshire" },
              { name: "Ceredigion" },
              { name: "Cheshire East" },
              { name: "Cheshire West and Chester" },
              { name: "Clackmannanshire" },
              { name: "Conwy" },
              { name: "Cornwall" },
              { name: "County Antrim" },
              { name: "County Armagh" },
              { name: "County Down" },
              { name: "County Durham" },
              { name: "County Fermanagh" },
              { name: "County Londonderry" },
              { name: "County Tyrone" },
              { name: "Cumbria" },
              { name: "Darlington" },
              { name: "Denbighshire" },
              { name: "Derby" },
              { name: "Derbyshire" },
              { name: "Devon" },
              { name: "Dorset" },
              { name: "Dumfries and Galloway" },
              { name: "Dundee" },
              { name: "East Lothian" },
              { name: "East Riding of Yorkshire" },
              { name: "East Sussex" },
              { name: "Edinburgh?" },
              { name: "Essex" },
              { name: "Falkirk" },
              { name: "Fife" },
              { name: "Flintshire" },
              { name: "Gloucestershire" },
              { name: "Greater London" },
              { name: "Greater Manchester" },
              { name: "Gwent" },
              { name: "Gwynedd" },
              { name: "Halton" },
              { name: "Hampshire" },
              { name: "Hartlepool" },
              { name: "Herefordshire" },
              { name: "Hertfordshire" },
              { name: "Highlands" },
              { name: "Hull" },
              { name: "Isle of Wight" },
              { name: "Isles of Scilly" },
              { name: "Kent" },
              { name: "Lancashire" },
              { name: "Leicester" },
              { name: "Leicestershire" },
              { name: "Lincolnshire" },
              { name: "Lothian" },
              { name: "Luton" },
              { name: "Medway" },
              { name: "Merseyside" },
              { name: "Mid Glamorgan" },
              { name: "Middlesbrough" },
              { name: "Milton Keynes" },
              { name: "Monmouthshire" },
              { name: "Moray" },
              { name: "Norfolk" },
              { name: "North East Lincolnshire" },
              { name: "North Lincolnshire" },
              { name: "North Somerset" },
              { name: "North Yorkshire" },
              { name: "Northamptonshire" },
              { name: "Northumberland" },
              { name: "Nottingham" },
              { name: "Nottinghamshire" },
              { name: "Oxfordshire" },
              { name: "Pembrokeshire" },
              { name: "Perth and Kinross" },
              { name: "Peterborough" },
              { name: "Plymouth" },
              { name: "Poole" },
              { name: "Portsmouth" },
              { name: "Powys" },
              { name: "Reading" },
              { name: "Redcar and Cleveland" },
              { name: "Rutland" },
              { name: "Scottish Borders" },
              { name: "Shropshire" },
              { name: "Slough" },
              { name: "Somerset" },
              { name: "South Glamorgan" },
              { name: "South Gloucestershire" },
              { name: "South Yorkshire" },
              { name: "Southampton" },
              { name: "Southend-on-Sea" },
              { name: "Staffordshire" },
              { name: "Stirlingshire" },
              { name: "Stockton-on-Tees" },
              { name: "Stoke-on-Trent" },
              { name: "Strathclyde" },
              { name: "Suffolk" },
              { name: "Surrey" },
              { name: "Swindon" },
              { name: "Telford and Wrekin" },
              { name: "Thurrock" },
              { name: "Torbay" },
              { name: "Tyne and Wear" },
              { name: "Warrington" },
              { name: "Warwickshire" },
              { name: "West Berkshire" },
              { name: "West Glamorgan" },
              { name: "West Lothian" },
              { name: "West Midlands" },
              { name: "West Sussex" },
              { name: "West Yorkshire" },
              { name: "Western Isles" },
              { name: "Wiltshire" },
              { name: "Windsor and Maidenhead" },
              { name: "Wokingham" },
              { name: "Worcestershire" },
              { name: "Wrexham" },
              { name: "York" }
            ]
          },
          provinces: {
            "ca": [
              { name: "Alberta", abbreviation: "AB" },
              { name: "British Columbia", abbreviation: "BC" },
              { name: "Manitoba", abbreviation: "MB" },
              { name: "New Brunswick", abbreviation: "NB" },
              { name: "Newfoundland and Labrador", abbreviation: "NL" },
              { name: "Nova Scotia", abbreviation: "NS" },
              { name: "Ontario", abbreviation: "ON" },
              { name: "Prince Edward Island", abbreviation: "PE" },
              { name: "Quebec", abbreviation: "QC" },
              { name: "Saskatchewan", abbreviation: "SK" },
              { name: "Northwest Territories", abbreviation: "NT" },
              { name: "Nunavut", abbreviation: "NU" },
              { name: "Yukon", abbreviation: "YT" }
            ],
            "it": [
              { name: "Agrigento", abbreviation: "AG", code: 84 },
              { name: "Alessandria", abbreviation: "AL", code: 6 },
              { name: "Ancona", abbreviation: "AN", code: 42 },
              { name: "Aosta", abbreviation: "AO", code: 7 },
              { name: "L'Aquila", abbreviation: "AQ", code: 66 },
              { name: "Arezzo", abbreviation: "AR", code: 51 },
              { name: "Ascoli-Piceno", abbreviation: "AP", code: 44 },
              { name: "Asti", abbreviation: "AT", code: 5 },
              { name: "Avellino", abbreviation: "AV", code: 64 },
              { name: "Bari", abbreviation: "BA", code: 72 },
              { name: "Barletta-Andria-Trani", abbreviation: "BT", code: 72 },
              { name: "Belluno", abbreviation: "BL", code: 25 },
              { name: "Benevento", abbreviation: "BN", code: 62 },
              { name: "Bergamo", abbreviation: "BG", code: 16 },
              { name: "Biella", abbreviation: "BI", code: 96 },
              { name: "Bologna", abbreviation: "BO", code: 37 },
              { name: "Bolzano", abbreviation: "BZ", code: 21 },
              { name: "Brescia", abbreviation: "BS", code: 17 },
              { name: "Brindisi", abbreviation: "BR", code: 74 },
              { name: "Cagliari", abbreviation: "CA", code: 92 },
              { name: "Caltanissetta", abbreviation: "CL", code: 85 },
              { name: "Campobasso", abbreviation: "CB", code: 70 },
              { name: "Carbonia Iglesias", abbreviation: "CI", code: 70 },
              { name: "Caserta", abbreviation: "CE", code: 61 },
              { name: "Catania", abbreviation: "CT", code: 87 },
              { name: "Catanzaro", abbreviation: "CZ", code: 79 },
              { name: "Chieti", abbreviation: "CH", code: 69 },
              { name: "Como", abbreviation: "CO", code: 13 },
              { name: "Cosenza", abbreviation: "CS", code: 78 },
              { name: "Cremona", abbreviation: "CR", code: 19 },
              { name: "Crotone", abbreviation: "KR", code: 101 },
              { name: "Cuneo", abbreviation: "CN", code: 4 },
              { name: "Enna", abbreviation: "EN", code: 86 },
              { name: "Fermo", abbreviation: "FM", code: 86 },
              { name: "Ferrara", abbreviation: "FE", code: 38 },
              { name: "Firenze", abbreviation: "FI", code: 48 },
              { name: "Foggia", abbreviation: "FG", code: 71 },
              { name: "Forli-Cesena", abbreviation: "FC", code: 71 },
              { name: "Frosinone", abbreviation: "FR", code: 60 },
              { name: "Genova", abbreviation: "GE", code: 10 },
              { name: "Gorizia", abbreviation: "GO", code: 31 },
              { name: "Grosseto", abbreviation: "GR", code: 53 },
              { name: "Imperia", abbreviation: "IM", code: 8 },
              { name: "Isernia", abbreviation: "IS", code: 94 },
              { name: "La-Spezia", abbreviation: "SP", code: 66 },
              { name: "Latina", abbreviation: "LT", code: 59 },
              { name: "Lecce", abbreviation: "LE", code: 75 },
              { name: "Lecco", abbreviation: "LC", code: 97 },
              { name: "Livorno", abbreviation: "LI", code: 49 },
              { name: "Lodi", abbreviation: "LO", code: 98 },
              { name: "Lucca", abbreviation: "LU", code: 46 },
              { name: "Macerata", abbreviation: "MC", code: 43 },
              { name: "Mantova", abbreviation: "MN", code: 20 },
              { name: "Massa-Carrara", abbreviation: "MS", code: 45 },
              { name: "Matera", abbreviation: "MT", code: 77 },
              { name: "Medio Campidano", abbreviation: "VS", code: 77 },
              { name: "Messina", abbreviation: "ME", code: 83 },
              { name: "Milano", abbreviation: "MI", code: 15 },
              { name: "Modena", abbreviation: "MO", code: 36 },
              { name: "Monza-Brianza", abbreviation: "MB", code: 36 },
              { name: "Napoli", abbreviation: "NA", code: 63 },
              { name: "Novara", abbreviation: "NO", code: 3 },
              { name: "Nuoro", abbreviation: "NU", code: 91 },
              { name: "Ogliastra", abbreviation: "OG", code: 91 },
              { name: "Olbia Tempio", abbreviation: "OT", code: 91 },
              { name: "Oristano", abbreviation: "OR", code: 95 },
              { name: "Padova", abbreviation: "PD", code: 28 },
              { name: "Palermo", abbreviation: "PA", code: 82 },
              { name: "Parma", abbreviation: "PR", code: 34 },
              { name: "Pavia", abbreviation: "PV", code: 18 },
              { name: "Perugia", abbreviation: "PG", code: 54 },
              { name: "Pesaro-Urbino", abbreviation: "PU", code: 41 },
              { name: "Pescara", abbreviation: "PE", code: 68 },
              { name: "Piacenza", abbreviation: "PC", code: 33 },
              { name: "Pisa", abbreviation: "PI", code: 50 },
              { name: "Pistoia", abbreviation: "PT", code: 47 },
              { name: "Pordenone", abbreviation: "PN", code: 93 },
              { name: "Potenza", abbreviation: "PZ", code: 76 },
              { name: "Prato", abbreviation: "PO", code: 100 },
              { name: "Ragusa", abbreviation: "RG", code: 88 },
              { name: "Ravenna", abbreviation: "RA", code: 39 },
              { name: "Reggio-Calabria", abbreviation: "RC", code: 35 },
              { name: "Reggio-Emilia", abbreviation: "RE", code: 35 },
              { name: "Rieti", abbreviation: "RI", code: 57 },
              { name: "Rimini", abbreviation: "RN", code: 99 },
              { name: "Roma", abbreviation: "Roma", code: 58 },
              { name: "Rovigo", abbreviation: "RO", code: 29 },
              { name: "Salerno", abbreviation: "SA", code: 65 },
              { name: "Sassari", abbreviation: "SS", code: 90 },
              { name: "Savona", abbreviation: "SV", code: 9 },
              { name: "Siena", abbreviation: "SI", code: 52 },
              { name: "Siracusa", abbreviation: "SR", code: 89 },
              { name: "Sondrio", abbreviation: "SO", code: 14 },
              { name: "Taranto", abbreviation: "TA", code: 73 },
              { name: "Teramo", abbreviation: "TE", code: 67 },
              { name: "Terni", abbreviation: "TR", code: 55 },
              { name: "Torino", abbreviation: "TO", code: 1 },
              { name: "Trapani", abbreviation: "TP", code: 81 },
              { name: "Trento", abbreviation: "TN", code: 22 },
              { name: "Treviso", abbreviation: "TV", code: 26 },
              { name: "Trieste", abbreviation: "TS", code: 32 },
              { name: "Udine", abbreviation: "UD", code: 30 },
              { name: "Varese", abbreviation: "VA", code: 12 },
              { name: "Venezia", abbreviation: "VE", code: 27 },
              { name: "Verbania", abbreviation: "VB", code: 27 },
              { name: "Vercelli", abbreviation: "VC", code: 2 },
              { name: "Verona", abbreviation: "VR", code: 23 },
              { name: "Vibo-Valentia", abbreviation: "VV", code: 102 },
              { name: "Vicenza", abbreviation: "VI", code: 24 },
              { name: "Viterbo", abbreviation: "VT", code: 56 }
            ]
          },
          nationalities: [
            { name: "Afghan" },
            { name: "Albanian" },
            { name: "Algerian" },
            { name: "American" },
            { name: "Andorran" },
            { name: "Angolan" },
            { name: "Antiguans" },
            { name: "Argentinean" },
            { name: "Armenian" },
            { name: "Australian" },
            { name: "Austrian" },
            { name: "Azerbaijani" },
            { name: "Bahami" },
            { name: "Bahraini" },
            { name: "Bangladeshi" },
            { name: "Barbadian" },
            { name: "Barbudans" },
            { name: "Batswana" },
            { name: "Belarusian" },
            { name: "Belgian" },
            { name: "Belizean" },
            { name: "Beninese" },
            { name: "Bhutanese" },
            { name: "Bolivian" },
            { name: "Bosnian" },
            { name: "Brazilian" },
            { name: "British" },
            { name: "Bruneian" },
            { name: "Bulgarian" },
            { name: "Burkinabe" },
            { name: "Burmese" },
            { name: "Burundian" },
            { name: "Cambodian" },
            { name: "Cameroonian" },
            { name: "Canadian" },
            { name: "Cape Verdean" },
            { name: "Central African" },
            { name: "Chadian" },
            { name: "Chilean" },
            { name: "Chinese" },
            { name: "Colombian" },
            { name: "Comoran" },
            { name: "Congolese" },
            { name: "Costa Rican" },
            { name: "Croatian" },
            { name: "Cuban" },
            { name: "Cypriot" },
            { name: "Czech" },
            { name: "Danish" },
            { name: "Djibouti" },
            { name: "Dominican" },
            { name: "Dutch" },
            { name: "East Timorese" },
            { name: "Ecuadorean" },
            { name: "Egyptian" },
            { name: "Emirian" },
            { name: "Equatorial Guinean" },
            { name: "Eritrean" },
            { name: "Estonian" },
            { name: "Ethiopian" },
            { name: "Fijian" },
            { name: "Filipino" },
            { name: "Finnish" },
            { name: "French" },
            { name: "Gabonese" },
            { name: "Gambian" },
            { name: "Georgian" },
            { name: "German" },
            { name: "Ghanaian" },
            { name: "Greek" },
            { name: "Grenadian" },
            { name: "Guatemalan" },
            { name: "Guinea-Bissauan" },
            { name: "Guinean" },
            { name: "Guyanese" },
            { name: "Haitian" },
            { name: "Herzegovinian" },
            { name: "Honduran" },
            { name: "Hungarian" },
            { name: "I-Kiribati" },
            { name: "Icelander" },
            { name: "Indian" },
            { name: "Indonesian" },
            { name: "Iranian" },
            { name: "Iraqi" },
            { name: "Irish" },
            { name: "Israeli" },
            { name: "Italian" },
            { name: "Ivorian" },
            { name: "Jamaican" },
            { name: "Japanese" },
            { name: "Jordanian" },
            { name: "Kazakhstani" },
            { name: "Kenyan" },
            { name: "Kittian and Nevisian" },
            { name: "Kuwaiti" },
            { name: "Kyrgyz" },
            { name: "Laotian" },
            { name: "Latvian" },
            { name: "Lebanese" },
            { name: "Liberian" },
            { name: "Libyan" },
            { name: "Liechtensteiner" },
            { name: "Lithuanian" },
            { name: "Luxembourger" },
            { name: "Macedonian" },
            { name: "Malagasy" },
            { name: "Malawian" },
            { name: "Malaysian" },
            { name: "Maldivan" },
            { name: "Malian" },
            { name: "Maltese" },
            { name: "Marshallese" },
            { name: "Mauritanian" },
            { name: "Mauritian" },
            { name: "Mexican" },
            { name: "Micronesian" },
            { name: "Moldovan" },
            { name: "Monacan" },
            { name: "Mongolian" },
            { name: "Moroccan" },
            { name: "Mosotho" },
            { name: "Motswana" },
            { name: "Mozambican" },
            { name: "Namibian" },
            { name: "Nauruan" },
            { name: "Nepalese" },
            { name: "New Zealander" },
            { name: "Nicaraguan" },
            { name: "Nigerian" },
            { name: "Nigerien" },
            { name: "North Korean" },
            { name: "Northern Irish" },
            { name: "Norwegian" },
            { name: "Omani" },
            { name: "Pakistani" },
            { name: "Palauan" },
            { name: "Panamanian" },
            { name: "Papua New Guinean" },
            { name: "Paraguayan" },
            { name: "Peruvian" },
            { name: "Polish" },
            { name: "Portuguese" },
            { name: "Qatari" },
            { name: "Romani" },
            { name: "Russian" },
            { name: "Rwandan" },
            { name: "Saint Lucian" },
            { name: "Salvadoran" },
            { name: "Samoan" },
            { name: "San Marinese" },
            { name: "Sao Tomean" },
            { name: "Saudi" },
            { name: "Scottish" },
            { name: "Senegalese" },
            { name: "Serbian" },
            { name: "Seychellois" },
            { name: "Sierra Leonean" },
            { name: "Singaporean" },
            { name: "Slovakian" },
            { name: "Slovenian" },
            { name: "Solomon Islander" },
            { name: "Somali" },
            { name: "South African" },
            { name: "South Korean" },
            { name: "Spanish" },
            { name: "Sri Lankan" },
            { name: "Sudanese" },
            { name: "Surinamer" },
            { name: "Swazi" },
            { name: "Swedish" },
            { name: "Swiss" },
            { name: "Syrian" },
            { name: "Taiwanese" },
            { name: "Tajik" },
            { name: "Tanzanian" },
            { name: "Thai" },
            { name: "Togolese" },
            { name: "Tongan" },
            { name: "Trinidadian or Tobagonian" },
            { name: "Tunisian" },
            { name: "Turkish" },
            { name: "Tuvaluan" },
            { name: "Ugandan" },
            { name: "Ukrainian" },
            { name: "Uruguaya" },
            { name: "Uzbekistani" },
            { name: "Venezuela" },
            { name: "Vietnamese" },
            { name: "Wels" },
            { name: "Yemenit" },
            { name: "Zambia" },
            { name: "Zimbabwe" }
          ],
          locale_languages: [
            "aa",
            "ab",
            "ae",
            "af",
            "ak",
            "am",
            "an",
            "ar",
            "as",
            "av",
            "ay",
            "az",
            "ba",
            "be",
            "bg",
            "bh",
            "bi",
            "bm",
            "bn",
            "bo",
            "br",
            "bs",
            "ca",
            "ce",
            "ch",
            "co",
            "cr",
            "cs",
            "cu",
            "cv",
            "cy",
            "da",
            "de",
            "dv",
            "dz",
            "ee",
            "el",
            "en",
            "eo",
            "es",
            "et",
            "eu",
            "fa",
            "ff",
            "fi",
            "fj",
            "fo",
            "fr",
            "fy",
            "ga",
            "gd",
            "gl",
            "gn",
            "gu",
            "gv",
            "ha",
            "he",
            "hi",
            "ho",
            "hr",
            "ht",
            "hu",
            "hy",
            "hz",
            "ia",
            "id",
            "ie",
            "ig",
            "ii",
            "ik",
            "io",
            "is",
            "it",
            "iu",
            "ja",
            "jv",
            "ka",
            "kg",
            "ki",
            "kj",
            "kk",
            "kl",
            "km",
            "kn",
            "ko",
            "kr",
            "ks",
            "ku",
            "kv",
            "kw",
            "ky",
            "la",
            "lb",
            "lg",
            "li",
            "ln",
            "lo",
            "lt",
            "lu",
            "lv",
            "mg",
            "mh",
            "mi",
            "mk",
            "ml",
            "mn",
            "mr",
            "ms",
            "mt",
            "my",
            "na",
            "nb",
            "nd",
            "ne",
            "ng",
            "nl",
            "nn",
            "no",
            "nr",
            "nv",
            "ny",
            "oc",
            "oj",
            "om",
            "or",
            "os",
            "pa",
            "pi",
            "pl",
            "ps",
            "pt",
            "qu",
            "rm",
            "rn",
            "ro",
            "ru",
            "rw",
            "sa",
            "sc",
            "sd",
            "se",
            "sg",
            "si",
            "sk",
            "sl",
            "sm",
            "sn",
            "so",
            "sq",
            "sr",
            "ss",
            "st",
            "su",
            "sv",
            "sw",
            "ta",
            "te",
            "tg",
            "th",
            "ti",
            "tk",
            "tl",
            "tn",
            "to",
            "tr",
            "ts",
            "tt",
            "tw",
            "ty",
            "ug",
            "uk",
            "ur",
            "uz",
            "ve",
            "vi",
            "vo",
            "wa",
            "wo",
            "xh",
            "yi",
            "yo",
            "za",
            "zh",
            "zu"
          ],
          locale_regions: [
            "agq-CM",
            "asa-TZ",
            "ast-ES",
            "bas-CM",
            "bem-ZM",
            "bez-TZ",
            "brx-IN",
            "cgg-UG",
            "chr-US",
            "dav-KE",
            "dje-NE",
            "dsb-DE",
            "dua-CM",
            "dyo-SN",
            "ebu-KE",
            "ewo-CM",
            "fil-PH",
            "fur-IT",
            "gsw-CH",
            "gsw-FR",
            "gsw-LI",
            "guz-KE",
            "haw-US",
            "hsb-DE",
            "jgo-CM",
            "jmc-TZ",
            "kab-DZ",
            "kam-KE",
            "kde-TZ",
            "kea-CV",
            "khq-ML",
            "kkj-CM",
            "kln-KE",
            "kok-IN",
            "ksb-TZ",
            "ksf-CM",
            "ksh-DE",
            "lag-TZ",
            "lkt-US",
            "luo-KE",
            "luy-KE",
            "mas-KE",
            "mas-TZ",
            "mer-KE",
            "mfe-MU",
            "mgh-MZ",
            "mgo-CM",
            "mua-CM",
            "naq-NA",
            "nmg-CM",
            "nnh-CM",
            "nus-SD",
            "nyn-UG",
            "rof-TZ",
            "rwk-TZ",
            "sah-RU",
            "saq-KE",
            "sbp-TZ",
            "seh-MZ",
            "ses-ML",
            "shi-Latn",
            "shi-Latn-MA",
            "shi-Tfng",
            "shi-Tfng-MA",
            "smn-FI",
            "teo-KE",
            "teo-UG",
            "twq-NE",
            "tzm-Latn",
            "tzm-Latn-MA",
            "vai-Latn",
            "vai-Latn-LR",
            "vai-Vaii",
            "vai-Vaii-LR",
            "vun-TZ",
            "wae-CH",
            "xog-UG",
            "yav-CM",
            "zgh-MA",
            "af-NA",
            "af-ZA",
            "ak-GH",
            "am-ET",
            "ar-001",
            "ar-AE",
            "ar-BH",
            "ar-DJ",
            "ar-DZ",
            "ar-EG",
            "ar-EH",
            "ar-ER",
            "ar-IL",
            "ar-IQ",
            "ar-JO",
            "ar-KM",
            "ar-KW",
            "ar-LB",
            "ar-LY",
            "ar-MA",
            "ar-MR",
            "ar-OM",
            "ar-PS",
            "ar-QA",
            "ar-SA",
            "ar-SD",
            "ar-SO",
            "ar-SS",
            "ar-SY",
            "ar-TD",
            "ar-TN",
            "ar-YE",
            "as-IN",
            "az-Cyrl",
            "az-Cyrl-AZ",
            "az-Latn",
            "az-Latn-AZ",
            "be-BY",
            "bg-BG",
            "bm-Latn",
            "bm-Latn-ML",
            "bn-BD",
            "bn-IN",
            "bo-CN",
            "bo-IN",
            "br-FR",
            "bs-Cyrl",
            "bs-Cyrl-BA",
            "bs-Latn",
            "bs-Latn-BA",
            "ca-AD",
            "ca-ES",
            "ca-ES-VALENCIA",
            "ca-FR",
            "ca-IT",
            "cs-CZ",
            "cy-GB",
            "da-DK",
            "da-GL",
            "de-AT",
            "de-BE",
            "de-CH",
            "de-DE",
            "de-LI",
            "de-LU",
            "dz-BT",
            "ee-GH",
            "ee-TG",
            "el-CY",
            "el-GR",
            "en-001",
            "en-150",
            "en-AG",
            "en-AI",
            "en-AS",
            "en-AU",
            "en-BB",
            "en-BE",
            "en-BM",
            "en-BS",
            "en-BW",
            "en-BZ",
            "en-CA",
            "en-CC",
            "en-CK",
            "en-CM",
            "en-CX",
            "en-DG",
            "en-DM",
            "en-ER",
            "en-FJ",
            "en-FK",
            "en-FM",
            "en-GB",
            "en-GD",
            "en-GG",
            "en-GH",
            "en-GI",
            "en-GM",
            "en-GU",
            "en-GY",
            "en-HK",
            "en-IE",
            "en-IM",
            "en-IN",
            "en-IO",
            "en-JE",
            "en-JM",
            "en-KE",
            "en-KI",
            "en-KN",
            "en-KY",
            "en-LC",
            "en-LR",
            "en-LS",
            "en-MG",
            "en-MH",
            "en-MO",
            "en-MP",
            "en-MS",
            "en-MT",
            "en-MU",
            "en-MW",
            "en-MY",
            "en-NA",
            "en-NF",
            "en-NG",
            "en-NR",
            "en-NU",
            "en-NZ",
            "en-PG",
            "en-PH",
            "en-PK",
            "en-PN",
            "en-PR",
            "en-PW",
            "en-RW",
            "en-SB",
            "en-SC",
            "en-SD",
            "en-SG",
            "en-SH",
            "en-SL",
            "en-SS",
            "en-SX",
            "en-SZ",
            "en-TC",
            "en-TK",
            "en-TO",
            "en-TT",
            "en-TV",
            "en-TZ",
            "en-UG",
            "en-UM",
            "en-US",
            "en-US-POSIX",
            "en-VC",
            "en-VG",
            "en-VI",
            "en-VU",
            "en-WS",
            "en-ZA",
            "en-ZM",
            "en-ZW",
            "eo-001",
            "es-419",
            "es-AR",
            "es-BO",
            "es-CL",
            "es-CO",
            "es-CR",
            "es-CU",
            "es-DO",
            "es-EA",
            "es-EC",
            "es-ES",
            "es-GQ",
            "es-GT",
            "es-HN",
            "es-IC",
            "es-MX",
            "es-NI",
            "es-PA",
            "es-PE",
            "es-PH",
            "es-PR",
            "es-PY",
            "es-SV",
            "es-US",
            "es-UY",
            "es-VE",
            "et-EE",
            "eu-ES",
            "fa-AF",
            "fa-IR",
            "ff-CM",
            "ff-GN",
            "ff-MR",
            "ff-SN",
            "fi-FI",
            "fo-FO",
            "fr-BE",
            "fr-BF",
            "fr-BI",
            "fr-BJ",
            "fr-BL",
            "fr-CA",
            "fr-CD",
            "fr-CF",
            "fr-CG",
            "fr-CH",
            "fr-CI",
            "fr-CM",
            "fr-DJ",
            "fr-DZ",
            "fr-FR",
            "fr-GA",
            "fr-GF",
            "fr-GN",
            "fr-GP",
            "fr-GQ",
            "fr-HT",
            "fr-KM",
            "fr-LU",
            "fr-MA",
            "fr-MC",
            "fr-MF",
            "fr-MG",
            "fr-ML",
            "fr-MQ",
            "fr-MR",
            "fr-MU",
            "fr-NC",
            "fr-NE",
            "fr-PF",
            "fr-PM",
            "fr-RE",
            "fr-RW",
            "fr-SC",
            "fr-SN",
            "fr-SY",
            "fr-TD",
            "fr-TG",
            "fr-TN",
            "fr-VU",
            "fr-WF",
            "fr-YT",
            "fy-NL",
            "ga-IE",
            "gd-GB",
            "gl-ES",
            "gu-IN",
            "gv-IM",
            "ha-Latn",
            "ha-Latn-GH",
            "ha-Latn-NE",
            "ha-Latn-NG",
            "he-IL",
            "hi-IN",
            "hr-BA",
            "hr-HR",
            "hu-HU",
            "hy-AM",
            "id-ID",
            "ig-NG",
            "ii-CN",
            "is-IS",
            "it-CH",
            "it-IT",
            "it-SM",
            "ja-JP",
            "ka-GE",
            "ki-KE",
            "kk-Cyrl",
            "kk-Cyrl-KZ",
            "kl-GL",
            "km-KH",
            "kn-IN",
            "ko-KP",
            "ko-KR",
            "ks-Arab",
            "ks-Arab-IN",
            "kw-GB",
            "ky-Cyrl",
            "ky-Cyrl-KG",
            "lb-LU",
            "lg-UG",
            "ln-AO",
            "ln-CD",
            "ln-CF",
            "ln-CG",
            "lo-LA",
            "lt-LT",
            "lu-CD",
            "lv-LV",
            "mg-MG",
            "mk-MK",
            "ml-IN",
            "mn-Cyrl",
            "mn-Cyrl-MN",
            "mr-IN",
            "ms-Latn",
            "ms-Latn-BN",
            "ms-Latn-MY",
            "ms-Latn-SG",
            "mt-MT",
            "my-MM",
            "nb-NO",
            "nb-SJ",
            "nd-ZW",
            "ne-IN",
            "ne-NP",
            "nl-AW",
            "nl-BE",
            "nl-BQ",
            "nl-CW",
            "nl-NL",
            "nl-SR",
            "nl-SX",
            "nn-NO",
            "om-ET",
            "om-KE",
            "or-IN",
            "os-GE",
            "os-RU",
            "pa-Arab",
            "pa-Arab-PK",
            "pa-Guru",
            "pa-Guru-IN",
            "pl-PL",
            "ps-AF",
            "pt-AO",
            "pt-BR",
            "pt-CV",
            "pt-GW",
            "pt-MO",
            "pt-MZ",
            "pt-PT",
            "pt-ST",
            "pt-TL",
            "qu-BO",
            "qu-EC",
            "qu-PE",
            "rm-CH",
            "rn-BI",
            "ro-MD",
            "ro-RO",
            "ru-BY",
            "ru-KG",
            "ru-KZ",
            "ru-MD",
            "ru-RU",
            "ru-UA",
            "rw-RW",
            "se-FI",
            "se-NO",
            "se-SE",
            "sg-CF",
            "si-LK",
            "sk-SK",
            "sl-SI",
            "sn-ZW",
            "so-DJ",
            "so-ET",
            "so-KE",
            "so-SO",
            "sq-AL",
            "sq-MK",
            "sq-XK",
            "sr-Cyrl",
            "sr-Cyrl-BA",
            "sr-Cyrl-ME",
            "sr-Cyrl-RS",
            "sr-Cyrl-XK",
            "sr-Latn",
            "sr-Latn-BA",
            "sr-Latn-ME",
            "sr-Latn-RS",
            "sr-Latn-XK",
            "sv-AX",
            "sv-FI",
            "sv-SE",
            "sw-CD",
            "sw-KE",
            "sw-TZ",
            "sw-UG",
            "ta-IN",
            "ta-LK",
            "ta-MY",
            "ta-SG",
            "te-IN",
            "th-TH",
            "ti-ER",
            "ti-ET",
            "to-TO",
            "tr-CY",
            "tr-TR",
            "ug-Arab",
            "ug-Arab-CN",
            "uk-UA",
            "ur-IN",
            "ur-PK",
            "uz-Arab",
            "uz-Arab-AF",
            "uz-Cyrl",
            "uz-Cyrl-UZ",
            "uz-Latn",
            "uz-Latn-UZ",
            "vi-VN",
            "yi-001",
            "yo-BJ",
            "yo-NG",
            "zh-Hans",
            "zh-Hans-CN",
            "zh-Hans-HK",
            "zh-Hans-MO",
            "zh-Hans-SG",
            "zh-Hant",
            "zh-Hant-HK",
            "zh-Hant-MO",
            "zh-Hant-TW",
            "zu-ZA"
          ],
          us_states_and_dc: [
            { name: "Alabama", abbreviation: "AL" },
            { name: "Alaska", abbreviation: "AK" },
            { name: "Arizona", abbreviation: "AZ" },
            { name: "Arkansas", abbreviation: "AR" },
            { name: "California", abbreviation: "CA" },
            { name: "Colorado", abbreviation: "CO" },
            { name: "Connecticut", abbreviation: "CT" },
            { name: "Delaware", abbreviation: "DE" },
            { name: "District of Columbia", abbreviation: "DC" },
            { name: "Florida", abbreviation: "FL" },
            { name: "Georgia", abbreviation: "GA" },
            { name: "Hawaii", abbreviation: "HI" },
            { name: "Idaho", abbreviation: "ID" },
            { name: "Illinois", abbreviation: "IL" },
            { name: "Indiana", abbreviation: "IN" },
            { name: "Iowa", abbreviation: "IA" },
            { name: "Kansas", abbreviation: "KS" },
            { name: "Kentucky", abbreviation: "KY" },
            { name: "Louisiana", abbreviation: "LA" },
            { name: "Maine", abbreviation: "ME" },
            { name: "Maryland", abbreviation: "MD" },
            { name: "Massachusetts", abbreviation: "MA" },
            { name: "Michigan", abbreviation: "MI" },
            { name: "Minnesota", abbreviation: "MN" },
            { name: "Mississippi", abbreviation: "MS" },
            { name: "Missouri", abbreviation: "MO" },
            { name: "Montana", abbreviation: "MT" },
            { name: "Nebraska", abbreviation: "NE" },
            { name: "Nevada", abbreviation: "NV" },
            { name: "New Hampshire", abbreviation: "NH" },
            { name: "New Jersey", abbreviation: "NJ" },
            { name: "New Mexico", abbreviation: "NM" },
            { name: "New York", abbreviation: "NY" },
            { name: "North Carolina", abbreviation: "NC" },
            { name: "North Dakota", abbreviation: "ND" },
            { name: "Ohio", abbreviation: "OH" },
            { name: "Oklahoma", abbreviation: "OK" },
            { name: "Oregon", abbreviation: "OR" },
            { name: "Pennsylvania", abbreviation: "PA" },
            { name: "Rhode Island", abbreviation: "RI" },
            { name: "South Carolina", abbreviation: "SC" },
            { name: "South Dakota", abbreviation: "SD" },
            { name: "Tennessee", abbreviation: "TN" },
            { name: "Texas", abbreviation: "TX" },
            { name: "Utah", abbreviation: "UT" },
            { name: "Vermont", abbreviation: "VT" },
            { name: "Virginia", abbreviation: "VA" },
            { name: "Washington", abbreviation: "WA" },
            { name: "West Virginia", abbreviation: "WV" },
            { name: "Wisconsin", abbreviation: "WI" },
            { name: "Wyoming", abbreviation: "WY" }
          ],
          territories: [
            { name: "American Samoa", abbreviation: "AS" },
            { name: "Federated States of Micronesia", abbreviation: "FM" },
            { name: "Guam", abbreviation: "GU" },
            { name: "Marshall Islands", abbreviation: "MH" },
            { name: "Northern Mariana Islands", abbreviation: "MP" },
            { name: "Puerto Rico", abbreviation: "PR" },
            { name: "Virgin Islands, U.S.", abbreviation: "VI" }
          ],
          armed_forces: [
            { name: "Armed Forces Europe", abbreviation: "AE" },
            { name: "Armed Forces Pacific", abbreviation: "AP" },
            { name: "Armed Forces the Americas", abbreviation: "AA" }
          ],
          country_regions: {
            it: [
              { name: "Valle d'Aosta", abbreviation: "VDA" },
              { name: "Piemonte", abbreviation: "PIE" },
              { name: "Lombardia", abbreviation: "LOM" },
              { name: "Veneto", abbreviation: "VEN" },
              { name: "Trentino Alto Adige", abbreviation: "TAA" },
              { name: "Friuli Venezia Giulia", abbreviation: "FVG" },
              { name: "Liguria", abbreviation: "LIG" },
              { name: "Emilia Romagna", abbreviation: "EMR" },
              { name: "Toscana", abbreviation: "TOS" },
              { name: "Umbria", abbreviation: "UMB" },
              { name: "Marche", abbreviation: "MAR" },
              { name: "Abruzzo", abbreviation: "ABR" },
              { name: "Lazio", abbreviation: "LAZ" },
              { name: "Campania", abbreviation: "CAM" },
              { name: "Puglia", abbreviation: "PUG" },
              { name: "Basilicata", abbreviation: "BAS" },
              { name: "Molise", abbreviation: "MOL" },
              { name: "Calabria", abbreviation: "CAL" },
              { name: "Sicilia", abbreviation: "SIC" },
              { name: "Sardegna", abbreviation: "SAR" }
            ],
            mx: [
              { name: "Aguascalientes", abbreviation: "AGU" },
              { name: "Baja California", abbreviation: "BCN" },
              { name: "Baja California Sur", abbreviation: "BCS" },
              { name: "Campeche", abbreviation: "CAM" },
              { name: "Chiapas", abbreviation: "CHP" },
              { name: "Chihuahua", abbreviation: "CHH" },
              { name: "Ciudad de M\xE9xico", abbreviation: "DIF" },
              { name: "Coahuila", abbreviation: "COA" },
              { name: "Colima", abbreviation: "COL" },
              { name: "Durango", abbreviation: "DUR" },
              { name: "Guanajuato", abbreviation: "GUA" },
              { name: "Guerrero", abbreviation: "GRO" },
              { name: "Hidalgo", abbreviation: "HID" },
              { name: "Jalisco", abbreviation: "JAL" },
              { name: "M\xE9xico", abbreviation: "MEX" },
              { name: "Michoac\xE1n", abbreviation: "MIC" },
              { name: "Morelos", abbreviation: "MOR" },
              { name: "Nayarit", abbreviation: "NAY" },
              { name: "Nuevo Le\xF3n", abbreviation: "NLE" },
              { name: "Oaxaca", abbreviation: "OAX" },
              { name: "Puebla", abbreviation: "PUE" },
              { name: "Quer\xE9taro", abbreviation: "QUE" },
              { name: "Quintana Roo", abbreviation: "ROO" },
              { name: "San Luis Potos\xED", abbreviation: "SLP" },
              { name: "Sinaloa", abbreviation: "SIN" },
              { name: "Sonora", abbreviation: "SON" },
              { name: "Tabasco", abbreviation: "TAB" },
              { name: "Tamaulipas", abbreviation: "TAM" },
              { name: "Tlaxcala", abbreviation: "TLA" },
              { name: "Veracruz", abbreviation: "VER" },
              { name: "Yucat\xE1n", abbreviation: "YUC" },
              { name: "Zacatecas", abbreviation: "ZAC" }
            ]
          },
          street_suffixes: {
            "us": [
              { name: "Avenue", abbreviation: "Ave" },
              { name: "Boulevard", abbreviation: "Blvd" },
              { name: "Center", abbreviation: "Ctr" },
              { name: "Circle", abbreviation: "Cir" },
              { name: "Court", abbreviation: "Ct" },
              { name: "Drive", abbreviation: "Dr" },
              { name: "Extension", abbreviation: "Ext" },
              { name: "Glen", abbreviation: "Gln" },
              { name: "Grove", abbreviation: "Grv" },
              { name: "Heights", abbreviation: "Hts" },
              { name: "Highway", abbreviation: "Hwy" },
              { name: "Junction", abbreviation: "Jct" },
              { name: "Key", abbreviation: "Key" },
              { name: "Lane", abbreviation: "Ln" },
              { name: "Loop", abbreviation: "Loop" },
              { name: "Manor", abbreviation: "Mnr" },
              { name: "Mill", abbreviation: "Mill" },
              { name: "Park", abbreviation: "Park" },
              { name: "Parkway", abbreviation: "Pkwy" },
              { name: "Pass", abbreviation: "Pass" },
              { name: "Path", abbreviation: "Path" },
              { name: "Pike", abbreviation: "Pike" },
              { name: "Place", abbreviation: "Pl" },
              { name: "Plaza", abbreviation: "Plz" },
              { name: "Point", abbreviation: "Pt" },
              { name: "Ridge", abbreviation: "Rdg" },
              { name: "River", abbreviation: "Riv" },
              { name: "Road", abbreviation: "Rd" },
              { name: "Square", abbreviation: "Sq" },
              { name: "Street", abbreviation: "St" },
              { name: "Terrace", abbreviation: "Ter" },
              { name: "Trail", abbreviation: "Trl" },
              { name: "Turnpike", abbreviation: "Tpke" },
              { name: "View", abbreviation: "Vw" },
              { name: "Way", abbreviation: "Way" }
            ],
            "it": [
              { name: "Accesso", abbreviation: "Acc." },
              { name: "Alzaia", abbreviation: "Alz." },
              { name: "Arco", abbreviation: "Arco" },
              { name: "Archivolto", abbreviation: "Acv." },
              { name: "Arena", abbreviation: "Arena" },
              { name: "Argine", abbreviation: "Argine" },
              { name: "Bacino", abbreviation: "Bacino" },
              { name: "Banchi", abbreviation: "Banchi" },
              { name: "Banchina", abbreviation: "Ban." },
              { name: "Bastioni", abbreviation: "Bas." },
              { name: "Belvedere", abbreviation: "Belv." },
              { name: "Borgata", abbreviation: "B.ta" },
              { name: "Borgo", abbreviation: "B.go" },
              { name: "Calata", abbreviation: "Cal." },
              { name: "Calle", abbreviation: "Calle" },
              { name: "Campiello", abbreviation: "Cam." },
              { name: "Campo", abbreviation: "Cam." },
              { name: "Canale", abbreviation: "Can." },
              { name: "Carraia", abbreviation: "Carr." },
              { name: "Cascina", abbreviation: "Cascina" },
              { name: "Case sparse", abbreviation: "c.s." },
              { name: "Cavalcavia", abbreviation: "Cv." },
              { name: "Circonvallazione", abbreviation: "Cv." },
              { name: "Complanare", abbreviation: "C.re" },
              { name: "Contrada", abbreviation: "C.da" },
              { name: "Corso", abbreviation: "C.so" },
              { name: "Corte", abbreviation: "C.te" },
              { name: "Cortile", abbreviation: "C.le" },
              { name: "Diramazione", abbreviation: "Dir." },
              { name: "Fondaco", abbreviation: "F.co" },
              { name: "Fondamenta", abbreviation: "F.ta" },
              { name: "Fondo", abbreviation: "F.do" },
              { name: "Frazione", abbreviation: "Fr." },
              { name: "Isola", abbreviation: "Is." },
              { name: "Largo", abbreviation: "L.go" },
              { name: "Litoranea", abbreviation: "Lit." },
              { name: "Lungolago", abbreviation: "L.go lago" },
              { name: "Lungo Po", abbreviation: "l.go Po" },
              { name: "Molo", abbreviation: "Molo" },
              { name: "Mura", abbreviation: "Mura" },
              { name: "Passaggio privato", abbreviation: "pass. priv." },
              { name: "Passeggiata", abbreviation: "Pass." },
              { name: "Piazza", abbreviation: "P.zza" },
              { name: "Piazzale", abbreviation: "P.le" },
              { name: "Ponte", abbreviation: "P.te" },
              { name: "Portico", abbreviation: "P.co" },
              { name: "Rampa", abbreviation: "Rampa" },
              { name: "Regione", abbreviation: "Reg." },
              { name: "Rione", abbreviation: "R.ne" },
              { name: "Rio", abbreviation: "Rio" },
              { name: "Ripa", abbreviation: "Ripa" },
              { name: "Riva", abbreviation: "Riva" },
              { name: "Rond\xF2", abbreviation: "Rond\xF2" },
              { name: "Rotonda", abbreviation: "Rot." },
              { name: "Sagrato", abbreviation: "Sagr." },
              { name: "Salita", abbreviation: "Sal." },
              { name: "Scalinata", abbreviation: "Scal." },
              { name: "Scalone", abbreviation: "Scal." },
              { name: "Slargo", abbreviation: "Sl." },
              { name: "Sottoportico", abbreviation: "Sott." },
              { name: "Strada", abbreviation: "Str." },
              { name: "Stradale", abbreviation: "Str.le" },
              { name: "Strettoia", abbreviation: "Strett." },
              { name: "Traversa", abbreviation: "Trav." },
              { name: "Via", abbreviation: "V." },
              { name: "Viale", abbreviation: "V.le" },
              { name: "Vicinale", abbreviation: "Vic.le" },
              { name: "Vicolo", abbreviation: "Vic." }
            ],
            "uk": [
              { name: "Avenue", abbreviation: "Ave" },
              { name: "Close", abbreviation: "Cl" },
              { name: "Court", abbreviation: "Ct" },
              { name: "Crescent", abbreviation: "Cr" },
              { name: "Drive", abbreviation: "Dr" },
              { name: "Garden", abbreviation: "Gdn" },
              { name: "Gardens", abbreviation: "Gdns" },
              { name: "Green", abbreviation: "Gn" },
              { name: "Grove", abbreviation: "Gr" },
              { name: "Lane", abbreviation: "Ln" },
              { name: "Mount", abbreviation: "Mt" },
              { name: "Place", abbreviation: "Pl" },
              { name: "Park", abbreviation: "Pk" },
              { name: "Ridge", abbreviation: "Rdg" },
              { name: "Road", abbreviation: "Rd" },
              { name: "Square", abbreviation: "Sq" },
              { name: "Street", abbreviation: "St" },
              { name: "Terrace", abbreviation: "Ter" },
              { name: "Valley", abbreviation: "Val" }
            ]
          },
          months: [
            { name: "January", short_name: "Jan", numeric: "01", days: 31 },
            { name: "February", short_name: "Feb", numeric: "02", days: 28 },
            { name: "March", short_name: "Mar", numeric: "03", days: 31 },
            { name: "April", short_name: "Apr", numeric: "04", days: 30 },
            { name: "May", short_name: "May", numeric: "05", days: 31 },
            { name: "June", short_name: "Jun", numeric: "06", days: 30 },
            { name: "July", short_name: "Jul", numeric: "07", days: 31 },
            { name: "August", short_name: "Aug", numeric: "08", days: 31 },
            { name: "September", short_name: "Sep", numeric: "09", days: 30 },
            { name: "October", short_name: "Oct", numeric: "10", days: 31 },
            { name: "November", short_name: "Nov", numeric: "11", days: 30 },
            { name: "December", short_name: "Dec", numeric: "12", days: 31 }
          ],
          cc_types: [
            { name: "American Express", short_name: "amex", prefix: "34", length: 15 },
            { name: "Bankcard", short_name: "bankcard", prefix: "5610", length: 16 },
            { name: "China UnionPay", short_name: "chinaunion", prefix: "62", length: 16 },
            { name: "Diners Club Carte Blanche", short_name: "dccarte", prefix: "300", length: 14 },
            { name: "Diners Club enRoute", short_name: "dcenroute", prefix: "2014", length: 15 },
            { name: "Diners Club International", short_name: "dcintl", prefix: "36", length: 14 },
            { name: "Diners Club United States & Canada", short_name: "dcusc", prefix: "54", length: 16 },
            { name: "Discover Card", short_name: "discover", prefix: "6011", length: 16 },
            { name: "InstaPayment", short_name: "instapay", prefix: "637", length: 16 },
            { name: "JCB", short_name: "jcb", prefix: "3528", length: 16 },
            { name: "Laser", short_name: "laser", prefix: "6304", length: 16 },
            { name: "Maestro", short_name: "maestro", prefix: "5018", length: 16 },
            { name: "Mastercard", short_name: "mc", prefix: "51", length: 16 },
            { name: "Solo", short_name: "solo", prefix: "6334", length: 16 },
            { name: "Switch", short_name: "switch", prefix: "4903", length: 16 },
            { name: "Visa", short_name: "visa", prefix: "4", length: 16 },
            { name: "Visa Electron", short_name: "electron", prefix: "4026", length: 16 }
          ],
          currency_types: [
            { "code": "AED", "name": "United Arab Emirates Dirham" },
            { "code": "AFN", "name": "Afghanistan Afghani" },
            { "code": "ALL", "name": "Albania Lek" },
            { "code": "AMD", "name": "Armenia Dram" },
            { "code": "ANG", "name": "Netherlands Antilles Guilder" },
            { "code": "AOA", "name": "Angola Kwanza" },
            { "code": "ARS", "name": "Argentina Peso" },
            { "code": "AUD", "name": "Australia Dollar" },
            { "code": "AWG", "name": "Aruba Guilder" },
            { "code": "AZN", "name": "Azerbaijan New Manat" },
            { "code": "BAM", "name": "Bosnia and Herzegovina Convertible Marka" },
            { "code": "BBD", "name": "Barbados Dollar" },
            { "code": "BDT", "name": "Bangladesh Taka" },
            { "code": "BGN", "name": "Bulgaria Lev" },
            { "code": "BHD", "name": "Bahrain Dinar" },
            { "code": "BIF", "name": "Burundi Franc" },
            { "code": "BMD", "name": "Bermuda Dollar" },
            { "code": "BND", "name": "Brunei Darussalam Dollar" },
            { "code": "BOB", "name": "Bolivia Boliviano" },
            { "code": "BRL", "name": "Brazil Real" },
            { "code": "BSD", "name": "Bahamas Dollar" },
            { "code": "BTN", "name": "Bhutan Ngultrum" },
            { "code": "BWP", "name": "Botswana Pula" },
            { "code": "BYR", "name": "Belarus Ruble" },
            { "code": "BZD", "name": "Belize Dollar" },
            { "code": "CAD", "name": "Canada Dollar" },
            { "code": "CDF", "name": "Congo/Kinshasa Franc" },
            { "code": "CHF", "name": "Switzerland Franc" },
            { "code": "CLP", "name": "Chile Peso" },
            { "code": "CNY", "name": "China Yuan Renminbi" },
            { "code": "COP", "name": "Colombia Peso" },
            { "code": "CRC", "name": "Costa Rica Colon" },
            { "code": "CUC", "name": "Cuba Convertible Peso" },
            { "code": "CUP", "name": "Cuba Peso" },
            { "code": "CVE", "name": "Cape Verde Escudo" },
            { "code": "CZK", "name": "Czech Republic Koruna" },
            { "code": "DJF", "name": "Djibouti Franc" },
            { "code": "DKK", "name": "Denmark Krone" },
            { "code": "DOP", "name": "Dominican Republic Peso" },
            { "code": "DZD", "name": "Algeria Dinar" },
            { "code": "EGP", "name": "Egypt Pound" },
            { "code": "ERN", "name": "Eritrea Nakfa" },
            { "code": "ETB", "name": "Ethiopia Birr" },
            { "code": "EUR", "name": "Euro Member Countries" },
            { "code": "FJD", "name": "Fiji Dollar" },
            { "code": "FKP", "name": "Falkland Islands (Malvinas) Pound" },
            { "code": "GBP", "name": "United Kingdom Pound" },
            { "code": "GEL", "name": "Georgia Lari" },
            { "code": "GGP", "name": "Guernsey Pound" },
            { "code": "GHS", "name": "Ghana Cedi" },
            { "code": "GIP", "name": "Gibraltar Pound" },
            { "code": "GMD", "name": "Gambia Dalasi" },
            { "code": "GNF", "name": "Guinea Franc" },
            { "code": "GTQ", "name": "Guatemala Quetzal" },
            { "code": "GYD", "name": "Guyana Dollar" },
            { "code": "HKD", "name": "Hong Kong Dollar" },
            { "code": "HNL", "name": "Honduras Lempira" },
            { "code": "HRK", "name": "Croatia Kuna" },
            { "code": "HTG", "name": "Haiti Gourde" },
            { "code": "HUF", "name": "Hungary Forint" },
            { "code": "IDR", "name": "Indonesia Rupiah" },
            { "code": "ILS", "name": "Israel Shekel" },
            { "code": "IMP", "name": "Isle of Man Pound" },
            { "code": "INR", "name": "India Rupee" },
            { "code": "IQD", "name": "Iraq Dinar" },
            { "code": "IRR", "name": "Iran Rial" },
            { "code": "ISK", "name": "Iceland Krona" },
            { "code": "JEP", "name": "Jersey Pound" },
            { "code": "JMD", "name": "Jamaica Dollar" },
            { "code": "JOD", "name": "Jordan Dinar" },
            { "code": "JPY", "name": "Japan Yen" },
            { "code": "KES", "name": "Kenya Shilling" },
            { "code": "KGS", "name": "Kyrgyzstan Som" },
            { "code": "KHR", "name": "Cambodia Riel" },
            { "code": "KMF", "name": "Comoros Franc" },
            { "code": "KPW", "name": "Korea (North) Won" },
            { "code": "KRW", "name": "Korea (South) Won" },
            { "code": "KWD", "name": "Kuwait Dinar" },
            { "code": "KYD", "name": "Cayman Islands Dollar" },
            { "code": "KZT", "name": "Kazakhstan Tenge" },
            { "code": "LAK", "name": "Laos Kip" },
            { "code": "LBP", "name": "Lebanon Pound" },
            { "code": "LKR", "name": "Sri Lanka Rupee" },
            { "code": "LRD", "name": "Liberia Dollar" },
            { "code": "LSL", "name": "Lesotho Loti" },
            { "code": "LTL", "name": "Lithuania Litas" },
            { "code": "LYD", "name": "Libya Dinar" },
            { "code": "MAD", "name": "Morocco Dirham" },
            { "code": "MDL", "name": "Moldova Leu" },
            { "code": "MGA", "name": "Madagascar Ariary" },
            { "code": "MKD", "name": "Macedonia Denar" },
            { "code": "MMK", "name": "Myanmar (Burma) Kyat" },
            { "code": "MNT", "name": "Mongolia Tughrik" },
            { "code": "MOP", "name": "Macau Pataca" },
            { "code": "MRO", "name": "Mauritania Ouguiya" },
            { "code": "MUR", "name": "Mauritius Rupee" },
            { "code": "MVR", "name": "Maldives (Maldive Islands) Rufiyaa" },
            { "code": "MWK", "name": "Malawi Kwacha" },
            { "code": "MXN", "name": "Mexico Peso" },
            { "code": "MYR", "name": "Malaysia Ringgit" },
            { "code": "MZN", "name": "Mozambique Metical" },
            { "code": "NAD", "name": "Namibia Dollar" },
            { "code": "NGN", "name": "Nigeria Naira" },
            { "code": "NIO", "name": "Nicaragua Cordoba" },
            { "code": "NOK", "name": "Norway Krone" },
            { "code": "NPR", "name": "Nepal Rupee" },
            { "code": "NZD", "name": "New Zealand Dollar" },
            { "code": "OMR", "name": "Oman Rial" },
            { "code": "PAB", "name": "Panama Balboa" },
            { "code": "PEN", "name": "Peru Nuevo Sol" },
            { "code": "PGK", "name": "Papua New Guinea Kina" },
            { "code": "PHP", "name": "Philippines Peso" },
            { "code": "PKR", "name": "Pakistan Rupee" },
            { "code": "PLN", "name": "Poland Zloty" },
            { "code": "PYG", "name": "Paraguay Guarani" },
            { "code": "QAR", "name": "Qatar Riyal" },
            { "code": "RON", "name": "Romania New Leu" },
            { "code": "RSD", "name": "Serbia Dinar" },
            { "code": "RUB", "name": "Russia Ruble" },
            { "code": "RWF", "name": "Rwanda Franc" },
            { "code": "SAR", "name": "Saudi Arabia Riyal" },
            { "code": "SBD", "name": "Solomon Islands Dollar" },
            { "code": "SCR", "name": "Seychelles Rupee" },
            { "code": "SDG", "name": "Sudan Pound" },
            { "code": "SEK", "name": "Sweden Krona" },
            { "code": "SGD", "name": "Singapore Dollar" },
            { "code": "SHP", "name": "Saint Helena Pound" },
            { "code": "SLL", "name": "Sierra Leone Leone" },
            { "code": "SOS", "name": "Somalia Shilling" },
            { "code": "SPL", "name": "Seborga Luigino" },
            { "code": "SRD", "name": "Suriname Dollar" },
            { "code": "STD", "name": "S\xE3o Tom\xE9 and Pr\xEDncipe Dobra" },
            { "code": "SVC", "name": "El Salvador Colon" },
            { "code": "SYP", "name": "Syria Pound" },
            { "code": "SZL", "name": "Swaziland Lilangeni" },
            { "code": "THB", "name": "Thailand Baht" },
            { "code": "TJS", "name": "Tajikistan Somoni" },
            { "code": "TMT", "name": "Turkmenistan Manat" },
            { "code": "TND", "name": "Tunisia Dinar" },
            { "code": "TOP", "name": "Tonga Pa'anga" },
            { "code": "TRY", "name": "Turkey Lira" },
            { "code": "TTD", "name": "Trinidad and Tobago Dollar" },
            { "code": "TVD", "name": "Tuvalu Dollar" },
            { "code": "TWD", "name": "Taiwan New Dollar" },
            { "code": "TZS", "name": "Tanzania Shilling" },
            { "code": "UAH", "name": "Ukraine Hryvnia" },
            { "code": "UGX", "name": "Uganda Shilling" },
            { "code": "USD", "name": "United States Dollar" },
            { "code": "UYU", "name": "Uruguay Peso" },
            { "code": "UZS", "name": "Uzbekistan Som" },
            { "code": "VEF", "name": "Venezuela Bolivar" },
            { "code": "VND", "name": "Viet Nam Dong" },
            { "code": "VUV", "name": "Vanuatu Vatu" },
            { "code": "WST", "name": "Samoa Tala" },
            { "code": "XAF", "name": "Communaut\xE9 Financi\xE8re Africaine (BEAC) CFA Franc BEAC" },
            { "code": "XCD", "name": "East Caribbean Dollar" },
            { "code": "XDR", "name": "International Monetary Fund (IMF) Special Drawing Rights" },
            { "code": "XOF", "name": "Communaut\xE9 Financi\xE8re Africaine (BCEAO) Franc" },
            { "code": "XPF", "name": "Comptoirs Fran\xE7ais du Pacifique (CFP) Franc" },
            { "code": "YER", "name": "Yemen Rial" },
            { "code": "ZAR", "name": "South Africa Rand" },
            { "code": "ZMW", "name": "Zambia Kwacha" },
            { "code": "ZWD", "name": "Zimbabwe Dollar" }
          ],
          colorNames: [
            "AliceBlue",
            "Black",
            "Navy",
            "DarkBlue",
            "MediumBlue",
            "Blue",
            "DarkGreen",
            "Green",
            "Teal",
            "DarkCyan",
            "DeepSkyBlue",
            "DarkTurquoise",
            "MediumSpringGreen",
            "Lime",
            "SpringGreen",
            "Aqua",
            "Cyan",
            "MidnightBlue",
            "DodgerBlue",
            "LightSeaGreen",
            "ForestGreen",
            "SeaGreen",
            "DarkSlateGray",
            "LimeGreen",
            "MediumSeaGreen",
            "Turquoise",
            "RoyalBlue",
            "SteelBlue",
            "DarkSlateBlue",
            "MediumTurquoise",
            "Indigo",
            "DarkOliveGreen",
            "CadetBlue",
            "CornflowerBlue",
            "RebeccaPurple",
            "MediumAquaMarine",
            "DimGray",
            "SlateBlue",
            "OliveDrab",
            "SlateGray",
            "LightSlateGray",
            "MediumSlateBlue",
            "LawnGreen",
            "Chartreuse",
            "Aquamarine",
            "Maroon",
            "Purple",
            "Olive",
            "Gray",
            "SkyBlue",
            "LightSkyBlue",
            "BlueViolet",
            "DarkRed",
            "DarkMagenta",
            "SaddleBrown",
            "Ivory",
            "White",
            "DarkSeaGreen",
            "LightGreen",
            "MediumPurple",
            "DarkViolet",
            "PaleGreen",
            "DarkOrchid",
            "YellowGreen",
            "Sienna",
            "Brown",
            "DarkGray",
            "LightBlue",
            "GreenYellow",
            "PaleTurquoise",
            "LightSteelBlue",
            "PowderBlue",
            "FireBrick",
            "DarkGoldenRod",
            "MediumOrchid",
            "RosyBrown",
            "DarkKhaki",
            "Silver",
            "MediumVioletRed",
            "IndianRed",
            "Peru",
            "Chocolate",
            "Tan",
            "LightGray",
            "Thistle",
            "Orchid",
            "GoldenRod",
            "PaleVioletRed",
            "Crimson",
            "Gainsboro",
            "Plum",
            "BurlyWood",
            "LightCyan",
            "Lavender",
            "DarkSalmon",
            "Violet",
            "PaleGoldenRod",
            "LightCoral",
            "Khaki",
            "AliceBlue",
            "HoneyDew",
            "Azure",
            "SandyBrown",
            "Wheat",
            "Beige",
            "WhiteSmoke",
            "MintCream",
            "GhostWhite",
            "Salmon",
            "AntiqueWhite",
            "Linen",
            "LightGoldenRodYellow",
            "OldLace",
            "Red",
            "Fuchsia",
            "Magenta",
            "DeepPink",
            "OrangeRed",
            "Tomato",
            "HotPink",
            "Coral",
            "DarkOrange",
            "LightSalmon",
            "Orange",
            "LightPink",
            "Pink",
            "Gold",
            "PeachPuff",
            "NavajoWhite",
            "Moccasin",
            "Bisque",
            "MistyRose",
            "BlanchedAlmond",
            "PapayaWhip",
            "LavenderBlush",
            "SeaShell",
            "Cornsilk",
            "LemonChiffon",
            "FloralWhite",
            "Snow",
            "Yellow",
            "LightYellow"
          ],
          company: [
            "3Com Corp",
            "3M Company",
            "A.G. Edwards Inc.",
            "Abbott Laboratories",
            "Abercrombie & Fitch Co.",
            "ABM Industries Incorporated",
            "Ace Hardware Corporation",
            "ACT Manufacturing Inc.",
            "Acterna Corp.",
            "Adams Resources & Energy, Inc.",
            "ADC Telecommunications, Inc.",
            "Adelphia Communications Corporation",
            "Administaff, Inc.",
            "Adobe Systems Incorporated",
            "Adolph Coors Company",
            "Advance Auto Parts, Inc.",
            "Advanced Micro Devices, Inc.",
            "AdvancePCS, Inc.",
            "Advantica Restaurant Group, Inc.",
            "The AES Corporation",
            "Aetna Inc.",
            "Affiliated Computer Services, Inc.",
            "AFLAC Incorporated",
            "AGCO Corporation",
            "Agilent Technologies, Inc.",
            "Agway Inc.",
            "Apartment Investment and Management Company",
            "Air Products and Chemicals, Inc.",
            "Airborne, Inc.",
            "Airgas, Inc.",
            "AK Steel Holding Corporation",
            "Alaska Air Group, Inc.",
            "Alberto-Culver Company",
            "Albertson's, Inc.",
            "Alcoa Inc.",
            "Alleghany Corporation",
            "Allegheny Energy, Inc.",
            "Allegheny Technologies Incorporated",
            "Allergan, Inc.",
            "ALLETE, Inc.",
            "Alliant Energy Corporation",
            "Allied Waste Industries, Inc.",
            "Allmerica Financial Corporation",
            "The Allstate Corporation",
            "ALLTEL Corporation",
            "The Alpine Group, Inc.",
            "Amazon.com, Inc.",
            "AMC Entertainment Inc.",
            "American Power Conversion Corporation",
            "Amerada Hess Corporation",
            "AMERCO",
            "Ameren Corporation",
            "America West Holdings Corporation",
            "American Axle & Manufacturing Holdings, Inc.",
            "American Eagle Outfitters, Inc.",
            "American Electric Power Company, Inc.",
            "American Express Company",
            "American Financial Group, Inc.",
            "American Greetings Corporation",
            "American International Group, Inc.",
            "American Standard Companies Inc.",
            "American Water Works Company, Inc.",
            "AmerisourceBergen Corporation",
            "Ames Department Stores, Inc.",
            "Amgen Inc.",
            "Amkor Technology, Inc.",
            "AMR Corporation",
            "AmSouth Bancorp.",
            "Amtran, Inc.",
            "Anadarko Petroleum Corporation",
            "Analog Devices, Inc.",
            "Anheuser-Busch Companies, Inc.",
            "Anixter International Inc.",
            "AnnTaylor Inc.",
            "Anthem, Inc.",
            "AOL Time Warner Inc.",
            "Aon Corporation",
            "Apache Corporation",
            "Apple Computer, Inc.",
            "Applera Corporation",
            "Applied Industrial Technologies, Inc.",
            "Applied Materials, Inc.",
            "Aquila, Inc.",
            "ARAMARK Corporation",
            "Arch Coal, Inc.",
            "Archer Daniels Midland Company",
            "Arkansas Best Corporation",
            "Armstrong Holdings, Inc.",
            "Arrow Electronics, Inc.",
            "ArvinMeritor, Inc.",
            "Ashland Inc.",
            "Astoria Financial Corporation",
            "AT&T Corp.",
            "Atmel Corporation",
            "Atmos Energy Corporation",
            "Audiovox Corporation",
            "Autoliv, Inc.",
            "Automatic Data Processing, Inc.",
            "AutoNation, Inc.",
            "AutoZone, Inc.",
            "Avaya Inc.",
            "Avery Dennison Corporation",
            "Avista Corporation",
            "Avnet, Inc.",
            "Avon Products, Inc.",
            "Baker Hughes Incorporated",
            "Ball Corporation",
            "Bank of America Corporation",
            "The Bank of New York Company, Inc.",
            "Bank One Corporation",
            "Banknorth Group, Inc.",
            "Banta Corporation",
            "Barnes & Noble, Inc.",
            "Bausch & Lomb Incorporated",
            "Baxter International Inc.",
            "BB&T Corporation",
            "The Bear Stearns Companies Inc.",
            "Beazer Homes USA, Inc.",
            "Beckman Coulter, Inc.",
            "Becton, Dickinson and Company",
            "Bed Bath & Beyond Inc.",
            "Belk, Inc.",
            "Bell Microproducts Inc.",
            "BellSouth Corporation",
            "Belo Corp.",
            "Bemis Company, Inc.",
            "Benchmark Electronics, Inc.",
            "Berkshire Hathaway Inc.",
            "Best Buy Co., Inc.",
            "Bethlehem Steel Corporation",
            "Beverly Enterprises, Inc.",
            "Big Lots, Inc.",
            "BJ Services Company",
            "BJ's Wholesale Club, Inc.",
            "The Black & Decker Corporation",
            "Black Hills Corporation",
            "BMC Software, Inc.",
            "The Boeing Company",
            "Boise Cascade Corporation",
            "Borders Group, Inc.",
            "BorgWarner Inc.",
            "Boston Scientific Corporation",
            "Bowater Incorporated",
            "Briggs & Stratton Corporation",
            "Brightpoint, Inc.",
            "Brinker International, Inc.",
            "Bristol-Myers Squibb Company",
            "Broadwing, Inc.",
            "Brown Shoe Company, Inc.",
            "Brown-Forman Corporation",
            "Brunswick Corporation",
            "Budget Group, Inc.",
            "Burlington Coat Factory Warehouse Corporation",
            "Burlington Industries, Inc.",
            "Burlington Northern Santa Fe Corporation",
            "Burlington Resources Inc.",
            "C. H. Robinson Worldwide Inc.",
            "Cablevision Systems Corp",
            "Cabot Corp",
            "Cadence Design Systems, Inc.",
            "Calpine Corp.",
            "Campbell Soup Co.",
            "Capital One Financial Corp.",
            "Cardinal Health Inc.",
            "Caremark Rx Inc.",
            "Carlisle Cos. Inc.",
            "Carpenter Technology Corp.",
            "Casey's General Stores Inc.",
            "Caterpillar Inc.",
            "CBRL Group Inc.",
            "CDI Corp.",
            "CDW Computer Centers Inc.",
            "CellStar Corp.",
            "Cendant Corp",
            "Cenex Harvest States Cooperatives",
            "Centex Corp.",
            "CenturyTel Inc.",
            "Ceridian Corp.",
            "CH2M Hill Cos. Ltd.",
            "Champion Enterprises Inc.",
            "Charles Schwab Corp.",
            "Charming Shoppes Inc.",
            "Charter Communications Inc.",
            "Charter One Financial Inc.",
            "ChevronTexaco Corp.",
            "Chiquita Brands International Inc.",
            "Chubb Corp",
            "Ciena Corp.",
            "Cigna Corp",
            "Cincinnati Financial Corp.",
            "Cinergy Corp.",
            "Cintas Corp.",
            "Circuit City Stores Inc.",
            "Cisco Systems Inc.",
            "Citigroup, Inc",
            "Citizens Communications Co.",
            "CKE Restaurants Inc.",
            "Clear Channel Communications Inc.",
            "The Clorox Co.",
            "CMGI Inc.",
            "CMS Energy Corp.",
            "CNF Inc.",
            "Coca-Cola Co.",
            "Coca-Cola Enterprises Inc.",
            "Colgate-Palmolive Co.",
            "Collins & Aikman Corp.",
            "Comcast Corp.",
            "Comdisco Inc.",
            "Comerica Inc.",
            "Comfort Systems USA Inc.",
            "Commercial Metals Co.",
            "Community Health Systems Inc.",
            "Compass Bancshares Inc",
            "Computer Associates International Inc.",
            "Computer Sciences Corp.",
            "Compuware Corp.",
            "Comverse Technology Inc.",
            "ConAgra Foods Inc.",
            "Concord EFS Inc.",
            "Conectiv, Inc",
            "Conoco Inc",
            "Conseco Inc.",
            "Consolidated Freightways Corp.",
            "Consolidated Edison Inc.",
            "Constellation Brands Inc.",
            "Constellation Emergy Group Inc.",
            "Continental Airlines Inc.",
            "Convergys Corp.",
            "Cooper Cameron Corp.",
            "Cooper Industries Ltd.",
            "Cooper Tire & Rubber Co.",
            "Corn Products International Inc.",
            "Corning Inc.",
            "Costco Wholesale Corp.",
            "Countrywide Credit Industries Inc.",
            "Coventry Health Care Inc.",
            "Cox Communications Inc.",
            "Crane Co.",
            "Crompton Corp.",
            "Crown Cork & Seal Co. Inc.",
            "CSK Auto Corp.",
            "CSX Corp.",
            "Cummins Inc.",
            "CVS Corp.",
            "Cytec Industries Inc.",
            "D&K Healthcare Resources, Inc.",
            "D.R. Horton Inc.",
            "Dana Corporation",
            "Danaher Corporation",
            "Darden Restaurants Inc.",
            "DaVita Inc.",
            "Dean Foods Company",
            "Deere & Company",
            "Del Monte Foods Co",
            "Dell Computer Corporation",
            "Delphi Corp.",
            "Delta Air Lines Inc.",
            "Deluxe Corporation",
            "Devon Energy Corporation",
            "Di Giorgio Corporation",
            "Dial Corporation",
            "Diebold Incorporated",
            "Dillard's Inc.",
            "DIMON Incorporated",
            "Dole Food Company, Inc.",
            "Dollar General Corporation",
            "Dollar Tree Stores, Inc.",
            "Dominion Resources, Inc.",
            "Domino's Pizza LLC",
            "Dover Corporation, Inc.",
            "Dow Chemical Company",
            "Dow Jones & Company, Inc.",
            "DPL Inc.",
            "DQE Inc.",
            "Dreyer's Grand Ice Cream, Inc.",
            "DST Systems, Inc.",
            "DTE Energy Co.",
            "E.I. Du Pont de Nemours and Company",
            "Duke Energy Corp",
            "Dun & Bradstreet Inc.",
            "DURA Automotive Systems Inc.",
            "DynCorp",
            "Dynegy Inc.",
            "E*Trade Group, Inc.",
            "E.W. Scripps Company",
            "Earthlink, Inc.",
            "Eastman Chemical Company",
            "Eastman Kodak Company",
            "Eaton Corporation",
            "Echostar Communications Corporation",
            "Ecolab Inc.",
            "Edison International",
            "EGL Inc.",
            "El Paso Corporation",
            "Electronic Arts Inc.",
            "Electronic Data Systems Corp.",
            "Eli Lilly and Company",
            "EMC Corporation",
            "Emcor Group Inc.",
            "Emerson Electric Co.",
            "Encompass Services Corporation",
            "Energizer Holdings Inc.",
            "Energy East Corporation",
            "Engelhard Corporation",
            "Enron Corp.",
            "Entergy Corporation",
            "Enterprise Products Partners L.P.",
            "EOG Resources, Inc.",
            "Equifax Inc.",
            "Equitable Resources Inc.",
            "Equity Office Properties Trust",
            "Equity Residential Properties Trust",
            "Estee Lauder Companies Inc.",
            "Exelon Corporation",
            "Exide Technologies",
            "Expeditors International of Washington Inc.",
            "Express Scripts Inc.",
            "ExxonMobil Corporation",
            "Fairchild Semiconductor International Inc.",
            "Family Dollar Stores Inc.",
            "Farmland Industries Inc.",
            "Federal Mogul Corp.",
            "Federated Department Stores Inc.",
            "Federal Express Corp.",
            "Felcor Lodging Trust Inc.",
            "Ferro Corp.",
            "Fidelity National Financial Inc.",
            "Fifth Third Bancorp",
            "First American Financial Corp.",
            "First Data Corp.",
            "First National of Nebraska Inc.",
            "First Tennessee National Corp.",
            "FirstEnergy Corp.",
            "Fiserv Inc.",
            "Fisher Scientific International Inc.",
            "FleetBoston Financial Co.",
            "Fleetwood Enterprises Inc.",
            "Fleming Companies Inc.",
            "Flowers Foods Inc.",
            "Flowserv Corp",
            "Fluor Corp",
            "FMC Corp",
            "Foamex International Inc",
            "Foot Locker Inc",
            "Footstar Inc.",
            "Ford Motor Co",
            "Forest Laboratories Inc.",
            "Fortune Brands Inc.",
            "Foster Wheeler Ltd.",
            "FPL Group Inc.",
            "Franklin Resources Inc.",
            "Freeport McMoran Copper & Gold Inc.",
            "Frontier Oil Corp",
            "Furniture Brands International Inc.",
            "Gannett Co., Inc.",
            "Gap Inc.",
            "Gateway Inc.",
            "GATX Corporation",
            "Gemstar-TV Guide International Inc.",
            "GenCorp Inc.",
            "General Cable Corporation",
            "General Dynamics Corporation",
            "General Electric Company",
            "General Mills Inc",
            "General Motors Corporation",
            "Genesis Health Ventures Inc.",
            "Gentek Inc.",
            "Gentiva Health Services Inc.",
            "Genuine Parts Company",
            "Genuity Inc.",
            "Genzyme Corporation",
            "Georgia Gulf Corporation",
            "Georgia-Pacific Corporation",
            "Gillette Company",
            "Gold Kist Inc.",
            "Golden State Bancorp Inc.",
            "Golden West Financial Corporation",
            "Goldman Sachs Group Inc.",
            "Goodrich Corporation",
            "The Goodyear Tire & Rubber Company",
            "Granite Construction Incorporated",
            "Graybar Electric Company Inc.",
            "Great Lakes Chemical Corporation",
            "Great Plains Energy Inc.",
            "GreenPoint Financial Corp.",
            "Greif Bros. Corporation",
            "Grey Global Group Inc.",
            "Group 1 Automotive Inc.",
            "Guidant Corporation",
            "H&R Block Inc.",
            "H.B. Fuller Company",
            "H.J. Heinz Company",
            "Halliburton Co.",
            "Harley-Davidson Inc.",
            "Harman International Industries Inc.",
            "Harrah's Entertainment Inc.",
            "Harris Corp.",
            "Harsco Corp.",
            "Hartford Financial Services Group Inc.",
            "Hasbro Inc.",
            "Hawaiian Electric Industries Inc.",
            "HCA Inc.",
            "Health Management Associates Inc.",
            "Health Net Inc.",
            "Healthsouth Corp",
            "Henry Schein Inc.",
            "Hercules Inc.",
            "Herman Miller Inc.",
            "Hershey Foods Corp.",
            "Hewlett-Packard Company",
            "Hibernia Corp.",
            "Hillenbrand Industries Inc.",
            "Hilton Hotels Corp.",
            "Hollywood Entertainment Corp.",
            "Home Depot Inc.",
            "Hon Industries Inc.",
            "Honeywell International Inc.",
            "Hormel Foods Corp.",
            "Host Marriott Corp.",
            "Household International Corp.",
            "Hovnanian Enterprises Inc.",
            "Hub Group Inc.",
            "Hubbell Inc.",
            "Hughes Supply Inc.",
            "Humana Inc.",
            "Huntington Bancshares Inc.",
            "Idacorp Inc.",
            "IDT Corporation",
            "IKON Office Solutions Inc.",
            "Illinois Tool Works Inc.",
            "IMC Global Inc.",
            "Imperial Sugar Company",
            "IMS Health Inc.",
            "Ingles Market Inc",
            "Ingram Micro Inc.",
            "Insight Enterprises Inc.",
            "Integrated Electrical Services Inc.",
            "Intel Corporation",
            "International Paper Co.",
            "Interpublic Group of Companies Inc.",
            "Interstate Bakeries Corporation",
            "International Business Machines Corp.",
            "International Flavors & Fragrances Inc.",
            "International Multifoods Corporation",
            "Intuit Inc.",
            "IT Group Inc.",
            "ITT Industries Inc.",
            "Ivax Corp.",
            "J.B. Hunt Transport Services Inc.",
            "J.C. Penny Co.",
            "J.P. Morgan Chase & Co.",
            "Jabil Circuit Inc.",
            "Jack In The Box Inc.",
            "Jacobs Engineering Group Inc.",
            "JDS Uniphase Corp.",
            "Jefferson-Pilot Co.",
            "John Hancock Financial Services Inc.",
            "Johnson & Johnson",
            "Johnson Controls Inc.",
            "Jones Apparel Group Inc.",
            "KB Home",
            "Kellogg Company",
            "Kellwood Company",
            "Kelly Services Inc.",
            "Kemet Corp.",
            "Kennametal Inc.",
            "Kerr-McGee Corporation",
            "KeyCorp",
            "KeySpan Corp.",
            "Kimball International Inc.",
            "Kimberly-Clark Corporation",
            "Kindred Healthcare Inc.",
            "KLA-Tencor Corporation",
            "K-Mart Corp.",
            "Knight-Ridder Inc.",
            "Kohl's Corp.",
            "KPMG Consulting Inc.",
            "Kroger Co.",
            "L-3 Communications Holdings Inc.",
            "Laboratory Corporation of America Holdings",
            "Lam Research Corporation",
            "LandAmerica Financial Group Inc.",
            "Lands' End Inc.",
            "Landstar System Inc.",
            "La-Z-Boy Inc.",
            "Lear Corporation",
            "Legg Mason Inc.",
            "Leggett & Platt Inc.",
            "Lehman Brothers Holdings Inc.",
            "Lennar Corporation",
            "Lennox International Inc.",
            "Level 3 Communications Inc.",
            "Levi Strauss & Co.",
            "Lexmark International Inc.",
            "Limited Inc.",
            "Lincoln National Corporation",
            "Linens 'n Things Inc.",
            "Lithia Motors Inc.",
            "Liz Claiborne Inc.",
            "Lockheed Martin Corporation",
            "Loews Corporation",
            "Longs Drug Stores Corporation",
            "Louisiana-Pacific Corporation",
            "Lowe's Companies Inc.",
            "LSI Logic Corporation",
            "The LTV Corporation",
            "The Lubrizol Corporation",
            "Lucent Technologies Inc.",
            "Lyondell Chemical Company",
            "M & T Bank Corporation",
            "Magellan Health Services Inc.",
            "Mail-Well Inc.",
            "Mandalay Resort Group",
            "Manor Care Inc.",
            "Manpower Inc.",
            "Marathon Oil Corporation",
            "Mariner Health Care Inc.",
            "Markel Corporation",
            "Marriott International Inc.",
            "Marsh & McLennan Companies Inc.",
            "Marsh Supermarkets Inc.",
            "Marshall & Ilsley Corporation",
            "Martin Marietta Materials Inc.",
            "Masco Corporation",
            "Massey Energy Company",
            "MasTec Inc.",
            "Mattel Inc.",
            "Maxim Integrated Products Inc.",
            "Maxtor Corporation",
            "Maxxam Inc.",
            "The May Department Stores Company",
            "Maytag Corporation",
            "MBNA Corporation",
            "McCormick & Company Incorporated",
            "McDonald's Corporation",
            "The McGraw-Hill Companies Inc.",
            "McKesson Corporation",
            "McLeodUSA Incorporated",
            "M.D.C. Holdings Inc.",
            "MDU Resources Group Inc.",
            "MeadWestvaco Corporation",
            "Medtronic Inc.",
            "Mellon Financial Corporation",
            "The Men's Wearhouse Inc.",
            "Merck & Co., Inc.",
            "Mercury General Corporation",
            "Merrill Lynch & Co. Inc.",
            "Metaldyne Corporation",
            "Metals USA Inc.",
            "MetLife Inc.",
            "Metris Companies Inc",
            "MGIC Investment Corporation",
            "MGM Mirage",
            "Michaels Stores Inc.",
            "Micron Technology Inc.",
            "Microsoft Corporation",
            "Milacron Inc.",
            "Millennium Chemicals Inc.",
            "Mirant Corporation",
            "Mohawk Industries Inc.",
            "Molex Incorporated",
            "The MONY Group Inc.",
            "Morgan Stanley Dean Witter & Co.",
            "Motorola Inc.",
            "MPS Group Inc.",
            "Murphy Oil Corporation",
            "Nabors Industries Inc",
            "Nacco Industries Inc",
            "Nash Finch Company",
            "National City Corp.",
            "National Commerce Financial Corporation",
            "National Fuel Gas Company",
            "National Oilwell Inc",
            "National Rural Utilities Cooperative Finance Corporation",
            "National Semiconductor Corporation",
            "National Service Industries Inc",
            "Navistar International Corporation",
            "NCR Corporation",
            "The Neiman Marcus Group Inc.",
            "New Jersey Resources Corporation",
            "New York Times Company",
            "Newell Rubbermaid Inc",
            "Newmont Mining Corporation",
            "Nextel Communications Inc",
            "Nicor Inc",
            "Nike Inc",
            "NiSource Inc",
            "Noble Energy Inc",
            "Nordstrom Inc",
            "Norfolk Southern Corporation",
            "Nortek Inc",
            "North Fork Bancorporation Inc",
            "Northeast Utilities System",
            "Northern Trust Corporation",
            "Northrop Grumman Corporation",
            "NorthWestern Corporation",
            "Novellus Systems Inc",
            "NSTAR",
            "NTL Incorporated",
            "Nucor Corp",
            "Nvidia Corp",
            "NVR Inc",
            "Northwest Airlines Corp",
            "Occidental Petroleum Corp",
            "Ocean Energy Inc",
            "Office Depot Inc.",
            "OfficeMax Inc",
            "OGE Energy Corp",
            "Oglethorpe Power Corp.",
            "Ohio Casualty Corp.",
            "Old Republic International Corp.",
            "Olin Corp.",
            "OM Group Inc",
            "Omnicare Inc",
            "Omnicom Group",
            "On Semiconductor Corp",
            "ONEOK Inc",
            "Oracle Corp",
            "Oshkosh Truck Corp",
            "Outback Steakhouse Inc.",
            "Owens & Minor Inc.",
            "Owens Corning",
            "Owens-Illinois Inc",
            "Oxford Health Plans Inc",
            "Paccar Inc",
            "PacifiCare Health Systems Inc",
            "Packaging Corp. of America",
            "Pactiv Corp",
            "Pall Corp",
            "Pantry Inc",
            "Park Place Entertainment Corp",
            "Parker Hannifin Corp.",
            "Pathmark Stores Inc.",
            "Paychex Inc",
            "Payless Shoesource Inc",
            "Penn Traffic Co.",
            "Pennzoil-Quaker State Company",
            "Pentair Inc",
            "Peoples Energy Corp.",
            "PeopleSoft Inc",
            "Pep Boys Manny, Moe & Jack",
            "Potomac Electric Power Co.",
            "Pepsi Bottling Group Inc.",
            "PepsiAmericas Inc.",
            "PepsiCo Inc.",
            "Performance Food Group Co.",
            "Perini Corp",
            "PerkinElmer Inc",
            "Perot Systems Corp",
            "Petco Animal Supplies Inc.",
            "Peter Kiewit Sons', Inc.",
            "PETsMART Inc",
            "Pfizer Inc",
            "Pacific Gas & Electric Corp.",
            "Pharmacia Corp",
            "Phar Mor Inc.",
            "Phelps Dodge Corp.",
            "Philip Morris Companies Inc.",
            "Phillips Petroleum Co",
            "Phillips Van Heusen Corp.",
            "Phoenix Companies Inc",
            "Pier 1 Imports Inc.",
            "Pilgrim's Pride Corporation",
            "Pinnacle West Capital Corp",
            "Pioneer-Standard Electronics Inc.",
            "Pitney Bowes Inc.",
            "Pittston Brinks Group",
            "Plains All American Pipeline LP",
            "PNC Financial Services Group Inc.",
            "PNM Resources Inc",
            "Polaris Industries Inc.",
            "Polo Ralph Lauren Corp",
            "PolyOne Corp",
            "Popular Inc",
            "Potlatch Corp",
            "PPG Industries Inc",
            "PPL Corp",
            "Praxair Inc",
            "Precision Castparts Corp",
            "Premcor Inc.",
            "Pride International Inc",
            "Primedia Inc",
            "Principal Financial Group Inc.",
            "Procter & Gamble Co.",
            "Pro-Fac Cooperative Inc.",
            "Progress Energy Inc",
            "Progressive Corporation",
            "Protective Life Corp",
            "Provident Financial Group",
            "Providian Financial Corp.",
            "Prudential Financial Inc.",
            "PSS World Medical Inc",
            "Public Service Enterprise Group Inc.",
            "Publix Super Markets Inc.",
            "Puget Energy Inc.",
            "Pulte Homes Inc",
            "Qualcomm Inc",
            "Quanta Services Inc.",
            "Quantum Corp",
            "Quest Diagnostics Inc.",
            "Questar Corp",
            "Quintiles Transnational",
            "Qwest Communications Intl Inc",
            "R.J. Reynolds Tobacco Company",
            "R.R. Donnelley & Sons Company",
            "Radio Shack Corporation",
            "Raymond James Financial Inc.",
            "Raytheon Company",
            "Reader's Digest Association Inc.",
            "Reebok International Ltd.",
            "Regions Financial Corp.",
            "Regis Corporation",
            "Reliance Steel & Aluminum Co.",
            "Reliant Energy Inc.",
            "Rent A Center Inc",
            "Republic Services Inc",
            "Revlon Inc",
            "RGS Energy Group Inc",
            "Rite Aid Corp",
            "Riverwood Holding Inc.",
            "RoadwayCorp",
            "Robert Half International Inc.",
            "Rock-Tenn Co",
            "Rockwell Automation Inc",
            "Rockwell Collins Inc",
            "Rohm & Haas Co.",
            "Ross Stores Inc",
            "RPM Inc.",
            "Ruddick Corp",
            "Ryder System Inc",
            "Ryerson Tull Inc",
            "Ryland Group Inc.",
            "Sabre Holdings Corp",
            "Safeco Corp",
            "Safeguard Scientifics Inc.",
            "Safeway Inc",
            "Saks Inc",
            "Sanmina-SCI Inc",
            "Sara Lee Corp",
            "SBC Communications Inc",
            "Scana Corp.",
            "Schering-Plough Corp",
            "Scholastic Corp",
            "SCI Systems Onc.",
            "Science Applications Intl. Inc.",
            "Scientific-Atlanta Inc",
            "Scotts Company",
            "Seaboard Corp",
            "Sealed Air Corp",
            "Sears Roebuck & Co",
            "Sempra Energy",
            "Sequa Corp",
            "Service Corp. International",
            "ServiceMaster Co",
            "Shaw Group Inc",
            "Sherwin-Williams Company",
            "Shopko Stores Inc",
            "Siebel Systems Inc",
            "Sierra Health Services Inc",
            "Sierra Pacific Resources",
            "Silgan Holdings Inc.",
            "Silicon Graphics Inc",
            "Simon Property Group Inc",
            "SLM Corporation",
            "Smith International Inc",
            "Smithfield Foods Inc",
            "Smurfit-Stone Container Corp",
            "Snap-On Inc",
            "Solectron Corp",
            "Solutia Inc",
            "Sonic Automotive Inc.",
            "Sonoco Products Co.",
            "Southern Company",
            "Southern Union Company",
            "SouthTrust Corp.",
            "Southwest Airlines Co",
            "Southwest Gas Corp",
            "Sovereign Bancorp Inc.",
            "Spartan Stores Inc",
            "Spherion Corp",
            "Sports Authority Inc",
            "Sprint Corp.",
            "SPX Corp",
            "St. Jude Medical Inc",
            "St. Paul Cos.",
            "Staff Leasing Inc.",
            "StanCorp Financial Group Inc",
            "Standard Pacific Corp.",
            "Stanley Works",
            "Staples Inc",
            "Starbucks Corp",
            "Starwood Hotels & Resorts Worldwide Inc",
            "State Street Corp.",
            "Stater Bros. Holdings Inc.",
            "Steelcase Inc",
            "Stein Mart Inc",
            "Stewart & Stevenson Services Inc",
            "Stewart Information Services Corp",
            "Stilwell Financial Inc",
            "Storage Technology Corporation",
            "Stryker Corp",
            "Sun Healthcare Group Inc.",
            "Sun Microsystems Inc.",
            "SunGard Data Systems Inc.",
            "Sunoco Inc.",
            "SunTrust Banks Inc",
            "Supervalu Inc",
            "Swift Transportation, Co., Inc",
            "Symbol Technologies Inc",
            "Synovus Financial Corp.",
            "Sysco Corp",
            "Systemax Inc.",
            "Target Corp.",
            "Tech Data Corporation",
            "TECO Energy Inc",
            "Tecumseh Products Company",
            "Tektronix Inc",
            "Teleflex Incorporated",
            "Telephone & Data Systems Inc",
            "Tellabs Inc.",
            "Temple-Inland Inc",
            "Tenet Healthcare Corporation",
            "Tenneco Automotive Inc.",
            "Teradyne Inc",
            "Terex Corp",
            "Tesoro Petroleum Corp.",
            "Texas Industries Inc.",
            "Texas Instruments Incorporated",
            "Textron Inc",
            "Thermo Electron Corporation",
            "Thomas & Betts Corporation",
            "Tiffany & Co",
            "Timken Company",
            "TJX Companies Inc",
            "TMP Worldwide Inc",
            "Toll Brothers Inc",
            "Torchmark Corporation",
            "Toro Company",
            "Tower Automotive Inc.",
            "Toys 'R' Us Inc",
            "Trans World Entertainment Corp.",
            "TransMontaigne Inc",
            "Transocean Inc",
            "TravelCenters of America Inc.",
            "Triad Hospitals Inc",
            "Tribune Company",
            "Trigon Healthcare Inc.",
            "Trinity Industries Inc",
            "Trump Hotels & Casino Resorts Inc.",
            "TruServ Corporation",
            "TRW Inc",
            "TXU Corp",
            "Tyson Foods Inc",
            "U.S. Bancorp",
            "U.S. Industries Inc.",
            "UAL Corporation",
            "UGI Corporation",
            "Unified Western Grocers Inc",
            "Union Pacific Corporation",
            "Union Planters Corp",
            "Unisource Energy Corp",
            "Unisys Corporation",
            "United Auto Group Inc",
            "United Defense Industries Inc.",
            "United Parcel Service Inc",
            "United Rentals Inc",
            "United Stationers Inc",
            "United Technologies Corporation",
            "UnitedHealth Group Incorporated",
            "Unitrin Inc",
            "Universal Corporation",
            "Universal Forest Products Inc",
            "Universal Health Services Inc",
            "Unocal Corporation",
            "Unova Inc",
            "UnumProvident Corporation",
            "URS Corporation",
            "US Airways Group Inc",
            "US Oncology Inc",
            "USA Interactive",
            "USFreighways Corporation",
            "USG Corporation",
            "UST Inc",
            "Valero Energy Corporation",
            "Valspar Corporation",
            "Value City Department Stores Inc",
            "Varco International Inc",
            "Vectren Corporation",
            "Veritas Software Corporation",
            "Verizon Communications Inc",
            "VF Corporation",
            "Viacom Inc",
            "Viad Corp",
            "Viasystems Group Inc",
            "Vishay Intertechnology Inc",
            "Visteon Corporation",
            "Volt Information Sciences Inc",
            "Vulcan Materials Company",
            "W.R. Berkley Corporation",
            "W.R. Grace & Co",
            "W.W. Grainger Inc",
            "Wachovia Corporation",
            "Wakenhut Corporation",
            "Walgreen Co",
            "Wallace Computer Services Inc",
            "Wal-Mart Stores Inc",
            "Walt Disney Co",
            "Walter Industries Inc",
            "Washington Mutual Inc",
            "Washington Post Co.",
            "Waste Management Inc",
            "Watsco Inc",
            "Weatherford International Inc",
            "Weis Markets Inc.",
            "Wellpoint Health Networks Inc",
            "Wells Fargo & Company",
            "Wendy's International Inc",
            "Werner Enterprises Inc",
            "WESCO International Inc",
            "Western Digital Inc",
            "Western Gas Resources Inc",
            "WestPoint Stevens Inc",
            "Weyerhauser Company",
            "WGL Holdings Inc",
            "Whirlpool Corporation",
            "Whole Foods Market Inc",
            "Willamette Industries Inc.",
            "Williams Companies Inc",
            "Williams Sonoma Inc",
            "Winn Dixie Stores Inc",
            "Wisconsin Energy Corporation",
            "Wm Wrigley Jr Company",
            "World Fuel Services Corporation",
            "WorldCom Inc",
            "Worthington Industries Inc",
            "WPS Resources Corporation",
            "Wyeth",
            "Wyndham International Inc",
            "Xcel Energy Inc",
            "Xerox Corp",
            "Xilinx Inc",
            "XO Communications Inc",
            "Yellow Corporation",
            "York International Corp",
            "Yum Brands Inc.",
            "Zale Corporation",
            "Zions Bancorporation"
          ],
          fileExtension: {
            "raster": ["bmp", "gif", "gpl", "ico", "jpeg", "psd", "png", "psp", "raw", "tiff"],
            "vector": ["3dv", "amf", "awg", "ai", "cgm", "cdr", "cmx", "dxf", "e2d", "egt", "eps", "fs", "odg", "svg", "xar"],
            "3d": ["3dmf", "3dm", "3mf", "3ds", "an8", "aoi", "blend", "cal3d", "cob", "ctm", "iob", "jas", "max", "mb", "mdx", "obj", "x", "x3d"],
            "document": ["doc", "docx", "dot", "html", "xml", "odt", "odm", "ott", "csv", "rtf", "tex", "xhtml", "xps"]
          },
          timezones: [
            {
              "name": "Dateline Standard Time",
              "abbr": "DST",
              "offset": -12,
              "isdst": false,
              "text": "(UTC-12:00) International Date Line West",
              "utc": [
                "Etc/GMT+12"
              ]
            },
            {
              "name": "UTC-11",
              "abbr": "U",
              "offset": -11,
              "isdst": false,
              "text": "(UTC-11:00) Coordinated Universal Time-11",
              "utc": [
                "Etc/GMT+11",
                "Pacific/Midway",
                "Pacific/Niue",
                "Pacific/Pago_Pago"
              ]
            },
            {
              "name": "Hawaiian Standard Time",
              "abbr": "HST",
              "offset": -10,
              "isdst": false,
              "text": "(UTC-10:00) Hawaii",
              "utc": [
                "Etc/GMT+10",
                "Pacific/Honolulu",
                "Pacific/Johnston",
                "Pacific/Rarotonga",
                "Pacific/Tahiti"
              ]
            },
            {
              "name": "Alaskan Standard Time",
              "abbr": "AKDT",
              "offset": -8,
              "isdst": true,
              "text": "(UTC-09:00) Alaska",
              "utc": [
                "America/Anchorage",
                "America/Juneau",
                "America/Nome",
                "America/Sitka",
                "America/Yakutat"
              ]
            },
            {
              "name": "Pacific Standard Time (Mexico)",
              "abbr": "PDT",
              "offset": -7,
              "isdst": true,
              "text": "(UTC-08:00) Baja California",
              "utc": [
                "America/Santa_Isabel"
              ]
            },
            {
              "name": "Pacific Daylight Time",
              "abbr": "PDT",
              "offset": -7,
              "isdst": true,
              "text": "(UTC-07:00) Pacific Time (US & Canada)",
              "utc": [
                "America/Dawson",
                "America/Los_Angeles",
                "America/Tijuana",
                "America/Vancouver",
                "America/Whitehorse"
              ]
            },
            {
              "name": "Pacific Standard Time",
              "abbr": "PST",
              "offset": -8,
              "isdst": false,
              "text": "(UTC-08:00) Pacific Time (US & Canada)",
              "utc": [
                "America/Dawson",
                "America/Los_Angeles",
                "America/Tijuana",
                "America/Vancouver",
                "America/Whitehorse",
                "PST8PDT"
              ]
            },
            {
              "name": "US Mountain Standard Time",
              "abbr": "UMST",
              "offset": -7,
              "isdst": false,
              "text": "(UTC-07:00) Arizona",
              "utc": [
                "America/Creston",
                "America/Dawson_Creek",
                "America/Hermosillo",
                "America/Phoenix",
                "Etc/GMT+7"
              ]
            },
            {
              "name": "Mountain Standard Time (Mexico)",
              "abbr": "MDT",
              "offset": -6,
              "isdst": true,
              "text": "(UTC-07:00) Chihuahua, La Paz, Mazatlan",
              "utc": [
                "America/Chihuahua",
                "America/Mazatlan"
              ]
            },
            {
              "name": "Mountain Standard Time",
              "abbr": "MDT",
              "offset": -6,
              "isdst": true,
              "text": "(UTC-07:00) Mountain Time (US & Canada)",
              "utc": [
                "America/Boise",
                "America/Cambridge_Bay",
                "America/Denver",
                "America/Edmonton",
                "America/Inuvik",
                "America/Ojinaga",
                "America/Yellowknife",
                "MST7MDT"
              ]
            },
            {
              "name": "Central America Standard Time",
              "abbr": "CAST",
              "offset": -6,
              "isdst": false,
              "text": "(UTC-06:00) Central America",
              "utc": [
                "America/Belize",
                "America/Costa_Rica",
                "America/El_Salvador",
                "America/Guatemala",
                "America/Managua",
                "America/Tegucigalpa",
                "Etc/GMT+6",
                "Pacific/Galapagos"
              ]
            },
            {
              "name": "Central Standard Time",
              "abbr": "CDT",
              "offset": -5,
              "isdst": true,
              "text": "(UTC-06:00) Central Time (US & Canada)",
              "utc": [
                "America/Chicago",
                "America/Indiana/Knox",
                "America/Indiana/Tell_City",
                "America/Matamoros",
                "America/Menominee",
                "America/North_Dakota/Beulah",
                "America/North_Dakota/Center",
                "America/North_Dakota/New_Salem",
                "America/Rainy_River",
                "America/Rankin_Inlet",
                "America/Resolute",
                "America/Winnipeg",
                "CST6CDT"
              ]
            },
            {
              "name": "Central Standard Time (Mexico)",
              "abbr": "CDT",
              "offset": -5,
              "isdst": true,
              "text": "(UTC-06:00) Guadalajara, Mexico City, Monterrey",
              "utc": [
                "America/Bahia_Banderas",
                "America/Cancun",
                "America/Merida",
                "America/Mexico_City",
                "America/Monterrey"
              ]
            },
            {
              "name": "Canada Central Standard Time",
              "abbr": "CCST",
              "offset": -6,
              "isdst": false,
              "text": "(UTC-06:00) Saskatchewan",
              "utc": [
                "America/Regina",
                "America/Swift_Current"
              ]
            },
            {
              "name": "SA Pacific Standard Time",
              "abbr": "SPST",
              "offset": -5,
              "isdst": false,
              "text": "(UTC-05:00) Bogota, Lima, Quito",
              "utc": [
                "America/Bogota",
                "America/Cayman",
                "America/Coral_Harbour",
                "America/Eirunepe",
                "America/Guayaquil",
                "America/Jamaica",
                "America/Lima",
                "America/Panama",
                "America/Rio_Branco",
                "Etc/GMT+5"
              ]
            },
            {
              "name": "Eastern Standard Time",
              "abbr": "EDT",
              "offset": -4,
              "isdst": true,
              "text": "(UTC-05:00) Eastern Time (US & Canada)",
              "utc": [
                "America/Detroit",
                "America/Havana",
                "America/Indiana/Petersburg",
                "America/Indiana/Vincennes",
                "America/Indiana/Winamac",
                "America/Iqaluit",
                "America/Kentucky/Monticello",
                "America/Louisville",
                "America/Montreal",
                "America/Nassau",
                "America/New_York",
                "America/Nipigon",
                "America/Pangnirtung",
                "America/Port-au-Prince",
                "America/Thunder_Bay",
                "America/Toronto",
                "EST5EDT"
              ]
            },
            {
              "name": "US Eastern Standard Time",
              "abbr": "UEDT",
              "offset": -4,
              "isdst": true,
              "text": "(UTC-05:00) Indiana (East)",
              "utc": [
                "America/Indiana/Marengo",
                "America/Indiana/Vevay",
                "America/Indianapolis"
              ]
            },
            {
              "name": "Venezuela Standard Time",
              "abbr": "VST",
              "offset": -4.5,
              "isdst": false,
              "text": "(UTC-04:30) Caracas",
              "utc": [
                "America/Caracas"
              ]
            },
            {
              "name": "Paraguay Standard Time",
              "abbr": "PYT",
              "offset": -4,
              "isdst": false,
              "text": "(UTC-04:00) Asuncion",
              "utc": [
                "America/Asuncion"
              ]
            },
            {
              "name": "Atlantic Standard Time",
              "abbr": "ADT",
              "offset": -3,
              "isdst": true,
              "text": "(UTC-04:00) Atlantic Time (Canada)",
              "utc": [
                "America/Glace_Bay",
                "America/Goose_Bay",
                "America/Halifax",
                "America/Moncton",
                "America/Thule",
                "Atlantic/Bermuda"
              ]
            },
            {
              "name": "Central Brazilian Standard Time",
              "abbr": "CBST",
              "offset": -4,
              "isdst": false,
              "text": "(UTC-04:00) Cuiaba",
              "utc": [
                "America/Campo_Grande",
                "America/Cuiaba"
              ]
            },
            {
              "name": "SA Western Standard Time",
              "abbr": "SWST",
              "offset": -4,
              "isdst": false,
              "text": "(UTC-04:00) Georgetown, La Paz, Manaus, San Juan",
              "utc": [
                "America/Anguilla",
                "America/Antigua",
                "America/Aruba",
                "America/Barbados",
                "America/Blanc-Sablon",
                "America/Boa_Vista",
                "America/Curacao",
                "America/Dominica",
                "America/Grand_Turk",
                "America/Grenada",
                "America/Guadeloupe",
                "America/Guyana",
                "America/Kralendijk",
                "America/La_Paz",
                "America/Lower_Princes",
                "America/Manaus",
                "America/Marigot",
                "America/Martinique",
                "America/Montserrat",
                "America/Port_of_Spain",
                "America/Porto_Velho",
                "America/Puerto_Rico",
                "America/Santo_Domingo",
                "America/St_Barthelemy",
                "America/St_Kitts",
                "America/St_Lucia",
                "America/St_Thomas",
                "America/St_Vincent",
                "America/Tortola",
                "Etc/GMT+4"
              ]
            },
            {
              "name": "Pacific SA Standard Time",
              "abbr": "PSST",
              "offset": -4,
              "isdst": false,
              "text": "(UTC-04:00) Santiago",
              "utc": [
                "America/Santiago",
                "Antarctica/Palmer"
              ]
            },
            {
              "name": "Newfoundland Standard Time",
              "abbr": "NDT",
              "offset": -2.5,
              "isdst": true,
              "text": "(UTC-03:30) Newfoundland",
              "utc": [
                "America/St_Johns"
              ]
            },
            {
              "name": "E. South America Standard Time",
              "abbr": "ESAST",
              "offset": -3,
              "isdst": false,
              "text": "(UTC-03:00) Brasilia",
              "utc": [
                "America/Sao_Paulo"
              ]
            },
            {
              "name": "Argentina Standard Time",
              "abbr": "AST",
              "offset": -3,
              "isdst": false,
              "text": "(UTC-03:00) Buenos Aires",
              "utc": [
                "America/Argentina/La_Rioja",
                "America/Argentina/Rio_Gallegos",
                "America/Argentina/Salta",
                "America/Argentina/San_Juan",
                "America/Argentina/San_Luis",
                "America/Argentina/Tucuman",
                "America/Argentina/Ushuaia",
                "America/Buenos_Aires",
                "America/Catamarca",
                "America/Cordoba",
                "America/Jujuy",
                "America/Mendoza"
              ]
            },
            {
              "name": "SA Eastern Standard Time",
              "abbr": "SEST",
              "offset": -3,
              "isdst": false,
              "text": "(UTC-03:00) Cayenne, Fortaleza",
              "utc": [
                "America/Araguaina",
                "America/Belem",
                "America/Cayenne",
                "America/Fortaleza",
                "America/Maceio",
                "America/Paramaribo",
                "America/Recife",
                "America/Santarem",
                "Antarctica/Rothera",
                "Atlantic/Stanley",
                "Etc/GMT+3"
              ]
            },
            {
              "name": "Greenland Standard Time",
              "abbr": "GDT",
              "offset": -3,
              "isdst": true,
              "text": "(UTC-03:00) Greenland",
              "utc": [
                "America/Godthab"
              ]
            },
            {
              "name": "Montevideo Standard Time",
              "abbr": "MST",
              "offset": -3,
              "isdst": false,
              "text": "(UTC-03:00) Montevideo",
              "utc": [
                "America/Montevideo"
              ]
            },
            {
              "name": "Bahia Standard Time",
              "abbr": "BST",
              "offset": -3,
              "isdst": false,
              "text": "(UTC-03:00) Salvador",
              "utc": [
                "America/Bahia"
              ]
            },
            {
              "name": "UTC-02",
              "abbr": "U",
              "offset": -2,
              "isdst": false,
              "text": "(UTC-02:00) Coordinated Universal Time-02",
              "utc": [
                "America/Noronha",
                "Atlantic/South_Georgia",
                "Etc/GMT+2"
              ]
            },
            {
              "name": "Mid-Atlantic Standard Time",
              "abbr": "MDT",
              "offset": -1,
              "isdst": true,
              "text": "(UTC-02:00) Mid-Atlantic - Old",
              "utc": []
            },
            {
              "name": "Azores Standard Time",
              "abbr": "ADT",
              "offset": 0,
              "isdst": true,
              "text": "(UTC-01:00) Azores",
              "utc": [
                "America/Scoresbysund",
                "Atlantic/Azores"
              ]
            },
            {
              "name": "Cape Verde Standard Time",
              "abbr": "CVST",
              "offset": -1,
              "isdst": false,
              "text": "(UTC-01:00) Cape Verde Is.",
              "utc": [
                "Atlantic/Cape_Verde",
                "Etc/GMT+1"
              ]
            },
            {
              "name": "Morocco Standard Time",
              "abbr": "MDT",
              "offset": 1,
              "isdst": true,
              "text": "(UTC) Casablanca",
              "utc": [
                "Africa/Casablanca",
                "Africa/El_Aaiun"
              ]
            },
            {
              "name": "UTC",
              "abbr": "UTC",
              "offset": 0,
              "isdst": false,
              "text": "(UTC) Coordinated Universal Time",
              "utc": [
                "America/Danmarkshavn",
                "Etc/GMT"
              ]
            },
            {
              "name": "GMT Standard Time",
              "abbr": "GMT",
              "offset": 0,
              "isdst": false,
              "text": "(UTC) Edinburgh, London",
              "utc": [
                "Europe/Isle_of_Man",
                "Europe/Guernsey",
                "Europe/Jersey",
                "Europe/London"
              ]
            },
            {
              "name": "British Summer Time",
              "abbr": "BST",
              "offset": 1,
              "isdst": true,
              "text": "(UTC+01:00) Edinburgh, London",
              "utc": [
                "Europe/Isle_of_Man",
                "Europe/Guernsey",
                "Europe/Jersey",
                "Europe/London"
              ]
            },
            {
              "name": "GMT Standard Time",
              "abbr": "GDT",
              "offset": 1,
              "isdst": true,
              "text": "(UTC) Dublin, Lisbon",
              "utc": [
                "Atlantic/Canary",
                "Atlantic/Faeroe",
                "Atlantic/Madeira",
                "Europe/Dublin",
                "Europe/Lisbon"
              ]
            },
            {
              "name": "Greenwich Standard Time",
              "abbr": "GST",
              "offset": 0,
              "isdst": false,
              "text": "(UTC) Monrovia, Reykjavik",
              "utc": [
                "Africa/Abidjan",
                "Africa/Accra",
                "Africa/Bamako",
                "Africa/Banjul",
                "Africa/Bissau",
                "Africa/Conakry",
                "Africa/Dakar",
                "Africa/Freetown",
                "Africa/Lome",
                "Africa/Monrovia",
                "Africa/Nouakchott",
                "Africa/Ouagadougou",
                "Africa/Sao_Tome",
                "Atlantic/Reykjavik",
                "Atlantic/St_Helena"
              ]
            },
            {
              "name": "W. Europe Standard Time",
              "abbr": "WEDT",
              "offset": 2,
              "isdst": true,
              "text": "(UTC+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
              "utc": [
                "Arctic/Longyearbyen",
                "Europe/Amsterdam",
                "Europe/Andorra",
                "Europe/Berlin",
                "Europe/Busingen",
                "Europe/Gibraltar",
                "Europe/Luxembourg",
                "Europe/Malta",
                "Europe/Monaco",
                "Europe/Oslo",
                "Europe/Rome",
                "Europe/San_Marino",
                "Europe/Stockholm",
                "Europe/Vaduz",
                "Europe/Vatican",
                "Europe/Vienna",
                "Europe/Zurich"
              ]
            },
            {
              "name": "Central Europe Standard Time",
              "abbr": "CEDT",
              "offset": 2,
              "isdst": true,
              "text": "(UTC+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
              "utc": [
                "Europe/Belgrade",
                "Europe/Bratislava",
                "Europe/Budapest",
                "Europe/Ljubljana",
                "Europe/Podgorica",
                "Europe/Prague",
                "Europe/Tirane"
              ]
            },
            {
              "name": "Romance Standard Time",
              "abbr": "RDT",
              "offset": 2,
              "isdst": true,
              "text": "(UTC+01:00) Brussels, Copenhagen, Madrid, Paris",
              "utc": [
                "Africa/Ceuta",
                "Europe/Brussels",
                "Europe/Copenhagen",
                "Europe/Madrid",
                "Europe/Paris"
              ]
            },
            {
              "name": "Central European Standard Time",
              "abbr": "CEDT",
              "offset": 2,
              "isdst": true,
              "text": "(UTC+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
              "utc": [
                "Europe/Sarajevo",
                "Europe/Skopje",
                "Europe/Warsaw",
                "Europe/Zagreb"
              ]
            },
            {
              "name": "W. Central Africa Standard Time",
              "abbr": "WCAST",
              "offset": 1,
              "isdst": false,
              "text": "(UTC+01:00) West Central Africa",
              "utc": [
                "Africa/Algiers",
                "Africa/Bangui",
                "Africa/Brazzaville",
                "Africa/Douala",
                "Africa/Kinshasa",
                "Africa/Lagos",
                "Africa/Libreville",
                "Africa/Luanda",
                "Africa/Malabo",
                "Africa/Ndjamena",
                "Africa/Niamey",
                "Africa/Porto-Novo",
                "Africa/Tunis",
                "Etc/GMT-1"
              ]
            },
            {
              "name": "Namibia Standard Time",
              "abbr": "NST",
              "offset": 1,
              "isdst": false,
              "text": "(UTC+01:00) Windhoek",
              "utc": [
                "Africa/Windhoek"
              ]
            },
            {
              "name": "GTB Standard Time",
              "abbr": "GDT",
              "offset": 3,
              "isdst": true,
              "text": "(UTC+02:00) Athens, Bucharest",
              "utc": [
                "Asia/Nicosia",
                "Europe/Athens",
                "Europe/Bucharest",
                "Europe/Chisinau"
              ]
            },
            {
              "name": "Middle East Standard Time",
              "abbr": "MEDT",
              "offset": 3,
              "isdst": true,
              "text": "(UTC+02:00) Beirut",
              "utc": [
                "Asia/Beirut"
              ]
            },
            {
              "name": "Egypt Standard Time",
              "abbr": "EST",
              "offset": 2,
              "isdst": false,
              "text": "(UTC+02:00) Cairo",
              "utc": [
                "Africa/Cairo"
              ]
            },
            {
              "name": "Syria Standard Time",
              "abbr": "SDT",
              "offset": 3,
              "isdst": true,
              "text": "(UTC+02:00) Damascus",
              "utc": [
                "Asia/Damascus"
              ]
            },
            {
              "name": "E. Europe Standard Time",
              "abbr": "EEDT",
              "offset": 3,
              "isdst": true,
              "text": "(UTC+02:00) E. Europe",
              "utc": [
                "Asia/Nicosia",
                "Europe/Athens",
                "Europe/Bucharest",
                "Europe/Chisinau",
                "Europe/Helsinki",
                "Europe/Kiev",
                "Europe/Mariehamn",
                "Europe/Nicosia",
                "Europe/Riga",
                "Europe/Sofia",
                "Europe/Tallinn",
                "Europe/Uzhgorod",
                "Europe/Vilnius",
                "Europe/Zaporozhye"
              ]
            },
            {
              "name": "South Africa Standard Time",
              "abbr": "SAST",
              "offset": 2,
              "isdst": false,
              "text": "(UTC+02:00) Harare, Pretoria",
              "utc": [
                "Africa/Blantyre",
                "Africa/Bujumbura",
                "Africa/Gaborone",
                "Africa/Harare",
                "Africa/Johannesburg",
                "Africa/Kigali",
                "Africa/Lubumbashi",
                "Africa/Lusaka",
                "Africa/Maputo",
                "Africa/Maseru",
                "Africa/Mbabane",
                "Etc/GMT-2"
              ]
            },
            {
              "name": "FLE Standard Time",
              "abbr": "FDT",
              "offset": 3,
              "isdst": true,
              "text": "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
              "utc": [
                "Europe/Helsinki",
                "Europe/Kiev",
                "Europe/Mariehamn",
                "Europe/Riga",
                "Europe/Sofia",
                "Europe/Tallinn",
                "Europe/Uzhgorod",
                "Europe/Vilnius",
                "Europe/Zaporozhye"
              ]
            },
            {
              "name": "Turkey Standard Time",
              "abbr": "TDT",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+03:00) Istanbul",
              "utc": [
                "Europe/Istanbul"
              ]
            },
            {
              "name": "Israel Standard Time",
              "abbr": "JDT",
              "offset": 3,
              "isdst": true,
              "text": "(UTC+02:00) Jerusalem",
              "utc": [
                "Asia/Jerusalem"
              ]
            },
            {
              "name": "Libya Standard Time",
              "abbr": "LST",
              "offset": 2,
              "isdst": false,
              "text": "(UTC+02:00) Tripoli",
              "utc": [
                "Africa/Tripoli"
              ]
            },
            {
              "name": "Jordan Standard Time",
              "abbr": "JST",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+03:00) Amman",
              "utc": [
                "Asia/Amman"
              ]
            },
            {
              "name": "Arabic Standard Time",
              "abbr": "AST",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+03:00) Baghdad",
              "utc": [
                "Asia/Baghdad"
              ]
            },
            {
              "name": "Kaliningrad Standard Time",
              "abbr": "KST",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+02:00) Kaliningrad",
              "utc": [
                "Europe/Kaliningrad"
              ]
            },
            {
              "name": "Arab Standard Time",
              "abbr": "AST",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+03:00) Kuwait, Riyadh",
              "utc": [
                "Asia/Aden",
                "Asia/Bahrain",
                "Asia/Kuwait",
                "Asia/Qatar",
                "Asia/Riyadh"
              ]
            },
            {
              "name": "E. Africa Standard Time",
              "abbr": "EAST",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+03:00) Nairobi",
              "utc": [
                "Africa/Addis_Ababa",
                "Africa/Asmera",
                "Africa/Dar_es_Salaam",
                "Africa/Djibouti",
                "Africa/Juba",
                "Africa/Kampala",
                "Africa/Khartoum",
                "Africa/Mogadishu",
                "Africa/Nairobi",
                "Antarctica/Syowa",
                "Etc/GMT-3",
                "Indian/Antananarivo",
                "Indian/Comoro",
                "Indian/Mayotte"
              ]
            },
            {
              "name": "Moscow Standard Time",
              "abbr": "MSK",
              "offset": 3,
              "isdst": false,
              "text": "(UTC+03:00) Moscow, St. Petersburg, Volgograd, Minsk",
              "utc": [
                "Europe/Kirov",
                "Europe/Moscow",
                "Europe/Simferopol",
                "Europe/Volgograd",
                "Europe/Minsk"
              ]
            },
            {
              "name": "Samara Time",
              "abbr": "SAMT",
              "offset": 4,
              "isdst": false,
              "text": "(UTC+04:00) Samara, Ulyanovsk, Saratov",
              "utc": [
                "Europe/Astrakhan",
                "Europe/Samara",
                "Europe/Ulyanovsk"
              ]
            },
            {
              "name": "Iran Standard Time",
              "abbr": "IDT",
              "offset": 4.5,
              "isdst": true,
              "text": "(UTC+03:30) Tehran",
              "utc": [
                "Asia/Tehran"
              ]
            },
            {
              "name": "Arabian Standard Time",
              "abbr": "AST",
              "offset": 4,
              "isdst": false,
              "text": "(UTC+04:00) Abu Dhabi, Muscat",
              "utc": [
                "Asia/Dubai",
                "Asia/Muscat",
                "Etc/GMT-4"
              ]
            },
            {
              "name": "Azerbaijan Standard Time",
              "abbr": "ADT",
              "offset": 5,
              "isdst": true,
              "text": "(UTC+04:00) Baku",
              "utc": [
                "Asia/Baku"
              ]
            },
            {
              "name": "Mauritius Standard Time",
              "abbr": "MST",
              "offset": 4,
              "isdst": false,
              "text": "(UTC+04:00) Port Louis",
              "utc": [
                "Indian/Mahe",
                "Indian/Mauritius",
                "Indian/Reunion"
              ]
            },
            {
              "name": "Georgian Standard Time",
              "abbr": "GET",
              "offset": 4,
              "isdst": false,
              "text": "(UTC+04:00) Tbilisi",
              "utc": [
                "Asia/Tbilisi"
              ]
            },
            {
              "name": "Caucasus Standard Time",
              "abbr": "CST",
              "offset": 4,
              "isdst": false,
              "text": "(UTC+04:00) Yerevan",
              "utc": [
                "Asia/Yerevan"
              ]
            },
            {
              "name": "Afghanistan Standard Time",
              "abbr": "AST",
              "offset": 4.5,
              "isdst": false,
              "text": "(UTC+04:30) Kabul",
              "utc": [
                "Asia/Kabul"
              ]
            },
            {
              "name": "West Asia Standard Time",
              "abbr": "WAST",
              "offset": 5,
              "isdst": false,
              "text": "(UTC+05:00) Ashgabat, Tashkent",
              "utc": [
                "Antarctica/Mawson",
                "Asia/Aqtau",
                "Asia/Aqtobe",
                "Asia/Ashgabat",
                "Asia/Dushanbe",
                "Asia/Oral",
                "Asia/Samarkand",
                "Asia/Tashkent",
                "Etc/GMT-5",
                "Indian/Kerguelen",
                "Indian/Maldives"
              ]
            },
            {
              "name": "Yekaterinburg Time",
              "abbr": "YEKT",
              "offset": 5,
              "isdst": false,
              "text": "(UTC+05:00) Yekaterinburg",
              "utc": [
                "Asia/Yekaterinburg"
              ]
            },
            {
              "name": "Pakistan Standard Time",
              "abbr": "PKT",
              "offset": 5,
              "isdst": false,
              "text": "(UTC+05:00) Islamabad, Karachi",
              "utc": [
                "Asia/Karachi"
              ]
            },
            {
              "name": "India Standard Time",
              "abbr": "IST",
              "offset": 5.5,
              "isdst": false,
              "text": "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
              "utc": [
                "Asia/Kolkata"
              ]
            },
            {
              "name": "Sri Lanka Standard Time",
              "abbr": "SLST",
              "offset": 5.5,
              "isdst": false,
              "text": "(UTC+05:30) Sri Jayawardenepura",
              "utc": [
                "Asia/Colombo"
              ]
            },
            {
              "name": "Nepal Standard Time",
              "abbr": "NST",
              "offset": 5.75,
              "isdst": false,
              "text": "(UTC+05:45) Kathmandu",
              "utc": [
                "Asia/Kathmandu"
              ]
            },
            {
              "name": "Central Asia Standard Time",
              "abbr": "CAST",
              "offset": 6,
              "isdst": false,
              "text": "(UTC+06:00) Nur-Sultan (Astana)",
              "utc": [
                "Antarctica/Vostok",
                "Asia/Almaty",
                "Asia/Bishkek",
                "Asia/Qyzylorda",
                "Asia/Urumqi",
                "Etc/GMT-6",
                "Indian/Chagos"
              ]
            },
            {
              "name": "Bangladesh Standard Time",
              "abbr": "BST",
              "offset": 6,
              "isdst": false,
              "text": "(UTC+06:00) Dhaka",
              "utc": [
                "Asia/Dhaka",
                "Asia/Thimphu"
              ]
            },
            {
              "name": "Myanmar Standard Time",
              "abbr": "MST",
              "offset": 6.5,
              "isdst": false,
              "text": "(UTC+06:30) Yangon (Rangoon)",
              "utc": [
                "Asia/Rangoon",
                "Indian/Cocos"
              ]
            },
            {
              "name": "SE Asia Standard Time",
              "abbr": "SAST",
              "offset": 7,
              "isdst": false,
              "text": "(UTC+07:00) Bangkok, Hanoi, Jakarta",
              "utc": [
                "Antarctica/Davis",
                "Asia/Bangkok",
                "Asia/Hovd",
                "Asia/Jakarta",
                "Asia/Phnom_Penh",
                "Asia/Pontianak",
                "Asia/Saigon",
                "Asia/Vientiane",
                "Etc/GMT-7",
                "Indian/Christmas"
              ]
            },
            {
              "name": "N. Central Asia Standard Time",
              "abbr": "NCAST",
              "offset": 7,
              "isdst": false,
              "text": "(UTC+07:00) Novosibirsk",
              "utc": [
                "Asia/Novokuznetsk",
                "Asia/Novosibirsk",
                "Asia/Omsk"
              ]
            },
            {
              "name": "China Standard Time",
              "abbr": "CST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
              "utc": [
                "Asia/Hong_Kong",
                "Asia/Macau",
                "Asia/Shanghai"
              ]
            },
            {
              "name": "North Asia Standard Time",
              "abbr": "NAST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Krasnoyarsk",
              "utc": [
                "Asia/Krasnoyarsk"
              ]
            },
            {
              "name": "Singapore Standard Time",
              "abbr": "MPST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Kuala Lumpur, Singapore",
              "utc": [
                "Asia/Brunei",
                "Asia/Kuala_Lumpur",
                "Asia/Kuching",
                "Asia/Makassar",
                "Asia/Manila",
                "Asia/Singapore",
                "Etc/GMT-8"
              ]
            },
            {
              "name": "W. Australia Standard Time",
              "abbr": "WAST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Perth",
              "utc": [
                "Antarctica/Casey",
                "Australia/Perth"
              ]
            },
            {
              "name": "Taipei Standard Time",
              "abbr": "TST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Taipei",
              "utc": [
                "Asia/Taipei"
              ]
            },
            {
              "name": "Ulaanbaatar Standard Time",
              "abbr": "UST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Ulaanbaatar",
              "utc": [
                "Asia/Choibalsan",
                "Asia/Ulaanbaatar"
              ]
            },
            {
              "name": "North Asia East Standard Time",
              "abbr": "NAEST",
              "offset": 8,
              "isdst": false,
              "text": "(UTC+08:00) Irkutsk",
              "utc": [
                "Asia/Irkutsk"
              ]
            },
            {
              "name": "Japan Standard Time",
              "abbr": "JST",
              "offset": 9,
              "isdst": false,
              "text": "(UTC+09:00) Osaka, Sapporo, Tokyo",
              "utc": [
                "Asia/Dili",
                "Asia/Jayapura",
                "Asia/Tokyo",
                "Etc/GMT-9",
                "Pacific/Palau"
              ]
            },
            {
              "name": "Korea Standard Time",
              "abbr": "KST",
              "offset": 9,
              "isdst": false,
              "text": "(UTC+09:00) Seoul",
              "utc": [
                "Asia/Pyongyang",
                "Asia/Seoul"
              ]
            },
            {
              "name": "Cen. Australia Standard Time",
              "abbr": "CAST",
              "offset": 9.5,
              "isdst": false,
              "text": "(UTC+09:30) Adelaide",
              "utc": [
                "Australia/Adelaide",
                "Australia/Broken_Hill"
              ]
            },
            {
              "name": "AUS Central Standard Time",
              "abbr": "ACST",
              "offset": 9.5,
              "isdst": false,
              "text": "(UTC+09:30) Darwin",
              "utc": [
                "Australia/Darwin"
              ]
            },
            {
              "name": "E. Australia Standard Time",
              "abbr": "EAST",
              "offset": 10,
              "isdst": false,
              "text": "(UTC+10:00) Brisbane",
              "utc": [
                "Australia/Brisbane",
                "Australia/Lindeman"
              ]
            },
            {
              "name": "AUS Eastern Standard Time",
              "abbr": "AEST",
              "offset": 10,
              "isdst": false,
              "text": "(UTC+10:00) Canberra, Melbourne, Sydney",
              "utc": [
                "Australia/Melbourne",
                "Australia/Sydney"
              ]
            },
            {
              "name": "West Pacific Standard Time",
              "abbr": "WPST",
              "offset": 10,
              "isdst": false,
              "text": "(UTC+10:00) Guam, Port Moresby",
              "utc": [
                "Antarctica/DumontDUrville",
                "Etc/GMT-10",
                "Pacific/Guam",
                "Pacific/Port_Moresby",
                "Pacific/Saipan",
                "Pacific/Truk"
              ]
            },
            {
              "name": "Tasmania Standard Time",
              "abbr": "TST",
              "offset": 10,
              "isdst": false,
              "text": "(UTC+10:00) Hobart",
              "utc": [
                "Australia/Currie",
                "Australia/Hobart"
              ]
            },
            {
              "name": "Yakutsk Standard Time",
              "abbr": "YST",
              "offset": 9,
              "isdst": false,
              "text": "(UTC+09:00) Yakutsk",
              "utc": [
                "Asia/Chita",
                "Asia/Khandyga",
                "Asia/Yakutsk"
              ]
            },
            {
              "name": "Central Pacific Standard Time",
              "abbr": "CPST",
              "offset": 11,
              "isdst": false,
              "text": "(UTC+11:00) Solomon Is., New Caledonia",
              "utc": [
                "Antarctica/Macquarie",
                "Etc/GMT-11",
                "Pacific/Efate",
                "Pacific/Guadalcanal",
                "Pacific/Kosrae",
                "Pacific/Noumea",
                "Pacific/Ponape"
              ]
            },
            {
              "name": "Vladivostok Standard Time",
              "abbr": "VST",
              "offset": 11,
              "isdst": false,
              "text": "(UTC+11:00) Vladivostok",
              "utc": [
                "Asia/Sakhalin",
                "Asia/Ust-Nera",
                "Asia/Vladivostok"
              ]
            },
            {
              "name": "New Zealand Standard Time",
              "abbr": "NZST",
              "offset": 12,
              "isdst": false,
              "text": "(UTC+12:00) Auckland, Wellington",
              "utc": [
                "Antarctica/McMurdo",
                "Pacific/Auckland"
              ]
            },
            {
              "name": "UTC+12",
              "abbr": "U",
              "offset": 12,
              "isdst": false,
              "text": "(UTC+12:00) Coordinated Universal Time+12",
              "utc": [
                "Etc/GMT-12",
                "Pacific/Funafuti",
                "Pacific/Kwajalein",
                "Pacific/Majuro",
                "Pacific/Nauru",
                "Pacific/Tarawa",
                "Pacific/Wake",
                "Pacific/Wallis"
              ]
            },
            {
              "name": "Fiji Standard Time",
              "abbr": "FST",
              "offset": 12,
              "isdst": false,
              "text": "(UTC+12:00) Fiji",
              "utc": [
                "Pacific/Fiji"
              ]
            },
            {
              "name": "Magadan Standard Time",
              "abbr": "MST",
              "offset": 12,
              "isdst": false,
              "text": "(UTC+12:00) Magadan",
              "utc": [
                "Asia/Anadyr",
                "Asia/Kamchatka",
                "Asia/Magadan",
                "Asia/Srednekolymsk"
              ]
            },
            {
              "name": "Kamchatka Standard Time",
              "abbr": "KDT",
              "offset": 13,
              "isdst": true,
              "text": "(UTC+12:00) Petropavlovsk-Kamchatsky - Old",
              "utc": [
                "Asia/Kamchatka"
              ]
            },
            {
              "name": "Tonga Standard Time",
              "abbr": "TST",
              "offset": 13,
              "isdst": false,
              "text": "(UTC+13:00) Nuku'alofa",
              "utc": [
                "Etc/GMT-13",
                "Pacific/Enderbury",
                "Pacific/Fakaofo",
                "Pacific/Tongatapu"
              ]
            },
            {
              "name": "Samoa Standard Time",
              "abbr": "SST",
              "offset": 13,
              "isdst": false,
              "text": "(UTC+13:00) Samoa",
              "utc": [
                "Pacific/Apia"
              ]
            }
          ],
          profession: [
            "Airline Pilot",
            "Academic Team",
            "Accountant",
            "Account Executive",
            "Actor",
            "Actuary",
            "Acquisition Analyst",
            "Administrative Asst.",
            "Administrative Analyst",
            "Administrator",
            "Advertising Director",
            "Aerospace Engineer",
            "Agent",
            "Agricultural Inspector",
            "Agricultural Scientist",
            "Air Traffic Controller",
            "Animal Trainer",
            "Anthropologist",
            "Appraiser",
            "Architect",
            "Art Director",
            "Artist",
            "Astronomer",
            "Athletic Coach",
            "Auditor",
            "Author",
            "Baker",
            "Banker",
            "Bankruptcy Attorney",
            "Benefits Manager",
            "Biologist",
            "Bio-feedback Specialist",
            "Biomedical Engineer",
            "Biotechnical Researcher",
            "Broadcaster",
            "Broker",
            "Building Manager",
            "Building Contractor",
            "Building Inspector",
            "Business Analyst",
            "Business Planner",
            "Business Manager",
            "Buyer",
            "Call Center Manager",
            "Career Counselor",
            "Cash Manager",
            "Ceramic Engineer",
            "Chief Executive Officer",
            "Chief Operation Officer",
            "Chef",
            "Chemical Engineer",
            "Chemist",
            "Child Care Manager",
            "Chief Medical Officer",
            "Chiropractor",
            "Cinematographer",
            "City Housing Manager",
            "City Manager",
            "Civil Engineer",
            "Claims Manager",
            "Clinical Research Assistant",
            "Collections Manager",
            "Compliance Manager",
            "Comptroller",
            "Computer Manager",
            "Commercial Artist",
            "Communications Affairs Director",
            "Communications Director",
            "Communications Engineer",
            "Compensation Analyst",
            "Computer Programmer",
            "Computer Ops. Manager",
            "Computer Engineer",
            "Computer Operator",
            "Computer Graphics Specialist",
            "Construction Engineer",
            "Construction Manager",
            "Consultant",
            "Consumer Relations Manager",
            "Contract Administrator",
            "Copyright Attorney",
            "Copywriter",
            "Corporate Planner",
            "Corrections Officer",
            "Cosmetologist",
            "Credit Analyst",
            "Cruise Director",
            "Chief Information Officer",
            "Chief Technology Officer",
            "Customer Service Manager",
            "Cryptologist",
            "Dancer",
            "Data Security Manager",
            "Database Manager",
            "Day Care Instructor",
            "Dentist",
            "Designer",
            "Design Engineer",
            "Desktop Publisher",
            "Developer",
            "Development Officer",
            "Diamond Merchant",
            "Dietitian",
            "Direct Marketer",
            "Director",
            "Distribution Manager",
            "Diversity Manager",
            "Economist",
            "EEO Compliance Manager",
            "Editor",
            "Education Adminator",
            "Electrical Engineer",
            "Electro Optical Engineer",
            "Electronics Engineer",
            "Embassy Management",
            "Employment Agent",
            "Engineer Technician",
            "Entrepreneur",
            "Environmental Analyst",
            "Environmental Attorney",
            "Environmental Engineer",
            "Environmental Specialist",
            "Escrow Officer",
            "Estimator",
            "Executive Assistant",
            "Executive Director",
            "Executive Recruiter",
            "Facilities Manager",
            "Family Counselor",
            "Fashion Events Manager",
            "Fashion Merchandiser",
            "Fast Food Manager",
            "Film Producer",
            "Film Production Assistant",
            "Financial Analyst",
            "Financial Planner",
            "Financier",
            "Fine Artist",
            "Wildlife Specialist",
            "Fitness Consultant",
            "Flight Attendant",
            "Flight Engineer",
            "Floral Designer",
            "Food & Beverage Director",
            "Food Service Manager",
            "Forestry Technician",
            "Franchise Management",
            "Franchise Sales",
            "Fraud Investigator",
            "Freelance Writer",
            "Fund Raiser",
            "General Manager",
            "Geologist",
            "General Counsel",
            "Geriatric Specialist",
            "Gerontologist",
            "Glamour Photographer",
            "Golf Club Manager",
            "Gourmet Chef",
            "Graphic Designer",
            "Grounds Keeper",
            "Hazardous Waste Manager",
            "Health Care Manager",
            "Health Therapist",
            "Health Service Administrator",
            "Hearing Officer",
            "Home Economist",
            "Horticulturist",
            "Hospital Administrator",
            "Hotel Manager",
            "Human Resources Manager",
            "Importer",
            "Industrial Designer",
            "Industrial Engineer",
            "Information Director",
            "Inside Sales",
            "Insurance Adjuster",
            "Interior Decorator",
            "Internal Controls Director",
            "International Acct.",
            "International Courier",
            "International Lawyer",
            "Interpreter",
            "Investigator",
            "Investment Banker",
            "Investment Manager",
            "IT Architect",
            "IT Project Manager",
            "IT Systems Analyst",
            "Jeweler",
            "Joint Venture Manager",
            "Journalist",
            "Labor Negotiator",
            "Labor Organizer",
            "Labor Relations Manager",
            "Lab Services Director",
            "Lab Technician",
            "Land Developer",
            "Landscape Architect",
            "Law Enforcement Officer",
            "Lawyer",
            "Lead Software Engineer",
            "Lead Software Test Engineer",
            "Leasing Manager",
            "Legal Secretary",
            "Library Manager",
            "Litigation Attorney",
            "Loan Officer",
            "Lobbyist",
            "Logistics Manager",
            "Maintenance Manager",
            "Management Consultant",
            "Managed Care Director",
            "Managing Partner",
            "Manufacturing Director",
            "Manpower Planner",
            "Marine Biologist",
            "Market Res. Analyst",
            "Marketing Director",
            "Materials Manager",
            "Mathematician",
            "Membership Chairman",
            "Mechanic",
            "Mechanical Engineer",
            "Media Buyer",
            "Medical Investor",
            "Medical Secretary",
            "Medical Technician",
            "Mental Health Counselor",
            "Merchandiser",
            "Metallurgical Engineering",
            "Meteorologist",
            "Microbiologist",
            "MIS Manager",
            "Motion Picture Director",
            "Multimedia Director",
            "Musician",
            "Network Administrator",
            "Network Specialist",
            "Network Operator",
            "New Product Manager",
            "Novelist",
            "Nuclear Engineer",
            "Nuclear Specialist",
            "Nutritionist",
            "Nursing Administrator",
            "Occupational Therapist",
            "Oceanographer",
            "Office Manager",
            "Operations Manager",
            "Operations Research Director",
            "Optical Technician",
            "Optometrist",
            "Organizational Development Manager",
            "Outplacement Specialist",
            "Paralegal",
            "Park Ranger",
            "Patent Attorney",
            "Payroll Specialist",
            "Personnel Specialist",
            "Petroleum Engineer",
            "Pharmacist",
            "Photographer",
            "Physical Therapist",
            "Physician",
            "Physician Assistant",
            "Physicist",
            "Planning Director",
            "Podiatrist",
            "Political Analyst",
            "Political Scientist",
            "Politician",
            "Portfolio Manager",
            "Preschool Management",
            "Preschool Teacher",
            "Principal",
            "Private Banker",
            "Private Investigator",
            "Probation Officer",
            "Process Engineer",
            "Producer",
            "Product Manager",
            "Product Engineer",
            "Production Engineer",
            "Production Planner",
            "Professional Athlete",
            "Professional Coach",
            "Professor",
            "Project Engineer",
            "Project Manager",
            "Program Manager",
            "Property Manager",
            "Public Administrator",
            "Public Safety Director",
            "PR Specialist",
            "Publisher",
            "Purchasing Agent",
            "Publishing Director",
            "Quality Assurance Specialist",
            "Quality Control Engineer",
            "Quality Control Inspector",
            "Radiology Manager",
            "Railroad Engineer",
            "Real Estate Broker",
            "Recreational Director",
            "Recruiter",
            "Redevelopment Specialist",
            "Regulatory Affairs Manager",
            "Registered Nurse",
            "Rehabilitation Counselor",
            "Relocation Manager",
            "Reporter",
            "Research Specialist",
            "Restaurant Manager",
            "Retail Store Manager",
            "Risk Analyst",
            "Safety Engineer",
            "Sales Engineer",
            "Sales Trainer",
            "Sales Promotion Manager",
            "Sales Representative",
            "Sales Manager",
            "Service Manager",
            "Sanitation Engineer",
            "Scientific Programmer",
            "Scientific Writer",
            "Securities Analyst",
            "Security Consultant",
            "Security Director",
            "Seminar Presenter",
            "Ship's Officer",
            "Singer",
            "Social Director",
            "Social Program Planner",
            "Social Research",
            "Social Scientist",
            "Social Worker",
            "Sociologist",
            "Software Developer",
            "Software Engineer",
            "Software Test Engineer",
            "Soil Scientist",
            "Special Events Manager",
            "Special Education Teacher",
            "Special Projects Director",
            "Speech Pathologist",
            "Speech Writer",
            "Sports Event Manager",
            "Statistician",
            "Store Manager",
            "Strategic Alliance Director",
            "Strategic Planning Director",
            "Stress Reduction Specialist",
            "Stockbroker",
            "Surveyor",
            "Structural Engineer",
            "Superintendent",
            "Supply Chain Director",
            "System Engineer",
            "Systems Analyst",
            "Systems Programmer",
            "System Administrator",
            "Tax Specialist",
            "Teacher",
            "Technical Support Specialist",
            "Technical Illustrator",
            "Technical Writer",
            "Technology Director",
            "Telecom Analyst",
            "Telemarketer",
            "Theatrical Director",
            "Title Examiner",
            "Tour Escort",
            "Tour Guide Director",
            "Traffic Manager",
            "Trainer Translator",
            "Transportation Manager",
            "Travel Agent",
            "Treasurer",
            "TV Programmer",
            "Underwriter",
            "Union Representative",
            "University Administrator",
            "University Dean",
            "Urban Planner",
            "Veterinarian",
            "Vendor Relations Director",
            "Viticulturist",
            "Warehouse Manager"
          ],
          animals: {
            "ocean": ["Acantharea", "Anemone", "Angelfish King", "Ahi Tuna", "Albacore", "American Oyster", "Anchovy", "Armored Snail", "Arctic Char", "Atlantic Bluefin Tuna", "Atlantic Cod", "Atlantic Goliath Grouper", "Atlantic Trumpetfish", "Atlantic Wolffish", "Baleen Whale", "Banded Butterflyfish", "Banded Coral Shrimp", "Banded Sea Krait", "Barnacle", "Barndoor Skate", "Barracuda", "Basking Shark", "Bass", "Beluga Whale", "Bluebanded Goby", "Bluehead Wrasse", "Bluefish", "Bluestreak Cleaner-Wrasse", "Blue Marlin", "Blue Shark", "Blue Spiny Lobster", "Blue Tang", "Blue Whale", "Broadclub Cuttlefish", "Bull Shark", "Chambered Nautilus", "Chilean Basket Star", "Chilean Jack Mackerel", "Chinook Salmon", "Christmas Tree Worm", "Clam", "Clown Anemonefish", "Clown Triggerfish", "Cod", "Coelacanth", "Cockscomb Cup Coral", "Common Fangtooth", "Conch", "Cookiecutter Shark", "Copepod", "Coral", "Corydoras", "Cownose Ray", "Crab", "Crown-of-Thorns Starfish", "Cushion Star", "Cuttlefish", "California Sea Otters", "Dolphin", "Dolphinfish", "Dory", "Devil Fish", "Dugong", "Dumbo Octopus", "Dungeness Crab", "Eccentric Sand Dollar", "Edible Sea Cucumber", "Eel", "Elephant Seal", "Elkhorn Coral", "Emperor Shrimp", "Estuarine Crocodile", "Fathead Sculpin", "Fiddler Crab", "Fin Whale", "Flameback", "Flamingo Tongue Snail", "Flashlight Fish", "Flatback Turtle", "Flatfish", "Flying Fish", "Flounder", "Fluke", "French Angelfish", "Frilled Shark", "Fugu (also called Pufferfish)", "Gar", "Geoduck", "Giant Barrel Sponge", "Giant Caribbean Sea Anemone", "Giant Clam", "Giant Isopod", "Giant Kingfish", "Giant Oarfish", "Giant Pacific Octopus", "Giant Pyrosome", "Giant Sea Star", "Giant Squid", "Glowing Sucker Octopus", "Giant Tube Worm", "Goblin Shark", "Goosefish", "Great White Shark", "Greenland Shark", "Grey Atlantic Seal", "Grouper", "Grunion", "Guineafowl Puffer", "Haddock", "Hake", "Halibut", "Hammerhead Shark", "Hapuka", "Harbor Porpoise", "Harbor Seal", "Hatchetfish", "Hawaiian Monk Seal", "Hawksbill Turtle", "Hector's Dolphin", "Hermit Crab", "Herring", "Hoki", "Horn Shark", "Horseshoe Crab", "Humpback Anglerfish", "Humpback Whale", "Icefish", "Imperator Angelfish", "Irukandji Jellyfish", "Isopod", "Ivory Bush Coral", "Japanese Spider Crab", "Jellyfish", "John Dory", "Juan Fernandez Fur Seal", "Killer Whale", "Kiwa Hirsuta", "Krill", "Lagoon Triggerfish", "Lamprey", "Leafy Seadragon", "Leopard Seal", "Limpet", "Ling", "Lionfish", "Lions Mane Jellyfish", "Lobe Coral", "Lobster", "Loggerhead Turtle", "Longnose Sawshark", "Longsnout Seahorse", "Lophelia Coral", "Marrus Orthocanna", "Manatee", "Manta Ray", "Marlin", "Megamouth Shark", "Mexican Lookdown", "Mimic Octopus", "Moon Jelly", "Mollusk", "Monkfish", "Moray Eel", "Mullet", "Mussel", "Megaladon", "Napoleon Wrasse", "Nassau Grouper", "Narwhal", "Nautilus", "Needlefish", "Northern Seahorse", "North Atlantic Right Whale", "Northern Red Snapper", "Norway Lobster", "Nudibranch", "Nurse Shark", "Oarfish", "Ocean Sunfish", "Oceanic Whitetip Shark", "Octopus", "Olive Sea Snake", "Orange Roughy", "Ostracod", "Otter", "Oyster", "Pacific Angelshark", "Pacific Blackdragon", "Pacific Halibut", "Pacific Sardine", "Pacific Sea Nettle Jellyfish", "Pacific White Sided Dolphin", "Pantropical Spotted Dolphin", "Patagonian Toothfish", "Peacock Mantis Shrimp", "Pelagic Thresher Shark", "Penguin", "Peruvian Anchoveta", "Pilchard", "Pink Salmon", "Pinniped", "Plankton", "Porpoise", "Polar Bear", "Portuguese Man o' War", "Pycnogonid Sea Spider", "Quahog", "Queen Angelfish", "Queen Conch", "Queen Parrotfish", "Queensland Grouper", "Ragfish", "Ratfish", "Rattail Fish", "Ray", "Red Drum", "Red King Crab", "Ringed Seal", "Risso's Dolphin", "Ross Seals", "Sablefish", "Salmon", "Sand Dollar", "Sandbar Shark", "Sawfish", "Sarcastic Fringehead", "Scalloped Hammerhead Shark", "Seahorse", "Sea Cucumber", "Sea Lion", "Sea Urchin", "Seal", "Shark", "Shortfin Mako Shark", "Shovelnose Guitarfish", "Shrimp", "Silverside Fish", "Skipjack Tuna", "Slender Snipe Eel", "Smalltooth Sawfish", "Smelts", "Sockeye Salmon", "Southern Stingray", "Sponge", "Spotted Porcupinefish", "Spotted Dolphin", "Spotted Eagle Ray", "Spotted Moray", "Squid", "Squidworm", "Starfish", "Stickleback", "Stonefish", "Stoplight Loosejaw", "Sturgeon", "Swordfish", "Tan Bristlemouth", "Tasseled Wobbegong", "Terrible Claw Lobster", "Threespot Damselfish", "Tiger Prawn", "Tiger Shark", "Tilefish", "Toadfish", "Tropical Two-Wing Flyfish", "Tuna", "Umbrella Squid", "Velvet Crab", "Venus Flytrap Sea Anemone", "Vigtorniella Worm", "Viperfish", "Vampire Squid", "Vaquita", "Wahoo", "Walrus", "West Indian Manatee", "Whale", "Whale Shark", "Whiptail Gulper", "White-Beaked Dolphin", "White-Ring Garden Eel", "White Shrimp", "Wobbegong", "Wrasse", "Wreckfish", "Xiphosura", "Yellowtail Damselfish", "Yelloweye Rockfish", "Yellow Cup Black Coral", "Yellow Tube Sponge", "Yellowfin Tuna", "Zebrashark", "Zooplankton"],
            "desert": ["Aardwolf", "Addax", "African Wild Ass", "Ant", "Antelope", "Armadillo", "Baboon", "Badger", "Bat", "Bearded Dragon", "Beetle", "Bird", "Black-footed Cat", "Boa", "Brown Bear", "Bustard", "Butterfly", "Camel", "Caracal", "Caracara", "Caterpillar", "Centipede", "Cheetah", "Chipmunk", "Chuckwalla", "Climbing Mouse", "Coati", "Cobra", "Cotton Rat", "Cougar", "Courser", "Crane Fly", "Crow", "Dassie Rat", "Dove", "Dunnart", "Eagle", "Echidna", "Elephant", "Emu", "Falcon", "Fly", "Fox", "Frogmouth", "Gecko", "Geoffroy's Cat", "Gerbil", "Grasshopper", "Guanaco", "Gundi", "Hamster", "Hawk", "Hedgehog", "Hyena", "Hyrax", "Jackal", "Kangaroo", "Kangaroo Rat", "Kestrel", "Kowari", "Kultarr", "Leopard", "Lion", "Macaw", "Meerkat", "Mouse", "Oryx", "Ostrich", "Owl", "Pronghorn", "Python", "Rabbit", "Raccoon", "Rattlesnake", "Rhinoceros", "Sand Cat", "Spectacled Bear", "Spiny Mouse", "Starling", "Stick Bug", "Tarantula", "Tit", "Toad", "Tortoise", "Tyrant Flycatcher", "Viper", "Vulture", "Waxwing", "Xerus", "Zebra"],
            "grassland": ["Aardvark", "Aardwolf", "Accentor", "African Buffalo", "African Wild Dog", "Alpaca", "Anaconda", "Ant", "Anteater", "Antelope", "Armadillo", "Baboon", "Badger", "Bandicoot", "Barbet", "Bat", "Bee", "Bee-eater", "Beetle", "Bird", "Bison", "Black-footed Cat", "Black-footed Ferret", "Bluebird", "Boa", "Bowerbird", "Brown Bear", "Bush Dog", "Bushshrike", "Bustard", "Butterfly", "Buzzard", "Caracal", "Caracara", "Cardinal", "Caterpillar", "Cheetah", "Chipmunk", "Civet", "Climbing Mouse", "Clouded Leopard", "Coati", "Cobra", "Cockatoo", "Cockroach", "Common Genet", "Cotton Rat", "Cougar", "Courser", "Coyote", "Crane", "Crane Fly", "Cricket", "Crow", "Culpeo", "Death Adder", "Deer", "Deer Mouse", "Dingo", "Dinosaur", "Dove", "Drongo", "Duck", "Duiker", "Dunnart", "Eagle", "Echidna", "Elephant", "Elk", "Emu", "Falcon", "Finch", "Flea", "Fly", "Flying Frog", "Fox", "Frog", "Frogmouth", "Garter Snake", "Gazelle", "Gecko", "Geoffroy's Cat", "Gerbil", "Giant Tortoise", "Giraffe", "Grasshopper", "Grison", "Groundhog", "Grouse", "Guanaco", "Guinea Pig", "Hamster", "Harrier", "Hartebeest", "Hawk", "Hedgehog", "Helmetshrike", "Hippopotamus", "Hornbill", "Hyena", "Hyrax", "Impala", "Jackal", "Jaguar", "Jaguarundi", "Kangaroo", "Kangaroo Rat", "Kestrel", "Kultarr", "Ladybug", "Leopard", "Lion", "Macaw", "Meerkat", "Mouse", "Newt", "Oryx", "Ostrich", "Owl", "Pangolin", "Pheasant", "Prairie Dog", "Pronghorn", "Przewalski's Horse", "Python", "Quoll", "Rabbit", "Raven", "Rhinoceros", "Shelduck", "Sloth Bear", "Spectacled Bear", "Squirrel", "Starling", "Stick Bug", "Tamandua", "Tasmanian Devil", "Thornbill", "Thrush", "Toad", "Tortoise"],
            "forest": ["Agouti", "Anaconda", "Anoa", "Ant", "Anteater", "Antelope", "Armadillo", "Asian Black Bear", "Aye-aye", "Babirusa", "Baboon", "Badger", "Bandicoot", "Banteng", "Barbet", "Basilisk", "Bat", "Bearded Dragon", "Bee", "Bee-eater", "Beetle", "Bettong", "Binturong", "Bird-of-paradise", "Bongo", "Bowerbird", "Bulbul", "Bush Dog", "Bushbaby", "Bushshrike", "Butterfly", "Buzzard", "Caecilian", "Cardinal", "Cassowary", "Caterpillar", "Centipede", "Chameleon", "Chimpanzee", "Cicada", "Civet", "Clouded Leopard", "Coati", "Cobra", "Cockatoo", "Cockroach", "Colugo", "Cotinga", "Cotton Rat", "Cougar", "Crane Fly", "Cricket", "Crocodile", "Crow", "Cuckoo", "Cuscus", "Death Adder", "Deer", "Dhole", "Dingo", "Dinosaur", "Drongo", "Duck", "Duiker", "Eagle", "Echidna", "Elephant", "Finch", "Flat-headed Cat", "Flea", "Flowerpecker", "Fly", "Flying Frog", "Fossa", "Frog", "Frogmouth", "Gaur", "Gecko", "Gorilla", "Grison", "Hawaiian Honeycreeper", "Hawk", "Hedgehog", "Helmetshrike", "Hornbill", "Hyrax", "Iguana", "Jackal", "Jaguar", "Jaguarundi", "Kestrel", "Ladybug", "Lemur", "Leopard", "Lion", "Macaw", "Mandrill", "Margay", "Monkey", "Mouse", "Mouse Deer", "Newt", "Okapi", "Old World Flycatcher", "Orangutan", "Owl", "Pangolin", "Peafowl", "Pheasant", "Possum", "Python", "Quokka", "Rabbit", "Raccoon", "Red Panda", "Red River Hog", "Rhinoceros", "Sloth Bear", "Spectacled Bear", "Squirrel", "Starling", "Stick Bug", "Sun Bear", "Tamandua", "Tamarin", "Tapir", "Tarantula", "Thrush", "Tiger", "Tit", "Toad", "Tortoise", "Toucan", "Trogon", "Trumpeter", "Turaco", "Turtle", "Tyrant Flycatcher", "Viper", "Vulture", "Wallaby", "Warbler", "Wasp", "Waxwing", "Weaver", "Weaver-finch", "Whistler", "White-eye", "Whydah", "Woodswallow", "Worm", "Wren", "Xenops", "Yellowjacket", "Accentor", "African Buffalo", "American Black Bear", "Anole", "Bird", "Bison", "Boa", "Brown Bear", "Chipmunk", "Common Genet", "Copperhead", "Coyote", "Deer Mouse", "Dormouse", "Elk", "Emu", "Fisher", "Fox", "Garter Snake", "Giant Panda", "Giant Tortoise", "Groundhog", "Grouse", "Guanaco", "Himalayan Tahr", "Kangaroo", "Koala", "Numbat", "Quoll", "Raccoon dog", "Tasmanian Devil", "Thornbill", "Turkey", "Vole", "Weasel", "Wildcat", "Wolf", "Wombat", "Woodchuck", "Woodpecker"],
            "farm": ["Alpaca", "Buffalo", "Banteng", "Cow", "Cat", "Chicken", "Carp", "Camel", "Donkey", "Dog", "Duck", "Emu", "Goat", "Gayal", "Guinea", "Goose", "Horse", "Honey", "Llama", "Pig", "Pigeon", "Rhea", "Rabbit", "Sheep", "Silkworm", "Turkey", "Yak", "Zebu"],
            "pet": ["Bearded Dragon", "Birds", "Burro", "Cats", "Chameleons", "Chickens", "Chinchillas", "Chinese Water Dragon", "Cows", "Dogs", "Donkey", "Ducks", "Ferrets", "Fish", "Geckos", "Geese", "Gerbils", "Goats", "Guinea Fowl", "Guinea Pigs", "Hamsters", "Hedgehogs", "Horses", "Iguanas", "Llamas", "Lizards", "Mice", "Mule", "Peafowl", "Pigs and Hogs", "Pigeons", "Ponies", "Pot Bellied Pig", "Rabbits", "Rats", "Sheep", "Skinks", "Snakes", "Stick Insects", "Sugar Gliders", "Tarantula", "Turkeys", "Turtles"],
            "zoo": ["Aardvark", "African Wild Dog", "Aldabra Tortoise", "American Alligator", "American Bison", "Amur Tiger", "Anaconda", "Andean Condor", "Asian Elephant", "Baby Doll Sheep", "Bald Eagle", "Barred Owl", "Blue Iguana", "Boer Goat", "California Sea Lion", "Caribbean Flamingo", "Chinchilla", "Collared Lemur", "Coquerel's Sifaka", "Cuban Amazon Parrot", "Ebony Langur", "Fennec Fox", "Fossa", "Gelada", "Giant Anteater", "Giraffe", "Gorilla", "Grizzly Bear", "Henkel's Leaf-tailed Gecko", "Indian Gharial", "Indian Rhinoceros", "King Cobra", "King Vulture", "Komodo Dragon", "Linne's Two-toed Sloth", "Lion", "Little Penguin", "Madagascar Tree Boa", "Magellanic Penguin", "Malayan Tapir", "Malayan Tiger", "Matschies Tree Kangaroo", "Mini Donkey", "Monarch Butterfly", "Nile crocodile", "North American Porcupine", "Nubian Ibex", "Okapi", "Poison Dart Frog", "Polar Bear", "Pygmy Marmoset", "Radiated Tortoise", "Red Panda", "Red Ruffed Lemur", "Ring-tailed Lemur", "Ring-tailed Mongoose", "Rock Hyrax", "Small Clawed Asian Otter", "Snow Leopard", "Snowy Owl", "Southern White-faced Owl", "Southern White Rhinocerous", "Squirrel Monkey", "Tufted Puffin", "White Cheeked Gibbon", "White-throated Bee Eater", "Zebra"]
          },
          primes: [
            2,
            3,
            5,
            7,
            11,
            13,
            17,
            19,
            23,
            29,
            31,
            37,
            41,
            43,
            47,
            53,
            59,
            61,
            67,
            71,
            73,
            79,
            83,
            89,
            97,
            101,
            103,
            107,
            109,
            113,
            127,
            131,
            137,
            139,
            149,
            151,
            157,
            163,
            167,
            173,
            179,
            181,
            191,
            193,
            197,
            199,
            211,
            223,
            227,
            229,
            233,
            239,
            241,
            251,
            257,
            263,
            269,
            271,
            277,
            281,
            283,
            293,
            307,
            311,
            313,
            317,
            331,
            337,
            347,
            349,
            353,
            359,
            367,
            373,
            379,
            383,
            389,
            397,
            401,
            409,
            419,
            421,
            431,
            433,
            439,
            443,
            449,
            457,
            461,
            463,
            467,
            479,
            487,
            491,
            499,
            503,
            509,
            521,
            523,
            541,
            547,
            557,
            563,
            569,
            571,
            577,
            587,
            593,
            599,
            601,
            607,
            613,
            617,
            619,
            631,
            641,
            643,
            647,
            653,
            659,
            661,
            673,
            677,
            683,
            691,
            701,
            709,
            719,
            727,
            733,
            739,
            743,
            751,
            757,
            761,
            769,
            773,
            787,
            797,
            809,
            811,
            821,
            823,
            827,
            829,
            839,
            853,
            857,
            859,
            863,
            877,
            881,
            883,
            887,
            907,
            911,
            919,
            929,
            937,
            941,
            947,
            953,
            967,
            971,
            977,
            983,
            991,
            997,
            1009,
            1013,
            1019,
            1021,
            1031,
            1033,
            1039,
            1049,
            1051,
            1061,
            1063,
            1069,
            1087,
            1091,
            1093,
            1097,
            1103,
            1109,
            1117,
            1123,
            1129,
            1151,
            1153,
            1163,
            1171,
            1181,
            1187,
            1193,
            1201,
            1213,
            1217,
            1223,
            1229,
            1231,
            1237,
            1249,
            1259,
            1277,
            1279,
            1283,
            1289,
            1291,
            1297,
            1301,
            1303,
            1307,
            1319,
            1321,
            1327,
            1361,
            1367,
            1373,
            1381,
            1399,
            1409,
            1423,
            1427,
            1429,
            1433,
            1439,
            1447,
            1451,
            1453,
            1459,
            1471,
            1481,
            1483,
            1487,
            1489,
            1493,
            1499,
            1511,
            1523,
            1531,
            1543,
            1549,
            1553,
            1559,
            1567,
            1571,
            1579,
            1583,
            1597,
            1601,
            1607,
            1609,
            1613,
            1619,
            1621,
            1627,
            1637,
            1657,
            1663,
            1667,
            1669,
            1693,
            1697,
            1699,
            1709,
            1721,
            1723,
            1733,
            1741,
            1747,
            1753,
            1759,
            1777,
            1783,
            1787,
            1789,
            1801,
            1811,
            1823,
            1831,
            1847,
            1861,
            1867,
            1871,
            1873,
            1877,
            1879,
            1889,
            1901,
            1907,
            1913,
            1931,
            1933,
            1949,
            1951,
            1973,
            1979,
            1987,
            1993,
            1997,
            1999,
            2003,
            2011,
            2017,
            2027,
            2029,
            2039,
            2053,
            2063,
            2069,
            2081,
            2083,
            2087,
            2089,
            2099,
            2111,
            2113,
            2129,
            2131,
            2137,
            2141,
            2143,
            2153,
            2161,
            2179,
            2203,
            2207,
            2213,
            2221,
            2237,
            2239,
            2243,
            2251,
            2267,
            2269,
            2273,
            2281,
            2287,
            2293,
            2297,
            2309,
            2311,
            2333,
            2339,
            2341,
            2347,
            2351,
            2357,
            2371,
            2377,
            2381,
            2383,
            2389,
            2393,
            2399,
            2411,
            2417,
            2423,
            2437,
            2441,
            2447,
            2459,
            2467,
            2473,
            2477,
            2503,
            2521,
            2531,
            2539,
            2543,
            2549,
            2551,
            2557,
            2579,
            2591,
            2593,
            2609,
            2617,
            2621,
            2633,
            2647,
            2657,
            2659,
            2663,
            2671,
            2677,
            2683,
            2687,
            2689,
            2693,
            2699,
            2707,
            2711,
            2713,
            2719,
            2729,
            2731,
            2741,
            2749,
            2753,
            2767,
            2777,
            2789,
            2791,
            2797,
            2801,
            2803,
            2819,
            2833,
            2837,
            2843,
            2851,
            2857,
            2861,
            2879,
            2887,
            2897,
            2903,
            2909,
            2917,
            2927,
            2939,
            2953,
            2957,
            2963,
            2969,
            2971,
            2999,
            3001,
            3011,
            3019,
            3023,
            3037,
            3041,
            3049,
            3061,
            3067,
            3079,
            3083,
            3089,
            3109,
            3119,
            3121,
            3137,
            3163,
            3167,
            3169,
            3181,
            3187,
            3191,
            3203,
            3209,
            3217,
            3221,
            3229,
            3251,
            3253,
            3257,
            3259,
            3271,
            3299,
            3301,
            3307,
            3313,
            3319,
            3323,
            3329,
            3331,
            3343,
            3347,
            3359,
            3361,
            3371,
            3373,
            3389,
            3391,
            3407,
            3413,
            3433,
            3449,
            3457,
            3461,
            3463,
            3467,
            3469,
            3491,
            3499,
            3511,
            3517,
            3527,
            3529,
            3533,
            3539,
            3541,
            3547,
            3557,
            3559,
            3571,
            3581,
            3583,
            3593,
            3607,
            3613,
            3617,
            3623,
            3631,
            3637,
            3643,
            3659,
            3671,
            3673,
            3677,
            3691,
            3697,
            3701,
            3709,
            3719,
            3727,
            3733,
            3739,
            3761,
            3767,
            3769,
            3779,
            3793,
            3797,
            3803,
            3821,
            3823,
            3833,
            3847,
            3851,
            3853,
            3863,
            3877,
            3881,
            3889,
            3907,
            3911,
            3917,
            3919,
            3923,
            3929,
            3931,
            3943,
            3947,
            3967,
            3989,
            4001,
            4003,
            4007,
            4013,
            4019,
            4021,
            4027,
            4049,
            4051,
            4057,
            4073,
            4079,
            4091,
            4093,
            4099,
            4111,
            4127,
            4129,
            4133,
            4139,
            4153,
            4157,
            4159,
            4177,
            4201,
            4211,
            4217,
            4219,
            4229,
            4231,
            4241,
            4243,
            4253,
            4259,
            4261,
            4271,
            4273,
            4283,
            4289,
            4297,
            4327,
            4337,
            4339,
            4349,
            4357,
            4363,
            4373,
            4391,
            4397,
            4409,
            4421,
            4423,
            4441,
            4447,
            4451,
            4457,
            4463,
            4481,
            4483,
            4493,
            4507,
            4513,
            4517,
            4519,
            4523,
            4547,
            4549,
            4561,
            4567,
            4583,
            4591,
            4597,
            4603,
            4621,
            4637,
            4639,
            4643,
            4649,
            4651,
            4657,
            4663,
            4673,
            4679,
            4691,
            4703,
            4721,
            4723,
            4729,
            4733,
            4751,
            4759,
            4783,
            4787,
            4789,
            4793,
            4799,
            4801,
            4813,
            4817,
            4831,
            4861,
            4871,
            4877,
            4889,
            4903,
            4909,
            4919,
            4931,
            4933,
            4937,
            4943,
            4951,
            4957,
            4967,
            4969,
            4973,
            4987,
            4993,
            4999,
            5003,
            5009,
            5011,
            5021,
            5023,
            5039,
            5051,
            5059,
            5077,
            5081,
            5087,
            5099,
            5101,
            5107,
            5113,
            5119,
            5147,
            5153,
            5167,
            5171,
            5179,
            5189,
            5197,
            5209,
            5227,
            5231,
            5233,
            5237,
            5261,
            5273,
            5279,
            5281,
            5297,
            5303,
            5309,
            5323,
            5333,
            5347,
            5351,
            5381,
            5387,
            5393,
            5399,
            5407,
            5413,
            5417,
            5419,
            5431,
            5437,
            5441,
            5443,
            5449,
            5471,
            5477,
            5479,
            5483,
            5501,
            5503,
            5507,
            5519,
            5521,
            5527,
            5531,
            5557,
            5563,
            5569,
            5573,
            5581,
            5591,
            5623,
            5639,
            5641,
            5647,
            5651,
            5653,
            5657,
            5659,
            5669,
            5683,
            5689,
            5693,
            5701,
            5711,
            5717,
            5737,
            5741,
            5743,
            5749,
            5779,
            5783,
            5791,
            5801,
            5807,
            5813,
            5821,
            5827,
            5839,
            5843,
            5849,
            5851,
            5857,
            5861,
            5867,
            5869,
            5879,
            5881,
            5897,
            5903,
            5923,
            5927,
            5939,
            5953,
            5981,
            5987,
            6007,
            6011,
            6029,
            6037,
            6043,
            6047,
            6053,
            6067,
            6073,
            6079,
            6089,
            6091,
            6101,
            6113,
            6121,
            6131,
            6133,
            6143,
            6151,
            6163,
            6173,
            6197,
            6199,
            6203,
            6211,
            6217,
            6221,
            6229,
            6247,
            6257,
            6263,
            6269,
            6271,
            6277,
            6287,
            6299,
            6301,
            6311,
            6317,
            6323,
            6329,
            6337,
            6343,
            6353,
            6359,
            6361,
            6367,
            6373,
            6379,
            6389,
            6397,
            6421,
            6427,
            6449,
            6451,
            6469,
            6473,
            6481,
            6491,
            6521,
            6529,
            6547,
            6551,
            6553,
            6563,
            6569,
            6571,
            6577,
            6581,
            6599,
            6607,
            6619,
            6637,
            6653,
            6659,
            6661,
            6673,
            6679,
            6689,
            6691,
            6701,
            6703,
            6709,
            6719,
            6733,
            6737,
            6761,
            6763,
            6779,
            6781,
            6791,
            6793,
            6803,
            6823,
            6827,
            6829,
            6833,
            6841,
            6857,
            6863,
            6869,
            6871,
            6883,
            6899,
            6907,
            6911,
            6917,
            6947,
            6949,
            6959,
            6961,
            6967,
            6971,
            6977,
            6983,
            6991,
            6997,
            7001,
            7013,
            7019,
            7027,
            7039,
            7043,
            7057,
            7069,
            7079,
            7103,
            7109,
            7121,
            7127,
            7129,
            7151,
            7159,
            7177,
            7187,
            7193,
            7207,
            7211,
            7213,
            7219,
            7229,
            7237,
            7243,
            7247,
            7253,
            7283,
            7297,
            7307,
            7309,
            7321,
            7331,
            7333,
            7349,
            7351,
            7369,
            7393,
            7411,
            7417,
            7433,
            7451,
            7457,
            7459,
            7477,
            7481,
            7487,
            7489,
            7499,
            7507,
            7517,
            7523,
            7529,
            7537,
            7541,
            7547,
            7549,
            7559,
            7561,
            7573,
            7577,
            7583,
            7589,
            7591,
            7603,
            7607,
            7621,
            7639,
            7643,
            7649,
            7669,
            7673,
            7681,
            7687,
            7691,
            7699,
            7703,
            7717,
            7723,
            7727,
            7741,
            7753,
            7757,
            7759,
            7789,
            7793,
            7817,
            7823,
            7829,
            7841,
            7853,
            7867,
            7873,
            7877,
            7879,
            7883,
            7901,
            7907,
            7919,
            7927,
            7933,
            7937,
            7949,
            7951,
            7963,
            7993,
            8009,
            8011,
            8017,
            8039,
            8053,
            8059,
            8069,
            8081,
            8087,
            8089,
            8093,
            8101,
            8111,
            8117,
            8123,
            8147,
            8161,
            8167,
            8171,
            8179,
            8191,
            8209,
            8219,
            8221,
            8231,
            8233,
            8237,
            8243,
            8263,
            8269,
            8273,
            8287,
            8291,
            8293,
            8297,
            8311,
            8317,
            8329,
            8353,
            8363,
            8369,
            8377,
            8387,
            8389,
            8419,
            8423,
            8429,
            8431,
            8443,
            8447,
            8461,
            8467,
            8501,
            8513,
            8521,
            8527,
            8537,
            8539,
            8543,
            8563,
            8573,
            8581,
            8597,
            8599,
            8609,
            8623,
            8627,
            8629,
            8641,
            8647,
            8663,
            8669,
            8677,
            8681,
            8689,
            8693,
            8699,
            8707,
            8713,
            8719,
            8731,
            8737,
            8741,
            8747,
            8753,
            8761,
            8779,
            8783,
            8803,
            8807,
            8819,
            8821,
            8831,
            8837,
            8839,
            8849,
            8861,
            8863,
            8867,
            8887,
            8893,
            8923,
            8929,
            8933,
            8941,
            8951,
            8963,
            8969,
            8971,
            8999,
            9001,
            9007,
            9011,
            9013,
            9029,
            9041,
            9043,
            9049,
            9059,
            9067,
            9091,
            9103,
            9109,
            9127,
            9133,
            9137,
            9151,
            9157,
            9161,
            9173,
            9181,
            9187,
            9199,
            9203,
            9209,
            9221,
            9227,
            9239,
            9241,
            9257,
            9277,
            9281,
            9283,
            9293,
            9311,
            9319,
            9323,
            9337,
            9341,
            9343,
            9349,
            9371,
            9377,
            9391,
            9397,
            9403,
            9413,
            9419,
            9421,
            9431,
            9433,
            9437,
            9439,
            9461,
            9463,
            9467,
            9473,
            9479,
            9491,
            9497,
            9511,
            9521,
            9533,
            9539,
            9547,
            9551,
            9587,
            9601,
            9613,
            9619,
            9623,
            9629,
            9631,
            9643,
            9649,
            9661,
            9677,
            9679,
            9689,
            9697,
            9719,
            9721,
            9733,
            9739,
            9743,
            9749,
            9767,
            9769,
            9781,
            9787,
            9791,
            9803,
            9811,
            9817,
            9829,
            9833,
            9839,
            9851,
            9857,
            9859,
            9871,
            9883,
            9887,
            9901,
            9907,
            9923,
            9929,
            9931,
            9941,
            9949,
            9967,
            9973,
            10007
          ],
          emotions: [
            "love",
            "joy",
            "surprise",
            "anger",
            "sadness",
            "fear"
          ]
        };
        var o_hasOwnProperty = Object.prototype.hasOwnProperty;
        var o_keys = Object.keys || function(obj) {
          var result = [];
          for (var key in obj) {
            if (o_hasOwnProperty.call(obj, key)) {
              result.push(key);
            }
          }
          return result;
        };
        function _copyObject(source, target) {
          var keys = o_keys(source);
          var key;
          for (var i = 0, l = keys.length; i < l; i++) {
            key = keys[i];
            target[key] = source[key] || target[key];
          }
        }
        __name(_copyObject, "_copyObject");
        function _copyArray(source, target) {
          for (var i = 0, l = source.length; i < l; i++) {
            target[i] = source[i];
          }
        }
        __name(_copyArray, "_copyArray");
        function copyObject(source, _target) {
          var isArray = Array.isArray(source);
          var target = _target || (isArray ? new Array(source.length) : {});
          if (isArray) {
            _copyArray(source, target);
          } else {
            _copyObject(source, target);
          }
          return target;
        }
        __name(copyObject, "copyObject");
        Chance2.prototype.get = function(name) {
          return copyObject(data[name]);
        };
        Chance2.prototype.mac_address = function(options) {
          options = initOptions(options);
          if (!options.separator) {
            options.separator = options.networkVersion ? "." : ":";
          }
          var mac_pool = "ABCDEF1234567890", mac = "";
          if (!options.networkVersion) {
            mac = this.n(this.string, 6, { pool: mac_pool, length: 2 }).join(options.separator);
          } else {
            mac = this.n(this.string, 3, { pool: mac_pool, length: 4 }).join(options.separator);
          }
          return mac;
        };
        Chance2.prototype.normal = function(options) {
          options = initOptions(options, { mean: 0, dev: 1, pool: [] });
          testRange(options.pool.constructor !== Array, "Chance: The pool option must be a valid array.");
          testRange(typeof options.mean !== "number", "Chance: Mean (mean) must be a number");
          testRange(typeof options.dev !== "number", "Chance: Standard deviation (dev) must be a number");
          if (options.pool.length > 0) {
            return this.normal_pool(options);
          }
          var s2, u2, v, norm, mean = options.mean, dev = options.dev;
          do {
            u2 = this.random() * 2 - 1;
            v = this.random() * 2 - 1;
            s2 = u2 * u2 + v * v;
          } while (s2 >= 1);
          norm = u2 * Math.sqrt(-2 * Math.log(s2) / s2);
          return dev * norm + mean;
        };
        Chance2.prototype.normal_pool = function(options) {
          var performanceCounter = 0;
          do {
            var idx = Math.round(this.normal({ mean: options.mean, dev: options.dev }));
            if (idx < options.pool.length && idx >= 0) {
              return options.pool[idx];
            } else {
              performanceCounter++;
            }
          } while (performanceCounter < 100);
          throw new RangeError("Chance: Your pool is too small for the given mean and standard deviation. Please adjust.");
        };
        Chance2.prototype.radio = function(options) {
          options = initOptions(options, { side: "?" });
          var fl = "";
          switch (options.side.toLowerCase()) {
            case "east":
            case "e":
              fl = "W";
              break;
            case "west":
            case "w":
              fl = "K";
              break;
            default:
              fl = this.character({ pool: "KW" });
              break;
          }
          return fl + this.character({ alpha: true, casing: "upper" }) + this.character({ alpha: true, casing: "upper" }) + this.character({ alpha: true, casing: "upper" });
        };
        Chance2.prototype.set = function(name, values) {
          if (typeof name === "string") {
            data[name] = values;
          } else {
            data = copyObject(name, data);
          }
        };
        Chance2.prototype.tv = function(options) {
          return this.radio(options);
        };
        Chance2.prototype.cnpj = function() {
          var n = this.n(this.natural, 8, { max: 9 });
          var d1 = 2 + n[7] * 6 + n[6] * 7 + n[5] * 8 + n[4] * 9 + n[3] * 2 + n[2] * 3 + n[1] * 4 + n[0] * 5;
          d1 = 11 - d1 % 11;
          if (d1 >= 10) {
            d1 = 0;
          }
          var d2 = d1 * 2 + 3 + n[7] * 7 + n[6] * 8 + n[5] * 9 + n[4] * 2 + n[3] * 3 + n[2] * 4 + n[1] * 5 + n[0] * 6;
          d2 = 11 - d2 % 11;
          if (d2 >= 10) {
            d2 = 0;
          }
          return "" + n[0] + n[1] + "." + n[2] + n[3] + n[4] + "." + n[5] + n[6] + n[7] + "/0001-" + d1 + d2;
        };
        Chance2.prototype.emotion = function() {
          return this.pick(this.get("emotions"));
        };
        Chance2.prototype.mersenne_twister = function(seed) {
          return new MersenneTwister(seed);
        };
        Chance2.prototype.blueimp_md5 = function() {
          return new BlueImpMD5();
        };
        var MersenneTwister = /* @__PURE__ */ __name(function(seed) {
          if (seed === void 0) {
            seed = Math.floor(Math.random() * Math.pow(10, 13));
          }
          this.N = 624;
          this.M = 397;
          this.MATRIX_A = 2567483615;
          this.UPPER_MASK = 2147483648;
          this.LOWER_MASK = 2147483647;
          this.mt = new Array(this.N);
          this.mti = this.N + 1;
          this.init_genrand(seed);
        }, "MersenneTwister");
        MersenneTwister.prototype.init_genrand = function(s2) {
          this.mt[0] = s2 >>> 0;
          for (this.mti = 1; this.mti < this.N; this.mti++) {
            s2 = this.mt[this.mti - 1] ^ this.mt[this.mti - 1] >>> 30;
            this.mt[this.mti] = (((s2 & 4294901760) >>> 16) * 1812433253 << 16) + (s2 & 65535) * 1812433253 + this.mti;
            this.mt[this.mti] >>>= 0;
          }
        };
        MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
          var i = 1, j = 0, k2, s2;
          this.init_genrand(19650218);
          k2 = this.N > key_length ? this.N : key_length;
          for (; k2; k2--) {
            s2 = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
            this.mt[i] = (this.mt[i] ^ (((s2 & 4294901760) >>> 16) * 1664525 << 16) + (s2 & 65535) * 1664525) + init_key[j] + j;
            this.mt[i] >>>= 0;
            i++;
            j++;
            if (i >= this.N) {
              this.mt[0] = this.mt[this.N - 1];
              i = 1;
            }
            if (j >= key_length) {
              j = 0;
            }
          }
          for (k2 = this.N - 1; k2; k2--) {
            s2 = this.mt[i - 1] ^ this.mt[i - 1] >>> 30;
            this.mt[i] = (this.mt[i] ^ (((s2 & 4294901760) >>> 16) * 1566083941 << 16) + (s2 & 65535) * 1566083941) - i;
            this.mt[i] >>>= 0;
            i++;
            if (i >= this.N) {
              this.mt[0] = this.mt[this.N - 1];
              i = 1;
            }
          }
          this.mt[0] = 2147483648;
        };
        MersenneTwister.prototype.genrand_int32 = function() {
          var y;
          var mag01 = new Array(0, this.MATRIX_A);
          if (this.mti >= this.N) {
            var kk;
            if (this.mti === this.N + 1) {
              this.init_genrand(5489);
            }
            for (kk = 0; kk < this.N - this.M; kk++) {
              y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
              this.mt[kk] = this.mt[kk + this.M] ^ y >>> 1 ^ mag01[y & 1];
            }
            for (; kk < this.N - 1; kk++) {
              y = this.mt[kk] & this.UPPER_MASK | this.mt[kk + 1] & this.LOWER_MASK;
              this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ y >>> 1 ^ mag01[y & 1];
            }
            y = this.mt[this.N - 1] & this.UPPER_MASK | this.mt[0] & this.LOWER_MASK;
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ y >>> 1 ^ mag01[y & 1];
            this.mti = 0;
          }
          y = this.mt[this.mti++];
          y ^= y >>> 11;
          y ^= y << 7 & 2636928640;
          y ^= y << 15 & 4022730752;
          y ^= y >>> 18;
          return y >>> 0;
        };
        MersenneTwister.prototype.genrand_int31 = function() {
          return this.genrand_int32() >>> 1;
        };
        MersenneTwister.prototype.genrand_real1 = function() {
          return this.genrand_int32() * (1 / 4294967295);
        };
        MersenneTwister.prototype.random = function() {
          return this.genrand_int32() * (1 / 4294967296);
        };
        MersenneTwister.prototype.genrand_real3 = function() {
          return (this.genrand_int32() + 0.5) * (1 / 4294967296);
        };
        MersenneTwister.prototype.genrand_res53 = function() {
          var a = this.genrand_int32() >>> 5, b = this.genrand_int32() >>> 6;
          return (a * 67108864 + b) * (1 / 9007199254740992);
        };
        var BlueImpMD5 = /* @__PURE__ */ __name(function() {
        }, "BlueImpMD5");
        BlueImpMD5.prototype.VERSION = "1.0.1";
        BlueImpMD5.prototype.safe_add = /* @__PURE__ */ __name(function safe_add(x, y) {
          var lsw = (x & 65535) + (y & 65535), msw = (x >> 16) + (y >> 16) + (lsw >> 16);
          return msw << 16 | lsw & 65535;
        }, "safe_add");
        BlueImpMD5.prototype.bit_roll = function(num, cnt) {
          return num << cnt | num >>> 32 - cnt;
        };
        BlueImpMD5.prototype.md5_cmn = function(q, a, b, x, s2, t) {
          return this.safe_add(this.bit_roll(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s2), b);
        };
        BlueImpMD5.prototype.md5_ff = function(a, b, c, d, x, s2, t) {
          return this.md5_cmn(b & c | ~b & d, a, b, x, s2, t);
        };
        BlueImpMD5.prototype.md5_gg = function(a, b, c, d, x, s2, t) {
          return this.md5_cmn(b & d | c & ~d, a, b, x, s2, t);
        };
        BlueImpMD5.prototype.md5_hh = function(a, b, c, d, x, s2, t) {
          return this.md5_cmn(b ^ c ^ d, a, b, x, s2, t);
        };
        BlueImpMD5.prototype.md5_ii = function(a, b, c, d, x, s2, t) {
          return this.md5_cmn(c ^ (b | ~d), a, b, x, s2, t);
        };
        BlueImpMD5.prototype.binl_md5 = function(x, len) {
          x[len >> 5] |= 128 << len % 32;
          x[(len + 64 >>> 9 << 4) + 14] = len;
          var i, olda, oldb, oldc, oldd, a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
          for (i = 0; i < x.length; i += 16) {
            olda = a;
            oldb = b;
            oldc = c;
            oldd = d;
            a = this.md5_ff(a, b, c, d, x[i], 7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.md5_gg(b, c, d, a, x[i], 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.md5_hh(d, a, b, c, x[i], 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = this.md5_ii(a, b, c, d, x[i], 6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);
            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
          }
          return [a, b, c, d];
        };
        BlueImpMD5.prototype.binl2rstr = function(input) {
          var i, output = "";
          for (i = 0; i < input.length * 32; i += 8) {
            output += String.fromCharCode(input[i >> 5] >>> i % 32 & 255);
          }
          return output;
        };
        BlueImpMD5.prototype.rstr2binl = function(input) {
          var i, output = [];
          output[(input.length >> 2) - 1] = void 0;
          for (i = 0; i < output.length; i += 1) {
            output[i] = 0;
          }
          for (i = 0; i < input.length * 8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 255) << i % 32;
          }
          return output;
        };
        BlueImpMD5.prototype.rstr_md5 = function(s2) {
          return this.binl2rstr(this.binl_md5(this.rstr2binl(s2), s2.length * 8));
        };
        BlueImpMD5.prototype.rstr_hmac_md5 = function(key, data2) {
          var i, bkey = this.rstr2binl(key), ipad = [], opad = [], hash;
          ipad[15] = opad[15] = void 0;
          if (bkey.length > 16) {
            bkey = this.binl_md5(bkey, key.length * 8);
          }
          for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 909522486;
            opad[i] = bkey[i] ^ 1549556828;
          }
          hash = this.binl_md5(ipad.concat(this.rstr2binl(data2)), 512 + data2.length * 8);
          return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
        };
        BlueImpMD5.prototype.rstr2hex = function(input) {
          var hex_tab = "0123456789abcdef", output = "", x, i;
          for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i);
            output += hex_tab.charAt(x >>> 4 & 15) + hex_tab.charAt(x & 15);
          }
          return output;
        };
        BlueImpMD5.prototype.str2rstr_utf8 = function(input) {
          return unescape(encodeURIComponent(input));
        };
        BlueImpMD5.prototype.raw_md5 = function(s2) {
          return this.rstr_md5(this.str2rstr_utf8(s2));
        };
        BlueImpMD5.prototype.hex_md5 = function(s2) {
          return this.rstr2hex(this.raw_md5(s2));
        };
        BlueImpMD5.prototype.raw_hmac_md5 = function(k2, d) {
          return this.rstr_hmac_md5(this.str2rstr_utf8(k2), this.str2rstr_utf8(d));
        };
        BlueImpMD5.prototype.hex_hmac_md5 = function(k2, d) {
          return this.rstr2hex(this.raw_hmac_md5(k2, d));
        };
        BlueImpMD5.prototype.md5 = function(string, key, raw) {
          if (!key) {
            if (!raw) {
              return this.hex_md5(string);
            }
            return this.raw_md5(string);
          }
          if (!raw) {
            return this.hex_hmac_md5(key, string);
          }
          return this.raw_hmac_md5(key, string);
        };
        if (typeof exports !== "undefined") {
          if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = Chance2;
          }
          exports.Chance = Chance2;
        }
        if (typeof define === "function" && define.amd) {
          define([], function() {
            return Chance2;
          });
        }
        if (typeof importScripts !== "undefined") {
          chance = new Chance2();
          self.Chance = Chance2;
        }
        if (typeof window === "object" && typeof window.document === "object") {
          window.Chance = Chance2;
          window.chance = new Chance2();
        }
      })();
    }
  });

  // node_modules/kaboom/dist/kaboom.mjs
  var Ct = Object.defineProperty;
  var jr = Object.defineProperties;
  var Or = Object.getOwnPropertyDescriptors;
  var Pt = Object.getOwnPropertySymbols;
  var Qr = Object.prototype.hasOwnProperty;
  var Kr = Object.prototype.propertyIsEnumerable;
  var dt2 = /* @__PURE__ */ __name((e, r, t) => r in e ? Ct(e, r, { enumerable: true, configurable: true, writable: true, value: t }) : e[r] = t, "dt");
  var Ce = /* @__PURE__ */ __name((e, r) => {
    for (var t in r || (r = {}))
      Qr.call(r, t) && dt2(e, t, r[t]);
    if (Pt)
      for (var t of Pt(r))
        Kr.call(r, t) && dt2(e, t, r[t]);
    return e;
  }, "Ce");
  var Re = /* @__PURE__ */ __name((e, r) => jr(e, Or(r)), "Re");
  var s = /* @__PURE__ */ __name((e, r) => Ct(e, "name", { value: r, configurable: true }), "s");
  var se = /* @__PURE__ */ __name((e, r) => () => (e && (r = e(e = 0)), r), "se");
  var en = /* @__PURE__ */ __name((e, r) => () => (r || e((r = { exports: {} }).exports, r), r.exports), "en");
  var St = /* @__PURE__ */ __name((e, r, t) => (dt2(e, typeof r != "symbol" ? r + "" : r, t), t), "St");
  var Dt = /* @__PURE__ */ __name((e, r, t) => new Promise((c, x) => {
    var P = /* @__PURE__ */ __name((S) => {
      try {
        C(t.next(S));
      } catch (Z) {
        x(Z);
      }
    }, "P"), w = /* @__PURE__ */ __name((S) => {
      try {
        C(t.throw(S));
      } catch (Z) {
        x(Z);
      }
    }, "w"), C = /* @__PURE__ */ __name((S) => S.done ? c(S.value) : Promise.resolve(S.value).then(P, w), "C");
    C((t = t.apply(e, r)).next());
  }), "Dt");
  var Tt = (() => {
    for (var e = new Uint8Array(128), r = 0; r < 64; r++)
      e[r < 26 ? r + 65 : r < 52 ? r + 71 : r < 62 ? r - 4 : r * 4 - 205] = r;
    return (t) => {
      for (var c = t.length, x = new Uint8Array((c - (t[c - 1] == "=") - (t[c - 2] == "=")) * 3 / 4 | 0), P = 0, w = 0; P < c; ) {
        var C = e[t.charCodeAt(P++)], S = e[t.charCodeAt(P++)], Z = e[t.charCodeAt(P++)], X = e[t.charCodeAt(P++)];
        x[w++] = C << 2 | S >> 4, x[w++] = S << 4 | Z >> 2, x[w++] = Z << 6 | X;
      }
      return x;
    };
  })();
  function _e(e) {
    return e * Math.PI / 180;
  }
  __name(_e, "_e");
  function ht(e) {
    return e * 180 / Math.PI;
  }
  __name(ht, "ht");
  function fe(e, r, t) {
    return r > t ? fe(e, t, r) : Math.min(Math.max(e, r), t);
  }
  __name(fe, "fe");
  function qe(e, r, t) {
    return e + (r - e) * t;
  }
  __name(qe, "qe");
  function Ae(e, r, t, c, x) {
    return c + (e - r) / (t - r) * (x - c);
  }
  __name(Ae, "Ae");
  function Rt(e, r, t, c, x) {
    return fe(Ae(e, r, t, c, x), c, x);
  }
  __name(Rt, "Rt");
  function u(...e) {
    if (e.length === 0)
      return u(0, 0);
    if (e.length === 1) {
      if (typeof e[0] == "number")
        return u(e[0], e[0]);
      if (Fe(e[0]))
        return u(e[0].x, e[0].y);
      if (Array.isArray(e[0]) && e[0].length === 2)
        return u.apply(null, e[0]);
    }
    return { x: e[0], y: e[1], clone() {
      return u(this.x, this.y);
    }, add(...r) {
      let t = u(...r);
      return u(this.x + t.x, this.y + t.y);
    }, sub(...r) {
      let t = u(...r);
      return u(this.x - t.x, this.y - t.y);
    }, scale(...r) {
      let t = u(...r);
      return u(this.x * t.x, this.y * t.y);
    }, dist(...r) {
      let t = u(...r);
      return Math.sqrt((this.x - t.x) * (this.x - t.x) + (this.y - t.y) * (this.y - t.y));
    }, len() {
      return this.dist(u(0, 0));
    }, unit() {
      return this.scale(1 / this.len());
    }, normal() {
      return u(this.y, -this.x);
    }, dot(r) {
      return this.x * r.x + this.y * r.y;
    }, angle(...r) {
      let t = u(...r);
      return ht(Math.atan2(this.y - t.y, this.x - t.x));
    }, lerp(r, t) {
      return u(qe(this.x, r.x, t), qe(this.y, r.y, t));
    }, toFixed(r) {
      return u(this.x.toFixed(r), this.y.toFixed(r));
    }, eq(r) {
      return this.x === r.x && this.y === r.y;
    }, str() {
      return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
    } };
  }
  __name(u, "u");
  function je(e) {
    let r = _e(e);
    return u(Math.cos(r), Math.sin(r));
  }
  __name(je, "je");
  function we(e, r, t) {
    return { x: e, y: r, z: t, xy() {
      return u(this.x, this.y);
    } };
  }
  __name(we, "we");
  function Fe(e) {
    return e !== void 0 && e.x !== void 0 && e.y !== void 0;
  }
  __name(Fe, "Fe");
  function At(e) {
    return e !== void 0 && e.x !== void 0 && e.y !== void 0 && e.z !== void 0;
  }
  __name(At, "At");
  function We(e) {
    return e !== void 0 && e.r !== void 0 && e.g !== void 0 && e.b !== void 0;
  }
  __name(We, "We");
  function kt(e) {
    if (e !== void 0 && Array.isArray(e.m) && e.m.length === 16)
      return e;
  }
  __name(kt, "kt");
  function H(...e) {
    if (e.length === 0)
      return H(255, 255, 255);
    if (e.length === 1) {
      if (We(e[0]))
        return H(e[0].r, e[0].g, e[0].b);
      if (Array.isArray(e[0]) && e[0].length === 3)
        return H.apply(null, e[0]);
    }
    return { r: fe(~~e[0], 0, 255), g: fe(~~e[1], 0, 255), b: fe(~~e[2], 0, 255), clone() {
      return H(this.r, this.g, this.b);
    }, lighten(r) {
      return H(this.r + r, this.g + r, this.b + r);
    }, darken(r) {
      return this.lighten(-r);
    }, invert() {
      return H(255 - this.r, 255 - this.g, 255 - this.b);
    }, eq(r) {
      return this.r === r.r && this.g === r.g && this.b === r.g;
    }, str() {
      return `(${this.r}, ${this.g}, ${this.b})`;
    } };
  }
  __name(H, "H");
  function he(e, r, t, c) {
    return { x: e != null ? e : 0, y: r != null ? r : 0, w: t != null ? t : 1, h: c != null ? c : 1, scale(x) {
      return he(this.x + this.w * x.x, this.y + this.h * x.y, this.w * x.w, this.h * x.h);
    }, clone() {
      return he(this.x, this.y, this.w, this.h);
    }, eq(x) {
      return this.x === x.x && this.y === x.y && this.w === x.w && this.h === x.h;
    } };
  }
  __name(he, "he");
  function ue(e) {
    return { m: e ? [...e] : [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], clone() {
      return ue(this.m);
    }, mult(r) {
      let t = [];
      for (let c = 0; c < 4; c++)
        for (let x = 0; x < 4; x++)
          t[c * 4 + x] = this.m[0 * 4 + x] * r.m[c * 4 + 0] + this.m[1 * 4 + x] * r.m[c * 4 + 1] + this.m[2 * 4 + x] * r.m[c * 4 + 2] + this.m[3 * 4 + x] * r.m[c * 4 + 3];
      return ue(t);
    }, multVec4(r) {
      return { x: r.x * this.m[0] + r.y * this.m[4] + r.z * this.m[8] + r.w * this.m[12], y: r.x * this.m[1] + r.y * this.m[5] + r.z * this.m[9] + r.w * this.m[13], z: r.x * this.m[2] + r.y * this.m[6] + r.z * this.m[10] + r.w * this.m[14], w: r.x * this.m[3] + r.y * this.m[7] + r.z * this.m[11] + r.w * this.m[15] };
    }, multVec3(r) {
      let t = this.multVec4({ x: r.x, y: r.y, z: r.z, w: 1 });
      return we(t.x, t.y, t.z);
    }, multVec2(r) {
      return u(r.x * this.m[0] + r.y * this.m[4] + 0 * this.m[8] + 1 * this.m[12], r.x * this.m[1] + r.y * this.m[5] + 0 * this.m[9] + 1 * this.m[13]);
    }, translate(r) {
      return this.mult(ue([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, r.x, r.y, 0, 1]));
    }, scale(r) {
      return this.mult(ue([r.x, 0, 0, 0, 0, r.y, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
    }, rotateX(r) {
      return r = _e(-r), this.mult(ue([1, 0, 0, 0, 0, Math.cos(r), -Math.sin(r), 0, 0, Math.sin(r), Math.cos(r), 0, 0, 0, 0, 1]));
    }, rotateY(r) {
      return r = _e(-r), this.mult(ue([Math.cos(r), 0, Math.sin(r), 0, 0, 1, 0, 0, -Math.sin(r), 0, Math.cos(r), 0, 0, 0, 0, 1]));
    }, rotateZ(r) {
      return r = _e(-r), this.mult(ue([Math.cos(r), -Math.sin(r), 0, 0, Math.sin(r), Math.cos(r), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
    }, invert() {
      let r = [], t = this.m[10] * this.m[15] - this.m[14] * this.m[11], c = this.m[9] * this.m[15] - this.m[13] * this.m[11], x = this.m[9] * this.m[14] - this.m[13] * this.m[10], P = this.m[8] * this.m[15] - this.m[12] * this.m[11], w = this.m[8] * this.m[14] - this.m[12] * this.m[10], C = this.m[8] * this.m[13] - this.m[12] * this.m[9], S = this.m[6] * this.m[15] - this.m[14] * this.m[7], Z = this.m[5] * this.m[15] - this.m[13] * this.m[7], X = this.m[5] * this.m[14] - this.m[13] * this.m[6], ee = this.m[4] * this.m[15] - this.m[12] * this.m[7], G = this.m[4] * this.m[14] - this.m[12] * this.m[6], re = this.m[5] * this.m[15] - this.m[13] * this.m[7], O = this.m[4] * this.m[13] - this.m[12] * this.m[5], j = this.m[6] * this.m[11] - this.m[10] * this.m[7], te = this.m[5] * this.m[11] - this.m[9] * this.m[7], me = this.m[5] * this.m[10] - this.m[9] * this.m[6], m = this.m[4] * this.m[11] - this.m[8] * this.m[7], pe = this.m[4] * this.m[10] - this.m[8] * this.m[6], D = this.m[4] * this.m[9] - this.m[8] * this.m[5];
      r[0] = this.m[5] * t - this.m[6] * c + this.m[7] * x, r[4] = -(this.m[4] * t - this.m[6] * P + this.m[7] * w), r[8] = this.m[4] * c - this.m[5] * P + this.m[7] * C, r[12] = -(this.m[4] * x - this.m[5] * w + this.m[6] * C), r[1] = -(this.m[1] * t - this.m[2] * c + this.m[3] * x), r[5] = this.m[0] * t - this.m[2] * P + this.m[3] * w, r[9] = -(this.m[0] * c - this.m[1] * P + this.m[3] * C), r[13] = this.m[0] * x - this.m[1] * w + this.m[2] * C, r[2] = this.m[1] * S - this.m[2] * Z + this.m[3] * X, r[6] = -(this.m[0] * S - this.m[2] * ee + this.m[3] * G), r[10] = this.m[0] * re - this.m[1] * ee + this.m[3] * O, r[14] = -(this.m[0] * X - this.m[1] * G + this.m[2] * O), r[3] = -(this.m[1] * j - this.m[2] * te + this.m[3] * me), r[7] = this.m[0] * j - this.m[2] * m + this.m[3] * pe, r[11] = -(this.m[0] * te - this.m[1] * m + this.m[3] * D), r[15] = this.m[0] * me - this.m[1] * pe + this.m[2] * D;
      let E = this.m[0] * r[0] + this.m[1] * r[4] + this.m[2] * r[8] + this.m[3] * r[12];
      for (let M = 0; M < 4; M++)
        for (let J = 0; J < 4; J++)
          r[M * 4 + J] *= 1 / E;
      return ue(r);
    } };
  }
  __name(ue, "ue");
  function Vt(e, r, t) {
    return e + (Math.sin(t) + 1) / 2 * (r - e);
  }
  __name(Vt, "Vt");
  function ft(e) {
    return { seed: e, gen(...r) {
      if (r.length === 0)
        return this.seed = (tn * this.seed + rn) % It, this.seed / It;
      if (r.length === 1) {
        if (typeof r[0] == "number")
          return this.gen(0, r[0]);
        if (Fe(r[0]))
          return this.gen(u(0, 0), r[0]);
        if (We(r[0]))
          return this.gen(H(0, 0, 0), r[0]);
      } else if (r.length === 2) {
        if (typeof r[0] == "number" && typeof r[1] == "number")
          return this.gen() * (r[1] - r[0]) + r[0];
        if (Fe(r[0]) && Fe(r[1]))
          return u(this.gen(r[0].x, r[1].x), this.gen(r[0].y, r[1].y));
        if (We(r[0]) && We(r[1]))
          return H(this.gen(r[0].r, r[1].r), this.gen(r[0].g, r[1].g), this.gen(r[0].b, r[1].b));
      }
    } };
  }
  __name(ft, "ft");
  function Mt(e) {
    return e != null && (lt.seed = e), lt.seed;
  }
  __name(Mt, "Mt");
  function $e(...e) {
    return lt.gen(...e);
  }
  __name($e, "$e");
  function mt(...e) {
    return Math.floor($e(...e));
  }
  __name(mt, "mt");
  function _t(e) {
    return $e() <= e;
  }
  __name(_t, "_t");
  function Ft(e) {
    return e[mt(e.length)];
  }
  __name(Ft, "Ft");
  function Oe(e, r) {
    return e.p2.x >= r.p1.x && e.p1.x <= r.p2.x && e.p2.y >= r.p1.y && e.p1.y <= r.p2.y;
  }
  __name(Oe, "Oe");
  function Wt(e, r) {
    return e.p2.x > r.p1.x && e.p1.x < r.p2.x && e.p2.y > r.p1.y && e.p1.y < r.p2.y;
  }
  __name(Wt, "Wt");
  function Xt(e, r) {
    if (e.p1.x === e.p2.x && e.p1.y === e.p2.y || r.p1.x === r.p2.x && r.p1.y === r.p2.y)
      return null;
    let t = (r.p2.y - r.p1.y) * (e.p2.x - e.p1.x) - (r.p2.x - r.p1.x) * (e.p2.y - e.p1.y);
    if (t === 0)
      return null;
    let c = ((r.p2.x - r.p1.x) * (e.p1.y - r.p1.y) - (r.p2.y - r.p1.y) * (e.p1.x - r.p1.x)) / t, x = ((e.p2.x - e.p1.x) * (e.p1.y - r.p1.y) - (e.p2.y - e.p1.y) * (e.p1.x - r.p1.x)) / t;
    return c < 0 || c > 1 || x < 0 || x > 1 ? null : c;
  }
  __name(Xt, "Xt");
  function Lt(e, r) {
    if (e.p1.x === e.p2.x && e.p1.y === e.p2.y || r.p1.x === r.p2.x && r.p1.y === r.p2.y)
      return null;
    let t = (r.p2.y - r.p1.y) * (e.p2.x - e.p1.x) - (r.p2.x - r.p1.x) * (e.p2.y - e.p1.y);
    if (t === 0)
      return null;
    let c = ((r.p2.x - r.p1.x) * (e.p1.y - r.p1.y) - (r.p2.y - r.p1.y) * (e.p1.x - r.p1.x)) / t, x = ((e.p2.x - e.p1.x) * (e.p1.y - r.p1.y) - (e.p2.y - e.p1.y) * (e.p1.x - r.p1.x)) / t;
    return c < 0 || c > 1 || x < 0 || x > 1 ? null : u(e.p1.x + c * (e.p2.x - e.p1.x), e.p1.y + c * (e.p2.y - e.p1.y));
  }
  __name(Lt, "Lt");
  function qt(e, r) {
    return r.x >= e.p1.x && r.x <= e.p2.x && r.y >= e.p1.y && r.y <= e.p2.y;
  }
  __name(qt, "qt");
  function Qe(e, r) {
    return r.x > e.p1.x && r.x < e.p2.x && r.y > e.p1.y && r.y < e.p2.y;
  }
  __name(Qe, "Qe");
  function Ke(e, r) {
    return { p1: u(e.p1.x - r.p2.x, e.p1.y - r.p2.y), p2: u(e.p2.x - r.p1.x, e.p2.y - r.p1.y) };
  }
  __name(Ke, "Ke");
  var tn;
  var rn;
  var It;
  var lt;
  var ke = se(() => {
    s(_e, "deg2rad");
    s(ht, "rad2deg");
    s(fe, "clamp");
    s(qe, "lerp");
    s(Ae, "map");
    s(Rt, "mapc");
    s(u, "vec2");
    s(je, "dir");
    s(we, "vec3");
    s(Fe, "isVec2");
    s(At, "isVec3");
    s(We, "isColor");
    s(kt, "isMat4");
    s(H, "rgb");
    s(he, "quad");
    s(ue, "mat4");
    s(Vt, "wave");
    tn = 1103515245, rn = 12345, It = 2147483648, lt = ft(Date.now());
    s(ft, "rng");
    s(Mt, "randSeed");
    s($e, "rand");
    s(mt, "randi");
    s(_t, "chance");
    s(Ft, "choose");
    s(Oe, "colRectRect");
    s(Wt, "overlapRectRect");
    s(Xt, "colLineLine2");
    s(Lt, "colLineLine");
    s(qt, "colRectPt");
    s(Qe, "ovrRectPt");
    s(Ke, "minkDiff");
  });
  function pt(e, r) {
    let t = typeof e, c = typeof r;
    if (t !== c)
      return false;
    if (t === "object" && c === "object") {
      let x = Object.keys(e), P = Object.keys(r);
      if (x.length !== P.length)
        return false;
      for (let w of x) {
        let C = e[w], S = r[w];
        if (!(typeof C == "function" && typeof S == "function") && !pt(C, S))
          return false;
      }
      return true;
    }
    return e === r;
  }
  __name(pt, "pt");
  var le;
  var yt = se(() => {
    le = /* @__PURE__ */ __name(class extends Map {
      constructor(...r) {
        super(...r);
        St(this, "_lastID");
        this._lastID = 0;
      }
      push(r) {
        let t = this._lastID;
        return this.set(t, r), this._lastID++, t;
      }
      pushd(r) {
        let t = this.push(r);
        return () => this.delete(t);
      }
    }, "le");
    s(le, "IDList");
    s(pt, "deepEq");
  });
  function Xe(e) {
    switch (e) {
      case "topleft":
        return u(-1, -1);
      case "top":
        return u(0, -1);
      case "topright":
        return u(1, -1);
      case "left":
        return u(-1, 0);
      case "center":
        return u(0, 0);
      case "right":
        return u(1, 0);
      case "botleft":
        return u(-1, 1);
      case "bot":
        return u(0, 1);
      case "botright":
        return u(1, 1);
      default:
        return e;
    }
  }
  __name(Xe, "Xe");
  function Yt(e, r) {
    let t = (() => {
      var z2;
      let l = P(Ut, bt), y = x(new ImageData(new Uint8ClampedArray([255, 255, 255, 255]), 1, 1)), g = (z2 = r.background) != null ? z2 : H(0, 0, 0);
      e.clearColor(g.r / 255, g.g / 255, g.b / 255, 1), e.enable(e.BLEND), e.enable(e.SCISSOR_TEST), e.blendFuncSeparate(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
      let v = e.createBuffer();
      e.bindBuffer(e.ARRAY_BUFFER, v), e.bufferData(e.ARRAY_BUFFER, tt * 4, e.DYNAMIC_DRAW), e.bindBuffer(e.ARRAY_BUFFER, null);
      let A = e.createBuffer();
      e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, A), e.bufferData(e.ELEMENT_ARRAY_BUFFER, tt * 2, e.DYNAMIC_DRAW), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null);
      let R = x(new ImageData(new Uint8ClampedArray([128, 128, 128, 255, 190, 190, 190, 255, 190, 190, 190, 255, 128, 128, 128, 255]), 2, 2), { wrap: "repeat", filter: "nearest" });
      return { drawCalls: 0, lastDrawCalls: 0, defProg: l, curProg: l, defTex: y, curTex: y, curUniform: {}, vbuf: v, ibuf: A, vqueue: [], iqueue: [], transform: ue(), transformStack: [], background: g, bgTex: R, width: r.width, height: r.height };
    })();
    function c(l) {
      return Math.log(l) / Math.log(2) % 1 == 0;
    }
    __name(c, "c");
    s(c, "powerOfTwo");
    function x(l, y = {}) {
      let g = e.createTexture();
      e.bindTexture(e.TEXTURE_2D, g), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, l);
      let v = (() => {
        var R;
        switch ((R = y.filter) != null ? R : r.texFilter) {
          case "linear":
            return e.LINEAR;
          case "nearest":
            return e.NEAREST;
          default:
            return e.NEAREST;
        }
      })(), A = (() => {
        switch (y.wrap) {
          case "repeat":
            return e.REPEAT;
          case "clampToEdge":
            return e.CLAMP_TO_EDGE;
          default:
            return e.CLAMP_TO_EDGE;
        }
      })();
      return e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, v), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, v), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, A), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, A), e.bindTexture(e.TEXTURE_2D, null), { width: l.width, height: l.height, bind() {
        e.bindTexture(e.TEXTURE_2D, g);
      }, unbind() {
        e.bindTexture(e.TEXTURE_2D, null);
      } };
    }
    __name(x, "x");
    s(x, "makeTex");
    function P(l = Ut, y = bt) {
      let g, v = nn.replace("{{user}}", l != null ? l : Ut), A = sn.replace("{{user}}", y != null ? y : bt), R = e.createShader(e.VERTEX_SHADER), z2 = e.createShader(e.FRAGMENT_SHADER);
      if (e.shaderSource(R, v), e.shaderSource(z2, A), e.compileShader(R), e.compileShader(z2), g = e.getShaderInfoLog(R))
        throw new Error(g);
      if (g = e.getShaderInfoLog(z2))
        throw new Error(g);
      let k2 = e.createProgram();
      if (e.attachShader(k2, R), e.attachShader(k2, z2), e.bindAttribLocation(k2, 0, "a_pos"), e.bindAttribLocation(k2, 1, "a_uv"), e.bindAttribLocation(k2, 2, "a_color"), e.linkProgram(k2), (g = e.getProgramInfoLog(k2)) && g !== `
`)
        throw new Error(g);
      return { bind() {
        e.useProgram(k2);
      }, unbind() {
        e.useProgram(null);
      }, bindAttribs() {
        e.vertexAttribPointer(0, 3, e.FLOAT, false, Ye * 4, 0), e.enableVertexAttribArray(0), e.vertexAttribPointer(1, 2, e.FLOAT, false, Ye * 4, 12), e.enableVertexAttribArray(1), e.vertexAttribPointer(2, 4, e.FLOAT, false, Ye * 4, 20), e.enableVertexAttribArray(2);
      }, send(T) {
        this.bind();
        for (let Q in T) {
          let q = T[Q], K = e.getUniformLocation(k2, Q);
          typeof q == "number" ? e.uniform1f(K, q) : kt(q) ? e.uniformMatrix4fv(K, false, new Float32Array(q.m)) : We(q) ? e.uniform4f(K, q.r, q.g, q.b, q.a) : At(q) ? e.uniform3f(K, q.x, q.y, q.z) : Fe(q) && e.uniform2f(K, q.x, q.y);
        }
        this.unbind();
      } };
    }
    __name(P, "P");
    s(P, "makeProgram");
    function w(l, y, g, v) {
      let A = l.width / y, R = l.height / g, z2 = 1 / A, k2 = 1 / R, T = {}, Q = v.split("").entries();
      for (let [q, K] of Q)
        T[K] = u(q % A * z2, Math.floor(q / A) * k2);
      return { tex: l, map: T, qw: z2, qh: k2 };
    }
    __name(w, "w");
    s(w, "makeFont");
    function C(l, y, g = t.defTex, v = t.defProg, A = {}) {
      g = g != null ? g : t.defTex, v = v != null ? v : t.defProg, (g !== t.curTex || v !== t.curProg || !pt(t.curUniform, A) || t.vqueue.length + l.length * Ye > tt || t.iqueue.length + y.length > tt) && S(), t.curTex = g, t.curProg = v, t.curUniform = A;
      let R = y.map((k2) => k2 + t.vqueue.length / Ye), z2 = l.map((k2) => {
        let T = G(t.transform.multVec2(k2.pos.xy()));
        return [T.x, T.y, k2.pos.z, k2.uv.x, k2.uv.y, k2.color.r / 255, k2.color.g / 255, k2.color.b / 255, k2.opacity];
      }).flat();
      R.forEach((k2) => t.iqueue.push(k2)), z2.forEach((k2) => t.vqueue.push(k2));
    }
    __name(C, "C");
    s(C, "drawRaw");
    function S() {
      !t.curTex || !t.curProg || t.vqueue.length === 0 || t.iqueue.length === 0 || (t.curProg.send(t.curUniform), e.bindBuffer(e.ARRAY_BUFFER, t.vbuf), e.bufferSubData(e.ARRAY_BUFFER, 0, new Float32Array(t.vqueue)), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, t.ibuf), e.bufferSubData(e.ELEMENT_ARRAY_BUFFER, 0, new Uint16Array(t.iqueue)), t.curProg.bind(), t.curProg.bindAttribs(), t.curTex.bind(), e.drawElements(e.TRIANGLES, t.iqueue.length, e.UNSIGNED_SHORT, 0), t.curTex.unbind(), t.curProg.unbind(), e.bindBuffer(e.ARRAY_BUFFER, null), e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null), t.iqueue = [], t.vqueue = [], t.drawCalls++);
    }
    __name(S, "S");
    s(S, "flush");
    function Z() {
      e.clear(e.COLOR_BUFFER_BIT), r.background || E({ width: ce(), height: ie(), quad: he(0, 0, ce() * N() / $t, ie() * N() / $t), tex: t.bgTex }), t.drawCalls = 0, t.transformStack = [], t.transform = ue();
    }
    __name(Z, "Z");
    s(Z, "frameStart");
    function X() {
      S(), t.lastDrawCalls = t.drawCalls;
    }
    __name(X, "X");
    s(X, "frameEnd");
    function ee() {
      return t.lastDrawCalls;
    }
    __name(ee, "ee");
    s(ee, "drawCalls");
    function G(l) {
      return u(l.x / ce() * 2 - 1, -l.y / ie() * 2 + 1);
    }
    __name(G, "G");
    s(G, "toNDC");
    function re(l) {
      t.transform = l.clone();
    }
    __name(re, "re");
    s(re, "pushMatrix");
    function O(l) {
      !l || l.x === 0 && l.y === 0 || (t.transform = t.transform.translate(l));
    }
    __name(O, "O");
    s(O, "pushTranslate");
    function j(l) {
      !l || l.x === 1 && l.y === 1 || (t.transform = t.transform.scale(l));
    }
    __name(j, "j");
    s(j, "pushScale");
    function te(l) {
      !l || (t.transform = t.transform.rotateX(l));
    }
    __name(te, "te");
    s(te, "pushRotateX");
    function me(l) {
      !l || (t.transform = t.transform.rotateY(l));
    }
    __name(me, "me");
    s(me, "pushRotateY");
    function m(l) {
      !l || (t.transform = t.transform.rotateZ(l));
    }
    __name(m, "m");
    s(m, "pushRotateZ");
    function pe() {
      t.transformStack.push(t.transform.clone());
    }
    __name(pe, "pe");
    s(pe, "pushTransform");
    function D() {
      t.transformStack.length > 0 && (t.transform = t.transformStack.pop());
    }
    __name(D, "D");
    s(D, "popTransform");
    function E(l = {}) {
      var K, oe, ge, ae, ye, Ue;
      let y = l.width || 0, g = l.height || 0, v = l.pos || u(0, 0), R = Xe(l.origin || et).scale(u(y, g).scale(-0.5)), z2 = u((K = l.scale) != null ? K : 1), k2 = l.rot || 0, T = l.quad || he(0, 0, 1, 1), Q = 1 - ((oe = l.z) != null ? oe : 0), q = l.color || H();
      pe(), O(v), m(k2), j(z2), O(R), C([{ pos: we(-y / 2, g / 2, Q), uv: u(l.flipX ? T.x + T.w : T.x, l.flipY ? T.y : T.y + T.h), color: q, opacity: (ge = l.opacity) != null ? ge : 1 }, { pos: we(-y / 2, -g / 2, Q), uv: u(l.flipX ? T.x + T.w : T.x, l.flipY ? T.y + T.h : T.y), color: q, opacity: (ae = l.opacity) != null ? ae : 1 }, { pos: we(y / 2, -g / 2, Q), uv: u(l.flipX ? T.x : T.x + T.w, l.flipY ? T.y + T.h : T.y), color: q, opacity: (ye = l.opacity) != null ? ye : 1 }, { pos: we(y / 2, g / 2, Q), uv: u(l.flipX ? T.x : T.x + T.w, l.flipY ? T.y : T.y + T.h), color: q, opacity: (Ue = l.opacity) != null ? Ue : 1 }], [0, 1, 3, 1, 2, 3], l.tex, l.prog, l.uniform), D();
    }
    __name(E, "E");
    s(E, "drawQuad");
    function M(l, y = {}) {
      var z2;
      let g = (z2 = y.quad) != null ? z2 : he(0, 0, 1, 1), v = l.width * g.w, A = l.height * g.h, R = u(1);
      if (y.tiled) {
        let k2 = Math.ceil((y.width || v) / v), T = Math.ceil((y.height || A) / A), q = Xe(y.origin || et).add(u(1, 1)).scale(0.5).scale(k2 * v, T * A);
        for (let K = 0; K < k2; K++)
          for (let oe = 0; oe < T; oe++)
            E(Re(Ce({}, y), { pos: (y.pos || u(0)).add(u(v * K, A * oe)).sub(q), scale: R.scale(y.scale || u(1)), tex: l, quad: g, width: v, height: A, origin: "topleft" }));
      } else
        y.width && y.height ? (R.x = y.width / v, R.y = y.height / A) : y.width ? (R.x = y.width / v, R.y = R.x) : y.height && (R.y = y.height / A, R.x = R.y), E(Re(Ce({}, y), { scale: R.scale(y.scale || u(1)), tex: l, quad: g, width: v, height: A }));
    }
    __name(M, "M");
    s(M, "drawTexture");
    function J(l, y, g, v = {}) {
      E(Re(Ce({}, v), { pos: l, width: y, height: g }));
    }
    __name(J, "J");
    s(J, "drawRect");
    function _(l, y, g, v = {}) {
      if (v.scale) {
        let Q = u(v.scale);
        y = y * Q.x, g = g * Q.y, v.scale = 1;
      }
      let A = Xe(v.origin || et).scale(u(y, g)).scale(0.5), R = l.add(u(-y / 2, -g / 2)).sub(A), z2 = l.add(u(-y / 2, g / 2)).sub(A), k2 = l.add(u(y / 2, g / 2)).sub(A), T = l.add(u(y / 2, -g / 2)).sub(A);
      W(R, z2, v), W(z2, k2, v), W(k2, T, v), W(T, R, v);
    }
    __name(_, "_");
    s(_, "drawRectStroke");
    function W(l, y, g = {}) {
      let v = g.width || 1, A = l.dist(y), R = l.angle(y) - 90;
      E(Re(Ce({}, g), { pos: l.add(y).scale(0.5), width: v, height: A, rot: R, origin: "center" }));
    }
    __name(W, "W");
    s(W, "drawLine");
    function V(l, y, g, v = {}) {
      var z2, k2, T;
      let A = v.z, R = v.color || H();
      C([{ pos: we(l.x, l.y, A), uv: u(0, 0), color: R, opacity: (z2 = v.opacity) != null ? z2 : 1 }, { pos: we(y.x, y.y, A), uv: u(0, 0), color: R, opacity: (k2 = v.opacity) != null ? k2 : 1 }, { pos: we(g.x, g.y, A), uv: u(0, 0), color: R, opacity: (T = v.opacity) != null ? T : 1 }], [0, 1, 2], t.defTex, v.prog, v.uniform);
    }
    __name(V, "V");
    s(V, "drawTri");
    function F(l, y, g = {}) {
      let v = (l + "").split(""), A = y.qw * y.tex.width, R = y.qh * y.tex.height, z2 = g.size || R, k2 = u(z2 / R).scale(u(g.scale || 1)), T = k2.x * A, Q = k2.y * R, q = 0, K = Q, oe = 0, ge = [], ae = [], ye = null, Ue = 0;
      for (; Ue < v.length; ) {
        let be = v[Ue];
        be === `
` ? (K += Q, q = 0, ye = null, ge.push(ae), ae = []) : (g.width ? q + T > g.width : false) && (K += Q, q = 0, ye != null && (Ue -= ae.length - ye, be = v[Ue], ae = ae.slice(0, ye)), ye = null, ge.push(ae), ae = []), be !== `
` && (ae.push(be), q += T, be === " " && (ye = ae.length)), oe = Math.max(oe, q), Ue++;
      }
      ge.push(ae), g.width && (oe = g.width);
      let Ee = [], xe = u(g.pos || 0), ve = Xe(g.origin || et).scale(0.5), Ve = -ve.x * T - (ve.x + 0.5) * (oe - T), rt = -ve.y * Q - (ve.y + 0.5) * (K - Q);
      return ge.forEach((be, nt) => {
        let Ze = (oe - be.length * T) * (ve.x + 0.5);
        be.forEach((Ge, Je) => {
          let Ie = y.map[Ge], st = Je * T, it = nt * Q;
          Ie && Ee.push({ tex: y.tex, quad: he(Ie.x, Ie.y, y.qw, y.qh), ch: Ge, pos: u(xe.x + st + Ve + Ze, xe.y + it + rt), opacity: g.opacity, color: g.color, origin: g.origin, scale: k2 });
        });
      }), { width: oe, height: K, chars: Ee };
    }
    __name(F, "F");
    s(F, "fmtText");
    function L(l, y, g = {}) {
      p(F(l, y, g));
    }
    __name(L, "L");
    s(L, "drawText");
    function p(l) {
      for (let y of l.chars)
        E({ tex: y.tex, width: y.tex.width * y.quad.w, height: y.tex.height * y.quad.h, pos: y.pos, scale: y.scale, color: y.color, opacity: y.opacity, quad: y.quad, origin: "center" });
    }
    __name(p, "p");
    s(p, "drawFmtText");
    function $() {
      if (r.width && r.height && r.stretch)
        if (r.letterbox) {
          let l = e.drawingBufferWidth / e.drawingBufferHeight, y = r.width / r.height;
          if (l > y) {
            t.width = r.height * l, t.height = r.height;
            let g = e.drawingBufferHeight * y, v = e.drawingBufferHeight, A = (e.drawingBufferWidth - g) / 2;
            e.scissor(A, 0, g, v), e.viewport(A, 0, e.drawingBufferWidth, e.drawingBufferHeight);
          } else {
            t.width = r.width, t.height = r.width / l;
            let g = e.drawingBufferWidth, v = e.drawingBufferWidth / y, A = (e.drawingBufferHeight - v) / 2;
            e.scissor(0, e.drawingBufferHeight - v - A, g, v), e.viewport(0, -A, e.drawingBufferWidth, e.drawingBufferHeight);
          }
        } else
          t.width = r.width, t.height = r.height, e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight);
      else
        t.width = e.drawingBufferWidth / N(), t.height = e.drawingBufferHeight / N(), e.viewport(0, 0, e.drawingBufferWidth, e.drawingBufferHeight);
    }
    __name($, "$");
    s($, "updateSize");
    function ce() {
      return t.width;
    }
    __name(ce, "ce");
    s(ce, "width");
    function ie() {
      return t.height;
    }
    __name(ie, "ie");
    s(ie, "height");
    function N() {
      var l;
      return (l = r.scale) != null ? l : 1;
    }
    __name(N, "N");
    s(N, "scale");
    function ze() {
      return t.background.clone();
    }
    __name(ze, "ze");
    return s(ze, "background"), $(), Z(), X(), { width: ce, height: ie, scale: N, makeTex: x, makeProgram: P, makeFont: w, drawTexture: M, drawText: L, drawFmtText: p, drawRect: J, drawRectStroke: _, drawLine: W, drawTri: V, fmtText: F, frameStart: Z, frameEnd: X, pushTranslate: O, pushTransform: pe, popTransform: D, pushMatrix: re, drawCalls: ee, background: ze };
  }
  __name(Yt, "Yt");
  var et;
  var Ye;
  var tt;
  var $t;
  var nn;
  var sn;
  var Ut;
  var bt;
  var zt = se(() => {
    ke();
    yt();
    et = "topleft", Ye = 9, tt = 65536, $t = 64, nn = `
attribute vec3 a_pos;
attribute vec2 a_uv;
attribute vec4 a_color;

varying vec3 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

vec4 def_vert() {
	return vec4(a_pos, 1.0);
}

{{user}}

void main() {
	vec4 pos = vert(a_pos, a_uv, a_color);
	v_pos = a_pos;
	v_uv = a_uv;
	v_color = a_color;
	gl_Position = pos;
}
`, sn = `
precision mediump float;

varying vec3 v_pos;
varying vec2 v_uv;
varying vec4 v_color;

uniform sampler2D u_tex;

vec4 def_frag() {
	return v_color * texture2D(u_tex, v_uv);
}

{{user}}

void main() {
	gl_FragColor = frag(v_pos, v_uv, v_color, u_tex);
	if (gl_FragColor.a == 0.0) {
		discard;
	}
}
`, Ut = `
vec4 vert(vec3 pos, vec2 uv, vec4 color) {
	return def_vert();
}
`, bt = `
vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	return def_frag();
}
`;
    s(Xe, "originPt");
    s(Yt, "gfxInit");
  });
  function Zt(e) {
    return e === "pressed" || e === "rpressed" ? "down" : e === "released" ? "up" : e;
  }
  __name(Zt, "Zt");
  function Gt(e = {}) {
    var V, F, L;
    let r = (V = e.root) != null ? V : document.body;
    r === document.body && (document.body.style.width = "100%", document.body.style.height = "100%", document.body.style.margin = "0px", document.documentElement.style.width = "100%", document.documentElement.style.height = "100%");
    let t = { canvas: (F = e.canvas) != null ? F : (() => {
      let p = document.createElement("canvas");
      return r.appendChild(p), p;
    })(), keyStates: {}, charInputted: [], mouseMoved: false, keyPressed: false, keyPressedRep: false, mouseState: "up", mousePos: u(0, 0), mouseDeltaPos: u(0, 0), time: 0, realTime: 0, skipTime: false, dt: 0, scale: (L = e.scale) != null ? L : 1, isTouch: false, loopID: null, stopped: false, fps: 0, fpsBuf: [], fpsTimer: 0 }, c = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", " ": "space" }, x = ["space", "left", "right", "up", "down", "tab", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "s"];
    e.width && e.height && !e.stretch ? (t.canvas.width = e.width * t.scale, t.canvas.height = e.height * t.scale) : (t.canvas.width = t.canvas.parentElement.offsetWidth, t.canvas.height = t.canvas.parentElement.offsetHeight);
    let P = ["outline: none", "cursor: default"];
    e.crisp && (P.push("image-rendering: pixelated"), P.push("image-rendering: crisp-edges")), t.canvas.style = P.join(";"), t.canvas.setAttribute("tabindex", "0");
    let w = t.canvas.getContext("webgl", { antialias: true, depth: true, stencil: true, alpha: true, preserveDrawingBuffer: true });
    t.isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0, t.canvas.addEventListener("mousemove", (p) => {
      t.mousePos = u(p.offsetX, p.offsetY).scale(1 / t.scale), t.mouseDeltaPos = u(p.movementX, p.movementY).scale(1 / t.scale), t.mouseMoved = true;
    }), t.canvas.addEventListener("mousedown", () => {
      t.mouseState = "pressed";
    }), t.canvas.addEventListener("mouseup", () => {
      t.mouseState = "released";
    }), t.canvas.addEventListener("keydown", (p) => {
      let $ = c[p.key] || p.key.toLowerCase();
      x.includes($) && p.preventDefault(), $.length === 1 && t.charInputted.push(p.key), $ === "space" && t.charInputted.push(" "), p.repeat ? (t.keyPressedRep = true, t.keyStates[$] = "rpressed") : (t.keyPressed = true, t.keyStates[$] = "pressed");
    }), t.canvas.addEventListener("keyup", (p) => {
      let $ = c[p.key] || p.key.toLowerCase();
      t.keyStates[$] = "released";
    }), t.canvas.addEventListener("touchstart", (p) => {
      if (!e.touchToMouse)
        return;
      p.preventDefault();
      let $ = p.touches[0];
      t.mousePos = u($.clientX, $.clientY).scale(1 / t.scale), t.mouseState = "pressed";
    }), t.canvas.addEventListener("touchmove", (p) => {
      if (!e.touchToMouse)
        return;
      p.preventDefault();
      let $ = p.touches[0];
      t.mousePos = u($.clientX, $.clientY).scale(1 / t.scale), t.mouseMoved = true;
    }), t.canvas.addEventListener("touchend", (p) => {
      !e.touchToMouse || (t.mouseState = "released");
    }), t.canvas.addEventListener("touchcancel", (p) => {
      !e.touchToMouse || (t.mouseState = "released");
    }), document.addEventListener("visibilitychange", () => {
      var p, $;
      switch (document.visibilityState) {
        case "visible":
          t.skipTime = true, (p = e.audioCtx) == null || p.resume();
          break;
        case "hidden":
          ($ = e.audioCtx) == null || $.suspend();
          break;
      }
    });
    function C() {
      return t.mousePos.clone();
    }
    __name(C, "C");
    s(C, "mousePos");
    function S() {
      return t.mouseDeltaPos.clone();
    }
    __name(S, "S");
    s(S, "mouseDeltaPos");
    function Z() {
      return t.mouseState === "pressed";
    }
    __name(Z, "Z");
    s(Z, "mouseClicked");
    function X() {
      return t.mouseState === "pressed" || t.mouseState === "down";
    }
    __name(X, "X");
    s(X, "mouseDown");
    function ee() {
      return t.mouseState === "released";
    }
    __name(ee, "ee");
    s(ee, "mouseReleased");
    function G() {
      return t.mouseMoved;
    }
    __name(G, "G");
    s(G, "mouseMoved");
    function re(p) {
      return p === void 0 ? t.keyPressed : t.keyStates[p] === "pressed";
    }
    __name(re, "re");
    s(re, "keyPressed");
    function O(p) {
      return p === void 0 ? t.keyPressedRep : t.keyStates[p] === "pressed" || t.keyStates[p] === "rpressed";
    }
    __name(O, "O");
    s(O, "keyPressedRep");
    function j(p) {
      return t.keyStates[p] === "pressed" || t.keyStates[p] === "rpressed" || t.keyStates[p] === "down";
    }
    __name(j, "j");
    s(j, "keyDown");
    function te(p) {
      return t.keyStates[p] === "released";
    }
    __name(te, "te");
    s(te, "keyReleased");
    function me() {
      return [...t.charInputted];
    }
    __name(me, "me");
    s(me, "charInputted");
    function m() {
      return t.dt;
    }
    __name(m, "m");
    s(m, "dt");
    function pe() {
      return t.time;
    }
    __name(pe, "pe");
    s(pe, "time");
    function D() {
      return t.fps;
    }
    __name(D, "D");
    s(D, "fps");
    function E() {
      return t.canvas.toDataURL();
    }
    __name(E, "E");
    s(E, "screenshot");
    function M(p) {
      return p && (t.canvas.style.cursor = p), t.canvas.style.cursor;
    }
    __name(M, "M");
    s(M, "cursor");
    function J(p) {
      let $ = s((N) => {
        N.mozRequestFullScreen ? N.mozRequestFullScreen() : N.webkitRequestFullScreen ? N.webkitRequestFullScreen() : N.requestFullscreen();
      }, "enterFullscreen"), ce = s((N) => {
        N.mozExitFullScreen ? N.mozExitFullScreen() : N.webkitExitFullScreen ? N.webkitExitFullScreen() : N.exitFullscreen();
      }, "exitFullscreen"), ie = s((N) => N.mozFullscreenElement !== void 0 ? N.mozFullscreenElement : N.webkitFullscreenElement !== void 0 ? N.webkitFullscreenElement : N.fullscreenElement, "getFullscreenElement");
      return ie(document) ? ce(document) : $(t.canvas), !!ie(document);
    }
    __name(J, "J");
    s(J, "fullscreen");
    function _(p) {
      let $ = s((ce) => {
        let ie = ce / 1e3, N = ie - t.realTime;
        t.realTime = ie, t.skipTime || (t.dt = N, t.time += t.dt, t.fpsBuf.push(1 / t.dt), t.fpsTimer += t.dt, t.fpsTimer >= 1 && (t.fpsTimer = 0, t.fps = Math.round(t.fpsBuf.reduce((l, y) => l + y) / t.fpsBuf.length), t.fpsBuf = [])), t.skipTime = false;
        let ze = navigator.getGamepads();
        p();
        for (let l in t.keyStates)
          t.keyStates[l] = Zt(t.keyStates[l]);
        t.mouseState = Zt(t.mouseState), t.charInputted = [], t.mouseMoved = false, t.keyPressed = false, t.keyPressedRep = false, t.loopID = requestAnimationFrame($);
      }, "frame");
      t.stopped = false, t.loopID = requestAnimationFrame($);
    }
    __name(_, "_");
    s(_, "run");
    function W() {
      cancelAnimationFrame(t.loopID), t.stopped = true;
    }
    __name(W, "W");
    return s(W, "quit"), { gl: w, mousePos: C, mouseDeltaPos: S, keyDown: j, keyPressed: re, keyPressedRep: O, keyReleased: te, mouseDown: X, mouseClicked: Z, mouseReleased: ee, mouseMoved: G, charInputted: me, cursor: M, dt: m, time: pe, fps: D, screenshot: E, run: _, quit: W, focused: () => document.activeElement === t.canvas, focus: () => t.canvas.focus(), canvas: t.canvas, isTouch: t.isTouch, scale: t.scale, fullscreen: J };
  }
  __name(Gt, "Gt");
  var Jt = se(() => {
    ke();
    s(Zt, "processBtnState");
    s(Gt, "appInit");
  });
  var Ht;
  var Nt = se(() => {
    Ht = Tt("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L5QNSqT5iiySS9Ja2SV//5ME0ak//+4KgAAABgQBAADAMDgYCAEgCteQ0fZH6+ICXA357+MPfhR/+ywRf/U///LVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5JknQAFoWhGLm5gBClBmT3GiAAAAAGkHAAAIAAANIOAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
  });
  function Qt() {
    let e = (() => {
      let P = new (window.AudioContext || window.webkitAudioContext)(), w = P.createGain(), C = w;
      return C.connect(P.destination), { ctx: P, gainNode: w, masterNode: C };
    })(), r = { buf: new AudioBuffer({ length: 1, numberOfChannels: 1, sampleRate: 44100 }) };
    e.ctx.decodeAudioData(Ht.buffer.slice(0), (P) => {
      r.buf = P;
    }, () => {
      throw new Error("failed to make burp");
    });
    function t(P) {
      return P !== void 0 && (e.gainNode.gain.value = fe(P, jt, Ot)), e.gainNode.gain.value;
    }
    __name(t, "t");
    s(t, "volume");
    function c(P, w = { loop: false, volume: 1, speed: 1, detune: 0, seek: 0 }) {
      var O;
      let C = false, S = e.ctx.createBufferSource();
      S.buffer = P.buf, S.loop = !!w.loop;
      let Z = e.ctx.createGain();
      S.connect(Z), Z.connect(e.masterNode);
      let X = (O = w.seek) != null ? O : 0;
      S.start(0, X);
      let ee = e.ctx.currentTime - X, G = null, re = { stop() {
        C || (this.pause(), ee = e.ctx.currentTime);
      }, play(j) {
        if (!C)
          return;
        let te = S;
        S = e.ctx.createBufferSource(), S.buffer = te.buffer, S.loop = te.loop, S.playbackRate.value = te.playbackRate.value, S.detune && (S.detune.value = te.detune.value), S.connect(Z);
        let me = j != null ? j : this.time();
        S.start(0, me), ee = e.ctx.currentTime - me, C = false, G = null;
      }, pause() {
        C || (S.stop(), C = true, G = e.ctx.currentTime);
      }, paused() {
        return C;
      }, stopped() {
        return C;
      }, speed(j) {
        return j !== void 0 && (S.playbackRate.value = fe(j, an, un)), S.playbackRate.value;
      }, detune(j) {
        return S.detune ? (j !== void 0 && (S.detune.value = fe(j, cn, dn)), S.detune.value) : 0;
      }, volume(j) {
        return j !== void 0 && (Z.gain.value = fe(j, jt, Ot)), Z.gain.value;
      }, loop() {
        S.loop = true;
      }, unloop() {
        S.loop = false;
      }, duration() {
        return P.buf.duration;
      }, time() {
        return C ? G - ee : e.ctx.currentTime - ee;
      } };
      return re.speed(w.speed), re.detune(w.detune), re.volume(w.volume), re;
    }
    __name(c, "c");
    s(c, "play");
    function x(P) {
      return c(r, P);
    }
    __name(x, "x");
    return s(x, "burp"), { ctx: e.ctx, volume: t, play: c, burp: x };
  }
  __name(Qt, "Qt");
  var jt;
  var Ot;
  var an;
  var un;
  var cn;
  var dn;
  var Kt = se(() => {
    ke();
    Nt();
    jt = 0, Ot = 3, an = 0, un = 3, cn = -1200, dn = 1200;
    s(Qt, "audioInit");
  });
  var tr;
  var er = se(() => {
    tr = "data:image/png;base64,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";
  });
  var nr;
  var rr = se(() => {
    nr = "data:image/png;base64,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";
  });
  var ir;
  var sr = se(() => {
    ir = "data:image/png;base64,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";
  });
  var ar;
  var or = se(() => {
    ar = "data:image/png;base64,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";
  });
  var cr;
  var ur = se(() => {
    cr = "data:image/png;base64,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";
  });
  function gt(e) {
    let r = new Image();
    return r.src = e, r.crossOrigin = "anonymous", new Promise((t, c) => {
      r.onload = () => {
        t(r);
      }, r.onerror = () => {
        c(`failed to load ${e}`);
      };
    });
  }
  __name(gt, "gt");
  function hr(e) {
    return e.startsWith("data:");
  }
  __name(hr, "hr");
  function lr(e, r, t = {}) {
    let c = { lastLoaderID: 0, loadRoot: "", loaders: {}, sprites: {}, sounds: {}, fonts: {}, shaders: {} };
    function x(D) {
      var M;
      let E = c.lastLoaderID;
      return c.loaders[E] = false, c.lastLoaderID++, D.catch((M = t.errHandler) != null ? M : console.error).finally(() => c.loaders[E] = true);
    }
    __name(x, "x");
    s(x, "load");
    function P() {
      let D = 0, E = 0;
      for (let M in c.loaders)
        D += 1, c.loaders[M] && (E += 1);
      return E / D;
    }
    __name(P, "P");
    s(P, "loadProgress");
    function w(D) {
      return D !== void 0 && (c.loadRoot = D), c.loadRoot;
    }
    __name(w, "w");
    s(w, "loadRoot");
    function C(D, E, M, J, _ = {}) {
      return x(new Promise((W, V) => {
        let F = hr(E) ? E : c.loadRoot + E;
        gt(F).then((L) => {
          var $;
          let p = e.makeFont(e.makeTex(L, _), M, J, ($ = _.chars) != null ? $ : xt);
          D && (c.fonts[D] = p), W(p);
        }).catch(V);
      }));
    }
    __name(C, "C");
    s(C, "loadFont");
    function S(D) {
      var E;
      return (E = c.sprites[D]) != null ? E : null;
    }
    __name(S, "S");
    s(S, "getSprite");
    function Z(D) {
      var E;
      return (E = c.sounds[D]) != null ? E : null;
    }
    __name(Z, "Z");
    s(Z, "getSound");
    function X(D) {
      var E;
      return (E = c.fonts[D]) != null ? E : null;
    }
    __name(X, "X");
    s(X, "getFont");
    function ee(D) {
      var E;
      return (E = c.shaders[D]) != null ? E : null;
    }
    __name(ee, "ee");
    s(ee, "getShader");
    function G(D = 1, E = 1, M = 0, J = 0, _ = 1, W = 1) {
      let V = [], F = _ / D, L = W / E;
      for (let p = 0; p < E; p++)
        for (let $ = 0; $ < D; $++)
          V.push(he(M + $ * F, J + p * L, F, L));
      return V;
    }
    __name(G, "G");
    s(G, "slice");
    function re(D, E) {
      return x(typeof E == "string" ? fetch(w() + E).then((M) => M.json()).then((M) => re(D, M)) : O(null, D).then((M) => {
        let J = {}, _ = M.tex.width, W = M.tex.height;
        for (let V in E) {
          let F = E[V], L = { tex: M.tex, frames: G(F.sliceX, F.sliceY, F.x / _, F.y / W, F.width / _, F.height / W), anims: F.anims };
          c.sprites[V] = L, J[V] = L;
        }
        return J;
      }));
    }
    __name(re, "re");
    s(re, "loadSpriteAtlas");
    function O(D, E, M = { sliceX: 1, sliceY: 1, anims: {} }) {
      function J(_, W, V = { sliceX: 1, sliceY: 1, anims: {} }) {
        let F = e.makeTex(W, V), L = G(V.sliceX || 1, V.sliceY || 1), p = { tex: F, frames: L, anims: V.anims || {} };
        return _ && (c.sprites[_] = p), p;
      }
      __name(J, "J");
      return s(J, "loadRawSprite"), x(new Promise((_, W) => {
        if (!E)
          return W(`expected sprite src for "${D}"`);
        if (typeof E == "string") {
          let V = hr(E) ? E : c.loadRoot + E;
          gt(V).then((F) => _(J(D, F, M))).catch(W);
        } else
          _(J(D, E, M));
      }));
    }
    __name(O, "O");
    s(O, "loadSprite");
    function j(D, E) {
      return x(new Promise((M, J) => {
        fetch(w() + E).then((_) => _.json()).then((_) => Dt(this, null, function* () {
          let W = yield Promise.all(_.frames.map(gt)), V = document.createElement("canvas");
          V.width = _.width, V.height = _.height * _.frames.length;
          let F = V.getContext("2d");
          return W.forEach((L, p) => {
            F.drawImage(L, 0, p * _.height);
          }), O(D, V, { sliceY: _.frames.length, anims: _.anims });
        })).then(M).catch(J);
      }));
    }
    __name(j, "j");
    s(j, "loadPedit");
    function te(D, E, M) {
      return x(new Promise((J, _) => {
        let W = w() + M;
        O(D, E).then((V) => {
          fetch(W).then((F) => F.json()).then((F) => {
            let L = F.meta.size;
            V.frames = F.frames.map((p) => he(p.frame.x / L.w, p.frame.y / L.h, p.frame.w / L.w, p.frame.h / L.h));
            for (let p of F.meta.frameTags)
              p.from === p.to ? V.anims[p.name] = p.from : V.anims[p.name] = { from: p.from, to: p.to, speed: 10, loop: true };
            J(V);
          }).catch(_);
        }).catch(_);
      }));
    }
    __name(te, "te");
    s(te, "loadAseprite");
    function me(D, E, M, J = false) {
      function _(W, V, F) {
        let L = e.makeProgram(V, F);
        return W && (c.shaders[W] = L), L;
      }
      __name(_, "_");
      return s(_, "loadRawShader"), x(new Promise((W, V) => {
        if (!E && !M)
          return V("no shader");
        function F(L) {
          return L ? fetch(c.loadRoot + L).then((p) => {
            if (p.ok)
              return p.text();
            throw new Error(`failed to load ${L}`);
          }).catch(V) : new Promise((p) => p(null));
        }
        __name(F, "F");
        if (s(F, "resolveUrl"), J)
          Promise.all([F(E), F(M)]).then(([L, p]) => {
            W(_(D, L, p));
          }).catch(V);
        else
          try {
            W(_(D, E, M));
          } catch (L) {
            V(L);
          }
      }));
    }
    __name(me, "me");
    s(me, "loadShader");
    function m(D, E) {
      let M = c.loadRoot + E;
      return x(new Promise((J, _) => {
        if (!E)
          return _(`expected sound src for "${D}"`);
        typeof E == "string" && fetch(M).then((W) => {
          if (W.ok)
            return W.arrayBuffer();
          throw new Error(`failed to load ${M}`);
        }).then((W) => new Promise((V, F) => {
          r.ctx.decodeAudioData(W, V, F);
        })).then((W) => {
          let V = { buf: W };
          D && (c.sounds[D] = V), J(V);
        }).catch(_);
      }));
    }
    __name(m, "m");
    s(m, "loadSound");
    function pe(D = "bean") {
      return O(D, cr);
    }
    __name(pe, "pe");
    return s(pe, "loadBean"), C("apl386", tr, 45, 74), C("apl386o", nr, 45, 74), C("sink", ir, 6, 8, { chars: "\u2588\u263A\u263B\u2665\u2666\u2663\u2660\u25CF\u25CB\u25AA\u25A1\u25A0\u25D8\u266A\u266B\u2261\u25BA\u25C4\u2302\xDE\xC0\xDF\xD7\xA5\u2191\u2193\u2192\u2190\u25CC\u25CF\u25BC\u25B2 !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u03A7\u2591\u2592\u2593\u1E00\u1E01\u1E02\u2502\u252C\u2524\u250C\u2510\u1E03\u1E04\u253C\u1E05\u1E06\u1E07\u1E08\u1E09\u1E0A\u1E0B\u1E0C\u2500\u251C\u2534\u2514\u2518\u1E0D\u1E0E\u205E\u1E0F\u1E10\u1E11\u1E12\u1E13\u1E14\u1E15\u1E16\u1E17\u1E18\u2584\u1E19\u1E1A\u1E1B\u1E1C\u2026\u1E1D\u1E1E\u1E1F\u1E20\u1E21\u1E22\u1E23\u1E24\u1E25\u1E26\u258C\u2590\u1E27\u1E28\u1E29\u1E2A\u1E2B\u1E2C\u1E2D\u1E2E\u1E2F\u1E30\u1E31\u1E32\u1E33\u1E34\u1E35\u1E36\u1E37\u1E38\u1E39\u1E3A\u1E3B\u1E3C\u1E3D\u1E3E\u1E3F\u1E40\u1E41\u1E42\u1E43\u1E44\u1E45\u1E46\u1E47\u1E48\u1E49\u1E4A\u1E4B\u1E4C\u1E4D\u1E4E\u1E4F\u1E50\u1E51\u1E52\u1E53\u1E54\u1E55\u1E56\u1E57\u1E58\u1E59\u1E5A\u1E5B\u1E5C\u1E5D\u1E5E\u1E5F\u1E60\u1E61\u1E62\u1E63\u1E64\u1E65\u1E66\u1E67\u1E68\u1E69\u1E6A\u1E6B\u1E6C\u1E6D\u1E6E\u1E6F\u1E70\u1E71\u1E72\u1E73\u1E74\u1E75\u1E76\u1E77\u1E78\u1E79\u1E7A\u1E7B\u1E7C" }), C("sinko", ar, 8, 10), { loadRoot: w, loadSprite: O, loadSpriteAtlas: re, loadPedit: j, loadAseprite: te, loadBean: pe, loadSound: m, loadFont: C, loadShader: me, loadProgress: P, load: x, sprites: c.sprites, fonts: c.fonts, sounds: c.sounds, shaders: c.shaders };
  }
  __name(lr, "lr");
  var xt;
  var dr;
  var fr = se(() => {
    ke();
    er();
    rr();
    sr();
    or();
    ur();
    xt = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~", dr = " \u263A\u263B\u2665\u2666\u2663\u2660\u2022\u25D8\u25CB\u25D9\u2642\u2640\u266A\u266B\u263C\u25BA\u25C4\u2195\u203C\xB6\xA7\u25AC\u21A8\u2191\u2193\u2192\u2190\u221F\u2194\u25B2\u25BC !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\u2302\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0";
    s(gt, "loadImg");
    s(hr, "isDataUrl");
    s(lr, "assetsInit");
  });
  function mr(e, r, t = { max: 8 }) {
    var Z;
    let c = [], x = (Z = t.max) != null ? Z : 8;
    function P() {
      c.length > x && (c = c.slice(0, x));
      let X = u(0, e.height());
      c.forEach((ee, G) => {
        let re = Ae(G, 0, x, 1, 0.5), O = Ae(G, 0, x, 0.8, 0.2), j = (() => {
          switch (ee.type) {
            case "info":
              return H(255, 255, 255);
            case "error":
              return H(255, 0, 127);
          }
        })(), te = e.fmtText(ee.msg, r.fonts.sink, { pos: X, origin: "botleft", color: j, size: yn / e.scale(), width: e.width(), opacity: re });
        e.drawRect(X, te.width, te.height, { origin: "botleft", color: H(0, 0, 0), opacity: O }), e.drawFmtText(te), X.y -= te.height;
      });
    }
    __name(P, "P");
    s(P, "draw");
    function w(X) {
      c.unshift({ type: "error", msg: X });
    }
    __name(w, "w");
    s(w, "error");
    function C(X) {
      c.unshift({ type: "info", msg: X });
    }
    __name(C, "C");
    s(C, "info");
    function S() {
      c = [];
    }
    __name(S, "S");
    return s(S, "clear"), { info: C, error: w, draw: P, clear: S };
  }
  __name(mr, "mr");
  var yn;
  var pr = se(() => {
    ke();
    yn = 16;
    s(mr, "loggerInit");
  });
  var Ur;
  var yr = se(() => {
    Ur = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ0AAAA4CAYAAADn9/qLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA/6SURBVHgB7V0/cBXHGf+cyYxdIVEEV4Flxu6CJQZXAY/PuIrxDMIVIQVPlQONRJOBSkcFk4ZHA0klqYCkitBMSKpYjwGnsgeBXCWZ0UGqmALJlUkj7+/29t7ed9/u7T2JMX/uN7Ojd3d7e3e7v/3+7p2IOnTo0KHDzkJRhw4tMaPLii5z1B44b0uXdV161KFDBHpkSGNLG+JdYeda8iXUoUMAfaoT53TEeXPCeW6Zp+2r3UldZnVZ0uUpGULH3FuHFxxWPboFAzwZOGeGwoQblXycZFuee+vwkuM+yYMLqaKE+gmvq/bu2ur95hch4q17rq2omWRS6fCSIzS4IOS4U1eRQI7Ve72trc3fba2vfb419em7vrYUu67YVmRRFI/xov4UGfs1pc7h+VEBdRajHgFFRmJVjl+5fDQnnC39S0djJd1607XHx97MSTw+9lYM6UAqSE3YqJCcmDAhUt+nLtTzowADVQ5E8sHPt06fEtXkHAkkmbtwuEK4ldsnfTaYYtedowDJ+prI9wvpiaL2jjWRbonipSSfDIo67Ah+Glmv4ixMHthDc+eP0IO1b2lVFwcpP3Hm7CFKzx8ut7PHm3Ti1C0S8BEOO9uKt6eJpq97OL++BG0z5u2zNrLiN9TnFI0GRUbiXSQjITtsAz+JrFchnZYopKUNLd08kQ+0D1oiUv/Sx+U2CPHRsT/Txub3vOo5XVbZvpXqNXfRlUtHvYSLwGRTBbVvV37P2tmhqWPv8sMgLeKNc9RhW4iVdGPuxkQx8CDf0s3PRCKBJEs3Piu3Nzaf5fWYJAIk6YGBVe6O9MKR/HohqH36+L3/VnY5vxP3AKTm8WPvaBK/nU8gqe308pd08dKXtd1kCDytywZ1aI2RJJ022IcHNAG1k1CpDMKt3P51PpgWJ079xUe4lO1TfB8kj7YhaZuoPENyREu0Uwfy+/eRGWbBlcsfV563ANR052CMiBjSjVM1HFJTcT1NCO0s5CSbfG9PTjh3IM+d/4IGVQkEwLBLqY6aWp1zbMJtYJ+7MRGppmfPHKL7905LZoQic68JdWiFGNIxJ+JnYiVIhaePZ+j+3V6FcFBP/etf8eoZGfXEMZJatRDqqeIvJg17jrfL31D9587/Iy+CNM7bxUQS7ElFHfFaozXpcrspElevfZXbRQwZGU+V20OKGtSqcUT+RG+M/b4s+w/8USQKBZ4BE4er/v71r/PisTtz4unwDM2efV9qP6EO0YghnXI3XAkRwq3b/6bZC1/w3RnVQyMWjWoVhOBqGgS5WBDbJVIBq1K9Ewfnu22akM5SLv0kwIPGZOgwOmJIN+FuxIQsMHDTZ/4uHTpBMuEa1Sqkpk+i2f1jdYPfgjkRe8vfize/qVVG7BHSz4dYdU9GrfcoIlzTEjZVp+glRKwjUWKsLk1qwEBGxuIARRFqNb38T/JhY+N7akBl4rhOxMKNb8QTIP2mz/yNRgT6zGZn5sl4uvY3CKNoNCRkNMJS0dZ6sd0jNk4vMkZwJJrV60S7AG6jWoUzwkhcsQc3Nv9fnsugir/iMwzuPQ7agwt68ghxuhBcsqVUXwTRI0MYHAcREZ9MqBk2MC05Ldi2BJyn0e3LGRqSWNFzRBPpWHzuTcluqgHRfMTBGGoqlCLUKgZ+oa4C2wRlWTZlV/kMy7f/03gyHCGffecgRLbQfcUs/7dkmKXme+gV7VkCKooD6vWLvwkNF288FzSRTrkbiMHFYv76Jzyoik6ZZ22nbgUpCHz12tfUdF9WCnpCJl4nQjABRgWIkZJAtsiJmlKdeAkZAvWldhvGQpEhoJWoPQoTMBWuPYq6dqVlz3fNVpKuTd4TBJi//iu+O6HhjI0KAscQo0ESeZ2ImTPve3PHyMOimMnTLN05cA4C5utrv83jlyu3T+pwy6E8t+tBSkPiwe4T438m23Myj4eur32e318o/03m+V31K5HpQ2Ffk2TlwD1zaSkSsCn3Wkv0S4BnCfsIAzrjxLGgZlEQPnGAjt1HkUFgDFyTQe8LWBfwet/4ff/edElsSOYmgoHgIccF56MPZjWh3bbQN5bwaAN9gkwNm1Rp8bfna9ddsYP+6p0ayzNC8Liv6iD84C7s1O/Ig54uMGJn2T4l1LXSOwaKjM0pIaHh5AEpz71BYVRmG2aYKykAkA3xM4u+zsNCgliggxHADUksqNX5a59QCDD4UdDeo+IvtvPByCWWISwCxgyw/8rZjQBvbNgHz/ZID2D2aDMfVAym7zl8ZAsBbXpW3VSAxQmID8aGakDoZV08njkiCAedbahfX0gHMdUBhaGonfNxsIl0WFgZHDBIIdfQR4dDpbgdj/ADMgniHReLA1rEvoIQSFe5N6i6JuB52oRLQApMmlHUcBPxYiakD5g4t7SzhPQew24ykzEhZuYwDMgQL4SaGYB7xnOtPvxWqj8dsukaE/14KO5Z2jymC3iynvRRq9xqDMb9AeJoR2jxxhq1wcyZQ17CoT+g9jDp9h/4Qy0Egz6FBvHd93YWO6BfsWBB6F8r2XrV+jXbMKFwYHuOGOGwaBeTxNqckg0bIl1jol9YOZIDROTHpKVJTUuWrAptg5C0iXWEJt+LS/UBGChucrhE2733Ks0Wq2ygnhGC4X2D+0ov/LLWNvqHEwb2M8iLgvaROcEkx/WgVqXYo/DcGFtF7N1gOCVCqGuKZIBwKb+Ou2gX9y4JlJAj0ZjoDwVOoZ7AdAvkMyvtNSxZWtT2CHK3rpFvY2z5w+j7Oa6dlDYetSUHltknhR0KSQBnxQXuCwY5W4oPQCUNyBmI5IMq4fDcUGkhO2359r9qgyupIt4/IJSbzw44DPmqbrv6GdKGOXMTvL6dPBtnn/FJAXsEDoAbG02IES5ftHvzBMUgJOmUu8EzEU3RfDcRD3LyuiG1irou4QD8BgnQIZCkqW7z4JGFmtQIhQ/2Fdfr6bww2kOB5IGjs8jsUtiZghSuvWfh1rGB7CbHAAa+G+bhiw7yexSk3B2PZpGweHNoIkzUs0gJGTKVwHjkBzTxhPhq4mwrYsFj21+xZlKIdMFE/2LdM1rW5aq7o1+EUvjypia1KoQSvLij24+FfQbeNga9pyWUu0wKHbmg1Y3PFgW4ag1I/gE5kgKEc6Uo+pJPSkkLQPrGYvXhk/K3Zx2gsht41g8LyYvfiCcyzDjn1TxVEyuMt8ubHIkSbqLfxJlqKaRbZERupXPdcArQpFYhKZgqCIITyGeQB4KyJTDwIJ4rdRCq4Op32OaQcLhvz3J8hCfgAS5WDly6VznXhSTlgNW1J3zXdNE2FlNUJrzbL/mK7kDOHN63e73j9ZeSEhoGfJV7AH0jvMQURLRNh7iPFe+IW7HBznRZKH6jo32BwvzhMMtBSMkbFqTFgEzHKhq+gV+qBp6NGB9/03vdWNzJA91DktqALL83t7OFdN0CVe0eTMryvkFs3LuUJpPuFRpDWPSwYA8Xfyv9YtsHMOlW1/5HErgQwLjg+ZnKrxGOv14qQUpN+khXc5P7cg7UYuBW1eU4eVY74EHch8EDmpm4pwjAVqQFOna6+J0VBRLY6dw4NdzG4RBmej4IF51t3LOtB0IIA3qRbdcWKWAiw8yAZIOHawGzZIYFmR/UnZpVqiMjhxjoG9uGb+UPyCiRHIHugf/Nupqn2gY+9do22cs7+BxFwjoHWCouhGCgMjK2jy1rqko6n0RzO11yNqwtg5iZJIH5olSoJAvPahU3HKFICMJaO4oTAs/kOgLA4G6tb5bZdi2u6k5gIRSSA2/ESYAU95kqbTxVCT7SYRZtUBygNjLh/Ku0PWQk5/6yysYjf9jAhWvT4LVCG36BlAHRkKm4omcuj7nZF8S5vebW83jMKQ0//AjCVQgBW8hOECn0ceuvVbtWCN9A2qviN9oeUEBYmBfk32L7dgUdOsGhaO2pSvCpVxAOBnCPwsjIkE7CLJmOUDTsEBuUnCDhDS2GpvSLuVGtQhAktbE7Kd7FX8SBJEOqrrlt7wviZfgFgCp8qusK9qgiQcKBcK4t9Eho35ohVkJ5PpmBtiFyQMBKtAFqk08gjpmAZ54f18+Vsmdq66lKCDkSGcWvMvCBE3Ig1LFExF/bcZJade+rBIhh1LI/htXmDTYXUnzRApkA5KLtAIBEWO2BCRAK2nLCAb6lWfBwEy1VAAw2AuxM4ikyCfsKMKncrysAgiPS6HXa5Vl2Mo3iqUqIfcP/eQKq2IZbThRl0HBOrOrP0TTjJSCMIbyvO7wBQQqa1xSnvbE9iXDA6kPZqzSps02n7V4wbmjqGXuLe8Tcu/aFZThwv7guskv8Q0iYYAjQSy83WQhpyfEXgXSjAI5KFlvZSMPHMcvOc3hCNxkxh0l6XRGdjNiesXuGtt5pPcipuEj1WVAy8gENxQ19K3bMapOqjRiy5fDsJp1nzpE+vYHjmBSQvAis+zSC8IbeWNPSphcdsAsVDe1D/IWKnvKeoDsBNl7ekVrtTuQhm7cqHqvnBe79ZIiHkFAlhQS1CvXHYdNbIKKkljAR4BWH0onSUjEA3r67mie0RIwvP0Ndn02LbJAr4SHheJsgJc8yIXsjEVlYJrbwspNOAoj3lEaAjRkKoRv+oZ/aGjJIMZ8E4tgonA6P+s6IhT9S3a6UxYGUOXfBEA8xMykWZ7MsLnwEkcgED/aKE49DvHBSq1QOXq+81mtCOqAmjbaBBap/dwWEAPEq3ncM8RqkW0bGpoWkLl/UgaRxV+zEAuSGzVW1O2Up5yOTK2l94SMAXvZK4fS4kEj3stp0TUC4BiEXDCCkFByV1fbN1O24AhskfK0AUoLbYHaZPQpUl2/QyHjsB4v77PM2Bi1WmFhI3jdfimXbn2JLzyzs2kAA9+8zBYQ4ohevqqQLwdp+bszQ7uNoekdAUf3L8rmN2OL1xoyMJB2w/Zgox8sLaWkHNYssRpPXCQIs6+Cy8PGimo0mSUOOPIiuMxchb15qG5AkXeyXOF8lWIk3YPtdZ2SyOD5oaCsjI/EqAeAWhIN0S0kOAdkctrlQsfwKwMBCncEjRqYFeV+QLH8vYe2J9/pTn75TI4Xn82i4L6Txxs3zPJMI94CM7ZyUO/T1efu76yETRR12BFDnW9Tua+1JRLsrNNrX4MWCr9q7X7nXNqhUb764dkrNX5vvu/v77N82eL6kv/I6SrrnAfsW/pxwLGO/71B9+bcPULswtiZpBzDtSEpAsBMzGi7WsM6YZHbYOGnFToaT5L5+6kNHup1DSkPybdDOfAQ7I+NcKDKS0S4ZG484T1h18l3lr3CO+7FK/MXCUx4FsI4ZUCGdu1q5w6uHhAzB4cTkKqvYnqIh0eyx2CJJU8Xq8AjAOG8H///NFs91VqjDKwuQCLZXDOFmA+30yBC49m5EgdhrlKR7HUMmrytU8ZerXajRUWKYFgvU7n/rLlOHDtsEJCpCJyHphuOQiLm07CRdh52AoqEkzZz9mVT5B4ydU0Khaw10AAAAAElFTkSuQmCC";
  });
  var xr;
  var br = se(() => {
    xr = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIkAAABtCAYAAACV8UJdAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAA0fSURBVHgB7Z29jxxFGsafu1sJLCRkI1kCiaAtAk4EeDfzRdtOLC5ArCUCSwTbdmQir7PLdvwX2I7gEjwOkC5AshHJiQC3AyRfZFtICALktkTgE4EXAgQBGuqZ7hpXV1f1Z/XHeOsnlWa7Z2a7p/vpt956q+otYLpcEuWRKPdF2YTHoxGIslDKHXg8GnPkRcISwuPJCFAUyJjWJBRlBl/lTYpbMItkDGuyrx3fC2UC7MAukKGtyb7h+BE8o8PWzOqmHH3hhbGsySWYRRrBMyoRtJvy6MKFRfj66/qNuoF+2YXdkkXwjErOikRvvbVY7O0t7rz/vulmHUU/lAnk0Irkr5gGNO+BumP/1Knlq7Aky6KxB/fQKb0GT4EpiCSAdtOFFUHw8sur7V2xrUFRubQmFMgd/X+q53CYmYJIclaEN0ZaEQlFI5xYdRdvpitrEsAgEJ6DwYIdSsYWSQDtZu9qVkSyt7Wl73JhTQJYBDLThHqYGVskM3WD4rDdnEtCJI6tSYBUIIG60wukyJgiCZC2JlaU3RwKxGJN2h7bC6QmY4rkqrpBK2JwUHNYrEmEZgTwAmmEFAmfSPaZsAlIEx6i336KnaysqHODLNZkF/UJYBAIxecFYmcD6ZNYFh94IEoiymPlb74eoD05K8JWRJUVkfBzs3v3cl/PSlzxVVqdgkD4/65tb8NjhyIJKj6zCbNVoUikWB7imYASlAso0o9548wZ1IXVEpvE82+/VXfvo1wkR7P3A3UnBTJvcOzDCkUyR3qRm8ILH2Z/72jvJVl5iLzleaAfK7I0ecvYLYokhN2aSIGcVHduHj++LgLh+fMhZbUaiHJdlNsYEIokEeUKtJvH+v/g99/RkiArYdUH91v4AjJUH//4Y+5fwSwSVm0FgYg+IUwYCoMPHoWxiXwcJxTlGLpV943YyF7pk+SCUztvvIGroq5+8NNPS7E8FK/yb/nalTZWREJxxZ99pu4KUbQm7DGO1A9JgWitpCkgW2rvoSgMHb4fYyCkSKhKWpOVQ0lzTrMuQ9MUjYoUC8WT/PJLTkB1MIXfm2CxJnzy4uxv/pZIP+atd9+dkkBUYYQ1v8N7FWNANpS/aU1yJ3tFtCJCi1nmhbb00OasjxSQbn12O1gRicGaRKJcRmoVc9FYHosWZAKddgFSMYdoN4DqLgZmQ9umNQnlBp/Sm5lFaQJNOtEFJC0Nb5SLm8X/z2Np1iuG5oNMQCChKNtoIAwZXOT154OmEGNgdJHEWQnlDsYk3hNVjQsTLa2PSxgIO//ll+quqQgkRCqMCNVhhvQL4tpsi6L6atfv39c/FmNgNgz7ziOdNbd0nKhinuj+RCOSvKCX7941OtIjCCTEs1ZJrR5qCoP+Hh9E/TxpybXflSANIwyKSSQJ0rb4qkl8TYjEhQ/RFwzVa1HYpdUaSCAhWgpjtzhOJsfdvFNOHmIENiz7c01iqplO7I2JBp9Y5VDI8qnjhY/7E4ga3NpBDWHwfOg71RGGSlwUyaBBNIlNJGxmsZWwGpmuN4mnBC86BXwlsyaMpJ7MnGfH8MFh07q2MHjNdlr4dBS8QSQxRmCj5L05njXVlpQ1iceGN0KP5fRAac84hSCtBQXSxdk3xJuSrAzORsX7TprEzzMUAp1nOp5dhaHy+Q8/6LtijESVSGKk9eCqA29PtCRcNYmnju03qsLoq/o1VDWfYyT+UuMzAZQmMeEAnak2iV3C5v9pEdHlqwxu2aLMLqE/cuyjj/TdJzBSdVNHJGQGpUnMJ+n+Bx8cmnkpUiRDwapm54sv1F2MjWxhJOqOcWWTOJEbVDoDWIeFoR+G20V/ZNSLXVckspd4BX+Iod70OGAq8RFJk9Hyc2ge9hUtyunpDqs2rUOPDB6KV2k6pSJnTah4QweUpwOWANpgo9BM1HVcVeZQpjHQiX104cKhaBIPwVnhsGo+SYJn/uBBVn7GM+Ek2qttX2uq4iQmZkgHJ636dabcS7xuGCKtAWoONSjhQCvqvjLB8TVpI5IEa9ZLvE64GDts4CjaT64/+ze0g47UOXng3/74YzlUMfLh+s68+tJLy2vZk1jacKSNTyJhqP6WuoPjN3xODzdQJGpR9/2s7JMtIbVFZNrXgXkXkRBOmwzlBgUy8fksh5IqwbFFZQjgEQ5y2ukqkhBablXOq720NVoE2dMQVm2h6J8yVG+xKGdFOWjrk0gSpB1Pq3EW9548wcW338aLG218Ys+QcNjHO7dvL31K/S2kAvmNG11FQmJRLoryIjd4wCNCIN43mTYMW1z86ivTWwyY5uYsuRAJ1XYE2uCkqMFYTs+wsDvlX19/bXwLWooy4irTUa6XmGhzYTwTgb33M3OfG8c0z0xvuLAkhNaESW7OyR1sfrHK8QG26cAH9+NvvtF3M9r6oSgf277XtXWjk2sSc8wnByd5xoUtF46wM4T8KZDTqOhldmVJJLQmkdx48uuvOCb8klOvvQbPONCi/1O0YCyj7/8hyndV/8N19sUYab/OipkfczIacoyuRSCnUbOXuI8UnbmOJN/CGQcGyeQgbv0tNBAIcR3xCqClzPTR1+FhCILjUsqiqGiAa5HkOvzYstnzIhkURlEjc/iBUdQILXBZ3UTQpkH6BLrDwiCZRSAMkkVoicsm8CMoI6gYcZ1qFoLnEQrE0kgwRlGb4Kq64Si1ILfDW5HBYBT1mnlAOhMSzdERFyIJULHylac/GEXVEh8TOqYUiJP5Oi5EMoPS7O2aetNTH1YxFoFURlGb0NVxDWBYs8ZbkWGwBMnYnHQ6maurSHKj0uqsWeNxh2HMDtNTJHBMF5FE0JzVq35JkEExWOxebkBbkdAHKaw2MUA6Ko/CdtGSBOiBtiKxLvbsGQ72i2nWRGaGdEobkQTQgjP73lkdjc1ilskQjmkjkpm6IVey8oyDwXk9Ccc0FUkI3+SdFIZ8taNXNzfUDd/kHZ9Ns0jaTg430kQkETRnlQsMecbF4LwSp9akrkgCGJq8m/2k5vY0xOCXjCIS3+SdMIaH1anzWkckAbReXt/knRYne24G1xHJTN2gOPyIs2lhsCQBHDqvVUMFImhNXnI6vzhiKWpOjCbIFR98tVaNdF61kfHOloWtEsklfYclz2gvsCt8e4Bc7s8DvEba2BJnIqmqbgKMzGFKT96FPp3XqmmerCfewYgMPVWUTyNzdzBNVJ9NfFpjzo3hsf735Ikt3lEbJg36d34yOH2S63BA3aVMArQjQTtmGCGhsD7ivM/UXvTr9OzP0g+T6+g0+b2W5U+OwUE2addZBVzBp+ARBlxjxzQloS9xUhx1nP8wWyN4u2YKj61PP9WHNHKsa4yOuM4q4IpC9iT++L5ysdnmrPSV2ot+1ndPn1Z+jlUSsyKySuLyr6wCmefVJlpWW5pIOO+384z9qYqEcDBvLhfb/4V/4nr0W8mkpvQkxEU/9+abzqwJb/yHxVxlcfZ6tOx7/338eCkYLpr0vRAZHxjVwjzOPqNAn/I/6MiURUJrknOcecNcZk/iBbfkDkugZLvmxadQXEAroj3tMdJqgU4mm3LM9f4qSgRDZ55ZLjnvl4UZBCjiv7/yiu68vggHzutUfRIVTk1bdVi5SihcMrH6fPaaGxbhIts1rcGJTz4xHW9u+Dh/c4h0sYcQNaBQDIHLzs5rH/lJXHNZ3aDT13XFrgqBzNHTAlCG/5HAPg2T1S0TFtLKnMjOLUYJlsh2iI6sg0hiaBenS4CthkAkhQWgLKm1a0ErYphtd6Xu15GeGwVDy8BzZSqJOhYiQEfWQSQkdzFZp7dZsauBQEgMgzjbrh7R0IqUcZB9L0IqGArnJuwxqQAdWReRxEgvxAq2SJrcsIYCUd9bQWvQRpwdrUgVMVLBsEqSDnAiD420yurEuoiEcEzLyrzKFbvq0FIgJIF2M5nioak1cWhFqoiRXicK5hgcLTi9TiKhQHLNuTo3rINAVoeBJs4mTmzPVqSMzuF4yTqJhDS6YQ4EsjwMDOKsO1ziZlEgCfqxIr2xbiIpLGLNG2ZIweBKIJIZWuTOH9GKOGXdREJoTXL5N/QmMZuqJQnm5mhHzomtE6/h+5rFSeBoINCQrKNIiDXAxhD1ebtAZmhPjIYBNsP7ZU3VyTLlvpsyEqSRxEDuYP/K1vHjtqXCugpkdRgoqS6XYXbRj2QanDTP+lW0c6a4nTmUQ7EOfTc2QmiZlix9F64EIplDGRDFzkauxKH3ErOPRqtq+L3zWEPW1ZKQBNr6f4a15FwLhNAfipANYaAo9TEnBitCGqfrngrr6pNIZrBf+D4EQhJUxGsMvsgca+iLPE/MRFloZYZ+4ViPp+ox97a2Fou9vcWNM2cWhvMJ4BkVOR52KIFI9qCJQfgmC+Gj6AK5Ac8kCETZQQ+poCpQxbkQzqu3Ip4CIYqi8FbEU4DNcJtIAng8sFsTb0U8OeYoiiSEx6OgN4nv4DlinSOuU4JzhL5HOl+GEVmu2L2W0VUTfwLZMbcFHnJO2gAAAABJRU5ErkJggg==";
  });
  var gr;
  var wr = se(() => {
    yr();
    br();
    gr = s((e) => {
      function r(P = 2, w = 1) {
        let C = 0;
        return { id: "explode", require: ["scale"], update() {
          let S = Math.sin(C * P) * w;
          S < 0 && e.destroy(this), this.scale = e.vec2(S), C += e.dt();
        } };
      }
      __name(r, "r");
      s(r, "explode");
      let t = null, c = null;
      e.loadSprite(null, Ur).then((P) => t = P), e.loadSprite(null, xr).then((P) => c = P);
      function x(P, w = {}) {
        var ee, G;
        let C = (w.speed || 1) * 5, S = w.scale || 1, Z = e.add([e.pos(P), e.sprite(c), e.scale(0), e.stay(), e.origin("center"), r(C, S), ...((ee = w.boomComps) != null ? ee : () => [])()]), X = e.add([e.pos(P), e.sprite(t), e.scale(0), e.stay(), e.origin("center"), e.timer(0.4 / C, () => X.use(r(C, S))), ...((G = w.kaComps) != null ? G : () => [])()]);
        return { destroy() {
          e.destroy(X), e.destroy(Z);
        } };
      }
      __name(x, "x");
      return s(x, "addKaboom"), { addKaboom: x };
    }, "default");
  });
  var xn = en((as, Er) => {
    ke();
    zt();
    Jt();
    Kt();
    fr();
    pr();
    yt();
    wr();
    Er.exports = (e = {}) => {
      var vt;
      let r = Qt(), t = Gt({ width: e.width, height: e.height, scale: e.scale, crisp: e.crisp, canvas: e.canvas, root: e.root, stretch: e.stretch, touchToMouse: (vt = e.touchToMouse) != null ? vt : true, audioCtx: r.ctx }), c = Yt(t.gl, { background: e.background ? H(e.background) : void 0, width: e.width, height: e.height, scale: e.scale, texFilter: e.texFilter, stretch: e.stretch, letterbox: e.letterbox }), { width: x, height: P } = c, w = lr(c, r, { errHandler: (n) => {
        C.error(n);
      } }), C = mr(c, w, { max: e.logMax }), S = "apl386o", Z = "sink";
      function X() {
        return t.dt() * ne.timeScale;
      }
      __name(X, "X");
      s(X, "dt");
      function ee(n, i = {}) {
        let o = r.play({ buf: new AudioBuffer({ length: 1, numberOfChannels: 1, sampleRate: 44100 }) });
        return Le(() => {
          let d = w.sounds[n];
          if (!d)
            throw new Error(`sound not found: "${n}"`);
          let f = r.play(d, i);
          for (let a in f)
            o[a] = f[a];
        }), o;
      }
      __name(ee, "ee");
      s(ee, "play");
      function G() {
        return t.mousePos();
      }
      __name(G, "G");
      s(G, "mousePos");
      function re() {
        return m.camMousePos;
      }
      __name(re, "re");
      s(re, "mouseWorldPos");
      function O(n, i = {}) {
        var f, a;
        let o = (() => typeof n == "string" ? w.sprites[n] : n)();
        if (!o)
          throw new Error(`sprite not found: "${n}"`);
        let d = o.frames[(f = i.frame) != null ? f : 0];
        if (!d)
          throw new Error(`frame not found: ${(a = i.frame) != null ? a : 0}`);
        c.drawTexture(o.tex, Re(Ce({}, i), { quad: d.scale(i.quad || he(0, 0, 1, 1)) }));
      }
      __name(O, "O");
      s(O, "drawSprite");
      function j(n, i = {}) {
        var f;
        let o = (f = i.font) != null ? f : S, d = w.fonts[o];
        if (!d)
          throw new Error(`font not found: ${o}`);
        c.drawText(n, d, i);
      }
      __name(j, "j");
      s(j, "drawText");
      let te = 1600, me = "topleft", m = { loaded: false, events: {}, objEvents: {}, objs: new le(), timers: new le(), cam: { pos: ut(), scale: u(1), angle: 0, shake: 0 }, camMousePos: t.mousePos(), camMatrix: ue(), layers: {}, defLayer: null, gravity: te, on(n, i) {
        return this.events[n] || (this.events[n] = new le()), this.events[n].pushd(i);
      }, trigger(n, ...i) {
        this.events[n] && this.events[n].forEach((o) => o(...i));
      }, scenes: {}, paused: false };
      function pe(n, i) {
        n.forEach((o, d) => {
          m.layers[o] = d + 1;
        }), i && (m.defLayer = i);
      }
      __name(pe, "pe");
      s(pe, "layers");
      function D(...n) {
        return n.length > 0 && (m.cam.pos = u(...n)), m.cam.pos.clone();
      }
      __name(D, "D");
      s(D, "camPos");
      function E(...n) {
        return n.length > 0 && (m.cam.scale = u(...n)), m.cam.scale.clone();
      }
      __name(E, "E");
      s(E, "camScale");
      function M(n) {
        return n !== void 0 && (m.cam.angle = n), m.cam.angle;
      }
      __name(M, "M");
      s(M, "camRot");
      function J(n = 12) {
        m.cam.shake = n;
      }
      __name(J, "J");
      s(J, "shake");
      function _(n) {
        return m.camMatrix.multVec2(n);
      }
      __name(_, "_");
      s(_, "toScreen");
      function W(n) {
        return m.camMatrix.invert().multVec2(n);
      }
      __name(W, "W");
      s(W, "toWorld");
      let V = new Set(["id", "require"]), F = new Set(["add", "load", "update", "draw", "destroy", "inspect"]);
      function L(n) {
        let i = new Map(), o = {}, d = {}, f = { _id: null, hidden: false, paused: false, use(a) {
          if (!a)
            return;
          if (typeof a == "string")
            return this.use({ id: a });
          a.id && (this.unuse(a.id), i.set(a.id, {}));
          let h = a.id ? i.get(a.id) : o;
          h.cleanups = [];
          for (let U in a)
            if (!V.has(U)) {
              if (typeof a[U] == "function") {
                let B = a[U].bind(this);
                if (F.has(U)) {
                  h.cleanups.push(this.on(U, B)), h[U] = B;
                  continue;
                } else
                  h[U] = B;
              } else
                h[U] = a[U];
              this[U] === void 0 && Object.defineProperty(this, U, { get: () => h[U], set: (B) => h[U] = B, configurable: true, enumerable: true });
            }
          let b = s(() => {
            if (!!a.require) {
              for (let U of a.require)
                if (!this.c(U))
                  throw new Error(`comp '${a.id}' requires comp '${U}'`);
            }
          }, "checkDeps");
          this.exists() ? (a.add && a.add.call(this), a.load && Le(() => a.load.call(this)), b()) : a.require && h.cleanups.push(this.on("add", () => {
            b();
          }));
        }, unuse(a) {
          if (i.has(a)) {
            let h = i.get(a);
            h.cleanups.forEach((b) => b());
            for (let b in h)
              delete h[b];
          }
          i.delete(a);
        }, c(a) {
          return i.get(a);
        }, exists() {
          return this._id !== null;
        }, is(a) {
          if (a === "*")
            return true;
          if (Array.isArray(a)) {
            for (let h of a)
              if (!this.c(h))
                return false;
            return true;
          } else
            return this.c(a) != null;
        }, on(a, h) {
          return d[a] || (d[a] = new le()), d[a].pushd(h);
        }, action(a) {
          return this.on("update", a);
        }, trigger(a, ...h) {
          d[a] && d[a].forEach((U) => U.call(this, ...h));
          let b = m.objEvents[a];
          b && b.forEach((U) => {
            this.is(U.tag) && U.cb(this, ...h);
          });
        }, destroy() {
          !this.exists() || (this.trigger("destroy"), m.objs.delete(this._id), this._id = null);
        }, inspect() {
          let a = {};
          for (let [h, b] of i)
            a[h] = b.inspect ? b.inspect() : null;
          return a;
        } };
        for (let a of n)
          f.use(a);
        return f;
      }
      __name(L, "L");
      s(L, "make");
      function p(n) {
        let i = L(n);
        return i._id = m.objs.push(i), i.trigger("add"), Le(() => i.trigger("load")), i;
      }
      __name(p, "p");
      s(p, "add");
      function $(n) {
        if (!!n.exists())
          return m.objs.delete(n._id), n._id = m.objs.push(n), n;
      }
      __name($, "$");
      s($, "readd");
      function ce(n, i, o) {
        return m.objEvents[n] || (m.objEvents[n] = new le()), m.objEvents[n].pushd({ tag: i, cb: o });
      }
      __name(ce, "ce");
      s(ce, "on");
      function ie(n, i) {
        if (typeof n == "function" && i === void 0)
          return p([{ update: n }]).destroy;
        if (typeof n == "string")
          return ce("update", n, i);
      }
      __name(ie, "ie");
      s(ie, "action");
      function N(n, i) {
        if (typeof n == "function" && i === void 0)
          return p([{ draw: n }]).destroy;
        if (typeof n == "string")
          return ce("draw", n, i);
      }
      __name(N, "N");
      s(N, "render");
      function ze(n, i, o) {
        let d = ce("collide", n, (h, b, U) => b.is(i) && o(h, b)), f = ce("collide", i, (h, b, U) => b.is(n) && o(b, h)), a = ie(n, (h) => {
          h._checkCollisions(i, (b) => {
            o(h, b);
          });
        });
        return () => [d, f, a].forEach((h) => h());
      }
      __name(ze, "ze");
      s(ze, "collides");
      function l(n, i) {
        return ie(n, (o) => {
          o.isClicked() && i(o);
        });
      }
      __name(l, "l");
      s(l, "clicks");
      function y(n, i, o) {
        return ie(n, (d) => {
          d.isHovering() ? i(d) : o && o(d);
        });
      }
      __name(y, "y");
      s(y, "hovers");
      function g(n, i) {
        return new Promise((o) => {
          m.timers.push({ time: n, action: () => {
            i && i(), o();
          } });
        });
      }
      __name(g, "g");
      s(g, "wait");
      function v(n, i) {
        let o = false, d = s(() => {
          o || (i(), g(n, d));
        }, "newF");
        return d(), () => o = true;
      }
      __name(v, "v");
      s(v, "loop");
      function A(n, i) {
        if (Array.isArray(n)) {
          let o = n.map((d) => A(d, i));
          return () => o.forEach((d) => d());
        }
        return m.on("input", () => t.keyDown(n) && i());
      }
      __name(A, "A");
      s(A, "keyDown");
      function R(n, i) {
        if (Array.isArray(n)) {
          let o = n.map((d) => R(d, i));
          return () => o.forEach((d) => d());
        } else
          return typeof n == "function" ? m.on("input", () => t.keyPressed() && n()) : m.on("input", () => t.keyPressed(n) && i());
      }
      __name(R, "R");
      s(R, "keyPress");
      function z2(n, i) {
        if (Array.isArray(n)) {
          let o = n.map((d) => z2(d, i));
          return () => o.forEach((d) => d());
        } else
          return typeof n == "function" ? m.on("input", () => t.keyPressed() && n()) : m.on("input", () => t.keyPressedRep(n) && i());
      }
      __name(z2, "z");
      s(z2, "keyPressRep");
      function k2(n, i) {
        if (Array.isArray(n)) {
          let o = n.map((d) => k2(d, i));
          return () => o.forEach((d) => d());
        } else
          return typeof n == "function" ? m.on("input", () => t.keyPressed() && n()) : m.on("input", () => t.keyReleased(n) && i());
      }
      __name(k2, "k");
      s(k2, "keyRelease");
      function T(n) {
        return m.on("input", () => t.mouseDown() && n(G()));
      }
      __name(T, "T");
      s(T, "mouseDown");
      function Q(n) {
        return m.on("input", () => t.mouseClicked() && n(G()));
      }
      __name(Q, "Q");
      s(Q, "mouseClick");
      function q(n) {
        return m.on("input", () => t.mouseReleased() && n(G()));
      }
      __name(q, "q");
      s(q, "mouseRelease");
      function K(n) {
        return m.on("input", () => t.mouseMoved() && n(G(), t.mouseDeltaPos()));
      }
      __name(K, "K");
      s(K, "mouseMove");
      function oe(n) {
        return m.on("input", () => t.charInputted().forEach((i) => n(i)));
      }
      __name(oe, "oe");
      s(oe, "charInput"), t.canvas.addEventListener("touchstart", (n) => {
        [...n.changedTouches].forEach((i) => {
          m.trigger("touchStart", i.identifier, u(i.clientX, i.clientY).scale(1 / t.scale));
        });
      }), t.canvas.addEventListener("touchmove", (n) => {
        [...n.changedTouches].forEach((i) => {
          m.trigger("touchMove", i.identifier, u(i.clientX, i.clientY).scale(1 / t.scale));
        });
      }), t.canvas.addEventListener("touchmove", (n) => {
        [...n.changedTouches].forEach((i) => {
          m.trigger("touchEnd", i.identifier, u(i.clientX, i.clientY).scale(1 / t.scale));
        });
      });
      function ge(n) {
        return m.on("touchStart", n);
      }
      __name(ge, "ge");
      s(ge, "touchStart");
      function ae(n) {
        return m.on("touchMove", n);
      }
      __name(ae, "ae");
      s(ae, "touchMove");
      function ye(n) {
        return m.on("touchEnd", n);
      }
      __name(ye, "ye");
      s(ye, "touchEnd");
      function Ue() {
        R("f1", () => {
          ne.inspect = !ne.inspect;
        }), R("f2", () => {
          ne.clearLog();
        }), R("f8", () => {
          ne.paused = !ne.paused, C.info(`${ne.paused ? "paused" : "unpaused"}`);
        }), R("f7", () => {
          ne.timeScale = fe(ne.timeScale - 0.2, 0, 2), C.info(`time scale: ${ne.timeScale.toFixed(1)}`);
        }), R("f9", () => {
          ne.timeScale = fe(ne.timeScale + 0.2, 0, 2), C.info(`time scale: ${ne.timeScale.toFixed(1)}`);
        }), R("f10", () => {
          ne.stepFrame(), C.info("stepped frame");
        });
      }
      __name(Ue, "Ue");
      s(Ue, "regDebugInput");
      function Ee(n) {
        let i = [...m.objs.values()].sort((o, d) => {
          var h, b, U, B, I, Y;
          let f = (b = m.layers[(h = o.layer) != null ? h : m.defLayer]) != null ? b : 0, a = (B = m.layers[(U = d.layer) != null ? U : m.defLayer]) != null ? B : 0;
          return f == a ? ((I = o.z) != null ? I : 0) - ((Y = d.z) != null ? Y : 0) : f - a;
        });
        return n ? i.filter((o) => o.is(n)) : i;
      }
      __name(Ee, "Ee");
      s(Ee, "get");
      function xe(n, i) {
        if (typeof n == "function" && i === void 0)
          return Ee().forEach((o) => o.exists() && n(o));
        if (typeof n == "string")
          return Ee(n).forEach((o) => o.exists() && i(o));
      }
      __name(xe, "xe");
      s(xe, "every");
      function ve(n, i) {
        if (typeof n == "function" && i === void 0)
          return Ee().reverse().forEach((o) => o.exists() && n(o));
        if (typeof n == "string")
          return Ee(n).reverse().forEach((o) => o.exists() && i(o));
      }
      __name(ve, "ve");
      s(ve, "revery");
      function Ve(n) {
        n.destroy();
      }
      __name(Ve, "Ve");
      s(Ve, "destroy");
      function rt(n) {
        xe(n, Ve);
      }
      __name(rt, "rt");
      s(rt, "destroyAll");
      function be(n) {
        return n !== void 0 && (m.gravity = n), m.gravity;
      }
      __name(be, "be");
      s(be, "gravity");
      function nt(n, i) {
      }
      __name(nt, "nt");
      s(nt, "regCursor");
      function Ze(n) {
        m.trigger("next"), delete m.events.next, (n || !ne.paused) && (m.timers.forEach((a, h) => {
          a.time -= X(), a.time <= 0 && (a.action(), m.timers.delete(h));
        }), ve((a) => {
          a.paused || a.trigger("update", a);
        }));
        let o = u(x(), P()), d = m.cam, f = je($e(0, 360)).scale(d.shake);
        d.shake = qe(d.shake, 0, 5 * X()), m.camMatrix = ue().translate(o.scale(0.5)).scale(d.scale).rotateZ(d.angle).translate(o.scale(-0.5)).translate(d.pos.scale(-1).add(o.scale(0.5)).add(f)), xe((a) => {
          a.hidden || (c.pushTransform(), a.fixed || c.pushMatrix(m.camMatrix), a.trigger("draw"), c.popTransform());
        });
      }
      __name(Ze, "Ze");
      s(Ze, "gameFrame");
      function Ge() {
        var f;
        let n = null, i = w.fonts[Z], o = H((f = e.inspectColor) != null ? f : [0, 0, 255]);
        function d(a, h) {
          let b = c.scale(), U = u(6).scale(1 / b), B = c.fmtText(h, i, { size: 16 / b, pos: a.add(u(U.x, U.y)), color: H(0, 0, 0) }), I = B.width + U.x * 2, Y = B.height + U.x * 2;
          c.pushTransform(), a.x + I >= x() && c.pushTranslate(u(-I, 0)), a.y + Y >= P() && c.pushTranslate(u(0, -Y)), c.drawRect(a, I, Y, { color: H(255, 255, 255) }), c.drawRectStroke(a, I, Y, { width: 2 / b, color: H(0, 0, 0) }), c.drawFmtText(B), c.popTransform();
        }
        __name(d, "d");
        if (s(d, "drawInspectTxt"), xe((a) => {
          if (!a.area || a.hidden)
            return;
          let h = c.scale() * (a.fixed ? 1 : (m.cam.scale.x + m.cam.scale.y) / 2);
          a.fixed || (c.pushTransform(), c.pushMatrix(m.camMatrix)), n || a.isHovering() && (n = a);
          let b = (n === a ? 8 : 4) / h, U = a.worldArea(), B = U.p2.x - U.p1.x, I = U.p2.y - U.p1.y;
          c.drawRectStroke(U.p1, B, I, { width: b, color: o }), a.fixed || c.popTransform();
        }), n) {
          let a = [], h = n.inspect();
          for (let b in h)
            h[b] ? a.push(`${b}: ${h[b]}`) : a.push(`${b}`);
          d(G(), a.join(`
`));
        }
        d(u(0), `FPS: ${t.fps()}`);
      }
      __name(Ge, "Ge");
      s(Ge, "drawInspect");
      function Je(...n) {
        return { id: "pos", pos: u(...n), moveBy(...i) {
          let o = u(...i), d = o.x, f = o.y, a = null;
          if (this.solid && this.area) {
            let h = this.worldArea();
            xe((b) => {
              if (!this.exists() || b === this || !b.solid)
                return;
              let U = b.worldArea(), B = Ke(U, h);
              if (Qe(B, u(0))) {
                let Be = Math.min(Math.abs(B.p1.x), Math.abs(B.p2.x), Math.abs(B.p1.y), Math.abs(B.p2.y)), Te = (() => {
                  switch (Be) {
                    case Math.abs(B.p1.x):
                      return u(Be, 0);
                    case Math.abs(B.p2.x):
                      return u(-Be, 0);
                    case Math.abs(B.p1.y):
                      return u(0, Be);
                    case Math.abs(B.p2.y):
                      return u(0, -Be);
                  }
                })();
                this.pos = this.pos.sub(Te), h = this.worldArea(), B = Ke(U, h);
              }
              let I = { p1: u(0), p2: u(d, f) }, Y = 1, de = "right", Pe = B.p1, Se = u(B.p1.x, B.p2.y), De = B.p2, Ne = u(B.p2.x, B.p1.y), He = 0, Bt = { right: { p1: Pe, p2: Se }, top: { p1: Se, p2: De }, left: { p1: De, p2: Ne }, bottom: { p1: Ne, p2: Pe } };
              for (let Be in Bt) {
                let Te = Bt[Be];
                if (d === 0 && Te.p1.x === 0 && Te.p2.x === 0 || f === 0 && Te.p1.y === 0 && Te.p2.y === 0) {
                  Y = 1;
                  break;
                }
                let ct = Xt(I, Te);
                ct != null && (He++, ct < Y && (Y = ct, de = Be));
              }
              Y < 1 && !(Y === 0 && He == 1 && !Qe(B, u(d, f))) && (d *= Y, f *= Y, a = { obj: b, side: de });
            });
          }
          if (this.pos.x += d, this.pos.y += f, a) {
            let h = { right: "left", left: "right", top: "bottom", bottom: "top" };
            this.trigger("collide", a.obj, a.side), a.obj.trigger("collide", this, h[a.side]);
          }
          return a;
        }, move(...i) {
          return this.moveBy(u(...i).scale(X()));
        }, moveTo(...i) {
          if (typeof i[0] == "number" && typeof i[1] == "number")
            return this.moveTo(u(i[0], i[1]), i[2]);
          let o = i[0], d = i[1];
          if (d === void 0) {
            this.pos = u(o);
            return;
          }
          let f = o.sub(this.pos);
          if (f.len() <= d * X()) {
            this.pos = u(o);
            return;
          }
          this.move(f.unit().scale(d));
        }, screenPos() {
          return this.fixed ? this.pos : _(this.pos);
        }, inspect() {
          return `(${~~this.pos.x}, ${~~this.pos.y})`;
        } };
      }
      __name(Je, "Je");
      s(Je, "pos");
      function Ie(...n) {
        return n.length === 0 ? Ie(1) : { id: "scale", scale: u(...n), scaleTo(...i) {
          this.scale = u(...i);
        }, inspect() {
          return `(${ot(this.scale.x, 2)}, ${ot(this.scale.y, 2)})`;
        } };
      }
      __name(Ie, "Ie");
      s(Ie, "scale");
      function st(n) {
        return { id: "rotate", angle: n != null ? n : 0, inspect() {
          return `${Math.round(this.angle)}`;
        } };
      }
      __name(st, "st");
      s(st, "rotate");
      function it(...n) {
        return { id: "color", color: H(...n), inspect() {
          return this.color.str();
        } };
      }
      __name(it, "it");
      s(it, "color");
      function ot(n, i) {
        return Number(n.toFixed(i));
      }
      __name(ot, "ot");
      s(ot, "toFixed");
      function vr(n) {
        return { id: "opacity", opacity: n != null ? n : 1, inspect() {
          return `${ot(this.opacity, 2)}`;
        } };
      }
      __name(vr, "vr");
      s(vr, "opacity");
      function Br(n) {
        if (!n)
          throw new Error("please define an origin");
        return { id: "origin", origin: n, inspect() {
          return typeof this.origin == "string" ? this.origin : this.origin.str();
        } };
      }
      __name(Br, "Br");
      s(Br, "origin");
      function Cr(n) {
        return { id: "layer", layer: n, inspect() {
          var i;
          return (i = this.layer) != null ? i : m.defLayer;
        } };
      }
      __name(Cr, "Cr");
      s(Cr, "layer");
      function Pr(n) {
        return { id: "z", z: n, inspect() {
          return `${this.z}`;
        } };
      }
      __name(Pr, "Pr");
      s(Pr, "z");
      function Sr(n, i) {
        return { id: "follow", require: ["pos"], follow: { obj: n, offset: i != null ? i : u(0) }, add() {
          n.exists() && (this.pos = this.follow.obj.pos.add(this.follow.offset));
        }, update() {
          n.exists() && (this.pos = this.follow.obj.pos.add(this.follow.offset));
        } };
      }
      __name(Sr, "Sr");
      s(Sr, "follow");
      function Dr(n, i) {
        let o = typeof n == "number" ? je(n) : n.unit();
        return { id: "move", require: ["pos"], update() {
          this.move(o.scale(i));
        } };
      }
      __name(Dr, "Dr");
      s(Dr, "move");
      function Tr(n = 0) {
        let i = 0;
        return { id: "cleanup", require: ["pos", "area"], update() {
          let o = { p1: u(0, 0), p2: u(x(), P()) };
          Oe(this.screenArea(), o) ? i = 0 : (i += X(), i >= n && this.destroy());
        } };
      }
      __name(Tr, "Tr");
      s(Tr, "cleanup");
      function Rr(n = {}) {
        var o, d;
        let i = {};
        return { id: "area", add() {
          this.area.cursor && this.hovers(() => {
            t.cursor(this.area.cursor);
          });
        }, area: { offset: (o = n.offset) != null ? o : u(0), width: n.width, height: n.height, scale: (d = n.scale) != null ? d : u(1), cursor: n.cursor }, areaWidth() {
          let { p1: f, p2: a } = this.worldArea();
          return a.x - f.x;
        }, areaHeight() {
          let { p1: f, p2: a } = this.worldArea();
          return a.y - f.y;
        }, isClicked() {
          return t.mouseClicked() && this.isHovering();
        }, isHovering() {
          let f = this.fixed ? G() : re();
          return t.isTouch ? t.mouseDown() && this.hasPt(f) : this.hasPt(f);
        }, isColliding(f) {
          if (!f.area || !f.exists())
            return false;
          let a = this.worldArea(), h = f.worldArea();
          return Wt(a, h);
        }, isTouching(f) {
          if (!f.area || !f.exists())
            return false;
          let a = this.worldArea(), h = f.worldArea();
          return Oe(a, h);
        }, clicks(f) {
          return this.action(() => {
            this.isClicked() && f();
          });
        }, hovers(f, a) {
          return this.action(() => {
            this.isHovering() ? f() : a && a();
          });
        }, collides(f, a) {
          let h = this.action(() => this._checkCollisions(f, a)), b = this.on("collide", (U, B) => U.is(f) && a(U, B));
          return () => [h, b].forEach((U) => U());
        }, hasPt(f) {
          let a = this.worldArea();
          return qt({ p1: a.p1, p2: a.p2 }, f);
        }, pushOut(f) {
          if (f === this || !f.area)
            return null;
          let a = this.worldArea(), h = f.worldArea(), b = Ke(a, h);
          if (!Qe(b, u(0)))
            return null;
          let U = Math.min(Math.abs(b.p1.x), Math.abs(b.p2.x), Math.abs(b.p1.y), Math.abs(b.p2.y)), B = (() => {
            switch (U) {
              case Math.abs(b.p1.x):
                return u(U, 0);
              case Math.abs(b.p2.x):
                return u(-U, 0);
              case Math.abs(b.p1.y):
                return u(0, U);
              case Math.abs(b.p2.y):
                return u(0, -U);
            }
          })();
          this.pos = this.pos.add(B);
        }, pushOutAll() {
          xe((f) => this.pushOut(f));
        }, _checkCollisions(f) {
          xe(f, (a) => {
            this === a || !this.exists() || i[a._id] || this.isColliding(a) && (this.trigger("collide", a, null), i[a._id] = a);
          });
          for (let a in i) {
            let h = i[a];
            this.isColliding(h) || delete i[a];
          }
        }, worldArea() {
          var B, I, Y, de;
          let f = (B = this.area.width) != null ? B : this.width, a = (I = this.area.height) != null ? I : this.height;
          if (f == null || a == null)
            throw new Error("failed to get area dimension");
          let h = ((Y = this.scale) != null ? Y : u(1)).scale(this.area.scale);
          f *= h.x, a *= h.y;
          let b = Xe(this.origin || me), U = ((de = this.pos) != null ? de : u(0)).add(this.area.offset).sub(b.add(1, 1).scale(0.5).scale(f, a));
          return { p1: U, p2: u(U.x + f, U.y + a) };
        }, screenArea() {
          let f = this.worldArea();
          return this.fixed ? f : { p1: m.camMatrix.multVec2(f.p1), p2: m.camMatrix.multVec2(f.p2) };
        } };
      }
      __name(Rr, "Rr");
      s(Rr, "area");
      function Ar(n, i = {}) {
        var a;
        let o = null, d = null;
        function f(h, b, U, B) {
          let I = u(1, 1);
          return U && B ? (I.x = U / (h.width * b.w), I.y = B / (h.height * b.h)) : U ? (I.x = U / (h.width * b.w), I.y = I.x) : B && (I.y = B / (h.height * b.h), I.x = I.y), I;
        }
        __name(f, "f");
        return s(f, "calcTexScale"), { id: "sprite", width: 0, height: 0, frame: i.frame || 0, quad: i.quad || he(0, 0, 1, 1), animSpeed: (a = i.animSpeed) != null ? a : 1, load() {
          if (typeof n == "string" ? o = w.sprites[n] : o = n, !o)
            throw new Error(`sprite not found: "${n}"`);
          let h = Ce({}, o.frames[0]);
          i.quad && (h = h.scale(i.quad));
          let b = f(o.tex, h, i.width, i.height);
          this.width = o.tex.width * h.w * b.x, this.height = o.tex.height * h.h * b.y, i.anim && this.play(i.anim);
        }, draw() {
          O(o, { pos: this.pos, scale: this.scale, rot: this.angle, color: this.color, opacity: this.opacity, frame: this.frame, origin: this.origin, quad: this.quad, prog: w.shaders[this.shader], uniform: this.uniform, flipX: i.flipX, flipY: i.flipY, tiled: i.tiled, width: i.width, height: i.height });
        }, update() {
          if (!d)
            return;
          let h = o.anims[d.name];
          if (typeof h == "number") {
            this.frame = h;
            return;
          }
          if (h.speed === 0)
            throw new Error("sprite anim speed cannot be 0");
          d.timer += X() * this.animSpeed, d.timer >= 1 / d.speed && (d.timer = 0, h.from > h.to ? (this.frame--, this.frame < h.to && (d.loop ? this.frame = h.from : (this.frame++, d.onEnd(), this.stop()))) : (this.frame++, this.frame > h.to && (d.loop ? this.frame = h.from : (this.frame--, d.onEnd(), this.stop()))));
        }, play(h, b = {}) {
          var B, I, Y, de, Pe, Se, De;
          if (!o) {
            Le(() => {
              this.play(h);
            });
            return;
          }
          let U = o.anims[h];
          if (U == null)
            throw new Error(`anim not found: ${h}`);
          d && this.stop(), d = { name: h, timer: 0, loop: (I = (B = b.loop) != null ? B : U.loop) != null ? I : false, pingpong: (de = (Y = b.pingpong) != null ? Y : U.pingpong) != null ? de : false, speed: (Se = (Pe = b.speed) != null ? Pe : U.speed) != null ? Se : 10, onEnd: (De = b.onEnd) != null ? De : () => {
          } }, typeof U == "number" ? this.frame = U : this.frame = U.from, this.trigger("animPlay", h);
        }, stop() {
          if (!d)
            return;
          let h = d.name;
          d = null, this.trigger("animEnd", h);
        }, numFrames() {
          return o ? o.frames.length : 0;
        }, curAnim() {
          return d == null ? void 0 : d.name;
        }, flipX(h) {
          i.flipX = h;
        }, flipY(h) {
          i.flipY = h;
        }, inspect() {
          let h = "";
          return typeof n == "string" ? h += JSON.stringify(n) : h += "[blob]", h;
        } };
      }
      __name(Ar, "Ar");
      s(Ar, "sprite");
      function kr(n, i = {}) {
        function o() {
          var a, h, b, U;
          let d = w.fonts[(h = (a = this.font) != null ? a : e.font) != null ? h : S];
          if (!d)
            throw new Error(`font not found: "${d}"`);
          let f = c.fmtText(this.text + "", d, { pos: this.pos, scale: this.scale, rot: this.angle, size: i.size, origin: this.origin, color: this.color, opacity: this.opacity, width: i.width });
          return this.width = f.width / (((b = this.scale) == null ? void 0 : b.x) || 1), this.height = f.height / (((U = this.scale) == null ? void 0 : U.y) || 1), f;
        }
        __name(o, "o");
        return s(o, "update"), { id: "text", text: n, textSize: i.size, font: i.font, width: 0, height: 0, load() {
          o.call(this);
        }, draw() {
          c.drawFmtText(o.call(this));
        } };
      }
      __name(kr, "kr");
      s(kr, "text");
      function Vr(n, i) {
        return { id: "rect", width: n, height: i, draw() {
          c.drawRect(this.pos, this.width, this.height, { scale: this.scale, rot: this.angle, color: this.color, opacity: this.opacity, origin: this.origin, prog: w.shaders[this.shader], uniform: this.uniform });
        }, inspect() {
          return `${this.width}, ${this.height}`;
        } };
      }
      __name(Vr, "Vr");
      s(Vr, "rect");
      function Ir(n = 1, i = H(0, 0, 0)) {
        return { id: "outline", lineWidth: n, lineColor: i, draw() {
          if (this.width && this.height)
            c.drawRectStroke(this.pos || u(0), this.width, this.height, { width: this.lineWidth, color: this.lineColor, scale: this.scale, opacity: this.opacity, origin: this.origin, prog: w.shaders[this.shader], uniform: this.uniform });
          else if (this.area) {
            let o = this.worldArea(), d = o.p2.x - o.p1.x, f = o.p2.y - o.p1.y;
            c.drawRectStroke(o.p1, d, f, { width: n, color: i, opacity: this.opacity });
          }
        } };
      }
      __name(Ir, "Ir");
      s(Ir, "outline");
      function Mr(n, i) {
        let o = new le();
        return n && i && o.pushd({ time: n, action: i }), { id: "timer", wait(d, f) {
          return o.pushd({ time: d, action: f });
        }, update() {
          o.forEach((d, f) => {
            d.time -= X(), d.time <= 0 && (d.action.call(this), o.delete(f));
          });
        } };
      }
      __name(Mr, "Mr");
      s(Mr, "timer");
      let _r = 640, Fr = 65536;
      function Wr(n = {}) {
        var a, h, b;
        let i = 0, o = null, d = null, f = true;
        return { id: "body", require: ["pos"], jumpForce: (a = n.jumpForce) != null ? a : _r, weight: (h = n.weight) != null ? h : 1, solid: (b = n.solid) != null ? b : true, update() {
          var B;
          let U = false;
          if (o) {
            let I = this.worldArea(), Y = o.worldArea(), de = I.p2.y, Pe = Y.p1.y, Se = I.p1.x, De = I.p2.x, Ne = Y.p1.x, He = Y.p2.x;
            !o.exists() || de !== Pe || De < Ne || Se > He ? (this.trigger("fall", o), o = null, d = null, U = true) : d && o.pos && (this.pos = this.pos.add(o.pos.sub(d)), d = o.pos.clone());
          }
          if (!o) {
            let I = this.move(0, i);
            if (I)
              if (I.side === "bottom") {
                o = I.obj;
                let Y = i;
                i = 0, o.pos && (d = o.pos.clone()), U || (this.trigger("ground", o), f = true);
              } else
                I.side === "top" && (i = 0, this.trigger("headbutt", I.obj));
            i += be() * this.weight * X(), i = Math.min(i, (B = n.maxVel) != null ? B : Fr);
          }
        }, curPlatform() {
          return o;
        }, grounded() {
          return o !== null;
        }, falling() {
          return i > 0;
        }, jump(U) {
          o = null, d = null, i = -U || -this.jumpForce;
        }, djump(U) {
          this.grounded() ? this.jump(U) : f && (f = false, this.jump(U), this.trigger("djump"));
        } };
      }
      __name(Wr, "Wr");
      s(Wr, "body");
      function Xr(n, i = {}) {
        let o = w.shaders[n];
        return { id: "shader", shader: n, uniform: i };
      }
      __name(Xr, "Xr");
      s(Xr, "shader");
      function Lr() {
        return { id: "solid", require: ["area"], solid: true };
      }
      __name(Lr, "Lr");
      s(Lr, "solid");
      function qr() {
        return { id: "fixed", fixed: true };
      }
      __name(qr, "qr");
      s(qr, "fixed");
      function $r() {
        return { id: "stay", stay: true };
      }
      __name($r, "$r");
      s($r, "stay");
      function Yr(n) {
        if (n == null)
          throw new Error("health() requires the initial amount of hp");
        return { id: "health", hurt(i = 1) {
          this.setHP(n - i), this.trigger("hurt");
        }, heal(i = 1) {
          this.setHP(n + i), this.trigger("heal");
        }, hp() {
          return n;
        }, setHP(i) {
          n = i, n <= 0 && this.trigger("death");
        }, inspect() {
          return `${n}`;
        } };
      }
      __name(Yr, "Yr");
      s(Yr, "health");
      function zr(n, i = {}) {
        var a;
        if (n == null)
          throw new Error("lifespan() requires time");
        let o = 0, d = (a = i.fade) != null ? a : 0, f = Math.max(n - d, 0);
        return { id: "lifespan", update() {
          o += X(), o >= f && (this.opacity = Ae(o, f, n, 1, 0)), o >= n && this.destroy();
        } };
      }
      __name(zr, "zr");
      s(zr, "lifespan");
      let ne = { inspect: false, timeScale: 1, showLog: true, fps: t.fps, objCount() {
        return m.objs.size;
      }, stepFrame() {
        Ze(true);
      }, drawCalls: c.drawCalls, clearLog: C.clear, log: C.info, error: C.error, get paused() {
        return m.paused;
      }, set paused(n) {
        m.paused = n, n ? r.ctx.suspend() : r.ctx.resume();
      } };
      function Le(n) {
        m.loaded ? n() : m.on("load", n);
      }
      __name(Le, "Le");
      s(Le, "ready");
      function Zr(n, i) {
        m.scenes[n] = i;
      }
      __name(Zr, "Zr");
      s(Zr, "scene");
      function Gr(n, ...i) {
        if (!m.scenes[n])
          throw new Error(`scene not found: ${n}`);
        m.on("next", () => {
          m.events = {}, m.objEvents = { add: new le(), update: new le(), draw: new le(), destroy: new le() }, m.objs.forEach((o) => {
            o.stay || Ve(o);
          }), m.timers = new le(), m.cam = { pos: ut(), scale: u(1, 1), angle: 0, shake: 0 }, m.camMousePos = t.mousePos(), m.camMatrix = ue(), m.layers = {}, m.defLayer = null, m.gravity = te, m.scenes[n](...i), e.debug !== false && Ue();
        });
      }
      __name(Gr, "Gr");
      s(Gr, "go");
      function Jr(n, i) {
        try {
          return JSON.parse(window.localStorage[n]);
        } catch (o) {
          return i ? (wt(n, i), i) : null;
        }
      }
      __name(Jr, "Jr");
      s(Jr, "getData");
      function wt(n, i) {
        window.localStorage[n] = JSON.stringify(i);
      }
      __name(wt, "wt");
      s(wt, "setData");
      function at(n) {
        let i = n(Me);
        for (let o in i)
          Me[o] = i[o], e.global !== false && (window[o] = i[o]);
        return Me;
      }
      __name(at, "at");
      s(at, "plug");
      function ut() {
        return u(x() / 2, P() / 2);
      }
      __name(ut, "ut");
      s(ut, "center");
      function Nr(n, i) {
        return { id: "grid", gridPos: i.clone(), setGridPos(...o) {
          let d = u(...o);
          this.gridPos = d.clone(), this.pos = u(n.offset().x + this.gridPos.x * n.gridWidth(), n.offset().y + this.gridPos.y * n.gridHeight());
        }, moveLeft() {
          this.setGridPos(this.gridPos.add(u(-1, 0)));
        }, moveRight() {
          this.setGridPos(this.gridPos.add(u(1, 0)));
        }, moveUp() {
          this.setGridPos(this.gridPos.add(u(0, -1)));
        }, moveDown() {
          this.setGridPos(this.gridPos.add(u(0, 1)));
        } };
      }
      __name(Nr, "Nr");
      s(Nr, "grid");
      function Hr(n, i) {
        if (!i.width || !i.height)
          throw new Error("Must provide level grid width & height.");
        let o = [], d = u(i.pos || u(0)), f = 0, a = { offset() {
          return d.clone();
        }, gridWidth() {
          return i.width;
        }, gridHeight() {
          return i.height;
        }, getPos(...h) {
          let b = u(...h);
          return u(d.x + b.x * i.width, d.y + b.y * i.height);
        }, spawn(h, ...b) {
          let U = u(...b), B = (() => {
            if (i[h]) {
              if (typeof i[h] != "function")
                throw new Error("level symbol def must be a function returning a component list");
              return i[h]();
            } else if (i.any)
              return i.any(h);
          })();
          if (!B)
            return;
          let I = u(d.x + U.x * i.width, d.y + U.y * i.height);
          for (let de of B)
            if (de.id === "pos") {
              I.x += de.pos.x, I.y += de.pos.y;
              break;
            }
          B.push(Je(I)), B.push(Nr(this, U));
          let Y = p(B);
          return o.push(Y), Y;
        }, width() {
          return f * i.width;
        }, height() {
          return n.length * i.height;
        }, destroy() {
          for (let h of o)
            Ve(h);
        } };
        return n.forEach((h, b) => {
          let U = h.split("");
          f = Math.max(U.length, f), U.forEach((B, I) => {
            a.spawn(B, u(I, b));
          });
        }), a;
      }
      __name(Hr, "Hr");
      s(Hr, "addLevel");
      let Me = { loadRoot: w.loadRoot, loadSprite: w.loadSprite, loadSpriteAtlas: w.loadSpriteAtlas, loadSound: w.loadSound, loadFont: w.loadFont, loadShader: w.loadShader, loadAseprite: w.loadAseprite, loadPedit: w.loadPedit, loadBean: w.loadBean, load: w.load, width: x, height: P, center: ut, dt: X, time: t.time, screenshot: t.screenshot, focused: t.focused, focus: t.focus, cursor: t.cursor, regCursor: nt, fullscreen: t.fullscreen, ready: Le, isTouch: () => t.isTouch, layers: pe, camPos: D, camScale: E, camRot: M, shake: J, toScreen: _, toWorld: W, gravity: be, add: p, readd: $, destroy: Ve, destroyAll: rt, get: Ee, every: xe, revery: ve, pos: Je, scale: Ie, rotate: st, color: it, opacity: vr, origin: Br, layer: Cr, area: Rr, sprite: Ar, text: kr, rect: Vr, outline: Ir, body: Wr, shader: Xr, timer: Mr, solid: Lr, fixed: qr, stay: $r, health: Yr, lifespan: zr, z: Pr, move: Dr, cleanup: Tr, follow: Sr, on: ce, action: ie, render: N, collides: ze, clicks: l, hovers: y, keyDown: A, keyPress: R, keyPressRep: z2, keyRelease: k2, mouseDown: T, mouseClick: Q, mouseRelease: q, mouseMove: K, charInput: oe, touchStart: ge, touchMove: ae, touchEnd: ye, mousePos: G, mouseWorldPos: re, mouseDeltaPos: t.mouseDeltaPos, keyIsDown: t.keyDown, keyIsPressed: t.keyPressed, keyIsPressedRep: t.keyPressedRep, keyIsReleased: t.keyReleased, mouseIsDown: t.mouseDown, mouseIsClicked: t.mouseClicked, mouseIsReleased: t.mouseReleased, mouseIsMoved: t.mouseMoved, loop: v, wait: g, play: ee, volume: r.volume, burp: r.burp, audioCtx: r.ctx, rng: ft, rand: $e, randi: mt, randSeed: Mt, vec2: u, dir: je, rgb: H, quad: he, choose: Ft, chance: _t, lerp: qe, map: Ae, mapc: Rt, wave: Vt, deg2rad: _e, rad2deg: ht, colLineLine: Lt, colRectRect: Oe, drawSprite: O, drawText: j, drawRect: c.drawRect, drawRectStroke: c.drawRectStroke, drawLine: c.drawLine, drawTri: c.drawTri, debug: ne, scene: Zr, go: Gr, addLevel: Hr, getData: Jr, setData: wt, plug: at, ASCII_CHARS: xt, CP437_CHARS: dr, LEFT: u(-1, 0), RIGHT: u(1, 0), UP: u(0, -1), DOWN: u(0, 1), canvas: t.canvas };
      if (at(gr), e.plugins && e.plugins.forEach(at), e.global !== false)
        for (let n in Me)
          window[n] = Me[n];
      let Et = 0;
      function gn() {
        return Et;
      }
      __name(gn, "gn");
      return s(gn, "frames"), t.run(() => {
        if (Et++, c.frameStart(), m.loaded)
          m.camMousePos = m.camMatrix.invert().multVec2(t.mousePos()), m.trigger("input"), Ze(), ne.inspect && Ge(), ne.showLog && C.draw();
        else {
          let n = w.loadProgress();
          if (n === 1)
            m.loaded = true, m.trigger("load");
          else {
            let i = x() / 2, o = 24 / c.scale(), d = u(x() / 2, P() / 2).sub(u(i / 2, o / 2));
            c.drawRect(u(0), x(), P(), { color: H(0, 0, 0) }), c.drawRectStroke(d, i, o, { width: 4 / c.scale() }), c.drawRect(d, i * n, o);
          }
        }
        c.frameEnd();
      }), e.debug !== false && Ue(), window.addEventListener("error", (n) => {
        C.error(`Error: ${n.error.message}`), t.quit(), t.run(() => {
          w.loadProgress() === 1 && (c.frameStart(), C.draw(), c.frameEnd());
        });
      }), Me;
    };
  });
  var kaboom_default = xn();

  // code/kaboom.js
  var k = kaboom_default({
    background: [144, 238, 144]
  });
  var kaboom_default2 = k;

  // code/src/food.js
  loadSprite("apple", "sprites/apple.png");
  function spawnFood() {
    add([
      sprite("apple"),
      scale(0.5),
      area(),
      pos(rand(0, width()), rand(0, height())),
      "food"
    ]);
    wait(rand(0.5, 1.5), spawnFood);
  }
  __name(spawnFood, "spawnFood");

  // code/src/big.js
  function big() {
    let timer = 0;
    let isBig = false;
    let destScale = 1;
    return {
      id: "big",
      require: ["scale"],
      update() {
        if (isBig) {
          timer -= dt();
          if (timer <= 0) {
            this.smallify();
          }
        }
        this.scale = this.scale.lerp(vec2(destScale), dt() * 6);
      },
      isBig() {
        return isBig;
      },
      smallify() {
        destScale = 1;
        timer = 0;
        isBig = false;
      },
      biggify(time2) {
        destScale++;
        timer = time2;
        isBig = true;
      }
    };
  }
  __name(big, "big");

  // code/src/player.js
  loadSprite("bean", "sprites/bean.png");
  function getPlayer(tag) {
    const player = kaboom_default2.add([
      sprite("bean"),
      pos(center()),
      area(),
      move(0, 0),
      scale(1),
      big(),
      origin("center"),
      tag
    ]);
    return player;
  }
  __name(getPlayer, "getPlayer");

  // code/src/enemy.js
  loadSprite("googoly", "sprites/googoly.png");
  function getEnemy(tag) {
    const enemy = kaboom_default2.add([
      sprite("googoly"),
      pos(0, 0),
      area(),
      origin("top"),
      tag
    ]);
    return enemy;
  }
  __name(getEnemy, "getEnemy");

  // code/src/moveModel.ts
  function setMoveAction(playerModel) {
    kaboom_default2.action(() => {
      let pad = vec2(0, 0);
      const base = vec2(0, 0);
      if (kaboom_default2.keyIsDown("left")) {
        pad.x -= 1;
      }
      if (kaboom_default2.keyIsDown("right")) {
        pad.x += 1;
      }
      if (kaboom_default2.keyIsDown("down")) {
        pad.y += 1;
      }
      if (kaboom_default2.keyIsDown("up")) {
        pad.y -= 1;
      }
      if (kaboom_default2.mouseIsDown()) {
        pad = kaboom_default2.mouseWorldPos().sub(playerModel.getPos());
        if (pad.len() < 100) {
          pad = vec2(0, 0);
        }
      }
      if (pad.len() > 0) {
        playerModel.setMove(pad.angle(base));
      } else {
        playerModel.stop();
      }
      camPos(playerModel.getPos());
    });
  }
  __name(setMoveAction, "setMoveAction");

  // code/src/multiplayer.ts
  var import_chance = __toModule(require_chance());
  var Multiplayer = class {
    constructor() {
      const protocol = location.protocol === "https:" ? "wss" : "ws";
      const url = `${protocol}://${location.host}/multiplayer`;
      const chance2 = new import_chance.default();
      this.name = chance2.animal();
      console.log("My name is", this.name);
      console.log("Connecting to ws", url);
      this.ws = new WebSocket(url);
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
    }
    onMessage(event) {
      const payload = JSON.parse(event.data);
      console.log("RCV", payload);
      switch (payload.commandName) {
        case "connected":
          this.handleConnected(payload);
          break;
      }
    }
    handleConnected(cmd) {
      this.uuid = cmd.user;
      this.join(this.name);
    }
    onOpen(event) {
    }
    join(name) {
      const cmd = {
        name
      };
      this.cmd("name", cmd);
    }
    cmd(name, payload) {
      payload.commandName = name;
      this.ws.send(JSON.stringify(payload));
    }
  };
  __name(Multiplayer, "Multiplayer");

  // code/src/playerModel.ts
  var PlayerModel = class {
    constructor(x, y, player) {
      this.speed = 480;
      this.move = vec2(0, 0);
      this.pos = vec2(x, y);
      this.gameObject = player;
      this.setPosition(x, y);
      this.setMove(0, 0);
    }
    setPosition(x, y) {
      this.pos.x = x;
      this.pos.y = y;
      this.gameObject.moveTo(this.pos.x, this.pos.y);
    }
    setMove(angle, speed = 480) {
      if (this.moveCanceler != void 0) {
        this.moveCanceler();
      }
      this.move.x = angle;
      this.move.y = speed;
      this.moveCanceler = this.gameObject.action(() => {
        this.gameObject.move(dir(angle).scale(speed));
      });
    }
    stop() {
      this.setMove(this.move.x, 0);
    }
    getPos() {
      return this.gameObject.pos;
    }
  };
  __name(PlayerModel, "PlayerModel");

  // code/main.js
  var mp = new Multiplayer();
  var BULLET_SPEED = 1200;
  function addButton(txt, p, f) {
    const btn = add([
      text(txt, 8),
      pos(p),
      area({ cursor: "pointer" }),
      scale(1),
      origin("center")
    ]);
    btn.clicks(f);
    btn.hovers(() => {
      const t = time() * 10;
      btn.color = rgb(wave(0, 255, t), wave(0, 255, t + 2), wave(0, 255, t + 4));
      btn.scale = vec2(1.2);
    }, () => {
      btn.scale = vec2(1);
      btn.color = rgb();
    });
  }
  __name(addButton, "addButton");
  kaboom_default2.scene("end", () => {
    add([
      text("Game over!", { size: 26 }),
      pos(width() / 2, height() / 2),
      origin("center"),
      fixed()
    ]);
    addButton("Start", vec2(width() / 2, height() / 2 + 26), () => go("battle"));
  });
  kaboom_default2.scene("start", () => {
    add([
      text("Play the game", { size: 26 }),
      pos(width() / 2, height() / 2),
      origin("center"),
      fixed()
    ]);
    addButton("Start", vec2(width() / 2, height() / 2 + 76), () => go("battle"));
    addButton("Quit", vec2(width() / 2, height() / 2 + 146), () => go("end"));
  });
  kaboom_default2.scene("battle", () => {
    layers([
      "game",
      "ui"
    ], "game");
    function late(t) {
      let timer = 0;
      return {
        add() {
          this.hidden = true;
        },
        update() {
          timer += dt();
          if (timer >= t) {
            this.hidden = false;
          }
        }
      };
    }
    __name(late, "late");
    function addExplode(p, n, rad, size) {
      for (let i = 0; i < n; i++) {
        wait(rand(n * 0.1), () => {
          for (let i2 = 0; i2 < 2; i2++) {
            add([
              pos(p.add(rand(vec2(-rad), vec2(rad)))),
              rect(4, 4),
              outline(4),
              scale(1 * size, 1 * size),
              lifespan(0.1),
              grow(rand(48, 72) * size),
              origin("center"),
              fixed()
            ]);
          }
        });
      }
    }
    __name(addExplode, "addExplode");
    function grow(rate) {
      return {
        update() {
          const n = rate * dt();
          this.scale.x += n;
          this.scale.y += n;
        }
      };
    }
    __name(grow, "grow");
    function spawnBullet(p) {
      add([
        rect(12, 48),
        area(),
        pos(p),
        origin("center"),
        color(127, 127, 255),
        outline(4),
        move(mouseWorldPos().angle(player.pos), BULLET_SPEED),
        cleanup(),
        "bullet"
      ]);
    }
    __name(spawnBullet, "spawnBullet");
    add([
      text("KILL", { size: 160 }),
      pos(width() / 2, height() / 2),
      origin("center"),
      lifespan(1),
      fixed(),
      layer("ui")
    ]);
    add([
      text("THE", { size: 80 }),
      pos(width() / 2, height() / 2),
      origin("center"),
      lifespan(2),
      late(1),
      fixed(),
      layer("ui")
    ]);
    add([
      text("JULEP", { size: 120 }),
      pos(width() / 2, height() / 2),
      origin("center"),
      lifespan(4),
      late(2),
      fixed(),
      layer("ui")
    ]);
    let score = 0;
    const scoreLabel = add([
      text(score, 2),
      pos(12, 12),
      fixed(),
      z(100),
      layer("ui")
    ]);
    const enemy = getEnemy("julep");
    enemy.action(() => {
      enemy.moveTo(player.pos, 80);
    });
    const playerNameHud = add([
      text(mp.name, {
        size: 24
      }),
      pos(12, height() - 36),
      fixed(),
      z(100)
    ]);
    const player = getPlayer("currant");
    const playedModel = new PlayerModel(80, 40, player);
    window.p1 = playedModel;
    spawnFood();
    setMoveAction(playedModel);
    keyPress("space", () => {
      spawnBullet(player.pos.sub(16, 0));
      spawnBullet(player.pos.add(16, 0));
    });
    keyPress("q", () => {
      go("end");
    });
    player.collides("food", (food) => {
      destroy(food);
      score += 1;
      scoreLabel.text = score;
      addKaboom(player.pos);
      player.biggify(0.5);
    });
    player.collides("julep", (e) => {
      destroy(e);
      destroy(player);
      shake(120);
      addExplode(center(), 12, 120, 30);
      wait(1, () => {
        go("end");
      });
    });
  });
  go("start");
})();
//# sourceMappingURL=game.js.map
