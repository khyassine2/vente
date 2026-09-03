import type { Product } from '@/data/types';
import type { ProductImageRow, ProductRow, ProductVariantRow } from '@/libs/supabase/types';
import { supabasePublic } from '@/libs/supabase/public';

/** Distinct (size, colour) pairs a product carries, sizes/colours arrays for the UI. */
const mapVariants = (rows: ProductVariantRow[]) => {
  const sizes: string[] = [];
  const colors: Product['colors'] = [];

  for (const row of rows) {
    if (!sizes.includes(row.size)) {
      sizes.push(row.size);
    }
    if (!colors.some(color => color.name === row.color_name)) {
      colors.push({ name: row.color_name, hex: row.color_hex });
    }
  }

  return { sizes, colors };
};

const toProduct = (
  row: ProductRow,
  variants: ProductVariantRow[],
  images: ProductImageRow[],
): Product => {
  const { sizes, colors } = mapVariants(variants);
  const sorted = images.toSorted((a, b) => a.sort_order - b.sort_order);
  const urls = sorted.map(image => image.url);
  const gallery: [string, string, ...string[]]
    = urls.length >= 2 ? (urls as [string, string, ...string[]]) : [urls[0] ?? '', urls[0] ?? ''];

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    colors,
    sizes,
    categories: row.categories as Product['categories'],
    images: gallery,
    description: row.description,
    details: row.details,
    fabric: row.fabric,
    isNew: row.is_new,
  };
};

/** Every product with its variants and images, joined client-side. */
export const listProducts = async (): Promise<Product[]> => {
  const [{ data: products }, { data: variants }, { data: images }] = await Promise.all([
    supabasePublic.from('products').select('*').order('created_at', { ascending: false }),
    supabasePublic.from('product_variants').select('*'),
    supabasePublic.from('product_images').select('*'),
  ]);

  return (products ?? []).map(product =>
    toProduct(
      product,
      (variants ?? []).filter(variant => variant.product_id === product.id),
      (images ?? []).filter(image => image.product_id === product.id),
    ));
};

/** Looks a product up by its URL slug. */
export const findProduct = async (slug: string): Promise<Product | undefined> => {
  const { data: product } = await supabasePublic
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!product) {
    return undefined;
  }

  const [{ data: variants }, { data: images }] = await Promise.all([
    supabasePublic.from('product_variants').select('*').eq('product_id', product.id),
    supabasePublic.from('product_images').select('*').eq('product_id', product.id),
  ]);

  return toProduct(product, variants ?? [], images ?? []);
};

/**
 * Pieces sharing a category with the given product, falling back to the rest
 * of the catalogue so the row is never short.
 */
export const relatedProducts = (all: Product[], product: Product, count = 4) => {
  const others = all.filter(item => item.id !== product.id);
  const sameCategory = others.filter(item =>
    item.categories.some(slug => product.categories.includes(slug)),
  );
  const rest = others.filter(item => !sameCategory.includes(item));

  return [...sameCategory, ...rest].slice(0, count);
};
