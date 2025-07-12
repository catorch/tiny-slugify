#!/usr/bin/env node

// Example usage of tiny-slugify
import { slugify, createSlugifier, extend, baseMap } from './dist/index.js';
import { deMap } from './dist/de.js';
import { frMap } from './dist/fr.js';

console.log('🚀 tiny-slugify examples\n');

console.log('Basic usage:');
console.log('slugify("Hello World") →', slugify('Hello World'));
console.log('slugify("Café & Restaurant") →', slugify('Café & Restaurant'));
console.log();

console.log('With options:');
console.log('slugify("Hello World", { lower: true }) →', slugify('Hello World', { lower: true }));
console.log('slugify("Hello World", { replacement: "_" }) →', slugify('Hello World', { replacement: '_' }));
console.log();

console.log('German locale example:');
const germanSlugify = createSlugifier({ 
  map: extend(baseMap, deMap),
  options: { lower: true }
});
console.log('germanSlugify("Ärger & Größe") →', germanSlugify('Ärger & Größe'));
console.log('germanSlugify("100%") →', germanSlugify('100%'));
console.log();

console.log('French locale example:');
const frenchSlugify = createSlugifier({ 
  map: extend(baseMap, frMap),
  options: { lower: true }
});
console.log('frenchSlugify("Café & Restaurant") →', frenchSlugify('Café & Restaurant'));
console.log('frenchSlugify("été") →', frenchSlugify('été'));
console.log();

console.log('Performance test:');
const start = performance.now();
for (let i = 0; i < 10000; i++) {
  slugify(`Test string ${i} with special chars!@#$%`);
}
const duration = performance.now() - start;
console.log(`10,000 slugs generated in ${duration.toFixed(2)}ms`);
console.log(`Rate: ${Math.round(10000 / (duration / 1000))} slugs/second`);