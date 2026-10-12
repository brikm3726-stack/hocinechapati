/* HOCINE CHAPATI — interactions (vanilla, sans dépendance) */
(() => {
  const D = window.HC;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const TEL = `tel:${D.phoneIntl}`;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const price = (n) => `<span class="price">${n.toLocaleString("fr-FR")}<small>DA</small></span>`;
  const img = (name, alt, w = 400, h = 400) =>
    `<img src="assets/img/${name}.webp" alt="${esc(alt)}" width="${w}" height="${h}" loading="lazy" decoding="async">`;

  document.documentElement.classList.add("js");

  const suppTxt = (arr) => arr.map((s) => `${esc(s.name)} <b>${s.price} DA</b>`).join(" · ");

  /* Chaque bloc ne s'exécute que si sa section existe (index.html / menu.html) */

  /* ---------------- Spécialité ---------------- */
  if ($("#s2List")) {
  $("#s2List").innerHTML = D.chapatiS2
    .map((c) => `<li><b>Chapati ${esc(c.short)}</b>${price(c.price)}<small>${esc(c.desc)}</small></li>`)
    .join("");
  $("#origList").innerHTML = D.chapatiOriginal
    .map((c) => `<li><span>${esc(c.name.replace("Chapati ", ""))}</span>${price(c.price)}</li>`)
    .join("");
  $("#origSupp").innerHTML = `Suppléments : ${suppTxt(D.supplementsOriginal)}`;

  /* Prix affichés en dur dans le HTML, synchronisés avec les données */
  const all = [...D.chapatiOriginal, ...D.chapatiS2, ...D.formules];
  $$("[data-price-of]").forEach((el) => {
    const it = all.find((x) => x.name === el.dataset.priceOf);
    if (it) el.textContent = `${it.price} DA`;
  });

  /* Menu pizzas de la page 2 */
  $("#pzRows").innerHTML = D.pizzas
    .map((p) => `<div class="pz__row"><span class="pz__name">${esc(p.name.replace("Pizza ", ""))}</span>${p.prices.map((n) => price(n)).join("")}</div>`)
    .join("");
  $("#pzSupp").innerHTML = `Suppléments : ${suppTxt(D.supplementsPizza)}`;

  /* Mobile : les longues listes de prix sont repliées (4 lignes + « Voir tout ») */
  [[".orig", D.chapatiOriginal.length], [".pz", D.pizzas.length]].forEach(([sel, count]) => {
    const box = $(sel);
    box.classList.add("is-collapsed");
    const btn = document.createElement("button");
    btn.className = "more-btn";
    btn.type = "button";
    const label = () => (btn.textContent = box.classList.contains("is-collapsed") ? `Voir tout (${count})` : "Voir moins");
    label();
    btn.addEventListener("click", () => { box.classList.toggle("is-collapsed"); label(); });
    box.querySelector(".supp").before(btn);
  });
  }

  /* ---------------- Carrousels automatiques : pizzas + chapatis (accueil) ----------------
     Mêmes photos que la page Menu. Les cartes défilent en continu de droite à gauche,
     ralentissent sous la souris, et se glissent au doigt. */
  const plateCard = (it, i, photo) => `
      <article class="pcard">
        <figure class="pcard__img pcard__img--plate">
          <span class="pcard__dish"><img src="assets/img/${photo}.webp" alt="" width="400" height="400" loading="lazy" decoding="async"></span>
          <span class="pcard__num">${String(i + 1).padStart(2, "0")}</span>
        </figure>
        <a class="btn btn--red pcard__btn" href="${TEL}" data-order>Commander</a>
        <div class="pcard__body">
          <h3>${esc(it.name)}</h3>
          ${it.desc ? `<p>${esc(it.desc)}</p>` : ""}
          ${it.prices
            ? `<div class="sizes">${it.labels.map((s, k) => `<span>${s}<b>${it.prices[k]} DA</b></span>`).join("")}</div>`
            : `<div class="pcard__price">${it.price}<small>DA</small></div>`}
        </div>
      </article>`;
  const suppBox = (groups, title = "Suppléments", note = "à ajouter à votre commande") => `
      <div class="supbox${groups.length > 1 ? " supbox--2" : ""} reveal">
        <h3 class="supbox__title">${title} <small>${note}</small></h3>
        <div class="supbox__cols">${groups.map(([t, arr]) => `
          <div>${t ? `<p class="supbox__sub">${t}</p>` : ""}
            <ul>${arr.map((x) => `<li><span>${esc(x.name)}</span><b>${x.text ? esc(x.text) : `+${x.price} DA`}</b></li>`).join("")}</ul>
          </div>`).join("")}
        </div>
      </div>`;

  const marquee = (wrap) => {
    const track = $(".hs__track", wrap);
    const originals = $$(".pcard", track);
    if (!originals.length) return;
    if (reduce) { wrap.classList.add("hs--static"); return; }
    const SPEED = innerWidth <= 760 ? 38 : 55;     // pixels par seconde
    const copy = (c) => {
      const k = c.cloneNode(true);
      k.setAttribute("aria-hidden", "true");
      k.querySelectorAll("a").forEach((a) => (a.tabIndex = -1));
      return k;
    };
    originals.forEach((c) => track.append(copy(c)));   // 2e série pour une boucle sans fin
    let cards = $$(".pcard", track), centers = [], loopW = 1;
    const measure = () => {
      loopW = cards[originals.length].offsetLeft - cards[0].offsetLeft;
      // très grand écran : on ajoute des séries tant que la piste ne couvre pas l'écran
      while (track.scrollWidth < loopW + wrap.clientWidth + 50) {
        originals.forEach((c) => track.append(copy(c)));
        cards = $$(".pcard", track);
      }
      centers = cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
    };
    let x = 0, speed = SPEED, slow = false, drag = null, dragged = false, raf = 0, last = 0, visible = false;
    const paint = () => {
      x = ((x % loopW) - loopW) % loopW;               // reste entre -loopW et 0
      track.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      const mid = wrap.clientWidth / 2, span = wrap.clientWidth * 0.6;
      cards.forEach((c, k) => {
        const d = Math.min(1, Math.abs(centers[k] + x - mid) / span);
        c.style.transform = `scale(${(1 - d * 0.1).toFixed(3)})`;
        c.style.opacity = (1 - d * 0.45).toFixed(3);
      });
    };
    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(64, t - last) : 16;
      last = t;
      speed += ((slow || drag ? 0 : SPEED) - speed) * 0.08;   // ralentit / repart en douceur
      if (!drag) x -= (speed * dt) / 1000;
      paint();
    };
    const start = () => { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(tick); } };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }, { rootMargin: "120px 0px" }).observe(wrap);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    wrap.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") slow = true; });
    wrap.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") slow = false; });
    wrap.addEventListener("focusin", () => (slow = true));
    wrap.addEventListener("focusout", () => (slow = false));
    // glisser au doigt ou à la souris
    wrap.addEventListener("pointerdown", (e) => { if (e.button === 0) { drag = { x0: e.clientX, x }; dragged = false; } });
    addEventListener("pointermove", (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x0;
      if (Math.abs(dx) > 6) dragged = true;
      x = drag.x + dx;
      if (!raf) paint();
    }, { passive: true });
    const end = () => { drag = null; };
    addEventListener("pointerup", end);
    addEventListener("pointercancel", end);
    wrap.addEventListener("click", (e) => { if (dragged) { e.preventDefault(); e.stopPropagation(); dragged = false; } }, true);
    const refresh = () => { measure(); paint(); };
    addEventListener("resize", refresh, { passive: true });
    addEventListener("load", refresh);
    refresh();
  };

  if ($("#pizzaGrid")) {
    $("#pizzaGrid").innerHTML = D.pizzas
      .map((p, i) => plateCard({ name: p.name, desc: p.desc, labels: D.pizzaSizes, prices: p.prices }, i, "pizza-ronde"))
      .join("");
    $("#pizzaSupp").innerHTML = suppBox([["", D.supplementsPizza]]);
    marquee($("#pizzaHS"));
  }
  if ($("#bolGrid")) {
    $("#bolGrid").innerHTML = D.bowls
      .map((b, i) => plateCard({ name: b.name, desc: `Base ${b.base.toLowerCase()}, garniture ${b.prot.toLowerCase()}.`, labels: D.bowlSizes, prices: b.prices }, i, "bol-rond"))
      .join("");
    const supp = D.supplementsBol || [];
    if (supp.length) $("#bolSupp").innerHTML = suppBox([["", supp]]);
    else {
      // pas encore de prix de suppléments : on présente la composition du bol (vrais prix)
      const nb = (n) => n.toLocaleString("fr-FR");
      const range = D.bowlSizes.map((label, k) => {
        const all = D.bowls.map((b) => b.prices[k]);
        return { name: `Taille ${label}`, text: `${nb(Math.min(...all))} – ${nb(Math.max(...all))} DA` };
      });
      const base = [...new Set(D.bowls.map((b) => b.base))].join(" ou ");
      const prot = [...new Set(D.bowls.map((b) => b.prot))].join(", ").replace(/, ([^,]*)$/, " ou $1");
      $("#bolSupp").innerHTML = suppBox(
        [["Tailles", range], ["Au choix", [{ name: "Base", text: base }, { name: "Garniture", text: prot }]]],
        "Composez votre bol", "taille, base et garniture"
      );
    }
    marquee($("#bolHS"));
  }
  if ($("#chapatiGrid")) {
    $("#chapatiGrid").innerHTML = [...D.chapatiS2, ...D.chapatiOriginal]
      .map((c, i) => plateCard({ name: c.name, desc: c.desc, price: c.price }, i, "chapati-rond"))
      .join("");
    $("#chapatiSupp").innerHTML = suppBox([["Chapati Original", D.supplementsOriginal], ["Chapati S-2", D.supplementsS2]]);
    marquee($("#chapatiHS"));
  }

  /* ---------------- Bowls ---------------- */
  if ($("#bowlRows")) $("#bowlRows").innerHTML = D.bowls
    .map((b) => `<div class="bowl-table__row" role="row">
        <span class="bowl-table__name" role="cell">${esc(b.base)}<small>${esc(b.prot)}</small></span>
        ${b.prices.map((p) => `<span role="cell">${price(p)}</span>`).join("")}
      </div>`)
    .join("");

  /* ---------------- Menu (menu.html) ----------------
     En-tête façon photo 55, catégories façon photo 44 (colonne crème + vague verte + assiettes) */
  if ($("#menuPanel")) {
  const ICON = {
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.2 4.2 0 0 1 12 7.3a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20Z"/>',
    fire: '<path d="M12 3c.8 3.4 5 5.2 5 9.8a5 5 0 0 1-10 0c0-2.4 1.3-3.6 1.9-5 .8 1.5 2 2 2 2S10.4 6.3 12 3Z"/>',
    leaf: '<path d="M5 19C5 11 10 5.5 19 5c0 9-5.5 14-14 14Z"/><path d="M5 19l8-8"/>',
    oven: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 9h17M7 7h.01M10 7h.01"/><rect x="7" y="11.5" width="10" height="5" rx="1"/>',
    cheese: '<path d="M3 15 15 5l6 4v8H3v-2Z"/><path d="M3 15h18"/><circle cx="8" cy="18" r="1"/><circle cx="14" cy="12" r="1.1"/>',
    size: '<circle cx="7" cy="15" r="3"/><circle cx="15.5" cy="12.5" r="5.5"/>',
    share: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5V12l6 6M12 12l-6 6"/>',
    bowl: '<path d="M3 11.5h18a9 9 0 0 1-18 0Z"/><path d="M8.5 8c0-1.6 1-2 1-3.5M12 8c0-1.6 1-2 1-3.5M15.5 8c0-1.6 1-2 1-3.5"/>',
    plate: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/>',
    cup: '<path d="M6.5 8h11l-1.4 12H7.9L6.5 8Z"/><path d="M5 8h14M12 8V3.5l3-1"/>'
  };
  const icon = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[k]}</svg>`;
  const da = (n) => `${n.toLocaleString("fr-FR")}&nbsp;DA`;
  const pic = (src, kind) => `<figure class="dish__plate${kind ? ` dish__plate--${kind}` : ""}"><img src="assets/img/${src}.webp" alt="" width="400" height="400" loading="lazy" decoding="async"></figure>`;
  const orderLink = `<a class="dish__order" href="${TEL}" data-order>Commander <span aria-hidden="true">→</span></a>`;
  const single = (n) => `<span class="dish__price">${da(n)}</span>`;
  const sizes = (labels, prices) => `<div class="dish__sizes">${labels.map((l, j) => `<span><small>${l}</small>${da(prices[j])}</span>`).join("")}</div>`;
  const dish = (o, i) => `
    <article class="dish${i % 2 ? " dish--alt" : ""}">
      ${o.plate}
      <div class="dish__body">
        <h3 class="dish__name">${esc(o.name)}</h3>
        ${o.desc ? `<p class="dish__desc">${esc(o.desc)}</p>` : ""}
        <div class="dish__foot">${o.price}${orderLink}</div>
      </div>
    </article>`;
  const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  const row = (name, n) => `<li><span>${esc(cap(name))}</span><i aria-hidden="true"></i><b>${da(n)}</b></li>`;
  const gcard = (title, rows) => `<div class="gcard"><h3 class="gcard__title">${title}</h3><ul class="gcard__rows">${rows}</ul></div>`;
  const supCard = (groups) => `
    <div class="mcat__card">
      <h3>Suppléments</h3>
      ${groups.map(([t, arr]) => `${t ? `<p class="mcat__card-sub">${t}</p>` : ""}<ul>${arr.map((s) => `<li><span>${esc(s.name)}</span><b>+${da(s.price)}</b></li>`).join("")}</ul>`).join("")}
    </div>`;
  const layout = (c, list) => `
    <div class="container mcat__grid">
      <aside class="mcat__info">
        <p class="mcat__kicker">${c.kicker}</p>
        <h2 class="mcat__title">${c.title}</h2>
        <p class="mcat__tag">${c.tag}</p>
        <ul class="mcat__feats">${c.feats.map(([k, t]) => `<li>${icon(k)}<span>${t}</span></li>`).join("")}</ul>
        ${c.card || ""}
        <a class="mcat__cta" href="${TEL}" data-order>Commander · 0556 72 56 81</a>
      </aside>
      <div class="mcat__list"><span class="mcat__green" aria-hidden="true"></span>${list}</div>
    </div>`;
  const note = (t) => `<p class="mcat__note">${t}</p>`;

  /* visuels : chapati-* et pnj-* = photos du client ; pizza-* et bol-* = photos d'illustration */

  const RENDER = {
    chapati: () => layout({
      kicker: "01 · La spécialité", title: "Chapati", tag: "celui qui fait revenir",
      feats: [["clock", "Préparé<br>à la commande"], ["heart", "Garniture<br>généreuse"], ["fire", "Servi<br>bien chaud"], ["leaf", "Original<br>ou Saison 2"]],
      card: supCard([["Chapati Original", D.supplementsOriginal], ["Chapati S-2", D.supplementsS2]])
    },
      `<p class="mcat__sub">Chapati S-2 <small>Saison 2</small></p>` +
      D.chapatiS2.map((c, i) => dish({ name: c.name, desc: c.desc, price: single(c.price), plate: pic("chapati-rond", "free") }, i)).join("") +
      gcard("Chapati Original", D.chapatiOriginal.map((c) => row(c.name.replace("Chapati ", ""), c.price)).join(""))),

    pizzas: () => layout({
      kicker: "02 · Au four", title: "Pizzas", tag: "gourmandes, à partager",
      feats: [["oven", "Pâte<br>cuite au four"], ["cheese", "Fromage<br>qui file"], ["size", "3 formats<br>Mini · Normal · Mega"], ["share", "Le format Mega<br>à partager"]],
      card: supCard([["", D.supplementsPizza]])
    },
      D.pizzas.map((p, i) => dish({ name: p.name, desc: p.desc, price: sizes(D.pizzaSizes, p.prices), plate: pic("pizza-ronde", "round") }, i)).join("") +
      note("Photos d'illustration.")),

    bowls: () => layout({
      kicker: "03 · Tout dans un bol", title: "Bol H Chapati", tag: "généreux et bien chaud",
      feats: [["bowl", "Base Pasta<br>ou Poutine"], ["heart", "Poulet, Viande<br>ou Mixte"], ["size", "Tailles<br>M · L · XL"], ["clock", "Préparé<br>à la commande"]]
    },
      D.bowls.map((b, i) => dish({ name: b.name, desc: `Base ${b.base.toLowerCase()}, garniture ${b.prot.toLowerCase()}.`, price: sizes(D.bowlSizes, b.prices), plate: pic("bol-rond", "free") }, i)).join("") +
      note("Photos d'illustration.")),

    formules: () => layout({
      kicker: "04 · Le repas complet", title: "Formules", tag: "kebab ou maqloub",
      feats: [["plate", "Formule<br>Kebab"], ["plate", "Formule Maqloub<br>Poulet · Abat · Viande"]]
    },
      gcard("Nos formules", D.formules.map((f) => row(f.name.replace("Formule ", ""), f.price)).join(""))),

    boissons: () => layout({
      kicker: "05 · Pour accompagner", title: "Boissons", tag: "fraîches ou gourmandes",
      feats: [["cup", "Frappuccino"], ["cup", "Milkshakes"], ["cup", "Sodas<br>& jus"], ["cup", "Eau"]]
    },
      D.boissons.map((g) => gcard(g.group, g.items.map(([n, p]) => row(n, p)).join(""))).join(""))
  };

  /* en-tête : deux plats vedettes avec leurs vrais prix */
  const complet = D.chapatiOriginal.find((c) => c.name === "Chapati Complet");
  const marg = D.pizzas.find((p) => p.name === "Pizza Margherita");
  $("#mheroPlates").innerHTML = `
    <figure class="mplate mplate--a"><img src="assets/img/chapati-rond.webp" alt="Chapati doré à la poêle, garni de thon, œuf et fromage" width="800" height="800"></figure>
    <div class="mglass mglass--a"><p class="mglass__name">${esc(complet.name)}</p><p>${esc(complet.desc)}</p><span class="mglass__price">${da(complet.price)}</span></div>
    <figure class="mplate mplate--b"><img src="assets/img/pizza-ronde.webp" alt="Pizza garnie, fromage fondant et poivrons" width="800" height="800"></figure>
    <div class="mglass mglass--b"><p class="mglass__name">${esc(marg.name)}</p><p>${esc(marg.desc)}</p><span class="mglass__price">dès ${da(marg.prices[0])}</span></div>`;

  const panel = $("#menuPanel");
  const tabs = $$(".tab");
  const ink = $(".tabs__ink");
  const moveInk = (t) => {
    ink.style.width = `${t.offsetWidth}px`;
    ink.style.transform = `translateX(${t.offsetLeft}px)`;
  };
  // apparition des assiettes au défilement
  const dio = new IntersectionObserver((ents) => ents.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); dio.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  const paint = (cat) => {
    panel.innerHTML = RENDER[cat]();
    panel.dataset.cat = cat;
    $$(".dish, .gcard", panel).forEach((el) => (reduce ? el.classList.add("is-in") : dio.observe(el)));
  };
  let current = "chapati";
  const show = (cat, animate = true) => {
    current = cat;
    tabs.forEach((t) => {
      const on = t.dataset.cat === cat;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on);
      if (on) { moveInk(t); t.scrollIntoView({ block: "nearest", inline: "center", behavior: reduce ? "auto" : "smooth" }); }
    });
    if (!animate || reduce) { paint(cat); return; }
    panel.classList.add("is-switching");
    setTimeout(() => {
      paint(cat);
      panel.classList.remove("is-switching");
      // si on est déjà descendu dans la carte, on revient au début de la catégorie
      if (panel.getBoundingClientRect().top < 0) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 220);
  };
  tabs.forEach((t) => t.addEventListener("click", () => t.dataset.cat !== current && show(t.dataset.cat)));
  $(".tabs").addEventListener("keydown", (e) => {
    if (!["ArrowRight", "ArrowLeft"].includes(e.key)) return;
    const i = tabs.findIndex((t) => t.dataset.cat === current);
    const n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    n.focus(); show(n.dataset.cat);
  });
  // menu.html#pizzas ouvre directement l'onglet Pizzas (aussi depuis les liens de la page)
  addEventListener("hashchange", () => {
    const h = location.hash.slice(1);
    if (!RENDER[h]) return;
    if (h !== current) show(h, false);
    panel.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  });
  const fromHash = location.hash.slice(1);
  if (RENDER[fromHash]) {
    show(fromHash, false);
    const go = () => panel.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (document.documentElement.classList.contains("has-gate")) addEventListener("gate:done", go, { once: true });
    else requestAnimationFrame(go);
  } else paint("chapati");
  requestAnimationFrame(() => moveInk(tabs.find((t) => t.dataset.cat === current)));
  addEventListener("resize", () => moveInk(tabs.find((t) => t.dataset.cat === current)), { passive: true });
  document.fonts?.ready.then(() => moveInk(tabs.find((t) => t.dataset.cat === current)));
  }

  /* ---------------- Navbar ---------------- */
  const nav = $("#nav");
  // les boutons n'ont pas de fond : leur couleur suit la section qui passe sous la barre
  const zones = $$("[data-nav]");
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("is-scrolled", y > 24);
    // bouton rond « Menu » caché tant que la première page est à l'écran (il couvrirait « Suivant »)
    const hx = $(".hx");
    document.documentElement.classList.toggle("fab-off", !!hx && y < hx.offsetHeight * 0.75);
    const mid = nav.offsetHeight / 2;
    const z = [...zones].reverse().find((el) => { const r = el.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
    if (z) nav.dataset.theme = (innerWidth <= 960 && z.dataset.navMobile) || z.dataset.nav;
    // sur la photo de la page 1 : aucun fond ; plus bas : léger voile pour garder les liens lisibles
    const first = zones.find((el) => el.offsetHeight > 0);   // 1re page visible (vidéo sur téléphone, plats sur ordinateur)
    nav.classList.toggle("is-past", !!z && !!first && !first.contains(z));
  };
  addEventListener("resize", onScroll, { passive: true });
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Lien actif selon la section visible */
  const links = $$(".nav__links a");
  const secObs = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  // toutes les sections : celles sans lien (galerie, expérience…) effacent l'état actif
  $$("main > section").forEach((s) => secObs.observe(s));

  /* Menu mobile */
  const burger = $("#burger");
  const drawer = $("#drawer");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    drawer.setAttribute("aria-hidden", !open);
  };
  burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $$("a", drawer).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* ---------------- Reveals au scroll ---------------- */
  const io = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
  $$(".reveal, .reveal-img, .pizza-grid .pcard").forEach((el, i) => {
    // léger décalage pour les éléments d'une même rangée
    if (el.classList.contains("pcard") || el.classList.contains("exp__item") || el.closest(".gal")) {
      const sibs = [...el.parentElement.children];
      el.style.transitionDelay = `${(sibs.indexOf(el) % 4) * 90}ms`;
    }
    io.observe(el);
  });

  /* ---------------- Parallax léger (desktop uniquement) ---------------- */
  const px = $$("[data-parallax]");
  if (!reduce && matchMedia("(min-width: 961px) and (pointer: fine)").matches && px.length) {
    let ticking = false;
    const run = () => {
      const vh = innerHeight;
      px.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const off = (r.top + r.height / 2 - vh / 2) * -parseFloat(el.dataset.parallax);
        el.style.translate = `0 ${off.toFixed(1)}px`;
      });
      ticking = false;
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
    run();
  }

  /* ---------------- Feedback CTA commande ---------------- */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-order]");
    if (!b) return;
    b.classList.remove("is-pressed");
    void b.offsetWidth;
    b.classList.add("is-pressed");
  });

  /* ---------------- Intro du hero ---------------- */
  const start = () => requestAnimationFrame(() => document.body.classList.add("is-loaded"));
  const heroImg = $(".hx__dish");
  const boot = () => {
    if (!heroImg || heroImg.complete) start();
    else { heroImg.addEventListener("load", start, { once: true }); setTimeout(start, 1200); }
  };
  // l'animation du hero attend la fin de l'intro
  if (document.documentElement.classList.contains("has-intro")) addEventListener("intro:done", boot, { once: true });
  else boot();

  /* ---------------- iPhone de l'itinéraire ----------------
     Sa place : à droite des horaires (#mapSlot). Sur ordinateur il attend d'abord dans la place vide
     à gauche des suppléments des chapatis (#mapDock), puis descend en ligne droite jusqu'à sa place
     pendant le défilement, et ne s'allume qu'en y arrivant. Il vit dans <body> (position absolue)
     pour ne pas être coupé par les sections qu'il traverse. */
  const mapPh = $("#mapPhone"), mapSlot = $("#mapSlot"), mapDock = $("#mapDock"), hoursBox = $(".hours");
  if (mapPh && mapSlot) {
    const scr = $("#mapScreen"), dev = mapSlot.parentElement;
    const desk = matchMedia("(min-width: 961px)");
    document.body.append(mapPh);
    mapPh.classList.add("is-floating");
    let m = null, lit = true, raf = 0;
    const power = (on) => {
      if (on === lit) return;
      lit = on;
      scr.classList.toggle("is-off", !on);
      if (on && !reduce) { scr.classList.remove("is-wake"); void scr.offsetWidth; scr.classList.add("is-wake"); }
    };
    power(false);
    const supp = $("#chapatiSupp");
    let fly = false;
    const find = $(".find"), info = $(".find__info"), hList = $("#hoursList"), flist = $(".find__list");
    const measure = () => {
      // ordinateur : sa place est dans le vert, juste à droite des horaires et à leur hauteur
      dev.style.marginTop = ""; dev.style.marginLeft = ""; find.style.backgroundPosition = ""; flist.style.maxWidth = "";
      if (desk.matches && hoursBox && hList) {
        const h = hoursBox.getBoundingClientRect(), l = hList.getBoundingClientRect(), d = mapSlot.getBoundingClientRect();
        // un peu plus à droite et un peu plus bas que les horaires (sans sortir de l'écran)
        const gx = Math.min(l.right + 136, innerWidth - 32 - d.width);
        dev.style.marginTop = `${Math.max(0, Math.round(h.top + h.height / 2 + 70 - (d.top + d.height / 2)))}px`;
        dev.style.marginLeft = `${Math.round(gx - d.left)}px`;
        // les lignes de la liste s'arrêtent avant l'iPhone
        flist.style.maxWidth = `${Math.round(l.right + 28 - flist.getBoundingClientRect().left)}px`;
        // la photo 33 glisse vers la droite pour que le vert continue derrière l'iPhone (à gauche : son vert exact)
        const f = find.getBoundingClientRect(), right = gx + d.width + 70;
        const photoW = f.height * 1308 / 736, x = Math.max(0, (f.width - 1320) / 2) - 100;   // position de base (CSS)
        if (x + photoW * .43 < right) find.style.backgroundPosition = `${Math.round(right - photoW * .43)}px top`;
      }
      fly = !!mapDock && !reduce && desk.matches && mapDock.offsetHeight > 0;
      if (!fly && supp) supp.style.opacity = "";
      if (!fly && info) info.style.opacity = "";
      m = true;
    };
    const update = () => {
      raf = 0;
      if (!m) return;
      // positions lues à chaque image : le téléphone suit toujours sa place, même si la page bouge
      const sy = scrollY, r = mapSlot.getBoundingClientRect();
      let x = r.left, y = r.top + sy, k = 1, p = 1;
      if (fly) {
        const d = mapDock.getBoundingClientRect(), max = document.documentElement.scrollHeight - innerHeight - 1;
        const s0 = d.top + sy + d.height / 2 - innerHeight / 2;              // place vide au milieu de l'écran
        // arrivé quand sa place est au milieu de l'écran, au plus tard quand le bas du vert touche le bas de l'écran
        const s1 = Math.min(max, r.top + sy + r.height / 2 - innerHeight / 2, find.getBoundingClientRect().bottom + sy - innerHeight);
        if (s1 > s0 + 50) {
          p = Math.min(1, Math.max(0, (sy - s0) / (s1 - s0)));
          // trajet en ligne droite « ↘ » ; les suppléments s'effacent, le texte de « Retrouvez-nous »
          // n'apparaît qu'à l'arrivée de l'iPhone (rien ne passe dessous)
          const e = (p + p * p * (3 - 2 * p)) / 2;
          const dk = d.height / r.height, x0 = d.left + (d.width - r.width * dk) / 2, y0 = d.top + sy;
          x = x0 + (r.left - x0) * e; y = y0 + (r.top + sy - y0) * e; k = dk + (1 - dk) * e;
          if (supp) supp.style.opacity = Math.max(0, 1 - p / .18).toFixed(3);
          if (info) info.style.opacity = Math.min(1, Math.max(0, p - .9) / .08).toFixed(3);
          power(p >= .97 ? true : p < .6 ? false : lit);
        }
        mapPh._s1 = s1;
      } else if (desk.matches || reduce) {
        // pas de trajet : il s'allume dès qu'il est bien visible
        if (r.top > -r.height * .45 && r.top + r.height * .55 < innerHeight) power(true);
      }
      mapPh.classList.toggle("is-flying", p < 1);
      mapPh.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${k.toFixed(4)})`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const setup = () => { measure(); update(); };
    setup();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", setup);
    addEventListener("load", setup);
    document.fonts?.ready.then(setup);
    if (window.ResizeObserver) new ResizeObserver(setup).observe(document.body);
    // téléphone / tablette : allumé dès qu'il apparaît à l'écran
    new IntersectionObserver((en) => { if (!desk.matches && en[0].intersectionRatio >= .55) power(true); }, { threshold: [.55] }).observe(mapSlot);
    // toucher l'écran éteint : on descend jusqu'à sa place
    $("#mapOff").addEventListener("click", () => {
      if (fly && mapPh._s1) scrollTo({ top: mapPh._s1, behavior: reduce ? "auto" : "smooth" }); else power(true);
    });
  }

  /* ---------------- Page 1 : 3 plats en « /\ » + suppléments (vrais prix de menu-data.js) ----------------
     Le plat du sommet est le plat choisi. Les 3 plats tournent le long du « /\ » ; un clic sur un plat l'amène au sommet.
     L'ajout va dans le même panier que l'iPhone de commande (window.HCOrder, défini par order.js). */
  if ($("#hxArc")) {
    const nb = (n) => n.toLocaleString("fr-FR").replace(/\u202f/g, "\u00a0");
    const da2 = (n) => `${nb(n)}\u00a0DA`;
    const iPz = D.pizzas.findIndex((x) => x.name === "Pizza Maison");
    const iCh = D.chapatiS2.findIndex((x) => x.name === "Chapati S-2 Mixte");
    const iBo = D.bowls.findIndex((x) => x.name === "Bol Poutine Mixte");
    const pz = D.pizzas[iPz], ch = D.chapatiS2[iCh], bo = D.bowls[iBo];
    const DISH = {
      chapati: { id: `s2-${iCh}`, name: ch.name, desc: ch.desc, from: da2(ch.price), photo: "chapati-frites", price: ch.price, supps: D.supplementsS2 },
      pizza: { id: `pizza-${iPz}`, name: pz.name, desc: pz.desc, from: `dès ${da2(pz.prices[0])}`, photo: "pizza-ronde", sizes: D.pizzaSizes.map((l, k) => ({ label: l, price: pz.prices[k] })), supps: D.supplementsPizza },
      bol: { id: `bol-${iBo}`, name: bo.name, desc: `Base ${bo.base.toLowerCase()}, garniture ${bo.prot.toLowerCase()}.`, from: `dès ${da2(bo.prices[0])}`, photo: "bol-rond", sizes: D.bowlSizes.map((l, k) => ({ label: l, price: bo.prices[k] })), supps: D.supplementsBol || [] }
    };
    const KEYS = ["chapati", "pizza", "bol"];
    const btns = Object.fromEntries($$(".hx__d").map((b) => [b.dataset.key, b]));
    let sel = 1, busy = false;
    KEYS.forEach((k, i) => btns[k].classList.toggle("is-on", i === sel));

    /* Un seul plat visible, il ne change que si on glisse (pas de défilement automatique).
       Les plats suivent le doigt : on glisse vers la gauche, l'ancien plat descend vers le bas à gauche
       et disparaît, le nouveau sort du vide en bas à droite et monte se poser au milieu (« /\ » ensemble).
       Vers la droite : le même mouvement en miroir. */
    const C = "translate(-50%, -50%)";
    const far = (side) => `${C} translate(${side * 78}%, 78%) scale(.5) rotate(${side * 25}deg)`;   // en bas, à gauche (-1) ou à droite (+1)
    const mid = `${C} translate(0, 0) scale(1) rotate(0deg)`;
    const swap = (from, to, dir) => {
      const a = btns[KEYS[from]], b = btns[KEYS[to]];
      a.classList.remove("is-on"); b.classList.add("is-on");
      if (reduce || !a.animate) return;
      const opt = { duration: 1000, easing: "cubic-bezier(.5, 0, .25, 1)" };
      busy = true;
      a.classList.add("is-moving");
      a.animate([{ transform: mid, opacity: 1 }, { transform: far(-dir), opacity: 0 }], opt).finished.finally(() => a.classList.remove("is-moving"));
      b.animate([{ transform: far(dir), opacity: 0 }, { transform: mid, opacity: 1 }], opt).finished.finally(() => { busy = false; });
    };
    // suppléments en icônes sous le nom du plat (le bol n'a pas de suppléments : on montre ses tailles)
    const ICON = (n) => /frite/i.test(n) ? "🍟" : /poulet/i.test(n) ? "🍗" : /viande/i.test(n) ? "🥩" : /champignon/i.test(n) ? "🍄" : "🧀";
    const supps = $("#hxSupps");
    const render = () => {
      const d = DISH[KEYS[sel]];
      $("#hxName").textContent = d.name;
      $("#hxFrom").textContent = d.from;
      supps.classList.add("is-swap");
      setTimeout(() => {
        supps.innerHTML = d.supps.length
          ? d.supps.map((s) => `<li><i aria-hidden="true">${ICON(s.name)}</i><span>${esc(s.name)}</span><b>+${da2(s.price)}</b></li>`).join("")
          : d.sizes.map((s) => `<li><i aria-hidden="true">🥣</i><span>Taille ${esc(s.label)}</span><b>${da2(s.price)}</b></li>`).join("");
        supps.setAttribute("aria-label", d.supps.length ? `Suppléments : ${d.name}` : `Tailles : ${d.name}`);
        supps.classList.remove("is-swap");
      }, supps.innerHTML ? 220 : 0);
    };

    const go = (k, dir = 1) => {
      if (busy) return;
      const next = (k + 3) % 3;
      if (next === sel) return;
      swap(sel, next, dir); sel = next; render();
    };
    // swipe (doigt ou souris) : vers la gauche = plat suivant (il arrive de la droite)
    const arc = $("#hxArc");
    let x0 = null;
    arc.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
    arc.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) dx < 0 ? go(sel + 1, 1) : go(sel - 1, -1);
    });
    arc.addEventListener("pointercancel", () => { x0 = null; });
    addEventListener("keydown", (e) => {
      if (!["ArrowLeft", "ArrowRight"].includes(e.key) || !$(".hx").matches(":hover, :focus-within")) return;
      e.key === "ArrowRight" ? go(sel + 1, 1) : go(sel - 1, -1);
    });
    render();
  }

  /* ---------------- iPhone de commande : posé à droite de la page 1, il rejoint sa place
     en page 2 pendant le défilement et s'allume en arrivant (on touche le logo pour commander) ---------------- */
  const ph = $(".spec__phone"), phOff = $("#mphoneOff");
  if (ph && phOff) {
    const lowEls = $$(".hx__cap, .hx__supps, .hx__hint");
    const scr = $("#mphoneScreen"), dock = $("#hxDock"), frame = $(".hx__frame"), page2 = $(".spec__content");
    const desk = matchMedia("(min-width: 961px)");
    let m = null, lit = true, raf = 0;
    const power = (on) => {
      if (on === lit) return;
      lit = on;
      scr.classList.toggle("is-off", !on);
      if (on && !reduce) { scr.classList.remove("is-wake"); void scr.offsetWidth; scr.classList.add("is-wake"); }
    };
    power(false);
    const measure = () => {
      ph.style.transform = ""; ph.classList.remove("is-flying");
      if (frame) frame.style.opacity = "";
      if (page2) page2.style.opacity = "";
      lowEls.forEach((el) => { el.style.opacity = ""; });
      m = null;
      if (!dock || reduce || !desk.matches || !dock.offsetHeight) return;
      const g = ph.parentElement, sy = scrollY;
      const stick = parseFloat(getComputedStyle(ph).top) || 0;
      // place naturelle du téléphone en page 2 (en haut de sa grille), avant qu'il ne se colle
      const top = g.getBoundingClientRect().top + sy + parseFloat(getComputedStyle(g).paddingTop);
      m = { top, stick, left: ph.getBoundingClientRect().left, end: top - stick };
      if (m.end <= 0) m = null;
    };
    const update = () => {
      raf = 0;
      if (!m) return;
      // trajet en ligne droite, en diagonale vers le bas et la gauche (↙), sur tout le défilement jusqu'à la page 2
      const s = scrollY, p = Math.min(1, Math.max(0, s / m.end)), e = (p + p * p * (3 - 2 * p)) / 2;
      // la page 1 s'efface doucement ; le texte de la page 2 n'apparaît qu'une fois l'iPhone posé (rien ne passe dessous)
      if (frame) frame.style.opacity = Math.max(0, 1 - p / .24).toFixed(3);
      // le nom du plat et ses icônes (sur le chemin de l'iPhone) partent en premier
      lowEls.forEach((el) => { el.style.opacity = Math.max(0, 1 - p / .06).toFixed(3); });
      if (page2) page2.style.opacity = Math.min(1, Math.max(0, p - .85) / .15).toFixed(3);
      if (p >= 1) { ph.style.transform = ""; ph.classList.remove("is-flying"); }
      else {
        ph.classList.add("is-flying");
        // départ : la place vide de la page 1 (lue à chaque image, elle suit le cadre)
        const d = dock.getBoundingClientRect(), k = d.height / ph.offsetHeight;
        const x0 = d.left + (d.width - ph.offsetWidth * k) / 2, y0 = d.top + s;
        const x = (x0 - m.left) * (1 - e), y = (y0 - m.top) * (1 - e);
        ph.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${(k + (1 - k) * e).toFixed(4)})`;
      }
      power(p >= .97 ? true : p < .6 ? false : lit);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const setup = () => { measure(); if (m) update(); };
    setup();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", setup);
    addEventListener("load", setup);
    document.fonts?.ready.then(setup);
    if (dock && window.ResizeObserver) new ResizeObserver(onScroll).observe(dock.parentElement);
    // téléphone (ou mouvement réduit) : pas de voyage, il s'allume dès qu'il est bien visible
    new IntersectionObserver((en) => { if (!m && en[0].intersectionRatio >= .55) power(true); }, { threshold: [.55] }).observe(ph);
    // « Commander » / toucher l'écran éteint : on descend jusqu'à ce que l'iPhone soit à sa place
    const dockPhone = (e) => {
      if (!m) { power(true); return; }
      e?.preventDefault();
      scrollTo({ top: m.end, behavior: reduce ? "auto" : "smooth" });
    };
    phOff.addEventListener("click", dockPhone);
    $$('a[href="#chapati"]').forEach((a) => a.addEventListener("click", (e) => { if (m) dockPhone(e); }));
  }

  /* ---------------- Horaires (heure d'Alger) ---------------- */
  const hoursList = $("#hoursList");
  if (hoursList) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
      timeZone: "Africa/Algiers", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date()).map((x) => [x.type, x.value]));
    const today = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.weekday);
    const now = +parts.hour * 60 + +parts.minute;
    const toMin = (t) => { const [h, mn] = t.split(":"); return +h * 60 + +mn; };
    const open = toMin(hoursList.dataset.open), close = toMin(hoursList.dataset.close);
    const items = $$("li", hoursList);
    const isOpenDay = (d) => !items.find((li) => +li.dataset.day === d)?.classList.contains("is-off");
    items.forEach((li) => li.classList.toggle("is-today", +li.dataset.day === today));
    const status = $("#hoursStatus");
    const NAMES = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
    if (isOpenDay(today) && now >= open && now < close) {
      status.textContent = `Ouvert maintenant · ferme à ${hoursList.dataset.close}`;
      status.classList.add("is-open");
    } else {
      // prochaine ouverture
      let d = today, label = "";
      if (isOpenDay(today) && now < open) label = "aujourd'hui";
      else {
        for (let k = 1; k <= 7; k++) { d = (today + k) % 7; if (isOpenDay(d)) break; }
        label = d === (today + 1) % 7 ? "demain" : NAMES[d];
      }
      status.textContent = `Fermé · ouvre ${label} à ${hoursList.dataset.open}`;
      status.classList.add("is-closed");
    }
    status.hidden = false;
  }

  $("#year").textContent = new Date().getFullYear();
})();
