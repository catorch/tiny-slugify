import { describe, it, expect } from "vitest";
import { slugCore } from "./core.js";
import { baseMap } from "./map-base.js";

describe("slugCore", () => {
  it("should handle empty and invalid inputs", () => {
    expect(slugCore("")).toBe("");
    expect(slugCore(null as any)).toBe("");
    expect(slugCore(undefined as any)).toBe("");
    expect(slugCore(123 as any)).toBe("");
  });

  it("should throw error on malformed UTF-16 strings", () => {
    // Create a malformed string with lone surrogate
    const malformedString = "\uD800"; // High surrogate without low surrogate
    expect(() => slugCore(malformedString)).toThrow(
      "slug() received a malformed string with lone surrogates"
    );
  });

  it("should convert basic strings", () => {
    expect(slugCore("Hello World")).toBe("Hello-World");
    expect(slugCore("hello world")).toBe("hello-world");
    expect(slugCore("  hello   world  ")).toBe("hello-world");
  });

  it("should collapse consecutive replacement characters by default", () => {
    expect(slugCore("foo---bar")).toBe("foo-bar");
    expect(slugCore("foo- -bar")).toBe("foo-bar");
    expect(slugCore("foo   bar")).toBe("foo-bar");
    expect(slugCore("foo!@#$%bar")).toBe("foo-bar");
    expect(slugCore("foo___bar", { replacement: "_" })).toBe("foo_bar");
    expect(slugCore("foo...bar", { replacement: "." })).toBe("foo.bar");
  });

  it("should not collapse consecutive replacement characters when disabled", () => {
    expect(slugCore("foo---bar", { collapse: false })).toBe("foo---bar");
    expect(slugCore("foo- -bar", { collapse: false })).toBe("foo---bar");
    expect(slugCore("foo   bar", { collapse: false })).toBe("foo-bar"); // spaces still get replaced
    expect(slugCore("foo!!!bar", { collapse: false })).toBe("foo---bar"); // ! has no mapping, gets replaced
    expect(slugCore("foo___bar", { replacement: "_", collapse: false })).toBe(
      "foo___bar"
    );
  });

  it("should use custom replacement character", () => {
    expect(slugCore("Hello World", { replacement: "_" })).toBe("Hello_World");
    expect(slugCore("Hello World", { replacement: "." })).toBe("Hello.World");
  });

  it("should handle lowercase option", () => {
    expect(slugCore("Hello World", { lower: true })).toBe("hello-world");
    expect(slugCore("Hello World", { lower: false })).toBe("Hello-World");
  });

  it("should handle strict mode", () => {
    expect(slugCore("Hello-World!", { strict: true })).toBe("Hello-World");
    expect(slugCore("Café & Bar", { strict: true })).toBe("Cafe-Bar");
  });

  it("should handle trim option", () => {
    expect(slugCore("-hello-world-", { trim: true })).toBe("hello-world");
    expect(slugCore("-hello-world-", { trim: false })).toBe("-hello-world-");
    expect(
      slugCore("   hello   world   ", { replacement: "_", trim: true })
    ).toBe("hello_world");
  });

  it("should use character maps", () => {
    const map = { Ü: "Ue", ü: "ue", ß: "ss" };
    expect(slugCore("Über", {}, map)).toBe("Ueber");
    expect(slugCore("Weiß", {}, map)).toBe("Weiss");
  });

  it("should handle remove patterns", () => {
    expect(slugCore("hello@world.com", { remove: "@." })).toBe(
      "hello-world-com"
    );
    expect(slugCore("hello@world.com", { remove: ["@", "."] })).toBe(
      "hello-world-com"
    );
    expect(slugCore("hello@world.com", { remove: /[@.]/g })).toBe(
      "hello-world-com"
    );
  });

  it("should handle complex combinations", () => {
    const map = { Ü: "Ue", ü: "ue", ö: "oe", Ö: "Oe", ß: "ss", "&": "und" };
    expect(
      slugCore(
        "Über & Größe!",
        {
          lower: true,
          strict: true,
          remove: "!",
          replacement: "-",
        },
        map
      )
    ).toBe("ueber-und-groesse");
  });

  it("should handle complex combinations with collapse", () => {
    const map = { Ü: "Ue", ü: "ue", ö: "oe", Ö: "Oe", ß: "ss", "&": "und" };
    expect(
      slugCore(
        "Über!!! & !!!Größe!",
        {
          lower: true,
          strict: true,
          remove: "!",
          replacement: "-",
          collapse: true,
        },
        map
      )
    ).toBe("ueber-und-groesse");
  });

  it("should not replace replacement character in input", () => {
    expect(slugCore("hello-world", { replacement: "-" })).toBe("hello-world");
    expect(slugCore("hello_world", { replacement: "_" })).toBe("hello_world");
  });

  it("should handle unicode normalization", () => {
    expect(slugCore("é")).toBe("e"); // NFD normalization removes combining marks
    expect(slugCore("café")).toBe("cafe");
  });

  it("should handle multiple consecutive spaces", () => {
    expect(slugCore("hello     world")).toBe("hello-world");
    expect(slugCore("a   b   c", { replacement: "_" })).toBe("a_b_c");
  });

  it("should handle edge cases with replacement character", () => {
    const map = { ü: "-" }; // Maps to replacement char
    expect(slugCore("über", { replacement: "-" }, map)).toBe("ber");
  });

  it("should handle collapse with different replacement characters", () => {
    expect(slugCore("foo...bar", { replacement: "." })).toBe("foo.bar");
    expect(slugCore("foo:::bar", { replacement: ":" })).toBe("foo:bar");
    expect(slugCore("foo+++bar", { replacement: "+" })).toBe("foo+bar");
  });

  it("should handle collapse with trim", () => {
    expect(
      slugCore("---hello---world---", { collapse: true, trim: true })
    ).toBe("hello-world");
    expect(
      slugCore("---hello---world---", { collapse: false, trim: true })
    ).toBe("hello---world");
  });

  it("should handle collapse with complex patterns", () => {
    // Test with characters that don't have word mappings (like !)
    expect(slugCore("foo!!!bar", { collapse: true })).toBe("foo-bar");
    expect(slugCore("foo!!!bar", { collapse: false })).toBe("foo---bar");

    // Test with characters that do have word mappings (need to pass base map)
    expect(slugCore("foo@$%bar", { collapse: true }, baseMap)).toBe(
      "foo-at-dollar-percent-bar"
    );
    expect(slugCore("foo@$%bar", { collapse: false }, baseMap)).toBe(
      "foo-at-dollar-percent-bar"
    );
  });

  describe("backwards compatibility", () => {
    it("should maintain existing behavior when collapse is not specified", () => {
      // Default behavior should have collapse enabled
      expect(slugCore("foo---bar")).toBe("foo-bar");
      expect(slugCore("foo   bar")).toBe("foo-bar");
    });

    it("should work with all existing option combinations", () => {
      const map = { ü: "ue", "&": "und" };
      expect(
        slugCore(
          "Über & Größe",
          {
            lower: true,
            strict: true,
            replacement: "_",
            trim: true,
          },
          map
        )
      ).toBe("uber_und_gro_e"); // ö not in custom map, gets normalized to o
    });
  });

  describe("multi-character mapping", () => {
    it("should handle basic multi-character mappings", () => {
      const multiCharMap = {
        क्ष: "Ksha",
        त्र: "Tra",
        ज्ञ: "Gya",
      };

      expect(slugCore("क्ष", { multiCharMap })).toBe("Ksha");
      expect(slugCore("त्र", { multiCharMap })).toBe("Tra");
      expect(slugCore("ज्ञ", { multiCharMap })).toBe("Gya");
    });

    it("should prefer longer matches over shorter ones", () => {
      const multiCharMap = {
        a: "short",
        abc: "long",
        ab: "medium",
      };

      expect(slugCore("abc", { multiCharMap })).toBe("long");
      expect(slugCore("ab", { multiCharMap })).toBe("medium");
      expect(slugCore("a", { multiCharMap })).toBe("short");
    });

    it("should combine multi-character and single-character mappings", () => {
      const charMap = { x: "eks", y: "why" };
      const multiCharMap = { ab: "alpha-beta" };

      expect(slugCore("xaby", { multiCharMap }, charMap)).toBe(
        "eks-alpha-beta-why"
      );
    });

    it("should handle multi-character mappings with regular characters", () => {
      const multiCharMap = {
        फ़: "Fi",
        ग़: "Ghi",
        ख़: "Khi",
      };

      expect(slugCore("hello फ़ world", { multiCharMap })).toBe(
        "hello-Fi-world"
      );
      expect(slugCore("test ग़ ख़ end", { multiCharMap })).toBe(
        "test-Ghi-Khi-end"
      );
    });

    it("should handle overlapping multi-character sequences", () => {
      const multiCharMap = {
        abc: "first",
        bcd: "second",
        cde: "third",
      };

      // Should match 'abc' first (longest match from start)
      expect(slugCore("abcde", { multiCharMap })).toBe("first-de");
      expect(slugCore("bcde", { multiCharMap })).toBe("second-e");
      expect(slugCore("cde", { multiCharMap })).toBe("third");
    });

    it("should work with collapse option", () => {
      const multiCharMap = {
        test: "mapped",
      };

      expect(slugCore("test!!!test", { multiCharMap, collapse: true })).toBe(
        "mapped-mapped"
      );
      expect(slugCore("test!!!test", { multiCharMap, collapse: false })).toBe(
        "mapped---mapped"
      );
    });

    it("should handle complex multi-character sequences", () => {
      const multiCharMap = {
        th: "TH",
        ch: "CH",
        sh: "SH",
        ng: "NG",
      };

      const charMap = {
        a: "A",
        b: "B",
        c: "C",
        d: "D",
        e: "E",
        f: "F",
        g: "G",
        h: "H",
        i: "I",
        j: "J",
        k: "K",
        l: "L",
        m: "M",
        n: "N",
        o: "O",
        p: "P",
        q: "Q",
        r: "R",
        s: "S",
        t: "T",
        u: "U",
        v: "V",
        w: "W",
        x: "X",
        y: "Y",
        z: "Z",
      };

      expect(slugCore("thinking", { multiCharMap }, charMap)).toBe("THINKING");
      expect(slugCore("change", { multiCharMap }, charMap)).toBe("CHANGE");
    });

    it("should handle empty multi-character map", () => {
      expect(slugCore("hello world", { multiCharMap: {} })).toBe("hello-world");
      expect(slugCore("test", { multiCharMap: undefined })).toBe("test");
    });

    it("should handle multi-character mappings with special characters", () => {
      const multiCharMap = {
        "!!!": "exclamation",
        "???": "question",
        "...": "ellipsis",
      };

      expect(slugCore("hello!!!world", { multiCharMap })).toBe(
        "hello-exclamation-world"
      );
      expect(slugCore("what???", { multiCharMap })).toBe("what-question");
      expect(slugCore("wait...", { multiCharMap })).toBe("wait-ellipsis");
    });

    it("should handle complex mixed scenarios", () => {
      const charMap = { ü: "ue", "&": "und" };
      const multiCharMap = {
        ß: "ss",
        क्ष: "ksha",
      };

      const input = "Müßerक्षtest";
      expect(slugCore(input, { multiCharMap, lower: true }, charMap)).toBe(
        "muesserkshatest"
      );
    });
  });

  describe("base64 fallback", () => {
    it("should return empty string when fallback is disabled (default)", () => {
      expect(slugCore("   ")).toBe("");
      expect(slugCore("🎉")).toBe("");
      expect(slugCore("!!!")).toBe("");
    });

    it("should return empty string when fallback is explicitly disabled", () => {
      expect(slugCore("   ", { fallback: false })).toBe("");
      expect(slugCore("🎉", { fallback: false })).toBe("");
      expect(slugCore("!!!", { fallback: false })).toBe("");
    });

    it("should return base64 fallback when result is empty and fallback is enabled", () => {
      const result1 = slugCore("   ", { fallback: true });
      const result2 = slugCore("🎉", { fallback: true });
      const result3 = slugCore("!!!", { fallback: true });

      // Results should be non-empty strings
      expect(result1).not.toBe("");
      expect(result2).not.toBe("");
      expect(result3).not.toBe("");

      // Results should be valid URL-safe strings
      expect(result1).toMatch(/^[a-zA-Z0-9-]+$/);
      expect(result2).toMatch(/^[a-zA-Z0-9-]+$/);
      expect(result3).toMatch(/^[a-zA-Z0-9-]+$/);
    });

    it("should return same fallback result for same input", () => {
      const input = "🎉";
      const result1 = slugCore(input, { fallback: true });
      const result2 = slugCore(input, { fallback: true });
      expect(result1).toBe(result2);
    });

    it("should return different fallback results for different inputs", () => {
      const result1 = slugCore("🎉", { fallback: true });
      const result2 = slugCore("🚀", { fallback: true });
      expect(result1).not.toBe(result2);
    });

    it("should not use fallback when result is not empty", () => {
      // These should not trigger fallback since they produce non-empty results
      expect(slugCore("hello", { fallback: true })).toBe("hello");
      expect(slugCore("test 123", { fallback: true })).toBe("test-123");
    });

    it("should work with other options", () => {
      const result = slugCore("   ", { fallback: true, lower: true });
      expect(result).not.toBe("");
      expect(result).toBe(result.toLowerCase());
    });

    it("should work with custom replacement character", () => {
      const result = slugCore("   ", { fallback: true, replacement: "_" });
      expect(result).not.toBe("");
      expect(result).not.toContain("-");
    });

    it("should handle Unicode input in fallback", () => {
      const unicodeString = "🌟🎯🚀";
      const result = slugCore(unicodeString, { fallback: true });
      expect(result).not.toBe("");
      expect(result).toMatch(/^[a-zA-Z0-9-]+$/);
    });

    it("should handle empty string input", () => {
      const result = slugCore("", { fallback: true });
      expect(result).not.toBe("");
      expect(result).toMatch(/^[a-zA-Z0-9-]+$/);
    });
  });

  describe("preset modes", () => {
    it("should apply pretty mode preset", () => {
      const result = slugCore("Hello World & Test", { mode: "pretty" });
      expect(result).toBe("Hello-World-Test"); // & is not mapped without baseMap
    });

    it("should apply rfc3986 mode preset", () => {
      const result = slugCore("Hello World & Test", { mode: "rfc3986" });
      expect(result).toBe("hello-world-test"); // & is not mapped without baseMap
    });

    it("should allow options to override preset mode", () => {
      // pretty mode normally doesn't lowercase, but override should work
      const result = slugCore("Hello World", { mode: "pretty", lower: true });
      expect(result).toBe("hello-world");
    });

    it("should allow options to override preset mode replacement", () => {
      const result = slugCore("Hello World", {
        mode: "pretty",
        replacement: "_",
      });
      expect(result).toBe("Hello_World");
    });

    it("should work with character maps", () => {
      const germanMap = { ü: "ue", ß: "ss", "&": "und" };
      const result = slugCore("Müller & Weiß", { mode: "rfc3986" }, germanMap);
      expect(result).toBe("mueller-und-weiss");
    });

    it("should work with multi-character maps", () => {
      const multiCharMap = { "!!!": "exclamation" };
      const result = slugCore("Hello!!! World", {
        mode: "pretty",
        multiCharMap,
      });
      expect(result).toBe("Hello-exclamation-World");
    });

    it("should work with fallback option", () => {
      const result = slugCore("🎉", { mode: "pretty", fallback: true });
      expect(result).not.toBe("");
      expect(result).toMatch(/^[a-zA-Z0-9-]+$/);
    });

    it("should work with remove option", () => {
      const result = slugCore("Hello@World.com", {
        mode: "rfc3986",
        remove: /[@.]/g,
      });
      expect(result).toBe("hello-world-com");
    });

    it("should handle collapse option in presets", () => {
      // Both presets should have collapse enabled by default
      expect(slugCore("foo---bar", { mode: "pretty" })).toBe("foo-bar");
      expect(slugCore("foo---bar", { mode: "rfc3986" })).toBe("foo-bar");

      // Should be able to override collapse
      expect(slugCore("foo---bar", { mode: "pretty", collapse: false })).toBe(
        "foo---bar"
      );
    });

    it("should handle invalid mode gracefully", () => {
      // Should work as if no mode was specified
      const result = slugCore("Hello World", { mode: "invalid" as any });
      expect(result).toBe("Hello-World");
    });
  });
});
