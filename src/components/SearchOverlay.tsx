'use client';

import type { Product } from '@/data/types';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '@/animations/gsap';
import { ProductImage } from '@/components/ProductImage';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useUi } from '@/store/UiContext';
import { formatPrice } from '@/utils/format';

const SUGGESTIONS = ['Chemise', 'Lin', 'Maille', 'Robes', 'Accessoires'];

const searchProducts = (products: Product[], query: string): Product[] => {
  const normalized = query.trim().toLowerCase();

  if (normalized.length < 2) {
    return [];
  }

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.fabric,
      ...product.categories,
      ...product.colors.map(color => color.name),
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  }).slice(0, 8);
};

type SearchOverlayProps = {
  products: Product[];
};

export const SearchOverlay = (props: SearchOverlayProps) => {
  const ui = useUi();
  const open = ui.overlay === 'search';
  const [query, setQuery] = useState('');

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useScrollLock(open);

  const results = searchProducts(props.products, query);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        ui.close();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    // Clearing on close keeps the next open starting from an empty field.
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      setQuery('');
    };
  }, [open, ui]);

  useEffect(() => {
    const root = rootRef.current;

    if (!open || !root) {
      return;
    }

    inputRef.current?.focus();

    if (prefersReducedMotion()) {
      gsap.set(root, { autoAlpha: 1 });
      gsap.set('[data-search-field]', { autoAlpha: 1, scale: 1 });
      return;
    }

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(
          root,
          { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' },
          {
            autoAlpha: 1,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.7,
          },
        )
        .fromTo(
          '[data-search-field]',
          { autoAlpha: 0, scale: 0.96, y: 20 },
          { autoAlpha: 1, scale: 1, y: 0, duration: 0.7 },
          0.15,
        )
        .fromTo(
          '[data-search-meta]',
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 },
          0.3,
        );
    }, root);

    return () => context.revert();
  }, [open]);

  useEffect(() => {
    const container = resultsRef.current;

    if (!container || !open || prefersReducedMotion()) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        '[data-search-result]',
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.05,
        },
      );

      gsap.fromTo(
        '[data-search-image]',
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 0.8,
          ease: 'expo.out',
          stagger: 0.05,
        },
      );
    }, container);

    return () => context.revert();
  }, [results.length, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Recherche"
      className="fixed inset-0 z-110 overflow-y-auto overscroll-contain bg-paper opacity-0"
    >
      <div className="mx-auto min-h-full max-w-[1280px] px-5 pt-6 pb-24 sm:px-6 lg:px-10">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={ui.close}
            aria-label="Fermer la recherche"
            className="grid size-5.5 place-items-center"
          >
            <X className="size-5" strokeWidth={1.25} />
          </button>
        </div>

        <div data-search-field className="mt-8 md:mt-16">
          <label htmlFor="site-search" className="label-micro text-sage">
            Rechercher
          </label>
          <div className="mt-4 flex items-center gap-4 border-b border-forest pb-4">
            <Search className="size-3 shrink-0 text-sage" strokeWidth={1.25} />
            <input
              ref={inputRef}
              id="site-search"
              type="search"
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Vestes, lin, accessoires…"
              autoComplete="off"
              className="w-full bg-transparent font-display text-3xl leading-tight placeholder:text-stone focus:outline-none md:text-5xl"
            />
          </div>
        </div>

        {query.trim().length < 2 && (
          <div data-search-meta className="mt-10">
            <p className="label-micro text-sage">Suggestions</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map(suggestion => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setQuery(suggestion)}
                  className="border border-line px-4 py-2.5 text-sm transition-colors duration-300 hover:border-ink hover:bg-forest hover:text-paper"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={resultsRef} className="mt-12">
          {query.trim().length >= 2 && (
            <p className="label-micro mb-6 text-sage">
              {results.length === 0
                ? 'Aucun résultat'
                : `${results.length} résultat${results.length > 1 ? 's' : ''}`}
            </p>
          )}

          {results.length === 0 && query.trim().length >= 2 && (
            <p className="max-w-[40ch] text-sm text-sage">
              Essayez un autre terme, une matière ou une catégorie.
            </p>
          )}

          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
            {results.map(product => (
              <Link
                key={product.id}
                data-search-result
                href={`/produit/${product.slug}`}
                onClick={ui.close}
                className="group"
              >
                <div
                  data-search-image
                  className="aspect-[3/4] overflow-hidden bg-paper-dim"
                >
                  <ProductImage
                    source={product.images[0]}
                    alt={product.name}
                    sizes="(min-width: 768px) 22vw, 45vw"
                    className="size-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-3 truncate text-sm font-medium">
                  {product.name}
                </h3>
                <p className="mt-1 text-[0.8125rem] text-sage tabular-nums">
                  {formatPrice(product.price)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
