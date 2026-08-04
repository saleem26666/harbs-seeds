import { upsertOnlineHerb } from '../db/database';
import { ALIAS_GROUPS, getPreferredOnlineQuery } from '../db/searchAliases';
import { Herb } from '../db/types';
import { fetchWithTimeout } from './http';
import { buildImageCandidates, upgradeThumbUrl } from './imageLookup';

type WikiSearchItem = {
  title: string;
  snippet?: string;
};

type WikiSummary = {
  title: string;
  extract?: string;
  description?: string;
  thumbnail?: { source: string };
  originalimage?: { source: string };
};

const WIKI_HEADERS = {
  Accept: 'application/json',
  'Api-User-Agent': 'HarbsSeedsApp/1.0 (educational; offline herb guide)',
  'User-Agent': 'HarbsSeedsApp/1.0 (educational; offline herb guide)',
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function guessCategory(title: string, extract: string): string {
  const text = `${title} ${extract}`.toLowerCase();
  if (text.includes('nut') || text.includes('almond') || text.includes('seed')) return 'seed';
  if (text.includes('root') || text.includes('rhizome')) return 'root';
  if (text.includes('flower')) return 'flower';
  if (text.includes('fruit')) return 'fruit';
  if (text.includes('spice') || text.includes('pepper') || text.includes('seasoning')) {
    return 'spice';
  }
  if (text.includes('leaf') || text.includes('leaves')) return 'leaf';
  return 'herb';
}

function resolveUrduName(title: string, hint?: string): string {
  if (hint && /[\u0600-\u06FF]/.test(hint)) return hint;
  const group = ALIAS_GROUPS.find((g) =>
    g.en.some((en) => en.toLowerCase() === title.toLowerCase()),
  );
  return group?.ur[0] || hint || title;
}

function buildBilingualCopy(title: string, extract: string, nameUr?: string) {
  const text = (extract || `${title} is used as a food plant/spice.`).trim();
  const urName = resolveUrduName(title, nameUr);
  const benefitsEn =
    text.length > 900 ? `${text.slice(0, 897).trim()}...` : text;

  return {
    benefits_en: benefitsEn,
    benefits_ur:
      `${urName} کے بارے میں انٹرنیٹ/ویکیپیڈیا سے حاصل معلومات:\n\n` +
      `${benefitsEn}\n\n` +
      `خلاصہ (اردو): ${urName} ایک قدرتی غذائی/جڑی بوٹی آئٹم ہے جسے لوگ کھانے اور روایتی صحت کے استعمال میں لاتے ہیں۔ اوپر انگریزی تفصیل میں فوائد اور پس منظر درج ہے۔ مزید یقین کے لیے مستند ماخذ یا معالج سے رجوع کریں۔`,
    harms_en:
      'General information only — not medical advice. Check allergies, safe dose, pregnancy use, and medicine interactions with a qualified practitioner.',
    harms_ur:
      'یہ عام معلومات ہیں، طبی مشورہ نہیں۔ الرجی، محفوظ مقدار، حمل، اور ادویات کے ٹکراؤ کے لیے مستند معالج سے تصدیق کریں۔',
    usage_en: 'Prefer normal culinary amounts unless a qualified practitioner advises otherwise.',
    usage_ur: 'بغیر مشورے صرف عام کھانے کی مقدار استعمال کریں؛ دوائی والی مقدار معالج سے پوچھیں۔',
  };
}

function isPlantLike(title: string, extract: string): boolean {
  const lower = `${title} ${extract}`.toLowerCase();
  const blockers = ['disambiguation', 'surname', 'film', 'album', 'company', 'software'];
  if (blockers.some((b) => lower.includes(b))) return false;
  return (
    lower.includes('plant') ||
    lower.includes('herb') ||
    lower.includes('seed') ||
    lower.includes('botan') ||
    lower.includes('spice') ||
    lower.includes('flower') ||
    lower.includes('species') ||
    lower.includes('pepper') ||
    lower.includes('seasoning') ||
    lower.includes('culinary') ||
    lower.includes('fruit') ||
    lower.includes('tree') ||
    lower.includes('nut') ||
    lower.includes('almond') ||
    lower.includes('vine') ||
    lower.includes('crop')
  );
}

async function fetchWikiSummary(title: string): Promise<WikiSummary | null> {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    const res = await fetchWithTimeout(url, { headers: WIKI_HEADERS }, 7000);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** Longer plain-text intro for richer Benefits text. */
async function fetchWikiExtract(title: string): Promise<string | null> {
  try {
    const url =
      `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1` +
      `&titles=${encodeURIComponent(title)}&format=json&origin=*`;
    const res = await fetchWithTimeout(url, { headers: WIKI_HEADERS }, 7000);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages ?? {};
    for (const page of Object.values(pages) as Array<{ extract?: string; missing?: boolean }>) {
      if (page?.extract && !page.missing) return page.extract.trim();
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchWikiPageImage(title: string): Promise<string | null> {
  try {
    const url =
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}` +
      `&prop=pageimages&format=json&pithumbsize=800&pilicense=any&origin=*`;
    const res = await fetchWithTimeout(url, { headers: WIKI_HEADERS }, 7000);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages ?? {};
    for (const page of Object.values(pages) as Array<{ thumbnail?: { source?: string } }>) {
      if (page?.thumbnail?.source) return upgradeThumbUrl(page.thumbnail.source);
    }
    return null;
  } catch {
    return null;
  }
}

async function searchWikiTitles(query: string): Promise<WikiSearchItem[]> {
  try {
    const url =
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}` +
      `&limit=5&namespace=0&format=json&origin=*`;
    const res = await fetchWithTimeout(url, { headers: WIKI_HEADERS }, 7000);
    if (!res.ok) return [];
    const data = await res.json();
    const titles: string[] = data[1] ?? [];
    const snippets: string[] = data[2] ?? [];
    return titles.map((title, index) => ({
      title,
      snippet: snippets[index],
    }));
  } catch {
    return [];
  }
}

async function fetchCommonsImage(query: string): Promise<string | null> {
  try {
    const url =
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search` +
      `&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&gsrnamespace=6` +
      `&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`;
    const res = await fetchWithTimeout(url, { headers: WIKI_HEADERS }, 7000);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages ?? {};
    for (const page of Object.values(pages) as Array<{
      imageinfo?: Array<{ thumburl?: string; url?: string }>;
    }>) {
      const info = page?.imageinfo?.[0];
      if (info?.thumburl) return info.thumburl;
      if (info?.url) return info.url;
    }
    return null;
  } catch {
    return null;
  }
}

async function quickImageForTitle(title: string): Promise<string | null> {
  const summary = await fetchWikiSummary(title);
  if (summary?.originalimage?.source) return summary.originalimage.source;
  if (summary?.thumbnail?.source) return upgradeThumbUrl(summary.thumbnail.source);
  return fetchWikiPageImage(title);
}

async function saveFromSummary(
  summary: WikiSummary,
  snippet?: string,
  nameUr?: string,
): Promise<Herb | null> {
  const longExtract = await fetchWikiExtract(summary.title);
  const extract =
    longExtract ||
    summary.extract ||
    summary.description ||
    stripHtml(snippet || '');
  if (!extract) return null;
  if (!isPlantLike(summary.title, extract)) return null;

  const urName = resolveUrduName(summary.title, nameUr);
  const copy = buildBilingualCopy(summary.title, extract, urName);
  const imageUrl = await quickImageForTitle(summary.title);
  const slug = slugify(`online-${summary.title}`);

  return upsertOnlineHerb({
    slug,
    name_en: summary.title,
    name_ur: urName,
    scientific_name: summary.description || 'Unknown species',
    category: guessCategory(summary.title, extract),
    ...copy,
    image_url: imageUrl,
    image_query: summary.title,
  });
}

/**
 * Fast online lookup (Wikipedia only, with timeouts). Saves result offline.
 * Designed to finish in a few seconds — never hang for minutes.
 */
export async function searchAndCacheOnline(query: string): Promise<Herb | null> {
  const preferred = getPreferredOnlineQuery(query);
  const urduHint = /[\u0600-\u06FF]/.test(query) ? query.trim() : undefined;

  // Prefer direct English pages first (Almond, Ajwain, …)
  const attempts = [
    preferred,
    `${preferred} (nut)`,
    `${preferred} tree`,
    query.trim(),
  ].filter((v, i, arr) => Boolean(v) && arr.indexOf(v) === i);

  for (const attempt of attempts) {
    // 1) Direct summary — fastest path
    const direct = await fetchWikiSummary(attempt);
    if (direct?.extract || direct?.description) {
      const saved = await saveFromSummary(direct, undefined, urduHint);
      if (saved) return saved;
    }

    // 2) OpenSearch titles (max 5), stop at first plant-like hit
    const titles = await searchWikiTitles(attempt);
    for (const item of titles.slice(0, 4)) {
      const summary = await fetchWikiSummary(item.title);
      if (!summary) continue;
      const saved = await saveFromSummary(summary, item.snippet, urduHint);
      if (saved) return saved;
    }
  }

  return null;
}

/**
 * Resolve a plant photo — limited candidates + timeouts (no endless loops).
 */
export async function resolveHerbImage(
  imageQuery: string,
  existingUrl?: string | null,
  extras?: { nameEn?: string; scientificName?: string },
): Promise<string | null> {
  if (existingUrl) return existingUrl;

  const candidates = buildImageCandidates(
    imageQuery,
    extras?.nameEn,
    extras?.scientificName,
  ).slice(0, 5);

  for (const title of candidates) {
    const img = await quickImageForTitle(title);
    if (img) return img;
  }

  const searchHits = await searchWikiTitles(candidates[0] || imageQuery);
  for (const hit of searchHits.slice(0, 2)) {
    const img = await quickImageForTitle(hit.title);
    if (img) return img;
  }

  const commons = await fetchCommonsImage(`${candidates[0] || imageQuery} plant`);
  if (commons) return commons;

  return null;
}
