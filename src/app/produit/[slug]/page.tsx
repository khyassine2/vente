import { notFound } from 'next/navigation';
import { ProductView } from '@/components/ProductView';
import { findProduct, listProducts, relatedProducts } from '@/data/products';

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const product = await findProduct(params.slug);

  if (!product) {
    notFound();
  }

  const all = await listProducts();
  const related = relatedProducts(all, product);

  // Keyed so switching products resets every selection.
  return <ProductView key={product.id} product={product} related={related} />;
}
