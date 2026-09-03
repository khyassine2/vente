import type { ProductColor } from '@/data/types';

/**
 * The three size scales the catalogue uses. Grouped so the admin picks from a
 * scale instead of typing a free-form list that has to match existing rows.
 */
export const SIZE_SCALES = [
  { label: 'Vêtements', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { label: 'Numériques', sizes: ['36', '38', '40', '42', '44'] },
  { label: 'Unique', sizes: ['Taille unique'] },
];

/** Every size across the scales, in scale order, for validating a draft. */
export const ALL_SIZES = SIZE_SCALES.flatMap(scale => scale.sizes);

/** The house palette — keeps hex values consistent across products. */
export const PRESET_COLORS: ProductColor[] = [
  { name: 'Écru', hex: '#efe9dd' },
  { name: 'Blanc', hex: '#faf7f2' },
  { name: 'Avoine', hex: '#ded6ca' },
  { name: 'Sable', hex: '#e3d5c1' },
  { name: 'Sauge', hex: '#5d7367' },
  { name: 'Forêt', hex: '#1f3d33' },
  { name: 'Terracotta', hex: '#b5563c' },
  { name: 'Cognac', hex: '#8a5a3b' },
  { name: 'Encre', hex: '#14201b' },
];
