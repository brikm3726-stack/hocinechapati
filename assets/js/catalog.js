/* HOCINE CHAPATI — catalogue de commande + panier partagé (accueil et page Menu)
   Construit à partir de menu-data.js. Chaque article a un id « <catégorie>-<position> » (ex. pizza-8).
   Le panier est gardé dans le navigateur du client (localStorage) : un article ajouté sur la page Menu
   se retrouve dans l'iPhone de commande de l'accueil. */
(() => {
  const D = window.HC;
  if (!D) return;

  const CH = [["pnj-chapati", 1], ["chapati-close"], ["chapati-mid"], ["chapati-right"], ["chapati-hero"]];
  const PZ = [["pnj-pizza", 1], ["pizza-1"], ["pizza-2"], ["pizza-3"], ["pizza-4"], ["pizza-5"]];
  const bowlImg = (b) => [b.base === "Poutine" ? "bol-poutine" : b.prot === "Viande" ? "bol-pasta-viande" : "bol-pasta"];
  const sized = (labels, prices) => labels.map((label, i) => ({ label, price: prices[i] }));
  const meats = (price) => D.meatChoices.map((label) => ({ label, price }));
  const simple = (arr) => arr.map((x) => ({ src: x, name: x.name, desc: x.desc, price: x.price, from: x.from }));
  const CATS = [
    { id: "s2", label: "Chapati S-2", sub: "Saison 2", items: D.chapatiS2.map((c, i) => ({ src: c, name: c.name, desc: c.desc, price: c.price, supps: D.supplementsS2, img: CH[i % CH.length] })) },
    { id: "orig", label: "Chapati Original", items: D.chapatiOriginal.map((c) => ({ src: c, name: c.name, desc: c.desc, price: c.price, supps: D.supplementsOriginal, img: ["chapati-original"] })) },
    { id: "pizza", label: "Pizzas", sub: D.pizzaSizes.join(" · "), items: D.pizzas.map((p, i) => ({ src: p, name: p.name, desc: p.desc, sizes: sized(D.pizzaSizes, p.prices), sizeLabel: "Format", supps: D.supplementsPizza, img: PZ[i % PZ.length] })) },
    { id: "pocket", label: "Pizza Pocket", items: D.pizzaPocket.flatMap((g) => g.items.map((x, i) => ({ src: x, name: x.name.replace(/^Pocket /, "Pizza Pocket "), desc: x.desc, price: x.price, img: PZ[(i + 2) % PZ.length] }))) },
    { id: "bol", label: "Poutine & Pasta", items: D.bowls.map((b) => ({ src: b, name: b.name, desc: b.desc, price: b.price, supps: D.supplementsBol, img: bowlImg(b) })) },
    { id: "pita", label: "Pita & Gyros", sub: "Plats · Tenders", items: D.pita.map((p) => ({ src: p, name: p.name, desc: p.desc, ...(p.choice ? { sizes: meats(p.price), sizeLabel: "Garniture" } : { price: p.price }), supps: D.supplementsPita })) },
    { id: "form", label: "Formule", items: D.formules.map((f) => ({ src: f, name: f.name, desc: f.desc, sizes: meats(f.price), sizeLabel: "Garniture", img: ["logo", 1] })) },
    { id: "salade", label: "Salades", items: simple(D.salades) },
    { id: "crepe", label: "Crêpes", items: simple(D.crepes) },
    { id: "pancake", label: "Pancakes", sub: "et mini pancakes", items: simple([...D.pancakes, ...D.miniPancakes]) },
    { id: "kunafa", label: "Kunafa", sub: "1 ou 2 personnes", items: D.kunafa.map((x) => ({ src: x, name: x.name, desc: x.desc, sizes: sized(D.kunafaSizes, x.prices), sizeLabel: "Pour" })) },
    { id: "dessert", label: "Desserts", items: D.desserts.map((x) => (x.prices ? { src: x, name: x.name, sizes: sized(D.dessertSizes, x.prices), sizeLabel: "Format" } : { src: x, name: x.name, price: x.price })) },
    { id: "drink", label: "Boissons", items: D.boissons.flatMap((g) => g.items.map((t) => ({ src: t, name: t[0], price: t[1], desc: g.group }))) }
  ];
  const ITEMS = {};
  const BY_SRC = new Map();   // objet de menu-data.js -> article du catalogue
  CATS.forEach((c) => c.items.forEach((it, i) => {
    it.id = `${c.id}-${i}`;
    it.cat = c.id;
    ITEMS[it.id] = it;
    BY_SRC.set(it.src, it);
  }));

  /* ---------- panier (gardé dans ce navigateur) ---------- */
  const STORE = "hc-panier-v2";   // v2 : nouvelle carte (nov. 2026), les anciens paniers ne correspondent plus
  // le prix est toujours recalculé depuis la carte (jamais depuis le stockage)
  const info = (l) => {
    const it = ITEMS[l.id];
    if (!it) return null;
    const base = it.sizes ? it.sizes.find((s) => s.label === l.size)?.price : it.price;
    if (base == null) return null;
    const supps = (it.supps || []).filter((s) => l.supps.includes(s.name));
    const unit = base + supps.reduce((t, s) => t + s.price, 0);
    return { it, supps, unit, total: unit * l.qty };
  };
  const load = () => {
    let v = [];
    try { v = JSON.parse(localStorage.getItem(STORE)); } catch { /* stockage indisponible */ }
    return Array.isArray(v) ? v.filter((l) => l && l.qty > 0 && Array.isArray(l.supps) && info(l)) : [];
  };
  const save = (cart) => { try { localStorage.setItem(STORE, JSON.stringify(cart)); } catch { /* ignoré */ } };
  // ajoute une ligne (ou augmente la quantité d'une ligne identique)
  const addLine = (cart, it, size, supps, qty) => {
    const key = [it.id, size || "", [...supps].sort().join("+")].join("|");
    const line = cart.find((l) => l.key === key);
    if (line) line.qty = Math.min(50, line.qty + qty);
    else cart.push({ key, id: it.id, size, supps, qty });
    return cart;
  };
  const totals = (cart) => cart.reduce((t, l) => { const i = info(l); return { n: t.n + l.qty, sum: t.sum + i.total }; }, { n: 0, sum: 0 });

  /* boîte de pizza « à emporter » : sort du sac de la page Menu et rentre dans l'iPhone de l'accueil */
  // boîte vue de trois quarts : grand couvercle avec le logo Hocine Chapati (étiquette ronde), bande rouge devant
  const BOX = `<svg viewBox="0 0 140 124" aria-hidden="true">
    <defs><clipPath id="hcBoxLogo"><circle r="27"/></clipPath></defs>
    <path d="M54 6c-3 5 3 7 0 12M70 2c-3 6 3 8 0 14M86 6c-3 5 3 7 0 12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
    <path d="M26 22h88l20 62H6z" fill="#E7B271" stroke="#8E5E2C" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M30 27h80l16 52H14z" fill="none" stroke="#C98A47" stroke-width="1.5" stroke-dasharray="4 3"/>
    <g transform="translate(70 53) scale(1 .78)">
      <circle r="30" fill="#fff" stroke="#D7191F" stroke-width="3"/>
      <image href="assets/img/logo.webp" x="-27" y="-27" width="54" height="54" clip-path="url(#hcBoxLogo)"/>
    </g>
    <rect x="6" y="84" width="128" height="30" rx="3" fill="#C98A47" stroke="#8E5E2C" stroke-width="2.5"/>
    <rect x="6" y="91" width="128" height="14" fill="#D7191F"/>
    <text x="70" y="101.5" text-anchor="middle" font-family="Arial, sans-serif" font-size="9.5" font-weight="900" fill="#fff" letter-spacing="1">HOCINE CHAPATI</text>
  </svg>`;
  const BOX_KEY = "hc-boite";   // la boîte part de la page Menu et arrive dans l'iPhone de l'accueil

  window.HCCatalog = { CATS, ITEMS, STORE, of: (src) => BY_SRC.get(src), info, load, save, addLine, totals, BOX, BOX_KEY };
})();
