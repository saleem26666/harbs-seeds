/** Known Wikipedia / Commons page titles for reliable herb photos. */
export const IMAGE_PAGE_TITLES: Record<string, string[]> = {
  Ajwain: ['Ajwain', 'Trachyspermum ammi', 'Carom seed', 'Ajowan'],
  Ginger: ['Ginger', 'Zingiber officinale'],
  Turmeric: ['Turmeric', 'Curcuma longa'],
  Tulsi: ['Ocimum tenuiflorum', 'Holy basil', 'Tulsi'],
  Basil: ['Basil', 'Ocimum basilicum'],
  'Fennel Seed': ['Fennel', 'Foeniculum vulgare'],
  Fennel: ['Fennel', 'Foeniculum vulgare'],
  'Cumin Seed': ['Cumin', 'Cuminum cyminum'],
  Cumin: ['Cumin', 'Cuminum cyminum'],
  'Black Seed': ['Nigella sativa', 'Black seed'],
  Fenugreek: ['Fenugreek', 'Trigonella foenum-graecum'],
  Coriander: ['Coriander', 'Coriandrum sativum'],
  Mint: ['Spearmint', 'Mentha spicata', 'Mint'],
  Peppermint: ['Peppermint', 'Mentha × piperita'],
  Cardamom: ['Cardamom', 'Elettaria cardamomum', 'Green cardamom'],
  Clove: ['Clove', 'Syzygium aromaticum'],
  Cinnamon: ['Cinnamon', 'Cinnamomum verum'],
  Garlic: ['Garlic', 'Allium sativum'],
  Neem: ['Azadirachta indica', 'Neem'],
  'Aloe Vera': ['Aloe vera'],
  Ashwagandha: ['Withania somnifera', 'Ashwagandha'],
  Moringa: ['Moringa oleifera', 'Moringa'],
  'Sesame Seed': ['Sesame', 'Sesamum indicum'],
  'Flax Seed': ['Flax', 'Linum usitatissimum'],
  'Pumpkin Seed': ['Pumpkin seed', 'Cucurbita pepo'],
  'Chia Seed': ['Chia seed', 'Salvia hispanica'],
  Saffron: ['Saffron', 'Crocus sativus'],
  Rose: ['Rosa damascena', 'Damask rose', 'Rose'],
  Lemongrass: ['Cymbopogon citratus', 'Lemongrass'],
  Thyme: ['Thyme', 'Thymus vulgaris'],
  Rosemary: ['Rosemary', 'Salvia rosmarinus'],
  Sage: ['Salvia officinalis', 'Sage'],
  Chamomile: ['Matricaria chamomilla', 'Chamomile'],
  Lavender: ['Lavandula', 'Lavender'],
  'Mustard Seed': ['Mustard seed', 'Brassica juncea'],
  'Poppy Seed': ['Poppy seed', 'Papaver somniferum'],
  'Anise Seed': ['Anise', 'Pimpinella anisum'],
  'Dill Seed': ['Dill', 'Anethum graveolens'],
  Henna: ['Henna', 'Lawsonia inermis'],
  Amla: ['Phyllanthus emblica', 'Indian gooseberry', 'Amla'],
  'Black Pepper': ['Black pepper', 'Piper nigrum'],
  'Onion Seed': ['Onion', 'Allium cepa'],
  Almond: ['Almond', 'Prunus dulcis', 'Almond tree'],
  Walnut: ['Walnut', 'Juglans regia'],
  Pistachio: ['Pistachio', 'Pistacia vera'],
  Cashew: ['Cashew', 'Anacardium occidentale'],
};

export function buildImageCandidates(
  imageQuery: string,
  nameEn?: string,
  scientificName?: string,
): string[] {
  const raw = imageQuery.replace(/\s+plant$/i, '').trim();
  const name = (nameEn || raw).trim();
  const known = IMAGE_PAGE_TITLES[name] ?? IMAGE_PAGE_TITLES[raw] ?? [];

  const candidates = [
    ...known,
    name,
    raw,
    scientificName,
    `${name} seed`,
    `${name} spice`,
    `${name} herb`,
  ].filter((v): v is string => Boolean(v && v.trim()));

  return [...new Set(candidates)];
}

/** Prefer a larger Wikimedia thumbnail when possible. */
export function upgradeThumbUrl(url: string): string {
  return url.replace(/\/\d+px-/i, '/800px-');
}
