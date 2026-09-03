import { notFound } from 'next/navigation';
import { updateProduct } from '@/admin/products';
import { AdminEditProductForm } from '@/components/admin/AdminEditProductForm';
import { listProducts } from '@/data/products';

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage(props: AdminEditProductPageProps) {
  const params = await props.params;
  const products = await listProducts();
  const product = products.find(item => item.id === params.id);

  if (!product) {
    notFound();
  }

  return <AdminEditProductForm product={product} onSave={updateProduct} />;
}
