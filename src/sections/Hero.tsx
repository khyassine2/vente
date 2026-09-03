'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/animations/gsap';
import { splitText } from '@/animations/splitText';
import { Magnetic } from '@/components/Magnetic';
import { ProductImage } from '@/components/ProductImage';
import { useGsapContext } from '@/hooks/useGsapContext';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d';

// Three short proofs sit under the calls to action instead of an empty panel.
const HERO_PROOFS = [
  { title: 'Coupé à la main', detail: 'Atelier de Casablanca' },
  { title: 'Livraison offerte', detail: 'Dès 800 MAD' },
  { title: 'Retours 14 jours', detail: 'Échange sans frais' },
];

export const Hero = () => {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGsapContext(rootRef, () => {
    const heading = headingRef.current;

    if (prefersReducedMotion()) {
      gsap.set('[data-hero-fade], [data-hero-arch]', { autoAlpha: 1, y: 0, scale: 1 });
      if (heading) {
        gsap.set(heading, { autoAlpha: 1 });
      }
      return;
    }

    const split = heading ? splitText(heading, { by: 'lines' }) : null;
    if (heading) {
      gsap.set(heading, { autoAlpha: 1 });
    }

    const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } });

    timeline.fromTo(
      '[data-hero-arch]',
      { autoAlpha: 0, scale: 0.94, y: 24 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 1.3 },
      0.1,
    );

    if (split) {
      timeline.fromTo(
        split.targets,
        { yPercent: 118 },
        { yPercent: 0, duration: 1.1, stagger: 0.08 },
        0.2,
      );
    }

    timeline.fromTo(
      '[data-hero-fade]',
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08 },
      0.5,
    );

    return () => split?.revert();
  });

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-[linear-gradient(180deg,#faf7f2_0%,#f4ece0_55%,#ecdfcc_100%)] pt-28 pb-20 text-ink md:pt-36 md:pb-28"
    >
      {/* A single warm wash off the top-right keeps the ground from going flat
          without muddying the paper the type sits on. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_78%_18%,rgba(227,213,193,0.55)_0%,transparent_68%)]"
      />

      <div className="shell relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <p
            data-hero-fade
            className="flex items-center justify-center gap-3 label-micro text-forest opacity-0 lg:justify-start"
          >
            <span aria-hidden className="h-px w-8 bg-terracotta" />
            Nouvelle saison
          </p>

          <h1
            ref={headingRef}
            className="mt-6 font-display text-display font-light text-forest opacity-0"
          >
            Fil
            <span className="text-terracotta">&amp;</span>
            Ligne
          </h1>

          <p
            data-hero-fade
            className="mx-auto mt-6 max-w-[46ch] text-base leading-relaxed text-ink/75 opacity-0 lg:mx-0"
          >
            Des pièces coupées à la main, élégantes et intemporelles, pensées
            pour accompagner vos journées avec douceur.
          </p>

          <div
            data-hero-fade
            className="mt-10 flex flex-wrap items-center justify-center gap-4 opacity-0 lg:justify-start"
          >
            <Magnetic>
              <Link
                href="/boutique"
                className="inline-flex h-12 items-center justify-center bg-forest px-9 label-micro text-paper transition-colors duration-300 hover:bg-ink"
              >
                Découvrir la collection
              </Link>
            </Magnetic>

            <Link
              href="/atelier"
              className="link-underline label-micro text-forest transition-opacity duration-300 hover:opacity-70"
            >
              Notre atelier
            </Link>
          </div>

          <ul
            data-hero-fade
            className="mt-12 grid grid-cols-1 gap-6 border-t border-forest/12 pt-8 opacity-0 sm:grid-cols-3"
          >
            {HERO_PROOFS.map(proof => (
              <li key={proof.title} className="text-center lg:text-left">
                <p className="label-micro text-forest">{proof.title}</p>
                <p className="mt-2 text-[0.8125rem] text-ink/60">{proof.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* The photograph leads; a narrower arch beside it carries the season
            note so the pairing reads as editorial rather than decorative. */}
        <div className="relative mx-auto flex w-full max-w-md items-end justify-center gap-5 lg:max-w-none lg:justify-end">
          <div
            data-hero-arch
            className="relative aspect-[3/4] w-[64%] overflow-hidden rounded-t-[999px] bg-paper-dim opacity-0 shadow-[0_40px_80px_-32px_rgba(31,61,51,0.45)]"
          >
            <ProductImage
              source={HERO_IMAGE}
              alt="Silhouette en lin devant un mur clair"
              sizes="(min-width: 1024px) 32vw, 60vw"
              priority
              className="size-full object-cover object-[50%_25%]"
            />
          </div>

          <div
            data-hero-arch
            className="relative flex aspect-[9/16] w-[36%] flex-col justify-between overflow-hidden rounded-t-[999px] bg-forest p-6 text-paper opacity-0 shadow-[0_40px_80px_-32px_rgba(31,61,51,0.5)]"
          >
            <p className="pt-6 text-center font-display text-2xl leading-none tracking-[0.14em] uppercase">
              F
              <span className="text-terracotta">&amp;</span>
              L
            </p>

            <div className="text-center">
              <p className="font-display text-3xl leading-none">24</p>
              <p className="mt-3 label-micro text-paper/60">
                Pièces en série limitée
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
