/* HOCINE CHAPATI — cartes papier (affiches) de la page Menu, avec zones cliquables
   title : nom du menu affiché au-dessus de l'affiche.
   Chaque zone [nom de l'article, x, y, largeur, hauteur, format?] est en pixels de l'affiche (1086 × 1448).
   Le nom doit être exactement celui du catalogue de commande (catalog.js / menu-data.js) :
   un clic sur la zone ajoute cet article au panier. Avec un « format » (ex. "Mega", "2 personnes"),
   la zone est un prix : le clic ajoute directement ce format. Sans format, un article à plusieurs
   formats ouvre une petite bulle de choix.
   plus: "bl" = le petit « + » se place en bas à gauche de la zone (sur la photo) au lieu d'en haut à droite ;
   plus: "none" = pas de « + » (les prix eux-mêmes sont cliquables). */
(() => {
  // colonnes de liste (boissons / desserts) : une ligne par article
  const lines = (names, x, y0, step, w, h = step) => names.map((n, i) => [n, x, Math.round(y0 + i * step), w, h]);
  // rangée de cases de même largeur
  const cells = (names, x0, x1, y, h, gap = 5) => {
    const w = (x1 - x0 - gap * (names.length - 1)) / names.length;
    return names.map((n, i) => [n, Math.round(x0 + i * (w + gap)), y, Math.round(w), h]);
  };
  // menu pizza : par ligne, le nom (choix du format) + le prix Standard + le prix Mega
  const ROWS = [442, 519, 606, 692, 779, 866, 952, 1038, 1124, 1211, 1300];
  const pizzaCol = (names, xName, xStd, xMega, xEnd) => names.flatMap((n, i) => {
    const y = ROWS[i], h = ROWS[i + 1] - ROWS[i] - 3;
    return [[n, xName, y, xStd - xName - 2, h], [n, xStd, y, xMega - xStd - 2, h, "Standard"], [n, xMega, y, xEnd - xMega, h, "Mega"]];
  });
  // menu kunafa : par ligne, la photo + le nom (choix) + le prix 1 personne + le prix 2 personnes
  const kunafaRow = (n, y, h) => [[n, 8, y, 776, h], [n, 790, y, 136, h, "1 personne"], [n, 932, y, 142, h, "2 personnes"]];

  window.HC_CARTES = {
    chapati: {
      title: "Chapati Original", img: "carte-chapati", alt: "Carte Chapati Originale de Hocine Chapati", plus: "bl",
      spots: [
        ["Chapati Complet", 16, 262, 524, 218], ["Chapati Thon Fromage", 546, 262, 526, 218],
        ["Chapati Double Fromage", 16, 487, 524, 215], ["Chapati Kiri", 546, 487, 526, 215],
        ["Chapati Salami", 16, 708, 524, 217], ["Chapati Tout en Double", 546, 708, 526, 217],
        ["Chapati Double Fromage Double Omelette", 16, 930, 524, 222], ["Chapati Double Thon Double Fromage", 546, 930, 526, 222],
        ["Chapati Sans Piquant", 16, 1158, 524, 147]
      ]
    },
    s2: {
      title: "Chapati Saison 2", img: "carte-chapati-s2", alt: "Carte Chapati Saison 2 de Hocine Chapati",
      spots: [
        ["Chapati S-2 3 Fromages", 14, 305, 524, 330], ["Chapati S-2 Poulet", 548, 305, 524, 330],
        ["Chapati S-2 Poulet Spicy", 14, 645, 524, 328], ["Chapati S-2 Viande", 548, 645, 524, 328],
        ["Chapati S-2 Mixte", 14, 982, 524, 318], ["Chapati S-2 Champignons", 548, 982, 524, 318]
      ]
    },
    pizza: {
      title: "Menu Pizza", img: "carte-pizza", alt: "Menu Pizza de Hocine Chapati, formats Standard et Mega", plus: "none",
      spots: [
        ...pizzaCol(["Pizza Marguerite", "Pizza Canadian", "Pizza Vegetarian", "Pizza Americano", "Pizza Chicken",
          "Pizza Tuna Fish", "Pizza Tropical", "Pizza Spécial", "Pizza House", "Pizza Mix Spécial"], 20, 337, 430, 533),
        ...pizzaCol(["Pizza Hawaï", "Pizza House Classic", "Pizza Queen", "Pizza Trois Fromages", "Pizza Extra Vanga",
          "Pizza Pepperoni", "Pizza 3 Viandes", "Pizza Mexicaine", "Pizza Poulet Fumé"], 556, 866, 960, 1066)
      ]
    },
    pocket: {
      title: "Pizza Pocket", img: "carte-pizza-pocket", alt: "Carte Pizza Pocket de Hocine Chapati",
      spots: [
        ...lines(["Pizza Pocket Poulet", "Pizza Pocket Poulet Spicy", "Pizza Pocket Champignons", "Pizza Pocket Végétarienne"], 32, 312, 73, 1030, 70),
        ...lines(["Pizza Pocket Viande", "Pizza Pocket Thon", "Pizza Pocket Pepperoni", "Pizza Pocket Poulet Fumé"], 32, 722, 74, 1030, 72),
        ...lines(["Pizza Pocket 3 Fromages", "Pizza Pocket 4 Fromages", "Pizza Pocket Royal"], 32, 1120, 76, 1030, 74)
      ]
    },
    bol: {
      title: "Poutine & Pasta", img: "carte-poutine-pasta", alt: "Carte Poutine et Pasta de Hocine Chapati", plus: "none",
      spots: [
        ["Poutine Poulet", 40, 345, 432, 116], ["Poutine Viande", 40, 467, 432, 116], ["Poutine Mixte", 40, 589, 432, 118],
        ["Pasta Poulet", 618, 874, 444, 102], ["Pasta Viande", 618, 982, 444, 102], ["Pasta Mixte", 618, 1090, 444, 104],
        ["Pasta Champignons Frais", 618, 1198, 444, 94]
      ]
    },
    pita: {
      title: "Pita & Gyros", img: "carte-pita-gyros", alt: "Carte Pita, Gyros, plats et tenders de Hocine Chapati",
      spots: [
        ["Pita Classique", 20, 236, 245, 220], ["Pita L'Authentique", 268, 236, 266, 220],
        ["Gyros Classique", 556, 236, 250, 220], ["Gyros L'Authentique", 808, 236, 258, 220],
        ["Formule L'Authentique", 14, 466, 1058, 150],
        ["Plat Tenders", 14, 628, 526, 270], ["Plat Kebab", 548, 628, 524, 270],
        ["Chicken Tender (1 pièce)", 560, 998, 210, 64], ["Box Tenders", 560, 1064, 250, 60]
      ]
    },
    salades: {
      title: "Menu Salades", img: "carte-salades", alt: "Carte Salades de Hocine Chapati", plus: "bl",
      spots: [
        ["Salade Variée", 6, 352, 1074, 292], ["Salade au Thon", 6, 652, 1074, 296], ["Salade César", 6, 956, 1074, 300]
      ]
    },
    crepes: {
      title: "Crêpes & Gourmandises", img: "carte-crepes", alt: "Carte Crêpes, Pancakes et Mini Pancakes de Hocine Chapati",
      spots: [
        ["Crêpe Moelleuse", 14, 268, 314, 268], ["Crêpe Croustillante", 334, 268, 244, 268],
        ["Crêpe Kunafa", 584, 268, 248, 268], ["Crêpe Maison", 838, 268, 236, 268],
        ...cells(["Crêpe Nutella", "Crêpe Nutella Banane", "Crêpe Nutella 2 Fruits", "Crêpe Nutella 3 Fruits",
          "Crêpe Mordjene", "Crêpe Mordjene Banane", "Crêpe Mordjene 2 Fruits", "Crêpe Mordjene 3 Fruits"], 8, 1076, 543, 190),
        ...cells(["Pancakes Mordjene", "Pancakes Mordjene Banane", "Pancakes Mordjene 2 Fruits", "Pancakes Mordjene 3 Fruits", "Pancakes Maison"], 8, 1076, 806, 208),
        ...cells(["Mini Pancakes Mordjene", "Mini Pancakes Mordjene Banane", "Mini Pancakes Mordjene 2 Fruits", "Mini Pancakes Mordjene 3 Fruits",
          "Mini Pancakes Nutella", "Mini Pancakes Nutella Banane", "Mini Pancakes Nutella 2 Fruits", "Mini Pancakes Nutella 3 Fruits"], 8, 1076, 1060, 196)
      ]
    },
    kunafa: {
      title: "Menu Kunafa", img: "carte-kunafa", alt: "Menu Kunafa de Hocine Chapati, pour 1 ou 2 personnes",
      spots: [
        ...kunafaRow("Kunafa Fromage", 364, 190), ...kunafaRow("Kunafa Pistache", 561, 182), ...kunafaRow("Kunafa Kichta", 749, 184),
        ...kunafaRow("Kunafa Amande et Noix", 939, 192), ...kunafaRow("Kunafa Nutella", 1138, 202)
      ]
    },
    boissons: {
      title: "Boissons & Desserts", img: "carte-boissons-desserts", alt: "Carte Boissons et Desserts de Hocine Chapati",
      spots: [
        // Cafés & boissons chaudes (la ligne « Thé » n'est pas dans le catalogue)
        ...lines(["Café noir / press", "Café américain", "Café au lait", "Nescafé", "Cappuccino", "Caffè latte (noisette, caramel, vanille)"], 20, 223, 21.2, 356, 21),
        ["Caffè mocha", 20, 371, 356, 21],
        ...lines(["Jus de citron", "Jus d'orange", "Jus de grenade", "Jus de fraise", "Jus cocktail", "Jus de kiwi", "Jus de goyave"], 20, 477, 19.3, 336, 19),
        ...lines(["Mojito oriental", "Mojito classique", "Mojito Blue Hawaii", "Mojito Energy"], 20, 650, 20, 336, 20),
        ["Mojito au choix", 20, 730, 336, 44],
        ...lines(["Mocktail Pink Lady", "Mocktail Hawaii", "Mocktail Bora Bora", "Mocktail Piña Colada", "Mocktail Rose Lady"], 20, 834, 20.4, 330, 20),
        ...lines(["Smoothie banane", "Smoothie fraise", "Smoothie fruits mélangés", "Smoothie mangue", "Smoothie avocat"], 20, 1001, 19.6, 330, 19),
        ...lines(["Frappuccino vanille / chocolat / caramel", "Milkshake banane / fraise", "Milkshake Nutella", "Milkshake pistache / Lotus"], 20, 1154, 20, 352, 20),
        ["Milkshake spécial (Bueno, Snickers, Mars, Bounty, Milka)", 20, 1234, 352, 40],
        ["Iced coffee", 20, 1275, 352, 21], ["Iced tea", 20, 1296, 352, 21],
        // Desserts & pâtisseries
        ...lines(["Tres Leches (Trilitcha)", "Mousse (chocolat, caramel, fraise)", "Panna Cotta", "Crème Brûlée", "Flan Napolitain",
          "Salade de Fruits", "Cheesecake Fruits", "Cheesecake (Nutella, pistache, Lotus, Bueno)", "Fondant au Chocolat", "Brownie",
          "Nougat Glacé", "Cake Dubaï", "Tiramisu (classique, chocolat, caramel)", "Tiramisu Pistache / Fruits", "Cheesecake Makroud El Louz",
          "San Sebastián"], 596, 637, 23.9, 456, 23)
      ]
    }
  };
})();
