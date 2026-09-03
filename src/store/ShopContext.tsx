'use client';

import type { AddToCartInput, CartItem } from '@/store/types';
import { createContext, use, useEffect, useState } from 'react';
import { readStorage, writeStorage } from '@/utils/storage';
import { cartItemKey } from '@/store/types';

const CART_KEY = 'fil-et-ligne:cart';
const WISHLIST_KEY = 'fil-et-ligne:wishlist';

/** Caps a line so a hand-edited storage entry cannot order 10 000 pieces. */
const MAX_QUANTITY = 20;

const clampQuantity = (quantity: number) =>
  Math.min(Math.max(Math.round(quantity), 1), MAX_QUANTITY);

/**
 * Storage is user-editable and may predate the current shape, so every line is
 * re-checked before it reaches the cart.
 */
const readCart = () =>
  readStorage<CartItem[]>(CART_KEY, []).filter(
    (item): item is CartItem =>
      typeof item?.key === 'string'
      && typeof item.price === 'number'
      && Number.isFinite(item.price)
      && Number.isFinite(item.quantity),
  ).map(item => ({ ...item, quantity: clampQuantity(item.quantity) }));

type ShopValue = {
  items: CartItem[];
  wishlist: string[];
  count: number;
  subtotal: number;
  addToCart: (input: AddToCartInput) => void;
  removeFromCart: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
};

export const ShopContext = createContext<ShopValue | null>(null);

export const ShopProvider = (props: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(readCart);
  const [wishlist, setWishlist] = useState<string[]>(() =>
    readStorage<string[]>(WISHLIST_KEY, []).filter(
      id => typeof id === 'string',
    ),
  );

  useEffect(() => {
    writeStorage(CART_KEY, items);
  }, [items]);

  useEffect(() => {
    writeStorage(WISHLIST_KEY, wishlist);
  }, [wishlist]);

  const addToCart = (input: AddToCartInput) => {
    const { product, color, size } = input;
    const quantity = input.quantity ?? 1;
    const key = cartItemKey(product.id, color, size);

    setItems((current) => {
      const existing = current.find(item => item.key === key);

      if (existing) {
        return current.map(item =>
          item.key === key
            ? { ...item, quantity: clampQuantity(item.quantity + quantity) }
            : item,
        );
      }

      return [
        ...current,
        {
          key,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images[0],
          color,
          size,
          quantity: clampQuantity(quantity),
        },
      ];
    });
  };

  const removeFromCart = (key: string) => {
    setItems(current => current.filter(item => item.key !== key));
  };

  const setQuantity = (key: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(key);
      return;
    }

    setItems(current =>
      current.map(item =>
        item.key === key ? { ...item, quantity: clampQuantity(quantity) } : item,
      ),
    );
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(current =>
      current.includes(productId)
        ? current.filter(id => id !== productId)
        : [...current, productId],
    );
  };

  const value: ShopValue = {
    items,
    wishlist,
    count: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ),
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart: () => setItems([]),
    toggleWishlist,
    isWishlisted: (productId: string) => wishlist.includes(productId),
  };

  return <ShopContext value={value}>{props.children}</ShopContext>;
};

export const useShop = () => {
  const context = use(ShopContext);

  if (!context) {
    throw new Error('useShop must be used inside ShopProvider');
  }

  return context;
};
