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
 * Issues a one-shot signed URL the browser uploads the photo to directly.
 *
 * The file bytes deliberately never pass through this action: Server Action
 * bodies are capped at 1 MB (and 4.5 MB on Vercel regardless of config), which
 * any full-resolution photograph blows straight past.
 *
 * Returns the failure as a value rather than throwing — production builds strip
 * error messages, so a throw would reach the admin as an opaque 500.
 */
export const createProductImageUpload = async (
  fileName: string,
): Promise<{ path: string; token: string; url: string } | { error: string }> => {
  if (!(await isAdminAuthenticated())) {
    return { error: 'Session expirée. Reconnectez-vous pour envoyer des images.' };
  }

  const extension = fileName.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${crypto.randomUUID()}.${extension}`;

  const { data, error } = await supabaseAdmin.storage
    .from(IMAGE_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    return { error: error?.message ?? 'Impossible de préparer l’envoi.' };
  }

  const { data: publicUrl } = supabaseAdmin.storage
    .from(IMAGE_BUCKET)
    .getPublicUrl(path);

  return { path: data.path, token: data.token, url: publicUrl.publicUrl };
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
