import type { CharMap, MultiCharMap } from "../core.js";

// Single-character Devanagari mappings
export const hiMap: CharMap = {
  // Vowels
  अ: "a",
  आ: "aa",
  इ: "i",
  ई: "ii",
  उ: "u",
  ऊ: "uu",
  ए: "e",
  ऐ: "ai",
  ओ: "o",
  औ: "ou",
  ऍ: "ei",
  ऎ: "ae",
  ऑ: "oi",
  ऒ: "oii",

  // Consonants
  क: "Ka",
  ख: "Kha",
  ग: "Ga",
  घ: "Gha",
  ङ: "Na",
  च: "Ca",
  छ: "Chha",
  ज: "Ja",
  झ: "Jha",
  ञ: "Nia",
  ट: "Ta",
  ठ: "Tha",
  ड: "Da",
  ढ: "Dha",
  ण: "Nae",
  त: "Ta",
  थ: "Tha",
  द: "Tha",
  ध: "Thha",
  न: "Na",
  प: "Pa",
  फ: "Fa",
  ब: "B",
  भ: "Bha",
  म: "Ma",
  य: "Ya",
  र: "Ra",
  ल: "L",
  ळ: "Li",
  व: "Va",
  श: "Sha",
  ष: "Shha",
  स: "Sa",
  ह: "Ha",

  // Special characters
  ऋ: "Ri",
  ॠ: "Ri",
  ऌ: "Li",
  ॡ: "Lii",
  ऱ: "Ri",
  ऩ: "Ni",
  ऴ: "Lii",
  ॐ: "oms",

  // Common symbols
  "&": "aur",
  "@": "at",
  "%": "pratishat",
  "+": "plus",
  "=": "barabar",
  "<": "kam",
  ">": "zyada",
  "©": "copyright",
  "®": "registered",
  "™": "trademark",
  "€": "euro",
  "£": "pound",
  $: "dollar",
  "¥": "yen",
  "¢": "cent",
  "°": "degree",
  "№": "number",
};

// Multi-character Devanagari sequences
export const hiMultiCharMap: MultiCharMap = {
  // Modified consonants with nukta (dot below)
  फ़: "Fi", // pha + nukta = f sound
  ग़: "Ghi", // ga + nukta = gh sound
  ख़: "Khi", // kha + nukta = kh sound
  क़: "Qi", // ka + nukta = q sound
  ड़: "ugDha", // da + nukta = hard d sound
  ढ़: "ugDhha", // dha + nukta = hard dh sound
  य़: "Yi", // ya + nukta = yi sound
  ज़: "Za", // ja + nukta = z sound

  // Common conjunct consonants
  क्ष: "Ksha",
  त्र: "Tra",
  ज्ञ: "Gya",
  श्र: "Shra",

  // Vowel signs (matras) combinations that are commonly transliterated as units
  "ाे": "o", // aa + e = o
  "ाै": "au", // aa + ai = au
  "ृ": "ri", // vocalic r
  "ॄ": "rri", // long vocalic r
  "ॢ": "li", // vocalic l
  "ॣ": "lli", // long vocalic l

  // Common Hindi words
  और: "aur",
  या: "ya",
  के: "ke",
  की: "ki",
  को: "ko",
  से: "se",
  में: "mein",
  पर: "par",
  है: "hai",
  था: "tha",
  थी: "thi",
  थे: "the",
};
