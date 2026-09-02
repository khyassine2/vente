import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ScrollTrigger } from '@/animations/gsap';
import { CartDrawer } from '@/components/CartDrawer';
import { Cursor } from '@/components/Cursor';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { MobileMenu } from '@/components/MobileMenu';
import { SearchOverlay } from '@/components/SearchOverlay';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { SmoothScrollContext } from '@/store/SmoothScrollContext';

export const Layout = () => {
  const lenis = useSmoothScroll();
  const location = useLocation();

  useEffect(() => {
    // Land at the top of each new route without a smooth animated crawl.
    lenis.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);

    // Layout differs per route, so measurements must be rebuilt.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => cancelAnimationFrame(frame);
  }, [location.pathname, lenis]);

  return (
    <SmoothScrollContext value={{ lenis }}>
      <Cursor />
      <Header />

      <main id="main" className="min-h-screen">
        <Outlet />
      </main>

      <Footer />

      <WhatsAppButton />
      <CartDrawer />
      <SearchOverlay />
      <MobileMenu />
    </SmoothScrollContext>
  );
};
