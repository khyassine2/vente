import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { fadeUp, revealText } from '@/animations';
import { PageShell } from '@/components/PageShell';
import { INFO_PAGES } from '@/data/info';
import { useGsapContext } from '@/hooks/useGsapContext';
import NotFoundPage from '@/pages/NotFoundPage';

const InfoPage = () => {
  const location = useLocation();
  const content = INFO_PAGES[location.pathname];

  const rootRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGsapContext(
    rootRef,
    () => {
      if (!content) {
        return;
      }

      const split = titleRef.current
        ? revealText(titleRef.current, { start: 'top 95%' })
        : null;

      fadeUp('[data-info-block]', {
        start: 'top 95%',
        stagger: 0.07,
        delay: 0.1,
      });

      return () => split?.revert();
    },
    [location.pathname],
  );

  if (!content) {
    return <NotFoundPage />;
  }

  return (
    <PageShell>
      <div ref={rootRef} className="shell pt-28 pb-24 md:pt-36 md:pb-32">
        <p data-info-block className="label-micro text-sage opacity-0">
          {content.eyebrow}
        </p>

        <h1 ref={titleRef} className="mt-4 max-w-[16ch] text-editorial opacity-0">
          {content.title}
        </h1>

        <p
          data-info-block
          className="mt-6 max-w-[54ch] text-[0.9375rem] leading-relaxed text-sage opacity-0"
        >
          {content.intro}
        </p>

        <div className="mt-14 max-w-[68ch] divide-y divide-line border-t border-line">
          {content.sections.map(section => (
            <section
              key={section.heading}
              data-info-block
              className="grid gap-3 py-8 opacity-0 md:grid-cols-[1fr_1.8fr] md:gap-10"
            >
              <h2 className="font-sans label-micro text-ink">
                {section.heading}
              </h2>
              <p className="text-[0.9375rem] leading-relaxed text-sage">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

export default InfoPage;
