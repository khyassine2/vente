import { Menu, Search, User } from 'lucide-react';
import { useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/animations/gsap';
import { CartButton } from '@/components/CartButton';
import { useGsapContext } from '@/hooks/useGsapContext';
import { useUi } from '@/store/UiContext';

const NAV_LINKS = [
  { to: '/boutique/nouveautes', label: 'Nouveautés' },
  { to: '/boutique', label: 'Boutique' },
  { to: '/collections', label: 'Collections' },
  { to: '/atelier', label: 'Atelier' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'relative label-micro py-2 transition-opacity duration-300',
    // Underline grows from the left on hover and stays put when active.
    'after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-current',
    'after:origin-left after:transition-transform after:duration-500',
    'after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:scale-x-100',
    isActive ? 'after:scale-x-100' : 'after:scale-x-0',
  ].join(' ');

export const Header = () => {
  const ui = useUi();
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const isHome = location.pathname === '/';

  useGsapContext(
    headerRef,
    () => {
      const header = headerRef.current;
      if (!header) {
        return;
      }

      if (!prefersReducedMotion()) {
        gsap.fromTo(
          '[data-header-item]',
          { autoAlpha: 0, y: -14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.07,
            delay: isHome ? 0.25 : 0,
          },
        );
      }

      if (isHome) {
        // Over the hero the bar is transparent; past it it settles onto paper.
        ScrollTrigger.create({
          start: 'top -70vh',
          end: 'max',
          onToggle: (self) => {
            header.dataset.solid = String(self.isActive);
          },
        });
      } else {
        header.dataset.solid = 'true';
      }

      if (prefersReducedMotion()) {
        return;
      }

      // Retracts the bar when scrolling down, returns it on the way back up,
      // so small screens keep their full viewport for the catalogue.
      const shift = gsap.quickTo(header, 'yPercent', {
        duration: 0.45,
        ease: 'power3.out',
      });

      ScrollTrigger.create({
        start: 'top -140',
        end: 'max',
        onUpdate: (self) => {
          const hidden = self.direction === 1 && ui.overlay === null;
          shift(hidden ? -100 : 0);
        },
        onLeaveBack: () => shift(0),
      });
    },
    [isHome, ui.overlay],
  );

  return (
    <header
      ref={headerRef}
      data-solid={isHome ? 'false' : 'true'}
      className="fixed inset-x-0 top-0 z-90 border-b border-transparent text-paper transition-colors duration-500 will-change-transform data-[solid=true]:border-line data-[solid=true]:bg-paper/92 data-[solid=true]:text-ink data-[solid=true]:backdrop-blur-md"
    >
      <div className="shell flex h-16 items-center gap-4 md:h-20 lg:grid lg:grid-cols-[auto_1fr_auto] lg:gap-8">
        <div className="flex items-center gap-2 lg:gap-0">
          <button
            type="button"
            data-header-item
            onClick={() => ui.open('menu')}
            aria-label="Ouvrir le menu"
            className="grid size-5.5 shrink-0 place-items-center lg:hidden"
          >
            <Menu className="size-5" strokeWidth={1.25} />
          </button>

          <Link
            to="/"
            data-header-item
            aria-label="Fil et Ligne, accueil"
            className="shrink-0 font-display text-base leading-none tracking-[0.2em] whitespace-nowrap uppercase md:text-lg"
          >
            Fil
            <span className="text-terracotta">&amp;</span>
            Ligne
          </Link>
        </div>

        <nav
          aria-label="Navigation principale"
          className="hidden min-w-0 items-center justify-center gap-7 lg:flex xl:gap-10"
        >
          {NAV_LINKS.map(link => (
            <span key={link.to} data-header-item className="shrink-0">
              <NavLink to={link.to} end={link.to === '/boutique'} className={linkClass}>
                {link.label}
              </NavLink>
            </span>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-0.5 lg:flex-none">
          <span data-header-item>
            <button
              type="button"
              onClick={() => ui.open('search')}
              aria-label="Rechercher"
              className="grid size-5.5 place-items-center"
            >
              <Search className="size-[19px]" strokeWidth={1.25} />
            </button>
          </span>
          <span data-header-item className="hidden sm:inline-block">
            <Link
              to="/compte"
              aria-label="Mon compte"
              className="grid size-5.5 place-items-center"
            >
              <User className="size-[19px]" strokeWidth={1.25} />
            </Link>
          </span>
          <span data-header-item>
            <CartButton />
          </span>
        </div>
      </div>
    </header>
  );
};
