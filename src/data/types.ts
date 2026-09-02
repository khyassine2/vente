export type CategorySlug =
  | 'nouveautes'
  | 'chemises'
  | 'mailles'
  | 'vestes'
  | 'pantalons'
  | 'robes'
  | 'accessoires';

export type Category = {
  slug: CategorySlug;
  label: string;
  /** Short line shown under the title on the collections page. */
  tagline: string;
  image: string;
};

export type ProductColor = {
  name: string;
  hex: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  /** Set only when the piece is discounted; drives the struck-through price. */
  compareAtPrice?: number;
  colors: ProductColor[];
  sizes: string[];
  categories: CategorySlug[];
  /** At least two shots: the second is revealed on hover. */
  images: [string, string, ...string[]];
  description: string;
  details: string[];
  fabric: string;
  isNew: boolean;
};

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';
