'use client';

import { createContext, use, useRef } from 'react';
import { Flip, prefersReducedMotion } from '@/animations/gsap';

type FlipState = ReturnType<typeof Flip.getState>;

type FlipValue = {
  /** Records the card image the user clicked so the detail page can match it. */
  capture: (productId: string, element: HTMLElement) => void;
  /** Consumes a pending capture; returns null when navigation was not a click. */
  consume: (productId: string) => FlipState | null;
};

export const FlipContext = createContext<FlipValue | null>(null);

export const FlipProvider = (props: { children: React.ReactNode }) => {
  const pending = useRef<{ id: string; state: FlipState } | null>(null);

  const value: FlipValue = {
    capture: (productId, element) => {
      if (prefersReducedMotion()) {
        return;
      }

      pending.current = { id: productId, state: Flip.getState(element) };
    },
    consume: (productId) => {
      const entry = pending.current;
      pending.current = null;

      return entry && entry.id === productId ? entry.state : null;
    },
  };

  return <FlipContext value={value}>{props.children}</FlipContext>;
};

export const useFlipTransition = () => use(FlipContext);
