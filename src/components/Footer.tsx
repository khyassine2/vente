'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { fadeUp } from '@/animations';
import { useGsapContext } from '@/hooks/useGsapContext';

const COLUMNS = [
  {
    title: 'Boutique',
    links: [
      { to: '/boutique/nouveautes', label: 'Nouveautés' },
      { to: '/boutique/chemises', label: 'Chemises' },
      { to: '/boutique/mailles', label: 'Mailles' },
      { to: '/boutique/vestes', label: 'Vestes' },
      { to: '/boutique/accessoires', label: 'Accessoires' },
    ],
  },
  {
    title: 'Maison',
    links: [
      { to: '/atelier', label: 'L\'atelier' },
      { to: '/collections', label: 'Collections' },
      { to: '/rendez-vous', label: 'Rendez-vous' },
      { to: '/compte', label: 'Mon compte' },
    ],
  },
  {
    title: 'Aide',
    links: [
      { to: '/livraison', label: 'Livraison' },
      { to: '/retours', label: 'Retours et échanges' },
      { to: '/guide-des-tailles', label: 'Guide des tailles' },
      { to: '/entretien', label: 'Entretien' },
    ],
  },
];

export const Footer = () => {
  const rootRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  useGsapContext(rootRef, () => {
    fadeUp('[data-footer-block]', { start: 'top 92%', stagger: 0.08 });
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSignedUp(true);
    setEmail('');
  };

  return (
    <footer ref={rootRef} className="border-t border-line bg-paper">
      <div className="shell py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div data-footer-block>
            <p className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] tracking-tight">
              Une lettre par saison,
              <br />
              jamais plus.
            </p>

            <form onSubmit={onSubmit} className="mt-8 max-w-md">
              <label htmlFor="newsletter" className="label-micro text-sage">
                Votre e-mail
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="prenom@exemple.ma"
                  className="min-h-6 w-full border border-line bg-transparent px-4 py-3 text-sm placeholder:text-stone focus:border-forest focus:outline-none"
                />
                <button
                  type="submit"
                  className="min-h-6 shrink-0 bg-forest px-7 label-micro text-paper transition-colors duration-300 hover:bg-ink"
                >
                  S'inscrire
                </button>
              </div>
              {/* Announced politely so screen readers hear the confirmation. */}
              <p aria-live="polite" className="mt-3 text-[0.8125rem] text-terracotta">
                {signedUp ? 'Merci, vous êtes inscrit.' : ''}
              </p>
            </form>
          </div>

          <div
            data-footer-block
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:justify-items-end"
          >
            {COLUMNS.map(column => (
              <div key={column.title}>
                <h2 className="label-micro font-sans text-sage">{column.title}</h2>
                <ul className="mt-5 space-y-3">
                  {column.links.map(link => (
                    <li key={link.to}>
                      <Link href={link.to}
                        className="link-underline text-[0.875rem] text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          data-footer-block
          className="mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-end md:justify-between"
        >
          <Link href="/"
            className="font-display text-2xl leading-none tracking-[0.18em] uppercase md:text-3xl"
          >
            Fil
            <span className="text-terracotta">&amp;</span>
            Ligne
          </Link>

          <div className="space-y-2 text-[0.8125rem] text-sage md:text-right">
            <p>Atelier · 14 rue des Consuls, Rabat</p>
            <p>Livraison partout au Maroc · Paiement à la livraison</p>
            <p>
              ©
              {' '}
              {new Date().getFullYear()}
              {' '}
              Fil & Ligne. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
