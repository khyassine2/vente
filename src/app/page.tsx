import { PageShell } from '@/components/PageShell';
import { listProducts } from '@/data/products';
import { CategoryShowcase } from '@/sections/CategoryShowcase';
import { CollectionArches } from '@/sections/CollectionArches';
import { Editorial } from '@/sections/Editorial';
import { FeaturedCollection } from '@/sections/FeaturedCollection';
import { Hero } from '@/sections/Hero';
import { Marquee } from '@/sections/Marquee';
import { ServicePromise } from '@/sections/ServicePromise';

/** The hero owns the first paint, so the shell skips its own fade. */
export default async function HomePage() {
  const products = await listProducts();

  return (
    <PageShell instant>
      <Hero />
      <CollectionArches />
      <Marquee />
      <FeaturedCollection products={products} />
      <CategoryShowcase />
      <Editorial />
      <ServicePromise />
    </PageShell>
  );
}
