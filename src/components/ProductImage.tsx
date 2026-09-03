import Image from 'next/image';

type ProductImageProps = {
  source: string;
  alt: string;
  sizes: string;
  className?: string;
  /** Only the hero and first grid row should bypass lazy loading. */
  priority?: boolean;
} & Pick<React.ComponentProps<typeof Image>, 'ref'>;

/** Responsive, optimized product photography via `next/image`. */
export const ProductImage = (props: ProductImageProps) => (
  <Image
    ref={props.ref}
    src={props.source}
    alt={props.alt}
    fill
    sizes={props.sizes}
    priority={props.priority}
    loading={props.priority ? undefined : 'lazy'}
    draggable={false}
    className={props.className}
  />
);
