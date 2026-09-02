import { createContext, use, useState } from 'react';

export type Overlay = 'cart' | 'search' | 'menu' | null;

type UiValue = {
  overlay: Overlay;
  open: (overlay: Exclude<Overlay, null>) => void;
  close: () => void;
  toggle: (overlay: Exclude<Overlay, null>) => void;
};

export const UiContext = createContext<UiValue | null>(null);

export const UiProvider = (props: { children: React.ReactNode }) => {
  const [overlay, setOverlay] = useState<Overlay>(null);

  const value: UiValue = {
    overlay,
    open: (next: Exclude<Overlay, null>) => setOverlay(next),
    close: () => setOverlay(null),
    toggle: (next: Exclude<Overlay, null>) =>
      setOverlay(current => (current === next ? null : next)),
  };

  return <UiContext value={value}>{props.children}</UiContext>;
};

export const useUi = () => {
  const context = use(UiContext);

  if (!context) {
    throw new Error('useUi must be used inside UiProvider');
  }

  return context;
};
