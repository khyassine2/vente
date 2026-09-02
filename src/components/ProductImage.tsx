import { imageSrcSet, imageUrl } from '@/utils/format';

type ProductImageProps = {
  source: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Only the hero and first grid row should bypass lazy loading. */
  priority?: boolean;
} & Pick<React.ComponentProps<'img'>, 'ref'>;

/** Responsive, lazy-loaded product photography with a stable fallback width. */
export const ProductImage = ({
  source,
  alt,
  sizes,
  className,
  priority,
  ref,
}: ProductImageProps) => (
  <img
    ref={ref}
    src={imageUrl(source, 1024)}
    srcSet={imageSrcSet(source)}
    sizes={sizes}
    alt={alt}
    loading={priority ? 'eager' : 'lazy'}
    decoding="async"
    fetchPriority={priority ? 'high' : 'auto'}
    draggable={false}
    className={className}
  />
);
