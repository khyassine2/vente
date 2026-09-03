'use client';

import { Minus, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';
import { fadeUp, revealText } from '@/animations';
import { ButtonLink } from '@/components/Button';
import { PageShell } from '@/components/PageShell';
import { ProductImage } from '@/components/ProductImage';
import { useGsapContext } from '@/hooks/useGsapContext';
import { useShop } from '@/store/ShopContext';
import { formatPrice } from '@/utils/format';

const SHIPPING_THRESHOLD = 800;
const SHIPPING_COST = 45;

export default function CartPage() {
  const shop = useShop();
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGsapContext(rootRef, () => {
    const split = titleRef.current
      ? revealText(titleRef.current, { start: 'top 95%' })
      : null;

    fadeUp('[data-cart-row], [data-cart-panel]', {
      start: 'top 95%',
      stagger: 0.06,
      delay: 0.1,
    });

    return () => split?.revert();
  });

  const shipping
    = shop.subtotal === 0 || shop.subtotal >= SHIPPING_THRESHOLD
      ? 0
      : SHIPPING_COST;

  return (
    <PageShell>
      <div ref={rootRef} className="shell pt-28 pb-24 md:pt-36 md:pb-32">
        <h1 ref={titleRef} className="text-editorial opacity-0">
          Panier
        </h1>

        {shop.items.length === 0
          ? (
              <div data-cart-panel className="mt-12 max-w-[46ch] opacity-0">
                <p className="text-[0.9375rem] text-sage">
                  Votre panier est vide. Parcourez la boutique pour trouver vos
                  prochaines pièces.
                </p>
                <ButtonLink href="/boutique" variant="outline" className="mt-8">
                  Découvrir la boutique
                </ButtonLink>
              </div>
            )
          : (
              <div className="mt-12 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
                <ul className="divide-y divide-line border-y border-line">
                  {shop.items.map(item => (
                    <li
                      key={item.key}
                      data-cart-row
                      className="flex gap-4 py-6 opacity-0 sm:gap-6"
                    >
                      <Link
                        href={`/produit/${item.slug}`}
                        className="w-12 shrink-0 overflow-hidden bg-paper-dim sm:w-16"
                      >
                        <ProductImage
                          source={item.image}
                          alt={item.name}
                          sizes="128px"
                          className="aspect-[3/4] size-full object-cover"
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="truncate font-sans text-[0.9375rem] font-medium">
                              <Link href={`/produit/${item.slug}`}>
                                {item.name}
                              </Link>
                            </h2>
                            <p className="mt-1 text-[0.8125rem] text-sage">
                              {item.color}
                              {' · '}
                              {item.size}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => shop.removeFromCart(item.key)}
                            aria-label={`Retirer ${item.name}`}
                            className="-mr-2 grid size-5 shrink-0 place-items-center text-sage transition-colors hover:text-ink"
                          >
                            <X className="size-4" strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
                          <div className="flex items-center border border-line">
                            <button
                              type="button"
                              onClick={() =>
                                shop.setQuantity(item.key, item.quantity - 1)}
                              aria-label="Réduire la quantité"
                              className="grid size-5 place-items-center text-sage transition-colors hover:text-ink"
                            >
                              <Minus className="size-3.5" strokeWidth={1.5} />
                            </button>
                            <span className="w-4.5 text-center text-sm tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                shop.setQuantity(item.key, item.quantity + 1)}
                              aria-label="Augmenter la quantité"
                              className="grid size-5 place-items-center text-sage transition-colors hover:text-ink"
                            >
                              <Plus className="size-3.5" strokeWidth={1.5} />
                            </button>
                          </div>

                          <span className="text-[0.9375rem] tabular-nums">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <aside
                  data-cart-panel
                  className="h-fit border border-line p-6 opacity-0 lg:sticky lg:top-28"
                >
                  <h2 className="label-micro text-sage">Récapitulatif</h2>

                  <dl className="mt-6 space-y-3 text-[0.9375rem]">
                    <div className="flex justify-between">
                      <dt className="text-sage">Sous-total</dt>
                      <dd className="tabular-nums">
                        {formatPrice(shop.subtotal)}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sage">Livraison</dt>
                      <dd className="tabular-nums">
                        {shipping === 0 ? 'Offerte' : formatPrice(shipping)}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
                    <span className="label-micro">Total</span>
                    <span className="text-lg tabular-nums">
                      {formatPrice(shop.subtotal + shipping)}
                    </span>
                  </div>

                  <Link
                    href="/commande"
                    className="mt-6 flex min-h-6 w-full items-center justify-center bg-forest py-2 label-micro text-paper transition-colors duration-300 hover:bg-ink"
                  >
                    Passer commande
                  </Link>

                  <button
                    type="button"
                    onClick={shop.clearCart}
                    className="mt-4 w-full label-micro text-sage underline-offset-4 transition-colors hover:text-ink hover:underline"
                  >
                    Vider le panier
                  </button>
                </aside>
              </div>
            )}
      </div>
    </PageShell>
  );
}
