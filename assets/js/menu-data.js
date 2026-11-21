/* ==========================================================================
   HOCINE CHAPATI — Données du menu (source unique de vérité)
   --------------------------------------------------------------------------
   Mise à jour du 21/11/2026 d'après les nouvelles cartes du restaurant :
   Chapati Originale, Chapati Saison 2, Menu Pizza, Pizza Pocket,
   Poutine / Pasta, Pita / Gyros / Plats, Suppléments, Salades,
   Crêpes & Gourmandises, Menu Kunafa, Boissons & Desserts.
   Pour modifier un prix : changer la valeur ici, tout le site se met à jour.

   ⚠ À VÉRIFIER AVEC LE CLIENT :
     - Kunafa « 2 personnes » : prix masqués sur la carte papier, repris de
       l'affiche retravaillée (photo KUNAFA 4K) — à confirmer.
     - « My Pizza » (pizza à composer) : prix illisible sur la photo.
     - Sodas et eau : absents des nouvelles cartes, anciens prix conservés.
     - Desserts à deux prix (ex. Crème brûlée 150 / 250 DA) : les formats
       sont nommés « Petit » / « Grand » ici.

   ⚠ PHOTOS : seules les photos "chapati-*", "hero-page1" et "pnj-*" sont
     des photos du client. Les images "pizza-*" et "bol-*" sont des
     PLACEHOLDERS (Unsplash) à remplacer par les vraies photos du restaurant.
   ========================================================================== */

(() => {
  /* Suppléments communs (carte « Suppléments ») : Chapati S-2, pizzas, poutine & pasta */
  const supplements = [
    { name: "Mozzarella", price: 200 },
    { name: "Cheddar", price: 250 },
    { name: "Gruyère", price: 300 },
    { name: "Camembert", price: 200 },
    { name: "Kiri", price: 100 },
    { name: "Poulet", price: 200 },
    { name: "Viande", price: 250 },
    { name: "Poulet fumé", price: 150 },
    { name: "Champignons", price: 150 },
    { name: "Thon", price: 150 },
    { name: "Barquette de frites", price: 150 }
  ];

  const S2 = "Pain spécial";
  const ORIG = "Pain maison, sauce, salade";
  const BASE = "Sauce tomate, cheddar, mozzarella";
  const SAUCE = "sauce fromage (mozzarella, cheddar)";
  const PITA = "Salade, tomate, oignon, chou rouge, sauce au choix (blanche ou algérienne)";

  window.HC = {
    phone: "0556 72 56 81",
    phoneIntl: "+213556725681",
    slogan: "Le goût qui rassemble",

    supplements,

    /* ---------------- Chapati Originale ---------------- */
    chapatiOriginal: [
      { name: "Chapati Complet", price: 230, desc: `${ORIG}, pâté piquant, thon sec, feuille de fromage slice, œuf avec persil.` },
      { name: "Chapati Thon Fromage", price: 230, desc: `${ORIG}, thon sec, feuille de fromage slice, œuf avec persil.` },
      { name: "Chapati Sans Piquant", price: 230, desc: "La recette du Complet, sans pâté piquant." },
      { name: "Chapati Double Fromage", price: 250, desc: `${ORIG}, pâté piquant, thon sec, double fromage slice, œuf avec persil.` },
      { name: "Chapati Salami", price: 250, desc: `${ORIG}, thon sec, tranche de salami, feuille de fromage slice, œuf avec persil.` },
      { name: "Chapati Kiri", price: 280, desc: `${ORIG}, pâté piquant, thon sec, feuille de fromage slice, œuf avec persil et une portion de Kiri.` },
      { name: "Chapati Double Fromage Double Omelette", price: 280, desc: `${ORIG}, pâté piquant, thon sec, double fromage slice, double omelette avec persil.` },
      { name: "Chapati Double Thon Double Fromage", price: 280, desc: `${ORIG}, pâté piquant, double thon sec, double fromage slice, œuf avec persil.` },
      { name: "Chapati Tout en Double", price: 300, desc: `${ORIG}, double pâté piquant, double thon sec, double fromage slice, double œuf avec persil.` }
    ],
    supplementsOriginal: [
      { name: "Thon", price: 50 },
      { name: "Fromage", price: 50 },
      { name: "Omelette", price: 50 },
      { name: "Kiri", price: 100 }
    ],

    /* ---------------- Chapati Saison 2 ---------------- */
    chapatiS2: [
      { name: "Chapati S-2 3 Fromages", short: "3 Fromages", price: 350, desc: `${S2}, fromage fondu, mozzarella, camembert.` },
      { name: "Chapati S-2 Poulet", short: "Poulet", price: 400, desc: `${S2}, poulet oriental, sauce fromage.` },
      { name: "Chapati S-2 Poulet Spicy", short: "Poulet Spicy", price: 450, desc: `${S2}, poulet mexicain, sauce ail.` },
      { name: "Chapati S-2 Champignons", short: "Champignons", price: 450, desc: `${S2}, champignons frais à la crème.` },
      { name: "Chapati S-2 Viande", short: "Viande", price: 500, desc: `${S2}, viande hachée marinée, sauce ail.` },
      { name: "Chapati S-2 Mixte", short: "Mixte", price: 550, desc: `${S2}, viande et poulet, sauce ail.` }
    ],
    supplementsS2: supplements,

    /* ---------------- Pizzas (Standard / Mega) ---------------- */
    pizzaSizes: ["Standard", "Mega"],
    pizzas: [
      { name: "Pizza Marguerite", prices: [600, 2000], desc: `${BASE}.` },
      { name: "Pizza Canadian", prices: [800, 2500], desc: `${BASE}, merguez, poivron.` },
      { name: "Pizza Vegetarian", prices: [800, 2500], desc: `${BASE}, champignon, oignon, olive, poivron.` },
      { name: "Pizza Americano", prices: [1000, 2600], desc: `${BASE}, viande, poivron.` },
      { name: "Pizza Chicken", prices: [1000, 2600], desc: `${BASE}, poulet, poivron.` },
      { name: "Pizza Tuna Fish", prices: [1000, 2600], desc: `${BASE}, thon, poivron.` },
      { name: "Pizza Tropical", prices: [1100, 2700], desc: `${BASE}, champignon, poulet, poivron.` },
      { name: "Pizza Spécial", prices: [1200, 2800], desc: `${BASE}, viande, merguez, poulet, olive, poivron.` },
      { name: "Pizza House", prices: [1800, 4000], desc: `${BASE}, viande, crevettes fraîches, olive, poivron.` },
      { name: "Pizza Mix Spécial", prices: [1200, 2800], desc: `${BASE}, viande, poulet, champignon, olive, poivron.` },
      { name: "Pizza Hawaï", prices: [1100, 2700], desc: `${BASE}, viande, poulet, poivron.` },
      { name: "Pizza House Classic", prices: [1800, 4000], desc: `${BASE}, crevettes fraîches, champignon, olive, poivron.` },
      { name: "Pizza Queen", prices: [1100, 2700], desc: `${BASE}, poulet, ananas, olive, poivron.` },
      { name: "Pizza Trois Fromages", prices: [1000, 2600], desc: "Sauce tomate, emmental, cheddar, mozzarella, olive." },
      { name: "Pizza Extra Vanga", prices: [1000, 2600], desc: `${BASE}, camembert, olive, poivron, champignon.` },
      { name: "Pizza Pepperoni", prices: [1000, 2500], desc: `${BASE}, pepperoni.` },
      { name: "Pizza 3 Viandes", prices: [1000, 2500], desc: `${BASE}, poulet fumé, boulettes de viande, pepperoni.` },
      { name: "Pizza Mexicaine", prices: [1000, 2500], desc: "Sauce piquante, cheddar, mozzarella, viandes épicées, poulet fumé." },
      { name: "Pizza Poulet Fumé", prices: [1000, 2500], desc: `${BASE}, poulet fumé.` }
    ],
    myPizza: "My Pizza : personnalisez votre pizza à votre goût (6 ingrédients maximum). Crevettes : +1 000 DA par quart.",
    supplementsPizza: supplements,

    /* ---------------- Pizza Pocket ---------------- */
    pizzaPocket: [
      { group: "Les Classiques", note: "Sauce tomate maison ou sauce fromagère, mozzarella filante, olives et herbes fines.", items: [
        { name: "Pocket Poulet", price: 400, desc: "Tendres morceaux de poulet mariné sur un lit de mozzarella fondante." },
        { name: "Pocket Poulet Spicy", price: 400, desc: "Poulet mariné à la touche pimentée." },
        { name: "Pocket Champignons", price: 400, desc: "Champignons frais et fromage fondant." },
        { name: "Pocket Végétarienne", price: 400, desc: "Champignons frais, poivrons, tomates cerises et maïs doux." }
      ] },
      { group: "Les Spéciales", items: [
        { name: "Pocket Viande", price: 500, desc: "Viande hachée assaisonnée." },
        { name: "Pocket Thon", price: 500, desc: "Mozzarella et beaux morceaux de thon." },
        { name: "Pocket Pepperoni", price: 500, desc: "Un tapis de pepperoni croustillant." },
        { name: "Pocket Poulet Fumé", price: 500, desc: "Fines tranches de poulet fumé." }
      ] },
      { group: "Les Gourmets", items: [
        { name: "Pocket 3 Fromages", price: 550, desc: "Mozzarella, cheddar et camembert." },
        { name: "Pocket 4 Fromages", price: 600, desc: "Mozzarella, cheddar, camembert et éclats de gruyère." },
        { name: "Pocket Royal", price: 650, desc: "Viande hachée, poulet mariné, poulet fumé, champignons frais, maïs et cheddar fondant." }
      ] }
    ],

    /* ---------------- Poutine & Pasta ---------------- */
    bowls: [
      { name: "Poutine Poulet", base: "Poutine", prot: "Poulet", price: 500, desc: `Frites croustillantes, poulet mariné, ${SAUCE}.` },
      { name: "Poutine Viande", base: "Poutine", prot: "Viande", price: 700, desc: `Frites croustillantes, viande marinée, ${SAUCE}.` },
      { name: "Poutine Mixte", base: "Poutine", prot: "Mixte", price: 750, desc: `Frites croustillantes, poulet et viande, ${SAUCE}.` },
      { name: "Pasta Poulet", base: "Pasta", prot: "Poulet", price: 500, desc: `Pasta fondante, poulet mariné, ${SAUCE}.` },
      { name: "Pasta Viande", base: "Pasta", prot: "Viande", price: 650, desc: `Pasta fondante, viande marinée, ${SAUCE}.` },
      { name: "Pasta Mixte", base: "Pasta", prot: "Mixte", price: 750, desc: `Pasta fondante, poulet et viande, ${SAUCE}.` },
      { name: "Pasta Champignons Frais", base: "Pasta", prot: "Champignons", price: 600, desc: "Pasta sauce fromage, champignons frais, mozzarella, cheddar." }
    ],
    supplementsBol: supplements,

    /* ---------------- Pita, Gyros, plats et tenders ---------------- */
    meatChoices: ["Viande", "Poulet", "Mixte"],
    pita: [
      { name: "Pita Classique", price: 400, choice: true, desc: `${PITA}, avec frites.` },
      { name: "Pita L'Authentique", price: 650, choice: true, desc: `${PITA}.` },
      { name: "Gyros Classique", price: 400, choice: true, desc: `${PITA}, avec frites.` },
      { name: "Gyros L'Authentique", price: 650, choice: true, desc: `${PITA}.` },
      { name: "Plat Kebab", price: 900, choice: true, desc: "Frites, salade, sauce au choix, chou rouge, cornichons. Avec pain pita." },
      { name: "Plat Tenders", price: 900, desc: "Chicken tenders, frites, salade, sauce au choix, chou rouge, cornichons. Avec pain pita." },
      { name: "Chicken Tender (1 pièce)", price: 200 },
      { name: "Box Tenders", price: 700, desc: "4 tenders, frites et sauce." }
    ],
    supplementsPita: [
      { name: "Tender (pièce)", price: 200 },
      { name: "Vache qui rit", price: 50 },
      { name: "Kiri", price: 100 },
      { name: "Camembert", price: 100 },
      { name: "Barquette de frites", price: 150 }
    ],

    formules: [
      { name: "Formule L'Authentique", price: 800, was: 950, desc: "Pita ou Gyros L'Authentique + barquette de frites + canette." }
    ],

    /* ---------------- Salades ---------------- */
    salades: [
      { name: "Salade Variée", price: 400, desc: "Salade, tomate, concombre, maïs, carotte, olive, oignon rouge, poivron, thon, sauce maison." },
      { name: "Salade au Thon", price: 350, desc: "Salade, tomate, concombre, maïs, thon, olive, oignon rouge, fromage, sauce maison." },
      { name: "Salade César", price: 500, desc: "Salade, poulet pané, croûtons, mozzarella, tomate cerise, sauce César." }
    ],

    /* ---------------- Crêpes & gourmandises (from = « à partir de ») ---------------- */
    crepes: [
      { name: "Crêpe Moelleuse", price: 250, desc: "Garnie de Mordjene, au choix : pâtes ou sucrée." },
      { name: "Crêpe Croustillante", price: 300, desc: "Croustillante à l'extérieur, gourmande à l'intérieur." },
      { name: "Crêpe Kunafa", price: 500, desc: "Garnie de kunafa, pistache et chocolat." },
      { name: "Crêpe Maison", price: 1000, desc: "La traditionnelle, la plus gourmande !" },
      { name: "Crêpe Nutella", price: 300 },
      { name: "Crêpe Nutella Banane", price: 400, from: true },
      { name: "Crêpe Nutella 2 Fruits", price: 500 },
      { name: "Crêpe Nutella 3 Fruits", price: 600 },
      { name: "Crêpe Mordjene", price: 250 },
      { name: "Crêpe Mordjene Banane", price: 350, from: true },
      { name: "Crêpe Mordjene 2 Fruits", price: 450 },
      { name: "Crêpe Mordjene 3 Fruits", price: 550 }
    ],
    pancakes: [
      { name: "Pancakes Mordjene", price: 250 },
      { name: "Pancakes Mordjene Banane", price: 350, from: true },
      { name: "Pancakes Mordjene 2 Fruits", price: 450 },
      { name: "Pancakes Mordjene 3 Fruits", price: 550 },
      { name: "Pancakes Maison", price: 1000 }
    ],
    miniPancakes: [
      { name: "Mini Pancakes Mordjene", price: 250 },
      { name: "Mini Pancakes Mordjene Banane", price: 350, from: true },
      { name: "Mini Pancakes Mordjene 2 Fruits", price: 450 },
      { name: "Mini Pancakes Mordjene 3 Fruits", price: 550 },
      { name: "Mini Pancakes Nutella", price: 300 },
      { name: "Mini Pancakes Nutella Banane", price: 400, from: true },
      { name: "Mini Pancakes Nutella 2 Fruits", price: 500 },
      { name: "Mini Pancakes Nutella 3 Fruits", price: 600 }
    ],

    /* ---------------- Kunafa (1 personne / 2 personnes) ---------------- */
    kunafaSizes: ["1 personne", "2 personnes"],
    kunafa: [
      { name: "Kunafa Fromage", prices: [400, 750], desc: "Pâte croustillante, cœur fondant au fromage, nappée de sirop." },
      { name: "Kunafa Pistache", prices: [550, 900], desc: "Pâte croustillante, crème de pistache, pistaches concassées." },
      { name: "Kunafa Kichta", prices: [550, 900], desc: "Pâte croustillante, crème de kichta traditionnelle, parfumée." },
      { name: "Kunafa Amande et Noix", prices: [500, 850], desc: "Pâte croustillante, crème onctueuse, amandes et noix." },
      { name: "Kunafa Nutella", prices: [500, 850], desc: "Pâte croustillante, garnie de Nutella, parsemée de noisettes." }
    ],

    /* ---------------- Desserts & pâtisseries (prices = deux formats) ---------------- */
    dessertSizes: ["Petit", "Grand"],
    desserts: [
      { name: "Tres Leches (Trilitcha)", price: 200 },
      { name: "Mousse (chocolat, caramel, fraise)", price: 200 },
      { name: "Panna Cotta", price: 200 },
      { name: "Crème Brûlée", prices: [150, 250] },
      { name: "Flan Napolitain", price: 300 },
      { name: "Salade de Fruits", price: 300 },
      { name: "Cheesecake Fruits", price: 350 },
      { name: "Cheesecake (Nutella, pistache, Lotus, Bueno)", price: 350 },
      { name: "Fondant au Chocolat", price: 350 },
      { name: "Brownie", price: 350 },
      { name: "Nougat Glacé", price: 350 },
      { name: "Cake Dubaï", prices: [350, 700] },
      { name: "Tiramisu (classique, chocolat, caramel)", prices: [150, 250] },
      { name: "Tiramisu Pistache / Fruits", price: 300 },
      { name: "Cheesecake Makroud El Louz", price: 450 },
      { name: "San Sebastián", price: 350 }
    ],

    /* ---------------- Boissons ---------------- */
    boissons: [
      { group: "Cafés & boissons chaudes", note: "Supplément goût noisette ou caramel : +50 DA", items: [
        ["Café noir / press", 100], ["Café américain", 100], ["Café au lait", 100], ["Nescafé", 200],
        ["Cappuccino", 250], ["Caffè latte (noisette, caramel, vanille)", 200], ["Caffè mocha", 300]] },
      { group: "Jus naturels", items: [
        ["Jus de citron", 250], ["Jus d'orange", 300], ["Jus de grenade", 300], ["Jus de fraise", 300],
        ["Jus cocktail", 350], ["Jus de kiwi", 400], ["Jus de goyave", 400]] },
      { group: "Mojitos", note: "Au choix : myrtille, mangue, fraise, grenadine, fruit de la passion, ananas", items: [
        ["Mojito oriental", 250], ["Mojito classique", 350], ["Mojito Blue Hawaii", 350], ["Mojito Energy", 400], ["Mojito au choix", 400]] },
      { group: "Mocktails", items: [
        ["Mocktail Pink Lady", 450], ["Mocktail Hawaii", 450], ["Mocktail Bora Bora", 450], ["Mocktail Piña Colada", 450], ["Mocktail Rose Lady", 450]] },
      { group: "Smoothies & frappés", items: [
        ["Smoothie banane", 350], ["Smoothie fraise", 350], ["Smoothie fruits mélangés", 400], ["Smoothie mangue", 500], ["Smoothie avocat", 800]] },
      { group: "Milkshakes & frappuccinos", items: [
        ["Frappuccino vanille / chocolat / caramel", 350], ["Milkshake banane / fraise", 350], ["Milkshake Nutella", 500],
        ["Milkshake pistache / Lotus", 550], ["Milkshake spécial (Bueno, Snickers, Mars, Bounty, Milka)", 600],
        ["Iced coffee", 300], ["Iced tea", 250]] },
      { group: "Sodas & eau", items: [
        ["Soda 30 cl", 70], ["Jus 33 cl", 80], ["Canette", 100], ["Soda 1 L", 150], ["Jus 1 L", 150], ["Eau petit modèle", 30], ["Eau grand modèle", 50]] }
    ]
  };
})();
