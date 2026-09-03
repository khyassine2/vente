'use client';

import type { Product } from '@/data/types';
import { ProductForm } from '@/components/admin/ProductForm';

type AdminEditProductFormProps = {
  product: Product;
  onSave: (id: string, product: Omit<Product, 'id'>) => Promise<void>;
};

export const AdminEditProductForm = (props: AdminEditProductFormProps) => (
  <ProductForm
    product={props.product}
    onSave={product => props.onSave(props.product.id, product)}
  />
);
