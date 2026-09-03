'use client';

import { useRef } from 'react';
import { fadeUp, parallaxImage, revealImage, revealText } from '@/animations';
import { ButtonLink } from '@/components/Button';
import { PageShell } from '@/components/PageShell';
import { ProductImage } from '@/components/ProductImage';
import { useGsapContext } from '@/hooks/useGsapContext';

const COVER = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04';

const STEPS = [
  {
    year: '01',
    title: 'Le patron',
    body: 'Tout part d\'un tracé à plat, repris sur mannequin jusqu\'à ce que l\'aplomb soit juste. Un modèle demande entre quatre et douze essayages.',
  },
  {
    year: '02',
    title: 'La matière',
    body: 'Lins, cotons et laines choisis chez des tisserands que nous visitons. Rien qui ne supporte pas trente lavages.',
  },
  {
    year: '03',
    title: 'La coupe',
    body: 'Les pièces sont coupées à Rabat, par séries de trente à cent. Ce qui ne passe pas le contrôle ne part pas.',
  },
  {
    year: '04',
    title: 'La retouche',
    body: 'Ourlets et reprises faits sur place, offerts. Une pièce mal ajustée est une pièce qu\'on ne porte pas.',
  },
];

export default function AtelierPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGsapContext(rootRef, () => {
    const split = titleRef.current
      ? revealText(titleRef.current, { start: 'top 95%' })
      : null;

    fadeUp('[data-atelier-meta]', { start: 'top 95%', delay: 0.1 });

    if (frameRef.current) {
      revealImage(frameRef.current, { inner: imageRef.current });
    }

    if (imageRef.current && frameRef.current) {
      parallaxImage(imageRef.current, { amount: 8, trigger: frameRef.current });
    }

    fadeUp('[data-atelier-step]', { stagger: 0.09, distance: 40 });

    return () => split?.revert();
  });

  return (
    <PageShell>
      <div ref={rootRef} className="pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="shell">
          <p data-atelier-meta className="label-micro text-sage opacity-0">
            L'atelier
          </p>

          <h1
            ref={titleRef}
            className="mt-4 max-w-[15ch] text-editorial opacity-0"
          >
            Trois paires de mains, rue des Consuls
          </h1>

          <p
            data-atelier-meta
            className="mt-6 max-w-[54ch] text-[0.9375rem] leading-relaxed text-sage opacity-0"
          >
            Fil & Ligne est né en 2019 dans un appartement de la médina de
            Rabat, avec une machine et deux rouleaux de lin. Nous sommes
            aujourd'hui six, dans un atelier de quatre-vingts mètres carrés où
            tout se coupe et se coud sur place.
          </p>
        </div>

        <div
          ref={frameRef}
          className="relative mt-14 aspect-[16/10] overflow-hidden bg-paper-dim md:mt-20 md:aspect-[21/9]"
        >
          <ProductImage
            ref={imageRef}
            source={COVER}
            alt="Atelier de couture avec tissus et machines"
            sizes="100vw"
            className="absolute inset-0 size-full scale-110 object-cover"
          />
        </div>

        <div className="shell mt-16 md:mt-24">
          <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(step => (
              <li key={step.year} data-atelier-step className="opacity-0">
                <span className="label-micro text-terracotta tabular-nums">
                  {step.year}
                </span>
                <h2 className="mt-4 font-display text-2xl leading-tight">
                  {step.title}
                </h2>
                <p className="mt-3 max-w-[34ch] text-[0.875rem] leading-relaxed text-sage">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div
            data-atelier-step
            className="mt-20 border-t border-line pt-10 opacity-0 md:mt-28"
          >
            <h2 className="max-w-[18ch] text-section">
              Passez nous voir, sur rendez-vous
            </h2>
            <p className="mt-5 max-w-[48ch] text-[0.9375rem] leading-relaxed text-sage">
              L'atelier reçoit du mardi au samedi. Nous prenons vos mesures,
              vous essayez les pièces en stock, et nous ajustons sur place.
            </p>
            <ButtonLink href="/rendez-vous" className="mt-8">
              Prendre rendez-vous
            </ButtonLink>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
