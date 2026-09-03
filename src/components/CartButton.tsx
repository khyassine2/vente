'use client';

import { ShoppingBag } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/animations/gsap';
import { useShop } from '@/store/ShopContext';
import { useUi } from '@/store/UiContext';

/** Bag icon whose counter badge pops whenever the quantity changes. */
export const CartButton = () => {
  const shop = useShop();
  const ui = useUi();
  const badgeRef = useRef<HTMLSpanElement>(null);
  const previousCount = useRef(shop.count);

  useEffect(() => {
    const badge = badgeRef.current;
    const grew = shop.count > previousCount.current;
    previousCount.current = shop.count;

    if (!badge || !grew || prefersReducedMotion()) {
      return;
    }

    gsap.fromTo(
      badge,
      { scale: 0.4 },
      { scale: 1, duration: 0.65, ease: 'back.out(3)' },
    );
  }, [shop.count]);

  return (
    <button
      type="button"
      onClick={() => ui.toggle('cart')}
      aria-label={`Panier, ${shop.count} article${shop.count > 1 ? 's' : ''}`}
      className="relative grid size-5.5 place-items-center"
    >
      <ShoppingBag className="size-[19px]" strokeWidth={1.25} />
      {shop.count > 0 && (
        <span
          ref={badgeRef}
          className="absolute top-1 right-0.5 grid size-4 place-items-center rounded-full bg-terracotta text-[0.625rem] leading-none font-medium text-paper tabular-nums"
        >
          {shop.count}
        </span>
      )}
    </button>
  );
};
