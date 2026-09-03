'use client';

import type { Category } from '@/data/types';
import type { Product, SortKey } from '@/data/types';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { fadeUp, revealText } from '@/animations';
import { PageShell } from '@/components/PageShell';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORIES } from '@/data/categories';
import { useGsapContext } from '@/hooks/useGsapContext';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Sélection' },
  { key: 'newest', label: 'Nouveautés' },
  { key: 'price-asc', label: 'Prix croissant' },
  { key: 'price-desc', label: 'Prix décroissant' },
];

const sortProducts = (products: Product[], key: SortKey) => {
  switch (key) {
    case 'price-asc':
      return products.toSorted((a, b) => a.price - b.price);
    case 'price-desc':
      return products.toSorted((a, b) => b.price - a.price);
    case 'newest':
      return products.toSorted((a, b) => Number(b.isNew) - Number(a.isNew));
    case 'featured':
      return products;
  }
};

type ShopViewProps = {
  products: Product[];
  category?: Category;
};

export const ShopView = (props: ShopViewProps) => {
  const { category } = props;
  const [sort, setSort] = useState<SortKey>('featured');

  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const filtered = category
    ? props.products.filter(product => product.categories.includes(category.slug))
    : props.products;
  const products = sortProducts(filtered, sort);

  useGsapContext(
    rootRef,
    () => {
      const split = headingRef.current ? revealText(headingRef.current) : null;
      fadeUp('[data-shop-meta]', { delay: 0.1 });
      fadeUp('[data-shop-card]', { stagger: 0.06, distance: 40 });

      return () => split?.revert();
    },
    [category?.slug, sort],
  );

  return (
    <PageShell>
      <div ref={rootRef} className="shell pt-28 pb-24 md:pt-36 md:pb-32">
        <p data-shop-meta className="label-micro text-sage opacity-0">
          {category ? 'Catégorie' : 'Toutes les pièces'}
        </p>

        <h1
          ref={headingRef}
          className="mt-4 max-w-[16ch] text-editorial opacity-0"
        >
          {category?.label ?? 'La boutique'}
        </h1>

        {category && (
          <p
            data-shop-meta
            className="mt-4 max-w-[46ch] text-[0.9375rem] text-sage opacity-0"
          >
            {category.tagline}
          </p>
        )}

        {/* Category rail scrolls inside its own track rather than wrapping. */}
        <nav
          aria-label="Catégories"
          data-shop-meta
          className="no-scrollbar mt-10 max-w-full overflow-x-auto opacity-0"
        >
          <ul className="flex w-max items-center gap-2">
            <li>
              <Link
                href="/boutique"
                data-active={!category}
                className="inline-flex min-h-5 items-center border border-line px-4 py-2 text-sm whitespace-nowrap transition-colors duration-300 hover:border-forest data-[active=true]:border-forest data-[active=true]:bg-forest data-[active=true]:text-paper"
              >
                Tout
              </Link>
            </li>
            {CATEGORIES.map(item => (
              <li key={item.slug}>
                <Link
                  href={`/boutique/${item.slug}`}
                  data-active={category?.slug === item.slug}
                  className="inline-flex min-h-5 items-center border border-line px-4 py-2 text-sm whitespace-nowrap transition-colors duration-300 hover:border-forest data-[active=true]:border-forest data-[active=true]:bg-forest data-[active=true]:text-paper"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          data-shop-meta
          className="mt-8 flex flex-col gap-4 border-y border-line py-4 opacity-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="label-micro text-sage">
            {products.length}
            {' '}
            {products.length > 1 ? 'pièces' : 'pièce'}
          </p>

          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="label-micro text-sage">
              Trier
            </label>
            <select
              id="sort"
              value={sort}
              onChange={event => setSort(event.target.value as SortKey)}
              className="min-h-5 border border-line bg-transparent px-3 py-2 text-sm focus:border-forest focus:outline-none"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {products.length === 0
          ? (
              <p className="mt-16 max-w-[40ch] text-sm text-sage">
                Aucune pièce dans cette catégorie pour le moment.
              </p>
            )
          : (
              <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    data-shop-card
                    className="opacity-0"
                  >
                    <ProductCard product={product} priority={index < 4} />
                  </div>
                ))}
              </div>
            )}
      </div>
    </PageShell>
  );
};
