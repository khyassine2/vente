import type { Category, Product } from '@/data/types';

/** Unsplash source id; widths are appended per breakpoint by `imageUrl`. */
const photo = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const CATEGORIES: Category[] = [
  {
    slug: 'nouveautes',
    label: 'Nouveautés',
    tagline: 'Les dernières pièces sorties de l\'atelier',
    image: photo('1490481651871-ab68de25d43d'),
  },
  {
    slug: 'chemises',
    label: 'Chemises',
    tagline: 'Popelines et lins, coupées près du corps',
    image: photo('1596755094514-f87e34085b2c'),
  },
  {
    slug: 'mailles',
    label: 'Mailles',
    tagline: 'Laines et cotons tricotés en petites séries',
    image: photo('1611652022419-a9419f74343d'),
  },
  {
    slug: 'vestes',
    label: 'Vestes',
    tagline: 'Des pièces d\'épaule qui structurent la silhouette',
    image: photo('1551028719-00167b16eac5'),
  },
  {
    slug: 'pantalons',
    label: 'Pantalons',
    tagline: 'Tombés nets, du matin au soir',
    image: photo('1473966968600-fa801b869a1a'),
  },
  {
    slug: 'robes',
    label: 'Robes',
    tagline: 'Une seule pièce, rien à assortir',
    image: photo('1490114538077-0a7f8cb49891'),
  },
  {
    slug: 'accessoires',
    label: 'Accessoires',
    tagline: 'Ce qui termine une tenue',
    image: photo('1601924994987-69e26d50dc26'),
  },
];

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const BOTTOM_SIZES = ['36', '38', '40', '42', '44'];
const ONE_SIZE = ['Taille unique'];

export const PRODUCTS: Product[] = [
  {
    id: 'f-01',
    slug: 'chemise-lin-tanger',
    name: 'Chemise en lin Tanger',
    price: 449,
    colors: [
      { name: 'Écru', hex: '#efe9dd' },
      { name: 'Forêt', hex: '#1f3d33' },
      { name: 'Terracotta', hex: '#b5563c' },
    ],
    sizes: APPAREL_SIZES,
    categories: ['nouveautes', 'chemises'],
    images: [
      photo('1596755094514-f87e34085b2c'),
      photo('1594633312681-425c7b97ccd1'),
      photo('1602810318383-e386cc2a3ccf'),
    ],
    description:
      'Un lin lavé qui tombe droit sans jamais coller, tissé pour les mois où l\'air ne bouge plus. Le col reste souple, les manches se retroussent et gardent leur pli.',
    details: [
      'Coupe droite, emmanchure basse',
      'Boutons en corozo teintés à la main',
      'Ourlet arrondi, portable dedans ou dehors',
    ],
    fabric: '100% lin lavé, 160 g/m²',
    isNew: true,
  },
  {
    id: 'f-02',
    slug: 'veste-atelier-rabat',
    name: 'Veste d\'atelier Rabat',
    price: 890,
    colors: [
      { name: 'Forêt', hex: '#1f3d33' },
      { name: 'Sable', hex: '#e3d5c1' },
    ],
    sizes: APPAREL_SIZES,
    categories: ['nouveautes', 'vestes'],
    images: [
      photo('1551028719-00167b16eac5'),
      photo('1592878904946-b3cd8ae243d0'),
      photo('1548126032-079a0fb0099d'),
    ],
    description:
      'La veste de travail française, reprise en coton serré et montée sans doublure. Trois poches plaquées, une épaule franche, et une teinte qui se patine au fil des lavages.',
    details: [
      'Coton sergé teint en pièce',
      'Trois poches plaquées, une intérieure',
      'Coutures rabattues, sans doublure',
    ],
    fabric: '100% coton sergé, 320 g/m²',
    isNew: true,
  },
  {
    id: 'f-03',
    slug: 'pull-maille-cedre',
    name: 'Pull en maille Cèdre',
    price: 690,
    compareAtPrice: 850,
    colors: [
      { name: 'Avoine', hex: '#ded6ca' },
      { name: 'Encre', hex: '#14201b' },
    ],
    sizes: APPAREL_SIZES,
    categories: ['mailles'],
    images: [
      photo('1611652022419-a9419f74343d'),
      photo('1620799140408-edc6dcb6d633'),
      photo('1611312449408-fcece27cdbb7'),
    ],
    description:
      'Une maille côtelée en laine mérinos, tricotée en jauge moyenne pour tenir sa forme aux coudes et aux poignets. Elle se porte à même la peau sans gratter.',
    details: [
      'Col rond bordé côtelé',
      'Tricoté en jauge 7, sans couture d\'épaule',
      'Lavable à la main, séchage à plat',
    ],
    fabric: '100% laine mérinos extra-fine',
    isNew: false,
  },
  {
    id: 'f-04',
    slug: 'pantalon-fluide-oasis',
    name: 'Pantalon fluide Oasis',
    price: 590,
    colors: [
      { name: 'Encre', hex: '#14201b' },
      { name: 'Sable', hex: '#e3d5c1' },
      { name: 'Sauge', hex: '#5d7367' },
    ],
    sizes: BOTTOM_SIZES,
    categories: ['nouveautes', 'pantalons'],
    images: [
      photo('1473966968600-fa801b869a1a'),
      photo('1594633313593-bab3825d0caf'),
      photo('1624378439575-d8705ad7ae80'),
    ],
    description:
      'Une jambe large qui tombe d\'un seul trait depuis la hanche, taille haute tenue par une ceinture nervurée. Le tissu bouge sans se froisser à chaque pas.',
    details: [
      'Taille haute, passants larges',
      'Deux poches italiennes, une poche dos',
      'Jambe large, ourlet non fini au choix',
    ],
    fabric: '68% lyocell, 32% lin',
    isNew: true,
  },
  {
    id: 'f-05',
    slug: 'robe-longue-sahara',
    name: 'Robe longue Sahara',
    price: 790,
    colors: [
      { name: 'Terracotta', hex: '#b5563c' },
      { name: 'Écru', hex: '#efe9dd' },
    ],
    sizes: APPAREL_SIZES,
    categories: ['nouveautes', 'robes'],
    images: [
      photo('1490114538077-0a7f8cb49891'),
      photo('1483118714900-540cf339fd46'),
      photo('1595777457583-95e059d581b8'),
    ],
    description:
      'Une colonne de tissu retenue à la taille par une ceinture nouée. Elle se met le matin et se porte jusqu\'au soir sans jamais demander d\'ajustement.',
    details: [
      'Manches trois-quarts légèrement bouffantes',
      'Ceinture amovible en même tissu',
      'Doublure courte sur le buste',
    ],
    fabric: '55% lin, 45% viscose',
    isNew: true,
  },
  {
    id: 'f-06',
    slug: 'chemise-popeline-essaouira',
    name: 'Chemise popeline Essaouira',
    price: 420,
    colors: [
      { name: 'Blanc', hex: '#faf7f2' },
      { name: 'Sauge', hex: '#5d7367' },
    ],
    sizes: APPAREL_SIZES,
    categories: ['chemises'],
    images: [
      photo('1602810318383-e386cc2a3ccf'),
      photo('1596755094514-f87e34085b2c'),
      photo('1607345366928-199ea26cfe3e'),
    ],
    description:
      'La chemise blanche qu\'on reprend chaque semaine. Popeline de coton à armure serrée, col italien qui tient ouvert comme fermé.',
    details: [
      'Col italien à pointes courtes',
      'Poignets une bouton, plis d\'aisance',
      'Coutures anglaises sur les côtés',
    ],
    fabric: '100% coton popeline, 120 g/m²',
    isNew: false,
  },
  {
    id: 'f-07',
    slug: 'gilet-maille-medina',
    name: 'Gilet en maille Medina',
    price: 540,
    colors: [
      { name: 'Sable', hex: '#e3d5c1' },
      { name: 'Forêt', hex: '#1f3d33' },
    ],
    sizes: APPAREL_SIZES,
    categories: ['mailles'],
    images: [
      photo('1620799140408-edc6dcb6d633'),
      photo('1611652022419-a9419f74343d'),
      photo('1591047139829-d91aecb6caea'),
    ],
    description:
      'Un gilet sans manches à porter sur une chemise quand la nuit tombe. Encolure en V profonde, emmanchures bordées pour ne pas bâiller.',
    details: [
      'Encolure V, bord-côtes assortis',
      'Cinq boutons en nacre',
      'Coupe près du corps',
    ],
    fabric: '85% coton, 15% laine',
    isNew: false,
  },
  {
    id: 'f-08',
    slug: 'manteau-long-cachemire',
    name: 'Manteau long Cachemire',
    price: 1890,
    colors: [
      { name: 'Avoine', hex: '#ded6ca' },
      { name: 'Encre', hex: '#14201b' },
    ],
    sizes: APPAREL_SIZES,
    categories: ['vestes'],
    images: [
      photo('1539533018447-63fcce2678e3'),
      photo('1608234808654-2a8875faa7fd'),
      photo('1551163943-3f6a855d1153'),
    ],
    description:
      'Un manteau droit qui descend sous le genou, taillé dans un drap de laine mêlé de cachemire. Il se ferme par deux boutons et garde son aplomb sur le cintre comme sur l\'épaule.',
    details: [
      'Deux boutons, revers cranté',
      'Doublure cupro sur tout le corps',
      'Fente dos centrale',
    ],
    fabric: '80% laine, 20% cachemire',
    isNew: false,
  },
  {
    id: 'f-09',
    slug: 'pantalon-droit-souk',
    name: 'Pantalon droit Souk',
    price: 520,
    colors: [
      { name: 'Sauge', hex: '#5d7367' },
      { name: 'Encre', hex: '#14201b' },
      { name: 'Sable', hex: '#e3d5c1' },
    ],
    sizes: BOTTOM_SIZES,
    categories: ['pantalons'],
    images: [
      photo('1624378439575-d8705ad7ae80'),
      photo('1473966968600-fa801b869a1a'),
      photo('1584370848010-d7fe6bc767ec'),
    ],
    description:
      'Une jambe droite qui casse juste sur la chaussure. Le coton est assez dense pour marquer le pli, assez souple pour s\'asseoir sans y penser.',
    details: [
      'Taille mi-haute, braguette zippée',
      'Pli marqué permanent',
      'Ourlet 4 cm, retouche possible',
    ],
    fabric: '98% coton, 2% élasthanne',
    isNew: false,
  },
  {
    id: 'f-10',
    slug: 'echarpe-laine-atlas',
    name: 'Écharpe en laine Atlas',
    price: 290,
    colors: [
      { name: 'Terracotta', hex: '#b5563c' },
      { name: 'Avoine', hex: '#ded6ca' },
      { name: 'Forêt', hex: '#1f3d33' },
    ],
    sizes: ONE_SIZE,
    categories: ['accessoires'],
    images: [
      photo('1601924994987-69e26d50dc26'),
      photo('1520903920243-00d872a2d1c9'),
      photo('1457545195570-67f207084966'),
    ],
    description:
      'Deux mètres de laine tissée dans les montagnes, à franges nouées une à une. Assez large pour se porter en châle sur les épaules.',
    details: [
      'Tissée sur métier traditionnel',
      '200 × 45 cm, franges nouées main',
      'Chaque pièce varie légèrement',
    ],
    fabric: '100% laine des montagnes',
    isNew: false,
  },
  {
    id: 'f-11',
    slug: 'blouse-manches-longues-ourika',
    name: 'Blouse Ourika',
    price: 460,
    colors: [
      { name: 'Écru', hex: '#efe9dd' },
      { name: 'Sauge', hex: '#5d7367' },
    ],
    sizes: APPAREL_SIZES,
    categories: ['chemises', 'nouveautes'],
    images: [
      photo('1594633312681-425c7b97ccd1'),
      photo('1490481651871-ab68de25d43d'),
      photo('1485231183945-fffde7cc051e'),
    ],
    description:
      'Une blouse ample resserrée aux poignets, avec une fronce discrète sous l\'empiècement d\'épaule. Elle rentre dans une taille haute sans faire d\'épaisseur.',
    details: [
      'Empiècement d\'épaule fronçé',
      'Poignets boutonnés',
      'Col montant sans pied',
    ],
    fabric: '100% coton voile',
    isNew: true,
  },
  {
    id: 'f-12',
    slug: 'ceinture-cuir-fes',
    name: 'Ceinture en cuir Fès',
    price: 340,
    colors: [
      { name: 'Cognac', hex: '#8a5a3b' },
      { name: 'Encre', hex: '#14201b' },
    ],
    sizes: BOTTOM_SIZES,
    categories: ['accessoires'],
    images: [
      photo('1624222247344-550fb60583dc'),
      photo('1553062407-98eeb64c6a62'),
      photo('1506629082955-511b1aa562c8'),
    ],
    description:
      'Cuir tanné à l\'écorce, coupé dans une seule bande et cousu au fil de lin. La boucle en laiton brossé se ternit doucement.',
    details: [
      'Cuir pleine fleur tanné végétal',
      'Boucle laiton massif brossé',
      'Largeur 3 cm',
    ],
    fabric: 'Cuir de vachette tanné végétal',
    isNew: false,
  },
];

/** Looks a product up by its URL slug. */
export const findProduct = (slug: string) =>
  PRODUCTS.find(product => product.slug === slug);

export const findCategory = (slug: string) =>
  CATEGORIES.find(category => category.slug === slug);

/**
 * Pieces sharing a category with the given product, falling back to the rest
 * of the catalogue so the row is never short.
 */
export const relatedProducts = (product: Product, count = 4) => {
  const others = PRODUCTS.filter(item => item.id !== product.id);
  const sameCategory = others.filter(item =>
    item.categories.some(slug => product.categories.includes(slug)),
  );
  const rest = others.filter(item => !sameCategory.includes(item));

  return [...sameCategory, ...rest].slice(0, count);
};
