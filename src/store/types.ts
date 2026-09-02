import type { Product } from '@/data/types';

export type CartItem = {
  /** Stable composite key: a product in a given colour and size. */
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
};

export type AddToCartInput = {
  product: Product;
  color: string;
  size: string;
  quantity?: number;
};

export const cartItemKey = (productId: string, color: string, size: string) =>
  `${productId}::${color}::${size}`;
