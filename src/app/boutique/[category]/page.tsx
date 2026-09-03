import { notFound } from 'next/navigation';
import { ShopView } from '@/components/ShopView';
import { findCategory } from '@/data/categories';
import { listProducts } from '@/data/products';

type ShopCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function ShopCategoryPage(props: ShopCategoryPageProps) {
  const params = await props.params;
  const category = findCategory(params.category);

  if (!category) {
    notFound();
  }

  const products = await listProducts();

  return <ShopView products={products} category={category} />;
}
