import Link from 'next/link';

type Variant = 'solid' | 'outline' | 'ghost';

type ButtonBaseProps = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  full?: boolean;
};

const VARIANT_CLASS: Record<Variant, string> = {
  solid: 'border border-forest bg-forest text-paper before:bg-terracotta hover:text-paper',
  outline: 'border border-forest text-forest before:bg-forest hover:text-paper',
  ghost: 'border border-line text-ink before:bg-paper-dim hover:text-ink',
};

const BASE_CLASS = [
  'group relative inline-flex items-center justify-center overflow-hidden',
  // Min height keeps every button at a comfortable touch target on mobile.
  'min-h-6 px-4 py-2 label-micro font-medium transition-colors duration-500',
  'disabled:pointer-events-none disabled:opacity-45',
  // The fill wipes upward on hover. It sits above the button's own background
  // but below the label, which is lifted with relative z-10 in the markup.
  'before:absolute before:inset-0 before:z-0 before:origin-bottom',
  'before:scale-y-0 before:transition-transform before:duration-500',
  'before:ease-[cubic-bezier(0.16,1,0.3,1)] hover:before:scale-y-100',
].join(' ');

const composeClass = (props: ButtonBaseProps) =>
  [
    BASE_CLASS,
    VARIANT_CLASS[props.variant ?? 'solid'],
    props.full ? 'w-full' : '',
    props.className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

type ButtonProps = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
  const { children, variant, className, full, ...rest } = props;

  return (
    <button
      type="button"
      {...rest}
      className={composeClass({ children, variant, className, full })}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

type ButtonLinkProps = ButtonBaseProps & {
  href: string;
  onClick?: () => void;
};

export const ButtonLink = (props: ButtonLinkProps) => (
  <Link href={props.href} onClick={props.onClick} className={composeClass(props)}>
    <span className="relative z-10">{props.children}</span>
  </Link>
);
