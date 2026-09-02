import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, prefersReducedMotion } from '@/animations/gsap';
import { ProductImage } from '@/components/ProductImage';
import { PRODUCTS } from '@/data/products';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useUi } from '@/store/UiContext';

const MENU_LINKS = [
  { to: '/boutique/nouveautes', label: 'Nouveautés' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/collections', label: 'Collections' },
  { to: '/atelier', label: 'Atelier' },
  { to: '/rendez-vous', label: 'Rendez-vous' },
];

const SECONDARY_LINKS = [
  { to: '/boutique/accessoires', label: 'Accessoires' },
  { to: '/compte', label: 'Mon compte' },
  { to: '/panier', label: 'Panier' },
];

const PREVIEWS = [PRODUCTS[0], PRODUCTS[4]].filter(Boolean);

export const MobileMenu = () => {
  const ui = useUi();
  const open = ui.overlay === 'menu';
  const rootRef = useRef<HTMLDivElement>(null);

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
    const root = rootRef.current;

    if (!open || !root) {
      return;
    }

    if (prefersReducedMotion()) {
      gsap.set(root, { autoAlpha: 1 });
      gsap.set('[data-menu-item] > span, [data-menu-preview], [data-menu-secondary]', {
        autoAlpha: 1,
        yPercent: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
      });
      return;
    }

    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(
          root,
          { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' },
          { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7 },
        )
        .fromTo(
          '[data-menu-item] > span',
          { yPercent: 110 },
          { yPercent: 0, duration: 0.85, stagger: 0.055 },
          0.18,
        )
        .fromTo(
          '[data-menu-secondary]',
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.04 },
          0.4,
        )
        .fromTo(
          '[data-menu-preview]',
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, stagger: 0.08 },
          0.35,
        );
    }, root);

    return () => context.revert();
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-110 flex flex-col overflow-y-auto overscroll-contain bg-paper opacity-0"
    >
      <div className="shell flex h-16 shrink-0 items-center justify-between">
        <Link
          to="/"
          onClick={ui.close}
          className="font-display text-base tracking-[0.2em] uppercase"
        >
          Fil
          <span className="text-terracotta">&amp;</span>
          Ligne
        </Link>
        <button
          type="button"
          onClick={ui.close}
          aria-label="Fermer le menu"
          className="-mr-2 grid size-5.5 place-items-center"
        >
          <X className="size-5" strokeWidth={1.25} />
        </button>
      </div>

      <nav aria-label="Menu principal" className="shell pt-6">
        <ul>
          {MENU_LINKS.map(link => (
            <li key={link.to} className="border-b border-line">
              <Link
                to={link.to}
                onClick={ui.close}
                data-menu-item
                className="block overflow-hidden py-4"
              >
                <span className="block font-display text-[clamp(2rem,9vw,2.75rem)] leading-[1.05] tracking-tight">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="shell grid grid-cols-2 gap-3 pt-8">
        {PREVIEWS.map(product => (
          <Link
            key={product.id}
            to={`/produit/${product.slug}`}
            onClick={ui.close}
          >
            <div
              data-menu-preview
              className="aspect-[3/4] overflow-hidden bg-paper-dim"
            >
              <ProductImage
                source={product.images[0]}
                alt={product.name}
                sizes="45vw"
                className="size-full object-cover"
              />
            </div>
            <p className="mt-2 label-micro text-sage">{product.name}</p>
          </Link>
        ))}
      </div>

      <div className="shell mt-auto py-10">
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {SECONDARY_LINKS.map(link => (
            <li key={link.to} data-menu-secondary>
              <Link
                to={link.to}
                onClick={ui.close}
                className="label-micro text-sage"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p data-menu-secondary className="mt-6 text-[0.8125rem] text-sage">
          Livraison partout au Maroc · Paiement à la livraison
        </p>
      </div>
    </div>
  );
};
