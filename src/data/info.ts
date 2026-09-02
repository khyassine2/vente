export type InfoSection = {
  heading: string;
  body: string;
};

export type InfoContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: InfoSection[];
};

/** Keyed by pathname so one page can serve every help route. */
export const INFO_PAGES: Record<string, InfoContent> = {
  '/livraison': {
    eyebrow: 'Aide',
    title: 'Livraison',
    intro:
      'Nous expédions depuis Rabat du lundi au vendredi. Toute commande passée avant 14 h part le jour même.',
    sections: [
      {
        heading: 'Délais',
        body: 'Rabat, Casablanca et Salé : 24 à 48 h. Reste du Maroc : 2 à 4 jours ouvrés. Vous recevez un numéro de suivi par SMS dès le départ du colis.',
      },
      {
        heading: 'Frais',
        body: 'Livraison à 45 DH partout au Maroc, offerte à partir de 800 DH d\'achat. Le montant est calculé au moment de la commande.',
      },
      {
        heading: 'Paiement à la livraison',
        body: 'Disponible sur tout le territoire. Vous réglez en espèces au livreur, à la remise du colis, après l\'avoir ouvert.',
      },
    ],
  },
  '/retours': {
    eyebrow: 'Aide',
    title: 'Retours et échanges',
    intro:
      'Une pièce ne tombe pas comme vous l\'espériez ? Vous avez trente jours pour nous la renvoyer.',
    sections: [
      {
        heading: 'Conditions',
        body: 'La pièce doit être non portée, non lavée, avec son étiquette. Les retouches sur mesure ne sont pas reprises.',
      },
      {
        heading: 'Comment faire',
        body: 'Écrivez-nous sur WhatsApp ou par e-mail avec votre numéro de commande. Nous organisons le retrait du colis chez vous, sans frais.',
      },
      {
        heading: 'Remboursement',
        body: 'Sous 7 jours ouvrés après réception, sur le moyen de paiement d\'origine. Pour un paiement à la livraison, par virement.',
      },
    ],
  },
  '/guide-des-tailles': {
    eyebrow: 'Aide',
    title: 'Guide des tailles',
    intro:
      'Nos coupes sont taillées près du corps. En cas d\'hésitation entre deux tailles, prenez la plus grande — les retouches sont offertes.',
    sections: [
      {
        heading: 'Hauts (XS — XL)',
        body: 'XS : poitrine 84-88 cm · S : 88-94 · M : 94-100 · L : 100-108 · XL : 108-116. Mesurez à l\'endroit le plus fort, bras le long du corps.',
      },
      {
        heading: 'Bas (36 — 44)',
        body: '36 : tour de taille 62-66 cm · 38 : 66-70 · 40 : 70-75 · 42 : 75-81 · 44 : 81-87. Mesurez au creux de la taille, sans serrer.',
      },
      {
        heading: 'Un doute ?',
        body: 'Envoyez-nous vos mesures sur WhatsApp, nous vous disons quelle taille prendre. C\'est plus sûr qu\'un tableau.',
      },
    ],
  },
  '/entretien': {
    eyebrow: 'Aide',
    title: 'Entretien',
    intro:
      'Bien lavée, une pièce tient dix ans. Voici ce que nous recommandons, matière par matière.',
    sections: [
      {
        heading: 'Lin et coton',
        body: 'Machine à 30 °C, cycle court, essorage doux. Séchage sur cintre à l\'ombre. Le lin se repasse encore humide.',
      },
      {
        heading: 'Laine et mérinos',
        body: 'À la main, eau froide, savon neutre. Ne pas tordre : pressez entre deux serviettes, puis séchez à plat.',
      },
      {
        heading: 'Cuir',
        body: 'Essuyez avec un chiffon sec. Une crème incolore deux fois par an suffit. Évitez l\'eau et le soleil direct.',
      },
    ],
  },
};
