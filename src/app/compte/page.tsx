import { AccountView } from '@/components/AccountView';
import { listProducts } from '@/data/products';

export default async function AccountPage() {
  const products = await listProducts();

  return <AccountView products={products} />;
}
