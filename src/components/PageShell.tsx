import { useEffect, useRef } from 'react';
import { pageTransition } from '@/animations';

type PageShellProps = {
  children: React.ReactNode;
  /** Set on pages whose own intro timeline owns the first paint. */
  instant?: boolean;
  className?: string;
};

/** Fades incoming route content in, keeping transitions inside 400–800ms. */
export const PageShell = (props: PageShellProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element || props.instant) {
      return;
    }

    const tween = pageTransition(element);

    return () => {
      tween?.kill();
    };
  }, [props.instant]);

  return (
    <div
      ref={ref}
      className={props.className}
      style={props.instant ? undefined : { opacity: 0 }}
    >
      {props.children}
    </div>
  );
};
