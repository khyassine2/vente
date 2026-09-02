import Lenis from 'lenis';
import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/animations/gsap';

/**
 * Single source of truth for scrolling: Lenis is driven by the GSAP ticker and
 * reports every frame to ScrollTrigger, so the two never run competing loops.
 */
export const useSmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      // GSAP reports seconds; Lenis expects milliseconds.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
};
