/** Reads JSON from localStorage, falling back when absent or corrupt. */
export const readStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  // Stored data is user-controlled and may predate the current shape.
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const writeStorage = (key: string, value: unknown) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked; persistence is a convenience here.
  }
};
