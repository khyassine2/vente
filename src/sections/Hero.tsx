'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/animations/gsap';
import { splitText } from '@/animations/splitText';
import { Magnetic } from '@/components/Magnetic';
import { ProductImage } from '@/components/ProductImage';
import { useGsapContext } from '@/hooks/useGsapContext';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d';

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
      className="relative overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,#efe4d2_0%,#e8d8bd_38%,#d8c19c_72%,#c7a878_100%)] py-20 md:py-28"
    >
      {/* Soft top glow, echoing the arch light in the reference layout. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(255,252,244,0.65)_0%,transparent_70%)]"
      />

      <div className="shell relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="text-center lg:text-left">
          <p data-hero-fade className="label-micro text-forest/70 opacity-0">
            Nouvelle saison
          </p>

          <h1
            ref={headingRef}
            className="mt-5 font-display text-display font-light text-ink opacity-0"
          >
            Fil
            <span className="text-terracotta">&amp;</span>
            Ligne
          </h1>

          <p
            data-hero-fade
            className="mx-auto mt-6 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink/70 opacity-0 lg:mx-0"
          >
            Des pièces coupées à la main, élégantes et intemporelles, pensées
            pour accompagner vos journées avec douceur.
          </p>

          <div
            data-hero-fade
            className="mt-9 flex flex-wrap items-center justify-center gap-3 opacity-0 lg:justify-start"
          >
            <Magnetic>
              <Link
                href="/boutique"
                className="inline-flex h-6 items-center justify-center bg-forest px-8 label-micro text-paper transition-colors duration-300 hover:bg-ink"
              >
                Découvrir la collection
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Two nested arches: the photograph, and a smaller wordmark arch
            beside it — mirrors the reference layout while staying inside the
            site's own palette and type. */}
        <div className="relative mx-auto flex w-full max-w-md items-end justify-center gap-4 lg:max-w-none lg:justify-end">
          <div
            data-hero-arch
            className="relative aspect-[3/4] w-[68%] overflow-hidden rounded-t-[999px] bg-paper-dim opacity-0 shadow-[0_30px_60px_-20px_rgba(20,32,27,0.35)]"
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
            className="relative flex aspect-[3/4] w-[38%] flex-col items-center justify-center gap-4 self-stretch overflow-hidden rounded-t-[999px] border border-forest/15 bg-paper/70 opacity-0 shadow-[0_20px_50px_-25px_rgba(20,32,27,0.3)] backdrop-blur-sm"
          >
            <p className="rotate-0 font-display text-3xl leading-none tracking-[0.14em] text-forest uppercase">
              F
              <span className="text-terracotta">&amp;</span>
              L
            </p>
            <span aria-hidden className="text-terracotta">✦</span>
            <p className="label-micro px-4 text-center text-forest/70">
              Fil & Ligne
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
