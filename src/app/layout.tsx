import type { Metadata } from 'next';
import { Fraunces, Outfit } from 'next/font/google';
import { Layout } from '@/components/Layout';
import { listProducts } from '@/data/products';
import { FlipProvider } from '@/store/FlipContext';
import { ShopProvider } from '@/store/ShopContext';
import { UiProvider } from '@/store/UiContext';
import '@/app/globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-display-loaded',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Fil & Ligne — Vêtements coupés à la main',
  description:
    'Atelier de vêtements fondé à Rabat. Pièces coupées en petites séries, matières naturelles, coupes qui durent. Livraison partout au Maroc, paiement à la livraison.',
  icons: { icon: '/favicon.svg' },
};

export const viewport = {
  themeColor: '#faf7f2',
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const products = await listProducts();
  const menuPreviews = [products[0], products[4]].filter(product => product !== undefined);

  return (
    <html lang="fr" className={`${fraunces.variable} ${outfit.variable}`}>
      <body>
        <a className="skip-link" href="#main">Aller au contenu</a>
        <ShopProvider>
          <UiProvider>
            <FlipProvider>
              <Layout products={products} menuPreviews={menuPreviews}>
                {props.children}
              </Layout>
            </FlipProvider>
          </UiProvider>
        </ShopProvider>
      </body>
    </html>
  );
}
