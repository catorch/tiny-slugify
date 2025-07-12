import { describe, it, expect } from "vitest";
import { slugify } from "./index.js";

describe("fuzz-testing slugify", () => {
  it("should return truthy results for any valid string", () => {
    const FUZZ_TESTS = 64;
    const MAX_WORD_LENGTH = 16;
    const MAX_WORD_COUNT = 4;

    const MAX_BMP_CODE_POINT = 0xffff; // Basic Multilingual Plane
    const MAX_CODE_POINT = 0x10ffff; // Maximum Unicode code point

    function random(max: number): number {
      return Math.floor(Math.random() * max + 1);
    }

    function getString(maxCodePoint: number): {
      fuzzyString: string;
      codePoints: number[][];
    } {
      const wordCount = random(MAX_WORD_COUNT);
      const wordLengths = Array.from({ length: wordCount }, () =>
        random(MAX_WORD_LENGTH)
      );
      const codePoints = wordLengths.map((wordLength) =>
        Array.from({ length: wordLength }, () => random(maxCodePoint))
      );
      const words = codePoints.map((wordCodePoints) =>
        String.fromCodePoint(...wordCodePoints)
      );
      return { fuzzyString: words.join(" "), codePoints };
    }

    function runTest(maxCodePoint: number): void {
      const testString = getString(maxCodePoint);
      // Check if isWellFormed is available (ES2024 feature)
      const isWellFormed =
        typeof (testString.fuzzyString as any).isWellFormed === "function"
          ? (testString.fuzzyString as any).isWellFormed()
          : true; // Assume well-formed if method not available

      if (isWellFormed) {
        const result = slugify(testString.fuzzyString);
        expect(typeof result).toBe("string");
      } else {
        expect(() => slugify(testString.fuzzyString)).toThrow(
          "slug() received a malformed string with lone surrogates"
        );
      }
    }

    for (let i = 0; i < FUZZ_TESTS; i++) {
      runTest(MAX_BMP_CODE_POINT);
      runTest(MAX_CODE_POINT);
    }
  });

  it("should handle fallback option with random strings", () => {
    const FUZZ_TESTS = 32;
    const MAX_STRING_LENGTH = 10;

    function getRandomUnicodeString(length: number): string {
      let result = "";
      for (let i = 0; i < length; i++) {
        // Generate random Unicode characters from various ranges
        const ranges = [
          [0x1f600, 0x1f64f], // Emoticons
          [0x1f300, 0x1f5ff], // Misc Symbols and Pictographs
          [0x1f680, 0x1f6ff], // Transport and Map Symbols
          [0x2600, 0x26ff], // Misc symbols
          [0x2700, 0x27bf], // Dingbats
        ];
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        const codePoint =
          Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
        try {
          result += String.fromCodePoint(codePoint);
        } catch (error) {
          // Skip invalid code points
          i--;
        }
      }
      return result;
    }

    for (let i = 0; i < FUZZ_TESTS; i++) {
      const randomString = getRandomUnicodeString(
        Math.floor(Math.random() * MAX_STRING_LENGTH) + 1
      );

      const isWellFormed =
        typeof (randomString as any).isWellFormed === "function"
          ? (randomString as any).isWellFormed()
          : true;
      if (isWellFormed) {
        // Without fallback - might be empty
        const result = slugify(randomString);
        expect(typeof result).toBe("string");

        // With fallback - should never be empty
        const resultWithFallback = slugify(randomString, { fallback: true });
        expect(resultWithFallback).toBeTruthy();
        expect(resultWithFallback).toMatch(/^[a-zA-Z0-9-]+$/);
      }
    }
  });

  it("should handle preset modes with random ASCII strings", () => {
    const FUZZ_TESTS = 32;
    const ASCII_MIN = 32; // Space
    const ASCII_MAX = 126; // Tilde

    function getRandomAsciiString(length: number): string {
      let result = "";
      for (let i = 0; i < length; i++) {
        const codePoint =
          Math.floor(Math.random() * (ASCII_MAX - ASCII_MIN + 1)) + ASCII_MIN;
        result += String.fromCharCode(codePoint);
      }
      return result.trim(); // Remove leading/trailing spaces
    }

    for (let i = 0; i < FUZZ_TESTS; i++) {
      const length = Math.floor(Math.random() * 20) + 1;
      const randomString = getRandomAsciiString(length);

      if (randomString) {
        const prettyResult = slugify(randomString, { mode: "pretty" });
        const rfc3986Result = slugify(randomString, { mode: "rfc3986" });

        expect(typeof prettyResult).toBe("string");
        expect(typeof rfc3986Result).toBe("string");

        // RFC3986 should be lowercase
        expect(rfc3986Result).toBe(rfc3986Result.toLowerCase());

        // Both should be URL-safe (allow empty strings, letters, numbers, dashes, underscores)
        expect(prettyResult).toMatch(/^[a-zA-Z0-9-_]*$/);
        expect(rfc3986Result).toMatch(/^[a-z0-9-_]*$/);
      }
    }
  });

  it("should handle edge cases and boundary conditions", () => {
    const edgeCases = [
      "", // Empty string
      " ", // Single space
      "   ", // Multiple spaces
      "-", // Single dash
      "---", // Multiple dashes
      "a", // Single character
      "A", // Single uppercase
      "1", // Single digit
      "!", // Single punctuation
      "\u0000", // Null character
      "\uFFFF", // Max BMP character
      "\u{10FFFF}", // Max Unicode character
      "a".repeat(1000), // Very long string
      "🎉", // Emoji
      "🎉🚀🌟", // Multiple emojis
      "α", // Greek letter
      "क", // Hindi letter
      "अ", // Hindi letter
      "中", // Chinese character
    ];

    edgeCases.forEach((testCase, index) => {
      const isWellFormed =
        typeof (testCase as any).isWellFormed === "function"
          ? (testCase as any).isWellFormed()
          : true;
      if (isWellFormed) {
        const result = slugify(testCase);
        expect(typeof result).toBe("string");

        // Test with various options
        expect(typeof slugify(testCase, { lower: true })).toBe("string");
        expect(typeof slugify(testCase, { strict: true })).toBe("string");
        expect(typeof slugify(testCase, { fallback: true })).toBe("string");
        expect(typeof slugify(testCase, { mode: "pretty" })).toBe("string");
        expect(typeof slugify(testCase, { mode: "rfc3986" })).toBe("string");
      } else {
        expect(() => slugify(testCase)).toThrow();
      }
    });
  });

  it("should be consistent with repeated calls", () => {
    const CONSISTENCY_TESTS = 16;
    const testStrings = [
      "Hello World",
      "Café & Restaurant",
      "🎉 Party Time 🚀",
      "test@example.com",
      "100% Pure!",
      "α β γ δ",
      "مرحبا بالعالم",
      "こんにちは世界",
    ];

    testStrings.forEach((testString) => {
      const isWellFormed =
        typeof (testString as any).isWellFormed === "function"
          ? (testString as any).isWellFormed()
          : true;
      if (isWellFormed) {
        const firstResult = slugify(testString);

        // Call multiple times to ensure consistency
        for (let i = 0; i < CONSISTENCY_TESTS; i++) {
          const result = slugify(testString);
          expect(result).toBe(firstResult);
        }

        // Test with options too
        const optionsResult = slugify(testString, {
          lower: true,
          strict: true,
        });
        for (let i = 0; i < CONSISTENCY_TESTS; i++) {
          const result = slugify(testString, { lower: true, strict: true });
          expect(result).toBe(optionsResult);
        }
      }
    });
  });
});
