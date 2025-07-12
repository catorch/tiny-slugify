# tiny-slugify

[![npm version](https://badge.fury.io/js/tiny-slugify.svg)](https://npmjs.com/package/tiny-slugify)
[![Bundle size](https://pkg-size.dev/badge/bundle/5675)](https://pkg-size.dev/tiny-slugify)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Ultra-lightweight, tree-shakable slug generator with optional transliteration. **Under 1kB** for the core functionality, with locale-specific character maps available as separate, optional imports.

## Why tiny-slugify?

- **🚀 Tiny**: Core is < 1kB, full API < 2kB
- **🌳 Tree-shakeable**: Import only what you need
- **🔒 No global state**: Safe for serverless and testing
- **⚡ Fast**: 2-3x faster than alternatives on large datasets
- **🌍 Unicode-ready**: Optional locale packs for any language
- **📦 Modern ESM**: First-class ES modules with TypeScript
- **⚙️ Preset modes**: 'pretty' and 'rfc3986' configurations built-in
- **🔧 CLI tool**: Use via `npx tiny-slugify` for quick commands
- **🛡️ Robust**: Comprehensive fuzz testing for reliability

## Installation

```bash
npm install tiny-slugify
```

## Quick Start

### Basic Usage

```js
import { slugify } from "tiny-slugify/core";

slugify("Hello World"); // → 'Hello-World'
slugify("Café & Restaurant"); // → 'Cafe-Restaurant'
```

### With Locale Support

```js
import { createSlugifier, extend, baseMap } from "tiny-slugify";
import { deMap } from "tiny-slugify/locale/de";

const germanSlugify = createSlugifier({
  map: extend(baseMap, deMap),
  options: { lower: true },
});

germanSlugify("Ärger & Größe"); // → 'aerger-und-groesse'
germanSlugify("100%"); // → '100prozent'
```

### With Preset Modes (v1.3.0+)

```js
import { slugify } from "tiny-slugify/core";

// Pretty mode (preserves case, good for titles)
slugify("Hello World & Test", { mode: "pretty" }); // → 'Hello-World-and-Test'

// RFC3986 mode (lowercase, URL-safe)
slugify("Hello World & Test", { mode: "rfc3986" }); // → 'hello-world-and-test'
```

### CLI Usage (v1.3.0+)

```bash
# Basic usage
npx tiny-slugify "Hello World"
# → Hello-World

# With preset modes
npx tiny-slugify --mode=rfc3986 "Hello World & Test"
# → hello-world-and-test

# With custom options
npx tiny-slugify --replacement="_" --lower "Hello World"
# → hello_world

# Pipe input
echo "Hello World" | npx tiny-slugify --mode=pretty
# → Hello-World
```

## API Reference

### `slugify(str, options?)`

Basic slug generation with built-in character map.

```js
import { slugify } from "tiny-slugify/core";

slugify("Hello World", {
  replacement: "_", // Default: '-'
  lower: true, // Default: false
  strict: true, // Default: false
  trim: true, // Default: true
  collapse: true, // Default: true
  fallback: false, // Default: false
  mode: "rfc3986", // Default: undefined
  remove: /[*+~.()'"!:@]/g, // Custom removal pattern
});
```

### `createSlugifier(config?)`

Create a slugifier instance with custom character maps and default options.

```js
import { createSlugifier, extend, baseMap } from "tiny-slugify";
import { frMap } from "tiny-slugify/locale/fr";

const frenchSlugify = createSlugifier({
  map: extend(baseMap, frMap),
  options: { lower: true, replacement: "-", mode: "rfc3986" },
});
```

### Options

| Option         | Type                           | Default       | Description                           |
| -------------- | ------------------------------ | ------------- | ------------------------------------- |
| `replacement`  | `string`                       | `'-'`         | Character to replace spaces           |
| `lower`        | `boolean`                      | `false`       | Convert to lowercase                  |
| `strict`       | `boolean`                      | `false`       | Strip non-alphanumeric chars          |
| `trim`         | `boolean`                      | `true`        | Trim replacement chars from ends      |
| `collapse`     | `boolean`                      | `true`        | Collapse consecutive replacements     |
| `fallback`     | `boolean`                      | `false`       | Use base64 fallback for empty results |
| `mode`         | `'pretty' \| 'rfc3986'`        | `undefined`   | Apply preset configuration            |
| `remove`       | `RegExp \| string \| string[]` | `/[^\w\s-]/g` | Pattern for chars to remove           |
| `multiCharMap` | `MultiCharMap`                 | `{}`          | Multi-character mappings              |

### Preset Modes (v1.3.0+)

#### Pretty Mode

```js
{
  replacement: '-',
  lower: false,      // Preserves original case
  strict: false,
  trim: true,
  collapse: true,
  fallback: false
}
```

#### RFC3986 Mode

```js
{
  replacement: '-',
  lower: true,       // Forces lowercase
  strict: false,
  trim: true,
  collapse: true,
  fallback: false
}
```

### Base64 Fallback (v1.3.0+)

When enabled, provides a deterministic slug for strings that would otherwise result in empty output:

```js
slugify("🎉"); // → ''
slugify("🎉", { fallback: true }); // → 'OGpvaXE' (base64-derived)
slugify("   ", { fallback: true }); // → 'ZW1wdHk' (base64-derived)
```

### Multi-Character Mapping (v1.2.0+)

Support for complex scripts with multi-character sequences:

```js
import { createSlugifier, extend, baseMap } from "tiny-slugify";
import { hiMap, hiMultiCharMap } from "tiny-slugify/locale/hi";

const hindiSlugify = createSlugifier({
  map: extend(baseMap, hiMap),
  multiCharMap: hiMultiCharMap,
});

hindiSlugify("नमस्ते"); // → 'namaste'
hindiSlugify("क्ष"); // → 'ksha' (conjunct consonant)
```

### `extend(base, ...extensions)`

Merge character maps without mutating originals.

```js
import { extend, baseMap } from "tiny-slugify";
import { deMap } from "tiny-slugify/locale/de";

const customMap = extend(baseMap, deMap, { "©": "copyright" });
```

### `extendMultiChar(...maps)`

Merge multi-character maps for complex scripts.

```js
import { extendMultiChar } from "tiny-slugify";
import { hiMultiCharMap } from "tiny-slugify/locale/hi";
import { heMultiCharMap } from "tiny-slugify/locale/he";

const combinedMultiChar = extendMultiChar(hiMultiCharMap, heMultiCharMap);
```

## Available Locales

- **`tiny-slugify/locale/de`** - German (ä → ae, ß → ss, & → und)
- **`tiny-slugify/locale/fr`** - French (é → e, œ → oe, & → et)
- **`tiny-slugify/locale/hi`** - Hindi (अ → a, क्ष → ksha, & → aur) + multi-char

More locales coming soon! Contributions welcome.

## CLI Tool (v1.3.0+)

### Installation

The CLI is included with the package:

```bash
npm install tiny-slugify
# or for global use
npm install -g tiny-slugify
```

### Usage

```bash
# Basic usage
npx tiny-slugify "Hello World"

# Help
npx tiny-slugify --help

# Version
npx tiny-slugify --version

# Preset modes
npx tiny-slugify --mode=pretty "Hello World & Test"
npx tiny-slugify --mode=rfc3986 "Hello World & Test"

# Custom options
npx tiny-slugify --replacement="_" "Hello World"
npx tiny-slugify --lower --strict "Café & Restaurant"
npx tiny-slugify --fallback "🎉"

# Remove characters
npx tiny-slugify --remove="@." "hello@world.com"

# Pipe input
echo "Hello World" | npx tiny-slugify --mode=rfc3986
```

### CLI Options

| Option                 | Description                        | Example             |
| ---------------------- | ---------------------------------- | ------------------- |
| `--mode <mode>`        | Preset mode: 'pretty' or 'rfc3986' | `--mode=rfc3986`    |
| `--replacement <char>` | Replacement character              | `--replacement="_"` |
| `--lower`              | Convert to lowercase               | `--lower`           |
| `--strict`             | Remove non-alphanumeric chars      | `--strict`          |
| `--no-trim`            | Don't trim replacement chars       | `--no-trim`         |
| `--no-collapse`        | Don't collapse consecutive chars   | `--no-collapse`     |
| `--fallback`           | Use base64 fallback                | `--fallback`        |
| `--remove <pattern>`   | Remove matching characters         | `--remove="@."`     |
| `--help`               | Show help message                  | `--help`            |
| `--version`            | Show version number                | `--version`         |

## Bundle Size Comparison

| Package        | Core Size | With Locales | Tree-shakeable | CLI |
| -------------- | --------- | ------------ | -------------- | --- |
| `slugify`      | 12.5kB    | 12.5kB       | ❌             | ❌  |
| `slug`         | 8.2kB     | 8.2kB        | ❌             | ✅  |
| `tiny-slugify` | **0.9kB** | **3.8kB**    | ✅             | ✅  |

## Performance

Benchmarks on Node.js 20 (M1 MacBook Pro):

- **tiny-slugify**: ~50,000 slugs/sec
- **slugify**: ~22,000 slugs/sec
- **slug**: ~35,000 slugs/sec

Performance gains are most noticeable with:

- Large datasets (CSV processing, file system operations)
- Server-side rendering with many routes
- Client-side apps with heavy string processing

## Migration Guides

### From `slugify`

Drop-in replacement for basic usage:

```diff
- import slugify from 'slugify';
+ import { slugify } from 'tiny-slugify/core';

slugify('Hello World'); // Same API!
```

For extended character support:

```diff
- import slugify from 'slugify';
+ import { createSlugifier, extend, baseMap } from 'tiny-slugify';
+ import { deMap } from 'tiny-slugify/locale/de';

- slugify('Über Café', { locale: 'de' });
+ const germanSlugify = createSlugifier({ map: extend(baseMap, deMap) });
+ germanSlugify('Über Café');
```

For preset-like behavior:

```diff
- slugify('Hello World', { lower: true, strict: false });
+ slugify('Hello World', { mode: 'rfc3986' });
```

### From `slug`

```diff
- import slug from 'slug';
+ import { slugify } from 'tiny-slugify/core';

- slug('Hello World');
+ slugify('Hello World', { lower: true }); // slug defaults to lowercase
```

With fallback behavior:

```diff
- slug('🎉'); // returns base64-like string
+ slugify('🎉', { fallback: true }); // similar behavior
```

## Version History

### v1.3.0 (Latest)

- ✅ Base64 fallback for empty results
- ✅ Preset modes ('pretty', 'rfc3986')
- ✅ CLI tool for npx usage
- ✅ Comprehensive fuzz testing

### v1.2.0

- ✅ Multi-character mapping support
- ✅ Hindi locale pack with Devanagari

- ✅ Trie-based longest-match algorithm

### v1.1.0

- ✅ Unicode well-formed check
- ✅ Collapse option for consecutive chars
- ✅ Enhanced test coverage

### v1.0.0

- ✅ Core slugification functionality
- ✅ German and French locale packs
- ✅ Tree-shakeable ES modules
- ✅ TypeScript support

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © 2024

---

Made with ❤️ by the tiny-slugify team
