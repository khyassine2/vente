import { ShopView } from '@/components/ShopView';
import { listProducts } from '@/data/products';

export default async function ShopPage() {
  const products = await listProducts();

  return <ShopView products={products} />;
}
