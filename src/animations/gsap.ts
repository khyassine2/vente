import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, Flip);

gsap.defaults({ ease: 'power3.out', duration: 0.9 });

export { Flip, gsap, ScrollTrigger };

/** True when the visitor asked the system to limit motion. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Desktop-class pointer, used to gate cursor and hover-only choreography. */
export const isFinePointer = () =>
  typeof window !== 'undefined'
  && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export const BREAKPOINT = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const;

export const DURATION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
  reveal: 1.4,
} as const;

export const EASE = {
  editorial: 'expo.out',
  soft: 'power3.out',
  inOut: 'power2.inOut',
} as const;
