import { Check } from 'lucide-react';
import { useRef, useState } from 'react';
import { fadeUp, revealText } from '@/animations';
import { ButtonLink } from '@/components/Button';
import { PageShell } from '@/components/PageShell';
import { useGsapContext } from '@/hooks/useGsapContext';

const SLOTS = ['10:00', '11:30', '14:00', '15:30', '17:00'];

const REASONS = [
  'Prise de mesures',
  'Essayage',
  'Retouche',
  'Conseil garde-robe',
];

/** Tomorrow, so the date picker never offers a slot already gone. */
const minimumDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

const BookingPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState<string | null>(null);
  const [reason, setReason] = useState(REASONS[0]);
  const [sent, setSent] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGsapContext(
    rootRef,
    () => {
      const split = titleRef.current
        ? revealText(titleRef.current, { start: 'top 95%' })
        : null;

      fadeUp('[data-booking-block]', {
        start: 'top 95%',
        stagger: 0.07,
        delay: 0.1,
      });

      return () => split?.revert();
    },
    [sent],
  );

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <PageShell>
        <div ref={rootRef} className="shell pt-28 pb-24 md:pt-36 md:pb-32">
          <div data-booking-block className="max-w-[52ch] opacity-0">
            <span className="grid size-6 place-items-center rounded-full bg-forest text-paper">
              <Check className="size-5" strokeWidth={1.5} />
            </span>
            <h1 className="mt-8 text-editorial">Demande envoyée</h1>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-sage">
              Merci
              {name ? `, ${name}` : ''}
              . Nous confirmons votre créneau par téléphone dans la journée.
            </p>
            <ButtonLink to="/boutique" variant="outline" className="mt-9">
              Voir la boutique
            </ButtonLink>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div ref={rootRef} className="shell pt-28 pb-24 md:pt-36 md:pb-32">
        <p data-booking-block className="label-micro text-sage opacity-0">
          Rendez-vous
        </p>

        <h1 ref={titleRef} className="mt-4 max-w-[16ch] text-editorial opacity-0">
          Un essayage à l'atelier
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <form onSubmit={onSubmit} data-booking-block className="opacity-0">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="label-micro text-sage">
                  Nom
                </label>
                <input
                  id="name"
                  required
                  value={name}
                  onChange={event => setName(event.target.value)}
                  autoComplete="name"
                  className="mt-3 min-h-6 w-full border border-line bg-transparent px-4 py-3 text-sm placeholder:text-stone focus:border-forest focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="phone" className="label-micro text-sage">
                  Téléphone
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={event => setPhone(event.target.value)}
                  placeholder="06 12 34 56 78"
                  autoComplete="tel"
                  className="mt-3 min-h-6 w-full border border-line bg-transparent px-4 py-3 text-sm placeholder:text-stone focus:border-forest focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="reason" className="label-micro text-sage">
                Motif
              </label>
              <select
                id="reason"
                value={reason}
                onChange={event => setReason(event.target.value)}
                className="mt-3 min-h-6 w-full border border-line bg-transparent px-4 py-3 text-sm focus:border-forest focus:outline-none"
              >
                {REASONS.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <label htmlFor="date" className="label-micro text-sage">
                Date
              </label>
              <input
                id="date"
                type="date"
                required
                min={minimumDate()}
                value={date}
                onChange={event => setDate(event.target.value)}
                className="mt-3 min-h-6 w-full border border-line bg-transparent px-4 py-3 text-sm focus:border-forest focus:outline-none"
              />
            </div>

            <fieldset className="mt-6">
              <legend className="label-micro text-sage">Créneau</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {SLOTS.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSlot(option)}
                    aria-pressed={option === slot}
                    data-active={option === slot}
                    className="min-h-5.5 border border-line px-5 text-sm tabular-nums transition-colors duration-300 hover:border-forest data-[active=true]:border-forest data-[active=true]:bg-forest data-[active=true]:text-paper"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={!slot}
              className="mt-10 min-h-6 w-full bg-forest px-4 py-2 label-micro text-paper transition-colors duration-300 hover:bg-ink disabled:pointer-events-none disabled:opacity-45"
            >
              {slot ? 'Demander ce créneau' : 'Choisissez un créneau'}
            </button>
          </form>

          <aside
            data-booking-block
            className="h-fit border border-line p-6 opacity-0"
          >
            <h2 className="label-micro text-sage">L'atelier</h2>
            <address className="mt-5 space-y-2 text-[0.9375rem] not-italic">
              <p>14 rue des Consuls</p>
              <p className="text-sage">Médina, Rabat</p>
            </address>

            <dl className="mt-6 space-y-2 border-t border-line pt-6 text-[0.875rem]">
              <div className="flex justify-between gap-4">
                <dt className="text-sage">Mardi — vendredi</dt>
                <dd className="tabular-nums">10h — 18h</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-sage">Samedi</dt>
                <dd className="tabular-nums">10h — 16h</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-sage">Dimanche — lundi</dt>
                <dd>Fermé</dd>
              </div>
            </dl>

            <p className="mt-6 border-t border-line pt-6 text-[0.875rem] text-sage">
              Comptez trente minutes pour une prise de mesures, quinze pour un
              essayage.
            </p>
          </aside>
        </div>
      </div>
    </PageShell>
  );
};

export default BookingPage;
