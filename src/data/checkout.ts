export type PaymentMethod = 'cod' | 'card' | 'transfer';

export const PAYMENT_METHODS: {
  value: PaymentMethod;
  label: string;
  hint: string;
}[] = [
  {
    value: 'cod',
    label: 'Paiement à la livraison',
    hint: 'Vous réglez en espèces au livreur, à la remise du colis.',
  },
  {
    value: 'card',
    label: 'Carte bancaire',
    hint: 'Paiement sécurisé au moment de la confirmation.',
  },
  {
    value: 'transfer',
    label: 'Virement',
    hint: 'Nos coordonnées vous sont envoyées par e-mail.',
  },
];

export const CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Tanger',
  'Fès',
  'Agadir',
  'Meknès',
  'Oujda',
  'Tétouan',
  'Essaouira',
];

export type CheckoutFields = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
  payment: PaymentMethod;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Moroccan mobile and landline numbers, with or without the +212 prefix.
const PHONE_PATTERN = /^(?:\+212|0)\s?[5-7](?:[\s.-]?\d){8}$/;

/** Validates the shipping form; returns one message per invalid field. */
export const validateCheckout = (fields: CheckoutFields): CheckoutErrors => {
  const errors: CheckoutErrors = {};

  if (fields.firstName.trim().length < 2) {
    errors.firstName = 'Indiquez votre prénom.';
  }

  if (fields.lastName.trim().length < 2) {
    errors.lastName = 'Indiquez votre nom.';
  }

  if (!EMAIL_PATTERN.test(fields.email.trim())) {
    errors.email = 'Adresse e-mail invalide.';
  }

  if (!PHONE_PATTERN.test(fields.phone.trim())) {
    errors.phone = 'Numéro marocain invalide.';
  }

  if (fields.address.trim().length < 6) {
    errors.address = 'Adresse trop courte.';
  }

  if (!fields.city) {
    errors.city = 'Choisissez une ville.';
  }

  if (!/^\d{5}$/.test(fields.postalCode.trim())) {
    errors.postalCode = 'Code postal à 5 chiffres.';
  }

  return errors;
};

/** Builds the reference shown on the confirmation screen. */
export const orderReference = () =>
  `FL-${Date.now().toString(36).toUpperCase().slice(-6)}`;
