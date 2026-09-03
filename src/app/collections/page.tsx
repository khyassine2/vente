import { CollectionsView } from '@/components/CollectionsView';
import { CATEGORIES } from '@/data/categories';
import { listProducts } from '@/data/products';

export default async function CollectionsPage() {
  const products = await listProducts();

  const categories = CATEGORIES.map(category => ({
    ...category,
    count: products.filter(product => product.categories.includes(category.slug)).length,
  }));

  return <CollectionsView categories={categories} />;
}
