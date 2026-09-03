const priceFormatter = new Intl.NumberFormat('fr-MA', {
  maximumFractionDigits: 0,
});

/** Formats an amount in dirhams, e.g. `449 DH`. */
export const formatPrice = (amount: number) =>
  `${priceFormatter.format(Math.round(amount))} DH`;
