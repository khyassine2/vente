'use client';

import type { Category } from '@/data/types';
import Link from 'next/link';
import { useRef } from 'react';
import { fadeUp, revealText } from '@/animations';
import { PageShell } from '@/components/PageShell';
import { ProductImage } from '@/components/ProductImage';
import { useGsapContext } from '@/hooks/useGsapContext';

type CollectionsViewProps = {
  categories: (Category & { count: number })[];
};

export const CollectionsView = (props: CollectionsViewProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGsapContext(rootRef, () => {
    const split = titleRef.current
      ? revealText(titleRef.current, { start: 'top 95%' })
      : null;

    fadeUp('[data-collection-meta]', { start: 'top 95%', delay: 0.1 });
    fadeUp('[data-collection-row]', { stagger: 0.1, distance: 44 });

    return () => split?.revert();
  });

  return (
    <PageShell>
      <div ref={rootRef} className="shell pt-28 pb-24 md:pt-36 md:pb-32">
        <p data-collection-meta className="label-micro text-sage opacity-0">
          Collections
        </p>

        <h1 ref={titleRef} className="mt-4 max-w-[14ch] text-editorial opacity-0">
          Sept familles, une garde-robe
        </h1>

        <p
          data-collection-meta
          className="mt-6 max-w-[52ch] text-[0.9375rem] leading-relaxed text-sage opacity-0"
        >
          Nous ne sortons pas de collection capsule tous les mois. Chaque
          famille se complète saison après saison, pour que ce que vous avez
          acheté l'an dernier tienne encore avec ce qui arrive.
        </p>

        <div className="mt-16 space-y-4 md:mt-20">
          {props.categories.map((category, index) => (
            <Link
              key={category.slug}
              data-collection-row
              href={`/boutique/${category.slug}`}
              data-cursor="Voir"
              className="group grid items-center gap-6 border-b border-line pb-4 opacity-0 md:grid-cols-[auto_1fr_auto_auto] md:gap-10"
            >
              <span className="label-micro text-stone tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="flex items-center gap-6">
                {/* The thumbnail widens as the row is hovered. */}
                <div className="hidden h-12 w-0 shrink-0 overflow-hidden bg-paper-dim transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-10 md:block">
                  <ProductImage
                    source={category.image}
                    alt=""
                    sizes="80px"
                    className="size-full object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="font-display text-[clamp(1.5rem,4vw,2.5rem)] leading-tight transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                    {category.label}
                  </h2>
                  <p className="mt-1 text-[0.8125rem] text-sage">
                    {category.tagline}
                  </p>
                </div>
              </div>

              <span className="label-micro text-sage tabular-nums">
                {category.count}
                {' '}
                {category.count > 1 ? 'pièces' : 'pièce'}
              </span>

              <span className="label-micro text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                Voir →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
};
