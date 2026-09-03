'use client';

import type { Product } from '@/data/types';
import { useRef } from 'react';
import { fadeUp, revealText } from '@/animations';
import { ButtonLink } from '@/components/Button';
import { PageShell } from '@/components/PageShell';
import { ProductCard } from '@/components/ProductCard';
import { useGsapContext } from '@/hooks/useGsapContext';
import { useShop } from '@/store/ShopContext';

type AccountViewProps = {
  products: Product[];
};

export const AccountView = (props: AccountViewProps) => {
  const shop = useShop();
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const saved = props.products.filter(product => shop.wishlist.includes(product.id));

  useGsapContext(
    rootRef,
    () => {
      const split = titleRef.current
        ? revealText(titleRef.current, { start: 'top 95%' })
        : null;

      fadeUp('[data-account-block]', {
        start: 'top 95%',
        stagger: 0.07,
        delay: 0.1,
      });

      return () => split?.revert();
    },
    [saved.length],
  );

  return (
    <PageShell>
      <div ref={rootRef} className="shell pt-28 pb-24 md:pt-36 md:pb-32">
        <p data-account-block className="label-micro text-sage opacity-0">
          Mon compte
        </p>

        <h1 ref={titleRef} className="mt-4 text-editorial opacity-0">
          Vos favoris
        </h1>

        {saved.length === 0
          ? (
              <div data-account-block className="mt-10 max-w-[48ch] opacity-0">
                <p className="text-[0.9375rem] leading-relaxed text-sage">
                  Vous n'avez pas encore de favoris. Touchez le cœur sur une
                  pièce pour la retrouver ici — la liste reste sur cet appareil.
                </p>
                <ButtonLink href="/boutique" variant="outline" className="mt-8">
                  Parcourir la boutique
                </ButtonLink>
              </div>
            )
          : (
              <>
                <p
                  data-account-block
                  className="mt-4 label-micro text-sage opacity-0"
                >
                  {saved.length}
                  {' '}
                  {saved.length > 1 ? 'pièces gardées' : 'pièce gardée'}
                </p>

                <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
                  {saved.map(product => (
                    <div key={product.id} data-account-block className="opacity-0">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </>
            )}
      </div>
    </PageShell>
  );
};
