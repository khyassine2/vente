'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { fadeUp, revealText } from '@/animations';
import { ProductImage } from '@/components/ProductImage';
import { CATEGORIES } from '@/data/categories';
import { useGsapContext } from '@/hooks/useGsapContext';

// The four categories that carry the season, in reading order.
const SHOWN = CATEGORIES.filter(category =>
  ['chemises', 'mailles', 'vestes', 'robes'].includes(category.slug),
);

export const CategoryShowcase = () => {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGsapContext(rootRef, () => {
    const split = headingRef.current ? revealText(headingRef.current) : null;
    fadeUp('[data-category-card]', { stagger: 0.08, distance: 40 });

    return () => split?.revert();
  });

  return (
    <section ref={rootRef} className="bg-paper-dim/60 py-20 md:py-32">
      <div className="shell">
        <h2 ref={headingRef} className="max-w-[14ch] text-editorial opacity-0">
          Par catégorie
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
          {SHOWN.map(category => (
            <Link
              key={category.slug}
              data-category-card
              href={`/boutique/${category.slug}`}
              data-cursor="Voir"
              className="group relative block overflow-hidden opacity-0"
            >
              <div className="aspect-[4/5] overflow-hidden bg-paper-dim lg:aspect-[3/4]">
                <ProductImage
                  source={category.image}
                  alt={category.label}
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 46vw, 92vw"
                  className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
              </div>

              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
              />

              <div className="absolute inset-x-5 bottom-5 text-paper">
                <h3 className="font-display text-2xl leading-tight">
                  {category.label}
                </h3>
                <p className="mt-1.5 max-w-[28ch] text-[0.8125rem] text-paper/75">
                  {category.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
