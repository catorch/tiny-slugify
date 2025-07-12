import {
  slugCore,
  type Options,
  type CharMap,
  type MultiCharMap,
} from "./core.js";
import { baseMap } from "./map-base.js";

export type { Options, CharMap, MultiCharMap };
export { baseMap };

export function slugify(str: string, options?: Options): string {
  return slugCore(str, options, baseMap);
}

export interface SlugifierConfig {
  map?: CharMap;
  multiCharMap?: MultiCharMap;
  options?: Options;
}

export function createSlugifier(config: SlugifierConfig = {}) {
  const {
    map = baseMap,
    multiCharMap = {},
    options: defaultOptions = {},
  } = config;

  return function slugifier(str: string, options?: Options): string {
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      multiCharMap:
        options?.multiCharMap ?? defaultOptions.multiCharMap ?? multiCharMap,
    };
    return slugCore(str, mergedOptions, map);
  };
}

export function extend(base: CharMap, ...extensions: CharMap[]): CharMap {
  return Object.assign({}, base, ...extensions);
}

export function extendMultiChar(
  base: MultiCharMap,
  ...extensions: MultiCharMap[]
): MultiCharMap {
  return Object.assign({}, base, ...extensions);
}
