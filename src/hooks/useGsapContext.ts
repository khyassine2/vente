import type { DependencyList, RefObject } from 'react';
import { useEffect } from 'react';
import { gsap } from '@/animations/gsap';

type ContextSetup = (context: gsap.Context) => void;

/**
 * Scopes a set of GSAP animations to a container and reverts them — tweens,
 * ScrollTriggers and inline styles alike — when the component unmounts.
 */
export const useGsapContext = (
  scope: RefObject<HTMLElement | null>,
  setup: ContextSetup,
  dependencies: DependencyList = [],
) => {
  useEffect(() => {
    const element = scope.current;
    if (!element) {
      return;
    }

    const context = gsap.context((self) => {
      setup(self);
    }, element);

    return () => context.revert();
    // The setup closure is intentionally re-run only on explicit dependencies.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};
