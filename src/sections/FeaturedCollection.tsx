'use client';

import type { Product } from '@/data/types';
import Link from 'next/link';
import { useRef } from 'react';
import { drawRule, fadeUp, revealText } from '@/animations';
import { ProductCard } from '@/components/ProductCard';
import { useGsapContext } from '@/hooks/useGsapContext';

type FeaturedCollectionProps = {
  products: Product[];
};

export const FeaturedCollection = (props: FeaturedCollectionProps) => {
  const featured = props.products.filter(product => product.isNew).slice(0, 4);
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGsapContext(rootRef, () => {
    const split = headingRef.current ? revealText(headingRef.current) : null;

    drawRule('[data-rule]');
    fadeUp('[data-featured-meta]', { delay: 0.15 });
    fadeUp('[data-featured-card]', { stagger: 0.1, distance: 44 });

    return () => split?.revert();
  });

  return (
    <section ref={rootRef} className="shell py-20 md:py-32">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p data-featured-meta className="label-micro text-sage opacity-0">
            Sélection
          </p>
          <h2
            ref={headingRef}
            className="mt-4 max-w-[16ch] text-editorial opacity-0"
          >
            Ce qui vient d'arriver
          </h2>
        </div>

        <Link
          data-featured-meta
          href="/boutique/nouveautes"
          className="link-underline shrink-0 self-start label-micro text-ink opacity-0 md:self-auto"
        >
          Toute la sélection
        </Link>
      </div>

      <div data-rule className="mt-10 h-px w-full bg-line md:mt-14" />

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:mt-14 md:grid-cols-4 md:gap-x-6">
        {featured.map((product, index) => (
          <div key={product.id} data-featured-card className="opacity-0">
            <ProductCard product={product} priority={index < 2} />
          </div>
        ))}
      </div>
    </section>
  );
};
