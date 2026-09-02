# Fil & Ligne

Boutique de vêtements coupés en petites séries. React 19 + Vite, Tailwind v4, GSAP et Lenis.

## Commandes

```bash
pnpm install
pnpm dev       # serveur de développement
pnpm build     # typecheck + build de production
pnpm preview   # sert le build
pnpm lint      # oxlint
```

## Structure

- `src/animations/` — recettes GSAP partagées (reveal, parallaxe, marquee, magnétisme).
- `src/components/` — briques réutilisables : header, panier, recherche, carte produit.
- `src/sections/` — sections de la page d'accueil.
- `src/pages/` — une page par route, chargées en lazy sauf l'accueil.
- `src/data/` — catalogue, contenus d'aide, validation de commande.
- `src/store/` — panier et favoris (persistés), état des overlays, transitions Flip.

## Notes

- `--spacing` vaut `8px` dans `src/index.css` : une classe `p-2` fait donc 16 px, pas 8 px.
- Toutes les animations sont neutralisées sous `prefers-reduced-motion`.
- Le panier et les favoris vivent dans `localStorage`, relus avec garde-fous au démarrage.
