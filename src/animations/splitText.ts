export type SplitResult = {
  /** The wrapping elements whose inner span is the animation target. */
  lines: HTMLElement[];
  /** The inner spans to translate. */
  targets: HTMLElement[];
  /** Restores the element's original markup. */
  revert: () => void;
};

type SplitOptions = {
  /** Split into words rather than measuring rendered line boxes. */
  by?: 'lines' | 'words';
};

const wrap = (text: string) => {
  const line = document.createElement('span');
  line.className = 'split-line';
  const inner = document.createElement('span');
  inner.textContent = text;
  line.append(inner);
  return { line, inner };
};

/**
 * Splits an element's text into overflow-hidden line or word wrappers so a
 * timeline can slide each one independently. GSAP's SplitText is a paid
 * plugin, so this covers the cases the site needs.
 */
export const splitText = (
  element: HTMLElement,
  options: SplitOptions = {},
): SplitResult => {
  const original = element.innerHTML;
  const source = element.textContent ?? '';
  const revert = () => {
    element.innerHTML = original;
  };

  if (options.by === 'words') {
    element.textContent = '';
    const lines: HTMLElement[] = [];
    const targets: HTMLElement[] = [];

    for (const word of source.split(/\s+/).filter(Boolean)) {
      const { line, inner } = wrap(word);
      line.style.display = 'inline-block';
      element.append(line, document.createTextNode(' '));
      lines.push(line);
      targets.push(inner);
    }

    return { lines, targets, revert };
  }

  // Measure real line boxes: lay every word out, then group by offsetTop.
  // Probes stay inline so the browser wraps them exactly as the original text.
  element.textContent = '';
  const probes = source
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const probe = document.createElement('span');
      probe.textContent = word;
      element.append(probe, document.createTextNode(' '));
      return probe;
    });

  const rows = new Map<number, string[]>();
  for (const probe of probes) {
    const top = Math.round(probe.offsetTop);
    const row = rows.get(top);
    if (row) {
      row.push(probe.textContent ?? '');
    } else {
      rows.set(top, [probe.textContent ?? '']);
    }
  }

  element.textContent = '';
  const lines: HTMLElement[] = [];
  const targets: HTMLElement[] = [];

  // Sort by vertical position: Map insertion order is not guaranteed to match
  // visual order once a word wraps back onto an earlier line.
  const ordered = [...rows.entries()].toSorted(([a], [b]) => a - b);

  for (const [, words] of ordered) {
    const { line, inner } = wrap(words.join(' '));
    element.append(line);
    lines.push(line);
    targets.push(inner);
  }

  return { lines, targets, revert };
};
