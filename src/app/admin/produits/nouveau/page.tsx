'use client';

import { createProduct } from '@/admin/products';
import { ProductForm } from '@/components/admin/ProductForm';

export default function AdminNewProductPage() {
  return <ProductForm onSave={product => createProduct(product).then(() => undefined)} />;
}
