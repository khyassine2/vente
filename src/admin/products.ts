'use server';

import type { Product } from '@/data/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/libs/supabase/server';
import { isAdminAuthenticated } from './session';

const requireAdmin = async () => {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin');
  }
};

const IMAGE_BUCKET = 'product-images';

/**
 * Uploads one product photo to storage and returns its public URL.
 *
 * Called directly from a change handler rather than as a form action, so an
 * expired session must come back as a value: `redirect()` throws, and that
 * throw surfaces to the browser as a 500 instead of a navigation.
 */
export const uploadProductImage = async (
  file: File,
): Promise<{ url: string } | { error: string }> => {
  if (!(await isAdminAuthenticated())) {
    return { error: 'Session expirée. Reconnectez-vous pour envoyer des images.' };
  }

  const extension = file.name.split('.').pop() ?? 'jpg';
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabaseAdmin.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    return { error: error.message };
  }

  const { data } = supabaseAdmin.storage.from(IMAGE_BUCKET).getPublicUrl(path);

  return { url: data.publicUrl };
};

/** Replaces every variant and image row for a product with the given sets. */
const syncVariantsAndImages = async (productId: string, product: Omit<Product, 'id'>) => {
  await supabaseAdmin.from('product_variants').delete().eq('product_id', productId);
  await supabaseAdmin.from('product_images').delete().eq('product_id', productId);

  const variantRows = product.sizes.flatMap(size =>
    product.colors.map(color => ({
      product_id: productId,
      size,
      color_name: color.name,
      color_hex: color.hex,
    })));

  if (variantRows.length > 0) {
    await supabaseAdmin.from('product_variants').insert(variantRows);
  }

  const imageRows = product.images
    .filter(Boolean)
    .map((url, index) => ({ product_id: productId, url, sort_order: index }));

  if (imageRows.length > 0) {
    await supabaseAdmin.from('product_images').insert(imageRows);
  }
};

export const createProduct = async (product: Omit<Product, 'id'>) => {
  await requireAdmin();

  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      slug: product.slug,
      name: product.name,
      description: product.description,
      details: product.details,
      fabric: product.fabric,
      price: product.price,
      compare_at_price: product.compareAtPrice ?? null,
      is_new: product.isNew,
      categories: product.categories,
    })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to create product');
  }

  await syncVariantsAndImages(data.id, product);
  revalidatePath('/admin/produits');
  revalidatePath('/boutique');

  return data.id;
};

export const updateProduct = async (id: string, product: Omit<Product, 'id'>) => {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from('products')
    .update({
      slug: product.slug,
      name: product.name,
      description: product.description,
      details: product.details,
      fabric: product.fabric,
      price: product.price,
      compare_at_price: product.compareAtPrice ?? null,
      is_new: product.isNew,
      categories: product.categories,
    })
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  await syncVariantsAndImages(id, product);
  revalidatePath('/admin/produits');
  revalidatePath('/boutique');
  revalidatePath(`/produit/${product.slug}`);
};

export const deleteProduct = async (id: string) => {
  await requireAdmin();

  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/produits');
  revalidatePath('/boutique');
};
