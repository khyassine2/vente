'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { fadeUp, parallaxImage, revealImage, revealText } from '@/animations';
import { ProductImage } from '@/components/ProductImage';
import { useGsapContext } from '@/hooks/useGsapContext';

const IMAGE = 'https://images.unsplash.com/photo-1483118714900-540cf339fd46';

export const Editorial = () => {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGsapContext(rootRef, () => {
    const split = headingRef.current ? revealText(headingRef.current) : null;

    if (frameRef.current) {
      revealImage(frameRef.current, { inner: imageRef.current });
    }

    if (imageRef.current && frameRef.current) {
      parallaxImage(imageRef.current, {
        amount: 10,
        trigger: frameRef.current,
      });
    }

    fadeUp('[data-editorial-body]', { stagger: 0.08, delay: 0.1 });

    return () => split?.revert();
  });

  return (
    <section ref={rootRef} className="shell py-20 md:py-32">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div
          ref={frameRef}
          className="relative aspect-[4/5] overflow-hidden bg-paper-dim lg:aspect-[3/4]"
        >
          <ProductImage
            ref={imageRef}
            source={IMAGE}
            alt="Atelier de couture, tissu en cours de coupe"
            sizes="(min-width: 1024px) 46vw, 92vw"
            className="absolute inset-0 size-full scale-110 object-cover"
          />
        </div>

        <div>
          <p data-editorial-body className="label-micro text-sage opacity-0">
            L'atelier
          </p>

          <h2
            ref={headingRef}
            className="mt-5 max-w-[16ch] text-editorial opacity-0"
          >
            On coupe peu, on coupe bien
          </h2>

          <div
            data-editorial-body
            className="mt-8 max-w-[52ch] space-y-5 text-[0.9375rem] leading-relaxed text-sage opacity-0"
          >
            <p>
              Chaque pièce part d'un patron que l'on retouche sur mannequin
              jusqu'à ce qu'elle tombe juste. Ce qui ne passe pas cette étape ne
              sort pas de l'atelier.
            </p>
            <p>
              Nous travaillons avec des tisserands du nord du pays et des
              filatures européennes qui nous laissent voir leurs ateliers. Les
              séries sont courtes — entre trente et cent pièces — parce que
              c'est ce que trois paires de mains savent bien faire.
            </p>
          </div>

          <div data-editorial-body className="mt-9 opacity-0">
            <Link href="/atelier" className="link-underline label-micro text-ink">
              Visiter l'atelier
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
