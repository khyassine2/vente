'use client';

import { useRef } from 'react';
import { fadeUp, revealText } from '@/animations';
import { ButtonLink } from '@/components/Button';
import { PageShell } from '@/components/PageShell';
import { useGsapContext } from '@/hooks/useGsapContext';

export default function NotFound() {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGsapContext(rootRef, () => {
    const split = titleRef.current
      ? revealText(titleRef.current, { start: 'top 95%' })
      : null;

    fadeUp('[data-notfound-block]', { start: 'top 95%', stagger: 0.08, delay: 0.1 });

    return () => split?.revert();
  });

  return (
    <PageShell>
      <div
        ref={rootRef}
        className="shell flex min-h-[70svh] flex-col justify-center pt-28 pb-24"
      >
        <p data-notfound-block className="label-micro text-sage opacity-0">
          Erreur 404
        </p>

        <h1 ref={titleRef} className="mt-4 max-w-[14ch] text-editorial opacity-0">
          Cette page n'existe pas
        </h1>

        <p
          data-notfound-block
          className="mt-6 max-w-[44ch] text-[0.9375rem] leading-relaxed text-sage opacity-0"
        >
          Le lien est peut-être ancien, ou la pièce n'est plus en ligne.
        </p>

        <div data-notfound-block className="mt-9 flex flex-wrap gap-3 opacity-0">
          <ButtonLink href="/">Retour à l'accueil</ButtonLink>
          <ButtonLink href="/boutique" variant="outline">
            Voir la boutique
          </ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}
