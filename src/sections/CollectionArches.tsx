'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { fadeUp, revealText } from '@/animations';
import { ProductImage } from '@/components/ProductImage';
import { CATEGORIES } from '@/data/categories';
import { useGsapContext } from '@/hooks/useGsapContext';

// The two families the reference layout leads with.
const SHOWN_SLUGS = ['robes', 'vestes'] as const;

export const CollectionArches = () => {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const shown = CATEGORIES.filter(category => SHOWN_SLUGS.includes(category.slug as typeof SHOWN_SLUGS[number]));

  useGsapContext(rootRef, () => {
    const split = headingRef.current ? revealText(headingRef.current) : null;
    fadeUp('[data-arch-card]', { stagger: 0.12, distance: 36 });

    return () => split?.revert();
  });

  return (
    <section
      ref={rootRef}
      className="bg-[radial-gradient(120%_100%_at_50%_0%,#f3ece0_0%,#ece0c9_100%)] py-20 md:py-28"
    >
      <div className="shell text-center">
        <h2 ref={headingRef} className="text-editorial opacity-0">
          Collection
        </h2>
        <p className="mx-auto mt-4 max-w-[46ch] text-[0.9375rem] text-ink/65">
          Des pièces uniques confectionnées avec soin, saison après saison.
        </p>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-2 md:mt-16">
          {shown.map(category => (
            <Link
              key={category.slug}
              data-arch-card
              href={`/boutique/${category.slug}`}
              data-cursor="Voir"
              className="group relative block opacity-0"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] bg-paper-dim shadow-[0_24px_50px_-24px_rgba(20,32,27,0.35)]">
                <ProductImage
                  source={category.image}
                  alt={category.label}
                  sizes="(min-width: 640px) 40vw, 80vw"
                  className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                />
              </div>

              <span className="mt-5 inline-block border border-line bg-paper px-6 py-2 label-micro text-ink shadow-sm">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
