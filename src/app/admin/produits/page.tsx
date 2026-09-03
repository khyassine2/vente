import Link from 'next/link';
import { deleteProduct } from '@/admin/products';
import { listProducts } from '@/data/products';
import { formatPrice } from '@/utils/format';

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-ink">Produits</h1>
          <p className="mt-1 text-sm text-sage">
            {products.length}
            {' '}
            pièces
          </p>
        </div>

        <Link
          href="/admin/produits/nouveau"
          className="group relative inline-flex min-h-6 items-center justify-center border border-forest px-4 py-2 label-micro text-forest transition-colors duration-500 hover:text-paper"
        >
          <span className="relative z-10">Ajouter une pièce</span>
        </Link>
      </div>

      <ul className="mt-8 divide-y divide-line border-y border-line">
        {products.map(product => (
          <li key={product.id} className="flex items-center gap-4 py-4">
            <img
              src={product.images[0]}
              alt=""
              className="size-16 shrink-0 bg-paper-dim object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-ink">{product.name || 'Sans titre'}</p>
              <p className="mt-0.5 text-sm text-sage">
                {formatPrice(product.price)}
                {' · '}
                {product.categories.join(', ') || 'sans catégorie'}
              </p>
            </div>

            <Link
              href={`/admin/produits/${product.id}`}
              className="label-micro text-ink hover:text-forest"
            >
              Modifier
            </Link>

            <form
              action={async () => {
                'use server';
                await deleteProduct(product.id);
              }}
            >
              <button type="submit" className="label-micro text-terracotta hover:opacity-70">
                Supprimer
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
