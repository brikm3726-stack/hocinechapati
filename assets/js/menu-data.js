/* ==========================================================================
   HOCINE CHAPATI — Données du menu (source unique de vérité)
   --------------------------------------------------------------------------
   Tous les noms et prix proviennent des supports fournis par le client :
     - Flyer menu (WhatsApp Image ... 6.05.06 PM.jpeg)
     - Écrans du restaurant (stories Instagram "chapati ori", "chapati saison 2",
       "formule et bol", "menu pizza")
   Pour modifier un prix : changer la valeur ici, tout le site se met à jour.

   ⚠ À VÉRIFIER AVEC LE CLIENT :
     "Chapati 2x Fromage" = 200 DA sur le flyer, ~230 DA sur l'écran en magasin.
     "Chapati 2x Fromage 2x Thon" = 230 DA sur le flyer, ~250 DA sur l'écran.
     Le flyer (plus récent) est utilisé ici.

   ⚠ PHOTOS : seules les photos "chapati-*", "hero-page1" et "pnj-*" sont
     des photos du client. Les images "pizza-*" et "bol-*" sont des
     PLACEHOLDERS (Unsplash) à remplacer par les vraies photos du restaurant.
   ========================================================================== */

window.HC = {
  phone: "0556 72 56 81",
  phoneIntl: "+213556725681",
  slogan: "Le goût qui rassemble",

  chapatiOriginal: [
    { name: "Chapati Complet", price: 200, desc: "La recette complète de la maison." },
    { name: "Chapati Thon / Fromage", price: 200, desc: "Thon et fromage." },
    { name: "Chapati Fromage", price: 200, desc: "Fromage fondant." },
    { name: "Chapati 2x Fromage", price: 200, desc: "Double portion de fromage." },
    { name: "Chapati 2x Fromage 2x Thon", price: 230, desc: "Double fromage, double thon." },
    { name: "Chapati 2x Fromage 2x Omelette", price: 250, desc: "Double fromage, double omelette." },
    { name: "Chapati tout en double", price: 280, desc: "Toute la garniture, en double." },
    { name: "Chapati Salami", price: 250, desc: "Garni de salami." },
    { name: "Chapati Kiri", price: 250, desc: "Garni de Kiri." }
  ],
  supplementsOriginal: [
    { name: "Kiri", price: 50 },
    { name: "Salami", price: 100 },
    { name: "Poulet fumé", price: 150 },
    { name: "Thon / Œuf / Fromage", price: 30 },
    { name: "Barquette de frites", price: 150 }
  ],

  chapatiS2: [
    { name: "Chapati S-2 3 Fromages", short: "3 Fromages", price: 350, desc: "Trois fromages, version Saison 2." },
    { name: "Chapati S-2 Poulet", short: "Poulet", price: 400, desc: "Le Chapati S-2 au poulet." },
    { name: "Chapati S-2 Viande", short: "Viande", price: 500, desc: "Le Chapati S-2 à la viande." },
    { name: "Chapati S-2 Mixte", short: "Mixte", price: 550, desc: "Poulet et viande réunis." },
    { name: "Chapati S-2 Abat", short: "Abat", price: 550, desc: "Le Chapati S-2 aux abats." }
  ],
  supplementsS2: [
    { name: "Fromage", price: 100 },
    { name: "Poulet", price: 150 },
    { name: "Viande", price: 200 },
    { name: "Barquette de frites", price: 150 }
  ],

  pizzaSizes: ["Mini", "Normal", "Mega"],
  pizzas: [
    { name: "Pizza Margherita", prices: [300, 400, 1200], desc: "La classique, sauce tomate et fromage." },
    { name: "Pizza Végétarienne", prices: [350, 550, 1500], desc: "Garniture 100 % légumes." },
    { name: "Pizza Poulet fumé", prices: [500, 600, 1800], desc: "Au poulet fumé." },
    { name: "Pizza 3 Fromages", prices: [400, 600, 1700], desc: "Trois fromages fondants." },
    { name: "Pizza 4 Fromages", prices: [450, 750, 1900], desc: "Quatre fromages fondants." },
    { name: "Pizza Viande", prices: [500, 650, 1800], desc: "Garnie de viande." },
    { name: "Pizza Poulet", prices: [400, 500, 1800], desc: "Garnie de poulet." },
    { name: "Pizza Thon", prices: [450, 550, 1700], desc: "Garnie de thon." },
    { name: "Pizza Maison", prices: [650, 850, 2300], desc: "La recette signature de la maison." }
  ],
  supplementsPizza: [
    { name: "Cheddar", price: 180 },
    { name: "Mozzarella", price: 150 },
    { name: "Gruyère", price: 200 },
    { name: "Camembert", price: 100 },
    { name: "Poulet", price: 150 },
    { name: "Viande", price: 200 },
    { name: "Champignons", price: 100 }
  ],

  /* Bol H Chapati : base (Pasta / Poutine) + garniture, en taille M, L ou XL */
  bowlSizes: ["M", "L", "XL"],
  bowls: [
    { name: "Bol Pasta Poulet", base: "Pasta", prot: "Poulet", prices: [500, 700, 950] },
    { name: "Bol Pasta Viande", base: "Pasta", prot: "Viande", prices: [650, 850, 1000] },
    { name: "Bol Pasta Mixte", base: "Pasta", prot: "Mixte", prices: [750, 900, 1100] },
    { name: "Bol Poutine Poulet", base: "Poutine", prot: "Poulet", prices: [500, 700, 950] },
    { name: "Bol Poutine Viande", base: "Poutine", prot: "Viande", prices: [700, 850, 1050] },
    { name: "Bol Poutine Mixte", base: "Poutine", prot: "Mixte", prices: [800, 1050, 1250] }
  ],

  formules: [
    { name: "Formule Kebab", price: 550 },
    { name: "Formule Maqloub Poulet", price: 550 },
    { name: "Formule Maqloub Abat", price: 650 },
    { name: "Formule Maqloub Viande", price: 700 }
  ],

  boissons: [
    { group: "Frappuccino", items: [["Frappuccino café", 550], ["Frappuccino vanille", 550], ["Frappuccino choco (caramel, banane…)", 600]] },
    { group: "Milkshake", items: [["Vanille", 400], ["Nutella Banane", 500], ["Bueno", 600], ["Oreo", 700], ["KitKat", 700]] },
    { group: "Boissons", items: [["Soda 30 cl", 70], ["Jus 33 cl", 80], ["Canette", 100], ["Soda 1 L", 150], ["Jus 1 L", 150], ["Eau petit modèle", 30], ["Eau grand modèle", 50]] }
  ]
};
