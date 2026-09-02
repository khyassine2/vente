import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/animations/gsap';

const WHATSAPP_NUMBER = '212600000000';
const MESSAGE = encodeURIComponent(
  'Bonjour Fil & Ligne, je souhaite des informations sur une pièce.',
);

/** Floating contact CTA — the primary support channel for Moroccan shoppers. */
export const WhatsAppButton = () => {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || prefersReducedMotion()) {
      return;
    }

    const tween = gsap.fromTo(
      element,
      { autoAlpha: 0, scale: 0.7, y: 12 },
      {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        ease: 'back.out(2)',
        delay: 1.6,
      },
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <a
      ref={ref}
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Nous contacter sur WhatsApp"
      data-cursor="WhatsApp"
      className="group fixed right-4 bottom-4 z-80 flex h-6.5 w-6.5 items-center justify-center gap-3 rounded-full bg-[#1f8a52] text-paper shadow-[0_6px_24px_rgba(20,32,27,0.18)] transition-colors duration-300 hover:bg-[#186c40] sm:right-6 sm:bottom-6 sm:h-6 sm:w-auto sm:pr-5 sm:pl-4"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="size-5 shrink-0 fill-current"
      >
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.22 8.24c0 4.54-3.69 8.24-8.23 8.24Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.09-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.51c.12.17 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.29Z" />
      </svg>
      <span className="label-micro hidden sm:inline">Écrivez-nous</span>
    </a>
  );
};
