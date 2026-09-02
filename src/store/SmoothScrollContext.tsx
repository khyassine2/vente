import type Lenis from 'lenis';
import type { RefObject } from 'react';
import { createContext, use } from 'react';

type SmoothScrollValue = {
  lenis: RefObject<Lenis | null>;
};

export const SmoothScrollContext = createContext<SmoothScrollValue | null>(null);

/** Access to the shared Lenis instance for locking or programmatic scrolls. */
export const useLenis = () => {
  const context = use(SmoothScrollContext);
  return context?.lenis ?? null;
};
