import type { CharMap, MultiCharMap } from "../core.js";

// Single-character Arabic mappings
export const arMap: CharMap = {
  // Arabic letters (isolated forms)
  ا: "a", // alif
  ب: "b", // ba
  ت: "t", // ta
  ث: "th", // tha
  ج: "j", // jim
  ح: "h", // ha
  خ: "kh", // kha
  د: "d", // dal
  ذ: "dh", // dhal
  ر: "r", // ra
  ز: "z", // zay
  س: "s", // sin
  ش: "sh", // shin
  ص: "s", // sad
  ض: "d", // dad
  ط: "t", // ta
  ظ: "z", // za
  ع: "a", // ain
  غ: "gh", // ghayn
  ف: "f", // fa
  ق: "q", // qaf
  ك: "k", // kaf
  ل: "l", // lam
  م: "m", // mim
  ن: "n", // nun
  ه: "h", // ha
  و: "w", // waw
  ي: "y", // ya

  // Arabic numbers
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",

  // Persian/Urdu additional letters
  پ: "p", // pe
  چ: "ch", // che
  ژ: "zh", // zhe
  گ: "g", // gaf
  ڤ: "v", // veh
  ڪ: "k", // kaf
  ڭ: "ng", // ng
  ڮ: "v", // veh
  ڰ: "g", // gaf
  ڱ: "ng", // ng
  ڲ: "g", // gaf
  ڳ: "g", // gaf
  ڴ: "g", // gaf
  ڵ: "l", // lam
  ڶ: "l", // lam
  ڷ: "l", // lam
  ڸ: "l", // lam
  ڹ: "n", // nun
  ڻ: "n", // nun
  ڼ: "n", // nun
  ڽ: "n", // nun
  ھ: "h", // heh doachashmee
  ۀ: "h", // heh with yeh above
  ہ: "h", // heh goal
  ء: "a", // hamza
  ؤ: "u", // waw with hamza above
  ئ: "i", // ya with hamza above
  إ: "i", // alif with hamza below
  أ: "a", // alif with hamza above
  آ: "aa", // alif with madda above
  ة: "h", // ta marbuta

  // Common punctuation and symbols
  "؟": "", // Arabic question mark
  "؛": "", // Arabic semicolon
  "،": "", // Arabic comma
  "؍": "", // Arabic date separator
  "؎": "", // Arabic footnote marker
  "؏": "", // Arabic sign misra
  "ؐ": "", // Arabic sign sallallahou alayhe wassallam
  "ؑ": "", // Arabic sign alayhe assalam
  "ؒ": "", // Arabic sign rahmatullahi alayhe
  "ؓ": "", // Arabic sign radi allahou anhu
  "ؔ": "", // Arabic sign radi allahou anha
  "؞": "", // Arabic triple dot punctuation mark
  "&": "wa",
  "@": "at",
  "%": "fi-almia",
  "+": "zaid",
  "=": "yusawi",
  "<": "aqal",
  ">": "akbar",
  "©": "copyright",
  "®": "registered",
  "™": "trademark",
  "€": "euro",
  "£": "jineh",
  $: "dollar",
  "¥": "yen",
  "¢": "cent",
  "°": "daraja",
  "№": "raqam",
};

// Multi-character Arabic sequences
export const arMultiCharMap: MultiCharMap = {
  // Arabic ligatures and combinations
  لا: "la", // lam-alif
  لأ: "la", // lam-alif with hamza above
  لإ: "li", // lam-alif with hamza below
  لآ: "laa", // lam-alif with madda above

  // Common Arabic diacritics with letters
  بَ: "ba", // ba with fatha
  بُ: "bu", // ba with damma
  بِ: "bi", // ba with kasra
  بً: "ban", // ba with fathatan
  بٌ: "bun", // ba with dammatan
  بٍ: "bin", // ba with kasratan
  بّ: "bb", // ba with shadda
  بْ: "b", // ba with sukun

  تَ: "ta", // ta with fatha
  تُ: "tu", // ta with damma
  تِ: "ti", // ta with kasra
  تً: "tan", // ta with fathatan
  تٌ: "tun", // ta with dammatan
  تٍ: "tin", // ta with kasratan
  تّ: "tt", // ta with shadda
  تْ: "t", // ta with sukun

  // Common Arabic words
  الله: "Allah",
  محمد: "Muhammad",
  علي: "Ali",
  عبد: "Abd",
  بن: "bin",
  بنت: "bint",
  أبو: "Abu",
  أم: "Umm",
  الإسلام: "al-Islam",
  المسلم: "al-Muslim",
  العربية: "al-Arabiya",
  السلام: "as-Salam",
  عليكم: "alaykum",
  وعليكم: "wa-alaykum",
  الرحمن: "ar-Rahman",
  الرحيم: "ar-Raheem",
  بسم: "bismillah",
  الحمد: "al-hamd",
  رب: "rabb",
  العالمين: "al-alameen",
  إن: "inna",
  شاء: "shaa",
  ما: "ma",
  كان: "kana",
  لم: "lam",
  يشأ: "yasha",
  يكن: "yakun",
  هذا: "hadha",
  هذه: "hadhihi",
  ذلك: "dhalika",
  تلك: "tilka",
  الذي: "alladhi",
  التي: "allati",
  الذين: "alladhina",
  اللذان: "alladhani",
  اللذين: "alladhayn",
  اللائي: "allai",
  اللاتي: "allati",
  اللواتي: "allawati",
  في: "fi",
  على: "ala",
  إلى: "ila",
  من: "min",
  عن: "an",
  مع: "maa",
  بعد: "baad",
  قبل: "qabl",
  تحت: "taht",
  فوق: "fawq",
  أمام: "amam",
  خلف: "khalf",
  يمين: "yameen",
  شمال: "shimal",
  شرق: "sharq",
  غرب: "gharb",
  جنوب: "janub",
  اليوم: "al-yawm",
  أمس: "ams",
  غدا: "ghadan",
  الآن: "al-an",
  هنا: "huna",
  هناك: "hunak",
  أين: "ayn",
  متى: "mata",
  كيف: "kayf",
  ماذا: "madha",
  لماذا: "limadha",
  مين: "min",
  كم: "kam",
  أي: "ayy",
  نعم: "naam",
  ربما: "rubbama",
  أكيد: "akeed",
  طبعا: "tabaan",
  بالطبع: "bil-taba",
  شكرا: "shukran",
  عفوا: "afwan",
  آسف: "asif",
  مرحبا: "marhaban",
  أهلا: "ahlan",
  سهلا: "sahlan",
  "أهلا وسهلا": "ahlan wa sahlan",
  "مع السلامة": "maa as-salama",
  "إلى اللقاء": "ila al-liqa",
};
