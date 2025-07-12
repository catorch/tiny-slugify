export interface Options {
  replacement?: string;
  remove?: RegExp | string | string[];
  lower?: boolean;
  strict?: boolean;
  trim?: boolean;
  collapse?: boolean;
  multiCharMap?: MultiCharMap;
  fallback?: boolean;
  mode?: "pretty" | "rfc3986";
}

export type CharMap = Record<string, string>;
export type MultiCharMap = Record<string, string>;

function compileRemovePattern(remove: RegExp | string | string[]): RegExp {
  if (remove instanceof RegExp) {
    return remove;
  }

  if (typeof remove === "string") {
    return new RegExp(`[${remove.replace(/[[\]\\^-]/g, "\\$&")}]`, "g");
  }

  const escaped = remove
    .map((char) => char.replace(/[[\]\\^-]/g, "\\$&"))
    .join("");
  return new RegExp(`[${escaped}]`, "g");
}

// Base64 encoding for fallback when result is empty
// Compatible with both browser and Node.js environments
function base64Encode(input: string): string {
  // Check if we're in a browser environment
  const isBrowser =
    typeof globalThis !== "undefined" &&
    typeof (globalThis as any).window !== "undefined";

  if (isBrowser && (globalThis as any).window.btoa) {
    // Browser environment with btoa
    return (globalThis as any).window.btoa(unescape(encodeURIComponent(input)));
  } else if (isBrowser) {
    // Browser environment without btoa (e.g., older browsers or React Native)
    // Based on https://github.com/davidchambers/Base64.js/blob/a121f75bb10c8dd5d557886c4b1069b31258d230/base64.js
    const str = unescape(encodeURIComponent(input + ""));
    let output = "";
    for (
      let block = 0,
        charCode,
        idx = 0,
        map =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      str.charAt(idx | 0) || ((map = "="), idx % 1);
      output += map.charAt(63 & (block >> (8 - (idx % 1) * 8)))
    ) {
      charCode = str.charCodeAt((idx += 3 / 4));
      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }
      block = (block << 8) | charCode;
    }
    return output;
  } else {
    // Node.js environment
    if ((globalThis as any).Buffer) {
      return (globalThis as any).Buffer.from(input).toString("base64");
    } else {
      throw new Error("Base64 encoding not available in this environment");
    }
  }
}

// Preset mode configurations
const presetModes = {
  pretty: {
    replacement: "-",
    lower: false,
    strict: false,
    trim: true,
    collapse: true,
    fallback: false,
  },
  rfc3986: {
    replacement: "-",
    lower: true,
    strict: false,
    trim: true,
    collapse: true,
    fallback: false,
  },
};

export function slugCore(
  str: string,
  opts: Options = {},
  map: CharMap = {}
): string {
  if (typeof str !== "string") {
    return "";
  }

  // Handle empty string with fallback before early return
  if (!str) {
    const fallback = opts.fallback ?? false;
    if (fallback) {
      const base64String = base64Encode("empty");
      return slugCore(base64String, { ...opts, fallback: false }, map);
    }
    return "";
  }

  // Guard against malformed UTF-16 strings
  if (!str.isWellFormed()) {
    throw new Error("slug() received a malformed string with lone surrogates");
  }

  // Apply preset mode if specified
  let mergedOpts = { ...opts };
  if (opts.mode) {
    const preset = presetModes[opts.mode];
    if (preset) {
      // Apply preset defaults first, then override with user options
      mergedOpts = { ...preset, ...opts };
    }
  }

  const replacement = mergedOpts.replacement ?? "-";
  const lower = mergedOpts.lower ?? false;
  const strict = mergedOpts.strict ?? false;
  const trim = mergedOpts.trim ?? true;
  const collapse = mergedOpts.collapse ?? true;
  const fallback = mergedOpts.fallback ?? false;
  const multiCharMap = mergedOpts.multiCharMap ?? {};

  // Common English words from base map that should be treated as separate tokens
  const wordMappings = new Set([
    "and",
    "at",
    "percent",
    "plus",
    "equals",
    "less",
    "greater",
    "euro",
    "pound",
    "dollar",
    "yen",
    "cent",
    "deg",
    "no",
    "section",
    "paragraph",
    "dagger",
    "double-dagger",
    "bullet",
    "c",
    "r",
    "tm",
    "exclamation",
    "question",
    "ellipsis",
    "first",
    "second",
    "third",
  ]);

  // Helper function to determine if a mapping should be treated as a separate word
  function shouldTreatAsWord(mappedValue: string): boolean {
    // Only treat base map symbol-to-word mappings as separate words
    // These are typically symbols that map to English words
    if (wordMappings.has(mappedValue.toLowerCase())) {
      return true;
    }

    // Also treat hyphenated words as separate tokens
    if (mappedValue.includes("-") && mappedValue.length > 3) {
      return true;
    }

    return false;
  }

  // Pre-compute multi-character map lengths and sort by length (longest first)
  const multiCharLengths = Object.keys(multiCharMap)
    .map((key) => key.length)
    .filter((length, index, arr) => arr.indexOf(length) === index)
    .sort((a, b) => b - a);

  let result = "";

  // First pass: apply multi-character and single-character mapping
  for (let i = 0; i < str.length; i++) {
    let matched = false;

    // Try multi-character mappings first (longest to shortest)
    for (const length of multiCharLengths) {
      if (i + length <= str.length) {
        const substr = str.substr(i, length);
        if (multiCharMap[substr]) {
          const mappedValue = multiCharMap[substr];
          // Add spaces around word mappings to separate them as words
          if (shouldTreatAsWord(mappedValue)) {
            result += " " + mappedValue + " ";
          } else {
            result += mappedValue;
          }
          i += length - 1; // Skip ahead (loop will increment i)
          matched = true;
          break;
        }
      }
    }

    // If no multi-character match, try single-character mapping
    if (!matched) {
      const char = str[i];
      const mappedChar = map[char];
      if (mappedChar) {
        // Add spaces around word mappings to separate them as words
        if (shouldTreatAsWord(mappedChar)) {
          result += " " + mappedChar + " ";
        } else {
          result += mappedChar;
        }
      } else {
        result += char;
      }
    }
  }

  // Normalize to decomposed form and remove combining marks
  let normalized = "";
  for (const char of result.normalize("NFD")) {
    // Skip combining marks (Unicode category Mn)
    if (char.charCodeAt(0) >= 0x0300 && char.charCodeAt(0) <= 0x036f) {
      continue;
    }
    normalized += char;
  }
  result = normalized;

  // Apply custom remove pattern if provided
  if (mergedOpts.remove) {
    const removePattern = compileRemovePattern(mergedOpts.remove);
    result = result.replace(removePattern, replacement);
  } else {
    // Default: remove non-word characters except spaces and replacement char
    const escapedReplacement = replacement.replace(
      /[.+*?^${}()|[\]\\-]/g,
      "\\$&"
    );
    result = result.replace(
      new RegExp(`[^\\w\\s${escapedReplacement}]`, "g"),
      replacement
    );
  }

  // Replace spaces with replacement character
  result = result.replace(/\s+/g, replacement);

  // Collapse consecutive replacement characters if enabled
  if (collapse) {
    const escapedReplacement = replacement.replace(
      /[.+*?^${}()|[\]\\-]/g,
      "\\$&"
    );
    result = result.replace(
      new RegExp(`${escapedReplacement}+`, "g"),
      replacement
    );
  }

  if (strict) {
    result = result.replace(
      new RegExp(
        `[^A-Za-z0-9${replacement.replace(/[.+*?^${}()|[\]\\-]/g, "\\$&")}]`,
        "g"
      ),
      ""
    );
  }

  if (trim) {
    const escapedReplacement = replacement.replace(
      /[.+*?^${}()|[\]\\-]/g,
      "\\$&"
    );
    result = result.replace(
      new RegExp(`^${escapedReplacement}+|${escapedReplacement}+$`, "g"),
      ""
    );
  }

  let finalResult = result;
  if (fallback && finalResult === "") {
    // Generate base64 of original string and slugify that
    // Use a non-empty string for base64 to ensure we get a result
    const base64String = base64Encode(str || "empty");
    // Recursively call slugCore with the base64 string but without fallback to avoid infinite recursion
    finalResult = slugCore(
      base64String,
      { ...mergedOpts, fallback: false },
      map
    );
  }

  return lower ? finalResult.toLowerCase() : finalResult;
}
