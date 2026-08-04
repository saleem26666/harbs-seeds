/**
 * Cross-language search: Roman Urdu, English, Urdu script, and common typos
 * (e.g. "black paper" → Black Pepper / کالی مرچ).
 */

export type AliasGroup = {
  en: string[];
  ur: string[];
  roman: string[];
};

export const ALIAS_GROUPS: AliasGroup[] = [
  {
    en: ['Cardamom'],
    ur: ['الائچی', 'علائچی'],
    roman: ['illachi', 'elaichi', 'ilaichi', 'alachi', 'elaachi', 'ilaachi', 'elachi'],
  },
  {
    en: ['Ginger'],
    ur: ['ادرک'],
    roman: ['adrak', 'adarak', 'adrack'],
  },
  {
    en: ['Turmeric'],
    ur: ['ہلدی'],
    roman: ['haldi', 'haldee', 'huldi'],
  },
  {
    en: ['Tulsi', 'Basil'],
    ur: ['تلسی', 'تلسی میٹھی'],
    roman: ['tulsi', 'tulasi', 'basil'],
  },
  {
    en: ['Fennel Seed', 'Fennel'],
    ur: ['سونف'],
    roman: ['saunf', 'sonf', 'sauf', 'fennel'],
  },
  {
    en: ['Cumin Seed', 'Cumin'],
    ur: ['زیرا'],
    roman: ['zeera', 'jeera', 'zira', 'cumin'],
  },
  {
    en: ['Black Seed'],
    ur: ['کلونجی'],
    roman: ['kalonji', 'kalongi', 'klonji', 'nigella', 'black seed', 'blackseed'],
  },
  {
    en: ['Fenugreek'],
    ur: ['میٹھی', 'میتھی'],
    roman: ['methi', 'meethi', 'fenugreek'],
  },
  {
    en: ['Coriander'],
    ur: ['دھنیا'],
    roman: ['dhania', 'dhaniya', 'coriander', 'cilantro'],
  },
  {
    en: ['Mint', 'Peppermint'],
    ur: ['پودینہ', 'پیپرمنٹ'],
    roman: ['pudina', 'podeena', 'mint', 'peppermint'],
  },
  {
    en: ['Ajwain'],
    ur: ['اجوائن'],
    roman: ['ajwain', 'ajvain', 'ajowan', 'carom'],
  },
  {
    en: ['Clove'],
    ur: ['لونگ'],
    roman: ['laung', 'long', 'clove', 'lavang'],
  },
  {
    en: ['Cinnamon'],
    ur: ['دار چینی', 'دارچینی'],
    roman: ['dalchini', 'darchini', 'cinnamon'],
  },
  {
    en: ['Garlic'],
    ur: ['لہسن'],
    roman: ['lahsun', 'lehsun', 'lahsan', 'garlic'],
  },
  {
    en: ['Onion Seed'],
    ur: ['پیاز کے بیج'],
    roman: ['pyaz ke beej', 'onion seed'],
  },
  {
    en: ['Neem'],
    ur: ['نیم'],
    roman: ['neem'],
  },
  {
    en: ['Aloe Vera'],
    ur: ['ایلو ویرا'],
    roman: ['aloe', 'aloe vera', 'elovera'],
  },
  {
    en: ['Ashwagandha'],
    ur: ['اشوگندھا'],
    roman: ['ashwagandha', 'asgandh', 'asgand'],
  },
  {
    en: ['Moringa'],
    ur: ['سہانجنا', 'سہجن'],
    roman: ['moringa', 'sohanjna', 'sahjan', 'drumstick'],
  },
  {
    en: ['Sesame Seed'],
    ur: ['تل'],
    roman: ['til', 'sesame', 'teel'],
  },
  {
    en: ['Flax Seed'],
    ur: ['السی'],
    roman: ['alsi', 'flax', 'flaxseed', 'linseed'],
  },
  {
    en: ['Pumpkin Seed'],
    ur: ['کدو کے بیج'],
    roman: ['kaddu ke beej', 'pumpkin seed'],
  },
  {
    en: ['Chia Seed'],
    ur: ['چیا سیڈ'],
    roman: ['chia', 'chia seed'],
  },
  {
    en: ['Saffron'],
    ur: ['زعفران'],
    roman: ['zafran', 'zaafran', 'saffron', 'kesar'],
  },
  {
    en: ['Rose'],
    ur: ['گلاب'],
    roman: ['gulab', 'rose'],
  },
  {
    en: ['Lemongrass'],
    ur: ['لیمون گراس'],
    roman: ['lemongrass', 'lemon grass'],
  },
  {
    en: ['Thyme'],
    ur: ['اجوائن خراسانی'],
    roman: ['thyme'],
  },
  {
    en: ['Rosemary'],
    ur: ['اکلیل الجبل'],
    roman: ['rosemary'],
  },
  {
    en: ['Sage'],
    ur: ['سیج'],
    roman: ['sage'],
  },
  {
    en: ['Chamomile'],
    ur: ['بابونہ'],
    roman: ['babuna', 'chamomile', 'camomile'],
  },
  {
    en: ['Lavender'],
    ur: ['لیونڈر'],
    roman: ['lavender', 'lavendar'],
  },
  {
    en: ['Mustard Seed'],
    ur: ['رائے', 'سرسوں'],
    roman: ['rai', 'sarson', 'mustard'],
  },
  {
    en: ['Poppy Seed'],
    ur: ['خشخاش'],
    roman: ['khashkhash', 'khuskhus', 'poppy'],
  },
  {
    en: ['Anise Seed'],
    ur: ['انیسوں'],
    roman: ['anise', 'saunf sweet'],
  },
  {
    en: ['Dill Seed'],
    ur: ['سویا بیج'],
    roman: ['dill', 'soya beej'],
  },
  {
    en: ['Henna'],
    ur: ['مہندی'],
    roman: ['mehndi', 'henna', 'mehendi'],
  },
  {
    en: ['Amla'],
    ur: ['آملہ', 'آولا'],
    roman: ['amla', 'aamla', 'awla'],
  },
  {
    en: ['Black Pepper'],
    ur: ['کالی مرچ', 'گول مرچ'],
    roman: [
      'kali mirch',
      'kaali mirch',
      'black pepper',
      'blackpaper',
      'black paper',
      'blak pepper',
      'black peper',
      'black pepar',
      'gol mirch',
      'golmirch',
    ],
  },
  {
    en: ['Green Tea'],
    ur: ['گرین ٹی', 'سبز چائے'],
    roman: ['green tea', 'sabz chai'],
  },
  {
    en: ['Honey'],
    ur: ['شہد'],
    roman: ['shehad', 'shahad', 'honey'],
  },
  {
    en: ['Almond'],
    ur: ['بادام'],
    roman: ['badaam', 'badam', 'baadam', 'almond', 'badam seed'],
  },
  {
    en: ['Walnut'],
    ur: ['اخروٹ'],
    roman: ['akhrot', 'akharot', 'walnut'],
  },
  {
    en: ['Pistachio'],
    ur: ['پستہ'],
    roman: ['pista', 'pistachio'],
  },
  {
    en: ['Cashew'],
    ur: ['کاجو'],
    roman: ['kaju', 'cashew'],
  },
];

/** Common English spelling fixes before alias / online search. */
const TYPO_FIXES: Record<string, string> = {
  'black paper': 'black pepper',
  blackpaper: 'black pepper',
  'blak pepper': 'black pepper',
  'black peper': 'black pepper',
  'black pepar': 'black pepper',
  'balck pepper': 'black pepper',
  peper: 'pepper',
  pepar: 'pepper',
  illachi: 'elaichi',
  alachi: 'elaichi',
  adarak: 'adrak',
  huldi: 'haldi',
  badaam: 'almond',
  badam: 'almond',
  baadam: 'almond',
  akhrot: 'walnut',
  kaju: 'cashew',
  pista: 'pistachio',
};

function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/\s+/g, ' ');
}

function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j += 1) prev[j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j += 1) prev[j] = curr[j];
  }
  return prev[b.length];
}

function fuzzyAliasHit(query: string, alias: string): boolean {
  const q = normalize(query);
  const a = normalize(alias);
  if (!q || !a) return false;
  if (a === q || a.includes(q) || q.includes(a)) return true;

  // Whole-phrase close typo: "black paper" ≈ "black pepper"
  if (Math.abs(a.length - q.length) <= 2 && editDistance(a, q) <= 2 && q.length >= 5) {
    return true;
  }

  const qWords = q.split(' ');
  const aWords = a.split(' ');
  if (qWords.length === aWords.length && qWords.length >= 1) {
    let ok = true;
    for (let i = 0; i < qWords.length; i += 1) {
      const qw = qWords[i];
      const aw = aWords[i];
      if (qw === aw) continue;
      const maxDist = qw.length >= 5 || aw.length >= 5 ? 2 : 1;
      if (editDistance(qw, aw) > maxDist) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }

  return false;
}

export function correctQueryTypos(query: string): string {
  const q = normalize(query);
  if (TYPO_FIXES[q]) return TYPO_FIXES[q];
  // Word-level fixes
  const fixed = q
    .split(' ')
    .map((w) => TYPO_FIXES[w] ?? w)
    .join(' ');
  return fixed;
}

/** Best English name to use for Wikipedia / online lookup. */
export function getPreferredOnlineQuery(query: string): string {
  const terms = expandSearchTerms(query);
  for (const group of ALIAS_GROUPS) {
    const hit = group.en.some((en) =>
      terms.some((t) => t.toLowerCase() === en.toLowerCase()),
    ) || group.roman.some((r) => terms.some((t) => t.toLowerCase() === normalize(r)))
      || group.ur.some((u) => terms.includes(u));
    if (hit) return group.en[0];
  }
  const latin = terms.find((t) => /^[a-z][a-z\s\-']{2,}$/i.test(t));
  return latin ?? correctQueryTypos(query);
}

/** Expand a typed query into English + Urdu + Roman variants for DB search. */
export function expandSearchTerms(query: string): string[] {
  const corrected = correctQueryTypos(query);
  const q = normalize(corrected);
  if (!q) return [];

  const terms = new Set<string>([query.trim(), corrected, q]);

  for (const group of ALIAS_GROUPS) {
    const all = [...group.en, ...group.ur, ...group.roman];
    const hit = all.some((alias) => fuzzyAliasHit(q, alias) || fuzzyAliasHit(normalize(query), alias));
    if (hit) {
      for (const alias of all) {
        terms.add(alias);
        terms.add(normalize(alias));
      }
    }
  }

  return [...terms].filter(Boolean);
}

/** True when a result is a real match for the query (not a random "Pepper" cousin). */
export function isStrongSearchMatch(
  query: string,
  item: { name_en: string; name_ur: string },
): boolean {
  const terms = expandSearchTerms(query).map((t) => t.toLowerCase());
  const en = item.name_en.toLowerCase();
  const ur = item.name_ur;
  if (terms.includes(en) || terms.includes(ur)) return true;
  if (en === normalize(query) || ur === query.trim()) return true;
  // Curated exact family: "Black Pepper" when query corrected to black pepper
  const preferred = getPreferredOnlineQuery(query).toLowerCase();
  if (en === preferred) return true;
  return false;
}
