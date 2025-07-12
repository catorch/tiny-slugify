import { slugify } from "./index.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf8")
);

interface CLIOptions {
  mode?: "pretty" | "rfc3986";
  replacement?: string;
  lower?: boolean;
  strict?: boolean;
  trim?: boolean;
  collapse?: boolean;
  fallback?: boolean;
  remove?: string;
  help?: boolean;
  version?: boolean;
}

function showHelp() {
  console.log(`
tiny-slugify v${packageJson.version}
Ultra-lightweight, tree-shakable slug generator

Usage:
  npx tiny-slugify [options] [text]
  echo "text" | npx tiny-slugify [options]

Options:
  --mode <mode>           Preset mode: 'pretty' or 'rfc3986'
  --replacement <char>    Replacement character (default: '-')
  --lower                 Convert to lowercase
  --strict                Remove all non-alphanumeric characters
  --no-trim              Don't trim replacement chars from ends
  --no-collapse          Don't collapse consecutive replacements
  --fallback             Use base64 fallback for empty results
  --remove <pattern>     Remove characters matching pattern
  --help                 Show this help message
  --version              Show version number

Examples:
  npx tiny-slugify "Hello World"
  npx tiny-slugify --mode=rfc3986 "Hello World & Test"
  npx tiny-slugify --replacement="_" "Hello World"
  npx tiny-slugify --lower --strict "Café & Restaurant"
  echo "Hello World" | npx tiny-slugify --mode=pretty

Modes:
  pretty      Pretty URLs (preserves case, default settings)
  rfc3986     RFC 3986 compliant (lowercase, URL-safe)
`);
}

function parseArguments(args: string[]): {
  options: CLIOptions;
  text: string[];
} {
  const options: CLIOptions = {};
  const text: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--version" || arg === "-v") {
      options.version = true;
    } else if (arg === "--mode") {
      const mode = args[++i];
      if (mode === "pretty" || mode === "rfc3986") {
        options.mode = mode;
      } else {
        console.error(`Invalid mode: ${mode}. Use 'pretty' or 'rfc3986'.`);
        process.exit(1);
      }
    } else if (arg.startsWith("--mode=")) {
      const mode = arg.split("=")[1];
      if (mode === "pretty" || mode === "rfc3986") {
        options.mode = mode;
      } else {
        console.error(`Invalid mode: ${mode}. Use 'pretty' or 'rfc3986'.`);
        process.exit(1);
      }
    } else if (arg === "--replacement") {
      options.replacement = args[++i];
    } else if (arg.startsWith("--replacement=")) {
      options.replacement = arg.split("=")[1];
    } else if (arg === "--lower") {
      options.lower = true;
    } else if (arg === "--strict") {
      options.strict = true;
    } else if (arg === "--no-trim") {
      options.trim = false;
    } else if (arg === "--no-collapse") {
      options.collapse = false;
    } else if (arg === "--fallback") {
      options.fallback = true;
    } else if (arg === "--remove") {
      options.remove = args[++i];
    } else if (arg.startsWith("--remove=")) {
      options.remove = arg.split("=")[1];
    } else if (arg.startsWith("--")) {
      console.error(`Unknown option: ${arg}`);
      process.exit(1);
    } else {
      text.push(arg);
    }
  }

  return { options, text };
}

async function readFromStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";

    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });

    process.stdin.on("end", () => {
      resolve(data.trim());
    });

    process.stdin.on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const { options, text } = parseArguments(args);

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  if (options.version) {
    console.log(packageJson.version);
    process.exit(0);
  }

  let input = "";

  if (text.length > 0) {
    // Use text from command line arguments
    input = text.join(" ");
  } else {
    // Check if stdin has data
    if (process.stdin.isTTY) {
      console.error(
        "Error: No input provided. Use --help for usage information."
      );
      process.exit(1);
    }

    try {
      input = await readFromStdin();
    } catch (error) {
      console.error("Error reading from stdin:", error);
      process.exit(1);
    }
  }

  if (!input) {
    console.error("Error: No input provided.");
    process.exit(1);
  }

  // Prepare options for slugify
  const slugifyOptions: any = {};

  if (options.mode) slugifyOptions.mode = options.mode;
  if (options.replacement !== undefined)
    slugifyOptions.replacement = options.replacement;
  if (options.lower !== undefined) slugifyOptions.lower = options.lower;
  if (options.strict !== undefined) slugifyOptions.strict = options.strict;
  if (options.trim !== undefined) slugifyOptions.trim = options.trim;
  if (options.collapse !== undefined)
    slugifyOptions.collapse = options.collapse;
  if (options.fallback !== undefined)
    slugifyOptions.fallback = options.fallback;
  if (options.remove !== undefined) {
    // Try to parse as regex if it looks like one
    if (options.remove.startsWith("/") && options.remove.includes("/")) {
      try {
        const parts = options.remove.split("/");
        const pattern = parts.slice(1, -1).join("/");
        const flags = parts[parts.length - 1];
        slugifyOptions.remove = new RegExp(pattern, flags);
      } catch (error) {
        console.error("Error parsing regex:", error);
        process.exit(1);
      }
    } else {
      slugifyOptions.remove = options.remove;
    }
  }

  try {
    const result = slugify(input, slugifyOptions);
    console.log(result);
  } catch (error) {
    console.error("Error generating slug:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
