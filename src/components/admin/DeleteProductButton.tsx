'use client';

type DeleteProductButtonProps = {
  /** Shown in the prompt so the admin can tell which row they hit. */
  productName: string;
};

/**
 * Confirms before letting the surrounding server-action form submit. The page
 * is a Server Component, so the prompt has to live in its own client island.
 */
export const DeleteProductButton = (props: DeleteProductButtonProps) => (
  <button
    type="submit"
    onClick={(event) => {
      const label = props.productName || 'cette pièce';
      if (!window.confirm(`Supprimer « ${label} » ? Cette action est définitive.`)) {
        event.preventDefault();
      }
    }}
    className="label-micro text-terracotta hover:opacity-70"
  >
    Supprimer
  </button>
);
