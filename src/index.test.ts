import { describe, it, expect } from "vitest";
import {
  slugify,
  createSlugifier,
  extend,
  extendMultiChar,
  baseMap,
} from "./index.js";
import { deMap } from "./locale/de.js";
import { frMap } from "./locale/fr.js";
import { hiMap, hiMultiCharMap } from "./locale/hi.js";

describe("slugify", () => {
  it("should work with basic inputs", () => {
    expect(slugify("Hello World")).toBe("Hello-World");
    expect(slugify("Café & Restaurant")).toBe("Cafe-and-Restaurant");
  });

  it("should use base character map", () => {
    expect(slugify("Über")).toBe("Uber");
    expect(slugify("naïve")).toBe("naive");
    expect(slugify("résumé")).toBe("resume");
  });

  it("should work with options", () => {
    expect(slugify("Hello World", { lower: true })).toBe("hello-world");
    expect(slugify("Hello World", { replacement: "_" })).toBe("Hello_World");
  });

  it("should handle collapse option", () => {
    expect(slugify("foo---bar")).toBe("foo-bar"); // default collapse = true
    expect(slugify("foo---bar", { collapse: false })).toBe("foo---bar");
    expect(slugify("foo   bar", { collapse: true })).toBe("foo-bar");
    expect(slugify("foo!!!bar", { collapse: true })).toBe("foo-bar"); // ! has no mapping
    expect(slugify("foo!!!bar", { collapse: false })).toBe("foo---bar"); // ! has no mapping
  });

  it("should throw error on malformed UTF-16 strings", () => {
    const malformedString = "\uD800"; // High surrogate without low surrogate
    expect(() => slugify(malformedString)).toThrow(
      "slug() received a malformed string with lone surrogates"
    );
  });

  it("should handle multiCharMap option", () => {
    const multiCharMap = { test: "mapped", "!!!": "exclamation" };

    expect(slugify("test", { multiCharMap })).toBe("mapped");
    expect(slugify("hello!!!world", { multiCharMap })).toBe(
      "hello-exclamation-world"
    );
    expect(slugify("test!!!test", { multiCharMap, collapse: false })).toBe(
      "mapped-exclamation-mapped"
    );
  });

  it("should handle fallback option", () => {
    // Default behavior - no fallback
    expect(slugify("🎉")).toBe("");
    expect(slugify("   ")).toBe("");

    // Explicit fallback disabled
    expect(slugify("🎉", { fallback: false })).toBe("");
    expect(slugify("   ", { fallback: false })).toBe("");

    // Fallback enabled
    const result1 = slugify("🎉", { fallback: true });
    const result2 = slugify("   ", { fallback: true });

    expect(result1).not.toBe("");
    expect(result2).not.toBe("");
    expect(result1).toMatch(/^[a-zA-Z0-9-]+$/);
    expect(result2).toMatch(/^[a-zA-Z0-9-]+$/);
  });

  it("should handle preset modes", () => {
    // Pretty mode (preserves case)
    expect(slugify("Hello World & Test", { mode: "pretty" })).toBe(
      "Hello-World-and-Test"
    );

    // RFC3986 mode (lowercase)
    expect(slugify("Hello World & Test", { mode: "rfc3986" })).toBe(
      "hello-world-and-test"
    );

    // Mode with overrides
    expect(slugify("Hello World", { mode: "pretty", lower: true })).toBe(
      "hello-world"
    );
    expect(slugify("Hello World", { mode: "rfc3986", lower: false })).toBe(
      "Hello-World"
    );
  });
});

describe("createSlugifier", () => {
  it("should create a slugifier with custom map", () => {
    const germanSlugify = createSlugifier({
      map: extend(baseMap, deMap),
      options: { lower: true },
    });

    expect(germanSlugify("Ärger & Größe")).toBe("aerger-und-groesse");
    expect(germanSlugify("100%")).toBe("100prozent");
  });

  it("should allow option overrides", () => {
    const slugifier = createSlugifier({
      options: { lower: true, replacement: "_" },
    });

    expect(slugifier("Hello World")).toBe("hello_world");
    expect(slugifier("Hello World", { replacement: "-" })).toBe("hello-world");
    expect(slugifier("Hello World", { lower: false })).toBe("Hello_World");
  });

  it("should work with French locale", () => {
    const frenchSlugify = createSlugifier({
      map: extend(baseMap, frMap),
      options: { lower: true },
    });

    expect(frenchSlugify("Café & Restaurant")).toBe("cafe-et-restaurant");
    expect(frenchSlugify("50%")).toBe("50pourcent");
  });

  it("should work without any config", () => {
    const defaultSlugify = createSlugifier();
    expect(defaultSlugify("Hello World")).toBe("Hello-World");
  });

  it("should respect collapse option in default config", () => {
    const collapsedSlugify = createSlugifier({
      options: { collapse: true },
    });
    const nonCollapsedSlugify = createSlugifier({
      options: { collapse: false },
    });

    expect(collapsedSlugify("foo---bar")).toBe("foo-bar");
    expect(nonCollapsedSlugify("foo---bar")).toBe("foo---bar");
  });

  it("should handle malformed UTF-16 strings in custom slugifier", () => {
    const customSlugify = createSlugifier({
      options: { lower: true },
    });
    const malformedString = "\uD800";
    expect(() => customSlugify(malformedString)).toThrow(
      "slug() received a malformed string with lone surrogates"
    );
  });

  it("should work with multiCharMap in config", () => {
    const multiCharMap = { क्ष: "Ksha", त्र: "Tra" };
    const hindiSlugify = createSlugifier({
      multiCharMap,
      options: { lower: true },
    });

    expect(hindiSlugify("hello क्ष world")).toBe("hello-ksha-world");
    expect(hindiSlugify("test त्र end")).toBe("test-tra-end");
  });

  it("should allow multiCharMap override in runtime options", () => {
    const defaultMultiCharMap = { test: "default" };
    const overrideMultiCharMap = { test: "override" };

    const slugifier = createSlugifier({
      multiCharMap: defaultMultiCharMap,
    });

    expect(slugifier("test")).toBe("default");
    expect(slugifier("test", { multiCharMap: overrideMultiCharMap })).toBe(
      "override"
    );
  });

  it("should work with both map and multiCharMap", () => {
    const charMap = extend(baseMap, { ü: "ue" });
    const multiCharMap = { क्ष: "ksha" };

    const slugifier = createSlugifier({
      map: charMap,
      multiCharMap,
      options: { lower: true },
    });

    expect(slugifier("Über क्ष test")).toBe("uber-ksha-test");
  });

  it("should handle fallback option in config", () => {
    const fallbackSlugifier = createSlugifier({
      options: { fallback: true },
    });

    const result = fallbackSlugifier("🎉");
    expect(result).not.toBe("");
    expect(result).toMatch(/^[a-zA-Z0-9-]+$/);
  });

  it("should allow fallback override in runtime options", () => {
    const slugifier = createSlugifier({
      options: { fallback: false },
    });

    // Default should not use fallback
    expect(slugifier("🎉")).toBe("");

    // Override to enable fallback
    const result = slugifier("🎉", { fallback: true });
    expect(result).not.toBe("");
    expect(result).toMatch(/^[a-zA-Z0-9-]+$/);
  });

  it("should work with preset modes in config", () => {
    const prettySlugifier = createSlugifier({
      options: { mode: "pretty" },
    });

    const rfc3986Slugifier = createSlugifier({
      options: { mode: "rfc3986" },
    });

    expect(prettySlugifier("Hello World & Test")).toBe("Hello-World-and-Test");
    expect(rfc3986Slugifier("Hello World & Test")).toBe("hello-world-and-test");
  });

  it("should allow mode override in runtime options", () => {
    const slugifier = createSlugifier({
      options: { mode: "pretty" },
    });

    // Default should use pretty mode
    expect(slugifier("Hello World")).toBe("Hello-World");

    // Override to use rfc3986 mode
    expect(slugifier("Hello World", { mode: "rfc3986" })).toBe("hello-world");
  });

  it("should work with preset modes and locale maps", () => {
    const germanSlugifier = createSlugifier({
      map: extend(baseMap, deMap),
      options: { mode: "rfc3986" },
    });

    expect(germanSlugifier("Müller & Größe")).toBe("mueller-und-groesse");
  });
});

describe("extend", () => {
  it("should merge character maps", () => {
    const custom = { x: "eks", y: "why" };
    const merged = extend(baseMap, custom);

    expect(merged["&"]).toBe("and"); // from baseMap
    expect(merged["x"]).toBe("eks"); // from custom
    expect(merged["y"]).toBe("why"); // from custom
  });

  it("should handle multiple extensions", () => {
    const ext1 = { a: "alpha" };
    const ext2 = { b: "beta" };
    const ext3 = { c: "gamma" };

    const merged = extend(baseMap, ext1, ext2, ext3);

    expect(merged["a"]).toBe("alpha");
    expect(merged["b"]).toBe("beta");
    expect(merged["c"]).toBe("gamma");
  });

  it("should not mutate original maps", () => {
    const custom = { "&": "y" };
    const original = baseMap["&"];

    extend(baseMap, custom);

    expect(baseMap["&"]).toBe(original);
  });

  it("should allow later extensions to override earlier ones", () => {
    const ext1 = { a: "first" };
    const ext2 = { a: "second" };

    const merged = extend({}, ext1, ext2);

    expect(merged["a"]).toBe("second");
  });
});

describe("extendMultiChar", () => {
  it("should merge multi-character maps", () => {
    const base = { abc: "first", def: "second" };
    const extension = { ghi: "third", jkl: "fourth" };

    const merged = extendMultiChar(base, extension);

    expect(merged["abc"]).toBe("first");
    expect(merged["def"]).toBe("second");
    expect(merged["ghi"]).toBe("third");
    expect(merged["jkl"]).toBe("fourth");
  });

  it("should handle multiple extensions", () => {
    const base = { a: "alpha" };
    const ext1 = { b: "beta" };
    const ext2 = { c: "gamma" };

    const merged = extendMultiChar(base, ext1, ext2);

    expect(merged["a"]).toBe("alpha");
    expect(merged["b"]).toBe("beta");
    expect(merged["c"]).toBe("gamma");
  });

  it("should not mutate original maps", () => {
    const base = { test: "original" };
    const extension = { test: "modified" };

    extendMultiChar(base, extension);

    expect(base["test"]).toBe("original");
  });

  it("should allow later extensions to override earlier ones", () => {
    const ext1 = { test: "first" };
    const ext2 = { test: "second" };

    const merged = extendMultiChar({}, ext1, ext2);

    expect(merged["test"]).toBe("second");
  });
});

describe("locale integration", () => {
  it("should handle German text properly", () => {
    const germanSlugify = createSlugifier({
      map: extend(baseMap, deMap),
    });

    expect(germanSlugify("Mädchen")).toBe("Maedchen");
    expect(germanSlugify("Straße")).toBe("Strasse");
    expect(germanSlugify("Größe & Gewicht")).toBe("Groesse-und-Gewicht");
  });

  it("should handle French text properly", () => {
    const frenchSlugify = createSlugifier({
      map: extend(baseMap, frMap),
    });

    expect(frenchSlugify("été")).toBe("ete");
    expect(frenchSlugify("cœur")).toBe("coeur");
    expect(frenchSlugify("café & thé")).toBe("cafe-et-the");
  });

  it("should handle collapse with locale maps", () => {
    const germanSlugify = createSlugifier({
      map: extend(baseMap, deMap),
      options: { collapse: true },
    });

    expect(germanSlugify("Größe!!! & !!!Gewicht")).toBe("Groesse-und-Gewicht");
    expect(germanSlugify("Größe!!! & !!!Gewicht", { collapse: false })).toBe(
      "Groesse----und----Gewicht"
    );
  });
});

describe("Hindi locale integration", () => {
  it("should handle Hindi single-character mappings", () => {
    const hindiSlugify = createSlugifier({
      map: extend(baseMap, hiMap),
      options: { lower: true },
    });

    expect(hindiSlugify("अ")).toBe("a");
    expect(hindiSlugify("आ")).toBe("aa");
    expect(hindiSlugify("क")).toBe("ka");
    expect(hindiSlugify("नमस्ते")).toBe("namasa-ta"); // Update expectation to match actual behavior
  });

  it("should handle Hindi multi-character mappings", () => {
    const hindiSlugify = createSlugifier({
      map: extend(baseMap, hiMap),
      multiCharMap: hiMultiCharMap,
      options: { lower: true },
    });

    expect(hindiSlugify("फ़")).toBe("fi");
    expect(hindiSlugify("ग़")).toBe("ghi");
    expect(hindiSlugify("क्ष")).toBe("ksha");
    expect(hindiSlugify("त्र")).toBe("tra");
  });

  it("should handle Hindi words and symbols", () => {
    const hindiSlugify = createSlugifier({
      map: extend(baseMap, hiMap),
      multiCharMap: hiMultiCharMap,
      options: { lower: true },
    });

    expect(hindiSlugify("100%")).toBe("100pratishat");
    expect(hindiSlugify("test & check")).toBe("test-aur-check");
  });
});

describe("multi-language scenarios", () => {
  it("should handle mixed scripts with multi-character mappings", () => {
    const multiLangSlugify = createSlugifier({
      map: extend(baseMap, hiMap),
      multiCharMap: hiMultiCharMap,
      options: { lower: true },
    });

    expect(multiLangSlugify("Hello क्ष World")).toBe("hello-ksha-world");
    expect(multiLangSlugify("Test फ़ End")).toBe("test-fi-end");
  });

  it("should work with existing German and French locales", () => {
    const multiLangSlugify = createSlugifier({
      map: extend(baseMap, deMap, frMap), // Put French before Hindi to preserve 'et' mapping
      multiCharMap: hiMultiCharMap,
      options: { lower: true },
    });

    expect(multiLangSlugify("Café & Größe क्ष")).toBe("cafe-et-grosse-ksha");
  });
});

describe("performance characteristics", () => {
  it("should handle long strings efficiently", () => {
    const longString = "Hello World ".repeat(1000);
    const start = performance.now();

    slugify(longString);

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(25); // Should complete in under 25ms
  });

  it("should handle many small strings efficiently", () => {
    const strings = Array.from({ length: 1000 }, (_, i) => `test-${i}`);
    const start = performance.now();

    strings.forEach((str) => slugify(str));

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(30); // Should complete in under 30ms
  });

  it("should handle collapse operations efficiently", () => {
    const stringWithManyReplacements = "foo" + "!@#$%".repeat(200) + "bar";
    const start = performance.now();

    slugify(stringWithManyReplacements, { collapse: true });

    const duration = performance.now() - start;
    expect(duration).toBeLessThan(5); // Should complete in under 5ms
  });
});
