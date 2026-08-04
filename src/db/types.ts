export type Language = 'en' | 'ur';

export type HerbCategory =
  | 'herb'
  | 'seed'
  | 'spice'
  | 'root'
  | 'flower'
  | 'leaf'
  | 'fruit';

export interface Herb {
  id: number;
  slug: string;
  name_en: string;
  name_ur: string;
  scientific_name: string;
  category: HerbCategory;
  benefits_en: string;
  benefits_ur: string;
  harms_en: string;
  harms_ur: string;
  usage_en: string;
  usage_ur: string;
  image_url: string | null;
  image_query: string;
  source: 'local' | 'online';
  is_favorite: number;
  created_at: string;
}

export interface HerbSummary {
  id: number;
  name_en: string;
  name_ur: string;
  scientific_name: string;
  category: HerbCategory;
  image_url: string | null;
  image_query: string;
  source: 'local' | 'online';
  is_favorite: number;
}
