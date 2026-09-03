'use client';

import { Ruler, Scissors, Truck, Undo2 } from 'lucide-react';
import { useRef } from 'react';
import { fadeUp, revealText } from '@/animations';
import { useGsapContext } from '@/hooks/useGsapContext';

const PROMISES = [
  {
    icon: Truck,
    title: 'Livraison au Maroc',
    body: 'Expédié sous 48 h depuis Rabat. Offerte dès 800 DH, paiement à la livraison partout.',
  },
  {
    icon: Undo2,
    title: 'Retours sous 30 jours',
    body: 'Une pièce ne tombe pas comme prévu ? Renvoyez-la, nous la reprenons sans frais.',
  },
  {
    icon: Ruler,
    title: 'Retouches offertes',
    body: 'Ourlets et reprises de taille faits à l\'atelier, inclus sur toutes les commandes.',
  },
  {
    icon: Scissors,
    title: 'Petites séries',
    body: 'Entre trente et cent pièces par modèle. Ce qui part ne revient pas toujours.',
  },
];

export const ServicePromise = () => {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGsapContext(rootRef, () => {
    const split = headingRef.current ? revealText(headingRef.current) : null;
    fadeUp('[data-promise]', { stagger: 0.08 });

    return () => split?.revert();
  });

  return (
    <section ref={rootRef} className="bg-forest py-20 text-paper md:py-28">
      <div className="shell">
        <h2 ref={headingRef} className="max-w-[18ch] text-section opacity-0">
          Ce qui va avec chaque commande
        </h2>

        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map(promise => (
            <li key={promise.title} data-promise className="opacity-0">
              <promise.icon
                className="size-3 text-sand"
                strokeWidth={1.25}
                aria-hidden
              />
              <h3 className="mt-5 font-sans text-base font-medium">
                {promise.title}
              </h3>
              <p className="mt-2.5 max-w-[34ch] text-[0.875rem] leading-relaxed text-paper/70">
                {promise.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
