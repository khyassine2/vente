import type { CartItem } from '@/store/types';
import { Minus, Plus, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { animateNumber } from '@/animations';
import { gsap, prefersReducedMotion } from '@/animations/gsap';
import { Button } from '@/components/Button';
import { ProductImage } from '@/components/ProductImage';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useShop } from '@/store/ShopContext';
import { useUi } from '@/store/UiContext';
import { formatPrice } from '@/utils/format';

const SHIPPING_THRESHOLD = 800;

export const CartDrawer = () => {
  const shop = useShop();
  const ui = useUi();
  const open = ui.overlay === 'cart';

  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const previousSubtotal = useRef(shop.subtotal);

  useScrollLock(open);

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
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, ui]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;

    if (!overlay || !panel || !open) {
      return;
    }

    if (prefersReducedMotion()) {
      gsap.set([overlay, panel], { autoAlpha: 1, xPercent: 0, yPercent: 0 });
      return;
    }

    // Below `sm` the panel is a bottom sheet, so it has to rise rather than
    // slide in from the right.
    const sheet = window.matchMedia('(max-width: 639px)').matches;
    const timeline = gsap.timeline();

    timeline
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 })
      .fromTo(
        panel,
        sheet ? { yPercent: 100 } : { xPercent: 100 },
        sheet
          ? { yPercent: 0, duration: 0.7, ease: 'expo.out' }
          : { xPercent: 0, duration: 0.7, ease: 'expo.out' },
        0,
      )
      .fromTo(
        panel.querySelectorAll('[data-cart-item], [data-cart-summary]'),
        { autoAlpha: 0, x: sheet ? 0 : 36, y: sheet ? 20 : 0 },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
          stagger: 0.06,
        },
        0.22,
      );

    return () => {
      timeline.kill();
    };
  }, [open]);

  useEffect(() => {
    const element = totalRef.current;

    if (!element) {
      previousSubtotal.current = shop.subtotal;
      return;
    }

    const tween = animateNumber(
      element,
      previousSubtotal.current,
      shop.subtotal,
      formatPrice,
    );

    previousSubtotal.current = shop.subtotal;

    return () => {
      tween?.kill();
    };
  }, [shop.subtotal, open]);

  const onRemove = (key: string, node: HTMLElement | null) => {
    if (!node || prefersReducedMotion()) {
      shop.removeFromCart(key);
      return;
    }

    // Collapse the row before dropping it so the list closes the gap smoothly.
    gsap.to(node, {
      autoAlpha: 0,
      x: 48,
      height: 0,
      marginTop: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.45,
      ease: 'power3.inOut',
      onComplete: () => shop.removeFromCart(key),
    });
  };

  if (!open) {
    return null;
  }

  const remaining = Math.max(0, SHIPPING_THRESHOLD - shop.subtotal);

  return (
    <div className="fixed inset-0 z-100">
      <div
        ref={overlayRef}
        onClick={ui.close}
        aria-hidden
        className="absolute inset-0 bg-ink/45 opacity-0 backdrop-blur-[2px]"
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className="absolute inset-x-0 bottom-0 flex max-h-[92svh] flex-col bg-paper shadow-[0_-8px_40px_rgba(20,32,27,0.12)] sm:inset-y-0 sm:right-0 sm:left-auto sm:max-h-none sm:w-full sm:max-w-[440px] sm:shadow-[-8px_0_40px_rgba(20,32,27,0.08)]"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-line px-5 py-5 sm:px-6">
          <h2 className="label-micro">
            Panier
            {shop.count > 0 && ` (${shop.count})`}
          </h2>
          <button
            type="button"
            onClick={ui.close}
            aria-label="Fermer le panier"
            className="-mr-2 grid size-5.5 place-items-center"
          >
            <X className="size-5" strokeWidth={1.25} />
          </button>
        </header>

        {shop.items.length === 0
          ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-16 text-center">
                <p className="font-display text-2xl">Votre panier est vide</p>
                <p className="max-w-[26ch] text-sm text-sage">
                  Parcourez la collection pour trouver vos prochaines pièces.
                </p>
                <Button onClick={ui.close} variant="outline">
                  Découvrir la collection
                </Button>
              </div>
            )
          : (
              <>
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6">
                  <ul className="divide-y divide-line">
                    {shop.items.map(item => (
                      <CartRow
                        key={item.key}
                        item={item}
                        onRemove={onRemove}
                        onQuantity={shop.setQuantity}
                      />
                    ))}
                  </ul>
                </div>

                <footer
                  data-cart-summary
                  className="shrink-0 border-t border-line px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-6"
                >
                  {remaining > 0
                    ? (
                        <p className="mb-4 text-[0.8125rem] text-sage">
                          Plus que
                          {' '}
                          <span className="text-ink">{formatPrice(remaining)}</span>
                          {' '}
                          pour la livraison offerte.
                        </p>
                      )
                    : (
                        <p className="mb-4 text-[0.8125rem] text-terracotta">
                          Livraison offerte partout au Maroc.
                        </p>
                      )}

                  <div className="flex items-baseline justify-between">
                    <span className="label-micro">Sous-total</span>
                    <span ref={totalRef} className="text-lg tabular-nums">
                      {formatPrice(shop.subtotal)}
                    </span>
                  </div>

                  <p className="mt-2 text-[0.75rem] text-sage">
                    Paiement à la livraison disponible.
                  </p>

                  <Link
                    to="/commande"
                    onClick={ui.close}
                    className="mt-5 flex min-h-6 w-full items-center justify-center bg-forest py-2 label-micro text-paper transition-colors duration-300 hover:bg-ink"
                  >
                    Passer commande
                  </Link>
                </footer>
              </>
            )}
      </aside>
    </div>
  );
};

type CartRowProps = {
  item: CartItem;
  onRemove: (key: string, node: HTMLElement | null) => void;
  onQuantity: (key: string, quantity: number) => void;
};

const CartRow = (props: CartRowProps) => {
  const { item } = props;
  const rowRef = useRef<HTMLLIElement>(null);

  return (
    <li ref={rowRef} data-cart-item className="flex gap-4 py-5">
      <Link
        to={`/produit/${item.slug}`}
        className="w-10 shrink-0 overflow-hidden bg-paper-dim"
      >
        <ProductImage
          source={item.image}
          alt={item.name}
          sizes="80px"
          className="aspect-[3/4] size-full object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="truncate font-sans text-sm font-medium">{item.name}</h3>
          <span className="shrink-0 text-sm tabular-nums">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>

        <p className="mt-1 text-[0.8125rem] text-sage">
          {item.color}
          {' · '}
          {item.size}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-line">
            <button
              type="button"
              onClick={() => props.onQuantity(item.key, item.quantity - 1)}
              aria-label="Réduire la quantité"
              className="grid size-4.5 place-items-center text-sage transition-colors hover:text-ink"
            >
              <Minus className="size-3.5" strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => props.onQuantity(item.key, item.quantity + 1)}
              aria-label="Augmenter la quantité"
              className="grid size-4.5 place-items-center text-sage transition-colors hover:text-ink"
            >
              <Plus className="size-3.5" strokeWidth={1.5} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => props.onRemove(item.key, rowRef.current)}
            className="label-micro text-sage underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Retirer
          </button>
        </div>
      </div>
    </li>
  );
};
