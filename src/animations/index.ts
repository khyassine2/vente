import type { SplitResult } from '@/animations/splitText';
import {
  DURATION,
  EASE,
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
} from '@/animations/gsap';
import { splitText } from '@/animations/splitText';

type ScrollOptions = {
  /** Element that drives the trigger; defaults to the animated target. */
  trigger?: Element;
  start?: string;
  once?: boolean;
};

const scrollDefaults = (target: Element, options: ScrollOptions = {}) => ({
  trigger: options.trigger ?? target,
  start: options.start ?? 'top 82%',
  once: options.once ?? true,
});

/**
 * ScrollTrigger only fires when an element crosses its start line from below,
 * so anything already on screen at mount would stay stuck at opacity 0. This
 * drops the trigger and plays those tweens straight away.
 */
const playIfVisible = <T extends gsap.core.Tween | gsap.core.Timeline>(
  target: Element,
  animation?: T,
) => {
  if (!animation) {
    return;
  }

  const bounds = target.getBoundingClientRect();
  const onScreen = bounds.top < window.innerHeight && bounds.bottom > 0;

  if (onScreen) {
    animation.scrollTrigger?.kill();
    animation.play(0);
  }

  return animation;
};

/**
 * Wipes an image in from its bottom edge while the picture itself settles back
 * to scale 1, so the frame and its contents move at different rates.
 */
export const revealImage = (
  target: Element,
  options: ScrollOptions & { delay?: number; inner?: Element | null } = {},
) => {
  if (prefersReducedMotion()) {
    gsap.set(target, { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1 });
    return;
  }

  const timeline = gsap.timeline({
    defaults: { ease: EASE.editorial },
    delay: options.delay ?? 0,
    scrollTrigger: scrollDefaults(target, options),
  });

  timeline.fromTo(
    target,
    { clipPath: 'inset(0% 0% 100% 0%)', autoAlpha: 1 },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: DURATION.reveal },
  );

  if (options.inner) {
    timeline.fromTo(
      options.inner,
      { scale: 1.18 },
      { scale: 1, duration: DURATION.reveal + 0.4 },
      0,
    );
  }

  return playIfVisible(target, timeline);
};

/**
 * Splits a heading into lines and slides each one up from its own mask.
 * Returns the split so callers can revert the DOM on unmount.
 */
export const revealText = (
  target: HTMLElement,
  options: ScrollOptions & {
    delay?: number;
    stagger?: number;
    by?: 'lines' | 'words';
  } = {},
): SplitResult | undefined => {
  if (prefersReducedMotion()) {
    gsap.set(target, { autoAlpha: 1 });
    return;
  }

  const split = splitText(target, { by: options.by });
  gsap.set(target, { autoAlpha: 1 });

  const tween = gsap.fromTo(
    split.targets,
    { yPercent: 118 },
    {
      yPercent: 0,
      duration: DURATION.slow,
      ease: EASE.editorial,
      stagger: options.stagger ?? 0.08,
      delay: options.delay ?? 0,
      scrollTrigger: scrollDefaults(target, options),
    },
  );

  playIfVisible(target, tween);

  return split;
};

/** Standard entrance for supporting content: a short lift with a fade. */
export const fadeUp = (
  targets: gsap.TweenTarget,
  options: ScrollOptions & {
    delay?: number;
    stagger?: number;
    distance?: number;
  } = {},
) => {
  const first = gsap.utils.toArray<Element>(targets)[0];
  if (!first) {
    return;
  }

  if (prefersReducedMotion()) {
    gsap.set(targets, { autoAlpha: 1, y: 0 });
    return;
  }

  const tween = gsap.fromTo(
    targets,
    { autoAlpha: 0, y: options.distance ?? 32 },
    {
      autoAlpha: 1,
      y: 0,
      duration: DURATION.base,
      ease: EASE.soft,
      stagger: options.stagger ?? 0.09,
      delay: options.delay ?? 0,
      scrollTrigger: scrollDefaults(first, options),
    },
  );

  return playIfVisible(first, tween);
};

/**
 * Draws a hairline rule out from its left edge as the section arrives. Used to
 * separate editorial blocks without a hard border.
 */
export const drawRule = (
  targets: gsap.TweenTarget,
  options: ScrollOptions = {},
) => {
  const first = gsap.utils.toArray<Element>(targets)[0];
  if (!first) {
    return;
  }

  if (prefersReducedMotion()) {
    gsap.set(targets, { scaleX: 1 });
    return;
  }

  const tween = gsap.fromTo(
    targets,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1,
      duration: DURATION.slow,
      ease: EASE.inOut,
      scrollTrigger: scrollDefaults(first, options),
    },
  );

  return playIfVisible(first, tween);
};

/**
 * Drifts an oversized image inside its frame as the frame crosses the
 * viewport. The image must be taller than its container for this to read.
 */
export const parallaxImage = (
  target: Element,
  options: { amount?: number; trigger?: Element } = {},
) => {
  if (prefersReducedMotion()) {
    return;
  }

  const amount = options.amount ?? 12;

  return gsap.fromTo(
    target,
    { yPercent: -amount },
    {
      yPercent: amount,
      ease: 'none',
      scrollTrigger: {
        trigger: options.trigger ?? target,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    },
  );
};

/**
 * Loops a strip horizontally forever. The caller must render the content twice
 * so the halfway reset lands on an identical frame.
 */
export const marquee = (
  target: Element,
  options: { duration?: number; reverse?: boolean } = {},
) => {
  if (prefersReducedMotion()) {
    return;
  }

  return gsap.to(target, {
    xPercent: options.reverse ? 50 : -50,
    duration: options.duration ?? 28,
    ease: 'none',
    repeat: -1,
  });
};

/**
 * Pulls a button toward the pointer while it hovers, then releases it with a
 * little overshoot. Returns a disposer that removes the listeners.
 */
export const magneticButton = (
  element: HTMLElement,
  options: { strength?: number; label?: HTMLElement | null } = {},
) => {
  if (prefersReducedMotion()) {
    return () => undefined;
  }

  const strength = options.strength ?? 0.35;
  const setX = gsap.quickTo(element, 'x', { duration: 0.5, ease: EASE.soft });
  const setY = gsap.quickTo(element, 'y', { duration: 0.5, ease: EASE.soft });
  const label = options.label;
  const setLabelX = label
    ? gsap.quickTo(label, 'x', { duration: 0.6, ease: EASE.soft })
    : null;
  const setLabelY = label
    ? gsap.quickTo(label, 'y', { duration: 0.6, ease: EASE.soft })
    : null;

  const onMove = (event: PointerEvent) => {
    const bounds = element.getBoundingClientRect();
    const x = event.clientX - (bounds.left + bounds.width / 2);
    const y = event.clientY - (bounds.top + bounds.height / 2);
    setX(x * strength);
    setY(y * strength);
    setLabelX?.(x * strength * 0.45);
    setLabelY?.(y * strength * 0.45);
  };

  const onLeave = () => {
    gsap.to(element, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    if (label) {
      gsap.to(label, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    }
  };

  element.addEventListener('pointermove', onMove);
  element.addEventListener('pointerleave', onLeave);

  return () => {
    element.removeEventListener('pointermove', onMove);
    element.removeEventListener('pointerleave', onLeave);
  };
};

/** Fades and lifts a page's content in after a route change. */
export const pageTransition = (root: HTMLElement) => {
  if (prefersReducedMotion()) {
    gsap.set(root, { autoAlpha: 1, y: 0 });
    return;
  }

  return gsap.fromTo(
    root,
    { autoAlpha: 0, y: 24 },
    { autoAlpha: 1, y: 0, duration: DURATION.base, ease: EASE.editorial },
  );
};

/** Tweens a numeric readout, used by the cart total. */
export const animateNumber = (
  element: HTMLElement,
  from: number,
  to: number,
  format: (value: number) => string,
) => {
  if (prefersReducedMotion() || from === to) {
    element.textContent = format(to);
    return;
  }

  const state = { value: from };

  return gsap.to(state, {
    value: to,
    duration: DURATION.base,
    ease: EASE.soft,
    onUpdate: () => {
      element.textContent = format(state.value);
    },
  });
};

/** Refreshes measurements once late-loading images settle. */
export const refreshScrollTriggers = () => {
  ScrollTrigger.refresh();
};
