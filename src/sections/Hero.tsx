import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { parallaxImage } from '@/animations';
import { gsap, prefersReducedMotion } from '@/animations/gsap';
import { splitText } from '@/animations/splitText';
import { Magnetic } from '@/components/Magnetic';
import { ProductImage } from '@/components/ProductImage';
import { useGsapContext } from '@/hooks/useGsapContext';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d';

export const Hero = () => {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGsapContext(rootRef, () => {
    const heading = headingRef.current;

    if (prefersReducedMotion()) {
      gsap.set('[data-hero-fade], [data-hero-frame]', {
        autoAlpha: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
      });
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

    timeline
      .fromTo(
        '[data-hero-frame]',
        { clipPath: 'inset(0% 0% 100% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5 },
        0,
      )
      .fromTo(
        imageRef.current,
        { scale: 1.25 },
        { scale: 1, duration: 1.9 },
        0,
      );

    if (split) {
      timeline.fromTo(
        split.targets,
        { yPercent: 118 },
        { yPercent: 0, duration: 1.25, stagger: 0.09 },
        0.35,
      );
    }

    timeline.fromTo(
      '[data-hero-fade]',
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 },
      0.75,
    );

    if (imageRef.current) {
      parallaxImage(imageRef.current, { amount: 8, trigger: rootRef.current ?? undefined });
    }

    return () => split?.revert();
  });

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[92svh] flex-col justify-end overflow-hidden bg-forest text-paper"
    >
      <div data-hero-frame className="absolute inset-0">
        <ProductImage
          ref={imageRef}
          source={HERO_IMAGE}
          alt="Silhouette en lin devant un mur clair"
          sizes="100vw"
          priority
          className="size-full scale-110 object-cover object-[50%_35%]"
        />
        {/* Scrims keep both the nav and the headline legible over the photo. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-ink/80 via-ink/30 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-ink/55 to-transparent"
        />
      </div>

      {/* Extra bottom padding on mobile keeps the CTAs clear of the floating
          WhatsApp button. */}
      <div className="shell relative z-10 pt-32 pb-24 md:pb-20">
        <p data-hero-fade className="label-micro text-paper/70">
          Collection Automne — Rabat
        </p>

        <h1
          ref={headingRef}
          className="mt-5 max-w-[18ch] font-display text-display font-light opacity-0"
        >
          Des pièces coupées pour durer
        </h1>

        <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
          <p
            data-hero-fade
            className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-paper/80"
          >
            Un atelier, une trentaine de pièces par saison, des matières
            choisies pour le climat d'ici. Rien de plus que ce qui se porte.
          </p>

          <div data-hero-fade className="flex flex-wrap items-start gap-3">
            <Magnetic>
              <Link
                to="/boutique/nouveautes"
                className="inline-flex h-6 items-center justify-center bg-paper px-7 label-micro text-ink transition-colors duration-300 hover:bg-terracotta hover:text-paper"
              >
                Voir les nouveautés
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                to="/collections"
                className="inline-flex h-6 items-center justify-center border border-paper/40 px-7 label-micro text-paper transition-colors duration-300 hover:border-paper hover:bg-paper/10"
              >
                Les collections
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
};
