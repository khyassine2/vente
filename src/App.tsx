import { lazy, Suspense } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage';

// The home page ships in the main bundle; the rest load on navigation.
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductPage = lazy(() => import('@/pages/ProductPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CollectionsPage = lazy(() => import('@/pages/CollectionsPage'));
const AtelierPage = lazy(() => import('@/pages/AtelierPage'));
const AccountPage = lazy(() => import('@/pages/AccountPage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const InfoPage = lazy(() => import('@/pages/InfoPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

/** Holds the viewport steady while a route chunk resolves. */
const RouteFallback = () => <div className="min-h-[70svh]" />;

/** One boundary for every lazy route, instead of wrapping each element. */
const LazyRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
    <Outlet />
  </Suspense>
);

export const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />

      <Route element={<LazyRoutes />}>
        <Route path="boutique" element={<ShopPage />} />
        <Route path="boutique/:category" element={<ShopPage />} />
        <Route path="produit/:slug" element={<ProductPage />} />
        <Route path="panier" element={<CartPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="atelier" element={<AtelierPage />} />
        <Route path="commande" element={<CheckoutPage />} />
        <Route path="rendez-vous" element={<BookingPage />} />
        <Route path="compte" element={<AccountPage />} />
        <Route path="livraison" element={<InfoPage />} />
        <Route path="retours" element={<InfoPage />} />
        <Route path="guide-des-tailles" element={<InfoPage />} />
        <Route path="entretien" element={<InfoPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Route>
  </Routes>
);
