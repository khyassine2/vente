'use client';

import type { Product } from '@/data/types';
import Link from 'next/link';
import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/animations/gsap';
import { ProductImage } from '@/components/ProductImage';
import { WishlistButton } from '@/components/WishlistButton';
import { useShop } from '@/store/ShopContext';
import { useFlipTransition } from '@/store/FlipContext';
import { formatPrice } from '@/utils/format';

type ProductCardProps = {
  product: Product;
  /** Cards in the first viewport load eagerly instead of lazily. */
  priority?: boolean;
  sizes?: string;
};

const DEFAULT_SIZES = '(min-width: 1280px) 24vw, (min-width: 768px) 31vw, 45vw';

export const ProductCard = (props: ProductCardProps) => {
  const { product } = props;
  const shop = useShop();
  const flip = useFlipTransition();
  const imageRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLSpanElement>(null);

  const onQuickAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    const color = product.colors[0];
    const size = product.sizes[Math.floor(product.sizes.length / 2)];

    if (!color || !size) {
      return;
    }

    shop.addToCart({ product, color: color.name, size });

    const feedback = feedbackRef.current;
    if (feedback && !prefersReducedMotion()) {
      gsap
        .timeline()
        .set(feedback, { autoAlpha: 1, yPercent: 100 })
        .to(feedback, { yPercent: 0, duration: 0.4, ease: 'expo.out' })
        .to(feedback, { autoAlpha: 0, duration: 0.3, delay: 1.1 });
    }
  };

  const onNavigate = () => {
    if (imageRef.current) {
      flip?.capture(product.id, imageRef.current);
    }
  };

  const sizes = props.sizes ?? DEFAULT_SIZES;

  return (
    <article className="group relative">
      <Link href={`/produit/${product.slug}`}
        onClick={onNavigate}
        className="block"
        data-cursor="Voir"
      >
        <div
          ref={imageRef}
          data-flip-id={`product-${product.id}`}
          className="relative aspect-[3/4] overflow-hidden bg-paper-dim"
        >
          <ProductImage
            source={product.images[0]}
            alt={product.name}
            sizes={sizes}
            priority={props.priority}
            className="absolute inset-0 size-full object-cover transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] md:group-hover:opacity-0"
          />
          {/* Second shot is desktop-only: mobile keeps a single decode. */}
          <ProductImage
            source={product.images[1]}
            alt=""
            sizes={sizes}
            className="absolute inset-0 hidden size-full object-cover opacity-0 transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:opacity-100 md:block"
          />

          <div className="absolute top-3 left-3 flex flex-col items-start gap-2 md:top-4 md:left-4">
            {product.isNew && (
              <span className="bg-paper px-1.5 py-0.75 label-micro text-ink">
                Nouveau
              </span>
            )}
            {product.compareAtPrice && (
              <span className="bg-terracotta px-1.5 py-0.75 label-micro text-paper">
                Remise
              </span>
            )}
          </div>

          <span
            ref={feedbackRef}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 block bg-forest py-2 text-center label-micro text-paper opacity-0"
          >
            Ajouté au panier
          </span>

          <div className="absolute inset-x-4 bottom-4 hidden translate-y-3 opacity-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 md:block">
            <button
              type="button"
              onClick={onQuickAdd}
              className="w-full bg-paper/95 py-1.75 label-micro text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-forest hover:text-paper"
            >
              Ajout rapide
            </button>
          </div>
        </div>
      </Link>

      <div className="relative flex items-start justify-between gap-3 pt-4 md:transition-transform md:duration-500 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:-translate-y-1">
        <div className="min-w-0">
          <h3 className="truncate font-sans text-[0.9375rem] leading-snug font-medium">
            <Link href={`/produit/${product.slug}`} onClick={onNavigate}>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-[0.8125rem] text-sage">
            {product.colors.length > 1
              ? `${product.colors.length} coloris`
              : product.colors[0]?.name}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span className="flex flex-col items-end pt-0.5 text-[0.9375rem] tabular-nums">
            <span>{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-[0.75rem] text-stone line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </span>
          <WishlistButton
            productId={product.id}
            productName={product.name}
            className="-mr-2"
          />
        </div>
      </div>

      {/* Quick add stays reachable on touch, where hover never fires. */}
      <button
        type="button"
        onClick={onQuickAdd}
        className="mt-3 min-h-5.5 w-full border border-line py-1.5 label-micro text-ink md:hidden"
      >
        Ajout rapide
      </button>
    </article>
  );
};
