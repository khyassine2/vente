const priceFormatter = new Intl.NumberFormat('fr-MA', {
  maximumFractionDigits: 0,
});

/** Formats an amount in dirhams, e.g. `449 DH`. */
export const formatPrice = (amount: number) =>
  `${priceFormatter.format(Math.round(amount))} DH`;

/** Builds a width-constrained Unsplash URL for responsive loading. */
export const imageUrl = (source: string, width: number) =>
  `${source}?auto=format&fit=crop&q=72&w=${width}`;

export const imageSrcSet = (source: string) =>
  [480, 768, 1024, 1440, 1920]
    .map(width => `${imageUrl(source, width)} ${width}w`)
    .join(', ');
