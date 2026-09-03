'use client';

import type { Product } from '@/data/types';
import { Check, ChevronLeft, Minus, Plus, Truck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { fadeUp, revealText } from '@/animations';
import { Flip, gsap, prefersReducedMotion } from '@/animations/gsap';
import { PageShell } from '@/components/PageShell';
import { ProductCard } from '@/components/ProductCard';
import { ProductImage } from '@/components/ProductImage';
import { WishlistButton } from '@/components/WishlistButton';
import { useGsapContext } from '@/hooks/useGsapContext';
import { useFlipTransition } from '@/store/FlipContext';
import { useShop } from '@/store/ShopContext';
import { useUi } from '@/store/UiContext';
import { formatPrice } from '@/utils/format';

type ProductViewProps = {
  product: Product;
  related: Product[];
};

export const ProductView = (props: ProductViewProps) => {
  const { product, related } = props;
  const shop = useShop();
  const ui = useUi();
  const flip = useFlipTransition();

  const [activeImage, setActiveImage] = useState(0);
  const [color, setColor] = useState(product.colors[0]?.name ?? '');
  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const heroFrameRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sizeListRef = useRef<HTMLDivElement>(null);

  const singleSize = product.sizes.length === 1;

  // Match the card image the user clicked, before the browser paints.
  useLayoutEffect(() => {
    const state = flip?.consume(product.id);
    const frame = heroFrameRef.current;

    if (!state || !frame) {
      return;
    }

    Flip.from(state, {
      targets: frame,
      duration: 0.7,
      ease: 'expo.inOut',
      absolute: true,
      scale: true,
    });
  }, [flip, product.id]);

  useGsapContext(rootRef, () => {
    const split = titleRef.current
      ? revealText(titleRef.current, { start: 'top 95%' })
      : null;

    fadeUp('[data-product-detail]', {
      start: 'top 95%',
      stagger: 0.06,
      delay: 0.15,
    });

    fadeUp('[data-related-card]', { stagger: 0.08, distance: 40 });

    return () => split?.revert();
  });

  // Cross-fade the main gallery shot rather than swapping it hard.
  useEffect(() => {
    const gallery = galleryRef.current;

    if (!gallery || prefersReducedMotion()) {
      return;
    }

    const tween = gsap.fromTo(
      gallery,
      { autoAlpha: 0.35 },
      { autoAlpha: 1, duration: 0.5, ease: 'power2.out' },
    );

    return () => {
      tween.kill();
    };
  }, [activeImage]);

  const onAdd = () => {
    // A one-size piece needs no choice, so it is selected implicitly.
    const chosen = singleSize ? product.sizes[0] : size;

    if (!chosen) {
      setSizeError(true);

      if (sizeListRef.current && !prefersReducedMotion()) {
        gsap.fromTo(
          sizeListRef.current,
          { x: -6 },
          { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.35)' },
        );
      }

      return;
    }

    setSizeError(false);
    shop.addToCart({ product, color, size: chosen, quantity });
    ui.open('cart');
  };

  const image = product.images[activeImage] ?? product.images[0];

  return (
    <PageShell>
      <div ref={rootRef} className="shell pt-24 pb-24 md:pt-32 md:pb-32">
        <Link
          data-product-detail
          href="/boutique"
          className="inline-flex items-center gap-1.5 label-micro text-sage opacity-0 transition-colors hover:text-ink"
        >
          <ChevronLeft className="size-4" strokeWidth={1.5} />
          Boutique
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* min-w-0: a grid item defaults to min-width:auto, which would let
              the full-width photograph widen the column past the viewport. */}
          <div className="min-w-0">
            <div
              ref={heroFrameRef}
              data-flip-id={`product-${product.id}`}
              className="relative aspect-[3/4] overflow-hidden bg-paper-dim"
            >
              <div ref={galleryRef} className="size-full">
                <ProductImage
                  source={image}
                  alt={product.name}
                  sizes="(min-width: 1024px) 52vw, 92vw"
                  priority
                  className="size-full object-cover"
                />
              </div>
            </div>

            {/* Thumbnails scroll sideways on narrow screens. */}
            <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
              {product.images.map((source, index) => (
                <button
                  key={source}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Voir la photo ${index + 1}`}
                  aria-pressed={index === activeImage}
                  data-active={index === activeImage}
                  className="w-10 shrink-0 border border-transparent bg-paper-dim transition-colors duration-300 data-[active=true]:border-forest md:w-12"
                >
                  <ProductImage
                    source={source}
                    alt=""
                    sizes="96px"
                    className="aspect-[3/4] size-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <h1
              ref={titleRef}
              className="text-section opacity-0"
            >
              {product.name}
            </h1>

            <div
              data-product-detail
              className="mt-4 flex items-center gap-3 opacity-0"
            >
              <span className="text-xl tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-base text-stone line-through tabular-nums">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p
              data-product-detail
              className="mt-6 max-w-[52ch] text-[0.9375rem] leading-relaxed text-sage opacity-0"
            >
              {product.description}
            </p>

            <div data-product-detail className="mt-9 opacity-0">
              <p className="label-micro text-sage">
                Coloris ·
                {' '}
                <span className="text-ink">{color}</span>
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {product.colors.map(option => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setColor(option.name)}
                    aria-label={option.name}
                    aria-pressed={option.name === color}
                    data-active={option.name === color}
                    className="grid size-5 place-items-center rounded-full border border-line transition-colors duration-300 data-[active=true]:border-forest"
                  >
                    <span
                      className="size-3.5 rounded-full border border-line/70"
                      style={{ backgroundColor: option.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {!singleSize && (
              <div data-product-detail className="mt-8 opacity-0">
                <div className="flex items-baseline justify-between">
                  <p className="label-micro text-sage">Taille</p>
                  <Link
                    href="/guide-des-tailles"
                    className="link-underline label-micro text-sage"
                  >
                    Guide des tailles
                  </Link>
                </div>

                <div ref={sizeListRef} className="mt-4 flex flex-wrap gap-2">
                  {product.sizes.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSize(option);
                        setSizeError(false);
                      }}
                      aria-pressed={option === size}
                      data-active={option === size}
                      className="min-h-5.5 min-w-7 border border-line px-2 text-sm transition-colors duration-300 hover:border-forest data-[active=true]:border-forest data-[active=true]:bg-forest data-[active=true]:text-paper"
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <p
                  aria-live="polite"
                  className="mt-3 h-4 text-[0.8125rem] text-terracotta"
                >
                  {sizeError ? 'Choisissez une taille.' : ''}
                </p>
              </div>
            )}

            <div
              data-product-detail
              className="mt-6 flex flex-col gap-3 opacity-0 sm:flex-row sm:items-stretch"
            >
              <div className="flex items-center justify-between border border-line sm:justify-start">
                <button
                  type="button"
                  onClick={() => setQuantity(current => Math.max(1, current - 1))}
                  aria-label="Réduire la quantité"
                  className="grid size-6 place-items-center text-sage transition-colors hover:text-ink"
                >
                  <Minus className="size-4" strokeWidth={1.5} />
                </button>
                <span className="w-5 text-center text-sm tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(current => Math.min(20, current + 1))}
                  aria-label="Augmenter la quantité"
                  className="grid size-6 place-items-center text-sage transition-colors hover:text-ink"
                >
                  <Plus className="size-4" strokeWidth={1.5} />
                </button>
              </div>

              <button
                type="button"
                onClick={onAdd}
                className="min-h-6 flex-1 bg-forest px-8 label-micro text-paper transition-colors duration-300 hover:bg-ink"
              >
                Ajouter au panier
              </button>

              <WishlistButton
                productId={product.id}
                productName={product.name}
                className="self-center border border-line sm:size-6 sm:self-auto"
              />
            </div>

            <div
              data-product-detail
              className="mt-8 space-y-3 border-t border-line pt-8 opacity-0"
            >
              <p className="flex items-start gap-3 text-[0.875rem] text-sage">
                <Truck className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                Expédié sous 48 h · Livraison offerte dès 800 DH
              </p>
              <p className="flex items-start gap-3 text-[0.875rem] text-sage">
                <Check className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                Retours sous 30 jours, retouches offertes
              </p>
            </div>

            <div
              data-product-detail
              className="mt-8 border-t border-line pt-8 opacity-0"
            >
              <h2 className="label-micro font-sans text-sage">La pièce</h2>
              <ul className="mt-4 space-y-2.5">
                {product.details.map(detail => (
                  <li
                    key={detail}
                    className="flex gap-3 text-[0.875rem] text-ink"
                  >
                    <span aria-hidden className="text-terracotta">
                      —
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.875rem] text-sage">
                <span className="text-ink">Matière · </span>
                {product.fabric}
              </p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-24 md:mt-32">
            <h2 className="text-section">Dans le même esprit</h2>

            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-6">
              {related.map(item => (
                <div key={item.id} data-related-card className="opacity-0">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
};
