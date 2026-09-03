import type { Category } from '@/data/types';

/** Fixed taxonomy — not database-backed, matches the storefront navigation. */
export const CATEGORIES: Category[] = [
  {
    slug: 'nouveautes',
    label: 'Nouveautés',
    tagline: 'Les dernières pièces sorties de l\'atelier',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
  },
  {
    slug: 'chemises',
    label: 'Chemises',
    tagline: 'Popelines et lins, coupées près du corps',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c',
  },
  {
    slug: 'mailles',
    label: 'Mailles',
    tagline: 'Laines et cotons tricotés en petites séries',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d',
  },
  {
    slug: 'vestes',
    label: 'Vestes',
    tagline: 'Des pièces d\'épaule qui structurent la silhouette',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
  },
  {
    slug: 'pantalons',
    label: 'Pantalons',
    tagline: 'Tombés nets, du matin au soir',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a',
  },
  {
    slug: 'robes',
    label: 'Robes',
    tagline: 'Une seule pièce, rien à assortir',
    image: 'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891',
  },
  {
    slug: 'accessoires',
    label: 'Accessoires',
    tagline: 'Ce qui termine une tenue',
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26',
  },
];

export const findCategory = (slug: string) =>
  CATEGORIES.find(category => category.slug === slug);
