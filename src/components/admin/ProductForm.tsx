'use client';

import type { CategorySlug, Product, ProductColor } from '@/data/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { uploadProductImage } from '@/admin/products';
import { Button } from '@/components/Button';
import { CATEGORIES } from '@/data/categories';
import { ALL_SIZES, PRESET_COLORS, SIZE_SCALES } from '@/data/variants';

const fieldClass = 'mt-2 w-full border border-line bg-paper px-4 py-3 text-ink outline-none focus:border-forest';
const labelClass = 'label-micro text-sage';

/** One line per entry, parsed back on change — simplest editor for a list field. */
const linesToList = (value: string) =>
  value.split('\n').map(line => line.trim()).filter(Boolean);

const emptyDraft = (): Omit<Product, 'id'> => ({
  slug: '',
  name: 'Nouvelle pièce',
  price: 0,
  colors: [],
  sizes: [],
  categories: [],
  images: ['', ''],
  description: '',
  details: [],
  fabric: '',
  isNew: true,
});

type ProductFormProps = {
  product?: Product;
  onSave: (product: Omit<Product, 'id'>) => Promise<void>;
};

export const ProductForm = (props: ProductFormProps) => {
  const router = useRouter();
  const [draft, setDraft] = useState<Omit<Product, 'id'>>(
    props.product ?? emptyDraft(),
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const update = <K extends keyof Omit<Product, 'id'>>(key: K, value: Omit<Product, 'id'>[K]) =>
    setDraft(current => ({ ...current, [key]: value }));

  const toggleCategory = (slug: CategorySlug) => {
    const has = draft.categories.includes(slug);
    update(
      'categories',
      has
        ? draft.categories.filter(item => item !== slug)
        : [...draft.categories, slug],
    );
  };

  // Sizes and colours are kept in catalogue order, not click order, so two
  // products with the same selection always store the same sequence.
  const toggleSize = (size: string) => {
    const next = draft.sizes.includes(size)
      ? draft.sizes.filter(item => item !== size)
      : [...draft.sizes, size];

    update('sizes', ALL_SIZES.filter(item => next.includes(item)));
  };

  const toggleColor = (color: ProductColor) => {
    const next = draft.colors.some(item => item.name === color.name)
      ? draft.colors.filter(item => item.name !== color.name)
      : [...draft.colors, color];

    update('colors', PRESET_COLORS.filter(preset =>
      next.some(item => item.name === preset.name)));
  };

  const onUploadImages = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    setUploading(true);

    const results = await Promise.all(
      Array.from(fileList).map(file => uploadProductImage(file)),
    );

    setUploading(false);

    const failure = results.find(result => 'error' in result);
    if (failure && 'error' in failure) {
      window.alert(failure.error);
    }

    const uploaded = results.flatMap(result => ('url' in result ? [result.url] : []));
    if (uploaded.length === 0) {
      return;
    }

    // Appends onto the latest images, not the ones captured before the upload.
    setDraft(current => ({
      ...current,
      images: [...current.images.filter(Boolean), ...uploaded] as Product['images'],
    }));
  };

  const onRemoveImage = (index: number) => {
    if (!window.confirm('Retirer cette image de la pièce ?')) {
      return;
    }

    update('images', draft.images.filter((_, i) => i !== index) as Product['images']);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!draft.slug.trim()) {
      window.alert('Le slug est obligatoire (utilisé dans l’URL du produit).');
      return;
    }

    if (draft.images.filter(Boolean).length < 2) {
      window.alert('Au moins deux images sont nécessaires.');
      return;
    }

    if (draft.colors.length === 0) {
      window.alert('Sélectionnez au moins un coloris.');
      return;
    }

    if (draft.sizes.length === 0) {
      window.alert('Sélectionnez au moins une taille.');
      return;
    }

    setSaving(true);
    await props.onSave(draft);
    router.push('/admin/produits');
  };

  return (
    <div className="mx-auto max-w-2xl">
      <button
        type="button"
        onClick={() => router.push('/admin/produits')}
        className="label-micro text-sage hover:text-ink"
      >
        ← Retour
      </button>

      <h1 className="mt-4 text-xl font-medium text-ink">
        {props.product ? 'Modifier la pièce' : 'Nouvelle pièce'}
      </h1>

      <form onSubmit={onSubmit} className="mt-8 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <label>
            <span className={labelClass}>Nom</span>
            <input
              value={draft.name}
              onChange={event => update('name', event.target.value)}
              className={fieldClass}
            />
          </label>

          <label>
            <span className={labelClass}>Slug (URL)</span>
            <input
              value={draft.slug}
              onChange={event => update('slug', event.target.value)}
              placeholder="chemise-lin-tanger"
              className={fieldClass}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label>
            <span className={labelClass}>Prix (DH)</span>
            <input
              type="number"
              min={0}
              value={draft.price}
              onChange={event => update('price', Number(event.target.value))}
              className={fieldClass}
            />
          </label>

          <label>
            <span className={labelClass}>Prix barré (optionnel)</span>
            <input
              type="number"
              min={0}
              value={draft.compareAtPrice ?? ''}
              onChange={(event) => {
                const raw = event.target.value;
                update('compareAtPrice', raw ? Number(raw) : undefined);
              }}
              className={fieldClass}
            />
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>Description</span>
          <textarea
            rows={3}
            value={draft.description}
            onChange={event => update('description', event.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className={labelClass}>Détails (une ligne par point)</span>
          <textarea
            rows={3}
            value={draft.details.join('\n')}
            onChange={event => update('details', linesToList(event.target.value))}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className={labelClass}>Matière</span>
          <input
            value={draft.fabric}
            onChange={event => update('fabric', event.target.value)}
            className={fieldClass}
          />
        </label>

        <div>
          <span className={labelClass}>Catégories</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category.slug}
                type="button"
                onClick={() => toggleCategory(category.slug)}
                className={`label-micro border px-3 py-1.5 ${
                  draft.categories.includes(category.slug)
                    ? 'border-forest bg-forest text-paper'
                    : 'border-line text-sage'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className={labelClass}>Tailles</span>
          <div className="mt-3 space-y-3">
            {SIZE_SCALES.map(scale => (
              <div key={scale.label} className="flex flex-wrap items-center gap-2">
                <span className="w-24 shrink-0 text-xs text-sage">{scale.label}</span>
                {scale.sizes.map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    aria-pressed={draft.sizes.includes(size)}
                    className={`label-micro border px-3 py-1.5 ${
                      draft.sizes.includes(size)
                        ? 'border-forest bg-forest text-paper'
                        : 'border-line text-sage hover:border-forest hover:text-ink'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className={labelClass}>Coloris</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color.name}
                type="button"
                onClick={() => toggleColor(color)}
                aria-pressed={draft.colors.some(item => item.name === color.name)}
                className={`flex items-center gap-2 border px-3 py-1.5 label-micro ${
                  draft.colors.some(item => item.name === color.name)
                    ? 'border-forest bg-forest text-paper'
                    : 'border-line text-sage hover:border-forest hover:text-ink'
                }`}
              >
                <span
                  aria-hidden
                  className="size-3.5 shrink-0 rounded-full border border-ink/15"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className={labelClass}>
            Images — la 1ère est la photo principale, la 2ème apparaît au survol
          </span>

          {draft.images.filter(Boolean).length > 0 && (
            <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {draft.images.filter(Boolean).map((url, index) => (
                <li key={url} className="group relative aspect-[3/4] overflow-hidden border border-line bg-paper-dim">
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin preview only, not the storefront */}
                  <img src={url} alt="" className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    aria-label="Retirer cette image"
                    className="absolute top-1 right-1 grid size-5 place-items-center bg-ink/70 text-paper opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    ×
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-forest px-1.5 py-0.5 text-[0.625rem] text-paper">
                      Principale
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          <label className="mt-3 flex min-h-6 w-full cursor-pointer items-center justify-center border border-dashed border-line px-4 py-3 text-sm text-sage transition-colors hover:border-forest hover:text-ink">
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={async (event) => {
                await onUploadImages(event.target.files);
                // Clears the selection so re-picking the same file still fires.
                event.target.value = '';
              }}
              className="hidden"
            />
            {uploading ? 'Envoi en cours…' : 'Ajouter des images'}
          </label>

          <p className="mt-1 text-xs text-sage">
            Au moins deux images sont nécessaires. Glissez-en plusieurs à la fois.
          </p>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={draft.isNew}
            onChange={event => update('isNew', event.target.checked)}
          />
          <span className="text-sm text-ink">Marquer comme nouveauté</span>
        </label>

        <div className="mt-10 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/produits')}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={saving}>
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
};
