'use client';

import { useEffect, useRef } from 'react';
import { magneticButton } from '@/animations';
import { isFinePointer } from '@/animations/gsap';

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
};

/** Wraps an interactive element so it drifts toward the pointer on hover. */
export const Magnetic = (props: MagneticProps) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || !isFinePointer()) {
      return;
    }

    return magneticButton(element, { strength: props.strength });
  }, [props.strength]);

  // `items-start` keeps the wrapped control at its own height rather than
  // stretching it to the row; `self-start` does the same for the wrapper.
  return (
    <span
      ref={ref}
      className={`inline-flex items-start self-start ${props.className ?? ''}`}
    >
      {props.children}
    </span>
  );
};
