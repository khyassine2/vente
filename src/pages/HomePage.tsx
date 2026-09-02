import { PageShell } from '@/components/PageShell';
import { CategoryShowcase } from '@/sections/CategoryShowcase';
import { Editorial } from '@/sections/Editorial';
import { FeaturedCollection } from '@/sections/FeaturedCollection';
import { Hero } from '@/sections/Hero';
import { Marquee } from '@/sections/Marquee';
import { ServicePromise } from '@/sections/ServicePromise';

/** The hero owns the first paint, so the shell skips its own fade. */
const HomePage = () => (
  <PageShell instant>
    <Hero />
    <Marquee />
    <FeaturedCollection />
    <CategoryShowcase />
    <Editorial />
    <ServicePromise />
  </PageShell>
);

export default HomePage;
