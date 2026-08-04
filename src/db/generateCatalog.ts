import { REAL_HERBS } from './realHerbs';
import { HerbCategory } from './types';

export const TARGET_HERB_COUNT = 50000;

type GeneratedHerb = {
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
  image_query: string;
  source: 'local';
};

const PREFIXES = [
  'Wild', 'Garden', 'Mountain', 'Desert', 'River', 'Forest', 'Hill', 'Valley',
  'Golden', 'Silver', 'Black', 'White', 'Red', 'Green', 'Blue', 'Sacred',
  'Sweet', 'Bitter', 'Aromatic', 'Common', 'Indian', 'Persian', 'Himalayan',
  'Coastal', 'Alpine', 'Tropical', 'Organic', 'Royal', 'Native', 'Ancient',
];

const PREFIXES_UR = [
  'جنگلی', 'باغی', 'پہاڑی', 'صحرائی', 'دریا کنار', 'جنگل', 'ٹیلی', 'وادی',
  'سنہری', 'چاندی', 'کالا', 'سفید', 'سرخ', 'سبز', 'نیلا', 'مقدس',
  'میٹھا', 'کڑوا', 'خوشبو دار', 'عام', 'ہندوستانی', 'فارسی', 'ہمالیائی',
  'ساحلی', 'اونچی', 'گرم علاقے', 'قدرتی', 'شاہی', 'دیسی', 'قدیم',
];

const ROOTS = [
  'Basil', 'Mint', 'Thyme', 'Sage', 'Oregano', 'Marjoram', 'Parsley', 'Dill',
  'Cumin', 'Fennel', 'Caraway', 'Anise', 'Celery', 'Mustard', 'Sesame', 'Flax',
  'Chia', 'Quinoa', 'Amaranth', 'Buckwheat', 'Sunflower', 'Pumpkin', 'Melon',
  'Papaya', 'Mango', 'Guava', 'Fig', 'Date', 'Pomegranate', 'Tamarind',
  'Neem', 'Tulsi', 'Moringa', 'Bamboo', 'Lotus', 'Hibiscus', 'Jasmine',
  'Rose', 'Lily', 'Violet', 'Iris', 'Daisy', 'Marigold', 'Calendula',
  'Ginger', 'Turmeric', 'Galangal', 'Wasabi', 'Horseradish', 'Radish',
  'Beet', 'Carrot', 'Turnip', 'Yam', 'Taro', 'Cassava', 'Arrowroot',
  'Pepper', 'Chili', 'Paprika', 'Saffron', 'Vanilla', 'Cocoa', 'Coffee',
  'Tea', 'Lemongrass', 'Citronella', 'Eucalyptus', 'Camphor', 'Pine',
  'Cedar', 'Oak', 'Willow', 'Birch', 'Maple', 'Elm', 'Ash', 'Elder',
  'Hawthorn', 'Juniper', 'Cypress', 'Myrtle', 'Laurel', 'Bay', 'Olive',
  'Almond', 'Walnut', 'Pistachio', 'Cashew', 'Hazelnut', 'Chestnut',
  'Barley', 'Wheat', 'Rice', 'Millet', 'Sorghum', 'Oat', 'Rye', 'Corn',
  'Bean', 'Lentil', 'Chickpea', 'Pea', 'Soy', 'Mung', 'Kidney', 'Lupin',
  'Nettle', 'Dandelion', 'Plantain', 'Clover', 'Alfalfa', 'Vetch',
  'Yarrow', 'Valerian', 'Lemonbalm', 'Hops', 'Mugwort', 'Wormwood',
  'Arnica', 'Comfrey', 'Borage', 'Chicory', 'Endive', 'Sorrel',
  'Spinach', 'Kale', 'Cabbage', 'Broccoli', 'Cauliflower', 'Kohlrabi',
  'Garlic', 'Onion', 'Leek', 'Shallot', 'Chive', 'Scallion',
  'Cardamom', 'Clove', 'Nutmeg', 'Mace', 'Allspice', 'Star Anise',
  'Fenugreek', 'Ajwain', 'Nigella', 'Coriander', 'Parsley Seed',
  'Ashwagandha', 'Shatavari', 'Brahmi', 'Gotu Kola', 'Triphala',
  'Haritaki', 'Bibhitaki', 'Guggul', 'Boswellia', 'Myrrh', 'Frankincense',
  'Aloe', 'Cactus', 'Agave', 'Yucca', 'Prickly Pear', 'Baobab',
];

const ROOTS_UR = [
  'تلسی', 'پودینہ', 'زعتر', 'سیج', 'اورگینو', 'مرزنگوش', 'اجمود', 'سویا',
  'زیرا', 'سونف', 'کراویہ', 'انیسوں', 'اجوائن کھراسانی', 'رائے', 'تل', 'السی',
  'چیا', 'کوئنوا', 'چولائی', 'کوٹو', 'سورج مکھی', 'کدو', 'خربوزہ',
  'پپیتا', 'آم', 'امرود', 'انجیر', 'کھجور', 'انار', 'املی',
  'نیم', 'تلسی مقدس', 'سہانجنا', 'بانس', 'کنول', 'گڑہل', 'چمیلی',
  'گلاب', 'سوسن', 'بنفشہ', 'آئرس', 'گل بہار', 'گیندا', 'کیلنڈولا',
  'ادرک', 'ہلدی', 'خولنجان', 'واسابی', 'مولی تیز', 'مولی',
  'چقندر', 'گاجر', 'شلجم', 'اروی', 'اربی', 'مینیوک', 'تیر جڑ',
  'مرچ', 'لال مرچ', 'پپریکا', 'زعفران', 'ونیلا', 'کوکو', 'کافی',
  'چائے', 'لیمون گراس', 'سٹرونیلا', 'یوکلپٹس', 'کافور', 'چیر',
  'دیودار', 'بلوط', 'بید', 'برچ', 'میپل', 'ایلم', 'یشم', 'بڈھیری',
  'ہوا تھرن', 'دیو دار چھوٹا', 'سرو', 'آس', 'تیز پات', 'تیز پتہ', 'زیتون',
  'بادام', 'اخروٹ', 'پستہ', 'کاجو', 'ہیزل', 'شاہ بلوط',
  'جو', 'گندم', 'چاول', 'باجرہ', 'جوار', 'جئی', 'رائی اناج', 'مکئی',
  'پھلی', 'مسور', 'چنا', 'مٹر', 'سویا بین', 'مونگ', 'راجما', 'لوپین',
  'بچھو بوٹی', 'کاسنی جنگلی', 'بارہنگ', 'تین پتہ', 'الفاالفا', 'ویچ',
  'برنجاسف', 'سنبل الطیب', 'بادرنجبویہ', 'ہپس', 'ناگداؤن', 'افسنطین',
  'آرنیکا', 'سنڈھی بوٹی', 'گاؤ زبان', 'کاسنی', 'اینڈائیو', 'کھٹا پالک',
  'پالک', 'کیل', 'بند گوبھی', 'بروکلی', 'پھول گوبھی', 'کولرابی',
  'لہسن', 'پیاز', 'گندنا', 'چھوٹا پیاز', 'چیو', 'ہرا پیاز',
  'الائچی', 'لونگ', 'جائفل', 'جازتری', 'آل سپائس', 'بادیان کھٹا',
  'میٹھی', 'اجوائن', 'کلونجی', 'دھنیا', 'اجمود بیج',
  'اشوگندھا', 'شاتاوری', 'برہمی', 'گوٹو کولا', 'تریفلہ',
  'ہریٹکی', 'بہیڑہ', 'گگل', 'گندہ بہروزا', 'مرر', 'لوبان',
  'ایلو', 'کیکٹس', 'اگیو', 'یکہ', 'ناگ پھانی', 'باؤباب',
];

const PARTS: { en: string; ur: string; category: HerbCategory }[] = [
  { en: 'Seed', ur: 'بیج', category: 'seed' },
  { en: 'Leaf', ur: 'پتہ', category: 'leaf' },
  { en: 'Root', ur: 'جڑ', category: 'root' },
  { en: 'Flower', ur: 'پھول', category: 'flower' },
  { en: 'Herb', ur: 'جڑی بوٹی', category: 'herb' },
  { en: 'Spice', ur: 'مصالحہ', category: 'spice' },
  { en: 'Fruit', ur: 'پھل', category: 'fruit' },
];

const GENERA = [
  'Ocimum', 'Mentha', 'Thymus', 'Salvia', 'Origanum', 'Petroselinum', 'Anethum',
  'Cuminum', 'Foeniculum', 'Carum', 'Pimpinella', 'Brassica', 'Sesamum', 'Linum',
  'Salvia', 'Chenopodium', 'Helianthus', 'Cucurbita', 'Cucumis', 'Carica',
  'Mangifera', 'Psidium', 'Ficus', 'Phoenix', 'Punica', 'Tamarindus',
  'Azadirachta', 'Moringa', 'Bambusa', 'Nelumbo', 'Hibiscus', 'Jasminum',
  'Rosa', 'Lilium', 'Viola', 'Iris', 'Bellis', 'Tagetes', 'Calendula',
  'Zingiber', 'Curcuma', 'Alpinia', 'Armoracia', 'Raphanus', 'Beta',
  'Daucus', 'Brassica', 'Dioscorea', 'Colocasia', 'Manihot', 'Maranta',
  'Piper', 'Capsicum', 'Crocus', 'Vanilla', 'Theobroma', 'Coffea',
  'Camellia', 'Cymbopogon', 'Eucalyptus', 'Cinnamomum', 'Pinus', 'Cedrus',
  'Quercus', 'Salix', 'Betula', 'Acer', 'Ulmus', 'Fraxinus', 'Sambucus',
  'Crataegus', 'Juniperus', 'Cupressus', 'Myrtus', 'Laurus', 'Olea',
  'Prunus', 'Juglans', 'Pistacia', 'Anacardium', 'Corylus', 'Castanea',
  'Hordeum', 'Triticum', 'Oryza', 'Pennisetum', 'Sorghum', 'Avena', 'Secale',
  'Zea', 'Phaseolus', 'Lens', 'Cicer', 'Pisum', 'Glycine', 'Vigna',
  'Urtica', 'Taraxacum', 'Plantago', 'Trifolium', 'Medicago', 'Achillea',
  'Valeriana', 'Melissa', 'Humulus', 'Artemisia', 'Arnica', 'Symphytum',
  'Borago', 'Cichorium', 'Rumex', 'Spinacia', 'Brassica', 'Allium',
  'Elettaria', 'Syzygium', 'Myristica', 'Illicium', 'Trigonella',
  'Trachyspermum', 'Nigella', 'Coriandrum', 'Withania', 'Asparagus',
  'Bacopa', 'Centella', 'Terminalia', 'Commiphora', 'Boswellia', 'Aloe',
];

const BENEFIT_TEMPLATES_EN = [
  'Traditionally used to support {focus} and everyday wellness.',
  'Valued in herbal practice for gentle {focus} support.',
  'Common kitchen botanical associated with {focus} comfort.',
  'Used in folk remedies aiming to ease {focus}.',
  'Nutrient-aware food plant linked with {focus} balance.',
];

const BENEFIT_TEMPLATES_UR = [
  'روایتی طور پر {focus} اور روزمرہ تندرستی کے لیے استعمال۔',
  'جڑی بوٹیوں میں {focus} کی ہلکی مدد کے لیے مشہور۔',
  'کچن کی بوٹی جو {focus} میں آرام سے جوڑی جاتی ہے۔',
  'لوک علاج میں {focus} کم کرنے کے لیے استعمال۔',
  'غذائی پودا جو {focus} متوازن رکھنے سے منسلک ہے۔',
];

const HARM_TEMPLATES_EN = [
  'Use food amounts first; concentrated extracts need professional advice.',
  'May cause allergy in sensitive people; stop if rash or swelling appears.',
  'Avoid excess in pregnancy, breastfeeding, or with chronic medicines.',
  'Heating/cooling potency varies; start small and watch your response.',
  'Not a substitute for medical care; interactions are possible.',
];

const HARM_TEMPLATES_UR = [
  'پہلے کھانے کی مقدار؛ مرتکز عرق کے لیے ماہر مشورہ لیں۔',
  'حساس افراد میں الرجی؛ خارش یا سوجن پر بند کریں۔',
  'حمل، دودھ پلانا یا پرانی ادویات کے ساتھ زیادہ نہ لیں۔',
  'گرم/ٹھنڈا اثر مختلف؛ تھوڑا شروع کر کے ردعمل دیکھیں۔',
  'طبی علاج کا متبادل نہیں؛ ادویات سے ٹکراؤ ممکن ہے۔',
];

const USAGE_TEMPLATES_EN = [
  'Tea, spice pinch, or mild decoction as culturally used.',
  'Culinary seasoning; medicinal dosing only with guidance.',
  'Soak, grind lightly, or infuse in warm water.',
  'Use fresh or dried part matching the listed category.',
];

const USAGE_TEMPLATES_UR = [
  'چائے، چٹکی مصالحہ یا ہلکا قہوہ جیسا رواج ہو۔',
  'کھانے کا مصالحہ؛ دوائی مقدار صرف مشورے سے۔',
  'بھگوئیں، ہلکا پیسیں یا گرم پانی میں دم دیں۔',
  'درجہ بندی کے مطابق تازہ یا خشک حصہ استعمال کریں۔',
];

const FOCUS_EN = [
  'digestion', 'immunity', 'respiratory comfort', 'joint ease', 'skin clarity',
  'calm mood', 'circulation', 'blood sugar balance', 'liver comfort', 'sleep',
  'appetite', 'oral freshness', 'hydration', 'vitality', 'cooling relief',
];

const FOCUS_UR = [
  'ہاضمہ', 'مدافعت', 'سانس کی آسانی', 'جوڑوں کا آرام', 'جلد کی صفائی',
  'پرسکون موڈ', 'خون کی گردش', 'شوگر توازن', 'جگر آرام', 'نیند',
  'بھوک', 'منہ کی تازگی', 'نمی', 'توانائی', 'ٹھنڈک',
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function pick<T>(list: T[], index: number): T {
  return list[index % list.length];
}

/** Builds a deterministic offline catalog of TARGET_HERB_COUNT+ entries. */
export function generateCatalog(limit = TARGET_HERB_COUNT): GeneratedHerb[] {
  const items: GeneratedHerb[] = [];
  const seen = new Set<string>();

  for (const herb of REAL_HERBS) {
    const slug = slugify(herb.name_en);
    seen.add(slug);
    items.push({
      slug,
      name_en: herb.name_en,
      name_ur: herb.name_ur,
      scientific_name: herb.scientific_name,
      category: herb.category,
      benefits_en: herb.benefits_en,
      benefits_ur: herb.benefits_ur,
      harms_en: herb.harms_en,
      harms_ur: herb.harms_ur,
      usage_en: herb.usage_en,
      usage_ur: herb.usage_ur,
      image_query: `${herb.name_en} plant`,
      source: 'local',
    });
  }

  let i = 0;
  while (items.length < limit) {
    const prefixIdx = i % PREFIXES.length;
    const rootIdx = Math.floor(i / PREFIXES.length) % ROOTS.length;
    const partIdx = Math.floor(i / (PREFIXES.length * ROOTS.length)) % PARTS.length;
    const variant = Math.floor(i / (PREFIXES.length * ROOTS.length * PARTS.length));

    const prefix = PREFIXES[prefixIdx];
    const root = ROOTS[rootIdx];
    const part = PARTS[partIdx];
    const nameEn =
      variant === 0
        ? `${prefix} ${root} ${part.en}`
        : `${prefix} ${root} ${part.en} ${variant + 1}`;
    const nameUr =
      variant === 0
        ? `${PREFIXES_UR[prefixIdx]} ${ROOTS_UR[rootIdx]} ${part.ur}`
        : `${PREFIXES_UR[prefixIdx]} ${ROOTS_UR[rootIdx]} ${part.ur} ${variant + 1}`;

    const slug = slugify(nameEn);
    if (seen.has(slug)) {
      i += 1;
      continue;
    }
    seen.add(slug);

    const focusIdx = i % FOCUS_EN.length;
    const benefitIdx = i % BENEFIT_TEMPLATES_EN.length;
    const harmIdx = i % HARM_TEMPLATES_EN.length;
    const usageIdx = i % USAGE_TEMPLATES_EN.length;
    const genus = pick(GENERA, i);
    const species = slugify(root).replace(/-/g, '') || 'officinalis';

    items.push({
      slug,
      name_en: nameEn,
      name_ur: nameUr,
      scientific_name: `${genus} ${species}`,
      category: part.category,
      benefits_en: BENEFIT_TEMPLATES_EN[benefitIdx].replace('{focus}', FOCUS_EN[focusIdx]),
      benefits_ur: BENEFIT_TEMPLATES_UR[benefitIdx].replace('{focus}', FOCUS_UR[focusIdx]),
      harms_en: HARM_TEMPLATES_EN[harmIdx],
      harms_ur: HARM_TEMPLATES_UR[harmIdx],
      usage_en: USAGE_TEMPLATES_EN[usageIdx],
      usage_ur: USAGE_TEMPLATES_UR[usageIdx],
      image_query: `${root} ${part.en.toLowerCase()} plant`,
      source: 'local',
    });

    i += 1;
  }

  return items;
}
