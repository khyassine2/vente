import { useRef } from 'react';
import { marquee } from '@/animations';
import { useGsapContext } from '@/hooks/useGsapContext';

const ITEMS = [
  'Coupé en petites séries',
  'Matières naturelles',
  'Livraison partout au Maroc',
  'Paiement à la livraison',
  'Retouches offertes',
];

export const Marquee = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGsapContext(rootRef, () => {
    if (trackRef.current) {
      marquee(trackRef.current, { duration: 34 });
    }
  });

  return (
    <section
      aria-label="Nos engagements"
      className="overflow-hidden border-y border-line bg-sand/40 py-4"
    >
      <div ref={rootRef}>
        {/* The list is rendered twice so the halfway reset is seamless. */}
        <div ref={trackRef} className="flex w-max items-center">
          {[0, 1].map(pass => (
            <ul key={pass} aria-hidden={pass === 1} className="flex items-center">
              {ITEMS.map(item => (
                <li
                  key={item}
                  className="flex shrink-0 items-center gap-8 px-8 label-micro text-forest"
                >
                  <span>{item}</span>
                  <span aria-hidden className="text-terracotta">
                    ✦
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
};
