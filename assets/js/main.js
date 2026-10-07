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
  const suppBox = (groups) => `
      <div class="supbox${groups.length > 1 ? " supbox--2" : ""} reveal">
        <h3 class="supbox__title">Suppléments <small>à ajouter à votre commande</small></h3>
        <div class="supbox__cols">${groups.map(([t, arr]) => `
          <div>${t ? `<p class="supbox__sub">${t}</p>` : ""}
            <ul>${arr.map((x) => `<li><span>${esc(x.name)}</span><b>+${x.price} DA</b></li>`).join("")}</ul>
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
    const mid = nav.offsetHeight / 2;
    const z = zones.find((el) => { const r = el.getBoundingClientRect(); return r.top <= mid && r.bottom > mid; });
    if (z) nav.dataset.theme = (innerWidth <= 960 && z.dataset.navMobile) || z.dataset.nav;
    // sur la photo de la page 1 : aucun fond ; plus bas : léger voile pour garder les liens lisibles
    nav.classList.toggle("is-past", !!z && z !== zones[0]);
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
  const heroImg = $(".hero__pic img");
  const boot = () => {
    if (!heroImg || heroImg.complete) start();
    else { heroImg.addEventListener("load", start, { once: true }); setTimeout(start, 1200); }
  };
  // l'animation du hero attend la fin de l'intro « lampe torche »
  if (document.documentElement.classList.contains("has-intro")) addEventListener("intro:done", boot, { once: true });
  else boot();

  /* ---------------- iPhone de la carte aligné sur les horaires (ordinateur) ---------------- */
  const dev = $(".find__device"), phoneEl = $(".find__device .iphone"), hoursBox = $(".hours");
  if (dev && phoneEl && hoursBox) {
    const alignPhone = () => {
      dev.style.marginTop = "";
      if (innerWidth <= 1280) return;           // téléphone / tablette : l'iPhone reste sous le texte
      const h = hoursBox.getBoundingClientRect(), d = dev.getBoundingClientRect();
      const gap = h.top + h.height / 2 - (d.top + phoneEl.offsetTop + phoneEl.offsetHeight / 2);
      dev.style.marginTop = `${Math.max(0, Math.round(gap))}px`;
    };
    addEventListener("resize", alignPhone, { passive: true });
    addEventListener("load", alignPhone);
    document.fonts?.ready.then(alignPhone);
    alignPhone();
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
