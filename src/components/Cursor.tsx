'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, isFinePointer, prefersReducedMotion } from '@/animations/gsap';

/**
 * A two-part cursor: a small dot that tracks precisely and a ring that lags
 * behind and expands over interactive elements. Never mounted on touch.
 */
export const Cursor = () => {
  // Starts false to match the server render; an effect flips it after mount,
  // once `window` is available, so hydration never sees mismatched output.
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setEnabled(isFinePointer() && !prefersReducedMotion());
  }, []);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;

    if (!enabled || !dot || !ring || !label) {
      return;
    }

    document.documentElement.classList.add('has-custom-cursor');

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });

    let visible = false;

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
      }

      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);

      const target = event.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>(
        'a, button, [data-cursor]',
      );
      const cursorLabel = interactive?.dataset.cursor;

      gsap.to(ring, {
        scale: interactive ? 1.9 : 1,
        backgroundColor: cursorLabel
          ? 'rgba(20, 32, 27, 0.92)'
          : 'rgba(20, 32, 27, 0)',
        borderColor: interactive
          ? 'rgba(20, 32, 27, 0)'
          : 'rgba(20, 32, 27, 0.45)',
        duration: 0.4,
        ease: 'power3.out',
      });

      if (label.textContent !== (cursorLabel ?? '')) {
        label.textContent = cursorLabel ?? '';
      }

      gsap.to(label, { autoAlpha: cursorLabel ? 1 : 0, duration: 0.25 });
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('has-custom-cursor');
      gsap.killTweensOf([dot, ring, label]);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-200">
      <div
        ref={ringRef}
        className="absolute -top-5 -left-5 flex size-5 items-center justify-center rounded-full border border-forest/45 opacity-0 will-change-transform"
      >
        <span
          ref={labelRef}
          className="label-micro scale-[0.55] text-paper opacity-0"
        />
      </div>
      <div
        ref={dotRef}
        className="absolute -top-[3px] -left-[3px] size-1.5 rounded-full bg-forest opacity-0 will-change-transform"
      />
    </div>
  );
};
