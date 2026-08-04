import * as SQLite from 'expo-sqlite';
import { generateCatalog, TARGET_HERB_COUNT } from './generateCatalog';
import { REAL_HERBS } from './realHerbs';
import {
  expandSearchTerms,
  getPreferredOnlineQuery,
} from './searchAliases';
import { Herb, HerbSummary } from './types';

/** Fake catalog names like "Alpine Almond Seed" — demote/hide when a real match exists. */
const GENERATED_NAME_PREFIXES = [
  'Wild',
  'Garden',
  'Mountain',
  'Desert',
  'River',
  'Forest',
  'Hill',
  'Valley',
  'Golden',
  'Silver',
  'Black',
  'White',
  'Red',
  'Green',
  'Blue',
  'Sacred',
  'Sweet',
  'Bitter',
  'Aromatic',
  'Common',
  'Indian',
  'Persian',
  'Himalayan',
  'Coastal',
  'Alpine',
  'Tropical',
  'Organic',
  'Royal',
  'Native',
  'Ancient',
];

function isGeneratedStyleName(nameEn: string): boolean {
  // Generated catalog names are "Alpine Almond Seed" (prefix + root + part).
  // Do NOT flag real items like "Black Pepper" / "Black Seed".
  const parts = nameEn.trim().split(/\s+/);
  if (parts.length < 3) return false;
  const first = parts[0] ?? '';
  return GENERATED_NAME_PREFIXES.some((p) => p.toLowerCase() === first.toLowerCase());
}

const DB_NAME = 'harbs_seeds.db';
const SEED_VERSION = 1;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Upserts popular curated herbs (e.g. Black Pepper) without full 50k reseed. */
export async function ensureCuratedHerbs(): Promise<void> {
  const db = await getDb();
  for (const herb of REAL_HERBS) {
    const slug = slugify(herb.name_en);
    const existing = await db.getFirstAsync<{ id: number }>(
      `SELECT id FROM herbs WHERE slug = ? OR lower(name_en) = lower(?)`,
      [slug, herb.name_en],
    );

    if (existing) {
      await db.runAsync(
        `UPDATE herbs SET
          slug = ?, name_en = ?, name_ur = ?, scientific_name = ?, category = ?,
          benefits_en = ?, benefits_ur = ?, harms_en = ?, harms_ur = ?,
          usage_en = ?, usage_ur = ?, image_query = ?, source = 'local'
         WHERE id = ?`,
        [
          slug,
          herb.name_en,
          herb.name_ur,
          herb.scientific_name,
          herb.category,
          herb.benefits_en,
          herb.benefits_ur,
          herb.harms_en,
          herb.harms_ur,
          herb.usage_en,
          herb.usage_ur,
          `${herb.name_en} plant`,
          existing.id,
        ],
      );
    } else {
      await db.runAsync(
        `INSERT INTO herbs (
          slug, name_en, name_ur, scientific_name, category,
          benefits_en, benefits_ur, harms_en, harms_ur,
          usage_en, usage_ur, image_url, image_query, source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, 'local')`,
        [
          slug,
          herb.name_en,
          herb.name_ur,
          herb.scientific_name,
          herb.category,
          herb.benefits_en,
          herb.benefits_ur,
          herb.harms_en,
          herb.harms_ur,
          herb.usage_en,
          herb.usage_ur,
          `${herb.name_en} plant`,
        ],
      );
    }
  }
}

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export type SeedProgress = {
  phase: 'opening' | 'creating' | 'seeding' | 'ready';
  current: number;
  total: number;
};

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

export async function initDatabase(
  onProgress?: (progress: SeedProgress) => void,
): Promise<{ count: number; seeded: boolean }> {
  onProgress?.({ phase: 'opening', current: 0, total: TARGET_HERB_COUNT });
  const db = await getDb();

  onProgress?.({ phase: 'creating', current: 0, total: TARGET_HERB_COUNT });
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS herbs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name_en TEXT NOT NULL,
      name_ur TEXT NOT NULL,
      scientific_name TEXT NOT NULL,
      category TEXT NOT NULL,
      benefits_en TEXT NOT NULL,
      benefits_ur TEXT NOT NULL,
      harms_en TEXT NOT NULL,
      harms_ur TEXT NOT NULL,
      usage_en TEXT NOT NULL,
      usage_ur TEXT NOT NULL,
      image_url TEXT,
      image_query TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'local',
      is_favorite INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_herbs_name_en ON herbs(name_en);
    CREATE INDEX IF NOT EXISTS idx_herbs_name_ur ON herbs(name_ur);
    CREATE INDEX IF NOT EXISTS idx_herbs_category ON herbs(category);
    CREATE INDEX IF NOT EXISTS idx_herbs_favorite ON herbs(is_favorite);
  `);

  const versionRow = await db.getFirstAsync<{ value: string }>(
    `SELECT value FROM meta WHERE key = 'seed_version'`,
  );
  const countRow = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM herbs`,
  );
  const count = countRow?.count ?? 0;

  if (versionRow?.value === String(SEED_VERSION) && count >= TARGET_HERB_COUNT) {
    await ensureCuratedHerbs();
    const refreshed =
      (await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM herbs`))
        ?.count ?? count;
    onProgress?.({ phase: 'ready', current: refreshed, total: refreshed });
    return { count: refreshed, seeded: false };
  }

  onProgress?.({ phase: 'seeding', current: 0, total: TARGET_HERB_COUNT });
  await db.execAsync(`DELETE FROM herbs WHERE source = 'local'`);

  const catalog = generateCatalog(TARGET_HERB_COUNT);
  const batchSize = 80;

  for (let offset = 0; offset < catalog.length; offset += batchSize) {
    const batch = catalog.slice(offset, offset + batchSize);
    const placeholders = batch
      .map(() => `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, 'local')`)
      .join(', ');
    const values: (string | number)[] = [];
    for (const item of batch) {
      values.push(
        item.slug,
        item.name_en,
        item.name_ur,
        item.scientific_name,
        item.category,
        item.benefits_en,
        item.benefits_ur,
        item.harms_en,
        item.harms_ur,
        item.usage_en,
        item.usage_ur,
        item.image_query,
      );
    }

    await db.runAsync(
      `INSERT OR IGNORE INTO herbs (
        slug, name_en, name_ur, scientific_name, category,
        benefits_en, benefits_ur, harms_en, harms_ur,
        usage_en, usage_ur, image_url, image_query, source
      ) VALUES ${placeholders}`,
      values,
    );

    onProgress?.({
      phase: 'seeding',
      current: Math.min(offset + batch.length, catalog.length),
      total: catalog.length,
    });
  }

  await db.runAsync(
    `INSERT OR REPLACE INTO meta (key, value) VALUES ('seed_version', ?)`,
    [String(SEED_VERSION)],
  );

  await ensureCuratedHerbs();

  const finalCount = (
    await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM herbs`)
  )?.count ?? 0;

  onProgress?.({ phase: 'ready', current: finalCount, total: finalCount });
  return { count: finalCount, seeded: true };
}

export async function searchHerbs(query: string, limit = 40): Promise<HerbSummary[]> {
  const db = await getDb();
  const q = query.trim();
  if (!q) {
    const browse = await db.getAllAsync<HerbSummary>(
      `SELECT id, name_en, name_ur, scientific_name, category, image_url, image_query, source, is_favorite
       FROM herbs
       ORDER BY length(name_en), name_en
       LIMIT 120`,
    );
    return browse.filter((item) => !isGeneratedStyleName(item.name_en)).slice(0, limit);
  }

  const terms = expandSearchTerms(q);
  const preferred = getPreferredOnlineQuery(q);
  const clauses: string[] = [];
  const params: string[] = [];

  for (const term of terms) {
    const like = `%${term}%`;
    clauses.push(
      `(name_en LIKE ? OR name_ur LIKE ? OR scientific_name LIKE ? OR image_query LIKE ?)`,
    );
    params.push(like, like, like, like);
  }

  const rows = await db.getAllAsync<HerbSummary>(
    `SELECT id, name_en, name_ur, scientific_name, category, image_url, image_query, source, is_favorite
     FROM herbs
     WHERE ${clauses.join(' OR ')}
     LIMIT 200`,
    params,
  );

  const termSet = new Set(terms.map((t) => t.toLowerCase()));
  const preferredLower = preferred.toLowerCase();

  const score = (item: HerbSummary): number => {
    const en = item.name_en.toLowerCase();
    const ur = item.name_ur;
    if (en === preferredLower || termSet.has(en) || termSet.has(ur)) return 0;
    if (en === q.toLowerCase() || ur === q) return 0;
    if (isGeneratedStyleName(item.name_en)) return 50 + item.name_en.length;
    if (en.startsWith(preferredLower) || en === `${preferredLower}s`) return 1;
    if (en.includes(preferredLower) && item.name_en.split(/\s+/).length <= 2) return 2;
    if (ur.includes(q) || termSet.has(ur)) return 3;
    return 20 + item.name_en.length;
  };

  const ranked = [...rows].sort((a, b) => {
    const sa = score(a);
    const sb = score(b);
    if (sa !== sb) return sa - sb;
    return a.name_en.length - b.name_en.length;
  });

  const exact = ranked.filter((item) => score(item) === 0);
  if (exact.length > 0) {
    // Real hit found (e.g. Almond) — do not bury it under Alpine Almond Seed…
    const cleanExtras = ranked
      .filter((item) => score(item) > 0 && score(item) < 20 && !isGeneratedStyleName(item.name_en))
      .slice(0, 4);
    const merged = [...exact, ...cleanExtras];
    const seen = new Set<number>();
    return merged
      .filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      })
      .slice(0, limit);
  }

  // No exact curated hit: still hide generated Alpine/Wild noise first.
  const clean = ranked.filter((item) => !isGeneratedStyleName(item.name_en));
  const fallback = clean.length ? clean : ranked;
  return fallback.slice(0, limit);
}

export async function getHerbById(id: number): Promise<Herb | null> {
  const db = await getDb();
  return (
    (await db.getFirstAsync<Herb>(`SELECT * FROM herbs WHERE id = ?`, [id])) ?? null
  );
}

export async function getHerbBySlug(slug: string): Promise<Herb | null> {
  const db = await getDb();
  return (
    (await db.getFirstAsync<Herb>(`SELECT * FROM herbs WHERE slug = ?`, [slug])) ?? null
  );
}

export async function getFavorites(): Promise<HerbSummary[]> {
  const db = await getDb();
  return db.getAllAsync<HerbSummary>(
    `SELECT id, name_en, name_ur, scientific_name, category, image_url, image_query, source, is_favorite
     FROM herbs WHERE is_favorite = 1 ORDER BY name_en`,
  );
}

export async function toggleFavorite(id: number): Promise<number> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ is_favorite: number }>(
    `SELECT is_favorite FROM herbs WHERE id = ?`,
    [id],
  );
  const next = row?.is_favorite ? 0 : 1;
  await db.runAsync(`UPDATE herbs SET is_favorite = ? WHERE id = ?`, [next, id]);
  return next;
}

export async function getFeatured(limit = 12): Promise<HerbSummary[]> {
  const db = await getDb();
  return db.getAllAsync<HerbSummary>(
    `SELECT id, name_en, name_ur, scientific_name, category, image_url, image_query, source, is_favorite
     FROM herbs
     WHERE source = 'local' AND id <= 40
     ORDER BY id
     LIMIT ?`,
    [limit],
  );
}

export async function getStats(): Promise<{ total: number; favorites: number; online: number }> {
  const db = await getDb();
  const total =
    (await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM herbs`))
      ?.count ?? 0;
  const favorites =
    (
      await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM herbs WHERE is_favorite = 1`,
      )
    )?.count ?? 0;
  const online =
    (
      await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM herbs WHERE source = 'online'`,
      )
    )?.count ?? 0;
  return { total, favorites, online };
}

export async function upsertOnlineHerb(input: {
  slug: string;
  name_en: string;
  name_ur: string;
  scientific_name: string;
  category: string;
  benefits_en: string;
  benefits_ur: string;
  harms_en: string;
  harms_ur: string;
  usage_en: string;
  usage_ur: string;
  image_url: string | null;
  image_query: string;
}): Promise<Herb> {
  const db = await getDb();
  const existing = await getHerbBySlug(input.slug);
  if (existing) {
    await db.runAsync(
      `UPDATE herbs SET
        name_en = ?, name_ur = ?, scientific_name = ?, category = ?,
        benefits_en = ?, benefits_ur = ?, harms_en = ?, harms_ur = ?,
        usage_en = ?, usage_ur = ?, image_url = COALESCE(?, image_url),
        image_query = ?, source = 'online'
       WHERE id = ?`,
      [
        input.name_en,
        input.name_ur,
        input.scientific_name,
        input.category,
        input.benefits_en,
        input.benefits_ur,
        input.harms_en,
        input.harms_ur,
        input.usage_en,
        input.usage_ur,
        input.image_url,
        input.image_query,
        existing.id,
      ],
    );
    return (await getHerbById(existing.id)) as Herb;
  }

  const result = await db.runAsync(
    `INSERT INTO herbs (
      slug, name_en, name_ur, scientific_name, category,
      benefits_en, benefits_ur, harms_en, harms_ur,
      usage_en, usage_ur, image_url, image_query, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'online')`,
    [
      input.slug,
      input.name_en,
      input.name_ur,
      input.scientific_name,
      input.category,
      input.benefits_en,
      input.benefits_ur,
      input.harms_en,
      input.harms_ur,
      input.usage_en,
      input.usage_ur,
      input.image_url,
      input.image_query,
    ],
  );

  return (await getHerbById(Number(result.lastInsertRowId))) as Herb;
}

export async function updateHerbImage(id: number, imageUrl: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`UPDATE herbs SET image_url = ? WHERE id = ?`, [imageUrl, id]);
}
