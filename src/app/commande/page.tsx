'use client';

import type { CheckoutErrors, CheckoutFields } from '@/data/checkout';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { fadeUp, revealText } from '@/animations';
import { gsap, prefersReducedMotion } from '@/animations/gsap';
import { ButtonLink } from '@/components/Button';
import { PageShell } from '@/components/PageShell';
import { ProductImage } from '@/components/ProductImage';
import {
  CITIES,
  orderReference,
  PAYMENT_METHODS,
  validateCheckout,
} from '@/data/checkout';
import { useGsapContext } from '@/hooks/useGsapContext';
import { useShop } from '@/store/ShopContext';
import { formatPrice } from '@/utils/format';

const SHIPPING_THRESHOLD = 800;
const SHIPPING_COST = 45;

const EMPTY_FIELDS: CheckoutFields = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  notes: '',
  payment: 'cod',
};

const inputClass = (invalid: boolean) =>
  [
    'min-h-6 w-full border bg-transparent px-4 py-3 text-sm',
    'placeholder:text-stone focus:outline-none',
    invalid ? 'border-terracotta' : 'border-line focus:border-forest',
  ].join(' ');

export default function CheckoutPage() {
  const shop = useShop();
  const [fields, setFields] = useState<CheckoutFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [reference, setReference] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useGsapContext(
    rootRef,
    () => {
      const split = titleRef.current
        ? revealText(titleRef.current, { start: 'top 95%' })
        : null;

      fadeUp('[data-checkout-block]', {
        start: 'top 95%',
        stagger: 0.06,
        delay: 0.1,
      });

      return () => split?.revert();
    },
    [reference],
  );

  const shipping
    = shop.subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = shop.subtotal + shipping;

  const update = (key: keyof CheckoutFields, value: string) => {
    setFields(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const found = validateCheckout(fields);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      const form = formRef.current;
      const firstInvalid = form?.querySelector<HTMLElement>('[data-invalid=true]');

      firstInvalid?.focus();

      if (form && !prefersReducedMotion()) {
        gsap.fromTo(
          form,
          { x: -6 },
          { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.35)' },
        );
      }

      return;
    }

    setReference(orderReference());
    shop.clearCart();
  };

  if (reference) {
    return (
      <PageShell>
        <div ref={rootRef} className="shell pt-28 pb-24 md:pt-36 md:pb-32">
          <div data-checkout-block className="max-w-[52ch] opacity-0">
            <span className="grid size-6 place-items-center rounded-full bg-forest text-paper">
              <Check className="size-5" strokeWidth={1.5} />
            </span>

            <h1 className="mt-8 text-editorial">Commande reçue</h1>

            <p className="mt-6 text-[0.9375rem] leading-relaxed text-sage">
              Merci. Votre commande porte la référence
              {' '}
              <span className="text-ink tabular-nums">{reference}</span>
              . Nous vous appelons dans la journée pour confirmer l'adresse et
              le créneau de livraison.
            </p>

            <ButtonLink href="/boutique" variant="outline" className="mt-9">
              Continuer les achats
            </ButtonLink>
          </div>
        </div>
      </PageShell>
    );
  }

  if (shop.items.length === 0) {
    return (
      <PageShell>
        <div ref={rootRef} className="shell pt-28 pb-24 md:pt-36 md:pb-32">
          <h1 ref={titleRef} className="text-editorial opacity-0">
            Commande
          </h1>
          <div data-checkout-block className="mt-10 max-w-[46ch] opacity-0">
            <p className="text-[0.9375rem] text-sage">
              Votre panier est vide. Ajoutez une pièce avant de passer commande.
            </p>
            <ButtonLink href="/boutique" variant="outline" className="mt-8">
              Découvrir la boutique
            </ButtonLink>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div ref={rootRef} className="shell pt-28 pb-24 md:pt-36 md:pb-32">
        <h1 ref={titleRef} className="text-editorial opacity-0">
          Commande
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <form ref={formRef} onSubmit={onSubmit} noValidate>
            <fieldset data-checkout-block className="opacity-0">
              <legend className="label-micro text-sage">Coordonnées</legend>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  id="firstName"
                  label="Prénom"
                  value={fields.firstName}
                  error={errors.firstName}
                  onChange={value => update('firstName', value)}
                  autoComplete="given-name"
                />
                <Field
                  id="lastName"
                  label="Nom"
                  value={fields.lastName}
                  error={errors.lastName}
                  onChange={value => update('lastName', value)}
                  autoComplete="family-name"
                />
                <Field
                  id="email"
                  label="E-mail"
                  type="email"
                  value={fields.email}
                  error={errors.email}
                  onChange={value => update('email', value)}
                  autoComplete="email"
                />
                <Field
                  id="phone"
                  label="Téléphone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={fields.phone}
                  error={errors.phone}
                  onChange={value => update('phone', value)}
                  autoComplete="tel"
                />
              </div>
            </fieldset>

            <fieldset data-checkout-block className="mt-10 opacity-0">
              <legend className="label-micro text-sage">Livraison</legend>

              <div className="mt-6 grid gap-4">
                <Field
                  id="address"
                  label="Adresse"
                  value={fields.address}
                  error={errors.address}
                  onChange={value => update('address', value)}
                  autoComplete="street-address"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="label-micro text-sage">
                      Ville
                    </label>
                    <select
                      id="city"
                      value={fields.city}
                      data-invalid={Boolean(errors.city)}
                      aria-invalid={Boolean(errors.city)}
                      onChange={event => update('city', event.target.value)}
                      className={`mt-3 ${inputClass(Boolean(errors.city))}`}
                    >
                      <option value="">Choisir…</option>
                      {CITIES.map(city => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <p
                      aria-live="polite"
                      className="mt-2 h-4 text-[0.75rem] text-terracotta"
                    >
                      {errors.city ?? ''}
                    </p>
                  </div>

                  <Field
                    id="postalCode"
                    label="Code postal"
                    inputMode="numeric"
                    placeholder="10000"
                    value={fields.postalCode}
                    error={errors.postalCode}
                    onChange={value => update('postalCode', value)}
                    autoComplete="postal-code"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="label-micro text-sage">
                    Précisions (optionnel)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={fields.notes}
                    onChange={event => update('notes', event.target.value)}
                    placeholder="Étage, point de repère, horaires…"
                    className="mt-3 w-full border border-line bg-transparent px-4 py-3 text-sm placeholder:text-stone focus:border-forest focus:outline-none"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset data-checkout-block className="mt-10 opacity-0">
              <legend className="label-micro text-sage">Paiement</legend>

              <div className="mt-6 space-y-3">
                {PAYMENT_METHODS.map(method => (
                  <label
                    key={method.value}
                    data-active={fields.payment === method.value}
                    className="flex cursor-pointer items-start gap-4 border border-line p-4 transition-colors duration-300 data-[active=true]:border-forest"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={fields.payment === method.value}
                      onChange={() => update('payment', method.value)}
                      className="mt-1 size-4 accent-forest"
                    />
                    <span>
                      <span className="block text-sm font-medium">
                        {method.label}
                      </span>
                      <span className="mt-1 block text-[0.8125rem] text-sage">
                        {method.hint}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              data-checkout-block
              type="submit"
              className="mt-10 min-h-6 w-full bg-forest px-4 py-2 label-micro text-paper opacity-0 transition-colors duration-300 hover:bg-ink"
            >
              Confirmer la commande
            </button>
          </form>

          <aside
            data-checkout-block
            className="h-fit border border-line p-6 opacity-0 lg:sticky lg:top-28"
          >
            <h2 className="label-micro text-sage">Votre commande</h2>

            <ul className="mt-6 space-y-4">
              {shop.items.map(item => (
                <li key={item.key} className="flex gap-3">
                  <Link
                    href={`/produit/${item.slug}`}
                    className="w-7 shrink-0 overflow-hidden bg-paper-dim"
                  >
                    <ProductImage
                      source={item.image}
                      alt={item.name}
                      sizes="56px"
                      className="aspect-[3/4] size-full object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[0.875rem]">{item.name}</p>
                      <p className="mt-0.5 text-[0.75rem] text-sage">
                        {item.size}
                        {' × '}
                        {item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 text-[0.875rem] tabular-nums">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-line pt-6 text-[0.9375rem]">
              <div className="flex justify-between">
                <dt className="text-sage">Sous-total</dt>
                <dd className="tabular-nums">{formatPrice(shop.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sage">Livraison</dt>
                <dd className="tabular-nums">
                  {shipping === 0 ? 'Offerte' : formatPrice(shipping)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
              <span className="label-micro">Total</span>
              <span className="text-lg tabular-nums">{formatPrice(total)}</span>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

type FieldProps = {
  id: keyof CheckoutFields & string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'numeric' | 'text' | 'tel' | 'email';
};

const Field = (props: FieldProps) => (
  <div>
    <label htmlFor={props.id} className="label-micro text-sage">
      {props.label}
    </label>
    <input
      id={props.id}
      type={props.type ?? 'text'}
      value={props.value}
      onChange={event => props.onChange(event.target.value)}
      placeholder={props.placeholder}
      autoComplete={props.autoComplete}
      inputMode={props.inputMode}
      data-invalid={Boolean(props.error)}
      aria-invalid={Boolean(props.error)}
      aria-describedby={`${props.id}-error`}
      className={`mt-3 ${inputClass(Boolean(props.error))}`}
    />
    <p
      id={`${props.id}-error`}
      aria-live="polite"
      className="mt-2 h-4 text-[0.75rem] text-terracotta"
    >
      {props.error ?? ''}
    </p>
  </div>
);
