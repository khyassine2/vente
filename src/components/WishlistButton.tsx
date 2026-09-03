'use client';

import { Heart } from 'lucide-react';
import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/animations/gsap';
import { useShop } from '@/store/ShopContext';

type WishlistButtonProps = {
  productId: string;
  productName: string;
  className?: string;
};

/** Heart toggle that pops when a product is added to the wishlist. */
export const WishlistButton = (props: WishlistButtonProps) => {
  const shop = useShop();
  const iconRef = useRef<SVGSVGElement>(null);
  const active = shop.isWishlisted(props.productId);

  const onClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!active && iconRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        iconRef.current,
        { scale: 0.6 },
        { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.35)' },
      );
    }

    shop.toggleWishlist(props.productId);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={
        active
          ? `Retirer ${props.productName} des favoris`
          : `Ajouter ${props.productName} aux favoris`
      }
      className={`grid size-5 place-items-center transition-colors duration-300 ${props.className ?? ''}`}
    >
      <Heart
        ref={iconRef}
        className={`size-[18px] transition-colors duration-300 ${
          active ? 'fill-terracotta text-terracotta' : 'text-ink hover:text-terracotta'
        }`}
        strokeWidth={1.25}
      />
    </button>
  );
};
