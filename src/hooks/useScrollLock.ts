import { useEffect } from 'react';
import { useLenis } from '@/store/SmoothScrollContext';

/** Freezes page scroll — Lenis and native — while an overlay is open. */
export const useScrollLock = (locked: boolean) => {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) {
      return;
    }

    const instance = lenis?.current;
    const previousOverflow = document.body.style.overflow;

    instance?.stop();
    document.body.style.overflow = 'hidden';

    return () => {
      instance?.start();
      document.body.style.overflow = previousOverflow;
    };
  }, [locked, lenis]);
};
